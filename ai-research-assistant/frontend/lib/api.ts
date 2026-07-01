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
export async function uploadPdf(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
  return res.json();
}

export function summarizePaper(paperId: string) {
  return request(`/summarize/${paperId}`, { method: "POST" });
}

// PHASE 4
export function saveToLibrary(paper: {
  paper_id: string;
  title: string;
  authors: string[];
  abstract?: string;
  year?: number;
  source: string;
  pdf_url?: string;
}) {
  return request(`/library/save`, { method: "POST", body: JSON.stringify(paper) });
}

export function getLibrary() {
  return request(`/library`);
}

export function removeFromLibrary(paperId: string) {
  return request(`/library/${paperId}`, { method: "DELETE" });
}

export function addTag(paperId: string, tag: string) {
  return request(`/library/${paperId}/tag`, { method: "POST", body: JSON.stringify({ tag }) });
}

export function setNote(paperId: string, note: string) {
  return request(`/library/${paperId}/note`, { method: "POST", body: JSON.stringify({ note }) });
}

export function comparePapers(paperIds: string[]) {
  return request(`/compare`, { method: "POST", body: JSON.stringify({ paper_ids: paperIds }) });
}

// PHASE 5
export function generateLitReview(paperIds: string[], topic?: string) {
  return request(`/lit-review`, { method: "POST", body: JSON.stringify({ paper_ids: paperIds, topic }) });
}