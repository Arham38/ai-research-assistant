from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import search, upload, summarize
from app.database import Base, engine
import app.models  # noqa: registers all models before create_all runs

app = FastAPI(title="AI Research Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(search.router)
app.include_router(upload.router)
app.include_router(summarize.router)

# PHASE 3 onwards — uncomment as you build them
# app.include_router(chat.router)
# app.include_router(library.router)
# app.include_router(compare.router)
# app.include_router(lit_review.router)
# app.include_router(auth.router)