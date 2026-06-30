# PHASE 3: text -> vector, using sentence-transformers (local, free)
from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")


def embed_chunks(chunks: list[str]) -> list[list[float]]:
    return model.encode(chunks).tolist()
