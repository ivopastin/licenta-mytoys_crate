# Design: Centralized component tree + structural cleanup

Date: 2026-05-29
Branch: `refactor/code-quality-maintainability`

## Goal

Improve maintainability of the `mytoys-crate` Next.js 16 app **without any change to
UI or functionality**. Specifically:

1. Consolidate the 4 scattered component folders into one centralized `components/` tree.
2. Resolve a confusing naming collision (two unrelated `ReviewCard.tsx`).
3. Remove dead code.
4. Migrate `middleware.ts` to the Next.js 16 `proxy.ts` convention.
5. Apply safe consistency cleanups in touched files.

Out of scope: data-fetching rework, type-system overhaul, error-handling redesign,
adding a test runner, splitting large generated files.

## Constraints

- UI and functionality must remain byte-for-byte equivalent at runtime.
- Component moves are pure relocations + import-path rewrites. No logic edits.
- Verification: `bunx tsc --noEmit`, `bun run lint`, `bun run build` all pass; final
  manual browser spot-check by the user.

## Current state (problem)

Four component directories with inconsistent organization:

- `./components` — reusable primitives (React Bits / shadcn `ui/`).
- `./app/components` — marketing/landing sections (+ nested `testimonials/`).
- `./app/(app)/app/components` — authenticated app components.
- `./app/(app)/app/studio/components` — studio wizard components.

Plus route-root component files (e.g. `app/(app)/app/AppSidebar.tsx`), a naming
collision (`ReviewCard.tsx` exists twice with unrelated meaning), and dead code
(`ScrollDebug.tsx`, `ScrollBlocker.tsx` — zero references).

## Target structure

Route files stay in `app/` (`page.tsx`, `layout.tsx`, `loading.tsx`, `route.ts`).
Server actions (`actions.ts`) stay colocated with their routes (Next.js convention).
All UI components move under one `components/` tree grouped by domain:

```
components/
  ui/                         (shadcn — unchanged)
  shared/                     (Grainient, Masonry, BlurText, FadeUp, GlassSurface,
                               GradualBlur, LogoLoop, Magnet, SplitText, TiltedCard)
  marketing/                  (HeroSection, AboutSection, Footer, Navbar,
                               PricingSection, ShowcaseSection, TestimonialsSection,
                               AppShell, SmoothScroll, BottomBlur,
                               TestimonialCard  <- renamed from testimonials/ReviewCard)
  app/                        (AppSidebar, OnboardingModal, NotificationsPanel,
                               ContactModal, HelpButton, NewsCard, ReviewsCarousel,
                               SidebarPatternLink, GrainientFade)
    my-patterns/              (PatternCard, PatternsGrid, MyPatternsClient,
                               FavouritesCarousel, FavouritesPanel,
                               ReviewSubmissionCard <- renamed from my-patterns/ReviewCard)
    settings/                 (AccountSection, BillingSection, ProfileSection, TabNav)
    studio/                   (all Step*, WizardShell, WizardPlushiesBg, AnimalPreview,
                               PatternPDF, PatternReadyToast, LeaveConfirmDialog,
                               types.ts <- moved here from studio route, it is types not a route file)
    tutorials/                (GrainientBackground)
```

All imports rewritten to `@/components/...` aliases. Relative `./actions` imports in
moved files become alias imports to the route's `actions.ts`. `studio/types.ts` moves
into `components/app/studio/` so studio components keep relative type imports.

## Naming-collision fix

- `app/components/testimonials/ReviewCard.tsx` -> `components/marketing/TestimonialCard.tsx`
- `app/(app)/app/my-patterns/ReviewCard.tsx` -> `components/app/my-patterns/ReviewSubmissionCard.tsx`

Not merged — they do different things (marketing testimonial card vs. review-submission form).

## Dead code removal

- Delete `app/components/ScrollDebug.tsx` (zero references).
- Delete `app/components/ScrollBlocker.tsx` (zero references).

## middleware -> proxy migration

- Rename `middleware.ts` -> `proxy.ts`.
- Rename exported `async function middleware` -> `async function proxy`.
- Logic and `config.matcher` unchanged.
- Refs: https://nextjs.org/docs/messages/middleware-to-proxy ,
  https://nextjs.org/docs/app/api-reference/file-conventions/proxy

## Consistency cleanups (touched files only, no behavior change)

- Prefer `@/` alias imports over deep relative paths in touched files.
- Remove unused `import React from "react"` under the modern JSX transform where present.

## Explicitly NOT split (flagged in review writeup instead)

- `components/app/studio/PatternPDF.tsx` (810 lines) — react-pdf document; splitting
  risks visual/behavior change.
- `components/ui/sidebar.tsx` (723 lines) — shadcn-generated; leave as vendored.

## Verification plan

1. `bunx tsc --noEmit` — no type errors.
2. `bun run lint` — clean (allowing for any pre-existing baseline warnings).
3. `bun run build` — succeeds.
4. User spot-checks the running app (landing page, login, app dashboard, studio
   wizard, my-patterns, settings, tutorials).
