# PHASE 3: chat request/response schemas
from pydantic import BaseModel


class ChatRequest(BaseModel):
    question: str


class ChatResponse(BaseModel):
    answer: str
    source_chunks: list[str] = []
