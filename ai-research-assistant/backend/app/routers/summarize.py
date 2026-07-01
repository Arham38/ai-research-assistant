import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.paper import Paper
from app.services.groq_client import summarize_text
from app.schemas.paper import SummaryResponse

router = APIRouter(prefix="/summarize", tags=["summarize"])


@router.post("/{paper_id}", response_model=SummaryResponse)
async def summarize_paper(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    if paper.summary_json:
        cached = json.loads(paper.summary_json)
        return SummaryResponse(paper_id=paper.id, **cached)

    summary = summarize_text(paper.raw_text)

    paper.summary_json = json.dumps(summary)
    db.commit()

    return SummaryResponse(paper_id=paper.id, **summary)