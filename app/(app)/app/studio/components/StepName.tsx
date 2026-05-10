"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps } from "../types";

export default function StepName({ config, onNext, onBack, stepLabel, direction }: StepProps) {
  const [name, setName] = useState(config.name ?? "");

  return (
    <WizardShell
      title="Give your plushie a name"
      stepLabel={stepLabel}
      direction={direction}
      onBack={onBack}
      onNext={() => name.trim() && onNext({ name: name.trim() })}
      nextDisabled={!name.trim()}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Biscuit"
        className="w-full bg-black/5 border border-black/10 text-ink rounded-[12px] px-4 py-3 text-[15px] placeholder:text-black/25 outline-none focus:border-black/30 transition-colors"
      />
    </WizardShell>
  );
}
