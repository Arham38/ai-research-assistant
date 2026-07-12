# import chromadb
# from app.config import settings

# _client = None


# def get_client():
#     global _client
#     if _client is None:
#         _client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
#     return _client


# def get_collection(paper_id: str):
#     return get_client().get_or_create_collection(name=f"paper_{paper_id}")


# def is_indexed(paper_id: str) -> bool:
#     return get_collection(paper_id).count() > 0


# def index_chunks(paper_id: str, chunks: list[str], embeddings: list[list[float]]):
#     collection = get_collection(paper_id)
#     ids = [f"{paper_id}_{i}" for i in range(len(chunks))]
#     collection.add(documents=chunks, embeddings=embeddings, ids=ids)


# def retrieve_relevant(paper_id: str, query_embedding: list[float], top_k: int = 5) -> list[str]:
#     results = get_collection(paper_id).query(query_embeddings=[query_embedding], n_results=top_k)
#     documents = results.get("documents")
#     return documents[0] if documents else []


# def get_all_chunks(paper_id: str) -> list[str]:
#     """Used by BM25 keyword search, which needs the full chunk set to score against."""
#     result = get_collection(paper_id).get()
#     return result.get("documents", []) or []


import os
from pinecone import Pinecone

# Environment variable se key le kar Pinecone initialize karein
pc = Pinecone(api_key=os.environ.get("PINECONE_API_KEY"))

# Apne index se connect karein jo aapne Pinecone dashboard mein banaya tha
index_name = "ai-research"
index = pc.Index(index_name)

def save_to_vector_store(paper_id: str, chunks: list, embeddings: list):
    """Chunks aur embeddings ko Pinecone mein save karne ka function"""
    vectors = []
    for i, (chunk, emb) in enumerate(zip(chunks, embeddings)):
        vectors.append({
            "id": f"{paper_id}_chunk_{i}",
            "values": emb,  # Yeh 768 dimensions ka array hoga
            "metadata": {"text": chunk, "paper_id": paper_id}
        })
    
    # 100-100 ke batch mein upsert karna behtar rehta hai
    batch_size = 100
    for i in range(0, len(vectors), batch_size):
        index.upsert(vectors=vectors[i:i + batch_size])

def search_vector_store(query_embedding: list, top_k: int = 5):
    """Query ke hisaab se Pinecone se most relevant chunks nikalna"""
    result = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    # Sirf text chunks return karein
    return [match['metadata']['text'] for match in result['matches']]