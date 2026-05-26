"use client";

import { useEffect, useRef, useState } from "react";
import { generatePattern } from "../actions";
import type { PlushieConfig } from "../types";
import type { PatternData } from "@/lib/pattern/types";

interface StepGeneratingProps {
  config: PlushieConfig;
  onDone: (result: { patternId: string; patternData: PatternData }) => void;
}

export default function StepGenerating({ config, onDone }: StepGeneratingProps) {
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  async function run() {
    setError(null);
    try {
      const result = await generatePattern(config);
      onDone(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  useEffect(() => {
    if (called.current) return;
    called.current = true;
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-130 bg-white rounded-[24px] p-12 shadow-2xl flex flex-col items-center gap-6">
      {!error ? (
        <>
          <div className="w-20 h-20 rounded-full bg-black/10 animate-pulse" />
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[18px] font-semibold text-ink">Generating your pattern…</p>
            <p className="text-[14px] text-black/40">This will only take a moment</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2 text-center">
            <p className="text-[18px] font-semibold text-ink">Something went wrong</p>
            <p className="text-[14px] text-black/40">{error}</p>
          </div>
          <button
            onClick={() => { called.current = false; run(); }}
            className="px-6 py-2.5 rounded-[12px] bg-deep text-white text-[14px] font-semibold hover:bg-black transition-colors cursor-pointer"
          >
            Try again
          </button>
        </>
      )}
    </div>
  );
}
