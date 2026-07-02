interface BadgeProps {
  source: string;
}

const LABELS: Record<string, string> = {
  arxiv: "ARXIV",
  semantic_scholar: "SEMANTIC SCHOLAR",
  upload: "UPLOADED",
  search: "SAVED",
};

export default function Badge({ source }: BadgeProps) {
  const label = LABELS[source] || source.toUpperCase();
  return (
    <span className="inline-block font-mono text-[10px] tracking-wider text-ink-faint border border-margin rounded-sm px-1.5 py-0.5">
      {label}
    </span>
  );
}