from pydantic import BaseModel
from typing import Optional


class LitReviewRequest(BaseModel):
    paper_ids: list[str]
    topic: Optional[str] = None


class LitReviewResponse(BaseModel):
    markdown: str
    paper_titles: list[str]