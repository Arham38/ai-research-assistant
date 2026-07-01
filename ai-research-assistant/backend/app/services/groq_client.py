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

MAX_CHARS = 15000  # keep the prompt within Groq's context window


def summarize_text(text: str) -> dict:
    truncated = text[:MAX_CHARS]
    prompt = SUMMARY_PROMPT.format(text=truncated)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=2000,  # was 1000 — too small, caused truncated/invalid JSON
        response_format={"type": "json_object"},  # forces Groq to return valid JSON only
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed = json.loads(raw)
        # ensure all expected keys exist even if the model skipped one
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