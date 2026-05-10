"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, AccessoryType } from "../types";

const ACCESSORIES: { value: AccessoryType; label: string }[] = [
  { value: "tshirt",        label: "T-Shirt" },
  { value: "ribbon",        label: "Ribbon" },
  { value: "crossbody-bag", label: "Crossbody Bag" },
  { value: "hat",           label: "Hat" },
  { value: "sunglasses",    label: "Sunglasses" },
  { value: "dress",         label: "Dress" },
];

export default function StepAccessory({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<AccessoryType | null>(config.accessory);

  return (
    <WizardShell
      title="What accessory should it wear?"
      stepLabel={stepLabel}
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
                ? "bg-white text-[var(--color-brand)] font-semibold border-white"
                : "bg-white/10 text-white border-white/20 hover:bg-white/15"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
