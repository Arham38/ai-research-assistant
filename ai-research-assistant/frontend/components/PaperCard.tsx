interface PaperCardProps {
  title: string;
  authors: string[];
  year?: number;
  abstract: string;
  source: string;
  pdfUrl?: string;
}

export default function PaperCard({ title, authors, year, abstract, source, pdfUrl }: PaperCardProps) {
  const truncated = abstract.length > 220 ? abstract.slice(0, 220) + "…" : abstract;

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition">
      <h3 className="font-medium text-base">{title}</h3>
      <p className="text-xs text-gray-500 mt-1">
        {authors.slice(0, 3).join(", ")}{authors.length > 3 ? " et al." : ""} · {year ?? "n.d."} · {source}
      </p>
      <p className="text-sm text-gray-700 mt-2">{truncated}</p>
      {pdfUrl && (
        <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 mt-2 inline-block">
          View PDF →
        </a>
      )}
    </div>
  );
}