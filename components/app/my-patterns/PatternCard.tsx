"use client";

import { useState, useTransition } from "react";
import { Heart, Download } from "lucide-react";
import { toggleFavourite } from "@/app/(app)/app/my-patterns/actions";
import {
  openPatternPDF,
  downloadPatternPDF,
} from "@/components/app/studio/PatternPDF";
import { COLOR_PALETTE } from "@/components/app/studio/types";
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

function SkillHooks({ level, small }: { level: string; small?: boolean }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  const label =
    level === "beginner"
      ? "Beginner"
      : level === "intermediate"
        ? "Intermediate"
        : "Advanced";
  const size = small ? 14 : 18;

  return (
    <span
      className="relative group inline-flex items-center gap-[-20px]"
      aria-label={`${label} difficulty`}
    >
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 511 511"
          fill={i < count ? "#c9a96e" : "#e0e0e0"}
          style={{ transform: "rotate(45deg)" }}
        >
          <path d="M263.36,0c-26.191,0-47.5,21.308-47.5,47.5v218.268c-4.772,2.501-8.063,7.418-8.262,13.198l-7.449,216c-0.146,4.239,1.397,8.254,4.344,11.304c2.947,3.05,6.906,4.73,11.147,4.73h47.438c4.241,0,8.2-1.68,11.147-4.73c2.947-3.05,4.49-7.065,4.344-11.304l-7.449-216c-0.202-5.86-3.585-10.824-8.464-13.292L255.343,59.43c-0.063-1.578,0.715-2.633,1.185-3.122C256.997,55.82,258.021,55,259.6,55c2.349,0,4.26,1.911,4.26,4.26V71.5c0,8.547,6.953,15.5,15.5,15.5c17.369,0,31.5-14.131,31.5-31.5v-8C310.86,21.308,289.551,0,263.36,0z M247.589,264H230.86v-17.025c0.166,0.011,0.331,0.025,0.5,0.025h15.626L247.589,264z M263.439,495.847c-0.147,0.153-0.307,0.153-0.36,0.153h-47.438c-0.053,0-0.212,0-0.36-0.153c-0.147-0.152-0.142-0.313-0.14-0.365l7.449-216c0.009-0.271,0.229-0.483,0.5-0.483h32.542c0.271,0,0.49,0.212,0.499,0.483l7.449,216C263.581,495.535,263.587,495.695,263.439,495.847z M295.86,55.5c0,9.098-7.402,16.5-16.5,16.5c-0.276,0-0.5-0.224-0.5-0.5V59.26c0-10.62-8.64-19.26-19.26-19.26c-5.291,0-10.223,2.101-13.888,5.916c-3.666,3.815-5.568,8.827-5.357,14.08l6.1,172.004H231.36c-0.169,0-0.334,0.014-0.5,0.025V47.5c0-17.921,14.58-32.5,32.5-32.5s32.5,14.579,32.5,32.5V55.5z" />
        </svg>
      ))}
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 rounded-[6px] bg-[#1c1917] text-white text-[10px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        {label}
      </span>
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

export default function PatternCard({
  pattern,
  compact = false,
  onToggleFavourite,
}: PatternCardProps) {
  const [previewing, setPreviewing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [, startTransition] = useTransition();

  // Read favourite directly from parent state — no local copy
  const favourite = pattern.is_favourite;

  const animal = pattern.animal
    ? pattern.animal.charAt(0).toUpperCase() + pattern.animal.slice(1)
    : null;
  const size = pattern.size
    ? pattern.size.charAt(0).toUpperCase() + pattern.size.slice(1)
    : null;
  const yarnBrand = pattern.size ? (YARN_BRAND[pattern.size] ?? "") : "";
  const accessoryName = pattern.pattern_data?.accessoryName ?? null;
  const accessoryColorName = pattern.accessory_color
    ? (COLOR_PALETTE.find((c) => c.hex === pattern.accessory_color)?.name ??
      null)
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
      const filename = pattern.animal
        ? `${pattern.name}-the-${pattern.animal}-pattern.pdf`
        : `${pattern.name}-pattern.pdf`;
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
          <span className="text-[10px] text-warm/40 text-center px-2">
            {pattern.name}
          </span>
          <button
            onClick={handleHeartClick}
            className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 hover:bg-white transition-colors cursor-pointer"
            aria-label={
              favourite ? "Remove from favourites" : "Add to favourites"
            }
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
              <SkillHooks level={pattern.skill_level} small />
            </div>
            <div className="flex items-center gap-1.5">
              <p className="text-[10px] text-warm">
                {[size, animal ? pattern.color_name : accessoryColorName]
                  .filter(Boolean)
                  .join(" · ")}
              </p>
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
          aria-label={
            favourite ? "Remove from favourites" : "Add to favourites"
          }
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
            <SkillHooks level={pattern.skill_level} />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-warm">
              {[
                size,
                animal && pattern.color_name
                  ? `${pattern.color_name}${yarnBrand ? ` ${yarnBrand}` : ""}`
                  : accessoryColorName,
              ]
                .filter(Boolean)
                .join(" · ")}
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
