---
name: impersonate-user
description: Use when you need to test the mytoys-crate app's UI/UX as a logged-in Supabase user with Playwright — log in / impersonate a specific user without their password (defaults to ivo.pastin@gmail.com), then drive the browser as them.
---

# Impersonate Supabase User (Playwright)

## Overview

Lets Playwright browse the mytoys-crate app **as an authenticated Supabase user** without
knowing any password. It mints a real session server-side using the service-role key, then
injects the resulting `@supabase/ssr` auth cookies into the browser context.

**Default user:** `ivo.pastin@gmail.com` (use it whenever the user doesn't name someone).

This is for **local UI/UX testing only**. It depends on `SUPABASE_SERVICE_ROLE_KEY` in
`.env.local` — a server-only secret that must never get a `NEXT_PUBLIC_` prefix.

## When to Use

- "Test the app as a logged-in user", "log Playwright in", "impersonate <email>"
- Checking authenticated pages (`/app`, `/app/studio`, settings, my-patterns, …)
- Reviewing UX flows that require a real session

**Not for:** production, automated CI against remote envs, or anything user-facing.

## Procedure (fast path — 2 calls)

1. **Pick the user.** Use the email the user named; otherwise `ivo.pastin@gmail.com`.
   Ensure the dev server is up (`curl -so /dev/null -w '%{http_code}' http://localhost:3000/login`
   → expect 200; else `npm run dev` from `mytoys-crate`).

2. **Mint + emit an injector** in one command (run from the `mytoys-crate` dir). The
   `--out` path MUST live inside the Playwright MCP allowed root (the session cwd / its
   `.playwright-mcp` dir) — `/tmp` is rejected. Use an absolute path under that root:
   ```bash
   node .claude/skills/impersonate-user/scripts/mint-session.mjs ivo.pastin@gmail.com \
     --out "$(cd .. && pwd)/.playwright-mcp/impersonate-inject.mjs"
   ```
   Prints `{ "ok": true, "email", "userId", "injector": "…/impersonate-inject.mjs", … }`.
   On failure: `{ "ok": false, "error": "…" }`, exit 1 — read the error.

3. **Run the injector** with `mcp__plugin_playwright_playwright__browser_run_code_unsafe`,
   passing the printed path as **`filename`** (NOT `code`). It adds the cookies, navigates to
   `/app`, and returns `{ url, email }`.

4. **Delete the injector file afterward** — it contains a live session token.

Why this is fast: the cookies (~4.6 KB, chunked) never round-trip through your context, and the
Playwright VM has no `require`/dynamic `import` — so feeding it a prewritten function file is the
only clean way to hand it the cookie data. Avoid the old pattern of reading the JSON back and
pasting a giant literal into `code`.

## Check (always do this at the end)

Verify the impersonation actually worked — do not claim success without it:

1. After navigating to `/app`, take a `browser_snapshot`.
2. Confirm the URL is still `/app*` and you were **not** redirected to `/login`.
3. Confirm authenticated chrome is present (the app sidebar / user area renders).

If you landed on `/login`, the session didn't take — re-run step 3 (tokens are single-use),
check that cookies were added for `domain: localhost`, and confirm `SUPABASE_SERVICE_ROLE_KEY`
is valid.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Running the script from the wrong dir | Run from `mytoys-crate/` so `.env.local` and `node_modules` resolve. |
| Service-role key missing/`NEXT_PUBLIC_`-prefixed | Add `SUPABASE_SERVICE_ROLE_KEY=…` (no prefix) to `.env.local`. |
| Reusing old cookies | Magic-link tokens are single-use; mint fresh cookies each session. |
| Cookie domain mismatch | Add cookies for `domain: "localhost"`, `path: "/"`. |
| User doesn't exist | `generateLink` fails — create the user in Supabase first. |
