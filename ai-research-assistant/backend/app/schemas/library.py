from pydantic import BaseModel
from typing import Optional


class PaperSaveRequest(BaseModel):
    paper_id: str
    title: str
    authors: list[str] = []
    abstract: Optional[str] = ""
    year: Optional[int] = None
    source: str = "search"
    pdf_url: Optional[str] = None


class LibraryItem(BaseModel):
    paper_id: str
    title: str
    authors: list[str]
    abstract: Optional[str] = ""
    year: Optional[int] = None
    source: str
    pdf_url: Optional[str] = None
    tags: list[str] = []
    note: Optional[str] = ""
    has_summary: bool = False


class TagRequest(BaseModel):
    tag: str


class NoteRequest(BaseModel):
    note: str