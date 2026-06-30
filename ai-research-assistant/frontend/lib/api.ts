// Central API client — every component calls through here, never fetch() directly.

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

// PHASE 1
export function searchPapers(query: string, page = 1) {
  return request(`/search?query=${encodeURIComponent(query)}&page=${page}`);
}

// PHASE 2
export function summarizePaper(paperId: string) {
  return request(`/summarize/${paperId}`, { method: "POST" });
}

// PHASE 4
export function getLibrary() {
  return request(`/library`);
}
export function comparePapers(paperIds: string[]) {
  return request(`/compare`, { method: "POST", body: JSON.stringify({ paper_ids: paperIds }) });
}

// PHASE 5
export function generateLitReview(paperIds: string[], topic?: string) {
  return request(`/lit-review`, { method: "POST", body: JSON.stringify({ paper_ids: paperIds, topic }) });
}

// NOTE: Phase 3 chat uses Server-Sent Events, not this helper — handle separately in ChatBox.tsx
