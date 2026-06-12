# Admin Panel Implementation Design

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a `/admin` section accessible only to `ivo.pastin@gmail.com` for managing templates, news, reviews, and viewing dashboard analytics.

**Architecture:** New route group `app/(admin)/admin/` alongside the existing `app/(app)/app/`. Middleware blocks non-admin users from `/admin/*`. Admin can freely access both `/admin` and `/app`. Shares the same visual style (GrainientFade background, white/opacity design tokens) as the main app but has its own sidebar.

**Tech Stack:** Next.js 15 App Router, Supabase (postgres + storage), shadcn/ui charts, Tailwind v4

---

## Access Control

- Middleware checks: if path starts with `/admin` and `user.email !== "ivo.pastin@gmail.com"`, redirect to `/app`
- Admin can visit `/app` normally — no restrictions added there
- Admin email hardcoded in middleware (no env var, no database column)

## Route Structure

```
app/(admin)/
  layout.tsx          — admin shell: GrainientFade bg + admin sidebar
  admin/
    page.tsx          — redirects to /admin/dashboard
    dashboard/
      page.tsx
    templates/
      page.tsx        — lists both template types with tabs
    news/
      page.tsx        — lists news items
    reviews/
      page.tsx        — lists all reviews
```

## Admin Sidebar

Same style as the app sidebar. Nav items:
- Dashboard
- Templates
- News
- Reviews

No user patterns listed (unlike the app sidebar). Shows the admin's avatar/name at the bottom.

---

## Data Layer

### New: `news` Supabase table

Migrated from `content/news.json`. The home page switches from reading the JSON file to fetching from this table.

```sql
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  image_url text,
  date date NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news" ON public.news
  FOR SELECT USING (true);

CREATE POLICY "Admin can do anything" ON public.news
  USING (auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com');
```

Seed with the 3 existing items from `news.json`. Keep `news.json` as fallback but home page reads from DB.

### New: `news-images` Supabase Storage bucket

- Public bucket for news images
- Admin uploads images, gets back a public URL stored in `news.image_url`
- RLS: anyone can read, only admin can upload/delete

### Existing tables used

- `pattern_templates` — admin reads/writes directly (already exists)
- `accessory_templates` — admin reads/writes directly (already exists)
- `reviews` — admin reads all, deletes any
- `profiles` — admin reads for user count

---

## Dashboard Page

### Stat cards (4)
- **Total Users** — `COUNT(*)` from `profiles`
- **Total Patterns** — `COUNT(*)` from `patterns`
- **Total Reviews** — `COUNT(*)` from `reviews`
- **Avg Rating** — `AVG(stars)` from `reviews`, shown as X.X ★

### Charts (shadcn)
1. **New Users per Day** — line chart, last 30 days, x-axis = date, y-axis = count. Data from `profiles.created_at`.
2. **Reviews per Day** — bar chart, last 30 days, x-axis = date, y-axis = count of reviews. Data from `reviews.created_at`.

Both charts use shadcn `<ChartContainer>` with recharts underneath.

---

## Templates Page

Two tabs: **Plushie** | **Accessory**

### Plushie tab
- Lists all rows from `pattern_templates` as cards: name, animal, skill_level, 3 size columns
- Each card has **Edit** and **Delete** buttons
- **Add New** button at top opens an inline form (or slide-in panel)

### Accessory tab
- Lists all rows from `accessory_templates`: name (slug), 
- Each card has **Edit** and **Delete** buttons
- **Add New** button opens form

### Template form fields
**Simple text inputs:**
- `animal` (plushie only)
- `skill_level` (select: beginner / intermediate / advanced)
- `finished_size_small`, `finished_size_medium`, `finished_size_large` (plushie only)
- `name` (accessory slug, e.g. "hat")

**JSON textareas:**
- `parts` — validated as JSON on submit, shows error if invalid
- `assembly` — validated as JSON on submit, shows error if invalid
- `accent_colors` — validated as JSON on submit (plushie only)

Delete shows a confirmation dialog before executing.

---

## News Page

Lists all news items from the `news` table, sorted by `date` descending, as cards showing title, tag, date, and a truncated summary.

Each card has **Edit** and **Delete** buttons. **Add New** button at top.

### News form fields
- `title` — text input
- `summary` — textarea (short)
- `body` — textarea (long, markdown-friendly but stored as plain text)
- `tag` — text input (e.g. "New Pattern", "Update", "Limited Edition")
- `date` — date input
- `image` — file upload input → uploads to `news-images` Supabase Storage bucket → stores returned public URL in `image_url`

Delete shows a confirmation dialog before executing.

---

## Reviews Page

Table with columns: **User**, **Stars**, **Description**, **Pattern**, **Date**, **Actions**

- Shows all reviews from `reviews` table, sorted by `created_at` descending
- Stars rendered as filled/empty star icons
- Description truncated to 80 chars with tooltip/expand for full text
- **Delete** button per row with confirmation dialog
- No editing — delete only

---

## Server Actions

All mutations use Next.js server actions in `app/(admin)/admin/actions.ts`:

- `addTemplate(type, data)` — insert into `pattern_templates` or `accessory_templates`
- `updateTemplate(type, id, data)` — update by id
- `deleteTemplate(type, id)` — delete by id
- `addNews(data, imageFile)` — upload image if present, insert into `news`
- `updateNews(id, data, imageFile?)` — upload new image if present, update `news`
- `deleteNews(id)` — delete from `news`, delete image from storage if present
- `deleteReview(id)` — delete from `reviews`

Each action verifies the calling user's email is `ivo.pastin@gmail.com` before executing — double-checking on the server even though middleware already gates the routes.

---

## Home Page Migration

`app/(app)/app/page.tsx` currently reads from `content/news.json`. After this change:
- Fetches from `news` Supabase table instead
- `export const revalidate = 3600` (1 hour cache, since news changes rarely)
- `NewsCard` component receives data in same shape — no changes needed to the card itself
- `news.json` kept on disk but no longer imported anywhere
