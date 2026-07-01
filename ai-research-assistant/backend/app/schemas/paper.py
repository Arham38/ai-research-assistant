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


class UploadResponse(BaseModel):
    paper_id: str
    filename: str
    char_count: int


class SummaryResponse(BaseModel):
    paper_id: str
    problem_statement: str
    methodology: str
    key_results: str
    limitations: str
    conclusion: str