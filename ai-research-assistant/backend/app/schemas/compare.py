from pydantic import BaseModel


class CompareRequest(BaseModel):
    paper_ids: list[str]


class CompareResponse(BaseModel):
    papers: list[dict]
    rows: list[dict]