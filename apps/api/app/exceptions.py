"""Custom exceptions for the Local RAG Backend system."""


class ServiceUnavailable(Exception):
    """Exception raised when an external service (Ollama or ChromaDB) is unavailable."""

    def __init__(self, message: str = "Service unavailable"):
        self.message = message
        super().__init__(self.message)


class PDFParseError(Exception):
    """Exception raised when PDF parsing fails."""

    def __init__(self, message: str = "Failed to parse PDF"):
        self.message = message
        super().__init__(self.message)
