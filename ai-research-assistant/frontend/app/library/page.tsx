"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLibrary, removeFromLibrary, addTag, setNote as saveNote } from "@/lib/api";

interface LibraryItem {
  paper_id: string;
  title: string;
  authors: string[];
  abstract?: string;
  year?: number;
  source: string;
  pdf_url?: string;
  tags: string[];
  note?: string;
  has_summary: boolean;
}

export default function LibraryPage() {
  const [papers, setPapers] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string[]>([]);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const router = useRouter();

  async function load() {
    setLoading(true);
    try {
      const data = (await getLibrary()) as LibraryItem[];
      setPapers(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function toggleSelect(paperId: string) {
    setSelected((prev) => {
      if (prev.includes(paperId)) return prev.filter((id) => id !== paperId);
      if (prev.length >= 3) return prev;
      return [...prev, paperId];
    });
  }

  async function handleRemove(paperId: string) {
    await removeFromLibrary(paperId);
    setPapers((prev) => prev.filter((p) => p.paper_id !== paperId));
    setSelected((prev) => prev.filter((id) => id !== paperId));
  }

  async function handleAddTag(paperId: string) {
    const tag = (tagInputs[paperId] || "").trim();
    if (!tag) return;
    const updated = (await addTag(paperId, tag)) as LibraryItem;
    setPapers((prev) => prev.map((p) => (p.paper_id === paperId ? updated : p)));
    setTagInputs((prev) => ({ ...prev, [paperId]: "" }));
  }

  async function handleNoteBlur(paperId: string, note: string) {
    const updated = (await saveNote(paperId, note)) as LibraryItem;
    setPapers((prev) => prev.map((p) => (p.paper_id === paperId ? updated : p)));
  }

  function goToCompare() {
    if (selected.length < 2) return;
    router.push(`/compare?ids=${selected.join(",")}`);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium">Your library</h1>
        <button onClick={goToCompare} disabled={selected.length < 2} className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50">
          Compare selected ({selected.length}/3)
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">Loading…</p>}
      {!loading && papers.length === 0 && (
        <p className="text-sm text-gray-400">No saved papers yet. Save some from the search page.</p>
      )}

      <div className="space-y-3">
        {papers.map((paper) => (
          <div key={paper.paper_id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <input type="checkbox" checked={selected.includes(paper.paper_id)} onChange={() => toggleSelect(paper.paper_id)} className="mt-1" />
              <div className="flex-1">
                <h3 className="font-medium text-base">{paper.title}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 ? " et al." : ""} · {paper.year ?? "n.d."} · {paper.source}
                </p>
                {paper.abstract && <p className="text-sm text-gray-700 mt-2">{paper.abstract.slice(0, 200)}…</p>}

                <div className="flex flex-wrap gap-1 mt-2">
                  {paper.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    placeholder="Add tag…"
                    value={tagInputs[paper.paper_id] || ""}
                    onChange={(e) => setTagInputs((prev) => ({ ...prev, [paper.paper_id]: e.target.value }))}
                    onKeyDown={(e) => e.key === "Enter" && handleAddTag(paper.paper_id)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 w-28"
                  />
                  <button onClick={() => handleAddTag(paper.paper_id)} className="text-xs text-gray-600 underline">
                    Add
                  </button>
                </div>

                <textarea
                  defaultValue={paper.note}
                  placeholder="Notes…"
                  onBlur={(e) => handleNoteBlur(paper.paper_id, e.target.value)}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2 mt-2"
                  rows={2}
                />

                <div className="flex gap-3 mt-2">
                  {paper.has_summary && (
                    <a href={`/paper/${paper.paper_id}`} className="text-sm text-blue-600 underline">
                      View summary →
                    </a>
                  )}
                  <button onClick={() => handleRemove(paper.paper_id)} className="text-sm text-red-600 underline">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}