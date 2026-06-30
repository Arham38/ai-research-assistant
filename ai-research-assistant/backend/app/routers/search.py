from fastapi import APIRouter, Query
from app.services.arxiv_client import search_arxiv
from app.services.semantic_scholar_client import search_semantic_scholar
from app.schemas.paper import PaperResult

router = APIRouter(prefix="/search", tags=["search"])


def dedupe(results: list[dict]) -> list[dict]:
    seen = set()
    unique = []
    for r in results:
        key = r["title"].strip().lower()
        if key and key not in seen:
            seen.add(key)
            unique.append(r)
    return unique


@router.get("", response_model=list[PaperResult])
async def search_papers(query: str = Query(..., min_length=1), page: int = Query(1, ge=1)):
    arxiv_results = await search_arxiv(query, page)
    s2_results = await search_semantic_scholar(query, page)
    return dedupe(arxiv_results + s2_results)