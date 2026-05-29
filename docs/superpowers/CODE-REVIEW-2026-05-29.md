# Code Review & Maintainability Refactor — 2026-05-29

Branch: `refactor/code-quality-maintainability`
Scope: structural + safe cleanups only. **No UI or runtime behavior change.**

## Summary

The repo had 4 separate component directories with inconsistent, overlapping
organization, a confusing duplicate file name, dead code, and a deprecated
Next.js file convention. This refactor consolidates components into one
discoverable tree, fixes the naming collision, removes dead code, and migrates
to the Next.js 16 `proxy` convention — all verified against typecheck, lint
(no regression vs. baseline), and a successful production build.

## What changed

### 1. Centralized component tree
Before: `./components`, `./app/components`, `./app/(app)/app/components`,
`./app/(app)/app/studio/components`, plus loose route-root components.

After — a single `components/` tree grouped by domain:

```
components/
  ui/            shadcn primitives (unchanged)
  shared/        reusable primitives (Grainient, Masonry, BlurText, FadeUp,
                 GlassSurface, GradualBlur, LogoLoop, Magnet, SplitText, TiltedCard)
  marketing/     landing page (Hero, About, Footer, Navbar, Pricing, Showcase,
                 Testimonials, AppShell, SmoothScroll, BottomBlur, TestimonialCard)
  app/           dashboard (AppSidebar, OnboardingModal, NotificationsPanel,
                 ContactModal, HelpButton, NewsCard, ReviewsCarousel,
                 SidebarPatternLink, GrainientFade)
    my-patterns/ PatternCard, PatternsGrid, MyPatternsClient, FavouritesCarousel,
                 FavouritesPanel, ReviewSubmissionCard
    settings/    AccountSection, BillingSection, ProfileSection, TabNav
    studio/      Step* wizard, WizardShell, WizardPlushiesBg, AnimalPreview,
                 PatternPDF, PatternReadyToast, LeaveConfirmDialog, types.ts
    tutorials/   GrainientBackground
```

Route files (`page/layout/loading/route`) and server actions (`actions.ts`)
remain colocated in `app/` — they are not components. The support action that
previously sat in a `components/actions.ts` was moved up to its route root
(`app/(app)/app/actions.ts`) so no leftover "components" folder holds a non-component.

### 2. Naming-collision fix
There were two unrelated `ReviewCard.tsx` files:
- marketing testimonial card → `components/marketing/TestimonialCard.tsx`
- saved-pattern review form → `components/app/my-patterns/ReviewSubmissionCard.tsx`

They were renamed (not merged) — they do genuinely different things.

### 3. Dead code removed
- `ScrollDebug.tsx` and `ScrollBlocker.tsx` — zero references anywhere.

### 4. middleware → proxy (Next.js 16)
- `middleware.ts` → `proxy.ts`; exported `middleware` → `proxy`; logic and
  `config.matcher` unchanged. The build no longer emits the deprecation warning.
- Refs: https://nextjs.org/docs/messages/middleware-to-proxy

### 5. Minor consistency
- Removed an unused `import React from "react"` in `TestimonialCard.tsx`.
- Updated a stale "middleware" comment in `lib/supabase/server.ts`.

## Verification

| Gate | Baseline | After |
|------|----------|-------|
| `bunx tsc --noEmit` | clean | clean |
| `bun run lint` | 50 problems (33 errors, 17 warnings) | 50 problems (33 errors, 17 warnings) — no regression |
| `bun run build` | succeeds (w/ middleware deprecation warning) | succeeds (warning gone) |

Each task was committed separately and left the build green, so history is
bisectable and reviewable commit-by-commit.

## Pre-existing issues NOT addressed (out of scope / future work)

These existed before this refactor and are intentionally untouched to honor the
"no behavior change" constraint:

1. **ESLint baseline of 50 problems.** Notably `react-hooks/set-state-in-effect`
   errors and `react-hooks/exhaustive-deps` warnings in the vendored React-Bits
   components under `components/shared/` (e.g. `SplitText.tsx`). These are
   third-party-derived; fixing them risks visual/behavioral change and deserves
   its own focused pass.
2. **Large files left unsplit:**
   - `components/app/studio/PatternPDF.tsx` (~810 lines) — a single `@react-pdf`
     document; splitting risks altering generated PDF output.
   - `components/ui/sidebar.tsx` (~723 lines) — shadcn-generated; treat as vendored.
3. **No automated tests.** Verification relied on typecheck/lint/build + manual
   spot-check. A future task could add render/smoke tests for the studio wizard
   and auth flows.

## Recommended manual spot-check (UI parity)

Run `bun dev` and confirm visually unchanged:
- Landing page (`/`) — hero, about, showcase, testimonials, pricing, footer.
- Auth: `/login`, `/reset-password`.
- App dashboard (`/app`) — sidebar, onboarding modal, notifications, help/contact.
- Studio (`/app/studio`) — full wizard through pattern generation + PDF download.
- My patterns (`/app/my-patterns`) — favourite toggle, review submission.
- Settings (`/app/settings`) — tab switching across sections.
- Tutorials (`/app/tutorials` and a `[slug]`).
