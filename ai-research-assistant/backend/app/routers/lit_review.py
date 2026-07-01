import json
from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.paper import Paper
from app.schemas.lit_review import LitReviewRequest, LitReviewResponse
from app.services.groq_client import generate_lit_review, summarize_text

router = APIRouter(prefix="/lit-review", tags=["lit-review"])


@router.post("", response_model=LitReviewResponse)
def create_lit_review(body: LitReviewRequest, db: Session = Depends(get_db)):
    if len(body.paper_ids) < 2:
        raise HTTPException(status_code=400, detail="Select at least 2 papers for a literature review")

    papers = db.query(Paper).filter(Paper.id.in_(body.paper_ids)).all()
    if len(papers) != len(body.paper_ids):
        raise HTTPException(status_code=404, detail="One or more papers not found")

    papers_by_id = {p.id: p for p in papers}
    ordered = [papers_by_id[pid] for pid in body.paper_ids]

    summaries = []
    for paper in ordered:
        if paper.summary_json:
            summary = json.loads(paper.summary_json)
        elif paper.raw_text:
            summary = summarize_text(paper.raw_text)
            paper.summary_json = json.dumps(summary)
        else:
            summary = {
                "problem_statement": paper.abstract or "No content available.",
                "methodology": "",
                "key_results": "",
                "limitations": "",
                "conclusion": "",
            }
        summaries.append({"title": paper.title, "summary": summary})

    db.commit()

    markdown = generate_lit_review(summaries, topic=body.topic)

    return LitReviewResponse(markdown=markdown, paper_titles=[p.title for p in ordered])