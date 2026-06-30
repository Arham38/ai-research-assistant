from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Routers — uncomment as each phase is built
# from app.routers import search, upload, summarize, chat, library, compare, lit_review, auth

app = FastAPI(title="AI Research Assistant API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


# PHASE 1
# app.include_router(search.router)
# PHASE 2
# app.include_router(upload.router)
# app.include_router(summarize.router)
# PHASE 3
# app.include_router(chat.router)
# PHASE 4
# app.include_router(library.router)
# app.include_router(compare.router)
# PHASE 5
# app.include_router(lit_review.router)
# PHASE 6
# app.include_router(auth.router)
