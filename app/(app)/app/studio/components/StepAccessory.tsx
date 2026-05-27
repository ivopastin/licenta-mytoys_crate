"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, AccessoryType } from "../types";

const ACCESSORIES: { value: AccessoryType; label: string }[] = [
  { value: "hat",     label: "Hat" },
  { value: "bow-tie", label: "Bow Tie" },
  { value: "basket",  label: "Basket" },
];

export default function StepAccessory({ config, onNext, onBack, stepLabel, direction }: StepProps) {
  const [selected, setSelected] = useState<AccessoryType | null>(config.accessory);

  return (
    <WizardShell
      title="What accessory should it wear?"
      stepLabel={stepLabel}
      direction={direction}
      onBack={onBack}
      onNext={() => selected && onNext({ accessory: selected })}
      nextDisabled={!selected}
    >
      <div className="flex flex-wrap gap-3">
        {ACCESSORIES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`px-5 py-2.5 rounded-full text-[14px] font-medium border cursor-pointer transition-all ${
              selected === value
                ? "bg-deep text-white font-semibold border-deep"
                : "bg-black/5 text-ink border-black/10 hover:bg-black/8"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
