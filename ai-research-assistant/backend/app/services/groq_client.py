import json
from groq import Groq
from app.config import settings

client = Groq(api_key=settings.groq_api_key)
MODEL = "llama-3.3-70b-versatile"

SUMMARY_PROMPT = """You are a research paper analyst. Read the following paper text and produce a structured summary.

Respond with ONLY a valid JSON object, no preamble, no markdown code fences, in exactly this shape:
{{
  "problem_statement": "...",
  "methodology": "...",
  "key_results": "...",
  "limitations": "...",
  "conclusion": "..."
}}

Each field should be 1-2 concise sentences, written in your own words, based only on the text below.
Keep the entire JSON response under 600 words total.

PAPER TEXT:
{text}
"""

MAX_CHARS = 15000


def summarize_text(text: str) -> dict:
    truncated = text[:MAX_CHARS]
    prompt = SUMMARY_PROMPT.format(text=truncated)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed = json.loads(raw)
        return {
            "problem_statement": parsed.get("problem_statement", ""),
            "methodology": parsed.get("methodology", ""),
            "key_results": parsed.get("key_results", ""),
            "limitations": parsed.get("limitations", ""),
            "conclusion": parsed.get("conclusion", ""),
        }
    except json.JSONDecodeError:
        return {
            "problem_statement": "Could not parse a structured summary from the model output.",
            "methodology": "",
            "key_results": "",
            "limitations": "",
            "conclusion": raw[:500],
        }


CHAT_PROMPT = """You are answering questions about a specific research paper, using only the context excerpts below.

Rules:
- Base your answer only on the context excerpts — do not invent facts not present in them.
- You MAY synthesize and paraphrase across multiple excerpts to form a complete answer, even if no single excerpt fully answers the question on its own.
- Only say "I couldn't find that in this paper" if the excerpts genuinely contain nothing relevant to the question.
- Be concise and direct.

CONTEXT EXCERPTS:
{context}

QUESTION:
{question}
"""


def answer_with_context_stream(question: str, context_chunks: list[str]):
    context = "\n\n---\n\n".join(context_chunks)
    prompt = CHAT_PROMPT.format(context=context, question=question)

    stream = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2,
        max_tokens=800,
        stream=True,
    )

    for chunk in stream:
        delta = chunk.choices[0].delta.content
        if delta:
            yield delta