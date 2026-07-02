export function SkeletonCard() {
  return (
    <div className="border border-margin rounded-card p-4 animate-pulse">
      <div className="h-3 w-24 bg-margin rounded-sm mb-3" />
      <div className="h-4 w-3/4 bg-margin rounded-sm mb-2" />
      <div className="h-4 w-1/2 bg-margin rounded-sm mb-4" />
      <div className="h-3 w-full bg-paper-muted rounded-sm mb-1.5" />
      <div className="h-3 w-full bg-paper-muted rounded-sm mb-1.5" />
      <div className="h-3 w-2/3 bg-paper-muted rounded-sm" />
    </div>
  );
}