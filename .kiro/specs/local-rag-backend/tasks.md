# Implementation Plan: Local RAG Backend

## Overview

This implementation plan breaks down the Local RAG Backend system into discrete coding tasks. The system is a FastAPI-based RAG orchestrator that ingests documents from a local folder, creates embeddings using Ollama, stores vectors in ChromaDB, and provides HTTP API for chat and ingestion.

## Tasks

- [~] 1. Set up project structure and configuration
  - Create directory structure: `apps/api/app/` and `data/raw-docs/` and `data/chroma/`
  - Create `apps/api/requirements.txt` with dependencies: fastapi, uvicorn, chromadb, pypdf, requests
  - Create `apps/api/app/__init__.py` (empty file for package)
  - Create `apps/api/app/config.py` with configuration for Ollama URL and ChromaDB path
  - _Requirements: 8.1, 8.2, 8.3_

- [x] 2. Create data models and exceptions
  - [x] 2.1 Create `apps/api/app/models.py` with Pydantic models
    - Define `Chunk` model (id, text, embedding, metadata)
    - Define `ChatRequest` and `ChatResponse` models
    - Define `Source` model for citations
    - Define `IngestionResult` model for ingestion responses
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2_
  
  - [x] 2.2 Create `apps/api/app/exceptions.py` with custom exceptions
    - Define `ServiceUnavailable` exception for Ollama/ChromaDB errors
    - Define `PDFParseError` for document parsing failures
    - _Requirements: 6.1, 6.2, 6.3_

- [ ] 3. Implement Ollama client
  - [-] 3.1 Create `apps/api/app/ollama_client.py` with embedding generation
    - Implement `generate_embedding(text)` function using nomic-embed-text model
    - Implement `generate_response(prompt)` function using qwen3:8b model
    - Add error handling for connection failures
    - _Requirements: 3.1, 3.2, 3.3, 3.4_
  
  - [ ]* 3.2 Write property test for embedding generation
    - **Property 2: Embedding generation is deterministic**
    - **Validates: Requirements 2.5**
    - Test that same text produces same embedding vector across multiple calls
  
  - [ ]* 3.3 Write unit tests for Ollama client
    - Test embedding generation with various text inputs
    - Test error handling for Ollama unavailability
    - _Requirements: 6.1, 6.2_

- [ ] 4. Implement ChromaDB client
  - [-] 4.1 Create `apps/api/app/chroma_client.py` with collection management
    - Implement `get_or_create_collection()` for documents collection
    - Implement `store_chunk(chunk)` function
    - Implement `query_chunks(query_embedding, n_results=3)` function
    - _Requirements: 2.5, 2.6, 3.3, 7.1, 7.2_
  
  - [ ]* 4.2 Write property test for ChromaDB storage
    - **Property 3: ChromaDB storage preserves metadata**
    - **Validates: Requirements 2.6, 4.3**
    - Test that stored chunks return exact text and metadata after retrieval
  
  - [ ]* 4.3 Write unit tests for ChromaDB client
    - Test chunk storage and retrieval
    - Test query with various embeddings
    - _Requirements: 2.5, 2.6, 3.3_

- [ ] 5. Implement document ingestion service
  - [ ] 5.1 Create `apps/api/app/rag_service.py` with ingestion logic
    - Implement `scan_folder(folder_path)` to find PDF and text files
    - Implement `extract_text_from_pdf(filepath)` using pypdf
    - Implement `extract_text_from_txt(filepath)` for text files
    - Implement `chunk_text(text, chunk_size=500, overlap=50)` function
    - _Requirements: 2.1, 2.2, 2.3, 2.4_
  
  - [~] 5.2 Implement ingestion orchestration in `rag_service.py`
    - Implement `ingest_documents()` function that:
      - Scans folder for files
      - Extracts text from each file
      - Chunks text into segments
      - Generates embeddings for each chunk
      - Stores chunks in ChromaDB
      - Returns ingestion result with counts and errors
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7_
  
  - [ ]* 5.3 Write property test for chunking
    - **Property 1: Chunking preserves text integrity**
    - **Validates: Requirements 2.4**
    - Test that chunking preserves all original text without modification or loss
  
  - [ ]* 5.4 Write property test for ingestion error handling
    - **Property 8: Ingestion continues on file errors**
    - **Validates: Requirements 2.7, 6.1**
    - Test that ingestion continues processing remaining files when one fails
  
  - [ ]* 5.5 Write unit tests for ingestion service
    - Test PDF text extraction with various PDFs
    - Test text file reading
    - Test chunking edge cases (empty text, single character)
    - Test error handling for corrupted files
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.7_

- [ ] 6. Implement RAG chat service
  - [~] 6.1 Implement question answering in `rag_service.py`
    - Implement `ask_question(question)` function that:
      - Generates question embedding
      - Queries ChromaDB for 3 most relevant chunks
      - Builds prompt with chunks as context
      - Sends prompt to Ollama LLM
      - Returns answer with sources
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_
  
  - [~] 6.2 Implement prompt construction
    - Build prompt template with retrieved chunks as context
    - Include clear instructions for the LLM
    - _Requirements: 3.4, 3.5, 3.6_
  
  - [ ]* 6.3 Write property test for prompt construction
    - **Property 5: Prompt construction includes all retrieved chunks**
    - **Validates: Requirements 3.4**
    - Test that all retrieved chunks are included in the prompt
  
  - [ ]* 6.4 Write property test for source citations
    - **Property 6: Source citations preserve original text**
    - **Validates: Requirements 3.7, 4.1**
    - Test that source text matches retrieved chunk text exactly
  
  - [ ]* 6.5 Write property test for source filenames
    - **Property 7: Source citations include source filename**
    - **Validates: Requirements 3.8, 4.2**
    - Test that source citations include the source filename from metadata
  
  - [ ]* 6.6 Write unit tests for chat service
    - Test question answering with various questions
    - Test error handling for Ollama unavailability
    - Test error handling for ChromaDB unavailability
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 6.1, 6.2, 6.3_

- [ ] 7. Implement FastAPI application
  - [~] 7.1 Create `apps/api/app/main.py` with FastAPI app
    - Create FastAPI app instance
    - Add CORS middleware
    - Add startup/shutdown events for resource cleanup
    - _Requirements: 1.1, 1.2, 9.1_
  
  - [~] 7.2 Implement health check endpoint
    - Implement `GET /` endpoint returning status message
    - _Requirements: 1.1, 1.2_
  
  - [~] 7.3 Implement document ingestion endpoint
    - Implement `POST /ingest` endpoint
    - Call `ingest_documents()` from RAG service
    - Return `IngestionResult` response
    - Handle errors and return appropriate status codes
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.1_
  
  - [~] 7.4 Implement chat endpoint
    - Implement `POST /chat` endpoint
    - Validate request body for question field
    - Call `ask_question()` from RAG service
    - Return `ChatResponse` with answer and sources
    - Handle validation errors (400) and service unavailability (503)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 3.10, 9.1, 9.2, 9.3, 9.4_
  
  - [ ]* 7.5 Write integration tests
    - Test health check endpoint
    - Test document ingestion flow
    - Test question answering flow
    - Test error responses
    - _Requirements: 1.1, 1.2, 2.1, 3.1, 6.1, 6.2, 6.3, 9.1, 9.2, 9.3, 9.4_

- [ ] 8. Create startup script and documentation
  - [~] 8.1 Create `apps/api/start.sh` for Linux/Mac
    - Create required directories
    - Activate virtual environment
    - Start FastAPI server with uvicorn
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [~] 8.2 Create `apps/api/start.bat` for Windows
    - Create required directories
    - Activate virtual environment
    - Start FastAPI server with uvicorn
    - _Requirements: 8.1, 8.2, 8.3_
  
  - [~] 8.3 Create `apps/api/README.md`
    - Project overview
    - Prerequisites (Ollama, Python, virtual environment)
    - Installation instructions
    - Usage instructions
    - API documentation
    - Troubleshooting guide
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [~] 9. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
- Integration tests validate end-to-end flows

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "2.2"] },
    { "id": 2, "tasks": ["3.1", "4.1", "5.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.2", "4.3", "5.2", "5.3", "5.4", "5.5"] },
    { "id": 4, "tasks": ["6.1", "6.2", "6.3", "6.4", "6.5", "6.6"] },
    { "id": 5, "tasks": ["7.1", "7.2", "7.3", "7.4", "7.5"] },
    { "id": 6, "tasks": ["8.1", "8.2", "8.3"] },
    { "id": 7, "tasks": ["9.1"] }
  ]
}
```