# Pattern Generation, PDF & My Patterns Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Wire the Studio wizard to a real Server Action that builds a crochet pattern from Supabase templates, saves it per user, renders it as a styled PDF via @react-pdf/renderer, and displays saved patterns in a rebuilt My Patterns page with favourites carousel, search, sort, and pagination.

**Architecture:** `generatePattern(config)` is a Next.js Server Action that fetches a `pattern_templates` row from Supabase, merges user config choices into a `PatternData` snapshot, saves it to a `patterns` table, and returns it to the client. `StepGenerating` calls this action instead of a fake timer. `StepResult` renders a summary and triggers client-side PDF generation via `@react-pdf/renderer`. My Patterns reads saved patterns server-side and renders them with client components for interactivity.

**Tech Stack:** Next.js 16 App Router, Supabase (@supabase/ssr), TypeScript, @react-pdf/renderer, Tailwind CSS v4, Bun

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `lib/pattern/types.ts` | `PatternData`, `PatternPart`, `PatternRound` types |
| Create | `lib/pattern/abbreviations.ts` | Fixed abbreviations list |
| Create | `lib/pattern/buildPatternData.ts` | Pure function: template + config → PatternData |
| Create | `app/(app)/app/studio/actions.ts` | `generatePattern` Server Action |
| Create | `app/(app)/app/studio/components/PatternPDF.tsx` | @react-pdf/renderer PDF document |
| Modify | `app/(app)/app/studio/components/StepGenerating.tsx` | Call Server Action instead of fake timer |
| Modify | `app/(app)/app/studio/components/StepResult.tsx` | Show summary + save/download buttons |
| Modify | `app/(app)/app/studio/page.tsx` | Thread patternId + patternData through wizard state |
| Replace | `app/(app)/app/my-patterns/page.tsx` | Server Component fetching patterns |
| Create | `app/(app)/app/my-patterns/FavouritesCarousel.tsx` | Horizontal scrollable favourites |
| Create | `app/(app)/app/my-patterns/PatternsGrid.tsx` | Search + sort + paginated grid |
| Create | `app/(app)/app/my-patterns/PatternCard.tsx` | Individual pattern card with heart toggle |
| Create | `app/(app)/app/my-patterns/actions.ts` | `toggleFavourite` Server Action |

---

### Task 1: Install @react-pdf/renderer

**Files:** `package.json`

- [ ] **Step 1: Install the package**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate
bun add @react-pdf/renderer
bun add -d @types/react-pdf
```

- [ ] **Step 2: Verify installation**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add package.json bun.lock
git commit -m "chore: install @react-pdf/renderer"
```

---

### Task 2: Supabase Tables (Manual)

**Files:** None (Supabase Dashboard SQL editor)

- [ ] **Step 1: Create `pattern_templates` table**

Run in Supabase Dashboard → SQL Editor:

```sql
create table pattern_templates (
  id uuid primary key default gen_random_uuid(),
  animal text not null unique,
  skill_level text not null check (skill_level in ('beginner', 'intermediate', 'advanced')),
  finished_size_small text not null,
  finished_size_medium text not null,
  finished_size_large text not null,
  accent_colors jsonb not null default '{}',
  parts jsonb not null default '[]',
  assembly jsonb not null default '[]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- RLS: only authenticated users can read, only service role can write (admin later)
alter table pattern_templates enable row level security;
create policy "Anyone authenticated can read templates"
  on pattern_templates for select
  using (auth.role() = 'authenticated');
```

- [ ] **Step 2: Create `patterns` table**

```sql
create table patterns (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  animal text not null,
  size text not null check (size in ('small', 'medium', 'large')),
  color text not null,
  color_name text not null,
  eyes text not null check (eyes in ('safety', 'x-sewed')),
  accessory text,
  accessory_color text,
  skill_level text not null,
  pattern_data jsonb not null,
  is_favourite boolean not null default false,
  created_at timestamptz not null default now()
);

alter table patterns enable row level security;
create policy "Users can read own patterns" on patterns for select using (auth.uid() = user_id);
create policy "Users can insert own patterns" on patterns for insert with check (auth.uid() = user_id);
create policy "Users can update own patterns" on patterns for update using (auth.uid() = user_id);
```

- [ ] **Step 3: Seed `pattern_templates` with body + arms + legs data**

Run this seed (head/ears/tail rows are left with `[]` for parts pending future content — the body, arms and legs rounds come from the reference PDF):

```sql
insert into pattern_templates (animal, skill_level, finished_size_small, finished_size_medium, finished_size_large, accent_colors, parts, assembly) values

('dog', 'intermediate',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"nose": "black", "belly": "white"}',
  '[
    {"name":"Body","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Sc in each st around.","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Sc in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Sc in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Sc in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Arm (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Rounds 4–6","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 7","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 8–9","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 10","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Round 11 — Start stuffing","instruction":"Dec, 14 sc.","stitchCount":15},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":15},
      {"label":"Round 14","instruction":"Dec, 13 sc.","stitchCount":14},
      {"label":"Rounds 15–16 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":14},
      {"label":"Round 17","instruction":"Dec, 12 sc.","stitchCount":13},
      {"label":"Rounds 18–19","instruction":"Sc in each st around.","stitchCount":13},
      {"label":"Round 20","instruction":"Dec, 11 sc.","stitchCount":12},
      {"label":"Round 21","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 7","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 8","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 9","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 10–11","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 12 — Start stuffing","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 13–14","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 15","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Rounds 16–17","instruction":"Sc in each st around.","stitchCount":16},
      {"label":"Round 18 — Stop stuffing","instruction":"(2 sc, dec) x 4.","stitchCount":12},
      {"label":"Round 19","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Belly Patch","colorNote":"In white yarn.","rounds":[
      {"label":"Ch 6","instruction":"Chain 6.","stitchCount":null},
      {"label":"Round 1","instruction":"Sc in 2nd ch from hook, 3 sc, inc3 in last chain, working on opposite side: 3 sc, inc.","stitchCount":12},
      {"label":"Round 2","instruction":"Inc, 3 sc, inc x 3, 3 sc, inc x 2.","stitchCount":18},
      {"label":"Round 3","instruction":"Sc, inc, 4 sc, inc, sc, inc, sc, inc, 4 sc, inc, sc, inc.","stitchCount":24},
      {"label":"Round 4","instruction":"2 sc, inc, 5 sc, inc, 2 sc, inc, 2 sc, inc, 5 sc, inc, 2 sc, inc.","stitchCount":30}
    ],"closingNote":"F/O and leave a long tail. Pin belly onto body and sew into place."},
    {"name":"Head","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Tail","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head onto the body, adding more stuffing as you go."},
    {"step":"Pin and sew the belly patch onto the front of the body."},
    {"step":"Pin the arms onto the body at a forward-facing angle and sew into place."},
    {"step":"Turn the body upside down, pin the legs onto the bottom and sew into place."},
    {"step":"Pin the ears onto the head and sew into place."},
    {"step":"Pin the tail onto the back of the body and sew into place."},
    {"step":"Using black yarn, embroider the nose onto the face."}
  ]'
),

('cat', 'intermediate',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"nose": "black", "whiskers": "contrast", "belly": "white", "topLegs": "white", "tail": "white"}',
  '[
    {"name":"Body","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Sc in each st around.","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Sc in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Sc in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Sc in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Arm (Make 2)","colorNote":"Switch to white for top of arm at round 11.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Rounds 4–6","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 7","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 8–9","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 10","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Round 11 — Start stuffing, change to white","instruction":"Dec, 14 sc.","stitchCount":15},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":15},
      {"label":"Round 14","instruction":"Dec, 13 sc.","stitchCount":14},
      {"label":"Rounds 15–16 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":14},
      {"label":"Round 17","instruction":"Dec, 12 sc.","stitchCount":13},
      {"label":"Rounds 18–19","instruction":"Sc in each st around.","stitchCount":13},
      {"label":"Round 20","instruction":"Dec, 11 sc.","stitchCount":12},
      {"label":"Round 21","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 2)","colorNote":"Switch to white for top of leg at round 12.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 7","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 8","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 9","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 10–11","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 12 — Start stuffing, change to white","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 13–14","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 15","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Rounds 16–17","instruction":"Sc in each st around.","stitchCount":16},
      {"label":"Round 18 — Stop stuffing","instruction":"(2 sc, dec) x 4.","stitchCount":12},
      {"label":"Round 19","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Belly Patch","colorNote":"In white yarn.","rounds":[
      {"label":"Ch 6","instruction":"Chain 6.","stitchCount":null},
      {"label":"Round 1","instruction":"Sc in 2nd ch from hook, 3 sc, inc3 in last chain, working on opposite side: 3 sc, inc.","stitchCount":12},
      {"label":"Round 2","instruction":"Inc, 3 sc, inc x 3, 3 sc, inc x 2.","stitchCount":18},
      {"label":"Round 3","instruction":"Sc, inc, 4 sc, inc, sc, inc, sc, inc, 4 sc, inc, sc, inc.","stitchCount":24},
      {"label":"Round 4","instruction":"2 sc, inc, 5 sc, inc, 2 sc, inc, 2 sc, inc, 5 sc, inc, 2 sc, inc.","stitchCount":30}
    ],"closingNote":"F/O and leave a long tail. Pin belly onto body and sew into place."},
    {"name":"Head","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Tail","colorNote":"Switch to white for last 4 rounds.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head onto the body, adding more stuffing as you go."},
    {"step":"Pin and sew the belly patch onto the front of the body."},
    {"step":"Pin the arms onto the body at a forward-facing angle and sew into place."},
    {"step":"Turn the body upside down, pin the legs onto the bottom and sew into place."},
    {"step":"Pinch ears at the base, sew 3 stitches together, then pin onto head and sew into place."},
    {"step":"Pin the tail onto the back of the body and sew into place."},
    {"step":"Using black yarn, embroider the nose. Using a contrasting color yarn, embroider whiskers on each side of the face."}
  ]'
),

('rabbit', 'intermediate',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"innerEars": "light pink", "nose": "light pink"}',
  '[
    {"name":"Body","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Sc in each st around.","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Sc in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Sc in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Sc in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Arm (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Rounds 4–6","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 7","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 8–9","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 10","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Round 11 — Start stuffing","instruction":"Dec, 14 sc.","stitchCount":15},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":15},
      {"label":"Round 14","instruction":"Dec, 13 sc.","stitchCount":14},
      {"label":"Rounds 15–16 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":14},
      {"label":"Round 17","instruction":"Dec, 12 sc.","stitchCount":13},
      {"label":"Rounds 18–19","instruction":"Sc in each st around.","stitchCount":13},
      {"label":"Round 20","instruction":"Dec, 11 sc.","stitchCount":12},
      {"label":"Round 21","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 7","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 8","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 9","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 10–11","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 12 — Start stuffing","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 13–14","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 15","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Rounds 16–17","instruction":"Sc in each st around.","stitchCount":16},
      {"label":"Round 18 — Stop stuffing","instruction":"(2 sc, dec) x 4.","stitchCount":12},
      {"label":"Round 19","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Head","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":"In main color. Inner ear in light pink yarn.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Tail","colorNote":"Small pom-pom in main color.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head onto the body, adding more stuffing as you go."},
    {"step":"Pin the arms onto the body at a forward-facing angle and sew into place."},
    {"step":"Turn the body upside down, pin the legs onto the bottom and sew into place."},
    {"step":"Pin the long ears onto the head and sew into place."},
    {"step":"Attach the small pom-pom tail to the back of the body."},
    {"step":"Using light pink yarn, embroider a small nose onto the face."}
  ]'
),

('bear', 'intermediate',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"muzzle": "white", "nose": "black"}',
  '[
    {"name":"Body","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Sc in each st around.","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Sc in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Sc in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Sc in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Arm (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Rounds 4–6","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 7","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 8–9","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 10","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Round 11 — Start stuffing","instruction":"Dec, 14 sc.","stitchCount":15},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":15},
      {"label":"Round 14","instruction":"Dec, 13 sc.","stitchCount":14},
      {"label":"Rounds 15–16 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":14},
      {"label":"Round 17","instruction":"Dec, 12 sc.","stitchCount":13},
      {"label":"Rounds 18–19","instruction":"Sc in each st around.","stitchCount":13},
      {"label":"Round 20","instruction":"Dec, 11 sc.","stitchCount":12},
      {"label":"Round 21","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 2)","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 7","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 8","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 9","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 10–11","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 12 — Start stuffing","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 13–14","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 15","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Rounds 16–17","instruction":"Sc in each st around.","stitchCount":16},
      {"label":"Round 18 — Stop stuffing","instruction":"(2 sc, dec) x 4.","stitchCount":12},
      {"label":"Round 19","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Muzzle","colorNote":"In white yarn.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"Sc in each st around.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail. Pin onto face and sew into place before closing head."},
    {"name":"Head","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head onto the body, adding more stuffing as you go."},
    {"step":"Pin the muzzle onto the face and sew into place. Using black yarn, embroider the nose onto the muzzle."},
    {"step":"Pin the arms onto the body at a forward-facing angle and sew into place."},
    {"step":"Turn the body upside down, pin the legs onto the bottom and sew into place."},
    {"step":"Pinch ears at the base, sew 3 stitches together, then pin onto head and sew into place."}
  ]'
),

('fox', 'intermediate',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"belly": "white", "topLegs": "white", "topTail": "white", "earTips": "black", "nose": "black"}',
  '[
    {"name":"Body","colorNote":null,"rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Sc in each st around.","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Sc in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Sc in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Sc in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Arm (Make 2)","colorNote":"Switch to white for top of arm at round 11.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Rounds 4–6","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 7","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 8–9","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 10","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Round 11 — Start stuffing, change to white","instruction":"Dec, 14 sc.","stitchCount":15},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":15},
      {"label":"Round 14","instruction":"Dec, 13 sc.","stitchCount":14},
      {"label":"Rounds 15–16 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":14},
      {"label":"Round 17","instruction":"Dec, 12 sc.","stitchCount":13},
      {"label":"Rounds 18–19","instruction":"Sc in each st around.","stitchCount":13},
      {"label":"Round 20","instruction":"Dec, 11 sc.","stitchCount":12},
      {"label":"Round 21","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 2)","colorNote":"Switch to white for top of leg at round 12.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 7","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 8","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 9","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 10–11","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 12 — Start stuffing, change to white","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 13–14","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 15","instruction":"Dec, 15 sc.","stitchCount":16},
      {"label":"Rounds 16–17","instruction":"Sc in each st around.","stitchCount":16},
      {"label":"Round 18 — Stop stuffing","instruction":"(2 sc, dec) x 4.","stitchCount":12},
      {"label":"Round 19","instruction":"Sc in each st around.","stitchCount":12}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Belly Patch","colorNote":"In white yarn.","rounds":[
      {"label":"Ch 6","instruction":"Chain 6.","stitchCount":null},
      {"label":"Round 1","instruction":"Sc in 2nd ch from hook, 3 sc, inc3 in last chain, working on opposite side: 3 sc, inc.","stitchCount":12},
      {"label":"Round 2","instruction":"Inc, 3 sc, inc x 3, 3 sc, inc x 2.","stitchCount":18},
      {"label":"Round 3","instruction":"Sc, inc, 4 sc, inc, sc, inc, sc, inc, 4 sc, inc, sc, inc.","stitchCount":24},
      {"label":"Round 4","instruction":"2 sc, inc, 5 sc, inc, 2 sc, inc, 2 sc, inc, 5 sc, inc, 2 sc, inc.","stitchCount":30}
    ],"closingNote":"F/O and leave a long tail. Pin belly onto body and sew into place."},
    {"name":"Head","colorNote":null,"rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":"In main color with black tips.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Tail","colorNote":"Switch to white for last 4 rounds.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head onto the body, adding more stuffing as you go."},
    {"step":"Pin and sew the belly patch onto the front of the body."},
    {"step":"Pin the arms onto the body at a forward-facing angle and sew into place."},
    {"step":"Turn the body upside down, pin the legs onto the bottom and sew into place."},
    {"step":"Pin the ears (with black tips) onto the head and sew into place."},
    {"step":"Pin the tail (white tip) onto the back of the body and sew into place."},
    {"step":"Using black yarn, embroider the nose onto the face."}
  ]'
),

('sheep', 'advanced',
  'Approx. 15 cm tall',
  'Approx. 25 cm tall',
  'Approx. 35 cm tall',
  '{"ears": "brown", "face": "brown", "legs": "brown"}',
  '[
    {"name":"Body","colorNote":"In main color (fluffy/loop stitch for wool texture).","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"(3 sc, inc) x 6.","stitchCount":30},
      {"label":"Round 6","instruction":"(4 sc, inc) x 6.","stitchCount":36},
      {"label":"Round 7","instruction":"(5 sc, inc) x 6.","stitchCount":42},
      {"label":"Round 8","instruction":"(6 sc, inc) x 6.","stitchCount":48},
      {"label":"Rounds 9–12","instruction":"Loop stitch in each st around (creates wool texture).","stitchCount":48},
      {"label":"Round 13","instruction":"(6 sc, dec) x 6.","stitchCount":42},
      {"label":"Rounds 14–15","instruction":"Loop stitch in each st around.","stitchCount":42},
      {"label":"Round 16","instruction":"(5 sc, dec) x 6.","stitchCount":36},
      {"label":"Rounds 17–18","instruction":"Loop stitch in each st around.","stitchCount":36},
      {"label":"Round 19 — Start stuffing","instruction":"(4 sc, dec) x 6.","stitchCount":30},
      {"label":"Rounds 20–22","instruction":"Loop stitch in each st around.","stitchCount":30},
      {"label":"Round 23","instruction":"(3 sc, dec) x 6.","stitchCount":24},
      {"label":"Rounds 24–25","instruction":"Loop stitch in each st around.","stitchCount":24},
      {"label":"Round 26","instruction":"(2 sc, dec) x 6.","stitchCount":18}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Leg (Make 4)","colorNote":"In brown yarn.","rounds":[
      {"label":"Round 1","instruction":"Make 6 sc into a magic ring.","stitchCount":6},
      {"label":"Round 2","instruction":"Inc in each st around.","stitchCount":12},
      {"label":"Round 3","instruction":"(sc, inc) x 6.","stitchCount":18},
      {"label":"Round 4","instruction":"(2 sc, inc) x 6.","stitchCount":24},
      {"label":"Round 5","instruction":"Sc in each st around.","stitchCount":24},
      {"label":"Round 6","instruction":"(6 sc, dec) x 3.","stitchCount":21},
      {"label":"Round 7","instruction":"Sc in each st around.","stitchCount":21},
      {"label":"Round 8","instruction":"(5 sc, dec) x 3.","stitchCount":18},
      {"label":"Rounds 9–10","instruction":"Sc in each st around.","stitchCount":18},
      {"label":"Round 11 — Start stuffing","instruction":"Dec, 16 sc.","stitchCount":17},
      {"label":"Rounds 12–13","instruction":"Sc in each st around.","stitchCount":17},
      {"label":"Round 14","instruction":"(2 sc, dec) x 4.","stitchCount":13},
      {"label":"Round 15 — Stop stuffing","instruction":"Sc in each st around.","stitchCount":13}
    ],"closingNote":"F/O and leave a long tail for sewing."},
    {"name":"Head","colorNote":"In brown yarn.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."},
    {"name":"Ear (Make 2)","colorNote":"In brown yarn.","rounds":[],"closingNote":"Pattern coming soon — check tutorials for guidance."}
  ]',
  '[
    {"step":"Sew the head (brown) onto the body, adding more stuffing as you go."},
    {"step":"Pin all four legs onto the bottom of the body and sew into place."},
    {"step":"Pin the ears onto the sides of the head and sew into place."},
    {"step":"Using black yarn, embroider the nose onto the face."}
  ]'
);
```

---

### Task 3: PatternData Types

**Files:**
- Create: `lib/pattern/types.ts`

- [ ] **Step 1: Create the types file**

```typescript
// lib/pattern/types.ts

export type PatternRound = {
  label: string;
  instruction: string;
  stitchCount: number | null;
};

export type PatternPart = {
  name: string;
  colorNote?: string;
  rounds: PatternRound[];
  closingNote?: string;
};

export type PatternData = {
  plushieName: string;
  animal: string;
  size: string;
  skillLevel: string;
  finishedSize: string;
  materials: {
    yarn: { label: string; colorName: string; hex: string; yarnBrand: string }[];
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

- [ ] **Step 2: Verify TypeScript compiles**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/pattern/types.ts
git commit -m "feat: add PatternData types"
```

---

### Task 4: buildPatternData Pure Function

**Files:**
- Create: `lib/pattern/buildPatternData.ts`

- [ ] **Step 1: Create the builder function**

```typescript
// lib/pattern/buildPatternData.ts
import { PlushieConfig, COLOR_PALETTE } from "@/app/(app)/app/studio/types";
import { PatternData } from "./types";

const ABBREVIATIONS = [
  { abbr: "MR", meaning: "Magic Ring — crochet stitches into an adjustable loop" },
  { abbr: "ch", meaning: "Chain stitch" },
  { abbr: "sc", meaning: "Single crochet" },
  { abbr: "sl st", meaning: "Slip stitch" },
  { abbr: "dc", meaning: "Double crochet" },
  { abbr: "inc", meaning: "Increase — make 2 sc in the same stitch" },
  { abbr: "dec", meaning: "Decrease — crochet 2 stitches together" },
  { abbr: "BLO", meaning: "Back Loop Only" },
  { abbr: "FLO", meaning: "Front Loop Only" },
  { abbr: "F/O", meaning: "Fasten off" },
];

const NOTES = [
  "Do not join rounds unless stated. Work in a continuous spiral.",
  "Place a stitch marker at the last stitch of each round and move it up as you go.",
  "All stitches are worked in both loops unless stated otherwise.",
  "Visit the Tutorials page in the app for video recommendations and step-by-step guides.",
];

const YARN_BY_SIZE: Record<string, { brand: string; type: string; hook: string }> = {
  small:  { brand: "Katia Capri",   type: "100% cotton",              hook: "2mm crochet hook (or size suitable for yarn used)" },
  medium: { brand: "Katia Alabama", type: "50% cotton, 50% acrylic",  hook: "4mm crochet hook (or size suitable for yarn used)" },
  large:  { brand: "Katia Bambi",   type: "plush yarn",               hook: "6mm crochet hook (or size suitable for yarn used)" },
};

const EYES_BY_SIZE: Record<string, string> = {
  small:  "4–6mm safety eyes",
  medium: "8mm safety eyes",
  large:  "10–12mm safety eyes",
};

type TemplateRow = {
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: Record<string, string>;
  parts: PatternData["parts"];
  assembly: { step: string }[];
};

export function buildPatternData(
  config: PlushieConfig,
  template: TemplateRow
): PatternData {
  const size = config.size ?? "medium";
  const yarn = YARN_BY_SIZE[size];
  const colorName = COLOR_PALETTE.find((c) => c.hex === config.color)?.name ?? config.color ?? "Main Color";

  const finishedSize =
    size === "small"
      ? template.finished_size_small
      : size === "large"
      ? template.finished_size_large
      : template.finished_size_medium;

  // Build yarn list: main color first, then accent colors
  const yarnList: PatternData["materials"]["yarn"] = [
    {
      label: "Main Color (MC)",
      colorName,
      hex: config.color ?? "#ffffff",
      yarnBrand: `${yarn.brand} (${yarn.type})`,
    },
  ];

  const accentLabels: Record<string, string> = {
    nose: "Nose",
    belly: "Belly & Chest",
    topLegs: "Top of Legs",
    topTail: "Top of Tail",
    tail: "Tail Tip",
    muzzle: "Muzzle",
    earTips: "Ear Tips",
    innerEars: "Inner Ears",
    whiskers: "Whiskers",
    ears: "Ears",
    face: "Face",
    legs: "Legs",
  };

  const accentHex: Record<string, string> = {
    black: "#1a1a1a",
    white: "#ffffff",
    "light pink": "#ffb6c1",
    brown: "#8B4513",
    contrast: "#ffffff", // placeholder — user picks main color, contrast is opposite
  };

  for (const [key, colorValue] of Object.entries(template.accent_colors)) {
    yarnList.push({
      label: accentLabels[key] ?? key,
      colorName: colorValue.charAt(0).toUpperCase() + colorValue.slice(1),
      hex: accentHex[colorValue] ?? "#cccccc",
      yarnBrand: `${yarn.brand} (${yarn.type})`,
    });
  }

  return {
    plushieName: config.name ?? "My Plushie",
    animal: config.animal ?? "bear",
    size,
    skillLevel: template.skill_level,
    finishedSize,
    materials: {
      yarn: yarnList,
      hook: yarn.hook,
      eyes: config.eyes === "x-sewed" ? null : EYES_BY_SIZE[size],
      other: [
        "Yarn needle for assembly",
        "Stitch markers",
        "Toy stuffing",
        ...(config.eyes === "x-sewed" ? ["Black yarn for X-sewed eyes"] : []),
      ],
    },
    abbreviations: ABBREVIATIONS,
    notes: NOTES,
    parts: template.parts,
    assembly: template.assembly,
  };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add lib/pattern/buildPatternData.ts
git commit -m "feat: add buildPatternData pure function"
```

---

### Task 5: generatePattern Server Action

**Files:**
- Create: `app/(app)/app/studio/actions.ts`

- [ ] **Step 1: Create the Server Action**

```typescript
// app/(app)/app/studio/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";
import { PlushieConfig } from "./types";
import { buildPatternData } from "@/lib/pattern/buildPatternData";
import { PatternData } from "@/lib/pattern/types";

export async function generatePattern(
  config: PlushieConfig
): Promise<{ patternId: string; patternData: PatternData }> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data: template, error: templateError } = await supabase
    .from("pattern_templates")
    .select("skill_level, finished_size_small, finished_size_medium, finished_size_large, accent_colors, parts, assembly")
    .eq("animal", config.animal)
    .single();

  if (templateError || !template) {
    throw new Error(`Template not found for animal: ${config.animal}`);
  }

  const patternData = buildPatternData(config, template);

  const { data: saved, error: saveError } = await supabase
    .from("patterns")
    .insert({
      user_id: user.id,
      name: patternData.plushieName,
      animal: patternData.animal,
      size: patternData.size,
      color: config.color ?? "#ffffff",
      color_name: patternData.materials.yarn[0].colorName,
      eyes: config.eyes ?? "safety",
      accessory: config.accessory ?? null,
      accessory_color: config.accessoryColor ?? null,
      skill_level: patternData.skillLevel,
      pattern_data: patternData,
      is_favourite: false,
    })
    .select("id")
    .single();

  if (saveError || !saved) {
    throw new Error("Failed to save pattern");
  }

  return { patternId: saved.id, patternData };
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/app/studio/actions.ts lib/pattern/buildPatternData.ts lib/pattern/types.ts
git commit -m "feat: add generatePattern server action"
```

---

### Task 6: Wire StepGenerating to Server Action

**Files:**
- Modify: `app/(app)/app/studio/components/StepGenerating.tsx`
- Modify: `app/(app)/app/studio/page.tsx`

- [ ] **Step 1: Update StepGenerating**

Replace the entire file:

```tsx
// app/(app)/app/studio/components/StepGenerating.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { PlushieConfig } from "../types";
import { generatePattern } from "../actions";
import { PatternData } from "@/lib/pattern/types";

interface StepGeneratingProps {
  config: PlushieConfig;
  onDone: (result: { patternId: string; patternData: PatternData }) => void;
}

export default function StepGenerating({ config, onDone }: StepGeneratingProps) {
  const [error, setError] = useState<string | null>(null);
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    generatePattern(config)
      .then(onDone)
      .catch((err) => {
        setError(err?.message ?? "Something went wrong. Please try again.");
      });
  }, [config, onDone]);

  if (error) {
    return (
      <div className="w-full max-w-130 bg-white rounded-[24px] p-12 shadow-2xl flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-[18px] font-semibold text-ink">Something went wrong</p>
          <p className="text-[14px] text-black/40">{error}</p>
        </div>
        <button
          onClick={() => {
            setError(null);
            called.current = false;
            generatePattern(config).then(onDone).catch((err) => {
              setError(err?.message ?? "Something went wrong. Please try again.");
            });
          }}
          className="px-6 py-2.5 rounded-[12px] bg-deep text-(--color-accent) text-[14px] font-bold cursor-pointer hover:bg-[#7a1c35] transition-colors"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-130 bg-white rounded-[24px] p-12 shadow-2xl flex flex-col items-center gap-6">
      <div className="w-20 h-20 rounded-full bg-black/10 animate-pulse" />
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="text-[18px] font-semibold text-ink">Generating your pattern…</p>
        <p className="text-[14px] text-black/40">This will only take a moment</p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update page.tsx wizard state to hold patternId + patternData**

In `app/(app)/app/studio/page.tsx`, add state for the generation result and update the `handleGeneratingDone` callback and step rendering:

```tsx
// Add these imports at the top:
import { PatternData } from "@/lib/pattern/types";

// Add this state after the existing useState calls:
const [generationResult, setGenerationResult] = useState<{
  patternId: string;
  patternData: PatternData;
} | null>(null);

// Replace handleGeneratingDone:
const handleGeneratingDone = useCallback((result: { patternId: string; patternData: PatternData }) => {
  setGenerationResult(result);
  setStepIndex((i) => i + 1);
  setShowToast(true);
}, []);

// Replace handleReset:
const handleReset = useCallback(() => {
  setConfig(EMPTY_CONFIG);
  setStepIndex(0);
  setWizardActive(false);
  setGenerationResult(null);
}, []);

// Update the StepGenerating render line:
{currentStep === "generating" && <StepGenerating config={config} onDone={handleGeneratingDone} />}

// Update the StepResult render line:
{currentStep === "result" && generationResult && (
  <StepResult
    config={config}
    patternData={generationResult.patternData}
    patternId={generationResult.patternId}
    onReset={handleReset}
  />
)}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/studio/components/StepGenerating.tsx" "app/(app)/app/studio/page.tsx"
git commit -m "feat: wire StepGenerating to generatePattern server action"
```

---

### Task 7: StepResult with Save & Download

**Files:**
- Modify: `app/(app)/app/studio/components/StepResult.tsx`
- Create: `app/(app)/app/studio/components/PatternPDF.tsx`

- [ ] **Step 1: Create PatternPDF component**

```tsx
// app/(app)/app/studio/components/PatternPDF.tsx
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { PatternData } from "@/lib/pattern/types";

const DARK = "#2a3f4f";
const BRAND = "#417c9c";
const ACCENT = "#c9a96e";
const WHITE = "#ffffff";
const SOFT = "#f0f4f6";

const styles = StyleSheet.create({
  page: {
    backgroundColor: DARK,
    padding: 36,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 28,
    fontFamily: "Helvetica-Bold",
    color: WHITE,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#ffffff99",
    marginBottom: 20,
    textTransform: "capitalize",
  },
  card: {
    backgroundColor: WHITE,
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 9,
    color: "#716458",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  value: {
    fontSize: 11,
    color: "#1a1a1a",
  },
  yarnItem: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 3,
  },
  toolItem: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 3,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 10,
  },
  abbrRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  abbrKey: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    width: 40,
  },
  abbrVal: {
    fontSize: 10,
    color: "#1a1a1a",
    flex: 1,
  },
  noteItem: {
    fontSize: 10,
    color: "#1a1a1a",
    marginBottom: 4,
  },
  partHeader: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: BRAND,
    marginBottom: 2,
  },
  colorNote: {
    fontSize: 9,
    color: "#716458",
    fontStyle: "italic",
    marginBottom: 6,
  },
  round: {
    flexDirection: "row",
    marginBottom: 3,
  },
  roundLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    width: 90,
    flexShrink: 0,
  },
  roundInstruction: {
    fontSize: 10,
    color: "#1a1a1a",
    flex: 1,
  },
  roundCount: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1a1a1a",
    marginLeft: 4,
  },
  closingNote: {
    fontSize: 9,
    color: "#716458",
    fontStyle: "italic",
    marginTop: 4,
  },
  assemblyStep: {
    flexDirection: "row",
    marginBottom: 5,
  },
  assemblyNum: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: ACCENT,
    width: 20,
  },
  assemblyText: {
    fontSize: 10,
    color: "#1a1a1a",
    flex: 1,
  },
  placeholderImage: {
    width: "100%",
    height: 140,
    backgroundColor: SOFT,
    borderRadius: 8,
    marginBottom: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 10,
    color: "#aaa",
  },
  stars: {
    fontSize: 14,
    color: ACCENT,
  },
  skillRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

function Stars({ level }: { level: string }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return <Text style={styles.stars}>{"★".repeat(count)}{"☆".repeat(3 - count)}</Text>;
}

interface PatternPDFProps {
  data: PatternData;
}

export default function PatternPDF({ data }: PatternPDFProps) {
  return (
    <Document>
      {/* Page 1: Cover + Materials */}
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{data.plushieName}</Text>
        <Text style={styles.subtitle}>
          {data.animal} · {data.size} · {data.finishedSize}
        </Text>

        {/* Placeholder image */}
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Photo coming soon</Text>
        </View>

        {/* Materials */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Materials</Text>
          <View style={styles.row}>
            {/* Left: yarn */}
            <View style={styles.col}>
              <Text style={styles.label}>Yarn</Text>
              {data.materials.yarn.map((y, i) => (
                <Text key={i} style={styles.yarnItem}>
                  • {y.label}: {y.colorName} — {y.yarnBrand}
                </Text>
              ))}
            </View>
            <View style={{ width: 1, backgroundColor: "#e0e0e0", marginHorizontal: 12 }} />
            {/* Right: tools */}
            <View style={styles.col}>
              <Text style={styles.label}>Tools</Text>
              <Text style={styles.toolItem}>• {data.materials.hook}</Text>
              {data.materials.eyes && (
                <Text style={styles.toolItem}>• {data.materials.eyes}</Text>
              )}
              {data.materials.other.map((o, i) => (
                <Text key={i} style={styles.toolItem}>• {o}</Text>
              ))}
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.skillRow}>
            <View>
              <Text style={styles.label}>Finished Size</Text>
              <Text style={styles.value}>{data.finishedSize}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.label}>Skill Level</Text>
              <Stars level={data.skillLevel} />
              <Text style={{ fontSize: 9, color: "#716458", textTransform: "capitalize" }}>
                {data.skillLevel}
              </Text>
            </View>
          </View>
        </View>
      </Page>

      {/* Page 2: Abbreviations + Notes */}
      <Page size="A4" style={styles.page}>
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Abbreviations</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {data.abbreviations.map((a, i) => (
              <View key={i} style={{ ...styles.abbrRow, width: "50%" }}>
                <Text style={styles.abbrKey}>{a.abbr}</Text>
                <Text style={styles.abbrVal}>{a.meaning}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardHeader}>Notes</Text>
          {data.notes.map((n, i) => (
            <Text key={i} style={styles.noteItem}>• {n}</Text>
          ))}
        </View>
      </Page>

      {/* Page 3+: Pattern Parts */}
      <Page size="A4" style={styles.page}>
        {data.parts.map((part, pi) => (
          <View key={pi} style={styles.card}>
            <Text style={styles.partHeader}>{part.name}</Text>
            {part.colorNote && (
              <Text style={styles.colorNote}>{part.colorNote}</Text>
            )}
            {part.rounds.map((r, ri) => (
              <View key={ri} style={styles.round}>
                <Text style={styles.roundLabel}>{r.label}:</Text>
                <Text style={styles.roundInstruction}>{r.instruction}</Text>
                {r.stitchCount !== null && (
                  <Text style={styles.roundCount}>({r.stitchCount} sc)</Text>
                )}
              </View>
            ))}
            {part.closingNote && (
              <Text style={styles.closingNote}>{part.closingNote}</Text>
            )}
          </View>
        ))}

        {/* Assembly */}
        <View style={styles.card}>
          <Text style={styles.cardHeader}>Assembly</Text>
          {data.assembly.map((s, i) => (
            <View key={i} style={styles.assemblyStep}>
              <Text style={styles.assemblyNum}>{i + 1}.</Text>
              <Text style={styles.assemblyText}>{s.step}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
}
```

- [ ] **Step 2: Replace StepResult**

```tsx
// app/(app)/app/studio/components/StepResult.tsx
"use client";

import { useRouter } from "next/navigation";
import { Download, BookMarked } from "lucide-react";
import { PlushieConfig } from "../types";
import { PatternData } from "@/lib/pattern/types";
import dynamic from "next/dynamic";

// @react-pdf/renderer must be loaded client-only
const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);
const PatternPDF = dynamic(() => import("./PatternPDF"), { ssr: false });

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Stars({ level }: { level: string }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <span className="text-[--color-accent]">
      {"★".repeat(count)}{"☆".repeat(3 - count)}
    </span>
  );
}

interface StepResultProps {
  config: PlushieConfig;
  patternData: PatternData;
  patternId: string;
  onReset: () => void;
}

export default function StepResult({ config, patternData, patternId, onReset }: StepResultProps) {
  const router = useRouter();

  const fileName = `${patternData.plushieName.replace(/\s+/g, "-").toLowerCase()}-pattern.pdf`;

  return (
    <div className="w-full max-w-lg bg-white rounded-[24px] p-8 shadow-2xl flex flex-col gap-6">
      <div>
        <h2 className="text-[26px] font-bold text-ink">
          {patternData.plushieName} the {capitalize(patternData.animal)}
        </h2>
        <p className="text-[14px] text-black/40 mt-1">
          {capitalize(patternData.size)} · {patternData.materials.yarn[0].colorName} · <Stars level={patternData.skillLevel} /> {capitalize(patternData.skillLevel)}
        </p>
      </div>

      <div className="bg-black/5 border border-black/10 rounded-[16px] px-4 py-3 flex flex-col gap-1">
        <span className="text-[12px] text-black/40 uppercase tracking-wide">Finished size</span>
        <span className="text-[14px] font-semibold text-ink">{patternData.finishedSize}</span>
      </div>

      <div className="flex flex-col gap-3">
        {/* Save for now */}
        <button
          onClick={() => router.push("/app/my-patterns")}
          className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] border-2 border-deep text-deep text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-deep hover:text-(--color-accent) hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          <BookMarked size={16} />
          Save for now, download later
        </button>

        {/* Download PDF */}
        {typeof window !== "undefined" && (
          <PDFDownloadLink
            document={<PatternPDF data={patternData} />}
            fileName={fileName}
            onDocumentGenerated={() => setPdfReady(true)}
          >
            {({ loading }) => (
              <button
                onClick={() => {
                  // Navigate to My Patterns after a short delay to let download start
                  setTimeout(() => router.push("/app/my-patterns"), 800);
                }}
                disabled={loading}
                className="flex items-center justify-center gap-2 w-full px-6 py-3 rounded-[12px] bg-deep text-(--color-accent) text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-black hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
              >
                <Download size={16} />
                {loading ? "Preparing PDF…" : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>

      <button
        onClick={onReset}
        className="w-full text-[14px] text-black/40 hover:text-ink transition-colors py-2 cursor-pointer"
      >
        Design another
      </button>
    </div>
  );
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 4: Smoke test the wizard end-to-end**

Start dev server (`bun dev`), navigate to `http://localhost:3000/app/studio`, go through the full wizard, verify:
1. StepGenerating calls the action (check Network tab — should see a POST server action request)
2. StepResult shows the plushie name and animal correctly
3. "Save for now" navigates to `/app/my-patterns`
4. "Download PDF" triggers a download and navigates to `/app/my-patterns`

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/app/studio/components/StepResult.tsx" "app/(app)/app/studio/components/PatternPDF.tsx"
git commit -m "feat: add PatternPDF component and wire StepResult with save/download"
```

---

### Task 8: toggleFavourite Server Action

**Files:**
- Create: `app/(app)/app/my-patterns/actions.ts`

- [ ] **Step 1: Create the action**

```typescript
// app/(app)/app/my-patterns/actions.ts
"use server";

import { createClient } from "@/lib/supabase/server";

export async function toggleFavourite(
  patternId: string,
  isFavourite: boolean
): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("patterns")
    .update({ is_favourite: isFavourite })
    .eq("id", patternId)
    .eq("user_id", user.id);

  if (error) throw new Error("Failed to update favourite");
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/my-patterns/actions.ts"
git commit -m "feat: add toggleFavourite server action"
```

---

### Task 9: PatternCard Component

**Files:**
- Create: `app/(app)/app/my-patterns/PatternCard.tsx`

- [ ] **Step 1: Create PatternCard**

```tsx
// app/(app)/app/my-patterns/PatternCard.tsx
"use client";

import { useState } from "react";
import { Heart, Download } from "lucide-react";
import { toggleFavourite } from "./actions";
import { PatternData } from "@/lib/pattern/types";
import dynamic from "next/dynamic";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((m) => m.PDFDownloadLink),
  { ssr: false }
);
const PatternPDF = dynamic(
  () => import("../studio/components/PatternPDF"),
  { ssr: false }
);

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function Stars({ level }: { level: string }) {
  const count = level === "beginner" ? 1 : level === "intermediate" ? 2 : 3;
  return (
    <span className="text-[--color-accent] text-[14px]">
      {"★".repeat(count)}{"☆".repeat(3 - count)}
    </span>
  );
}

interface PatternCardProps {
  id: string;
  name: string;
  animal: string;
  size: string;
  colorName: string;
  skillLevel: string;
  isFavourite: boolean;
  patternData: PatternData;
  yarnBrand: string;
}

export default function PatternCard({
  id,
  name,
  animal,
  size,
  colorName,
  skillLevel,
  isFavourite: initialFavourite,
  patternData,
  yarnBrand,
}: PatternCardProps) {
  const [favourite, setFavourite] = useState(initialFavourite);
  const [toggling, setToggling] = useState(false);

  const fileName = `${name.replace(/\s+/g, "-").toLowerCase()}-pattern.pdf`;

  async function handleToggle() {
    if (toggling) return;
    setToggling(true);
    const next = !favourite;
    setFavourite(next); // optimistic
    try {
      await toggleFavourite(id, next);
    } catch {
      setFavourite(!next); // revert on error
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="bg-white rounded-[16px] shadow-sm overflow-hidden flex flex-col">
      {/* Image area */}
      <div className="relative aspect-square bg-warm/10 flex items-center justify-center">
        <span className="text-[13px] text-warm/60">Photo coming soon</span>
        <button
          onClick={handleToggle}
          className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-sm cursor-pointer transition-transform hover:scale-110 active:scale-95"
          title={favourite ? "Remove from favourites" : "Add to favourites"}
        >
          <Heart
            size={16}
            className={favourite ? "fill-deep text-deep" : "text-warm/50"}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[14px] font-bold text-ink leading-snug">
            {name} the {capitalize(animal)}
          </h3>
          <Stars level={skillLevel} />
        </div>
        <p className="text-[12px] text-warm">
          {capitalize(size)} · {colorName} {yarnBrand}
        </p>

        {/* Download */}
        {typeof window !== "undefined" && (
          <PDFDownloadLink
            document={<PatternPDF data={patternData} />}
            fileName={fileName}
            className="mt-auto"
          >
            {({ loading }) => (
              <button
                disabled={loading}
                className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-[10px] bg-deep text-(--color-accent) text-[13px] font-semibold transition-all duration-200 hover:bg-black hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Download size={14} />
                {loading ? "Preparing…" : "Download PDF"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/my-patterns/PatternCard.tsx"
git commit -m "feat: add PatternCard component with favourite toggle and PDF download"
```

---

### Task 10: FavouritesCarousel Component

**Files:**
- Create: `app/(app)/app/my-patterns/FavouritesCarousel.tsx`

- [ ] **Step 1: Create FavouritesCarousel**

```tsx
// app/(app)/app/my-patterns/FavouritesCarousel.tsx
"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PatternCard from "./PatternCard";
import { PatternData } from "@/lib/pattern/types";

interface FavouritePattern {
  id: string;
  name: string;
  animal: string;
  size: string;
  color_name: string;
  skill_level: string;
  is_favourite: boolean;
  pattern_data: PatternData;
}

interface FavouritesCarouselProps {
  patterns: FavouritePattern[];
}

export default function FavouritesCarousel({ patterns }: FavouritesCarouselProps) {
  const [index, setIndex] = useState(0);

  if (patterns.length === 0) return null;

  const visible = patterns[index];
  const yarnBrand = visible.pattern_data.materials.yarn[0]?.yarnBrand?.split(" ")[0] ?? "Alabama";

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-[16px] font-bold text-white">Favourites</h2>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(i - 1, 0))}
          disabled={index === 0}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/25 transition-colors cursor-pointer shrink-0"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="w-55 shrink-0">
          <PatternCard
            id={visible.id}
            name={visible.name}
            animal={visible.animal}
            size={visible.size}
            colorName={visible.color_name}
            skillLevel={visible.skill_level}
            isFavourite={visible.is_favourite}
            patternData={visible.pattern_data}
            yarnBrand={yarnBrand}
          />
        </div>

        <button
          onClick={() => setIndex((i) => Math.min(i + 1, patterns.length - 1))}
          disabled={index === patterns.length - 1}
          className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center text-white disabled:opacity-30 hover:bg-white/25 transition-colors cursor-pointer shrink-0"
        >
          <ChevronRight size={18} />
        </button>

        <span className="text-[12px] text-white/50 shrink-0">
          {index + 1} / {patterns.length}
        </span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/my-patterns/FavouritesCarousel.tsx"
git commit -m "feat: add FavouritesCarousel component"
```

---

### Task 11: PatternsGrid Component

**Files:**
- Create: `app/(app)/app/my-patterns/PatternsGrid.tsx`

- [ ] **Step 1: Create PatternsGrid**

```tsx
// app/(app)/app/my-patterns/PatternsGrid.tsx
"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpAZ, ArrowDownAZ } from "lucide-react";
import PatternCard from "./PatternCard";
import { PatternData } from "@/lib/pattern/types";

const PAGE_SIZE = 9;

interface GridPattern {
  id: string;
  name: string;
  animal: string;
  size: string;
  color_name: string;
  skill_level: string;
  is_favourite: boolean;
  pattern_data: PatternData;
}

interface PatternsGridProps {
  patterns: GridPattern[];
}

export default function PatternsGrid({ patterns }: PatternsGridProps) {
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    const result = q
      ? patterns.filter((p) => p.name.toLowerCase().includes(q))
      : [...patterns];
    result.sort((a, b) =>
      sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
    );
    return result;
  }, [patterns, search, sortAsc]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageItems = filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE);

  function handleSearch(value: string) {
    setSearch(value);
    setPage(0);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Controls */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Search patterns…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/10 border border-white/15 rounded-[12px] pl-9 pr-4 py-2.5 text-[14px] text-white placeholder:text-white/40 outline-none focus:border-white/40 transition-colors"
          />
        </div>
        <button
          onClick={() => { setSortAsc((v) => !v); setPage(0); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[12px] bg-white/10 border border-white/15 text-[13px] font-medium text-white hover:bg-white/20 transition-colors cursor-pointer shrink-0"
          title={sortAsc ? "Sort Z→A" : "Sort A→Z"}
        >
          {sortAsc ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
          {sortAsc ? "A → Z" : "Z → A"}
        </button>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <p className="text-[14px] text-white/50 text-center py-10">No patterns found.</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {pageItems.map((p) => {
            const yarnBrand = p.pattern_data.materials.yarn[0]?.yarnBrand?.split(" ")[0] ?? "Alabama";
            return (
              <PatternCard
                key={p.id}
                id={p.id}
                name={p.name}
                animal={p.animal}
                size={p.size}
                colorName={p.color_name}
                skillLevel={p.skill_level}
                isFavourite={p.is_favourite}
                patternData={p.pattern_data}
                yarnBrand={yarnBrand}
              />
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 0))}
            disabled={safePage === 0}
            className="px-4 py-2 rounded-[10px] bg-white/10 text-white text-[13px] font-medium disabled:opacity-30 hover:bg-white/20 transition-colors cursor-pointer"
          >
            Previous
          </button>
          <span className="text-[13px] text-white/60">
            Page {safePage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages - 1))}
            disabled={safePage === totalPages - 1}
            className="px-4 py-2 rounded-[10px] bg-white/10 text-white text-[13px] font-medium disabled:opacity-30 hover:bg-white/20 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/my-patterns/PatternsGrid.tsx"
git commit -m "feat: add PatternsGrid with search, sort and pagination"
```

---

### Task 12: My Patterns Page (Server Component)

**Files:**
- Replace: `app/(app)/app/my-patterns/page.tsx`

- [ ] **Step 1: Replace the placeholder page**

```tsx
// app/(app)/app/my-patterns/page.tsx
import { createClient } from "@/lib/supabase/server";
import Image from "next/image";
import GrainientFade from "../components/GrainientFade";
import FavouritesCarousel from "./FavouritesCarousel";
import PatternsGrid from "./PatternsGrid";

export default async function MyPatternsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: patterns } = user
    ? await supabase
        .from("patterns")
        .select("id, name, animal, size, color_name, skill_level, is_favourite, pattern_data")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] };

  const allPatterns = patterns ?? [];
  const favourites = allPatterns.filter((p) => p.is_favourite);

  return (
    <div className="relative h-full w-full overflow-y-auto">
      {/* Grainient background */}
      <GrainientFade
        color1="#417c9c"
        color2="#2d5f7a"
        color3="#5a8fa8"
        timeSpeed={0.15}
        warpStrength={0.7}
        warpFrequency={3}
        warpSpeed={1.5}
        warpAmplitude={35}
        blendAngle={60}
        blendSoftness={0.1}
        rotationAmount={250}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.85}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 px-8 py-10 flex flex-col gap-8">

        <h1 className="text-[28px] font-bold text-white leading-tight">My Patterns</h1>

        {allPatterns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M14 2v6h6M9 13h6M9 17h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h2 className="text-[22px] font-bold text-white">No patterns yet</h2>
            <p className="text-[15px] text-white/70 font-medium leading-relaxed max-w-90">
              Your saved patterns will appear here. Head to the Studio to design your first plushie.
            </p>
          </div>
        ) : (
          <>
            {favourites.length > 0 && (
              <FavouritesCarousel patterns={favourites} />
            )}
            <PatternsGrid patterns={allPatterns} />
          </>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit 2>&1 | head -20
```

Expected: no errors.

- [ ] **Step 3: Smoke test My Patterns**

Navigate to `http://localhost:3000/app/my-patterns`:
1. If no patterns saved yet: should show the empty state with the document icon
2. After generating a pattern in the Studio: refresh My Patterns — card should appear in the grid
3. Click the heart on a card → it should fill red (optimistic update)
4. Refresh — heart should stay filled (persisted to Supabase)
5. When ≥1 favourited: the Favourites carousel should appear above the grid
6. Search by plushie name → grid filters correctly
7. Sort toggle → cards reorder A→Z / Z→A
8. With >9 patterns: pagination controls appear

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/my-patterns/page.tsx"
git commit -m "feat: rebuild My Patterns page with favourites carousel and patterns grid"
```
