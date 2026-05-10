# Studio Wizard — Design Spec

**Date:** 2026-05-10
**Status:** Approved

## Overview

A multi-step wizard embedded in the `/app/studio` page. Clicking "Start designing" replaces the landing content with the wizard. The user makes choices step by step, sees a fake generation loading screen, then receives their pattern result. All state lives in `StudioPage` — no routing changes.

---

## Data Model

```ts
type PlushieConfig = {
  mode: "plushie" | "accessory" | "both" | null;
  animal: "dog" | "cat" | "rabbit" | "bear" | "fox" | "sheep" | null;
  size: "small" | "medium" | "large" | null;
  color: string | null;           // hex value from palette
  eyes: "safety" | "x-sewed" | null;
  name: string | null;
  accessory: "tshirt" | "ribbon" | "crossbody-bag" | "hat" | "sunglasses" | "dress" | null;
  accessoryColor: string | null;  // hex value, only relevant when mode includes accessory
};

const EMPTY_CONFIG: PlushieConfig = {
  mode: null, animal: null, size: null, color: null,
  eyes: null, name: null, accessory: null, accessoryColor: null,
};
```

---

## Step Sequence

`StudioPage` computes a `steps` array at render time based on `config.mode`. Steps 2–6 are skipped when mode is `"accessory"`. Steps 7–8 are skipped when mode is `"plushie"`.

| Step index | Component | Condition |
|---|---|---|
| 0 | Landing (existing) | always |
| 1 | `StepMode` | always |
| 2 | `StepAnimal` | mode ≠ "accessory" |
| 3 | `StepSize` | mode ≠ "accessory" |
| 4 | `StepColor` | mode ≠ "accessory" |
| 5 | `StepEyes` | mode ≠ "accessory" |
| 6 | `StepName` | mode ≠ "accessory" |
| 7 | `StepAccessory` | mode = "accessory" or "both" |
| 8 | `StepAccessoryColor` | mode = "accessory" or "both" |
| 9 | `StepGenerating` | always |
| 10 | `StepResult` | always |

Navigation: `onNext(partial)` merges partial into config and moves to next step in the computed array. `onBack()` moves to previous step. Step 9 auto-advances after 3 seconds — no back button.

---

## Architecture

**Files:**
```
app/(app)/app/studio/
  page.tsx                          — orchestrator: holds step + config state
  components/
    StepMode.tsx
    StepAnimal.tsx
    StepSize.tsx
    StepColor.tsx                   — reused for accessory color (prop: field "color" | "accessoryColor")
    StepEyes.tsx
    StepName.tsx
    StepAccessory.tsx
    StepAccessoryColor.tsx          — thin wrapper around StepColor
    StepGenerating.tsx
    StepResult.tsx
    WizardShell.tsx                 — shared layout: step counter, heading, back/next buttons
    AnimalPreview.tsx               — preview panel shown alongside StepColor
```

**Shared props interface:**
```ts
interface StepProps {
  config: PlushieConfig;
  onNext: (partial: Partial<PlushieConfig>) => void;
  onBack: () => void;
  stepLabel: string;   // e.g. "Step 2 of 8"
}
```

`WizardShell` renders the step counter, question heading (passed as `title` prop), option area (children), and the Back/Next button row. Each step component handles its own selected state locally and calls `onNext` only when a valid choice is made.

---

## Layout

The wizard replaces the landing content within the same full-bleed grainient + texture background in `StudioPage`. No layout changes to `layout.tsx`.

**Standard steps** (1, 2, 3, 5, 6, 7): centered, `max-w-[520px]` card with:
- Step counter top-right: `text-[12px] text-white/40`
- Question heading: `text-[22px] font-bold text-white`
- Options area
- Back (left, ghost: `text-white/60 hover:text-white`) + Next (right, accent yellow, disabled until selection made)

**Split steps** (4 — color, 8 — accessory color): two-column layout side by side:
- Left: `AnimalPreview` panel — `bg-white/10 border border-white/20 rounded-[20px]` containing a centered placeholder (animal name + color circle). Images slot in later keyed by `config.animal`.
- Right: color question in same `WizardShell` structure

**Step 9 — Generating**: full centered, no shell. Pulsing `animate-pulse` circle `w-20 h-20 rounded-full bg-white/20`, text "Generating your pattern…" in `text-white/70 text-[16px]`. Auto-advances via `setTimeout(3000)`. No back button.

**Step 10 — Result**: centered `max-w-lg` card showing summary + download + reset.

---

## Step UI Details

### StepMode
3 horizontal cards (~160px each), flex row, gap-4.
Each card: icon + label + short description. Labels: "Plushie only", "Accessory only", "Both".
Selected: `bg-white/20 border-white` / Unselected: `bg-white/10 border-white/20`.

### StepAnimal
6 pill buttons in a `flex flex-wrap` grid, 3 per row.
Options: Dog, Cat, Rabbit, Bear, Fox, Sheep.
Selected pill: `bg-white text-[var(--color-brand)] font-semibold`.
Unselected: `bg-white/10 text-white border border-white/20`.

### StepSize
3 cards like StepMode. Labels + heights:
- Small — 15 cm
- Medium — 22 cm
- Large — 30 cm

### StepColor / StepAccessoryColor
Color palette (13 swatches), rendered as 40px circles in a flex-wrap grid.
Selected: `ring-2 ring-white ring-offset-2` with color name label below.
Palette:
```ts
const COLOR_PALETTE = [
  { name: "Yellow",        hex: "#edb658" },
  { name: "Willow Green",  hex: "#b1bb99" },
  { name: "Pistachio",     hex: "#d0ca6c" },
  { name: "Orange",        hex: "#f59a5a" },
  { name: "Dark Blue",     hex: "#4e6fae" },
  { name: "Aqua Blue",     hex: "#cde1de" },
  { name: "Light Pink",    hex: "#dab8c1" },
  { name: "Red",           hex: "#a90321" },
  { name: "White",         hex: "#ffffff" },
  { name: "Black",         hex: "#1a1a1a" },
  { name: "Grey",          hex: "#9e9e9e" },
  { name: "Light Purple",  hex: "#c690cf" },
  { name: "Light Teal",    hex: "#92acba" },
  { name: "Brownish Red",  hex: "#530217" },
];
```

### StepEyes
2 cards: "Safety Eyes" (circle icon) and "X Sewed Eyes" (× icon). Same card style as StepMode.

### StepName
Single text input. `bg-white/10 border border-white/20 text-white rounded-[12px] px-4 py-3 text-[15px]`. Placeholder: `"e.g. Biscuit"`. Next enabled when non-empty.

### StepAccessory
6 pills same style as StepAnimal: T-shirt, Ribbon, Crossbody Bag, Hat, Sunglasses, Dress.

### StepGenerating
No `WizardShell`. Full centered div. Pulse animation auto-runs. `setTimeout(3000)` in `useEffect` calls a passed `onDone` callback.

### StepResult
- Heading: "Your pattern is ready!"
- Summary list: each config field as a row (`label: value`)
- "Download PDF" button — accent yellow style, `onClick={() => alert("PDF download coming soon")}`
- "Design another" button — ghost style, resets to step 0 + empty config

---

## Out of Scope

- Real PDF generation
- Animal illustrations (placeholder only — images slot in later)
- Authentication / saving patterns to user account
- Animations between steps (plain swap for now)
