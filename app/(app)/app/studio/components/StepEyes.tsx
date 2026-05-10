"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, EyesType } from "../types";

const EYES: { value: EyesType; label: string; description: string; icon: string }[] = [
  { value: "safety",  label: "Safety Eyes",  description: "Classic round plastic eyes — shiny and expressive", icon: "●" },
  { value: "x-sewed", label: "X Sewed Eyes", description: "Hand-stitched × eyes — rustic and charming",        icon: "✕" },
];

export default function StepEyes({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<EyesType | null>(config.eyes);

  return (
    <WizardShell
      title="What kind of eyes?"
      stepLabel={stepLabel}
      onBack={onBack}
      onNext={() => selected && onNext({ eyes: selected })}
      nextDisabled={!selected}
    >
      <div className="flex gap-4">
        {EYES.map(({ value, label, description, icon }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`flex-1 flex flex-col items-center gap-2 p-5 rounded-[16px] border cursor-pointer transition-all ${
              selected === value
                ? "bg-white/20 border-white"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            <span className="text-[28px] text-white leading-none">{icon}</span>
            <span className="text-[14px] font-semibold text-white">{label}</span>
            <span className="text-[12px] text-white/60 text-center leading-snug">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
