from rank_bm25 import BM25Okapi

from app.services.vector_store import get_all_chunks, retrieve_relevant
from app.services.embeddings import embed_query


def _tokenize(text: str) -> list[str]:
    return text.lower().split()


def hybrid_retrieve(paper_id: str, query: str, top_k: int = 8) -> list[str]:
    all_chunks = get_all_chunks(paper_id)
    if not all_chunks:
        return []

    # semantic ranking — good at matching meaning/paraphrases
    query_embedding = embed_query(query)
    semantic_ranked = retrieve_relevant(paper_id, query_embedding, top_k=top_k * 2)

    # keyword ranking — good at catching exact terms, acronyms, numbers
    tokenized_corpus = [_tokenize(c) for c in all_chunks]
    bm25 = BM25Okapi(tokenized_corpus)
    bm25_scores = bm25.get_scores(_tokenize(query))
    bm25_ranked = [
        chunk for chunk, _ in sorted(zip(all_chunks, bm25_scores), key=lambda x: x[1], reverse=True)
    ][: top_k * 2]

    # Reciprocal Rank Fusion — combines both rankings by position, so we don't
    # need to normalize BM25 scores and cosine similarity onto the same scale
    scores: dict[str, float] = {}
    K = 60
    for rank, chunk in enumerate(semantic_ranked):
        scores[chunk] = scores.get(chunk, 0) + 1 / (K + rank + 1)
    for rank, chunk in enumerate(bm25_ranked):
        scores[chunk] = scores.get(chunk, 0) + 1 / (K + rank + 1)

    fused = sorted(scores.items(), key=lambda x: x[1], reverse=True)
    return [chunk for chunk, _ in fused[:top_k]]