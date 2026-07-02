"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getLibrary, removeFromLibrary, addTag, setNote as saveNote } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

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
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({});
  const router = useRouter();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = (await getLibrary()) as LibraryItem[];
      setPapers(data);
    } catch (err) {
      console.error("Failed to load library:", err);
      setError("Could not load your library. Try refreshing the page.");
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
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50/30 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">Your Library</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your saved papers, add notes, and organize with tags.</p>
            </div>
            
            <button 
              onClick={goToCompare} 
              disabled={selected.length < 2} 
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
            >
              Compare selected ({selected.length}/3)
              {selected.length >= 2 && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Status Messages */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Loading your library...</p>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 mb-6">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {!loading && !error && papers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">Your library is empty</h3>
              <p className="mt-1 text-sm text-gray-500">Go to the search page to find and save academic papers.</p>
              <Link href="/search" className="mt-4 inline-block text-sm font-medium text-slate-900 hover:text-slate-700 underline underline-offset-4">
                Start searching
              </Link>
            </div>
          )}

          {/* Library Cards */}
          <div className="space-y-5">
            {papers.map((paper) => (
              <div 
                key={paper.paper_id} 
                className={`bg-white border rounded-2xl p-5 sm:p-6 shadow-sm transition-all ${
                  selected.includes(paper.paper_id) ? "border-slate-400 ring-1 ring-slate-400 bg-slate-50/30" : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-4">
                  
                  {/* Custom Checkbox */}
                  <div className="pt-1">
                    <input 
                      type="checkbox" 
                      checked={selected.includes(paper.paper_id)} 
                      onChange={() => toggleSelect(paper.paper_id)} 
                      className="h-5 w-5 rounded border-gray-300 text-slate-900 focus:ring-slate-900 cursor-pointer transition-all" 
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-lg leading-tight">{paper.title}</h3>
                    <p className="text-sm text-gray-500 mt-1.5">
                      {paper.authors.slice(0, 3).join(", ")}{paper.authors.length > 3 ? " et al." : ""} 
                      <span className="mx-1.5">·</span> {paper.year ?? "n.d."} 
                      <span className="mx-1.5">·</span> {paper.source}
                    </p>
                    
                    {paper.abstract && (
                      <p className="text-sm text-gray-600 mt-3 leading-relaxed">
                        {paper.abstract.slice(0, 220)}...
                      </p>
                    )}

                    {/* Tags Area */}
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {paper.tags.map((tag) => (
                        <span key={tag} className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 border border-gray-200/60">
                          {tag}
                        </span>
                      ))}
                      
                      {/* Add Tag Input */}
                      <div className="flex items-center gap-2 ml-1">
                        <input
                          type="text"
                          placeholder="+ Add tag"
                          value={tagInputs[paper.paper_id] || ""}
                          onChange={(e) => setTagInputs((prev) => ({ ...prev, [paper.paper_id]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && handleAddTag(paper.paper_id)}
                          className="block w-28 rounded-md border-0 py-1 px-2.5 text-xs text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 transition-all bg-gray-50"
                        />
                        {tagInputs[paper.paper_id]?.trim() && (
                          <button 
                            onClick={() => handleAddTag(paper.paper_id)} 
                            className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md transition-all"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Notes Area */}
                    <div className="mt-4">
                      <label className="sr-only">Notes</label>
                      <textarea
                        defaultValue={paper.note}
                        placeholder="Add your personal notes or takeaways here..."
                        onBlur={(e) => handleNoteBlur(paper.paper_id, e.target.value)}
                        className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm bg-gray-50/50 resize-y transition-all"
                        rows={2}
                      />
                    </div>

                    {/* Card Footer Actions */}
                    <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-gray-100">
                      <button 
                        onClick={() => handleRemove(paper.paper_id)} 
                        className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                      >
                        Remove from library
                      </button>
                      
                      {paper.has_summary && (
                        <Link 
                          href={`/paper/${paper.paper_id}`} 
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 hover:text-slate-700 transition-colors"
                        >
                          View full summary
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </Link>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
    </ProtectedRoute>
  );
}