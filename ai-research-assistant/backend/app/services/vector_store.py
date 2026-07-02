import chromadb
from app.config import settings

_client = None


def get_client():
    global _client
    if _client is None:
        _client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
    return _client


def get_collection(paper_id: str):
    return get_client().get_or_create_collection(name=f"paper_{paper_id}")


def is_indexed(paper_id: str) -> bool:
    return get_collection(paper_id).count() > 0


def index_chunks(paper_id: str, chunks: list[str], embeddings: list[list[float]]):
    collection = get_collection(paper_id)
    ids = [f"{paper_id}_{i}" for i in range(len(chunks))]
    collection.add(documents=chunks, embeddings=embeddings, ids=ids)


def retrieve_relevant(paper_id: str, query_embedding: list[float], top_k: int = 5) -> list[str]:
    results = get_collection(paper_id).query(query_embeddings=[query_embedding], n_results=top_k)
    documents = results.get("documents")
    return documents[0] if documents else []


def get_all_chunks(paper_id: str) -> list[str]:
    """Used by BM25 keyword search, which needs the full chunk set to score against."""
    result = get_collection(paper_id).get()
    return result.get("documents", []) or []