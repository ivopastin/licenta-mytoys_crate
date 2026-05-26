"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown } from "lucide-react";
import PatternCard, { type PatternRow } from "./PatternCard";

interface PatternsGridProps {
  patterns: PatternRow[];
}

const PAGE_SIZE = 9;

export default function PatternsGrid({ patterns }: PatternsGridProps) {
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
    <section className="flex flex-col gap-4">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-warm/50" />
          <input
            type="text"
            placeholder="Search by name…"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-[10px] bg-white/10 border border-white/15 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <button
          onClick={handleSort}
          className="flex items-center gap-1.5 px-3 py-2.5 rounded-[10px] bg-white/10 border border-white/15 text-[13px] font-semibold text-white hover:bg-white/20 transition-colors cursor-pointer whitespace-nowrap"
        >
          <ArrowUpDown size={13} />
          {sortAsc ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <span className="text-[15px] font-semibold text-white/70">No patterns found</span>
          <span className="text-[13px] text-white/40">Try a different name</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {pageItems.map((p) => (
            <PatternCard key={p.id} pattern={p} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={safePage === 1}
            className="px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-[13px] text-white/60">
            {safePage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={safePage === totalPages}
            className="px-3 py-1.5 rounded-[8px] text-[13px] font-semibold text-white bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}
