# PHASE 2/3/4/5: all LLM calls (summarize, RAG chat, compare, lit review) go through here
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)
MODEL = "llama-3.3-70b-versatile"


def summarize_text(text: str) -> dict:
    # TODO: prompt Groq for structured JSON summary (problem/method/results/limitations)
    raise NotImplementedError


def answer_with_context(question: str, context_chunks: list[str]) -> str:
    # TODO: PHASE 3 — answer ONLY from context_chunks, say "not found in this paper" otherwise
    raise NotImplementedError
