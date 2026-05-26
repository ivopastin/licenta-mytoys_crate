"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Download, BookMarked } from "lucide-react";
import type { PlushieConfig } from "../types";
import { COLOR_PALETTE } from "../types";
import type { PatternData } from "@/lib/pattern/types";
import { downloadPatternPDF } from "./PatternPDF";

interface StepResultProps {
  config: PlushieConfig;
  patternId: string | null;
  patternData: PatternData | null;
  onReset: () => void;
}

function colorName(hex: string | null): string {
  if (!hex) return "—";
  return COLOR_PALETTE.find((c) => c.hex === hex)?.name ?? hex;
}

export default function StepResult({ config, patternData, onReset }: StepResultProps) {
  const router = useRouter();
  const [downloading, setDownloading] = useState(false);

  const animal = config.animal
    ? config.animal.charAt(0).toUpperCase() + config.animal.slice(1)
    : "Plushie";
  const name = config.name ?? "My Plushie";
  const sizeLabel = config.size
    ? config.size.charAt(0).toUpperCase() + config.size.slice(1)
    : "";
  const skillLabel = patternData
    ? patternData.skillLevel.charAt(0).toUpperCase() + patternData.skillLevel.slice(1)
    : "";

  async function handleDownload() {
    if (!patternData) return;
    setDownloading(true);
    try {
      await downloadPatternPDF(patternData, `${name}-pattern.pdf`);
    } finally {
      setDownloading(false);
      router.push("/app/my-patterns");
    }
  }

  function handleSave() {
    router.push("/app/my-patterns");
  }

  return (
    <div className="w-full max-w-lg bg-white rounded-[24px] p-8 shadow-2xl flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h2 className="text-[26px] font-bold text-ink">
          {name} the {animal}
        </h2>
        <p className="text-[14px] text-black/40">
          {sizeLabel} · {colorName(config.color)} · {skillLabel}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={handleSave}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] bg-brand/10 text-brand text-[15px] font-bold border border-brand/20 transition-all duration-200 hover:bg-brand/20 active:scale-95 cursor-pointer"
        >
          <BookMarked size={16} />
          Save for now, download later
        </button>

        <button
          onClick={handleDownload}
          disabled={!patternData || downloading}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] bg-deep text-white text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-black hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={16} />
          {downloading ? "Generating PDF…" : "Download PDF"}
        </button>
      </div>

      <button
        onClick={onReset}
        className="w-full text-[14px] text-black/40 hover:text-ink transition-colors py-2 cursor-pointer"
      >
        Design another
      </button>
    </div>
  );
}
