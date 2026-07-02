"use client";

import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getLibrary, generateLitReview } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

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
      .catch((err) => {
        console.error(err);
        setError("Could not load your library. Please refresh the page.");
      })
      .finally(() => setLoadingLibrary(false));
  }, []);

  function toggleSelect(paperId: string) {
    setSelected((prev) =>
      prev.includes(paperId) ? prev.filter((id) => id !== paperId) : [...prev, paperId]
    );
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
    // Optional: Add a brief toast or visual feedback here if you want
  }

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50/30 py-10 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Literature Review Generator</h1>
            <p className="mt-2 text-sm text-gray-500">
              Synthesize findings across multiple papers to create a cohesive literature review.
            </p>
          </div>

          {/* Error and Loading States */}
          {error && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-100 mb-6">
              <p className="text-sm text-red-600 font-medium">{error}</p>
            </div>
          )}

          {loadingLibrary ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Loading your library...</p>
            </div>
          ) : papers.length === 0 && !error ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900">No papers available</h3>
              <p className="mt-1 text-sm text-gray-500">Save some papers from the search page to generate a review.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Configuration Controls */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Step 1: Select Papers */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-semibold text-gray-900">1. Select Papers</h2>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                      {selected.length} selected
                    </span>
                  </div>
                  
                  <div className="max-h-72 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {papers.map((paper) => {
                      const isSelected = selected.includes(paper.paper_id);
                      return (
                        <label 
                          key={paper.paper_id} 
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                            isSelected ? "border-slate-400 bg-slate-50/50 ring-1 ring-slate-400" : "border-gray-100 hover:border-gray-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleSelect(paper.paper_id)}
                            className="mt-0.5 h-4 w-4 rounded border-gray-300 text-slate-900 focus:ring-slate-900 transition-all cursor-pointer"
                          />
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${isSelected ? "text-slate-900" : "text-gray-700"}`}>
                              {paper.title}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">
                              {paper.year ?? "n.d."}
                            </p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                  {selected.length > 0 && selected.length < 2 && (
                    <p className="text-xs text-amber-600 mt-3 font-medium">Select at least 1 more paper.</p>
                  )}
                </div>

                {/* Step 2: Topic & Action */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                  <h2 className="text-base font-semibold text-gray-900 mb-4">2. Generation Settings</h2>
                  
                  <div className="mb-5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                      Optional Focus Topic
                    </label>
                    <input
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g., 'evaluation methods', 'limitations'"
                      className="block w-full rounded-xl border-0 py-2.5 px-3.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-slate-900 sm:text-sm transition-all"
                    />
                  </div>

                  <button
                    onClick={handleGenerate}
                    disabled={selected.length < 2 || loading}
                    className="w-full flex justify-center items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        Generating Review...
                      </>
                    ) : markdown ? (
                      "Regenerate Review"
                    ) : (
                      "Generate Review"
                    )}
                  </button>
                </div>
              </div>

              {/* Right Column: Generated Output */}
              <div className="lg:col-span-7">
                {markdown ? (
                  <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full animate-fadeIn">
                    
                    {/* Output Toolbar */}
                    <div className="bg-gray-50/80 border-b border-gray-100 px-5 py-3 flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Generated Document
                      </h3>
                      <div className="flex gap-2">
                        <button 
                          onClick={handleCopy} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 transition-colors border border-gray-200 bg-white"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                        <button 
                          onClick={handleExport} 
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-200/50 hover:text-gray-900 transition-colors border border-gray-200 bg-white"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                          Export .md
                        </button>
                      </div>
                    </div>
                    
                    {/* Markdown Content Area */}
                    <div className="p-6 sm:p-8 overflow-y-auto max-h-[700px] text-gray-800">
                      <ReactMarkdown
                        components={{
                          h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-3 mb-5 mt-2">{children}</h1>,
                          h2: ({ children }) => <h2 className="text-lg font-bold text-gray-900 mt-8 mb-3">{children}</h2>,
                          h3: ({ children }) => <h3 className="text-md font-semibold text-gray-900 mt-6 mb-2">{children}</h3>,
                          p: ({ children }) => <p className="text-sm leading-relaxed mb-4 text-gray-700">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc pl-5 space-y-2 mb-4 text-sm text-gray-700 marker:text-gray-400">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal pl-5 space-y-2 mb-4 text-sm text-gray-700 marker:text-gray-400">{children}</ol>,
                          li: ({ children }) => <li>{children}</li>,
                          strong: ({ children }) => <strong className="font-semibold text-gray-900">{children}</strong>,
                          blockquote: ({ children }) => <blockquote className="border-l-4 border-slate-300 pl-4 italic text-gray-600 my-4 bg-slate-50 py-2 pr-2 rounded-r-lg">{children}</blockquote>,
                        }}
                      >
                        {markdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50/50 border border-gray-200 border-dashed rounded-2xl h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 p-6">
                    <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-sm font-medium text-gray-500">Your generated review will appear here</p>
                    <p className="text-xs mt-1 text-center max-w-xs">Select at least 2 papers and click generate to synthesize a literature review.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}