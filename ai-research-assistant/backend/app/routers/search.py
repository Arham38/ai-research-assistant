# PHASE 1: GET /search?query=...&page=...
# calls services/arxiv_client.py + services/semantic_scholar_client.py, merges + dedupes
from fastapi import APIRouter

router = APIRouter(prefix="/search", tags=["search"])

# TODO: @router.get("")
