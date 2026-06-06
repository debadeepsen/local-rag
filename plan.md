# Complete Local RAG Setup Guide

## Goal

Build a fully local Retrieval-Augmented Generation (RAG) system using:

* Ollama
* FastAPI + Python
* ChromaDB
* Next.js
* Express.js document server

Everything runs locally on your PC.

---

# Architecture

```text
┌──────────────────────┐
│     Next.js UI       │
│  Chat + Sources UI   │
└──────────┬───────────┘
           │ HTTP
           ▼
┌──────────────────────┐
│      FastAPI         │
│  RAG Orchestrator    │
│                      │
│ - ingest documents   │
│ - chunk text         │
│ - create embeddings  │
│ - query Chroma       │
│ - build prompts      │
└───────┬───────┬──────┘
        │       │
        │       │
        ▼       ▼
┌────────────┐  ┌──────────────┐
│  Ollama    │  │   ChromaDB   │
│            │  │              │
│ LLM        │  │ embeddings   │
│ embeddings │  │ metadata     │
└────────────┘  └──────────────┘

Documents:
┌────────────────────┐
│   Express Server   │
│ serves PDFs/TXT    │
└────────────────────┘
```

---

# Step 1 — Install Ollama

Install Ollama:

[https://ollama.com/download](https://ollama.com/download)

Then pull models:

```bash
ollama pull qwen3:8b
ollama pull nomic-embed-text
```

Test:

```bash
ollama run qwen3:8b
```

---

# Step 2 — Create Monorepo

```bash
mkdir local-rag
cd local-rag
```

---

# Step 3 — Create Folder Structure

```bash
mkdir -p apps/frontend
mkdir -p apps/api
mkdir -p apps/docs-server
mkdir -p data/raw-docs
mkdir -p data/chroma
mkdir -p scripts
```

Final structure:

```text
local-rag/
├── apps/
│   ├── frontend/
│   ├── api/
│   └── docs-server/
│
├── data/
│   ├── raw-docs/
│   └── chroma/
│
└── scripts/
```

---

# Step 4 — Create FastAPI Backend

Go to backend:

```bash
cd apps/api
```

## Create Virtual Environment

### Windows

```bash
python -m venv venv
venv\Scripts\activate
```

### Mac/Linux

```bash
python3 -m venv venv
source venv/bin/activate
```

---

# Install Packages

```bash
pip install "chromadb>=1.0.0" fastapi uvicorn requests pypdf
```

---

# Step 5 — Create Backend Files

```text
apps/api/
├── app/
│   ├── main.py
│   ├── rag.py
│   ├── chroma_client.py
│   └── ollama_client.py
│
└── requirements.txt
```

---

# ollama_client.py

```python
import requests

OLLAMA_URL = "http://localhost:11434"


def generate_embedding(text: str):
    response = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={
            "model": "nomic-embed-text",
            "prompt": text
        }
    )

    return response.json()["embedding"]



def generate_response(prompt: str):
    response = requests.post(
        f"{OLLAMA_URL}/api/generate",
        json={
            "model": "qwen3:8b",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]
```

---

# chroma_client.py

```python
import chromadb

client = chromadb.PersistentClient(
    path="../../../data/chroma"
)

collection = client.get_or_create_collection(
    name="documents"
)
```

---

# rag.py

```python
from app.ollama_client import (
    generate_embedding,
    generate_response
)

from app.chroma_client import collection



def search_documents(question: str):

    question_embedding = generate_embedding(question)

    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=3
    )

    return results



def build_prompt(question: str, docs):

    context = "\n\n".join(docs)

    prompt = f"""
You are a helpful assistant.

Answer ONLY from the provided context.

Context:
{context}

Question:
{question}
"""

    return prompt



def ask_question(question: str):

    results = search_documents(question)

    documents = results["documents"][0]

    prompt = build_prompt(
        question,
        documents
    )

    answer = generate_response(prompt)

    return {
        "answer": answer,
        "sources": documents
    }
```

---

# main.py

```python
from fastapi import FastAPI
from pydantic import BaseModel

from app.rag import ask_question

app = FastAPI()


class ChatRequest(BaseModel):
    question: str


@app.get("/")
def root():
    return {"message": "RAG API running"}


@app.post("/chat")
def chat(req: ChatRequest):

    result = ask_question(req.question)

    return result
```

---

# Step 6 — Create Ingestion Script

Go back to root:

```bash
cd ../../
```

---

# scripts/ingest.py

```python
import os
from uuid import uuid4

import chromadb
import requests

from pypdf import PdfReader


OLLAMA_URL = "http://localhost:11434"

CHUNK_SIZE = 500
CHUNK_OVERLAP = 50


client = chromadb.PersistentClient(
    path="../data/chroma"
)

collection = client.get_or_create_collection(
    name="documents"
)



def get_embedding(text: str):

    response = requests.post(
        f"{OLLAMA_URL}/api/embeddings",
        json={
            "model": "nomic-embed-text",
            "prompt": text
        }
    )

    return response.json()["embedding"]



def chunk_text(text: str):

    chunks = []

    start = 0

    while start < len(text):

        end = start + CHUNK_SIZE

        chunk = text[start:end]

        chunks.append(chunk)

        start += CHUNK_SIZE - CHUNK_OVERLAP

    return chunks



def extract_pdf_text(filepath):

    reader = PdfReader(filepath)

    text = ""

    for page in reader.pages:
        text += page.extract_text()

    return text



def ingest_file(filepath):

    print(f"Ingesting: {filepath}")

    text = extract_pdf_text(filepath)

    chunks = chunk_text(text)

    for chunk in chunks:

        embedding = get_embedding(chunk)

        collection.add(
            ids=[str(uuid4())],
            embeddings=[embedding],
            documents=[chunk],
            metadatas=[
                {
                    "source": os.path.basename(filepath)
                }
            ]
        )



def main():

    docs_folder = "../data/raw-docs"

    for filename in os.listdir(docs_folder):

        if filename.endswith(".pdf"):

            filepath = os.path.join(
                docs_folder,
                filename
            )

            ingest_file(filepath)


if __name__ == "__main__":
    main()
```

---

# Step 7 — Start Backend

Go to API folder:

```bash
cd apps/api
```

Run:

```bash
uvicorn app.main:app --reload
```

Test:

```text
http://localhost:8000
```

---

# Step 8 — Add Documents

Put PDFs into:

```text
data/raw-docs/
```

Example:

```text
employee-handbook.pdf
vacation-policy.pdf
```

---

# Step 9 — Run Ingestion

From root:

```bash
python scripts/ingest.py
```

You should see:

```text
Ingesting: employee-handbook.pdf
```

---

# Step 10 — Test API

Use Postman or curl:

```bash
curl -X POST http://localhost:8000/chat \
-H "Content-Type: application/json" \
-d "{\"question\":\"What is the leave policy?\"}"
```

---

# Expected Response

```json
{
  "answer": "Employees receive 20 annual leave days...",
  "sources": [
    "...chunk text..."
  ]
}
```

---

# Step 11 — Create Next.js Frontend

Go to frontend folder:

```bash
cd apps/frontend
```

Create app:

```bash
npx create-next-app@latest .
```

Choose:

* TypeScript → Yes
* Tailwind → Yes
* App Router → Yes

---

# Install Axios

```bash
npm install axios
```

---

# app/page.tsx

```tsx
'use client'

import { useState } from 'react'
import axios from 'axios'

export default function Home() {

  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')

  async function askQuestion() {

    const res = await axios.post(
      'http://localhost:8000/chat',
      {
        question
      }
    )

    setAnswer(res.data.answer)
  }

  return (
    <main className="p-10 max-w-3xl mx-auto">

      <h1 className="text-4xl font-bold mb-6">
        Local RAG
      </h1>

      <textarea
        className="border p-4 w-full"
        rows={4}
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button
        onClick={askQuestion}
        className="bg-black text-white px-4 py-2 mt-4"
      >
        Ask
      </button>

      <div className="mt-8 whitespace-pre-wrap">
        {answer}
      </div>

    </main>
  )
}
```

---

# Step 12 — Run Frontend

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Step 13 — Create Express Docs Server

Go to docs server:

```bash
cd ../docs-server
```

---

# Init Node App

```bash
npm init -y
npm install express cors
```

---

# server.js

```javascript
const express = require('express')
const cors = require('cors')
const path = require('path')

const app = express()

app.use(cors())

app.use(
  '/docs',
  express.static(
    path.join(__dirname, '../../data/raw-docs')
  )
)

app.listen(3001, () => {
  console.log('Docs server running on 3001')
})
```

---

# Run Docs Server

```bash
node server.js
```

Test:

```text
http://localhost:3001/docs/employee-handbook.pdf
```

---

# Recommended Ports

```text
Next.js      :3000
Express      :3001
FastAPI      :8000
Ollama       :11434
```

---

# How RAG Actually Works

A RAG system fundamentally does:

1. Read documents
2. Split into chunks
3. Create embeddings
4. Store vectors
5. Retrieve relevant chunks
6. Add chunks to prompt
7. Generate answer

That is the core idea.

---

# Recommended Next Improvements

## Immediate Upgrades

### 1. Add source citations

Return metadata from Chroma.

---

### 2. Add streaming responses

Huge UX improvement.

---

### 3. Add drag-and-drop uploads

Very educational.

---

### 4. Add conversation memory

Simple chat history array first.

---

### 5. Add better chunking

Current chunking is intentionally primitive.

Later:

* sentence-aware chunking
* semantic chunking

---

# Important Notes

## ChromaDB is fully local

You are using embedded mode:

```python
chromadb.PersistentClient(...)
```

This means:

* local disk storage
* no cloud account
* no hosted database
* no internet dependency after setup

---

# Entire Stack Is Local

```text
Next.js           -> local
FastAPI           -> local
Ollama            -> local
LLM model         -> local GPU/CPU
Embeddings        -> local
ChromaDB          -> local disk
Express server    -> local
Documents         -> local
```

---

# Recommended Learning Path

## V1

* basic text RAG
* simple chunking
* no streaming

## V2

* citations
* uploads
* streaming
* better UI

## V3

* hybrid search
* reranking
* metadata filtering
* memory

## V4

* OCR
* multimodal
* auth
* SharePoint ingestion
* background indexing

---

# Final Advice

Build version 1 manually without LangChain.

You will understand:

* embeddings
* vector search
* chunking
* prompt augmentation
* retrieval flow

far better than if you start with heavy abstractions.

Once you understand the fundamentals, frameworks like LangChain and enterprise AI platforms become much easier to reason about.
