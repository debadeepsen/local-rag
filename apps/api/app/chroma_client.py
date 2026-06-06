"""ChromaDB client for storing and querying embeddings."""

import chromadb
from chromadb import PersistentClient
from chromadb.api.types import Documents, Embeddings, Metadatas, QueryResult
from typing import List, Dict, Any, Optional
import uuid

from .models import Chunk
from .exceptions import ServiceUnavailable


# ChromaDB client instance
_client: Optional[PersistentClient] = None
_collection: Optional[Any] = None


def get_chroma_client() -> PersistentClient:
    """Get or create the ChromaDB persistent client."""
    global _client
    if _client is None:
        _client = PersistentClient(path="data/chroma")
    return _client


def get_or_create_collection() -> Any:
    """Get or create the documents collection in ChromaDB."""
    global _collection
    if _collection is None:
        client = get_chroma_client()
        _collection = client.get_or_create_collection(name="documents")
    return _collection


def store_chunk(chunk: Chunk) -> str:
    """
    Store a chunk with its embedding in ChromaDB.
    
    Args:
        chunk: The Chunk object containing text, embedding, and metadata
        
    Returns:
        The ID of the stored chunk
        
    Raises:
        ServiceUnavailable: If ChromaDB is not reachable
    """
    try:
        collection = get_or_create_collection()
        chunk_id = str(uuid.uuid4())
        
        collection.add(
            ids=[chunk_id],
            embeddings=[chunk.embedding],
            documents=[chunk.text],
            metadatas=[chunk.metadata]
        )
        
        return chunk_id
    except Exception as e:
        raise ServiceUnavailable(f"Failed to store chunk in ChromaDB: {str(e)}")


def query_chunks(query_embedding: List[float], n_results: int = 3) -> List[Dict[str, Any]]:
    """
    Query ChromaDB for the most relevant chunks to a given embedding.
    
    Args:
        query_embedding: The embedding vector to query with
        n_results: Number of results to return (default: 3)
        
    Returns:
        List of dictionaries containing chunk text, metadata, and distance
        
    Raises:
        ServiceUnavailable: If ChromaDB is not reachable
    """
    try:
        collection = get_or_create_collection()
        
        results: QueryResult = collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        
        # Transform results into list of dicts
        chunks = []
        if results["ids"] and len(results["ids"]) > 0:
            for i in range(len(results["ids"][0])):
                chunk_data = {
                    "id": results["ids"][0][i],
                    "text": results["documents"][0][i],
                    "metadata": results["metadatas"][0][i],
                    "distance": results["distances"][0][i] if results.get("distances") else None
                }
                chunks.append(chunk_data)
        
        return chunks
    except Exception as e:
        raise ServiceUnavailable(f"Failed to query ChromaDB: {str(e)}")


def clear_collection() -> None:
    """Clear all documents from the collection. Useful for testing."""
    global _collection
    try:
        collection = get_or_create_collection()
        collection.delete(where={})
    except Exception as e:
        raise ServiceUnavailable(f"Failed to clear collection: {str(e)}")
