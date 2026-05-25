# Settings Page Design — MyToys Crate

**Date:** 2026-05-25
**Scope:** Settings page at `/app/settings` with Profile, Account, and Billing tabs

---

## Overview

A settings page inside the app shell at `/app/settings`. Three tabs — Profile, Account, Billing — navigated via `?tab=` URL query param. The page is a Server Component that fetches the user's profile and renders the active tab. No new database tables needed — Profile writes to the existing `profiles` table, Account writes to Supabase Auth.

---

## Architecture

**Route:** `app/(app)/app/settings/page.tsx`

Async Server Component. Reads `searchParams.tab` (defaults to `"profile"`), fetches the user's profile from Supabase, and passes it as props to the active section component.

### New Files

| File | Purpose |
|------|---------|
| `app/(app)/app/settings/page.tsx` | Server Component — reads tab param, fetches profile, renders layout |
| `app/(app)/app/settings/TabNav.tsx` | Client Component — left vertical tab navigation |
| `app/(app)/app/settings/ProfileSection.tsx` | Client Component — edit name, avatar color, experience level |
| `app/(app)/app/settings/AccountSection.tsx` | Client Component — change email and password |
| `app/(app)/app/settings/BillingSection.tsx` | Client Component — design-only card and plan UI |

### Data Flow

1. User navigates to `/app/settings` (or `?tab=account`, `?tab=billing`)
2. Server fetches profile via `supabase.from('profiles').select(...).eq('id', user.id).single()`
3. Active section rendered with profile as props
4. **Profile saves:** `supabase.from('profiles').update(...)` + `router.refresh()`
5. **Email change:** `supabase.auth.updateUser({ email: newEmail })` — Supabase sends confirmation to new email before applying change
6. **Password change:** `supabase.auth.updateUser({ password: newPassword })`
7. Tab switching: `<Link href="/app/settings?tab=X">` — server re-render, no client state

---

## Page Layout

The settings page renders inside the existing dark rounded container (same as all app pages). Content area is a two-column layout:

- **Left column (~200px fixed):** `TabNav` — vertical list of Profile / Account / Billing links. Active tab highlighted with brand color (same style as app sidebar nav items). Positioned at the top, not full-height.
- **Right column (flex-1, scrollable):** Active section content in a white/semi-transparent rounded card.

**Header:** "Settings" title in white, same style as other app page headers.

**Default tab:** `"profile"` when no `?tab=` param is present.

---

## Tab Content

### Profile Tab

Fields (pre-filled from profile):
- **Display name** — text input
- **Avatar color** — 8 color swatches (same as onboarding modal), live avatar preview circle updates as user types name and picks color
- **Experience level** — 3 pill buttons: Beginner / Intermediate / Advanced, pre-selected from profile

Avatar colors:
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

**Save button:** Calls `supabase.from('profiles').update({ display_name, avatar_color, experience_level })` then `router.refresh()`. Shows inline "Profile updated!" success message for 3 seconds.

### Account Tab

Two visually separated sections:

**Change Email:**
- Single input for new email address
- Save button calls `supabase.auth.updateUser({ email: newEmail })`
- On success: shows "A confirmation link has been sent to your new email. Click it to apply the change."
- On error: shows inline error message

**Change Password:**
- New password input with eye toggle
- Confirm password input with eye toggle
- Same strength indicator as login form (weak/medium/strong bar)
- Save button calls `supabase.auth.updateUser({ password: newPassword })`
- Validates passwords match before submitting
- On success: shows "Password updated!" for 3 seconds
- On error: shows inline error message

### Billing Tab (Design Only)

**Current Plan section:**
- Label: "Free Plan"
- Description: "Access to all core features."
- "Upgrade" button — disabled, with a "Coming soon" badge next to it

**Payment Method section:**
- A styled credit card visual:
  - Card number: `•••• •••• •••• 4242`
  - Cardholder: user's `display_name` (or "Card Holder" if not set)
  - Expiry: `12/27`
  - Network logo: "VISA" text styled in italic white
  - Card background: gradient using brand/deep colors
- "Add new card" button — disabled, with a "Coming soon" badge

Both "Coming soon" badges are small pill labels in muted amber/yellow, clearly indicating non-functional state.

---

## Supabase Dashboard Config

Add to **Authentication → URL Configuration → Redirect URLs**:
- `http://localhost:3000/app/settings` (for email change confirmation redirect)
