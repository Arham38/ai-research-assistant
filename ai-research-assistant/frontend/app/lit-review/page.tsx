"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getLibrary, generateLitReview } from "@/lib/api";

interface LibraryItem {
  paper_id: string;
  title: string;
  authors: string[];
  year?: number;
}

export default function LitReviewPage() {
  const [papers, setPapers] = useState<LibraryItem[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingLibrary, setLoadingLibrary] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getLibrary()
      .then((data) => setPapers(data as LibraryItem[]))
      .finally(() => setLoadingLibrary(false));
  }, []);

  function toggleSelect(paperId: string) {
    setSelected((prev) => (prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]));
  }

  async function handleGenerate() {
    if (selected.length < 2) return;
    setLoading(true);
    setError("");
    try {
      const data = (await generateLitReview(selected, topic || undefined)) as { markdown: string };
      setMarkdown(data.markdown);
    } catch (err) {
      console.error(err);
      setError("Could not generate the literature review. Try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleExport() {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "literature-review.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleCopy() {
    navigator.clipboard.writeText(markdown);
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-medium mb-4">Literature review generator</h1>

      {loadingLibrary && <p className="text-sm text-gray-400">Loading your library…</p>}
      {!loadingLibrary && papers.length === 0 && (
        <p className="text-sm text-gray-400">No saved papers yet. Save some from the search page first.</p>
      )}

      {papers.length > 0 && (
        <>
          <div className="space-y-2 mb-4">
            {papers.map((paper) => (
              <label key={paper.paper_id} className="flex items-start gap-2 text-sm border border-gray-200 rounded-lg p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(paper.paper_id)}
                  onChange={() => toggleSelect(paper.paper_id)}
                  className="mt-1"
                />
                <span>
                  {paper.title}
                  <span className="text-gray-400"> · {paper.year ?? "n.d."}</span>
                </span>
              </label>
            ))}
          </div>

          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Optional focus/topic (e.g. 'evaluation methods')"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm mb-3"
          />

          <button
            onClick={handleGenerate}
            disabled={selected.length < 2 || loading}
            className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Generating…" : markdown ? "Regenerate" : `Generate (${selected.length} selected)`}
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-600 mt-3">{error}</p>}

      {markdown && (
        <div className="mt-6">
          <div className="flex gap-3 mb-3">
            <button onClick={handleCopy} className="text-sm text-gray-600 underline">
              Copy as markdown
            </button>
            <button onClick={handleExport} className="text-sm text-gray-600 underline">
              Download .md
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-5 space-y-3 text-sm text-gray-800">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-lg font-semibold mt-4 mb-2">{children}</h1>,
                h2: ({ children }) => <h2 className="text-base font-semibold mt-4 mb-2">{children}</h2>,
                h3: ({ children }) => <h3 className="text-sm font-semibold mt-3 mb-1">{children}</h3>,
                p: ({ children }) => <p className="leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc pl-5 space-y-1">{children}</ul>,
                li: ({ children }) => <li>{children}</li>,
              }}
            >
              {markdown}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </main>
  );
}