import httpx

S2_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
FIELDS = "title,abstract,authors,year,openAccessPdf"


async def search_semantic_scholar(query: str, page: int = 1, page_size: int = 10):
    offset = (page - 1) * page_size
    params = {
        "query": query,
        "offset": offset,
        "limit": page_size,
        "fields": FIELDS,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(S2_API_URL, params=params)
            response.raise_for_status()
        except httpx.HTTPError as e:
            print(f"[s2_client] request failed: {type(e).__name__}: {e}")
            return []

    data = response.json()
    results = []

    for paper in data.get("data", []):
        results.append({
            "paper_id": paper.get("paperId", ""),
            "title": paper.get("title") or "",
            "authors": [a.get("name", "") for a in paper.get("authors", [])],
            "abstract": paper.get("abstract") or "",
            "year": paper.get("year"),
            "source": "semantic_scholar",
            "pdf_url": (paper.get("openAccessPdf") or {}).get("url"),
        })

    return results