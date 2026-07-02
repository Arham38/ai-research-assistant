import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.paper import Paper
from app.models.user import User
from app.schemas.compare import CompareRequest, CompareResponse
from app.services.groq_client import compare_papers as compare_papers_llm, summarize_text
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/compare", tags=["compare"])


@router.post("", response_model=CompareResponse)
def compare_papers(
    body: CompareRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not (2 <= len(body.paper_ids) <= 3):
        raise HTTPException(status_code=400, detail="Select 2 or 3 papers to compare")

    papers = db.query(Paper).filter(
        Paper.id.in_(body.paper_ids),
        Paper.owner_id == current_user.id,
    ).all()
    if len(papers) != len(body.paper_ids):
        raise HTTPException(status_code=404, detail="One or more papers not found")

    papers_by_id = {p.id: p for p in papers}
    ordered = [papers_by_id[pid] for pid in body.paper_ids]

    contents = []
    for paper in ordered:
        if paper.summary_json:
            content = json.loads(paper.summary_json)
            text = " ".join(content.values())
        elif paper.raw_text:
            summary = summarize_text(paper.raw_text)
            paper.summary_json = json.dumps(summary)
            text = " ".join(summary.values())
        else:
            text = paper.abstract or "No content available for this paper."
        contents.append({"paper_id": paper.id, "title": paper.title, "text": text})

    db.commit()

    rows = compare_papers_llm(contents)
    return CompareResponse(
        papers=[{"paper_id": p.id, "title": p.title} for p in ordered],
        rows=rows,
    )