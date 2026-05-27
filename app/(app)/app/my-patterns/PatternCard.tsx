"use client";

import { useState, useTransition } from "react";
import { Heart, Download } from "lucide-react";
import { toggleFavourite } from "./actions";
import { openPatternPDF, downloadPatternPDF } from "@/app/(app)/app/studio/components/PatternPDF";
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

function SkillStars({ level, small }: { level: string; small?: boolean }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  const size = small ? "text-[11px]" : "text-[13px]";
  return (
    <span className={size} aria-label={`${level} difficulty`}>
      {[0, 1, 2].map((i) => (
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
  compact?: boolean;
  onToggleFavourite?: (patternId: string, isFavourite: boolean) => void;
}

export default function PatternCard({ pattern, compact = false, onToggleFavourite }: PatternCardProps) {
  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [, startTransition] = useTransition();

  // Read favourite directly from parent state — no local copy
  const favourite = pattern.is_favourite;

  const animal = pattern.animal.charAt(0).toUpperCase() + pattern.animal.slice(1);
  const size = pattern.size.charAt(0).toUpperCase() + pattern.size.slice(1);
  const yarnBrand = YARN_BRAND[pattern.size] ?? "";

  function handleHeartClick() {
    const next = !favourite;
    // Update parent state immediately (optimistic)
    onToggleFavourite?.(pattern.id, next);
    // Fire server action in background, roll back on failure
    startTransition(async () => {
      try {
        await toggleFavourite(pattern.id, next);
      } catch {
        onToggleFavourite?.(pattern.id, !next);
      }
    });
  }

  async function handlePreview() {
    if (previewing) return;
    setPreviewing(true);
    try {
      await openPatternPDF(pattern.pattern_data);
    } finally {
      setPreviewing(false);
    }
  }

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      await downloadPatternPDF(pattern.pattern_data, `${pattern.name}-the-${pattern.animal}-pattern.pdf`);
    } finally {
      setDownloading(false);
    }
  }

  if (compact) {
    return (
      <div className="flex flex-col bg-white rounded-[14px] shadow-sm border border-border-soft overflow-hidden">
        {/* Image placeholder */}
        <div className="relative bg-warm/10 w-full aspect-square flex items-center justify-center">
          <span className="text-[10px] text-warm/40 text-center px-2">{pattern.name}</span>
          <button
            onClick={handleHeartClick}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
            aria-label={favourite ? "Remove from favourites" : "Add to favourites"}
          >
            <Heart
              size={12}
              fill={favourite ? "#8b1a33" : "none"}
              stroke={favourite ? "#8b1a33" : "#9e9e9e"}
            />
          </button>
        </div>
        {/* Info */}
        <div className="flex flex-col gap-1 p-2.5">
          <div className="flex items-center justify-between gap-1">
            <span className="text-[11px] font-bold text-ink truncate leading-tight">
              {pattern.name} the {animal}
            </span>
            <SkillStars level={pattern.skill_level} small />
          </div>
          <p className="text-[10px] text-warm">{size} · {pattern.color_name}</p>
          <div className="mt-0.5 flex gap-1">
            <button
              onClick={handlePreview}
              disabled={previewing}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-[8px] border border-border-soft text-[10px] font-semibold text-warm hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-50"
            >
              {previewing ? "…" : "View"}
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className="w-7 flex items-center justify-center rounded-[8px] border border-border-soft text-warm hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-50"
              aria-label="Download PDF"
            >
              <Download size={10} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white rounded-[16px] shadow-sm border border-border-soft overflow-hidden">
      {/* Image placeholder */}
      <div className="relative bg-warm/10 h-36 w-full flex items-center justify-center">
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
          <SkillStars level={pattern.skill_level} />
        </div>

        <p className="text-[12px] text-warm">
          {size} · {pattern.color_name} {yarnBrand}
        </p>

        <div className="mt-1 flex gap-2">
          <button
            onClick={handlePreview}
            disabled={previewing}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-[10px] border border-border-soft text-[13px] font-semibold text-warm hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {previewing ? "Generating…" : "View PDF"}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="w-10 flex items-center justify-center rounded-[10px] border border-border-soft text-warm hover:border-brand hover:text-brand transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Download PDF"
          >
            <Download size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
