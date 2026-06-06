"""Document ingestion service for the Local RAG Backend system.

This module provides functionality to scan folders, extract text from PDFs
and text files, and chunk documents for embedding and storage.
"""

import os
import re
from pathlib import Path
from typing import List, Dict, Any

from .exceptions import PDFParseError


def scan_folder(folder_path: str) -> List[str]:
    """Scan a folder for PDF and text files.
    
    Args:
        folder_path: Path to the folder to scan
        
    Returns:
        List of file paths for PDF and text files found
    """
    files = []
    folder = Path(folder_path)
    
    if not folder.exists():
        return files
    
    for item in folder.iterdir():
        if item.is_file():
            if item.suffix.lower() in ['.pdf', '.txt']:
                files.append(str(item))
    
    return sorted(files)


def extract_text_from_pdf(filepath: str) -> str:
    """Extract text from a PDF file using pypdf.
    
    Args:
        filepath: Path to the PDF file
        
    Returns:
        Extracted text content
        
    Raises:
        PDFParseError: If the PDF cannot be parsed
    """
    try:
        # pyrefly: ignore [missing-import]
        import pypdf
    except ImportError:
        raise PDFParseError("pypdf is not installed. Install with: pip install pypdf")
    
    try:
        reader = pypdf.PdfReader(filepath)
        text_parts = []
        
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text_parts.append(page_text)
        
        return "\n".join(text_parts)
    except Exception as e:
        raise PDFParseError(f"Failed to parse PDF {filepath}: {str(e)}")


def extract_text_from_txt(filepath: str) -> str:
    """Extract text from a text file.
    
    Args:
        filepath: Path to the text file
        
    Returns:
        File content as string
        
    Raises:
        PDFParseError: If the file cannot be read
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Try with different encoding
        try:
            with open(filepath, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            raise PDFParseError(f"Failed to read text file {filepath}: {str(e)}")
    except Exception as e:
        raise PDFParseError(f"Failed to read text file {filepath}: {str(e)}")


def chunk_text(text: str, chunk_size: int = 500, overlap: int = 50) -> List[str]:
    """Chunk text into segments with overlap.
    
    Args:
        text: Text to chunk
        chunk_size: Size of each chunk in characters (default: 500)
        overlap: Overlap between chunks in characters (default: 50)
        
    Returns:
        List of text chunks
    """
    if not text:
        return []
    
    chunks = []
    start = 0
    text_length = len(text)
    
    while start < text_length:
        end = start + chunk_size
        chunk = text[start:end]
        chunks.append(chunk)
        start = end - overlap
        
        # Prevent infinite loop if we're near the end
        if end >= text_length:
            break
    
    return chunks
