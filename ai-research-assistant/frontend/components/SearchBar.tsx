"use client";

import { useState, useEffect, useRef } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [input, setInput] = useState("");
  const onSearchRef = useRef(onSearch);

  // keep latest onSearch without making the debounce effect depend on it
  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (input.trim()) onSearchRef.current(input.trim());
    }, 500);
    return () => clearTimeout(timer);
  }, [input]); // only re-runs when the user actually types

  return (
    <input
      type="text"
      value={input}
      onChange={(e) => setInput(e.target.value)}
      placeholder="Search papers (e.g. transformer attention)"
      className="w-full max-w-xl rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
    />
  );
}