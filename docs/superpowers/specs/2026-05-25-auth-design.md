# Auth Design — MyToys Crate

**Date:** 2026-05-25  
**Scope:** Login, register, Google OAuth, email confirmation, route protection

---

## Overview

Integrate Supabase Auth into the existing Next.js App Router project using `@supabase/ssr` for cookie-based session management. Protect the `/app/*` routes via Next.js middleware. Support email+password and Google OAuth from the start, with email confirmation required before accessing the app.

---

## Packages

- `@supabase/supabase-js` — core Supabase JS client
- `@supabase/ssr` — cookie helpers for Next.js App Router (server + middleware compatible)

---

## Environment Variables

Add to `.env.local` (never commit this file):

```
NEXT_PUBLIC_SUPABASE_URL=https://ictwfljipidlqxoryafm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## New Files

| File | Purpose |
|------|---------|
| `lib/supabase/client.ts` | Browser Supabase client (Client Components) |
| `lib/supabase/server.ts` | Server Supabase client (Server Components, API routes) |
| `middleware.ts` | Session refresh + route protection |
| `app/auth/callback/route.ts` | Exchange auth code for session after email confirm / Google OAuth |

---

## Architecture

Two Supabase client helpers are needed because Next.js has two environments:

- **Browser client** (`lib/supabase/client.ts`) — created with `createBrowserClient`, used inside `"use client"` components. Reads/writes cookies via the browser.
- **Server client** (`lib/supabase/server.ts`) — created with `createServerClient`, reads cookies from the incoming request. Used in Server Components and the middleware.

The **middleware** (`middleware.ts`) runs on every request. It:
1. Refreshes the session cookie if it's about to expire
2. Redirects unauthenticated requests to `/app/*` → `/login`
3. Redirects authenticated requests to `/login` → `/app`

The **auth callback route** (`app/auth/callback/route.ts`) handles the redirect URI from Supabase after:
- Email confirmation link click
- Google OAuth approval

It calls `exchangeCodeForSession(code)`, which sets the session cookie, then redirects to `/app`.

---

## Authentication Flows

### Register (email + password)
1. User fills email + password on `/login` in register mode
2. Form calls `supabase.auth.signUp({ email, password })`
3. Supabase sends a confirmation email with a link to `/auth/callback?code=...`
4. Form replaces itself with a "Check your email" confirmation message
5. User clicks the email link → `/auth/callback` exchanges code → session set → redirect to `/app`

### Login (email + password)
1. User fills email + password on `/login` in login mode
2. Form calls `supabase.auth.signInWithPassword({ email, password })`
3. On success → `router.push('/app')`
4. On error → inline error message shown below the form ("Invalid email or password")

### Google OAuth
1. User clicks "Continue with Google"
2. Calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '<origin>/auth/callback' } })`
3. Supabase redirects to Google → user approves → back to `/auth/callback` → session set → `/app`
4. Requires Google OAuth credentials configured in Supabase Dashboard → Authentication → Providers → Google

### Sign Out
1. Called from sidebar (to be wired up later)
2. Calls `supabase.auth.signOut()` → redirect to `/login`

### Forgot Password
Out of scope for this iteration. Button remains as a no-op.

---

## Route Protection

| Route | Unauthenticated | Authenticated |
|-------|----------------|---------------|
| `/login` | Allow | Redirect to `/app` |
| `/app/*` | Redirect to `/login` | Allow |
| `/` (landing) | Allow | Allow |
| `/auth/callback` | Allow | Allow |

Protection is enforced in `middleware.ts`, not in individual page components. The middleware runs server-side before the page renders — no flash of protected content.

---

## UI Changes to LoginForm.tsx

The existing layout and styling are unchanged. Functional additions:

- `loading` state — disables button and shows spinner text during async calls
- `error` state — shows inline error message below the form
- `emailSent` state — when true, replaces the entire form with a "Check your email" success message
- Submit handler wired to `signUp` or `signInWithPassword` depending on mode
- Google button wired to `signInWithOAuth`
- `router.push('/app')` on successful login

---

## Supabase Dashboard Config Required

Before implementation:
1. Authentication → URL Configuration → set Site URL to `http://localhost:3000`
2. Authentication → URL Configuration → add redirect URL: `http://localhost:3000/auth/callback`
3. Authentication → Providers → Google → enable and add Client ID + Secret from Google Cloud Console
4. Email confirmation is enabled by default — no change needed
