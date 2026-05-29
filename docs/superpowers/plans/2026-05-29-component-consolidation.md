# Component Consolidation + Structural Cleanup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Consolidate 4 scattered component folders into one centralized `components/` tree, fix a naming collision, remove dead code, and migrate `middleware.ts` to Next.js 16 `proxy.ts` — with zero change to UI or runtime behavior.

**Architecture:** Pure file relocations (`git mv`) plus import-path rewrites to `@/` aliases. No component logic is edited. Route files (`page/layout/loading/route`) and server `actions.ts` stay in `app/`. After every task, `bunx tsc --noEmit` must be clean (it instantly catches any broken import), and the task is committed so each commit is independently green and reviewable.

**Tech Stack:** Next.js 16.1.6 (App Router), React, TypeScript (strict), Tailwind, shadcn/ui, Supabase SSR, bun.

**Verification gate (used in every task):**
- `bunx tsc --noEmit` → expected: no output / exit 0
- Final task also runs `bun run lint` and `bun run build`.

**Path alias:** `@/*` → `./*` (from tsconfig). So `@/components/shared/Grainient` = `components/shared/Grainient.tsx`.

---

## Task 0: Establish green baseline

**Files:** none (read-only)

- [ ] **Step 1: Confirm branch**

Run: `git branch --show-current`
Expected: `refactor/code-quality-maintainability`

- [ ] **Step 2: Baseline typecheck**

Run: `bunx tsc --noEmit`
Expected: clean (exit 0). If there are pre-existing errors, record them — they are the baseline and must not grow.

- [ ] **Step 3: Baseline lint + build**

Run: `bun run lint` then `bun run build`
Expected: both succeed. Record any pre-existing warnings as baseline.

---

## Task 1: Migrate middleware.ts → proxy.ts

**Files:**
- Rename: `middleware.ts` → `proxy.ts`
- Modify: exported function name inside it

- [ ] **Step 1: Rename the file**

```bash
git mv middleware.ts proxy.ts
```

- [ ] **Step 2: Rename the exported function**

In `proxy.ts`, change the export from:

```ts
export async function middleware(request: NextRequest) {
```
to:
```ts
export async function proxy(request: NextRequest) {
```

Leave all body logic and the `export const config = { matcher: [...] }` block unchanged.

- [ ] **Step 3: Confirm no other file imports the middleware**

Run: `grep -rn "middleware" --include="*.ts" --include="*.tsx" . | grep -v node_modules | grep -v ".next"`
Expected: no application imports of the old file (Next.js auto-discovers `proxy.ts` by convention).

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: migrate middleware.ts to Next.js 16 proxy.ts convention"
```

---

## Task 2: Remove dead code

**Files:**
- Delete: `app/components/ScrollDebug.tsx`
- Delete: `app/components/ScrollBlocker.tsx`

- [ ] **Step 1: Re-confirm zero references**

Run: `grep -rn "ScrollDebug\|ScrollBlocker" --include="*.tsx" --include="*.ts" . | grep -v node_modules | grep -v ".next"`
Expected: only the two definition files themselves (or nothing). If any other file imports them, STOP — they are not dead; revisit.

- [ ] **Step 2: Delete**

```bash
git rm app/components/ScrollDebug.tsx app/components/ScrollBlocker.tsx
```

- [ ] **Step 3: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: remove unused ScrollDebug and ScrollBlocker components"
```

---

## Task 3: Create components/shared (reusable primitives)

**Files (move from `components/` root → `components/shared/`):**
BlurText, FadeUp, GlassSurface, GradualBlur, Grainient, LogoLoop, Magnet, Masonry, SplitText, TiltedCard.

> Leave `components/ui/` exactly where it is.

- [ ] **Step 1: Move the files**

```bash
mkdir -p components/shared
git mv components/BlurText.tsx components/FadeUp.tsx components/GlassSurface.tsx \
       components/GradualBlur.tsx components/Grainient.tsx components/LogoLoop.tsx \
       components/Magnet.tsx components/Masonry.tsx components/SplitText.tsx \
       components/TiltedCard.tsx components/shared/
```

- [ ] **Step 2: Rewrite importers**

For each moved name, find importers and rewrite the alias. Run to locate:

```bash
grep -rln "@/components/\(BlurText\|FadeUp\|GlassSurface\|GradualBlur\|Grainient\|LogoLoop\|Magnet\|Masonry\|SplitText\|TiltedCard\)" \
  --include="*.tsx" --include="*.ts" . | grep -v node_modules
```

In every matched file, replace `@/components/<Name>` with `@/components/shared/<Name>` (the 10 names above only — do NOT touch `@/components/ui/...`). Also fix any internal cross-imports between these moved files if present (re-run tsc to catch them).

- [ ] **Step 3: Verify**

Run: `bunx tsc --noEmit`
Expected: clean. Any `Cannot find module '@/components/<Name>'` error points to a missed importer — fix and re-run.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: move reusable primitives to components/shared"
```

---

## Task 4: Create components/marketing (landing page)

**Files (move from `app/components/` → `components/marketing/`):**
AboutSection, AppShell, BottomBlur, Footer, HeroSection, Navbar, PricingSection, ShowcaseSection, SmoothScroll, TestimonialsSection. Plus rename `app/components/testimonials/ReviewCard.tsx` → `components/marketing/TestimonialCard.tsx`.

- [ ] **Step 1: Move and rename**

```bash
mkdir -p components/marketing
git mv app/components/AboutSection.tsx app/components/AppShell.tsx \
       app/components/BottomBlur.tsx app/components/Footer.tsx \
       app/components/HeroSection.tsx app/components/Navbar.tsx \
       app/components/PricingSection.tsx app/components/ShowcaseSection.tsx \
       app/components/SmoothScroll.tsx app/components/TestimonialsSection.tsx \
       components/marketing/
git mv app/components/testimonials/ReviewCard.tsx components/marketing/TestimonialCard.tsx
rmdir app/components/testimonials app/components 2>/dev/null || true
```

- [ ] **Step 2: Update the component identifier of the renamed file**

In `components/marketing/TestimonialCard.tsx`, rename the component declaration and its default export from `ReviewCard` to `TestimonialCard`:

```ts
function TestimonialCard({ review }: { review: Review }) {
```
and the corresponding `export default TestimonialCard;` (match however it is currently exported). Do not change JSX/markup.

- [ ] **Step 3: Rewrite importers**

Find all importers (these were imported via relative paths from `app/components/...` and from the testimonials subfolder):

```bash
grep -rln "components/AboutSection\|components/AppShell\|components/BottomBlur\|components/Footer\|components/HeroSection\|components/Navbar\|components/PricingSection\|components/ShowcaseSection\|components/SmoothScroll\|components/TestimonialsSection\|testimonials/ReviewCard\|ReviewCard" \
  --include="*.tsx" --include="*.ts" app | grep -v node_modules
```

Rewrite each import to the new alias path:
- `@/components/marketing/<Name>` for the 10 moved sections.
- `@/components/marketing/TestimonialCard` (and update the imported identifier name to `TestimonialCard`) wherever the old testimonials `ReviewCard` was used (inside `TestimonialsSection.tsx`).
- Known importer: `app/(main)/layout.tsx` imports `AppShell` via `../components/AppShell` → change to `@/components/marketing/AppShell`.

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move landing-page components to components/marketing; rename testimonial ReviewCard to TestimonialCard"
```

---

## Task 5: Create components/app (dashboard shell components)

**Files:**
- Move from `app/(app)/app/components/` → `components/app/`: ContactModal, GrainientFade, HelpButton, NewsCard, NotificationsPanel, OnboardingModal, ReviewsCarousel, SidebarPatternLink.
- Move route-root component `app/(app)/app/AppSidebar.tsx` → `components/app/AppSidebar.tsx`.
- **Do NOT move** `app/(app)/app/components/actions.ts` — it is a server action; it stays. (It will be referenced from moved components via alias.)

- [ ] **Step 1: Move the files**

```bash
mkdir -p components/app
git mv "app/(app)/app/components/ContactModal.tsx" \
       "app/(app)/app/components/GrainientFade.tsx" \
       "app/(app)/app/components/HelpButton.tsx" \
       "app/(app)/app/components/NewsCard.tsx" \
       "app/(app)/app/components/NotificationsPanel.tsx" \
       "app/(app)/app/components/OnboardingModal.tsx" \
       "app/(app)/app/components/ReviewsCarousel.tsx" \
       "app/(app)/app/components/SidebarPatternLink.tsx" \
       components/app/
git mv "app/(app)/app/AppSidebar.tsx" components/app/AppSidebar.tsx
```

`app/(app)/app/components/actions.ts` remains in place.

- [ ] **Step 2: Fix `./actions` import inside ContactModal**

`components/app/ContactModal.tsx` previously imported `./actions` (now broken). Change it to the absolute alias:

```ts
import { sendSupportEmail } from "@/app/(app)/app/components/actions";
```

- [ ] **Step 3: Rewrite importers of the moved components**

Locate importers (pages/layouts referenced these via relative `./components/...` or `../components/...`, and AppSidebar via `./AppSidebar`):

```bash
grep -rln "components/ContactModal\|components/GrainientFade\|components/HelpButton\|components/NewsCard\|components/NotificationsPanel\|components/OnboardingModal\|components/ReviewsCarousel\|components/SidebarPatternLink\|AppSidebar" \
  --include="*.tsx" --include="*.ts" app | grep -v node_modules
```

Rewrite to `@/components/app/<Name>`. Known importers include `app/(app)/app/page.tsx`, `app/(app)/app/studio/page.tsx`, `app/(app)/app/my-patterns/page.tsx`, `app/(app)/app/tutorials/page.tsx`, `app/(app)/app/layout.tsx` (AppSidebar), and `app/(app)/app/tutorials/[slug]/GrainientBackground.tsx` (GrainientFade — but see Task 9; for now just point it at `@/components/app/GrainientFade`).

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move app dashboard components to components/app"
```

---

## Task 6: Create components/app/studio (wizard)

**Files:**
- Move from `app/(app)/app/studio/components/` → `components/app/studio/`: AnimalPreview, LeaveConfirmDialog, PatternPDF, PatternReadyToast, StepAccessory, StepAnimal, StepColor, StepEyes, StepGenerating, StepMode, StepName, StepResult, StepSize, WizardPlushiesBg, WizardShell.
- Move `app/(app)/app/studio/types.ts` → `components/app/studio/types.ts` (it is types/constants, not a route file).
- **Do NOT move** `app/(app)/app/studio/actions.ts` (server action) or `app/(app)/app/studio/page.tsx`.

- [ ] **Step 1: Move the files**

```bash
mkdir -p components/app/studio
git mv "app/(app)/app/studio/components/"*.tsx components/app/studio/
git mv "app/(app)/app/studio/types.ts" components/app/studio/types.ts
```

- [ ] **Step 2: Fix internal `../types` and `../actions` imports**

The moved Step* / preview components imported `../types` and `../actions` relative to the old `studio/components/` dir.
- `../types` now resolves to `components/app/studio/types` → change those imports to `./types` (they now sit beside `types.ts`).
- `../actions` (used by `StepGenerating.tsx`) must point at the still-in-place server action → change to `@/app/(app)/app/studio/actions`.

Find them:

```bash
grep -rln "\"\.\./types\"\|\"\.\./actions\"" components/app/studio
```

Apply: `../types` → `./types`; `../actions` → `@/app/(app)/app/studio/actions`.

- [ ] **Step 3: Rewrite external importers**

`app/(app)/app/studio/page.tsx` imports the wizard components via `./components/...`. Repoint each to `@/components/app/studio/<Name>`. Also, if `page.tsx` imports `./types`, repoint to `@/components/app/studio/types`. And `app/(app)/app/studio/actions.ts` — if it imports `./types` — repoint to `@/components/app/studio/types`.

Find all:

```bash
grep -rln "studio/components/\|studio/types\|\"\./types\"\|\"\./components/" \
  --include="*.tsx" --include="*.ts" "app/(app)/app/studio" | grep -v node_modules
```

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move studio wizard components and types to components/app/studio"
```

---

## Task 7: Create components/app/my-patterns

**Files:**
- Move from `app/(app)/app/my-patterns/` → `components/app/my-patterns/`: FavouritesCarousel, FavouritesPanel, MyPatternsClient, PatternCard, PatternsGrid.
- Rename `app/(app)/app/my-patterns/ReviewCard.tsx` → `components/app/my-patterns/ReviewSubmissionCard.tsx`.
- **Do NOT move** `app/(app)/app/my-patterns/actions.ts` or `page.tsx`.

- [ ] **Step 1: Move and rename**

```bash
mkdir -p components/app/my-patterns
git mv "app/(app)/app/my-patterns/FavouritesCarousel.tsx" \
       "app/(app)/app/my-patterns/FavouritesPanel.tsx" \
       "app/(app)/app/my-patterns/MyPatternsClient.tsx" \
       "app/(app)/app/my-patterns/PatternCard.tsx" \
       "app/(app)/app/my-patterns/PatternsGrid.tsx" \
       components/app/my-patterns/
git mv "app/(app)/app/my-patterns/ReviewCard.tsx" components/app/my-patterns/ReviewSubmissionCard.tsx
```

- [ ] **Step 2: Rename the component identifier**

In `components/app/my-patterns/ReviewSubmissionCard.tsx`, rename the component and its default export from `ReviewCard` to `ReviewSubmissionCard`. Do not change JSX/markup or its props interface name unless the interface is literally `ReviewCardProps` (rename to `ReviewSubmissionCardProps` for consistency — update the in-file usage).

- [ ] **Step 3: Fix `./actions` and `./PatternCard` style imports inside moved files**

These files imported `./actions` (server action, still in `app/(app)/app/my-patterns/actions.ts`) and some import `./PatternCard` for the `PatternRow` type.
- `./actions` → `@/app/(app)/app/my-patterns/actions` (used by `PatternCard.tsx` `toggleFavourite`, and `ReviewSubmissionCard.tsx` `submitReview`).
- `./PatternCard` cross-imports between moved files stay relative (`./PatternCard`) since they moved together — verify they still resolve.

Find:

```bash
grep -rln "\"\./actions\"\|\"\./PatternCard\"\|ReviewCard" components/app/my-patterns "app/(app)/app/my-patterns"
```

- [ ] **Step 4: Rewrite external importers**

`app/(app)/app/my-patterns/page.tsx` imports `./MyPatternsClient`, `./PatternsGrid`, etc. → repoint each to `@/components/app/my-patterns/<Name>`. Any reference to the old `./ReviewCard` → `@/components/app/my-patterns/ReviewSubmissionCard` with identifier `ReviewSubmissionCard`.

- [ ] **Step 5: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "refactor: move my-patterns components to components/app/my-patterns; rename ReviewCard to ReviewSubmissionCard"
```

---

## Task 8: Create components/app/settings

**Files:**
- Move from `app/(app)/app/settings/` → `components/app/settings/`: AccountSection, BillingSection, ProfileSection, TabNav.
- **Do NOT move** `app/(app)/app/settings/page.tsx`.

- [ ] **Step 1: Move the files**

```bash
mkdir -p components/app/settings
git mv "app/(app)/app/settings/AccountSection.tsx" \
       "app/(app)/app/settings/BillingSection.tsx" \
       "app/(app)/app/settings/ProfileSection.tsx" \
       "app/(app)/app/settings/TabNav.tsx" \
       components/app/settings/
```

- [ ] **Step 2: Fix any `./actions` or sibling imports**

If any moved settings component imports a server action via `./actions` or a sibling page util, repoint `./actions` → `@/app/(app)/app/settings/actions` (only if such a file exists; settings has no `actions.ts` in the tree, so most likely sibling imports between the 4 moved files stay relative). Find:

```bash
grep -rln "\"\./" components/app/settings
```

Sibling imports among the 4 moved files (e.g. `TabNav` importing a section) stay relative and should still resolve.

- [ ] **Step 3: Rewrite external importers**

`app/(app)/app/settings/page.tsx` imports these via `./AccountSection` etc. → repoint to `@/components/app/settings/<Name>`.

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move settings components to components/app/settings"
```

---

## Task 9: Create components/app/tutorials

**Files:**
- Move `app/(app)/app/tutorials/[slug]/GrainientBackground.tsx` → `components/app/tutorials/GrainientBackground.tsx`.
- **Do NOT move** `app/(app)/app/tutorials/page.tsx` or `[slug]/page.tsx`.

- [ ] **Step 1: Move the file**

```bash
mkdir -p components/app/tutorials
git mv "app/(app)/app/tutorials/[slug]/GrainientBackground.tsx" components/app/tutorials/GrainientBackground.tsx
```

- [ ] **Step 2: Fix its GrainientFade import**

`GrainientBackground.tsx` imported `../../components/GrainientFade`. Repoint to `@/components/app/GrainientFade` (moved in Task 5).

- [ ] **Step 3: Rewrite external importer**

`app/(app)/app/tutorials/[slug]/page.tsx` imports `./GrainientBackground` → repoint to `@/components/app/tutorials/GrainientBackground`.

- [ ] **Step 4: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move tutorials GrainientBackground to components/app/tutorials"
```

---

## Task 10: Consistency cleanups (touched files only)

**Files:** any moved component still carrying `import React from "react"` without using the `React` namespace.

- [ ] **Step 1: Find unused React default imports**

```bash
grep -rln "import React from \"react\"" components | grep -v node_modules
```

For each hit, check whether `React.` is actually used in the file:

```bash
grep -L "React\." $(grep -rln "import React from \"react\"" components)
```

Files listed by the second command import `React` but never reference the namespace.

- [ ] **Step 2: Remove the unused import**

In each such file, delete the line `import React from "react";` (keep any named imports like `import { useState } from "react";`). Under the modern JSX transform (`"jsx": "react-jsx"` in tsconfig) this is safe and changes no behavior.

- [ ] **Step 3: Verify**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "refactor: drop unused React default imports under react-jsx transform"
```

---

## Task 11: Full verification + review writeup

**Files:**
- Create: `docs/superpowers/CODE-REVIEW-2026-05-29.md`

- [ ] **Step 1: Confirm no orphaned component dirs remain**

Run: `find . -type d -iname "*component*" -not -path "*/node_modules/*" -not -path "*/.next/*"`
Expected: only `./components`, `./components/ui`, `./components/shared`, `./components/marketing`, `./components/app`, and its subfolders. No remaining `app/components` or `app/(app)/app/.../components`.

Run: `find app -type d -name components` → expected: empty.

- [ ] **Step 2: Full typecheck**

Run: `bunx tsc --noEmit`
Expected: clean.

- [ ] **Step 3: Lint**

Run: `bun run lint`
Expected: no new errors vs. Task 0 baseline.

- [ ] **Step 4: Build**

Run: `bun run build`
Expected: succeeds, `proxy.ts` picked up (no middleware warnings).

- [ ] **Step 5: Write the review writeup**

Create `docs/superpowers/CODE-REVIEW-2026-05-29.md` documenting: the new structure, the rename rationale, the dead code removed, the proxy migration, and the two large files intentionally left unsplit (`PatternPDF.tsx`, `ui/sidebar.tsx`) with reasons. Note them as future-work candidates.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "docs: code-review writeup for component consolidation refactor"
```

- [ ] **Step 7: Hand off for manual browser spot-check**

Tell the user to run `bun dev` and verify: landing page, login, app dashboard, studio wizard end-to-end (pattern generation + PDF), my-patterns (favourite + review submission), settings tabs, tutorials list + detail.

---

## Self-review notes

- **Spec coverage:** centralized tree (Tasks 3–9), naming collision (Tasks 4 & 7), dead code (Task 2), proxy migration (Task 1), consistency cleanups (Task 10), verification (Tasks 0 & 11). All spec sections covered.
- **Ordering:** `shared` before `marketing`/`app` so cross-imports resolve; `app/` (Task 5, incl. GrainientFade) before `tutorials` (Task 9) which depends on GrainientFade.
- **Server actions & route files never move** — only components and the pure-types `studio/types.ts`.
