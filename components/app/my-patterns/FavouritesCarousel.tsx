"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PatternCard, { type PatternRow } from "./PatternCard";

interface FavouritesCarouselProps {
  patterns: PatternRow[];
}

const CARD_WIDTH = 224; // px — matches the card's effective rendered width
const GAP = 16;

export default function FavouritesCarousel({ patterns }: FavouritesCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "right" ? CARD_WIDTH + GAP : -(CARD_WIDTH + GAP),
      behavior: "smooth",
    });
  }

  return (
    <section className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="text-[16px] font-bold text-white">Favourites</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory"
      >
        {patterns.map((p) => (
          <div
            key={p.id}
            className="shrink-0 snap-start"
            style={{ width: CARD_WIDTH }}
          >
            <PatternCard pattern={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
