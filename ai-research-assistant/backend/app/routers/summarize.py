# PHASE 2: POST /summarize/{paper_id} — sends extracted text to services/groq_client.py
from fastapi import APIRouter

router = APIRouter(prefix="/summarize", tags=["summarize"])

# TODO: @router.post("/{paper_id}")
