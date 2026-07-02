# AI Research Assistant

AI Research Assistant is a full-stack research workspace for discovering, understanding, and comparing academic papers. The app combines a Next.js frontend with a FastAPI backend and LLM-powered features such as summarization, paper-grounded chat, comparison, and literature review generation.

## What the app does

- Search papers from arXiv and Semantic Scholar
- Upload and parse PDF papers
- Generate structured summaries with Groq
- Chat with a paper using retrieval-augmented generation (RAG)
- Save papers to a personal library
- Compare papers side by side
- Create literature review summaries from saved papers
- Register, log in, and manage authenticated sessions

## Tech stack

- Frontend: Next.js 14, React, Tailwind CSS, TypeScript
- Backend: FastAPI, SQLAlchemy, Pydantic, SlowAPI
- AI/ML: Groq, sentence-transformers, Chroma vector store
- Data sources: arXiv API, Semantic Scholar API
- Storage: SQLite by default, with Chroma persistence for embeddings

## Project structure

- backend/app: FastAPI application, routers, services, models, and schemas
- backend/tests: basic health checks
- frontend/app: app routes and pages
- frontend/components: reusable UI components
- frontend/lib: API/auth helpers and shared frontend utilities

## Architecture overview

The platform follows a simple three-layer architecture:

1. Frontend layer: Next.js pages and components provide the user experience for search, upload, chat, library, compare, and literature review flows.
2. API layer: FastAPI routers expose endpoints for authentication, paper discovery, summarization, chat, library management, and comparison.
3. Intelligence layer: backend services connect to Groq, embedding models, and vector storage to generate summaries and answer questions grounded in paper content.

## Prerequisites

- Python 3.10+
- Node.js 18+
- npm
- A Groq API key

## Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the backend directory with values such as:

```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=change-this-secret
DATABASE_URL=sqlite:///./research_assistant.db
CHROMA_PERSIST_DIR=./chroma_data
```

Run the API:

```bash
uvicorn app.main:app --reload
```

The backend will be available at http://localhost:8000.

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at http://localhost:3000.

## Typical workflow

1. Open the app and register or log in.
2. Search for papers or upload a PDF.
3. Summarize a paper and ask follow-up questions.
4. Save useful papers to your library.
5. Compare papers or generate a literature review from your saved set.

## Notes

- The default database is SQLite for local development.
- Embeddings and vector storage are persisted under the backend Chroma data directory.
- The API includes rate limiting and CORS configuration for local frontend development.

