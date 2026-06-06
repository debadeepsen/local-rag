from pydantic import BaseModel
from typing import List, Dict, Any


class Chunk(BaseModel):
    """Represents a text chunk with its embedding and metadata."""
    id: str
    text: str
    embedding: List[float]
    metadata: Dict[str, str]


class Source(BaseModel):
    """Represents a source citation from a retrieved chunk."""
    text: str
    source: str


class ChatRequest(BaseModel):
    """Request model for the chat endpoint."""
    question: str


class ChatResponse(BaseModel):
    """Response model for the chat endpoint."""
    answer: str
    sources: List[Source]


class IngestionResult(BaseModel):
    """Response model for the ingestion endpoint."""
    files_processed: int
    chunks_created: int
    errors: List[Dict[str, str]]
