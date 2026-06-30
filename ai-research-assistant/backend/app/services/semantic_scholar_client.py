# PHASE 1: thin wrapper around Semantic Scholar's public API
import httpx

S2_API_URL = "https://api.semanticscholar.org/graph/v1/paper/search"


async def search_semantic_scholar(query: str, page: int = 1):
    # TODO: call API, map response fields into PaperResult-shaped dicts
    raise NotImplementedError
