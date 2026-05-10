"use client";

import { useState } from "react";
import { Rabbit, Sparkles, Layers } from "lucide-react";
import WizardShell from "./WizardShell";
import { StepProps, PlushieMode } from "../types";

const MODES: { value: PlushieMode; label: string; description: string; icon: React.ElementType }[] = [
  { value: "plushie",   label: "Plushie only",   description: "Design a custom stuffed animal",       icon: Rabbit },
  { value: "accessory", label: "Accessory only",  description: "Design a stand-alone accessory",       icon: Sparkles },
  { value: "both",      label: "Both",            description: "A plushie with a matching accessory",  icon: Layers },
];

export default function StepMode({ config, onNext, onBack, stepLabel, direction }: StepProps) {
  const [selected, setSelected] = useState<PlushieMode | null>(config.mode);

  return (
    <WizardShell
      title="What would you like to design?"
      stepLabel={stepLabel}
      direction={direction}
      onBack={onBack}
      onNext={() => selected && onNext({ mode: selected })}
      nextDisabled={!selected}
    >
      <div className="flex gap-4">
        {MODES.map(({ value, label, description, icon: Icon }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-[16px] border text-center cursor-pointer transition-all ${
              selected === value
                ? "bg-deep/10 border-deep"
                : "bg-black/5 border-black/10 hover:bg-black/8"
            }`}
          >
            <Icon size={24} className={selected === value ? "text-deep" : "text-black/50"} />
            <span className="text-[14px] font-semibold text-ink">{label}</span>
            <span className="text-[12px] text-black/40 leading-snug">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
