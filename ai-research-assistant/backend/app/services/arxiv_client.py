# PHASE 1: thin wrapper around arXiv's public API (no key needed)
import httpx

ARXIV_API_URL = "http://export.arxiv.org/api/query"


async def search_arxiv(query: str, page: int = 1):
    # TODO: build query params, parse Atom XML response into PaperResult-shaped dicts
    raise NotImplementedError
