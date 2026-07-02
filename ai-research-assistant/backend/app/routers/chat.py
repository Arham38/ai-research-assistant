import json
from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.database import get_db, SessionLocal
from app.models.paper import Paper
from app.models.chat_message import ChatMessage
from app.models.user import User
from app.services.indexing import ensure_indexed
from app.services.hybrid_retrieval import hybrid_retrieve
from app.services.vector_store import get_collection
from app.services.groq_client import answer_with_context_stream
from app.core.dependencies import get_current_user
from app.core.limiter import limiter

router = APIRouter(prefix="/chat", tags=["chat"])


class ChatRequest(BaseModel):
    question: str


class ChatMessageOut(BaseModel):
    role: str
    content: str


def get_anchor_chunk(paper_id: str) -> str | None:
    result = get_collection(paper_id).get(ids=[f"{paper_id}_0"])
    documents = result.get("documents")
    return documents[0] if documents else None


@router.get("/{paper_id}/history", response_model=list[ChatMessageOut])
def get_chat_history(
    paper_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.query(Paper).filter(Paper.id == paper_id, Paper.owner_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    messages = (
        db.query(ChatMessage)
        .filter(ChatMessage.paper_id == paper_id)
        .order_by(ChatMessage.created_at.asc())
        .all()
    )
    return [ChatMessageOut(role=m.role, content=m.content) for m in messages]


@router.post("/{paper_id}")
@limiter.limit("10/minute")
async def chat_with_paper(
    request: Request,
    paper_id: str,
    body: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    paper = db.query(Paper).filter(Paper.id == paper_id, Paper.owner_id == current_user.id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    if not paper.raw_text:
        raise HTTPException(status_code=400, detail="This paper has no extracted text to search")

    # usually a no-op now — background indexing already ran right after upload
    ensure_indexed(paper_id, paper.raw_text)

    # grab recent turns BEFORE adding the new question, so it isn't duplicated in its own history
    recent = (
        db.query(ChatMessage)
        .filter(ChatMessage.paper_id == paper_id)
        .order_by(ChatMessage.created_at.desc())
        .limit(6)
        .all()
    )
    history = [{"role": m.role, "content": m.content} for m in reversed(recent)]

    db.add(ChatMessage(paper_id=paper_id, role="user", content=body.question))
    db.commit()

    relevant_chunks = hybrid_retrieve(paper_id, body.question, top_k=8)

    if not relevant_chunks:
        relevant_chunks = [paper.raw_text[:3000]]

    anchor = get_anchor_chunk(paper_id)
    if anchor and anchor not in relevant_chunks:
        relevant_chunks = [anchor] + relevant_chunks

    def event_stream():
        collected = []
        for token in answer_with_context_stream(body.question, relevant_chunks, history=history):
            collected.append(token)
            payload = json.dumps({"token": token})
            yield f"data: {payload}\n\n"
        yield "data: [DONE]\n\n"

        answer_text = "".join(collected)
        session = SessionLocal()
        try:
            session.add(ChatMessage(paper_id=paper_id, role="assistant", content=answer_text))
            session.commit()
        finally:
            session.close()

    return StreamingResponse(event_stream(), media_type="text/event-stream")