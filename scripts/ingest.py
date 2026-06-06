"""Ingestion script to process and index PDF/TXT files in ChromaDB."""

import os
import sys
from uuid import uuid4

# Ensure the working directory is the project root (one level up from this script)
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
os.chdir(project_root)

# Add the apps/api folder to sys.path so we can import from app
sys.path.append(os.path.join(project_root, "apps/api"))

try:
    from app.rag_service import extract_text_from_pdf, extract_text_from_txt, chunk_text
    from app.chroma_client import store_chunk
    from app.ollama_client import generate_embedding
    from app.models import Chunk
except ImportError as e:
    print(f"Error importing app modules: {e}")
    print("Ensure you are running the script from the project root directory.")
    sys.exit(1)


def ingest_file(filepath: str) -> int:
    """Process a single document, extract text, chunk it, embed it, and store in ChromaDB."""
    filename = os.path.basename(filepath)
    print(f"\nProcessing document: {filename}")

    # Extract text content
    try:
        if filepath.lower().endswith(".pdf"):
            text = extract_text_from_pdf(filepath)
        elif filepath.lower().endswith(".txt"):
            text = extract_txt_text_fallback(filepath)
        else:
            print(f"Skipping unsupported file type: {filename}")
            return 0
    except Exception as e:
        print(f"Error extracting text from {filename}: {e}")
        return 0

    if not text.strip():
        print(f"Warning: Extracted text is empty for {filename}. Skipping.")
        return 0

    print(f"Extracted {len(text)} characters.")

    # Segment text into overlapping chunks
    chunks = chunk_text(text, chunk_size=500, overlap=50)
    print(f"Segmented into {len(chunks)} chunks.")

    # Embed and save to ChromaDB
    chunks_stored = 0
    for idx, chunk_text_content in enumerate(chunks):
        if not chunk_text_content.strip():
            continue

        try:
            # Generate embedding vector
            embedding = generate_embedding(chunk_text_content)
            
            # Construct chunk model
            chunk = Chunk(
                id=str(uuid4()),
                text=chunk_text_content,
                embedding=embedding,
                metadata={"source": filename}
            )

            # Store in vector store
            store_chunk(chunk)
            chunks_stored += 1

            if (idx + 1) % 5 == 0 or (idx + 1) == len(chunks):
                print(f"  Indexed {idx + 1}/{len(chunks)} chunks...")
        except Exception as e:
            print(f"  Error indexing chunk {idx}: {e}")

    print(f"Successfully indexed {chunks_stored}/{len(chunks)} chunks for {filename}")
    return chunks_stored


def extract_txt_text_fallback(filepath: str) -> str:
    """Helper to extract text from TXT with multiple encoding fallbacks."""
    try:
        with open(filepath, "r", encoding="utf-8") as f:
            return f.read()
    except UnicodeDecodeError:
        with open(filepath, "r", encoding="latin-1") as f:
            return f.read()


def main():
    docs_folder = "data/raw-docs"
    
    if not os.path.exists(docs_folder):
        print(f"Error: Raw documents folder '{docs_folder}' does not exist.")
        sys.exit(1)

    files = [
        f for f in os.listdir(docs_folder)
        if f.lower().endswith(".pdf") or f.lower().endswith(".txt")
    ]

    if not files:
        print(f"No PDF or TXT files found in '{docs_folder}'.")
        print("Please place some documents there and run the script again.")
        return

    print(f"Found {len(files)} files to ingest. Starting vector database insertion...")

    total_chunks = 0
    for filename in files:
        filepath = os.path.join(docs_folder, filename)
        total_chunks += ingest_file(filepath)

    print(f"\nIngestion pipeline run complete! Successfully indexed {total_chunks} total chunks in ChromaDB.")


if __name__ == "__main__":
    main()
