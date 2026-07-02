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


CHAT_PROMPT = """You are answering questions about a specific research paper, using only the context excerpts below and the recent conversation for continuity.

Rules:
- Base your answer only on the context excerpts — do not invent facts not present in them.
- You MAY synthesize and paraphrase across multiple excerpts to form a complete answer, even if no single excerpt fully answers the question on its own.
- Use the recent conversation only to understand what words like "it", "that", or "more" refer to — never as a source of facts.
- Only say "I couldn't find that in this paper" if the excerpts genuinely contain nothing relevant to the question.
- Be concise and direct.

RECENT CONVERSATION:
{history}

CONTEXT EXCERPTS:
{context}

QUESTION:
{question}
"""


def answer_with_context_stream(question: str, context_chunks: list[str], history: list[dict] | None = None):
    context = "\n\n---\n\n".join(context_chunks)
    history_text = "\n".join(f'{m["role"]}: {m["content"]}' for m in (history or [])) or "(no earlier messages)"
    prompt = CHAT_PROMPT.format(history=history_text, context=context, question=question)

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


COMPARE_PROMPT = """Compare the following research papers across these dimensions: Methodology, Dataset/Data Used, Key Results, Limitations.

Respond with ONLY a valid JSON object, no preamble, no markdown fences, in exactly this shape:
{{
  "rows": [
    {{"dimension": "Methodology", "values": {{"paper_id_1": "...", "paper_id_2": "..."}}}},
    {{"dimension": "Dataset/Data Used", "values": {{"paper_id_1": "...", "paper_id_2": "..."}}}},
    {{"dimension": "Key Results", "values": {{"paper_id_1": "...", "paper_id_2": "..."}}}},
    {{"dimension": "Limitations", "values": {{"paper_id_1": "...", "paper_id_2": "..."}}}}
  ]
}}

Use the exact paper_id values given below as the keys inside "values" for every row.
Each value should be 1 concise sentence, in your own words, based only on the paper content below.

PAPERS:
{papers}
"""


def compare_papers(papers: list[dict]) -> list[dict]:
    papers_text = "\n\n".join(
        f'paper_id "{p["paper_id"]}" (title: {p["title"]}):\n{p["text"][:2500]}' for p in papers
    )
    prompt = COMPARE_PROMPT.format(papers=papers_text)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=1500,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()
    raw = raw.removeprefix("```json").removeprefix("```").removesuffix("```").strip()

    try:
        parsed = json.loads(raw)
        return parsed.get("rows", [])
    except json.JSONDecodeError:
        return [{"dimension": "Error", "values": {"note": "Could not parse comparison output."}}]


LIT_REVIEW_PROMPT = """You are writing an academic literature review based on the paper summaries below.

{topic_line}

Write the review in well-structured Markdown with these elements:
- A short introductory paragraph framing the research area{topic_clause}
- Group the papers thematically (not one-by-one) — identify 2-4 themes/approaches across the papers and discuss each theme in its own subsection (use ## headings)
- A section titled "Gaps and Contradictions" identifying disagreements, gaps, or open questions across the papers
- A closing summary paragraph

Write in an academic, third-person tone. Do not invent facts not present in the summaries below. Refer to papers by their title in-line when discussing them (no fabricated citation numbers).

PAPER SUMMARIES:
{papers}
"""


def generate_lit_review(summaries: list[dict], topic: str | None = None) -> str:
    papers_text = "\n\n".join(
        f"Title: {s['title']}\n"
        f"Problem: {s['summary'].get('problem_statement', '')}\n"
        f"Methodology: {s['summary'].get('methodology', '')}\n"
        f"Key Results: {s['summary'].get('key_results', '')}\n"
        f"Limitations: {s['summary'].get('limitations', '')}\n"
        f"Conclusion: {s['summary'].get('conclusion', '')}"
        for s in summaries
    )

    topic_line = f'Focus the review specifically on the theme: "{topic}"' if topic else ""
    topic_clause = f' with a focus on "{topic}"' if topic else ""

    prompt = LIT_REVIEW_PROMPT.format(topic_line=topic_line, topic_clause=topic_clause, papers=papers_text)

    response = client.chat.completions.create(
        model=MODEL,
        messages=[{"role": "user", "content": prompt}],
        temperature=0.4,
        max_tokens=2500,
    )

    return response.choices[0].message.content.strip()