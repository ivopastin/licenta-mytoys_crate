# Studio Wizard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a multi-step plushie design wizard in `/app/studio`, replacing the landing content when "Start designing" is clicked.

**Architecture:** `StudioPage` holds `step` and `config` state and computes a dynamic steps array based on `config.mode`. Each step is its own component receiving `config`, `onNext`, `onBack`, and `stepLabel` props. `WizardShell` provides the shared layout (counter, heading, back/next buttons) used by all standard steps.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, lucide-react.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `app/(app)/app/studio/types.ts` | `PlushieConfig` type + `EMPTY_CONFIG` + `COLOR_PALETTE` + `StepProps` interface |
| Create | `app/(app)/app/studio/components/WizardShell.tsx` | Shared step layout: counter, title, children, back/next buttons |
| Create | `app/(app)/app/studio/components/AnimalPreview.tsx` | Left-panel placeholder shown on color steps |
| Create | `app/(app)/app/studio/components/StepMode.tsx` | 3-card mode selection |
| Create | `app/(app)/app/studio/components/StepAnimal.tsx` | 6-pill animal selection |
| Create | `app/(app)/app/studio/components/StepSize.tsx` | 3-card size selection |
| Create | `app/(app)/app/studio/components/StepColor.tsx` | Color swatch grid (used for both plushie and accessory color) |
| Create | `app/(app)/app/studio/components/StepEyes.tsx` | 2-card eyes selection |
| Create | `app/(app)/app/studio/components/StepName.tsx` | Name text input |
| Create | `app/(app)/app/studio/components/StepAccessory.tsx` | 6-pill accessory selection |
| Create | `app/(app)/app/studio/components/StepGenerating.tsx` | Fake loading screen, auto-advances after 3s |
| Create | `app/(app)/app/studio/components/StepResult.tsx` | Summary + download + reset |
| Modify | `app/(app)/app/studio/page.tsx` | Orchestrator: step/config state, step array, renders landing or wizard |

---

## Task 1: Types and shared data

**Files:**
- Create: `app/(app)/app/studio/types.ts`

- [ ] **Step 1: Create the types file**

```ts
export type PlushieMode = "plushie" | "accessory" | "both";
export type AnimalType = "dog" | "cat" | "rabbit" | "bear" | "fox" | "sheep";
export type SizeType = "small" | "medium" | "large";
export type EyesType = "safety" | "x-sewed";
export type AccessoryType = "tshirt" | "ribbon" | "crossbody-bag" | "hat" | "sunglasses" | "dress";

export type PlushieConfig = {
  mode: PlushieMode | null;
  animal: AnimalType | null;
  size: SizeType | null;
  color: string | null;
  eyes: EyesType | null;
  name: string | null;
  accessory: AccessoryType | null;
  accessoryColor: string | null;
};

export const EMPTY_CONFIG: PlushieConfig = {
  mode: null,
  animal: null,
  size: null,
  color: null,
  eyes: null,
  name: null,
  accessory: null,
  accessoryColor: null,
};

export interface StepProps {
  config: PlushieConfig;
  onNext: (partial: Partial<PlushieConfig>) => void;
  onBack: () => void;
  stepLabel: string;
}

export const COLOR_PALETTE: { name: string; hex: string }[] = [
  { name: "Yellow",       hex: "#edb658" },
  { name: "Willow Green", hex: "#b1bb99" },
  { name: "Pistachio",    hex: "#d0ca6c" },
  { name: "Orange",       hex: "#f59a5a" },
  { name: "Dark Blue",    hex: "#4e6fae" },
  { name: "Aqua Blue",    hex: "#cde1de" },
  { name: "Light Pink",   hex: "#dab8c1" },
  { name: "Red",          hex: "#a90321" },
  { name: "White",        hex: "#ffffff" },
  { name: "Black",        hex: "#1a1a1a" },
  { name: "Grey",         hex: "#9e9e9e" },
  { name: "Light Purple", hex: "#c690cf" },
  { name: "Light Teal",   hex: "#92acba" },
  { name: "Brownish Red", hex: "#530217" },
];
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/types.ts"
git commit -m "feat: add studio wizard types and shared data"
```

---

## Task 2: WizardShell component

**Files:**
- Create: `app/(app)/app/studio/components/WizardShell.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { ChevronLeft } from "lucide-react";

interface WizardShellProps {
  title: string;
  stepLabel: string;
  onBack: () => void;
  onNext: () => void;
  nextDisabled: boolean;
  children: React.ReactNode;
}

export default function WizardShell({
  title,
  stepLabel,
  onBack,
  onNext,
  nextDisabled,
  children,
}: WizardShellProps) {
  return (
    <div className="w-full max-w-[520px] flex flex-col gap-6">
      {/* Counter + title */}
      <div className="flex items-start justify-between gap-4">
        <h2 className="text-[22px] font-bold text-white leading-snug">{title}</h2>
        <span className="text-[12px] text-white/40 shrink-0 mt-1">{stepLabel}</span>
      </div>

      {/* Options */}
      <div>{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[14px] text-white/60 hover:text-white transition-colors cursor-pointer"
        >
          <ChevronLeft size={16} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={nextDisabled}
          className="px-6 py-2.5 rounded-[12px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[14px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-[var(--color-accent)] cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/WizardShell.tsx"
git commit -m "feat: add WizardShell shared step layout"
```

---

## Task 3: AnimalPreview component

**Files:**
- Create: `app/(app)/app/studio/components/AnimalPreview.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { AnimalType } from "../types";

interface AnimalPreviewProps {
  animal: AnimalType | null;
  color: string | null;
}

const ANIMAL_LABELS: Record<AnimalType, string> = {
  dog: "Dog",
  cat: "Cat",
  rabbit: "Rabbit",
  bear: "Bear",
  fox: "Fox",
  sheep: "Sheep",
};

export default function AnimalPreview({ animal, color }: AnimalPreviewProps) {
  return (
    <div className="flex-1 bg-white/10 border border-white/20 rounded-[20px] flex flex-col items-center justify-center gap-4 min-h-[320px] p-8">
      {color && (
        <div
          className="w-16 h-16 rounded-full border-2 border-white/30 shadow-lg"
          style={{ backgroundColor: color }}
        />
      )}
      <p className="text-[18px] font-bold text-white/80">
        {animal ? ANIMAL_LABELS[animal] : "Your plushie"}
      </p>
      <p className="text-[12px] text-white/40 text-center">
        Illustration coming soon
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/AnimalPreview.tsx"
git commit -m "feat: add AnimalPreview placeholder panel"
```

---

## Task 4: StepMode component

**Files:**
- Create: `app/(app)/app/studio/components/StepMode.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { Rabbit, Sparkles, Layers } from "lucide-react";
import WizardShell from "./WizardShell";
import { StepProps, PlushieMode } from "../types";

const MODES: { value: PlushieMode; label: string; description: string; icon: React.ElementType }[] = [
  { value: "plushie",   label: "Plushie only",   description: "Design a custom stuffed animal",        icon: Rabbit },
  { value: "accessory", label: "Accessory only",  description: "Design a stand-alone accessory",        icon: Sparkles },
  { value: "both",      label: "Both",            description: "A plushie with a matching accessory",   icon: Layers },
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepMode.tsx"
git commit -m "feat: add StepMode wizard step"
```

---

## Task 5: StepAnimal component

**Files:**
- Create: `app/(app)/app/studio/components/StepAnimal.tsx`

- [ ] **Step 1: Create the component**

```tsx
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

export default function StepAnimal({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<AnimalType | null>(config.animal);

  return (
    <WizardShell
      title="What kind of animal?"
      stepLabel={stepLabel}
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepAnimal.tsx"
git commit -m "feat: add StepAnimal wizard step"
```

---

## Task 6: StepSize component

**Files:**
- Create: `app/(app)/app/studio/components/StepSize.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, SizeType } from "../types";

const SIZES: { value: SizeType; label: string; height: string; description: string }[] = [
  { value: "small",  label: "Small",  height: "15 cm", description: "Fits in a pocket" },
  { value: "medium", label: "Medium", height: "22 cm", description: "Perfect desk companion" },
  { value: "large",  label: "Large",  height: "30 cm", description: "Big and huggable" },
];

export default function StepSize({ config, onNext, onBack, stepLabel }: StepProps) {
  const [selected, setSelected] = useState<SizeType | null>(config.size);

  return (
    <WizardShell
      title="What size should it be?"
      stepLabel={stepLabel}
      onBack={onBack}
      onNext={() => selected && onNext({ size: selected })}
      nextDisabled={!selected}
    >
      <div className="flex gap-4">
        {SIZES.map(({ value, label, height, description }) => (
          <button
            key={value}
            onClick={() => setSelected(value)}
            className={`flex-1 flex flex-col items-center gap-1 p-4 rounded-[16px] border text-center cursor-pointer transition-all ${
              selected === value
                ? "bg-white/20 border-white"
                : "bg-white/10 border-white/20 hover:bg-white/15"
            }`}
          >
            <span className="text-[16px] font-bold text-white">{label}</span>
            <span className="text-[13px] text-[var(--color-accent)] font-semibold">{height}</span>
            <span className="text-[12px] text-white/60">{description}</span>
          </button>
        ))}
      </div>
    </WizardShell>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepSize.tsx"
git commit -m "feat: add StepSize wizard step"
```

---

## Task 7: StepColor component

**Files:**
- Create: `app/(app)/app/studio/components/StepColor.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepColor.tsx"
git commit -m "feat: add StepColor wizard step with preview panel"
```

---

## Task 8: StepEyes component

**Files:**
- Create: `app/(app)/app/studio/components/StepEyes.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, EyesType } from "../types";

const EYES: { value: EyesType; label: string; description: string; icon: string }[] = [
  { value: "safety",   label: "Safety Eyes",   description: "Classic round plastic eyes — shiny and expressive", icon: "●" },
  { value: "x-sewed",  label: "X Sewed Eyes",  description: "Hand-stitched × eyes — rustic and charming",        icon: "✕" },
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepEyes.tsx"
git commit -m "feat: add StepEyes wizard step"
```

---

## Task 9: StepName component

**Files:**
- Create: `app/(app)/app/studio/components/StepName.tsx`

- [ ] **Step 1: Create the component**

```tsx
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepName.tsx"
git commit -m "feat: add StepName wizard step"
```

---

## Task 10: StepAccessory component

**Files:**
- Create: `app/(app)/app/studio/components/StepAccessory.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import WizardShell from "./WizardShell";
import { StepProps, AccessoryType } from "../types";

const ACCESSORIES: { value: AccessoryType; label: string }[] = [
  { value: "tshirt",       label: "T-Shirt" },
  { value: "ribbon",       label: "Ribbon" },
  { value: "crossbody-bag",label: "Crossbody Bag" },
  { value: "hat",          label: "Hat" },
  { value: "sunglasses",   label: "Sunglasses" },
  { value: "dress",        label: "Dress" },
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
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepAccessory.tsx"
git commit -m "feat: add StepAccessory wizard step"
```

---

## Task 11: StepGenerating component

**Files:**
- Create: `app/(app)/app/studio/components/StepGenerating.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useEffect } from "react";

interface StepGeneratingProps {
  onDone: () => void;
}

export default function StepGenerating({ onDone }: StepGeneratingProps) {
  useEffect(() => {
    const timer = setTimeout(onDone, 3000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse" />
      <div className="flex flex-col items-center gap-2">
        <p className="text-[18px] font-semibold text-white">Generating your pattern…</p>
        <p className="text-[14px] text-white/50">This will only take a moment</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepGenerating.tsx"
git commit -m "feat: add StepGenerating loading screen"
```

---

## Task 12: StepResult component

**Files:**
- Create: `app/(app)/app/studio/components/StepResult.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Download } from "lucide-react";
import { PlushieConfig, COLOR_PALETTE } from "../types";

interface StepResultProps {
  config: PlushieConfig;
  onReset: () => void;
}

function colorName(hex: string | null): string {
  if (!hex) return "—";
  return COLOR_PALETTE.find((c) => c.hex === hex)?.name ?? hex;
}

const SUMMARY_ROWS: { label: string; getValue: (c: PlushieConfig) => string | null }[] = [
  { label: "Mode",            getValue: (c) => c.mode },
  { label: "Animal",          getValue: (c) => c.animal },
  { label: "Size",            getValue: (c) => c.size },
  { label: "Color",           getValue: (c) => colorName(c.color) },
  { label: "Eyes",            getValue: (c) => c.eyes },
  { label: "Name",            getValue: (c) => c.name },
  { label: "Accessory",       getValue: (c) => c.accessory },
  { label: "Accessory Color", getValue: (c) => colorName(c.accessoryColor) },
];

export default function StepResult({ config, onReset }: StepResultProps) {
  return (
    <div className="w-full max-w-lg flex flex-col gap-6">
      <div>
        <h2 className="text-[26px] font-bold text-white">Your pattern is ready!</h2>
        <p className="text-[14px] text-white/60 mt-1">Here's a summary of your design.</p>
      </div>

      <div className="bg-white/10 border border-white/20 rounded-[16px] overflow-hidden">
        {SUMMARY_ROWS.filter(({ getValue }) => getValue(config) !== null).map(({ label, getValue }) => (
          <div
            key={label}
            className="flex items-center justify-between px-4 py-3 border-b border-white/10 last:border-0"
          >
            <span className="text-[13px] text-white/50">{label}</span>
            <span className="text-[13px] font-semibold text-white capitalize">{getValue(config)}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <button
          onClick={() => alert("PDF download coming soon")}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <Download size={16} />
          Download PDF
        </button>
        <button
          onClick={onReset}
          className="w-full text-[14px] text-white/60 hover:text-white transition-colors py-2 cursor-pointer"
        >
          Design another
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add "app/(app)/app/studio/components/StepResult.tsx"
git commit -m "feat: add StepResult summary and download screen"
```

---

## Task 13: Wire everything in StudioPage

**Files:**
- Modify: `app/(app)/app/studio/page.tsx`

- [ ] **Step 1: Replace the entire page.tsx**

```tsx
"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import GrainientFade from "../components/GrainientFade";
import { PlushieConfig, EMPTY_CONFIG } from "./types";
import StepMode from "./components/StepMode";
import StepAnimal from "./components/StepAnimal";
import StepSize from "./components/StepSize";
import StepColor from "./components/StepColor";
import StepEyes from "./components/StepEyes";
import StepName from "./components/StepName";
import StepAccessory from "./components/StepAccessory";
import StepGenerating from "./components/StepGenerating";
import StepResult from "./components/StepResult";

type WizardStep =
  | { id: "mode" }
  | { id: "animal" }
  | { id: "size" }
  | { id: "color" }
  | { id: "eyes" }
  | { id: "name" }
  | { id: "accessory" }
  | { id: "accessoryColor" }
  | { id: "generating" }
  | { id: "result" };

function buildSteps(config: PlushieConfig): WizardStep[] {
  const steps: WizardStep[] = [{ id: "mode" }];
  if (config.mode !== "accessory") {
    steps.push({ id: "animal" }, { id: "size" }, { id: "color" }, { id: "eyes" }, { id: "name" });
  }
  if (config.mode === "accessory" || config.mode === "both") {
    steps.push({ id: "accessory" }, { id: "accessoryColor" });
  }
  steps.push({ id: "generating" }, { id: "result" });
  return steps;
}

export default function StudioPage() {
  const [wizardActive, setWizardActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [config, setConfig] = useState<PlushieConfig>(EMPTY_CONFIG);

  const steps = buildSteps(config);
  const totalSteps = steps.length - 2; // exclude generating and result from count
  const currentStep = steps[stepIndex];

  const handleNext = useCallback((partial: Partial<PlushieConfig>) => {
    const newConfig = { ...config, ...partial };
    setConfig(newConfig);
    // Rebuild steps with updated config to get correct next index
    const newSteps = buildSteps(newConfig);
    setStepIndex((i) => Math.min(i + 1, newSteps.length - 1));
  }, [config]);

  const handleBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const handleReset = useCallback(() => {
    setConfig(EMPTY_CONFIG);
    setStepIndex(0);
    setWizardActive(false);
  }, []);

  // stepLabel: count only navigable steps (exclude generating + result)
  const navigableIndex = stepIndex + 1;
  const stepLabel = `Step ${navigableIndex} of ${totalSteps}`;

  const stepProps = { config, onNext: handleNext, onBack: handleBack, stepLabel };

  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* Grainient background */}
      <GrainientFade
        color1="#591427"
        color2="#76a0b3"
        color3="#716458"
        timeSpeed={0.2}
        warpStrength={1}
        warpFrequency={5}
        warpSpeed={2}
        warpAmplitude={50}
        blendAngle={0}
        blendSoftness={0.05}
        rotationAmount={400}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.3}
        saturation={0.9}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image
          src="/images/textures/app/black-sand.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full px-8">
        {/* Landing */}
        {!wizardActive && (
          <div className="flex flex-col items-center gap-6 text-center max-w-[480px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-[40px] font-bold text-white leading-tight">
                Let&apos;s start creating.
              </h1>
              <p className="text-[16px] text-white/70 font-medium leading-relaxed">
                Design your custom plushie step by step — pick your animal, size,
                colors, and accessories. Your pattern will be ready in minutes.
              </p>
            </div>
            <button
              onClick={() => setWizardActive(true)}
              className="px-8 py-3.5 rounded-[14px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95 cursor-pointer"
            >
              Start designing
            </button>
          </div>
        )}

        {/* Wizard */}
        {wizardActive && (
          <>
            {currentStep.id === "mode"          && <StepMode          {...stepProps} />}
            {currentStep.id === "animal"        && <StepAnimal        {...stepProps} />}
            {currentStep.id === "size"          && <StepSize          {...stepProps} />}
            {currentStep.id === "color"         && <StepColor         {...stepProps} field="color"          title="What color should it be?" />}
            {currentStep.id === "eyes"          && <StepEyes          {...stepProps} />}
            {currentStep.id === "name"          && <StepName          {...stepProps} />}
            {currentStep.id === "accessory"     && <StepAccessory     {...stepProps} />}
            {currentStep.id === "accessoryColor"&& <StepColor         {...stepProps} field="accessoryColor" title="What color should the accessory be?" />}
            {currentStep.id === "generating"    && <StepGenerating    onDone={() => setStepIndex((i) => i + 1)} />}
            {currentStep.id === "result"        && <StepResult        config={config} onReset={handleReset} />}
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify the full wizard flow**

Run `npm run dev` and open `http://localhost:3000/app/studio`.

Test path A (Plushie only):
1. Click "Start designing" → StepMode appears
2. Select "Plushie only" → Next
3. Select any animal → Next
4. Select a size → Next
5. Select a color → Next (preview panel should show animal name + color circle)
6. Select eyes → Next
7. Enter a name → Next
8. Loading screen appears for ~3 seconds, auto-advances
9. Result screen shows summary with all chosen values + Download PDF button
10. Click "Design another" → returns to landing

Test path B (Accessory only):
1. Select "Accessory only" → Next
2. Steps 2–6 (animal/size/color/eyes/name) should be skipped entirely
3. Goes directly to StepAccessory → StepAccessoryColor → Generating → Result

Test path C (Both):
1. Select "Both" → Next
2. All plushie steps appear, then accessory steps appear after StepName

- [ ] **Step 3: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/studio/page.tsx"
git commit -m "feat: wire studio wizard into StudioPage"
```
