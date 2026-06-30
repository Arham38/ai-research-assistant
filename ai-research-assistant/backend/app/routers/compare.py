# PHASE 4: POST /compare — takes 2-3 paper_ids, asks Groq for a structured comparison table
from fastapi import APIRouter

router = APIRouter(prefix="/compare", tags=["compare"])

# TODO: @router.post("")
