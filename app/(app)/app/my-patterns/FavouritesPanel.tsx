"use client";

import PatternCard, { type PatternRow } from "./PatternCard";

interface FavouritesPanelProps {
  patterns: PatternRow[];
  onToggleFavourite: (patternId: string, isFavourite: boolean) => void;
}

export default function FavouritesPanel({ patterns, onToggleFavourite }: FavouritesPanelProps) {
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-[13px] font-bold text-white/60 uppercase tracking-widest mb-4 shrink-0">
        Favourites
        <span className="ml-2 text-white/30 font-semibold normal-case tracking-normal">
          ({patterns.length})
        </span>
      </h2>

      <div className="flex-1 overflow-y-auto pr-1 scrollbar-hide">
        <div className="grid grid-cols-2 gap-3">
          {patterns.map((p) => (
            <PatternCard key={p.id} pattern={p} compact onToggleFavourite={onToggleFavourite} />
          ))}
        </div>
      </div>
    </div>
  );
}
