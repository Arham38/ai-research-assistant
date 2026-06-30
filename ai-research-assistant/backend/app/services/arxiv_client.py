import httpx
import xml.etree.ElementTree as ET
from datetime import datetime

ARXIV_API_URL = "http://export.arxiv.org/api/query"
ATOM_NS = "{http://www.w3.org/2005/Atom}"


async def search_arxiv(query: str, page: int = 1, page_size: int = 10):
    start = (page - 1) * page_size
    params = {
        "search_query": f"all:{query}",
        "start": start,
        "max_results": page_size,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        try:
            response = await client.get(ARXIV_API_URL, params=params)
            response.raise_for_status()
        except httpx.HTTPError:
            return []

    root = ET.fromstring(response.text)
    results = []

    for entry in root.findall(f"{ATOM_NS}entry"):
        title = entry.findtext(f"{ATOM_NS}title", default="").strip().replace("\n", " ")
        abstract = entry.findtext(f"{ATOM_NS}summary", default="").strip().replace("\n", " ")
        arxiv_id = entry.findtext(f"{ATOM_NS}id", default="")
        published = entry.findtext(f"{ATOM_NS}published", default="")

        year = None
        if published:
            try:
                year = datetime.strptime(published, "%Y-%m-%dT%H:%M:%SZ").year
            except ValueError:
                pass

        authors = [
            author.findtext(f"{ATOM_NS}name", default="").strip()
            for author in entry.findall(f"{ATOM_NS}author")
        ]

        pdf_url = None
        for link in entry.findall(f"{ATOM_NS}link"):
            if link.attrib.get("title") == "pdf":
                pdf_url = link.attrib.get("href")
                break

        results.append({
            "paper_id": arxiv_id.split("/abs/")[-1] if arxiv_id else "",
            "title": title,
            "authors": authors,
            "abstract": abstract,
            "year": year,
            "source": "arxiv",
            "pdf_url": pdf_url,
        })

    return results