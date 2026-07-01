"use client";

import { useState } from "react";

interface PaperCardProps {
  paperId: string;
  title: string;
  authors: string[];
  year?: number;
  abstract: string;
  source: string;
  pdfUrl?: string;
  onSave?: () => Promise<unknown>;
}

export default function PaperCard({ paperId, title, authors, year, abstract, source, pdfUrl, onSave }: PaperCardProps) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const truncated = abstract.length > 220 ? abstract.slice(0, 220) + "…" : abstract;

  async function handleSave() {
    if (!onSave || isSaved) return;
    setSaving(true);
    try {
      await onSave();
      setIsSaved(true);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
      <h3 className="font-medium text-base">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {authors.slice(0, 3).join(", ")}{authors.length > 3 ? " et al." : ""} · {year ?? "n.d."} · {source}
      </p>
      <p className="text-sm text-gray-700 mt-2">{truncated}</p>
      <div className="flex items-center gap-4 mt-2">
        {pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 inline-block">
            View PDF →
          </a>
        )}
        {onSave && (
          <button onClick={handleSave} disabled={saving || isSaved} className="text-sm text-gray-600 underline disabled:opacity-50">
            {isSaved ? "Saved ✓" : saving ? "Saving…" : "Save to library"}
          </button>
        )}
      </div>
    </div>
  );
}