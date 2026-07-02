"use client";

import { useState } from "react";
import { ExternalLink, BookmarkPlus, BookmarkCheck } from "lucide-react";
import Badge from "./Badge";
import { notify } from "@/lib/toast";

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

export default function PaperCard({ title, authors, year, abstract, source, pdfUrl, onSave }: PaperCardProps) {
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const truncated = abstract.length > 220 ? abstract.slice(0, 220) + "…" : abstract;

  async function handleSave() {
    if (!onSave || isSaved) return;
    setSaving(true);
    try {
      await onSave();
      setIsSaved(true);
      notify.success("Saved to library");
    } catch {
      notify.error("Could not save this paper");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className={`corner-fold bg-white border rounded-card p-4 transition-colors animate-card-rise ${
        isSaved ? "border-margin border-l-4 border-l-highlighter" : "border-margin hover:border-ink-light"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge source={source} />
        <span className="font-mono text-[10px] text-ink-faint">{year ?? "N.D."}</span>
      </div>

      <h3 className="font-display font-semibold text-base leading-snug text-ink">{title}</h3>
      <p className="text-xs text-ink-faint mt-1">
        {authors.slice(0, 3).join(", ")}
        {authors.length > 3 ? " et al." : ""}
      </p>
      <p className="text-sm text-ink-light mt-2 leading-relaxed">{truncated}</p>

      <div className="flex items-center gap-4 mt-3">
        {pdfUrl && (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-citation hover:underline"
          >
            View PDF <ExternalLink size={13} />
          </a>
        )}
        {onSave && (
          <button
            onClick={handleSave}
            disabled={saving || isSaved}
            className="inline-flex items-center gap-1 text-sm text-ink-faint hover:text-ink disabled:opacity-70"
          >
            {isSaved ? <BookmarkCheck size={14} fill="#F5C518" className="text-ink" /> : <BookmarkPlus size={14} />}
            {isSaved ? "Saved" : saving ? "Saving…" : "Save"}
          </button>
        )}
      </div>
    </div>
  );
}