"use client";

import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) onSearchRef.current(input.trim());
    }, 1000);
    return () => clearTimeout(timer);
  }, [input]);

  return (
    <div className="relative max-w-xl">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search papers — e.g. transformer attention"
        className="w-full rounded-card border border-margin bg-white pl-9 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-citation transition-colors"
      />
    </div>
  );
}