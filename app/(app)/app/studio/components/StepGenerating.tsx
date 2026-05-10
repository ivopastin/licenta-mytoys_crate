"use client";

import { useEffect } from "react";

interface StepGeneratingProps {
  onDone: () => void;
}

export default function StepGenerating({ onDone }: StepGeneratingProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="w-full max-w-130 bg-white rounded-[24px] p-12 shadow-2xl flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-black/10 animate-pulse" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[18px] font-semibold text-ink">Generating your pattern…</p>
        <p className="text-[14px] text-black/40">This will only take a moment</p>
      </div>
    </div>
  );
}
