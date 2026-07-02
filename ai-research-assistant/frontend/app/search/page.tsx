"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import PaperCard from "@/components/PaperCard";
import { searchPapers, saveToLibrary } from "@/lib/api";

interface Paper {
  paper_id: string;
  title: string;
  authors: string[];
  abstract: string;
  year?: number;
  source: string;
  pdf_url?: string;
}

export default function SearchPage() {
  const [results, setResults] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  async function runSearch(q: string, pageNum = 1) {
    if (!q.trim()) return;
    setLoading(true);
    setQuery(q);
    try {
      const data = (await searchPapers(q, pageNum)) as Paper[];
      setResults(pageNum === 1 ? data : [...results, ...data]);
      setPage(pageNum);
    } catch (err) {
      console.error("Search failed:", err);
      if (pageNum === 1) setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50/30 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Search Area */}
        <div className="mb-10 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 mb-3">
            Discover Research
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            Search across millions of academic papers, extract abstracts, and build your library.
          </p>
          
          {/* We assume SearchBar component handles its own styling, but we wrap it in a slightly elevated div for consistency */}
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-200 focus-within:ring-2 focus-within:ring-slate-900 transition-all">
            <SearchBar onSearch={(q) => runSearch(q, 1)} />
          </div>
        </div>

        {/* Results Container */}
        <div className="space-y-5">
          {/* Status Messages */}
          {loading && results.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-gray-400">
              <div className="w-8 h-8 border-4 border-gray-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium">Searching databases...</p>
            </div>
          )}
          
          {!loading && results.length === 0 && query && (
            <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <svg className="mx-auto h-12 w-12 text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-sm font-medium text-gray-900">No papers found</h3>
              <p className="mt-1 text-sm text-gray-500">We couldn't find anything matching "{query}". Try different keywords.</p>
            </div>
          )}

          {/* Paper Cards List */}
          <div className="grid grid-cols-1 gap-5">
            {results.map((paper) => (
              <PaperCard
                key={paper.paper_id}
                paperId={paper.paper_id}
                title={paper.title}
                authors={paper.authors}
                year={paper.year}
                abstract={paper.abstract}
                source={paper.source}
                pdfUrl={paper.pdf_url}
                onSave={() =>
                  saveToLibrary({
                    paper_id: paper.paper_id,
                    title: paper.title,
                    authors: paper.authors,
                    abstract: paper.abstract,
                    year: paper.year,
                    source: paper.source,
                    pdf_url: paper.pdf_url,
                  })
                }
              />
            ))}
          </div>
        </div>

        {/* Load More Button */}
        {results.length > 0 && (
          <div className="mt-10 flex justify-center">
            <button 
              onClick={() => runSearch(query, page + 1)} 
              disabled={loading} 
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border border-gray-300 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-slate-900 disabled:opacity-50 transition-all"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin"></div>
                  Loading...
                </>
              ) : (
                "Load more results"
              )}
            </button>
          </div>
        )}
        
      </div>
    </main>
  );
}