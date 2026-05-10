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
    <div className="flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse" />
      <div className="flex flex-col items-center gap-2">
        <p className="text-[18px] font-semibold text-white">Generating your pattern…</p>
        <p className="text-[14px] text-white/50">This will only take a moment</p>
      </div>
    </div>
  );
}
