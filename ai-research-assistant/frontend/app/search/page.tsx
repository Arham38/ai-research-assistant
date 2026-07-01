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
    setLoading(true);
    setQuery(q);
    try {
      const data = (await searchPapers(q, pageNum)) as Paper[];
      setResults(pageNum === 1 ? data : [...results, ...data]);
      setPage(pageNum);
    } catch (err) {
      console.error("Search failed:", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-medium mb-4">Search papers</h1>
      <SearchBar onSearch={(q) => runSearch(q, 1)} />

      <div className="mt-6 space-y-3">
        {loading && results.length === 0 && <p className="text-sm text-gray-400">Searching…</p>}
        {!loading && results.length === 0 && query && (
          <p className="text-sm text-gray-400">No papers found for "{query}".</p>
        )}

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

      {results.length > 0 && (
        <button onClick={() => runSearch(query, page + 1)} disabled={loading} className="mt-4 text-sm text-gray-600 underline disabled:opacity-50">
          {loading ? "Loading…" : "Load more"}
        </button>
      )}
    </main>
  );
}