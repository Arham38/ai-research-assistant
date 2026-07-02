import { Search, MessageSquareText, GitCompare } from "lucide-react";
import Button from "@/components/Button";

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-6">
      <section className="grid md:grid-cols-2 gap-10 items-center py-16 md:py-24">
        <div>
          <p className="font-mono text-[11px] tracking-wider text-citation mb-3">PAPER INTELLIGENCE</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-[1.1]">
            Ask your papers anything.
          </h1>
          <p className="text-ink-light mt-4 text-base leading-relaxed max-w-md">
            Upload a PDF or search arXiv, get a structured summary in seconds, then
            ask follow-up questions — answered only from that paper's own text.
          </p>
          <div className="flex flex-wrap gap-3 mt-7">
            <Button href="/search" variant="primary">Search papers</Button>
            <Button href="/upload" variant="secondary">Upload a PDF</Button>
          </div>
        </div>

        <div className="relative h-64 hidden md:block">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="absolute w-56 h-40 bg-paper-muted border border-margin rounded-card -rotate-6 translate-x-4" />
            <div className="absolute w-56 h-40 bg-white border border-margin rounded-card rotate-3 -translate-x-2" />
            <div className="corner-fold relative w-56 h-40 bg-white border border-margin rounded-card shadow-sm p-4">
              <div className="font-mono text-[9px] text-ink-faint tracking-wider mb-2">ARXIV · 2026</div>
              <div className="h-2.5 w-4/5 bg-margin rounded-sm mb-2" />
              <div className="relative h-2 w-full bg-paper-muted rounded-sm mb-1.5 overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-highlighter-soft animate-highlight-sweep rounded-sm" />
              </div>
              <div className="h-2 w-11/12 bg-paper-muted rounded-sm mb-1.5" />
              <div className="h-2 w-2/3 bg-paper-muted rounded-sm" />
            </div>
          </div>
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 pb-20">
        <div className="border border-margin rounded-card p-5">
          <Search size={18} className="text-citation mb-3" />
          <p className="font-mono text-[10px] tracking-wider text-ink-faint mb-1">SEARCH</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Pull papers directly from arXiv and Semantic Scholar without leaving the page.
          </p>
        </div>
        <div className="border border-margin rounded-card p-5">
          <MessageSquareText size={18} className="text-citation mb-3" />
          <p className="font-mono text-[10px] tracking-wider text-ink-faint mb-1">UNDERSTAND</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Get a structured summary, then chat with the paper — answers stay grounded in its text.
          </p>
        </div>
        <div className="border border-margin rounded-card p-5">
          <GitCompare size={18} className="text-citation mb-3" />
          <p className="font-mono text-[10px] tracking-wider text-ink-faint mb-1">SYNTHESIZE</p>
          <p className="text-sm text-ink-light leading-relaxed">
            Compare papers side by side, or generate a literature review across your saved library.
          </p>
        </div>
      </section>
    </main>
  );
}