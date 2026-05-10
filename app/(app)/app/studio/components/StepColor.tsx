"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import AnimalPreview from "./AnimalPreview";
import { StepProps, COLOR_PALETTE } from "../types";

interface StepColorProps extends StepProps {
  field: "color" | "accessoryColor";
  title: string;
}

export default function StepColor({ config, onNext, onBack, stepLabel, field, title }: StepColorProps) {
  const [selected, setSelected] = useState<string | null>(config[field]);

  const selectedName = COLOR_PALETTE.find((c) => c.hex === selected)?.name ?? null;

  return (
    <div className="w-full flex gap-6 items-stretch">
      {/* Preview panel — left side */}
      <AnimalPreview animal={config.animal} color={selected ?? config.color} />

      {/* Color picker — right side */}
      <div className="flex-1">
        <WizardShell
          title={title}
          stepLabel={stepLabel}
          onBack={onBack}
          onNext={() => selected && onNext({ [field]: selected })}
          nextDisabled={!selected}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap gap-3">
              {COLOR_PALETTE.map(({ name, hex }) => (
                <button
                  key={hex}
                  onClick={() => setSelected(hex)}
                  title={name}
                  className={`w-10 h-10 rounded-full border-2 cursor-pointer transition-all ${
                    selected === hex
                      ? "ring-2 ring-white ring-offset-2 ring-offset-transparent border-white scale-110"
                      : "border-white/20 hover:scale-105"
                  }`}
                  style={{ backgroundColor: hex }}
                />
              ))}
            </div>
            {selectedName && (
              <p className="text-[13px] text-white/70 font-medium">{selectedName}</p>
            )}
          </div>
        </WizardShell>
      </div>
    </div>
  );
}
