"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import PatternCard, { type PatternRow } from "./PatternCard";

interface PatternsGridProps {
  patterns: PatternRow[];
  onToggleFavourite: (patternId: string, isFavourite: boolean) => void;
}

const PAGE_SIZE = 9;

export default function PatternsGrid({ patterns, onToggleFavourite }: PatternsGridProps) {
  const [query, setQuery] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    const results = q
      ? patterns.filter((p) => p.name.toLowerCase().includes(q))
      : [...patterns];
    results.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return results;
  }, [patterns, query, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function handleQueryChange(q: string) {
    setQuery(q);
    setPage(1);
  }

  function handleSort() {
    setSortAsc((v) => !v);
    setPage(1);
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="shrink-0 mb-4">
        <h2 className="text-[13px] font-bold text-white/60 uppercase tracking-widest mb-3">
          All Patterns
          <span className="ml-2 text-white/30 font-semibold normal-case tracking-normal">
            ({patterns.length})
          </span>
        </h2>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Search by name…"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              className="w-full pl-8 pr-3 py-2 rounded-[10px] bg-white/10 border border-white/15 text-[12px] text-white placeholder:text-white/35 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
          <button
            onClick={handleSort}
            className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-white/10 border border-white/15 text-[12px] font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
          >
            <ArrowUpDown size={12} />
            {sortAsc ? "A → Z" : "Z → A"}
          </button>
        </div>
      </div>

      {/* Grid — scrollable, natural card height */}
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 scrollbar-hide">
        {pageItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2 opacity-60">
            <span className="text-[14px] font-semibold text-white">No patterns found</span>
            <span className="text-[12px] text-white/60">Try a different name</span>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {pageItems.map((p) => (
              <PatternCard key={p.id} pattern={p} onToggleFavourite={onToggleFavourite} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination — pinned at bottom */}
      {totalPages > 1 && (
        <div className="shrink-0 flex items-center justify-center gap-2 pt-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-[12px] text-white/50">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 rounded-[8px] text-[12px] font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
