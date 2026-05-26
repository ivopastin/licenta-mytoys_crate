"use client";

import { useState } from "react";
import Link from "next/link";
import FavouritesPanel from "./FavouritesPanel";
import PatternsGrid from "./PatternsGrid";
import type { PatternRow } from "./PatternCard";

interface MyPatternsClientProps {
  initialPatterns: PatternRow[];
}

export default function MyPatternsClient({ initialPatterns }: MyPatternsClientProps) {
  const [patterns, setPatterns] = useState<PatternRow[]>(initialPatterns);

  const favourites = patterns.filter((p) => p.is_favourite);

  function handleToggleFavourite(patternId: string, isFavourite: boolean) {
    setPatterns((prev) =>
      prev.map((p) => (p.id === patternId ? { ...p, is_favourite: isFavourite } : p))
    );
  }

  if (patterns.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
        <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M9 13h6M9 17h4"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <p className="text-[26px] font-bold text-white">No patterns yet</p>
        <p className="text-[15px] text-white/70 font-medium leading-relaxed max-w-[320px]">
          Your saved patterns will appear here. Head to the Studio to design your first plushie.
        </p>
        <Link
          href="/app/studio"
          className="mt-2 px-6 py-2.5 rounded-[12px] bg-white text-deep text-[14px] font-bold hover:bg-white/90 transition-colors"
        >
          Go to Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 flex gap-6">
      {/* Left — Favourites (1/3), scrollable */}
      {favourites.length > 0 && (
        <div className="w-[32%] shrink-0 flex flex-col min-h-0">
          <FavouritesPanel patterns={favourites} onToggleFavourite={handleToggleFavourite} />
        </div>
      )}

      {/* Right — All patterns (viewport-fit, paginated) */}
      <div className={`flex flex-col min-h-0 ${favourites.length > 0 ? "flex-1" : "w-full"}`}>
        <PatternsGrid patterns={patterns} onToggleFavourite={handleToggleFavourite} />
      </div>
    </div>
  );
}
