# Onboarding Modal Design — MyToys Crate

**Date:** 2026-05-25
**Scope:** User profile table, onboarding modal on first login, sidebar profile display

---

## Overview

When a user logs in for the first time (or any login until they complete onboarding), a modal overlay appears asking them to set their display name, avatar color, and experience level. This data is stored in a `profiles` table in Supabase. Once completed, the modal never appears again. If skipped, it reappears on the next login.

---

## Database

### Table: `profiles`

```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_color text,
  experience_level text check (experience_level in ('beginner', 'intermediate', 'advanced')),
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now()
);
alter table profiles enable row level security;
create policy "Users can read own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
```

### Trigger: auto-create profile on signup

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

This ensures every new user gets a `profiles` row with `onboarding_completed = false` automatically.

---

## Architecture

**Approach:** Server-side check in the app layout. `(app)/app/layout.tsx` becomes an async Server Component that fetches the profile on every request. If `onboarding_completed` is `false`, it renders `OnboardingModal` as an overlay over the app.

### New Files

| File | Purpose |
|------|---------|
| `app/(app)/app/components/OnboardingModal.tsx` | Client Component — modal UI, form state, Supabase update call |

### Modified Files

| File | Change |
|------|--------|
| `app/(app)/app/layout.tsx` | Async Server Component — fetches profile, passes `onboardingCompleted` to modal |
| `app/(app)/app/AppSidebar.tsx` | Reads `display_name` and `avatar_color` from profile passed as props, replaces hardcoded values |

---

## Data Flow

1. User logs in → navigates to `/app`
2. `layout.tsx` fetches profile via server Supabase client
3. If `onboarding_completed = false` → renders `<OnboardingModal />` as overlay
4. User fills form → clicks **Save** → client calls `supabase.from('profiles').update({ display_name, avatar_color, experience_level, onboarding_completed: true })`
5. On success → `router.refresh()` → layout re-fetches → modal no longer renders
6. If user clicks **Skip for now** → modal closes via local state only, `onboarding_completed` stays `false`
7. Next login → modal appears again

---

## Modal UI

### Layout
Full-screen overlay with a dark semi-transparent backdrop (`bg-black/40`). The app content is visible but dimmed behind it. Cannot be dismissed by clicking the backdrop — only by Save or Skip.

### Avatar Preview
Large circle (64px) at the top of the modal showing the user's initials in white on the selected color background. Updates live as the user types their display name and selects a color.

Initials logic: first letter of each word in display name, max 2 letters. If empty, shows `?`.

### Fields

**Display name** — text input, placeholder "How should we call you?", required for Save to be enabled.

**Avatar color** — 8 color swatches in a row, single select. Selected swatch shows a checkmark icon. Colors:

| Name | Hex |
|------|-----|
| Brand blue | `#417c9c` |
| Deep burgundy | `#8b1a33` |
| Warm brown | `#716458` |
| Soft green | `#4a7c59` |
| Muted purple | `#6b5b8a` |
| Coral | `#c4614a` |
| Slate | `#4a5568` |
| Sand | `#b8956a` |

Default selected: Brand blue.

**Experience level** — 3 pill buttons (single select): Beginner / Intermediate / Advanced. Default: none selected (optional field).

### Actions

- **Save** — disabled until `display_name` is non-empty. On click: updates profile, calls `router.refresh()`.
- **Skip for now** — closes modal via local `useState(false)` on the Client Component. Does not update `onboarding_completed`.

---

## Sidebar Update

`AppSidebar.tsx` currently has hardcoded "Maria Pastin" and "ivo.pastin@gmail.com". After this feature:

- Display name shown as the primary label (falls back to email if not set)
- Avatar circle uses `avatar_color` from profile (falls back to brand blue)
- Initials derived from `display_name` (falls back to first 2 chars of email)

The profile data is fetched once in `layout.tsx` (server-side) and passed as props to `AppSidebar`.
