# Local RAG Application

## Overview

This repository contains a **Local Retrieval-Augmented Generation (RAG)** system built with a small API backend (FastAPI) and a modern frontend (React + Vite).  The application allows you to:

- Index a local document collection.
- Perform semantic search against the collection.
- Generate answers using an LLM with retrieved context.

The project layout is:

```
local-rag/
├─ apps/
│   ├─ api/          # FastAPI backend
│   ├─ docs-server/  # Static document server (Express)
│   └─ frontend/     # React/Vite frontend
├─ data/              # Sample documents and vector DB
├─ scripts/           # Helper scripts (e.g., data ingestion)
├─ .venv/             # Python virtual environment (recommended)
└─ README.md          # <‑‑ you are reading this file
```

## Prerequisites

| Tool       | Minimum version | Download link                                 |
|------------|-----------------|-----------------------------------------------|
| **Python** | 3.11            | https://www.python.org/downloads/windows/     |
| **Node.js**| 18.x            | https://nodejs.org/en/download/               |
| **npm**    | 9.x             | (Included with Node.js)                       |
| **Git**    | any             | https://git-scm.com/download/win              |
| **Ollama** | 0.2.7           | https://ollama.com/download                   |


> **Tip:** The repository includes a `.venv` directory that you can activate to get the exact Python environment the project was developed with.

## Models

Models are configured via environment variables so you can swap them without touching the code:

| Variable | Default | Purpose |
|---|---|---|
| `EMBEDDING_MODEL` | `nomic-embed-text` | Ollama embedding model |
| `LLM_MODEL` | `qwen3:8b` | Ollama language model |
| `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama service URL |

See `.env.example` for a ready-to-use template. Any model available in your local Ollama instance can be used.

## Quick‑Start (Linux/macOS/WSL & Windows PowerShell)

1. **Clone the repository (if you haven't already)**
   ```bash
   git clone https://github.com/debadeepsen/local-rag.git
   cd local-rag
   ```

2. **Create / activate the Python virtual environment**
   ```powershell
   # Windows PowerShell
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   # macOS / Linux
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. **Install Python dependencies**
   ```bash
   pip install -r apps/api/requirements.txt
   ```

4. **Install frontend and docs-server dependencies**
   ```bash
   # Install frontend dependencies
   cd apps/frontend
   npm install
   cd ../../

   # Install docs-server dependencies
   cd apps/docs-server
   npm install
   cd ../../
   ```

5. **Set up environment variables**
   Copy the example file and edit as needed:
   ```bash
   cp .env.example .env
   ```
   Key variables:
   | Variable | Default | Description |
   |---|---|---|
   | `OLLAMA_BASE_URL` | `http://localhost:11434` | Ollama service URL |
   | `EMBEDDING_MODEL` | `nomic-embed-text` | Embedding model name |
   | `LLM_MODEL` | `qwen3:8b` | Language model name |

## Running the Application

### API Backend

```bash
# From the repository root (ensure the virtual env is active)
uvicorn apps.api.app.main:app --reload
# or
make run
# or using 
scripts/run_backend.ps1
```

- The API will be available at `http://127.0.0.1:8000`.
- Swagger UI can be accessed at `http://127.0.0.1:8000/docs`.

### Docs Server

```bash
cd apps/docs-server
npm run dev   # Express server, runs on http://localhost:3001
```

- The docs server will host static files from `data/raw-docs` on `http://localhost:3001/docs`.

### Frontend

```bash
cd apps/frontend
npm run dev   # Vite dev server, usually http://localhost:5173
```

The frontend automatically proxies API calls to `http://127.0.0.1:8000` (configured in `vite.config.ts`).

### Full Stack (one terminal each)

| Terminal | Command |
|----------|---------|
| **Backend** | `uvicorn apps.api.app.main:app --reload` |
| **Docs Server** | `cd apps/docs-server && npm run dev` |
| **Frontend** | `cd apps/frontend && npm run dev` |

Open your browser to the Vite URL, and you should see the UI ready to query the local RAG system.

## Troubleshooting

- **Port already in use** – Change the port with `--port <num>` for `uvicorn` or set `VITE_PORT` in the frontend.
- **Missing environment variable** – Verify that `.env` contains `LLM_API_KEY` and any other required keys.
- **Embedding model errors** – Ensure you have network access to the model provider or switch to a local model by editing `apps/api/config.py`.

