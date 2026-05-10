"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps } from "../types";

export default function StepName({ config, onNext, onBack, stepLabel }: StepProps) {
  const [name, setName] = useState(config.name ?? "");

  return (
    <WizardShell
      title="Give your plushie a name"
      stepLabel={stepLabel}
      onBack={onBack}
      onNext={() => name.trim() && onNext({ name: name.trim() })}
      nextDisabled={!name.trim()}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Biscuit"
        className="w-full bg-white/10 border border-white/20 text-white rounded-[12px] px-4 py-3 text-[15px] placeholder:text-white/30 outline-none focus:border-white/50 transition-colors"
      />
    </WizardShell>
  );
}
