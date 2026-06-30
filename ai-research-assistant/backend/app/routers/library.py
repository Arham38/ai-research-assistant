# PHASE 4: CRUD for saved papers, tags, notes
from fastapi import APIRouter

router = APIRouter(prefix="/library", tags=["library"])

# TODO: @router.post("/save"), @router.get(""), @router.delete("/{paper_id}"),
#       @router.post("/{paper_id}/tag"), @router.post("/{paper_id}/note")
