import uuid
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.paper import Paper
from app.models.user import User
from app.services.pdf_parser import extract_text
from app.schemas.paper import UploadResponse
from app.core.dependencies import get_current_user

router = APIRouter(prefix="/upload", tags=["upload"])


@router.post("", response_model=UploadResponse)
async def upload_pdf(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported")

    pdf_bytes = await file.read()

    try:
        text = extract_text(pdf_bytes)
    except Exception:
        raise HTTPException(status_code=400, detail="Could not read this PDF — it may be corrupted or image-only")

    if not text.strip():
        raise HTTPException(status_code=400, detail="No extractable text found in this PDF")

    paper = Paper(
        id=str(uuid.uuid4()),
        title=file.filename.rsplit(".", 1)[0],
        authors="",
        source="upload",
        raw_text=text,
        owner_id=current_user.id,
        is_saved=True,
    )
    db.add(paper)
    db.commit()
    db.refresh(paper)

    return UploadResponse(paper_id=paper.id, filename=file.filename, char_count=len(text))