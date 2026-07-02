import httpx
import asyncio

S2_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"
FIELDS = "title,abstract,authors,year,openAccessPdf"
HEADERS = {"User-Agent": "AI-Research-Assistant (contact: research@assistant.local)"}
MAX_RETRIES = 3
INITIAL_BACKOFF = 2  # seconds (S2 has stricter rate limits)


async def search_semantic_scholar(query: str, page: int = 1, page_size: int = 10):
    offset = (page - 1) * page_size
    params = {
        "query": query,
        "offset": offset,
        "limit": page_size,
        "fields": FIELDS,
    }

    for attempt in range(MAX_RETRIES):
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(S2_API_URL, params=params, headers=HEADERS)
                
                if response.status_code == 429:  # Rate limited
                    wait_time = INITIAL_BACKOFF * (2 ** attempt)
                    print(f"[s2_client] Rate limited. Retrying in {wait_time}s (attempt {attempt + 1}/{MAX_RETRIES})")
                    await asyncio.sleep(wait_time)
                    continue
                    
                response.raise_for_status()
                break  # Success
                
        except httpx.TimeoutException as e:
            wait_time = INITIAL_BACKOFF * (2 ** attempt)
            if attempt < MAX_RETRIES - 1:
                print(f"[s2_client] Timeout. Retrying in {wait_time}s (attempt {attempt + 1}/{MAX_RETRIES})")
                await asyncio.sleep(wait_time)
                continue
            else:
                print(f"[s2_client] request failed: {type(e).__name__}: {e}")
                return []
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