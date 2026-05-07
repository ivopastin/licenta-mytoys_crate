# Login / Register Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/login` route with a two-column layout — a branded blue left panel and a white right panel with a login/register form — wired to the existing Navbar Login button.

**Architecture:** Server component `app/login/page.tsx` renders the two-column shell; client component `app/login/LoginForm.tsx` owns all form state (mode toggle, fields). The left panel reuses `Grainient` and the `waves.jpg` texture already used in `AboutSection`/`Footer`. Animal images are scattered decoratively on the right panel matching the `Footer` pattern.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, `motion/react`, `@mui/icons-material` (Google icon), `next/image`, `next/link`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `app/login/page.tsx` | Server component — two-column layout shell |
| Create | `app/login/LoginForm.tsx` | Client component — form state, fields, toggle, Google button |
| Modify | `app/components/Navbar.tsx` | Wire Login button to `/login` via `next/link` |

---

### Task 1: Wire the Navbar Login button to `/login`

**Files:**
- Modify: `app/components/Navbar.tsx`

- [ ] **Step 1: Open `app/components/Navbar.tsx` and add the `Link` import**

At the top of the file, add:
```tsx
import Link from "next/link";
```

- [ ] **Step 2: Replace the Login `<Button>` with a `<Link>` wrapping it**

Find (around line 139):
```tsx
<Button className="px-6 py-2.5 h-auto bg-transparent border border-font-primary bg-white/30 backdrop-blur-sm text-white text-[18px] font-bold rounded-[16px] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
  Login
</Button>
```

Replace with:
```tsx
<Link href="/login">
  <Button className="px-6 py-2.5 h-auto bg-transparent border border-font-primary bg-white/30 backdrop-blur-sm text-white text-[18px] font-bold rounded-[16px] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-110 active:scale-95">
    Login
  </Button>
</Link>
```

- [ ] **Step 3: Verify the dev server shows no type errors**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate && bun run dev
```

Open `http://localhost:3000` in the browser and click Login — it should navigate to `/login` (404 expected until Task 2 is done). Stop the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/components/Navbar.tsx
git commit -m "feat: link navbar login button to /login route"
```

---

### Task 2: Create the `LoginForm` client component

**Files:**
- Create: `app/login/LoginForm.tsx`

- [ ] **Step 1: Create `app/login/LoginForm.tsx`**

```tsx
"use client";

import { useState } from "react";
import GoogleIcon from "@mui/icons-material/Google";

type Mode = "login" | "register";

export default function LoginForm() {
  const [mode, setMode] = useState<Mode>("login");

  const isLogin = mode === "login";

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Heading */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[32px] font-bold text-[#1a1a1a] leading-tight">
          {isLogin ? "Welcome back" : "Create an account"}
        </h1>
        <p className="text-[15px] text-[#716458] font-medium">
          {isLogin ? "Good to see you again." : "Let's get you started."}
        </p>
      </div>

      {/* Fields */}
      <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        {/* Email */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-[#716458]">
            Email
          </label>
          <input
            type="email"
            required
            placeholder="you@example.com"
            className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1">
          <label className="text-[13px] font-semibold text-[#716458]">
            Password
          </label>
          <input
            type="password"
            required
            placeholder="••••••••"
            className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
          />
        </div>

        {/* Confirm Password — register only */}
        {!isLogin && (
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-semibold text-[#716458]">
              Confirm Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c] transition-colors"
            />
          </div>
        )}

        {/* Primary CTA */}
        <button
          type="submit"
          className="w-full bg-[#591427] text-[#fff1b5] rounded-[12px] py-3 text-[15px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer"
        >
          {isLogin ? "Log in" : "Sign up"}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#e0d9d5]" />
        <span className="text-[13px] text-[#716458] font-medium">or</span>
        <div className="flex-1 h-px bg-[#e0d9d5]" />
      </div>

      {/* Google button — visual only */}
      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-[#e0d9d5] rounded-[12px] py-3 bg-white text-[#1a1a1a] text-[15px] font-medium hover:bg-[#f5f5f5] transition-colors cursor-pointer"
      >
        <GoogleIcon style={{ fontSize: 20 }} />
        Continue with Google
      </button>

      {/* Toggle link */}
      <p className="text-center text-[14px] text-[#1a1a1a]/60">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <button
          type="button"
          onClick={() => setMode(isLogin ? "register" : "login")}
          className="text-[#417c9c] font-semibold cursor-pointer hover:underline"
        >
          {isLogin ? "Sign up" : "Log in"}
        </button>
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/login/LoginForm.tsx
git commit -m "feat: add LoginForm client component with login/register toggle"
```

---

### Task 3: Create the login page layout shell

**Files:**
- Create: `app/login/page.tsx`

- [ ] **Step 1: Create `app/login/page.tsx`**

```tsx
import Image from "next/image";
import Grainient from "@/components/Grainient";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="h-[calc(100vh-20px)] grid grid-cols-2">
      {/* ── Left panel: blue branded area ── */}
      <div className="relative m-2 rounded-[16px] overflow-hidden bg-[#417c9c]">
        {/* Grainient background */}
        <div className="absolute inset-0">
          <Grainient
            color1="#417c9c"
            color2="#417c9c"
            color3="#417c9c"
            grainAmount={0.1}
            grainScale={2}
            grainAnimated={false}
            contrast={1}
            gamma={1}
            saturation={1}
            warpStrength={0.001}
            timeSpeed={0}
            zoom={1}
          />
        </div>

        {/* Waves texture overlay */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/images/textures/waves.jpg"
            alt=""
            fill
            className="object-cover opacity-20 mix-blend-screen"
          />
        </div>

        {/* Logo — top left */}
        <div className="absolute top-6 left-6 z-10">
          <Image
            src="/images/logos/logo-alb-deschis.png"
            alt="MyToys Crate"
            width={64}
            height={64}
            className="object-contain"
          />
        </div>

        {/* Bottom text block */}
        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-3">
          <p className="font-cozy text-[32px] text-white leading-tight">
            Every stitch starts with a dream.
          </p>
          <p className="text-[16px] text-white/70 font-medium leading-relaxed">
            Join a little world where your plush toy ideas come to life — one
            crochet row at a time.
          </p>
        </div>
      </div>

      {/* ── Right panel: white form area ── */}
      <div className="relative bg-white flex items-center justify-center overflow-hidden">
        {/* Animal decorations */}
        <div
          className="absolute top-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(8deg)" }}
        >
          <Image src="/images/bear.png" alt="" width={160} height={160} />
        </div>
        <div
          className="absolute bottom-[-20px] left-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(-10deg)" }}
        >
          <Image src="/images/bunny.png" alt="" width={140} height={140} />
        </div>
        <div
          className="absolute top-[-10px] left-[-10px] pointer-events-none opacity-15"
          style={{ transform: "rotate(-8deg)" }}
        >
          <Image src="/images/cat.png" alt="" width={120} height={120} />
        </div>
        <div
          className="absolute bottom-[-20px] right-[-20px] pointer-events-none opacity-10"
          style={{ transform: "rotate(12deg)" }}
        >
          <Image src="/images/koala.png" alt="" width={150} height={150} />
        </div>

        {/* Form */}
        <div className="relative z-10 w-full max-w-[380px] px-4">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Start the dev server and verify the page renders correctly**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate && bun run dev
```

Open `http://localhost:3000/login` and check:
- Two equal columns filling the viewport
- Left panel: blue/teal with waves texture, logo top-left, warm text bottom-left
- Right panel: white background, animals peeking at corners (faint), form centered
- Form shows Email + Password fields with "Log in" CTA and Google button
- Clicking "Sign up" link switches to register mode — adds Confirm Password field and changes heading/CTA text
- Clicking "Log in" link switches back

Stop the dev server.

- [ ] **Step 3: Commit**

```bash
git add app/login/page.tsx
git commit -m "feat: add /login page with two-column layout and branded left panel"
```
