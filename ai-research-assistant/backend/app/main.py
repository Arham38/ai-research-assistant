from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from slowapi import _rate_limit_exceeded_handler

from app.routers import search, upload, summarize, chat, library, compare, lit_review, auth
from app.database import Base, engine
from app.core.limiter import limiter
import app.models  # noqa: registers all models before create_all runs

app = FastAPI(title="AI Research Assistant API")

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

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


app.include_router(auth.router)
app.include_router(search.router)
app.include_router(upload.router)
app.include_router(summarize.router)
app.include_router(chat.router)
app.include_router(library.router)
app.include_router(compare.router)
app.include_router(lit_review.router)