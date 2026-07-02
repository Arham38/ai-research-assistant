"use client";

import { useEffect, useState } from "react";
import { summarizePaper } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface Summary {
  problem_statement: string;
  methodology: string;
  key_results: string;
  limitations: string;
  conclusion: string;
}

const SECTIONS: { key: keyof Summary; label: string }[] = [
  { key: "problem_statement", label: "Problem Statement" },
  { key: "methodology", label: "Methodology" },
  { key: "key_results", label: "Key Results" },
  { key: "limitations", label: "Limitations" },
  { key: "conclusion", label: "Conclusion" },
];

export default function PaperDetailPage({ params }: { params: { id: string } }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    summarizePaper(params.id)
      .then((data) => {
        if (!cancelled) setSummary(data as Summary);
      })
      .catch(() => {
        if (!cancelled) setError("Could not generate a summary for this paper.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [params.id]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Paper Summary</h1>
              <p className="text-sm text-gray-500 mt-1">AI-generated insights from your uploaded document.</p>
            </div>
            <a 
              href={`/paper/${params.id}/chat`} 
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm"
            >
              <span>Chat with paper</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-8 h-8 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-sm text-gray-500 font-medium">Synthesizing paper insights...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Content Sections */}
          {summary && (
            <div className="space-y-6">
              {SECTIONS.map(({ key, label }) => (
                <div key={key} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                  <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                    {label}
                  </h2>
                  <p className="text-sm text-gray-600 leading-relaxed text-justify">
                    {summary[key]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </ProtectedRoute>
  );
}