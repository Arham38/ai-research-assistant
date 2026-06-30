# AI Research Assistant + Paper Intelligence Platform

Full-stack platform: Next.js frontend + FastAPI backend + Groq LLM (RAG) for
searching, summarizing, chatting with, and comparing research papers.

## Folder map -> phases

| Phase | What | Backend | Frontend |
|---|---|---|---|
| 1 | Search & discovery | routers/search.py, services/arxiv_client.py, services/semantic_scholar_client.py | app/search, components/SearchBar.tsx, components/PaperCard.tsx |
| 2 | Upload + summarize | routers/upload.py, routers/summarize.py, services/pdf_parser.py, services/groq_client.py | app/paper/[id] |
| 3 | RAG chat with paper | routers/chat.py, services/embeddings.py, services/vector_store.py, utils/chunking.py | app/paper/[id]/chat, components/ChatBox.tsx |
| 4 | Library + comparison | routers/library.py, routers/compare.py, models/paper.py, models/collection.py | app/library, app/compare, components/ComparisonTable.tsx |
| 5 | Literature review | routers/lit_review.py | app/lit-review |
| 6 | Auth + deploy | routers/auth.py, core/security.py, core/dependencies.py, models/user.py | app/login, app/register |

## Run locally

### Backend
```
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env            # fill in GROQ_API_KEY, DATABASE_URL, JWT_SECRET
uvicorn app.main:app --reload
```

### Frontend
```
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Backend runs on http://localhost:8000, frontend on http://localhost:3000.

## Workflow

Each phase has a ready-made build prompt (see chat history / project notes).
Drop the prompt for the phase you're working on into a fresh request and the
relevant stub files above get filled in.
