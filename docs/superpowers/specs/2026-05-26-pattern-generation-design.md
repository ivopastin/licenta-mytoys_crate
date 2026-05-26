# Pattern Generation, PDF & My Patterns — Design

**Date:** 2026-05-26
**Scope:** Template-driven crochet pattern generation, PDF download via @react-pdf/renderer, and My Patterns page with favourites carousel + paginated grid.

---

## Overview

The Studio wizard already collects the full `PlushieConfig`. This feature wires the "generating" step to a real Server Action that reads a template from Supabase, builds a `PatternData` snapshot, saves it to the database, and returns it to the client. The client renders a PDF from that snapshot. My Patterns shows all saved patterns per user with favourite toggling, search, sort, and pagination.

---

## Architecture

### Data flow

1. Wizard completes → `StepGenerating` calls `generatePattern(config)` Server Action
2. Server Action fetches `pattern_templates` row for `config.animal` from Supabase
3. Merges user choices (color, size, eyes, name, accessory) into template → builds `PatternData`
4. Inserts row into `patterns` table (snapshot) → returns `{ patternId, patternData }`
5. `StepResult` receives data → shows summary + two action buttons
6. "Download PDF" → `@react-pdf/renderer` generates PDF client-side from `patternData`
7. My Patterns page → reads `patterns` table for current user

### Why server action for generation

Template data lives in Supabase so an admin can edit it later without code deploys. The Server Action keeps Supabase reads server-side and provides a clean place to add admin auth checks in the future.

### Why client-side PDF

`@react-pdf/renderer` runs in the browser — no server route needed. The full `PatternData` is already on the client after generation, so the PDF can be generated and downloaded instantly on button click.

---

## Database Schema

### `pattern_templates` table

One row per animal. Seeded once with all 6 animals. Admin-editable later.

```sql
create table pattern_templates (
  id uuid primary key default gen_random_uuid(),
  animal text not null unique,             -- 'dog' | 'cat' | 'rabbit' | 'bear' | 'fox' | 'sheep'
  skill_level text not null,              -- 'beginner' | 'intermediate' | 'advanced'
  finished_size_small text not null,      -- e.g. 'Approx. 15 cm tall'
  finished_size_medium text not null,     -- e.g. 'Approx. 25 cm tall'
  finished_size_large text not null,      -- e.g. 'Approx. 35 cm tall'
  accent_colors jsonb not null,           -- { "nose": "black", "belly": "white", ... }
  parts jsonb not null,                   -- see PatternPart shape below
  assembly jsonb not null,               -- [{ "step": "Sew the head onto the body." }]
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
```

**`parts` jsonb shape:**
```json
[
  {
    "name": "Body",
    "colorNote": null,
    "rounds": [
      { "label": "Round 1", "instruction": "Make 6 sc into a magic ring.", "stitchCount": 6 },
      { "label": "Round 2", "instruction": "Inc in each st around.", "stitchCount": 12 }
    ],
    "closingNote": "F/O and leave a long tail for sewing."
  }
]
```

**Skill levels by animal:**
- dog: intermediate
- cat: intermediate
- rabbit: intermediate
- bear: intermediate
- fox: intermediate
- sheep: advanced

**Accent colors by animal:**
- dog: `{ nose: "black" }`
- cat: `{ nose: "black", whiskers: "opposite", belly: "white", topLegs: "white", tail: "white" }`
- bear: `{ muzzle: "white", nose: "black" }`
- fox: `{ belly: "white", topLegs: "white", topTail: "white", earTips: "black" }`
- sheep: `{ ears: "brown", face: "brown", legs: "brown" }`
- rabbit: `{ innerEars: "light pink", nose: "light pink" }`

### `patterns` table

One row per saved pattern per user. Stores a full snapshot of `PatternData` so template changes don't break old patterns.

```sql
create table patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,                  -- plushie name e.g. "Biscuit"
  animal text not null,
  size text not null,                  -- 'small' | 'medium' | 'large'
  color text not null,                 -- hex
  color_name text not null,            -- e.g. "Yellow"
  eyes text not null,                  -- 'safety' | 'x-sewed'
  accessory text,
  accessory_color text,
  skill_level text not null,
  pattern_data jsonb not null,         -- full PatternData snapshot
  is_favourite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table patterns enable row level security;
create policy "Users can read own patterns" on patterns for select using (auth.uid() = user_id);
create policy "Users can insert own patterns" on patterns for insert with check (auth.uid() = user_id);
create policy "Users can update own patterns" on patterns for update using (auth.uid() = user_id);
```

---

## PatternData Type

```typescript
// lib/pattern/types.ts

export type PatternRound = {
  label: string;           // "Round 1", "Rounds 3-6"
  instruction: string;
  stitchCount: number | null;
};

export type PatternPart = {
  name: string;            // "Body", "Head", "Arm (Make 2)"
  colorNote?: string;      // "In white yarn"
  rounds: PatternRound[];
  closingNote?: string;    // "F/O and leave a long tail for sewing."
};

export type PatternData = {
  plushieName: string;
  animal: string;
  size: string;
  skillLevel: string;
  finishedSize: string;
  materials: {
    yarn: { label: string; colorName: string; hex: string }[];
    hook: string;
    eyes: string | null;
    other: string[];
  };
  abbreviations: { abbr: string; meaning: string }[];
  notes: string[];
  parts: PatternPart[];
  assembly: { step: string }[];
};
```

---

## Server Action: generatePattern

**File:** `app/(app)/app/studio/actions.ts`

```typescript
"use server";
// generatePattern(config: PlushieConfig): Promise<{ patternId: string; patternData: PatternData }>
```

Steps:
1. `createClient()` (server Supabase)
2. Get current user via `supabase.auth.getUser()`
3. Fetch `pattern_templates` where `animal = config.animal`
4. Build `PatternData` by merging template with config:
   - `plushieName`: `config.name`
   - `finishedSize`: pick `finished_size_small/medium/large` based on `config.size`
   - `materials.yarn`: main color from `config.color`, with `colorName` looked up from `COLOR_PALETTE` in `lib/pattern/types.ts`, plus accent colors from template's `accent_colors`
   - `materials.hook`: `"2mm"` (small), `"4mm"` (medium), `"6mm"` (large)
   - `materials.eyes`: `"4–6mm safety eyes"` (small) / `"8mm safety eyes"` (medium) / `"10–12mm safety eyes"` (large) — or `null` if `config.eyes === "x-sewed"`
   - `materials.other`: always `["Yarn needle", "Stitch markers", "Toy stuffing"]`
   - `abbreviations`: fixed list (mr, ch, sc, sl, dc, inc, dec, BLO, FLO, F/O)
   - `notes`: fixed list (stitch marker tip, tutorials reference)
   - `parts`: from template's `parts` jsonb
   - `assembly`: from template's `assembly` jsonb
5. Insert into `patterns` table → get back `id`
6. Return `{ patternId: id, patternData }`

---

## Yarn by Size

| Size | Yarn | Hook |
|------|------|------|
| Small | Katia Capri (100% cotton) | 2mm |
| Medium | Katia Alabama (50% cotton, 50% acrylic) | 4mm |
| Large | Katia Bambi (plush) | 6mm |

Safety eyes by size: small = 4–6mm, medium = 8mm, large = 10–12mm.

---

## StepGenerating Changes

- Calls `generatePattern(config)` on mount
- Shows animated loading UI while waiting
- On success: calls `onDone({ patternId, patternData })`
- On error: shows inline error message + "Try again" button (re-calls the action)
- `onDone` signature in `page.tsx` changes to accept `{ patternId, patternData }`

---

## StepResult Changes

Receives `config`, `patternData`, `patternId`, and `onReset`.

**UI:**
- Title: `"{plushieName} the {Animal}"` — large, bold
- Subtitle: size + color name + skill level
- Two primary buttons:
  - **"Save for now, download later"** → `router.push('/app/my-patterns')`
  - **"Download PDF"** → generates PDF via `@react-pdf/renderer` + triggers browser download → then `router.push('/app/my-patterns')`
- "Design another" text button at bottom → `onReset()`

Pattern is already saved to DB by the time `StepResult` renders (done in `generatePattern`), so no extra save call needed on button click.

---

## PDF Layout (PatternPDF component)

**File:** `app/(app)/app/studio/components/PatternPDF.tsx`

Built with `@react-pdf/renderer`. Matches app visual style:
- Background: `#2a3f4f` (dark teal) for page background
- Section cards: white with rounded corners
- Section headers: `#417c9c` (brand blue)
- Round labels: `#c9a96e` (accent gold) bold
- Font: Helvetica (built-in react-pdf font)

**Page 1 — Cover & Materials:**
- Plushie name as large white title
- Placeholder image box (dashed border)
- Materials card: left column = yarn list, right column = hook + tools
- Bottom row: Finished Size + Skill Level (filled stars)

**Page 2 — Abbreviations & Notes:**
- Abbreviations in two-column layout inside a card
- Notes box below with bullet points

**Page 3+ — Pattern Parts:**
- Each part in its own white card with colored header
- Rounds as numbered list: `Round N: instruction (stitch_count sc)`
- closingNote in italic below rounds

**Final section — Assembly:**
- Numbered list of assembly steps

---

## My Patterns Page

**File:** `app/(app)/app/my-patterns/page.tsx` (Server Component)

Fetches all patterns for current user from Supabase, sorted by `created_at` desc. Passes to client components.

### Favourites Carousel

**File:** `app/(app)/app/my-patterns/FavouritesCarousel.tsx` (Client Component)

- Only rendered if `favourites.length >= 1`
- Left/right arrow buttons scroll through cards one at a time
- Section label "Favourites" in white above

### Patterns Grid

**File:** `app/(app)/app/my-patterns/PatternsGrid.tsx` (Client Component)

- Search bar filters by plushie name client-side
- Sort toggle (A→Z / Z→A) sorts by name client-side
- 9 cards per page, pagination controls below
- Pagination is client-side (all patterns loaded once, sliced per page)

### Pattern Card

**File:** `app/(app)/app/my-patterns/PatternCard.tsx` (Client Component)

- White background, rounded-[16px], subtle shadow
- Top: placeholder image (`bg-warm/20`) with heart icon top-right
  - Heart filled (`#8b1a33`) = favourited, outline = not
  - Click: calls `toggleFavourite(patternId, !isFavourite)` Server Action → optimistic update
- `"{name} the {Animal}"` bold below image
- Same row space-between: difficulty stars (★ beginner, ★★ intermediate, ★★★ advanced)
- Description: `"{Size} · {colorName} {yarnBrand}"` e.g. "Medium · Yellow Alabama"
- Download button at bottom: re-renders PDF from `pattern_data` and triggers download

### toggleFavourite Server Action

**File:** `app/(app)/app/my-patterns/actions.ts`

```typescript
"use server";
// toggleFavourite(patternId: string, isFavourite: boolean): Promise<void>
// Updates patterns.is_favourite for the current user's pattern
```

---

## New Files

| File | Purpose |
|------|---------|
| `lib/pattern/types.ts` | `PatternData`, `PatternPart`, `PatternRound` types |
| `app/(app)/app/studio/actions.ts` | `generatePattern` Server Action |
| `app/(app)/app/studio/components/PatternPDF.tsx` | `@react-pdf/renderer` PDF component |
| `app/(app)/app/my-patterns/page.tsx` | Replace placeholder — Server Component |
| `app/(app)/app/my-patterns/FavouritesCarousel.tsx` | Horizontal scrollable favourites |
| `app/(app)/app/my-patterns/PatternsGrid.tsx` | Search + sort + paginated grid |
| `app/(app)/app/my-patterns/PatternCard.tsx` | Individual pattern card |
| `app/(app)/app/my-patterns/actions.ts` | `toggleFavourite` Server Action |

### Modified Files

| File | Change |
|------|--------|
| `app/(app)/app/studio/components/StepGenerating.tsx` | Call `generatePattern` instead of fake timer |
| `app/(app)/app/studio/components/StepResult.tsx` | Show summary + save/download buttons |
| `app/(app)/app/studio/page.tsx` | Pass `patternData` + `patternId` through wizard state |

---

## Supabase Manual Steps

1. Create `pattern_templates` table and seed with 6 animals
2. Create `patterns` table with RLS policies
3. No redirect URL changes needed
