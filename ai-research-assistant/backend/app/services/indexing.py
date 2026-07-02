from app.utils.chunking import chunk_text
from app.services.embeddings import embed_chunks
from app.services.vector_store import is_indexed, index_chunks


def ensure_indexed(paper_id: str, raw_text: str):
    if is_indexed(paper_id):
        return
    chunks = chunk_text(raw_text)
    if not chunks:
        return
    embeddings = embed_chunks(chunks)
    index_chunks(paper_id, chunks, embeddings)