# PHASE 3: POST /chat/{paper_id} — RAG: embed query, retrieve chunks, stream Groq answer via SSE
from fastapi import APIRouter

router = APIRouter(prefix="/chat", tags=["chat"])

# TODO: @router.post("/{paper_id}")
