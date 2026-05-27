"use client";

import { useState, useTransition } from "react";
import { Heart, Download } from "lucide-react";
import { toggleFavourite } from "./actions";
import { openPatternPDF, downloadPatternPDF } from "@/app/(app)/app/studio/components/PatternPDF";
import { COLOR_PALETTE } from "@/app/(app)/app/studio/types";
import type { PatternData } from "@/lib/pattern/types";

export type PatternRow = {
  id: string;
  name: string;
  animal: string | null;
  size: string | null;
  color_name: string | null;
  accessory_color: string | null;
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

  const animal = pattern.animal ? pattern.animal.charAt(0).toUpperCase() + pattern.animal.slice(1) : null;
  const size = pattern.size ? pattern.size.charAt(0).toUpperCase() + pattern.size.slice(1) : null;
  const yarnBrand = pattern.size ? YARN_BRAND[pattern.size] ?? "" : "";
  const accessoryName = pattern.pattern_data?.accessoryName ?? null;
  const accessoryColorName = pattern.accessory_color
    ? (COLOR_PALETTE.find((c) => c.hex === pattern.accessory_color)?.name ?? null)
    : null;

  let displayTitle: string;
  if (animal && accessoryName) {
    displayTitle = `${pattern.name} the ${animal}`;
  } else if (animal) {
    displayTitle = `${pattern.name} the ${animal}`;
  } else {
    displayTitle = `${pattern.name} — ${accessoryName ?? "Accessory"}`;
  }

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
      const filename = pattern.animal ? `${pattern.name}-the-${pattern.animal}-pattern.pdf` : `${pattern.name}-pattern.pdf`;
      await downloadPatternPDF(pattern.pattern_data, filename);
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
        <div className="flex flex-col justify-between gap-1 p-2.5 flex-1">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center justify-between gap-1">
              <span className="text-[11px] font-bold text-ink truncate leading-tight">
                {displayTitle}
              </span>
              <SkillStars level={pattern.skill_level} small />
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-warm">{[size, animal ? pattern.color_name : accessoryColorName].filter(Boolean).join(" · ")}</p>
              {animal && accessoryName && (
                <span className="px-1.5 py-0.5 rounded-full bg-brand/10 text-brand text-[9px] font-semibold shrink-0">
                  + {accessoryName}
                </span>
              )}
            </div>
          </div>
          <div className="mt-1.5 flex gap-1">
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
        <span className="text-[13px] text-warm/50">{displayTitle}</span>
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
      <div className="flex flex-col justify-between gap-2 p-4 flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[14px] font-bold text-ink truncate">
              {displayTitle}
            </span>
            <SkillStars level={pattern.skill_level} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-warm">
              {[
                size,
                animal && pattern.color_name
                  ? `${pattern.color_name}${yarnBrand ? ` ${yarnBrand}` : ""}`
                  : accessoryColorName,
              ].filter(Boolean).join(" · ")}
            </p>
            {animal && accessoryName && (
              <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[11px] font-semibold shrink-0">
                + {accessoryName}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
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
