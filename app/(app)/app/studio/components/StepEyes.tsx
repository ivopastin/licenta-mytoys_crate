"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, EyesType } from "../types";

const EYES: { value: EyesType; label: string; description: string; icon: string }[] = [
  { value: "safety",  label: "Safety Eyes",  description: "Classic round plastic eyes — shiny and expressive", icon: "●" },
  { value: "x-sewed", label: "X Sewed Eyes", description: "Hand-stitched × eyes — rustic and charming",        icon: "✕" },
];

export default function StepEyes({ config, onNext, onBack, stepLabel, direction }: StepProps) {
  const [selected, setSelected] = useState<EyesType | null>(config.eyes);

  return (
    <WizardShell
      title="What kind of eyes?"
      stepLabel={stepLabel}
      direction={direction}
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
                ? "bg-deep/10 border-deep"
                : "bg-black/5 border-black/10 hover:bg-black/8"
            }`}
          >
            <span className="text-[28px] text-ink leading-none">{icon}</span>
            <span className="text-[14px] font-semibold text-ink">{label}</span>
            <span className="text-[12px] text-black/40 text-center leading-snug">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
