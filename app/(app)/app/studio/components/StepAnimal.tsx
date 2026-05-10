"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, AnimalType } from "../types";

const ANIMALS: { value: AnimalType; label: string }[] = [
  { value: "dog",    label: "Dog" },
  { value: "cat",    label: "Cat" },
  { value: "rabbit", label: "Rabbit" },
  { value: "bear",   label: "Bear" },
  { value: "fox",    label: "Fox" },
  { value: "sheep",  label: "Sheep" },
];

export default function StepAnimal({ config, onNext, onBack, stepLabel, direction }: StepProps) {
  const [selected, setSelected] = useState<AnimalType | null>(config.animal);

  return (
    <WizardShell
      title="What kind of animal?"
      stepLabel={stepLabel}
      direction={direction}
      onBack={onBack}
      onNext={() => selected && onNext({ animal: selected })}
      nextDisabled={!selected}
    >
      <div className="flex flex-wrap gap-3">
        {ANIMALS.map(({ value, label }) => (
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
