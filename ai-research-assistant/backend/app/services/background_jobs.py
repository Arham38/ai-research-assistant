import json
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.paper import Paper
from app.services.groq_client import summarize_text
from app.services.indexing import ensure_indexed


def process_paper_background(paper_id: str):
    """Runs right after upload, in the background: generates the summary and
    builds the RAG index ahead of time, so the summary and chat pages load
    instantly instead of making the user wait on first visit."""
    db: Session = SessionLocal()
    try:
        paper = db.query(Paper).filter(Paper.id == paper_id).first()
        if not paper or not paper.raw_text:
            return

        if not paper.summary_json:
            try:
                summary = summarize_text(paper.raw_text)
                paper.summary_json = json.dumps(summary)
                db.commit()
                print(f"[background] summary generated for {paper_id}")
            except Exception as e:
                print(f"[background] summarization failed for {paper_id}: {e}")

        try:
            ensure_indexed(paper_id, paper.raw_text)
            print(f"[background] paper {paper_id} indexed and ready to chat")
        except Exception as e:
            print(f"[background] indexing failed for {paper_id}: {e}")
    finally:
        db.close()