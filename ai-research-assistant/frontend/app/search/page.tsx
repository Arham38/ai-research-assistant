"use client";

import { useState } from "react";
import { FileSearch } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import PaperCard from "@/components/PaperCard";
import Button from "@/components/Button";
import { SkeletonCard } from "@/components/Skeleton";
import { searchPapers, saveToLibrary } from "@/lib/api";
import { notify } from "@/lib/toast";

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
  const [searched, setSearched] = useState(false);

  async function runSearch(q: string, pageNum = 1) {
    setLoading(true);
    setQuery(q);
    setSearched(true);
    try {
      const data = (await searchPapers(q, pageNum)) as Paper[];
      setResults(pageNum === 1 ? data : [...results, ...data]);
      setPage(pageNum);
    } catch (err) {
      console.error("Search failed:", err);
      notify.error("Search failed — check your connection and try again");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-10">
      <p className="font-mono text-[11px] tracking-wider text-ink-faint mb-1">SEARCH</p>
      <h1 className="font-display text-2xl font-semibold text-ink mb-5">Find a paper</h1>

      <SearchBar onSearch={(q) => runSearch(q, 1)} />

      <div className="mt-6 space-y-3">
        {loading && results.length === 0 && (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        )}

        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center text-center py-16 border border-dashed border-margin rounded-card">
            <FileSearch size={28} className="text-ink-faint mb-3" />
            <p className="text-sm text-ink-light">Nothing matched "{query}".</p>
            <p className="text-xs text-ink-faint mt-1">Try a broader or different term.</p>
          </div>
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
        <div className="mt-5">
          <Button variant="secondary" onClick={() => runSearch(query, page + 1)} disabled={loading}>
            {loading ? "Loading…" : "Load more"}
          </Button>
        </div>
      )}
    </main>
  );
}