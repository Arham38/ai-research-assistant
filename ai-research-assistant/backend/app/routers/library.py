from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.paper import Paper
from app.models.collection import PaperTag, PaperNote
from app.schemas.library import PaperSaveRequest, LibraryItem, TagRequest, NoteRequest

router = APIRouter(prefix="/library", tags=["library"])


def to_library_item(paper: Paper, db: Session) -> LibraryItem:
    tags = [t.tag for t in db.query(PaperTag).filter(PaperTag.paper_id == paper.id).all()]
    note_row = db.query(PaperNote).filter(PaperNote.paper_id == paper.id).first()
    return LibraryItem(
        paper_id=paper.id,
        title=paper.title or "",
        authors=[a.strip() for a in (paper.authors or "").split(",") if a.strip()],
        abstract=paper.abstract or "",
        year=paper.year,
        source=paper.source or "",
        pdf_url=paper.pdf_url,
        tags=tags,
        note=note_row.note if note_row else "",
        has_summary=bool(paper.summary_json or paper.raw_text),
    )


@router.post("/save", response_model=LibraryItem)
def save_paper(body: PaperSaveRequest, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == body.paper_id).first()
    if paper:
        paper.is_saved = True
        paper.title = paper.title or body.title
        paper.abstract = paper.abstract or body.abstract
        paper.year = paper.year or body.year
    else:
        paper = Paper(
            id=body.paper_id,
            title=body.title,
            authors=", ".join(body.authors),
            abstract=body.abstract,
            year=body.year,
            source=body.source,
            pdf_url=body.pdf_url,
            is_saved=True,
        )
        db.add(paper)
    db.commit()
    db.refresh(paper)
    return to_library_item(paper, db)


@router.get("", response_model=list[LibraryItem])
def list_library(db: Session = Depends(get_db)):
    papers = db.query(Paper).filter(Paper.is_saved == True).all()  # noqa: E712
    return [to_library_item(p, db) for p in papers]


@router.delete("/{paper_id}")
def remove_from_library(paper_id: str, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")
    paper.is_saved = False
    db.commit()
    return {"status": "removed"}


@router.post("/{paper_id}/tag", response_model=LibraryItem)
def add_tag(paper_id: str, body: TagRequest, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    tag_clean = body.tag.strip()
    if tag_clean:
        exists = db.query(PaperTag).filter(PaperTag.paper_id == paper_id, PaperTag.tag == tag_clean).first()
        if not exists:
            db.add(PaperTag(paper_id=paper_id, tag=tag_clean))
            db.commit()

    return to_library_item(paper, db)


@router.post("/{paper_id}/note", response_model=LibraryItem)
def set_note(paper_id: str, body: NoteRequest, db: Session = Depends(get_db)):
    paper = db.query(Paper).filter(Paper.id == paper_id).first()
    if not paper:
        raise HTTPException(status_code=404, detail="Paper not found")

    note_row = db.query(PaperNote).filter(PaperNote.paper_id == paper_id).first()
    if note_row:
        note_row.note = body.note
    else:
        db.add(PaperNote(paper_id=paper_id, note=body.note))
    db.commit()

    return to_library_item(paper, db)