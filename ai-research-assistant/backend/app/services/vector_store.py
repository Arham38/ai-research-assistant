# PHASE 3: Chroma vector DB wrapper, one collection per paper_id
import chromadb
from app.config import settings

client = chromadb.PersistentClient(path=settings.chroma_persist_dir)


def get_collection(paper_id: str):
    return client.get_or_create_collection(name=f"paper_{paper_id}")


def index_chunks(paper_id: str, chunks: list[str], embeddings: list[list[float]]):
    # TODO: collection.add(documents=chunks, embeddings=embeddings, ids=[...])
    raise NotImplementedError


def retrieve_relevant(paper_id: str, query_embedding: list[float], top_k: int = 5):
    # TODO: collection.query(query_embeddings=[query_embedding], n_results=top_k)
    raise NotImplementedError
