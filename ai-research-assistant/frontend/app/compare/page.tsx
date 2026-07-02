"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { comparePapers } from "@/lib/api";
import ProtectedRoute from "@/components/ProtectedRoute";

interface CompareRow {
  dimension: string;
  values: Record<string, string>;
}

interface CompareResult {
  papers: { paper_id: string; title: string }[];
  rows: CompareRow[];
}

function ComparePageInner() {
  const searchParams = useSearchParams();
  const ids = (searchParams.get("ids") || "").split(",").filter(Boolean);

  const [result, setResult] = useState<CompareResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ids.length < 2) {
      setError("Select at least 2 papers from your library to compare.");
      setLoading(false);
      return;
    }
    setLoading(true);
    comparePapers(ids)
      .then((data) => setResult(data as CompareResult))
      .catch(() => setError("Could not generate a comparison."))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids.join(",")]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-xl font-medium mb-4">Compare papers</h1>

      {loading && <p className="text-sm text-gray-400">Comparing… this can take a few seconds.</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {result && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr>
                <th className="text-left border-b border-gray-200 p-2 w-40">Dimension</th>
                {result.papers.map((p) => (
                  <th key={p.paper_id} className="text-left border-b border-gray-200 p-2">
                    {p.title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {result.rows.map((row) => (
                <tr key={row.dimension}>
                  <td className="border-b border-gray-100 p-2 font-medium align-top">{row.dimension}</td>
                  {result.papers.map((p) => (
                    <td key={p.paper_id} className="border-b border-gray-100 p-2 align-top">
                      {row.values[p.paper_id] || "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}

export default function ComparePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<main className="max-w-4xl mx-auto p-6"><p className="text-sm text-gray-400">Loading…</p></main>}>
        <ComparePageInner />
      </Suspense>
    </ProtectedRoute>
  );
}