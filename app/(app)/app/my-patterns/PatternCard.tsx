"use client";

import { useState } from "react";
import { Heart, Download } from "lucide-react";
import { toggleFavourite } from "./actions";
import { downloadPatternPDF } from "@/app/(app)/app/studio/components/PatternPDF";
import type { PatternData } from "@/lib/pattern/types";

export type PatternRow = {
  id: string;
  name: string;
  animal: string;
  size: string;
  color_name: string;
  skill_level: string;
  is_favourite: boolean;
  pattern_data: PatternData;
};

function skillStars(level: string) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <span className="text-[13px]" aria-label={`${level} difficulty`}>
      {Array.from({ length: 3 }).map((_, i) => (
        <span key={i} style={{ color: i < count ? "#c9a96e" : "#e0e0e0" }}>★</span>
      ))}
    </span>
  );
}

const YARN_BRAND: Record<string, string> = {
  small: "Capri",
  medium: "Alabama",
  large: "Bambi",
};

interface PatternCardProps {
  pattern: PatternRow;
}

export default function PatternCard({ pattern }: PatternCardProps) {
  const [favourite, setFavourite] = useState(pattern.is_favourite);
  const [downloading, setDownloading] = useState(false);

  const animal = pattern.animal.charAt(0).toUpperCase() + pattern.animal.slice(1);
  const size = pattern.size.charAt(0).toUpperCase() + pattern.size.slice(1);
  const yarnBrand = YARN_BRAND[pattern.size] ?? "";

  async function handleHeartClick() {
    const next = !favourite;
    setFavourite(next);
    try {
      await toggleFavourite(pattern.id, next);
    } catch {
      setFavourite(!next);
    }
  }

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadPatternPDF(pattern.pattern_data, `${pattern.name}-pattern.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div className="flex flex-col bg-white rounded-[16px] shadow-sm border border-border-soft overflow-hidden">
      {/* Image placeholder */}
      <div className="relative bg-warm/10 aspect-square w-full flex items-center justify-center">
        <span className="text-[13px] text-warm/50">{pattern.name} the {animal}</span>
        <button
          onClick={handleHeartClick}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors cursor-pointer"
          aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            size={16}
            fill={favourite ? "#8b1a33" : "none"}
            stroke={favourite ? "#8b1a33" : "#9e9e9e"}
          />
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[14px] font-bold text-ink truncate">
            {pattern.name} the {animal}
          </span>
          {skillStars(pattern.skill_level)}
        </div>

        <p className="text-[12px] text-warm">
          {size} · {pattern.color_name} {yarnBrand}
        </p>

        <button
          onClick={handleDownload}
          disabled={downloading}
          className="mt-1 flex items-center justify-center gap-1.5 w-full py-2 rounded-[10px] border border-border-soft text-[13px] font-semibold text-warm hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={13} />
          {downloading ? "Generating…" : "Download PDF"}
        </button>
      </div>
    </div>
  );
}
