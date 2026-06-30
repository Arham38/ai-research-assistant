# PHASE 1/2: Pydantic models for search results + structured summary
from pydantic import BaseModel
from typing import Optional


class PaperResult(BaseModel):
    paper_id: str
    title: str
    authors: list[str]
    abstract: str
    year: Optional[int] = None
    source: str
    pdf_url: Optional[str] = None


class PaperSummary(BaseModel):
    problem_statement: str
    methodology: str
    key_results: str
    limitations: str
    conclusion: str
