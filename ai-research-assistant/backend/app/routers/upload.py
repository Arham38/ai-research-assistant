# PHASE 2: POST /upload — accepts PDF, extracts text via services/pdf_parser.py, stores in DB
from fastapi import APIRouter

router = APIRouter(prefix="/upload", tags=["upload"])

# TODO: @router.post("")
