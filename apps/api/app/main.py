"""FastAPI application entrypoint for the Local RAG Backend."""

import os
import shutil
import requests
import uuid
from dotenv import load_dotenv

# Load .env from the repository root (two levels above this file)
load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), "../../../.env"))
from typing import List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from .calculator import router as calc_router

from .models import ChatRequest, ChatResponse, Source, Chunk
from .exceptions import ServiceUnavailable, PDFParseError
from .ollama_client import generate_embedding, generate_response
from .chroma_client import get_or_create_collection, store_chunk, query_chunks, clear_collection
from .rag_service import chunk_text, extract_text_from_pdf, extract_text_from_txt

app = FastAPI(title="Local RAG API", description="Orchestration API for local document RAG")
app.include_router(calc_router)

# Configure CORS Middleware to allow cross-origin requests from Next.js (port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the exact domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    """Simple status check to verify the API is active."""
    return {"message": "RAG API running"}


@app.get("/health")
def health_check():
    """
    Perform a live health check on downstream services.
    Verifies connection to local Ollama server and ChromaDB.
    """
    # Check Ollama status
    ollama_status = "offline"
    try:
        response = requests.get("http://localhost:11434/", timeout=2)
        if response.status_code == 200:
            ollama_status = "online"
    except Exception:
        pass

    # Check ChromaDB status
    chroma_status = "offline"
    try:
        get_or_create_collection()
        chroma_status = "online"
    except Exception:
        pass

    status = "online"
    if ollama_status == "offline" or chroma_status == "offline":
        status = "degraded"
    if ollama_status == "offline" and chroma_status == "offline":
        status = "offline"

    return {
        "status": status,
        "ollama_status": ollama_status,
        "chroma_status": chroma_status
    }


@app.get("/documents", response_model=List[str])
def list_documents():
    """
    Scans ChromaDB and the raw-docs directory to fetch a list
    of unique document names currently ingested.
    """
    unique_sources = set()

    # 1. Fetch metadata sources from active ChromaDB chunks
    try:
        collection = get_or_create_collection()
        results = collection.get(include=["metadatas"])
        if results and results.get("metadatas"):
            for meta in results["metadatas"]:
                if meta and "source" in meta:
                    unique_sources.add(meta["source"])
    except Exception:
        # Silent pass, fallback to file directory scan
        pass

    # 2. Add files physically present in data/raw-docs folder
    try:
        raw_docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/raw-docs"))
        if os.path.exists(raw_docs_dir):
            for file in os.listdir(raw_docs_dir):
                if file.lower().endswith(('.pdf', '.txt')):
                    unique_sources.add(file)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to scan raw files: {str(e)}")

    return sorted(list(unique_sources))


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    """
    Q&A endpoint. 
    1. Embeds the user question using Ollama
    2. Queries ChromaDB for the top 3 relevant chunks
    3. Prompts local LLM using the chunks as context
    4. Returns answer + document citations
    """
    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty.")

    try:
        # Generate question embedding
        question_embedding = generate_embedding(request.question)

        # Retrieve matching chunks
        results = query_chunks(question_embedding, n_results=3)

        if not results:
            return ChatResponse(
                answer="No relevant local documents found. Please ingest some documents first.",
                sources=[]
            )

        # Prepare context and references list
        context_parts = []
        sources = []
        for res in results:
            context_parts.append(res["text"])
            src_name = res["metadata"].get("source", "Unknown Document") if res.get("metadata") else "Unknown Document"
            sources.append(Source(text=res["text"], source=src_name))

        # Build local augmented prompt
        context = "\n\n".join(context_parts)
        prompt = f"""You are a helpful assistant.

Answer the question ONLY using the provided local document context. If the context does not contain the answer, politely state that you do not know.

Context:
{context}

Question:
{request.question}

Answer:"""

        # Ask local Ollama LLM
        answer = generate_response(prompt)

        return ChatResponse(answer=answer, sources=sources)

    except ServiceUnavailable as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected RAG error occurred: {str(e)}")


@app.post("/upload")
def upload_file(file: UploadFile = File(...)):
    """
    Endpoint to dynamically upload a file.
    Saves file to data/raw-docs, chunks it, embeds it, and stores in ChromaDB.
    """
    filename = file.filename
    if not filename.lower().endswith(('.pdf', '.txt')):
        raise HTTPException(status_code=400, detail="Unsupported file format. Only PDF and TXT are supported.")

    # Configure folder path
    raw_docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/raw-docs"))
    os.makedirs(raw_docs_dir, exist_ok=True)
    filepath = os.path.join(raw_docs_dir, filename)

    # 1. Save uploaded file to disk
    try:
        with open(filepath, "wb") as f:
            shutil.copyfileobj(file.file, f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write file to disk: {str(e)}")

    # 2. Extract, chunk, embed, and ingest
    try:
        if filepath.lower().endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        else:
            text = extract_text_from_txt(filepath)

        if not text.strip():
            raise HTTPException(status_code=400, detail="Document text extraction yielded no readable text.")

        chunks = chunk_text(text, chunk_size=500, overlap=50)
        chunks_stored = 0

        for chunk_text_content in chunks:
            if not chunk_text_content.strip():
                continue

            # Compute embedding
            embedding = generate_embedding(chunk_text_content)

            # Construct chunk model
            chunk = Chunk(
                id=str(uuid.uuid4()),
                text=chunk_text_content,
                embedding=embedding,
                metadata={"source": filename}
            )

            # Store in Chroma
            store_chunk(chunk)
            chunks_stored += 1

        return {
            "message": "File indexed successfully.",
            "filename": filename,
            "chunks_created": chunks_stored
        }

    except PDFParseError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except ServiceUnavailable as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ingestion failed: {str(e)}")


@app.post("/clear")
def clear_vector_store():
    """
    Clears all documents from ChromaDB and physically deletes
    all document files inside the raw-docs folder.
    """
    try:
        # Wipe ChromaDB collection
        clear_collection()

        # Wipe files from data/raw-docs/
        raw_docs_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../data/raw-docs"))
        if os.path.exists(raw_docs_dir):
            for file in os.listdir(raw_docs_dir):
                filepath = os.path.join(raw_docs_dir, file)
                if os.path.isfile(filepath):
                    os.remove(filepath)

        return {"message": "Knowledge base collection and local file directory cleared successfully."}
    except ServiceUnavailable as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database wipe failed: {str(e)}")
