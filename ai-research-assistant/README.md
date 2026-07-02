# AI Research Assistant

AI Research Assistant is a full-stack research workspace for discovering, understanding, and synthesizing academic papers. It combines a Next.js frontend with a FastAPI backend and LLM-powered features — structured summarization, paper-grounded chat with memory, multi-paper comparison, and literature review generation — behind per-user authentication.

## What the app does

- Search papers from arXiv and Semantic Scholar
- Upload and parse PDF papers
- Generate structured summaries (problem, methodology, results, limitations, conclusion) with Groq
- Chat with a paper using hybrid retrieval-augmented generation (semantic + keyword search)
- Persist chat history per paper, with conversational memory for follow-up questions
- Save papers to a personal library with tags and notes
- Compare 2–3 papers side by side across key dimensions
- Generate a thematic literature review from saved papers, exportable as Markdown
- Register, log in, and manage authenticated, per-user data ownership
- Background processing — summaries and RAG indexes build right after upload, not on first request

## Tech stack

- **Frontend:** Next.js 14 (App Router), React, TypeScript, Tailwind CSS, lucide-react, sonner (toasts), IBM Plex font family
- **Backend:** FastAPI, SQLAlchemy, Pydantic, SlowAPI (rate limiting), PyJWT + bcrypt (auth)
- **AI/ML:** Groq (Llama 3.3 70B), sentence-transformers (`multi-qa-mpnet-base-dot-v1`), ChromaDB (vector store), rank-bm25 (keyword retrieval)
- **Data sources:** arXiv API, Semantic Scholar API
- **Storage:** MySQL (relational data), Chroma (vector embeddings, persisted locally)

## Project structure
backend/
app/
core/          # security (JWT/bcrypt), auth dependency, rate limiter
models/         # SQLAlchemy models: User, Paper, PaperTag, PaperNote, ChatMessage
routers/        # auth, search, upload, summarize, chat, library, compare, lit_review
schemas/        # Pydantic request/response models
services/       # arxiv_client, semantic_scholar_client, pdf_parser, groq_client,
# embeddings, vector_store, hybrid_retrieval, indexing, background_jobs
utils/          # chunking
tests/            # health check tests
frontend/
app/              # routes: /, /search, /upload, /paper/[id], /paper/[id]/chat,
# /library, /compare, /lit-review, /login, /register
components/       # Navbar, Button, Badge, Skeleton, PaperCard, SearchBar, ChatBox
lib/               # api.ts, auth.ts, toast.ts, utils.ts

## Architecture overview

The platform follows a four-layer architecture:

1. **Frontend layer** — Next.js pages and components handle search, upload, chat, library, compare, and literature review flows, with JWT stored client-side and attached to every API request.
2. **API layer** — FastAPI routers expose authenticated endpoints for paper discovery, summarization, chat, library management, comparison, and literature review, with per-route rate limiting.
3. **Intelligence layer** — Groq (LLM), sentence-transformers (embeddings), and a hybrid BM25 + semantic retrieval pipeline generate summaries and answer questions grounded only in a paper's own content.
4. **Data layer** — MySQL stores users, papers, tags, notes, and chat history; Chroma persists vector embeddings per paper for retrieval.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- A running MySQL server
- A Groq API key ([console.groq.com](https://console.groq.com))

## Backend setup

```bash
cd backend
python -m venv venv
source venv/bin/activate      # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create the database in MySQL:

```sql
CREATE DATABASE research_assistant CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

Create a `.env` file in the `backend` directory:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=change-this-to-a-random-secret
DATABASE_URL=mysql+pymysql://root:your_mysql_password@localhost:3306/research_assistant
CHROMA_PERSIST_DIR=./chroma_data
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The backend is available at `http://localhost:8000`, with interactive docs at `http://localhost:8000/docs`. All tables are created automatically on startup.

## Frontend setup

```bash
cd frontend
npm install
```

Create a `.env.local` file in the `frontend` directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Run the dev server:

```bash
npm run dev
```

The frontend is available at `http://localhost:3000`.

## Typical workflow

1. Register or log in.
2. Search arXiv/Semantic Scholar, or upload a PDF.
3. A structured summary and RAG index are generated in the background right after upload.
4. Open the paper's chat page and ask questions — answers are grounded only in that paper's text, and the conversation is remembered across turns and page reloads.
5. Save useful papers to your library, adding tags and notes.
6. Select 2–3 saved papers to compare, or select several to generate a thematic literature review.

## API endpoints

| Endpoint | Method | Description |
|---|---|---|
| `/auth/register`, `/auth/login` | POST | Create an account / obtain a JWT |
| `/auth/me` | GET | Current authenticated user |
| `/search` | GET | Search arXiv + Semantic Scholar |
| `/upload` | POST | Upload a PDF, extract text, queue background processing |
| `/summarize/{paper_id}` | POST | Get or generate a structured summary |
| `/chat/{paper_id}` | POST | Ask a question about a paper (streamed via SSE) |
| `/chat/{paper_id}/history` | GET | Retrieve saved conversation for a paper |
| `/library`, `/library/save`, `/library/{paper_id}` | GET/POST/DELETE | Manage saved papers |
| `/library/{paper_id}/tag`, `/library/{paper_id}/note` | POST | Add tags / notes |
| `/compare` | POST | Compare 2–3 papers across key dimensions |
| `/lit-review` | POST | Generate a thematic literature review |
| `/health` | GET | Health check |

## Notes

- All paper, library, and chat data is scoped per authenticated user.
- `/chat` is rate-limited to 10 requests/minute and `/lit-review` to 5 requests/minute per client, to control LLM API cost.
- Retrieval combines semantic search (sentence-transformers + Chroma) with BM25 keyword search via Reciprocal Rank Fusion, for more reliable answers on both broad and technical questions.
- Chat responses stream token-by-token over Server-Sent Events and are persisted to MySQL once complete.
- Embeddings are persisted locally under the backend's Chroma data directory and are rebuilt automatically if missing.

## Possible next steps

- Deploy frontend to Vercel and backend to Render
- Dark mode
- Citation-grounded answers (link a chat answer back to its source section in the PDF)
- Cross-encoder re-ranking for retrieval