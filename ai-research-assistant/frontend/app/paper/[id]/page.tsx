"use client";

import { useEffect, useState } from "react";
import { summarizePaper } from "@/lib/api";

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
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-medium mb-4">Paper Summary</h1>
      <a href={`/paper/${params.id}/chat`} className="text-sm text-blue-600 underline mb-4 inline-block">
        Chat with this paper →
      </a>

      {loading && <p className="text-sm text-gray-400">Generating summary… this can take a few seconds.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {summary && (
        <div className="space-y-4">
          {SECTIONS.map(({ key, label }) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <h2 className="font-medium text-sm text-gray-900">{label}</h2>
              <p className="text-sm text-gray-700 mt-1">{summary[key]}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}