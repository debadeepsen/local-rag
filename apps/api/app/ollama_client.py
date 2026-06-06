"""Ollama API client for embedding generation and LLM responses."""

import os
import requests
from typing import List, Dict, Any
from .exceptions import ServiceUnavailable


# Ollama configuration – override via environment variables
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
EMBEDDING_MODEL = os.getenv("EMBEDDING_MODEL", "nomic-embed-text")
LLM_MODEL = os.getenv("LLM_MODEL", "qwen3:8b")

EMBEDDINGS_ENDPOINT = f"{OLLAMA_BASE_URL}/api/embeddings"
GENERATE_ENDPOINT = f"{OLLAMA_BASE_URL}/api/generate"


def generate_embedding(text: str) -> List[float]:
    """
    Generate an embedding for the given text using the configured embedding model.

    The model is controlled by the EMBEDDING_MODEL environment variable
    (default: ``nomic-embed-text``).

    Args:
        text: The text to generate an embedding for

    Returns:
        A list of floats representing the embedding vector

    Raises:
        ServiceUnavailable: If Ollama is not reachable or returns an error
    """
    payload = {
        "model": EMBEDDING_MODEL,
        "prompt": text
    }
    
    try:
        response = requests.post(EMBEDDINGS_ENDPOINT, json=payload, timeout=30)
        response.raise_for_status()
        result = response.json()
        return result.get("embedding", [])
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("Ollama service unavailable - could not connect")
    except requests.exceptions.Timeout:
        raise ServiceUnavailable("Ollama request timeout")
    except requests.exceptions.RequestException as e:
        raise ServiceUnavailable(f"Ollama API error: {str(e)}")
    except (KeyError, ValueError) as e:
        raise ServiceUnavailable(f"Invalid response from Ollama: {str(e)}")


def generate_response(prompt: str) -> str:
    """
    Generate a response from the LLM using the configured language model.

    The model is controlled by the LLM_MODEL environment variable
    (default: ``qwen3:8b``).

    Args:
        prompt: The prompt to send to the LLM

    Returns:
        The generated response text

    Raises:
        ServiceUnavailable: If Ollama is not reachable or returns an error
    """
    payload = {
        "model": LLM_MODEL,
        "prompt": prompt,
        "stream": False
    }
    
    try:
        response = requests.post(GENERATE_ENDPOINT, json=payload, timeout=120)
        response.raise_for_status()
        result = response.json()
        return result.get("response", "")
    except requests.exceptions.ConnectionError:
        raise ServiceUnavailable("Ollama service unavailable - could not connect")
    except requests.exceptions.Timeout:
        raise ServiceUnavailable("Ollama request timeout")
    except requests.exceptions.RequestException as e:
        raise ServiceUnavailable(f"Ollama API error: {str(e)}")
    except (KeyError, ValueError) as e:
        raise ServiceUnavailable(f"Invalid response from Ollama: {str(e)}")
