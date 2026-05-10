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

export default function StepMode({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<PlushieMode | null>(config.mode);

  return (
    <WizardShell
      title="What would you like to design?"
      stepLabel={stepLabel}
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
                ? "bg-white/20 border-white"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            <Icon size={24} className="text-white" />
            <span className="text-[14px] font-semibold text-white">{label}</span>
            <span className="text-[12px] text-white/60 leading-snug">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
