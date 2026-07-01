def chunk_text(text: str, chunk_size: int = 220, overlap: int = 70) -> list[str]:
    """Word-based chunking with overlap. Smaller chunks = more precise semantic
    matches, since a chunk mixing multiple topics dilutes its own embedding."""
    words = text.split()
    if not words:
        return []

    chunks = []
    start = 0
    while start < len(words):
        end = start + chunk_size
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end >= len(words):
            break
        start = end - overlap

    return chunks