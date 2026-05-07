# Login / Register Page Design

**Date:** 2026-05-07  
**Status:** Approved

---

## Overview

A `/login` route added to the existing Next.js app. It renders inside the existing AppShell (white frame + Navbar). The page is split into two equal columns, full viewport height minus the AppShell frame (`h-[calc(100vh-20px)]`).

---

## Routing

- New route: `app/login/page.tsx` — server component
- Login button in `Navbar.tsx` links to `/login`
- No `/register` route — login and register modes are toggled within the same page via client-side state

---

## File Structure

```
app/
  login/
    page.tsx          ← server component, two-column layout shell
    LoginForm.tsx     ← "use client", handles form state and toggle
```

---

## Left Panel

- Fills its grid column with a small inset (`m-2`) and `rounded-[16px]` corners
- Background base: `bg-[#417c9c]` (app primary blue)
- Grainient component — solid `#417c9c` (matching AboutSection usage)
- Texture overlay: `waves.jpg` at `opacity-20`, `mix-blend-screen`
- **Logo:** `logo-alb-deschis.png` (light version), top-left, `width=64 height=64` — same size as Navbar logo
- **Bottom text block** (bottom-left, `absolute`, padded):
  - Headline: *"Every stitch starts with a dream."* — `font-cozy` (Pacifico), `text-[32px]`, `text-white`
  - Subline: *"Join a little world where your plush toy ideas come to life — one crochet row at a time."* — `text-[16px]`, `text-white/70`, `font-medium`

---

## Right Panel

- White background (`bg-white`)
- Centered content column: `max-w-[380px]`, `mx-auto`, vertically centered
- Position `relative` to anchor the animal decorations

### Animal Decorations (absolute positioned, non-interactive, `pointer-events-none`)

All use low opacity (`opacity-10` or `opacity-15`) and slight rotations, matching the Footer treatment.

| Animal | File | Position | Size | Rotation |
|--------|------|----------|------|----------|
| Bear | `bear.png` | top-right | 160px | `8deg` |
| Bunny | `bunny.png` | bottom-left | 140px | `-10deg` |
| Cat | `cat.png` | top-left | 120px | `-8deg` |
| Koala | `koala.png` | bottom-right | 150px | `12deg` |

### LoginForm Component (`app/login/LoginForm.tsx`)

**State:** `mode: 'login' | 'register'` — toggled by the bottom link.

**Heading:**
- Login mode: *"Welcome back"*
- Register mode: *"Create an account"*
- Style: `text-[32px] font-bold text-[#1a1a1a]`

**Subheading:**
- Login: *"Good to see you again."*
- Register: *"Let's get you started."*
- Style: `text-[15px] text-[#716458] font-medium`

**Fields:**
- Login: Email, Password
- Register: Email, Password, Confirm Password
- Input style: `w-full border border-[#e0d9d5] rounded-[12px] px-4 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#417c9c]`
- Label style: `text-[13px] font-semibold text-[#716458] mb-1`

**Primary CTA Button:**
- Login: *"Log in"* / Register: *"Sign up"*
- Style: `w-full bg-[#591427] text-[#fff1b5] rounded-[12px] py-3 text-[15px] font-bold` — matches PricingSection featured button
- Hover: `hover:bg-[#7a1c35]`, spring scale: `transition-transform ease-[cubic-bezier(0.34,1.56,0.64,1)]`

**Divider:** `or` text between primary CTA and Google button

**Google Button (visual only):**
- `w-full border border-[#e0d9d5] rounded-[12px] py-3 bg-white text-[#1a1a1a] text-[15px] font-medium`
- Google "G" icon from `@mui/icons-material/Google` (already in deps)
- Label: *"Continue with Google"*

**Toggle Link:**
- Login mode: *"Don't have an account?* **Sign up**"
- Register mode: *"Already have an account?* **Log in**"
- Style: `text-[14px] text-[#1a1a1a]/60`, bold part: `text-[#417c9c] font-semibold cursor-pointer`
- Clicking the bold part sets `mode` to the other value

---

## Colors & Tokens Used

| Token | Value | Source |
|-------|-------|--------|
| Primary blue | `#417c9c` | `--background-primary` |
| Warm brown | `#716458` | Used throughout |
| Deep burgundy | `#591427` | Pricing featured button |
| Cream yellow | `#fff1b5` | CTA text accent |
| Border neutral | `#e0d9d5` | Pricing white panel |

---

## Assets Used

- `public/images/logos/logo-alb-deschis.png` — light logo for blue panel
- `public/images/textures/waves.jpg` — texture overlay on left panel
- `public/images/bear.png`, `bunny.png`, `cat.png`, `koala.png` — decorative animals on right panel

---

## Out of Scope

- Real Google OAuth / NextAuth integration — button is visual only
- Password visibility toggle
- Form validation beyond HTML required attributes
- Forgot password flow
