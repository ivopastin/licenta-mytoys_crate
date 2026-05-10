"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, SizeType } from "../types";

const SIZES: { value: SizeType; label: string; height: string; description: string }[] = [
  { value: "small",  label: "Small",  height: "15 cm", description: "Fits in a pocket" },
  { value: "medium", label: "Medium", height: "22 cm", description: "Perfect desk companion" },
  { value: "large",  label: "Large",  height: "30 cm", description: "Big and huggable" },
];

export default function StepSize({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<SizeType | null>(config.size);

  return (
    <WizardShell
      title="What size should it be?"
      stepLabel={stepLabel}
      onBack={onBack}
      onNext={() => selected && onNext({ size: selected })}
      nextDisabled={!selected}
    >
      <div className="flex gap-4">
        {SIZES.map(({ value, label, height, description }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`flex-1 flex flex-col items-center gap-1 p-4 rounded-[16px] border text-center cursor-pointer transition-all ${
              selected === value
                ? "bg-white/20 border-white"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            <span className="text-[16px] font-bold text-white">{label}</span>
            <span className="text-[13px] text-[var(--color-accent)] font-semibold">{height}</span>
            <span className="text-[12px] text-white/60">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
