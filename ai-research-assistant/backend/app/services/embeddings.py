from sentence_transformers import SentenceTransformer

_model = None

# multi-qa-mpnet-base-dot-v1 is specifically trained for matching questions to
# relevant passages — much better fit for RAG than a general-purpose model like MiniLM
MODEL_NAME = "multi-qa-mpnet-base-dot-v1"


def get_model():
    global _model
    if _model is None:
        _model = SentenceTransformer(MODEL_NAME)
    return _model


def embed_chunks(chunks: list[str]) -> list[list[float]]:
    return get_model().encode(chunks).tolist()


def embed_query(query: str) -> list[float]:
    return get_model().encode([query]).tolist()[0]