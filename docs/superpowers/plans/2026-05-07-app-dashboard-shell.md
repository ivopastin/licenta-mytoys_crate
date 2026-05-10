# App Dashboard Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the authenticated app shell at `/app` — a white-framed layout with a collapsible shadcn Sidebar on the left and a rounded, textured content area on the right, with Home, Studio, and My Patterns pages.

**Architecture:** A new route group `app/(app)/` gets its own layout wrapping the shadcn `SidebarProvider` + `AppSidebar` + content area. Each page (home, studio, my-patterns) is a server component that renders inside the content area. The sidebar is a client component that owns collapse state via shadcn's built-in `useSidebar` hook. The outer frame (white strips + rounded container) mirrors the login layout.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS v4, shadcn Sidebar component (lucide icons), `next/image`, `next/link`.

---

## File Map

| Action | Path | Responsibility |
|--------|------|----------------|
| Install | `components/ui/sidebar.tsx` | shadcn Sidebar primitives |
| Create | `app/(app)/layout.tsx` | White frame + SidebarProvider + AppSidebar + content slot |
| Create | `app/(app)/AppSidebar.tsx` | Client component — nav items, collapse toggle, user account area |
| Create | `app/(app)/page.tsx` | Home/welcome page (default route `/app`) |
| Create | `app/(app)/studio/page.tsx` | Studio placeholder page |
| Create | `app/(app)/my-patterns/page.tsx` | My Patterns placeholder page |

---

### Task 1: Install shadcn Sidebar component

**Files:**
- Install: `components/ui/sidebar.tsx` (and peer deps: `components/ui/sheet.tsx`, `components/ui/separator.tsx`, `components/ui/skeleton.tsx`, `components/ui/input.tsx`, `hooks/use-mobile.ts`)

- [ ] **Step 1: Install the sidebar component via shadcn CLI**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate && echo "n" | npx shadcn@latest add sidebar --overwrite 2>&1
```

Expected: shadcn installs `components/ui/sidebar.tsx` and any peer components it needs. You may see prompts about overwriting — answer `n` to keep existing files like `button.tsx`.

- [ ] **Step 2: Verify the files exist**

```bash
ls components/ui/ && ls hooks/ 2>/dev/null || echo "hooks dir missing"
```

Expected: `sidebar.tsx` appears in `components/ui/`. A `hooks/use-mobile.ts` may also be created.

- [ ] **Step 3: Commit**

```bash
git add components/ hooks/ && git commit -m "feat: install shadcn sidebar component"
```

---

### Task 2: Create the AppSidebar client component

**Files:**
- Create: `app/(app)/AppSidebar.tsx`

- [ ] **Step 1: Create `app/(app)/AppSidebar.tsx`**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Home, Wand2, BookMarked, Settings, LogOut } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
];

export default function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader className="px-4 py-5">
        <Link href="/app" className="flex items-center gap-3">
          <Image
            src="/images/logos/logo-black.png"
            alt="MyToys Crate"
            width={36}
            height={36}
            className="object-contain shrink-0"
          />
          <span className="font-bold text-[16px] text-[#1a1a1a] group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={label}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`rounded-[12px] font-semibold text-[14px] ${
                        isActive
                          ? "bg-[#417c9c] text-white hover:bg-[#417c9c] hover:text-white"
                          : "text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
                      }`}
                    >
                      <Link href={href}>
                        <Icon size={18} />
                        <span>{label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account + actions */}
      <SidebarFooter className="px-3 py-4 border-t border-[#e0d9d5]">
        {/* User card */}
        <div className="flex items-center gap-3 px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="w-8 h-8 rounded-full bg-[#417c9c] flex items-center justify-center shrink-0">
            <span className="text-white text-[12px] font-bold">MP</span>
          </div>
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
              Maria Pastin
            </span>
            <span className="text-[11px] text-[#716458] truncate">
              ivo.pastin@gmail.com
            </span>
          </div>
        </div>

        {/* Settings + logout */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="rounded-[12px] text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
            >
              <Link href="/app/settings">
                <Settings size={16} />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="rounded-[12px] text-[13px] font-medium text-[#716458] hover:bg-red-50 hover:text-red-500 cursor-pointer">
              <LogOut size={16} />
              <span>Log out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Collapse toggle */}
        <SidebarTrigger className="mt-2 w-full justify-center text-[#716458] hover:text-[#417c9c]" />
      </SidebarFooter>
    </Sidebar>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/AppSidebar.tsx && git commit -m "feat: add AppSidebar client component"
```

---

### Task 3: Create the dashboard layout

**Files:**
- Create: `app/(app)/layout.tsx`

- [ ] **Step 1: Create `app/(app)/layout.tsx`**

```tsx
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* White frame strips */}
      <div className="fixed top-0 left-0 right-0 h-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed bottom-0 left-0 right-0 h-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed top-0 left-0 bottom-0 w-2.5 bg-white z-[100] pointer-events-none" />
      <div className="fixed top-0 right-0 bottom-0 w-2.5 bg-white z-[100] pointer-events-none" />

      {/* Main container */}
      <div className="fixed inset-2.5 rounded-[16px] overflow-hidden bg-white flex">
        <SidebarProvider>
          <AppSidebar />

          {/* Content area */}
          <main className="flex-1 overflow-hidden p-2">
            <div className="relative h-full rounded-[16px] overflow-hidden">
              {children}
            </div>
          </main>
        </SidebarProvider>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/layout.tsx && git commit -m "feat: add app dashboard layout with sidebar and content area"
```

---

### Task 4: Create the Home page

**Files:**
- Create: `app/(app)/page.tsx`

- [ ] **Step 1: Create `app/(app)/page.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";

export default function AppHomePage() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-white flex flex-col items-center justify-center">
      {/* smooth-flow texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/smooth-flow.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-5 text-center max-w-[480px] px-8">
        <div className="w-16 h-16 rounded-[16px] bg-[#417c9c]/10 flex items-center justify-center">
          <Image
            src="/images/logos/logo-black.png"
            alt=""
            width={36}
            height={36}
            className="object-contain opacity-60"
          />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-[32px] font-bold text-[#1a1a1a] leading-tight">
            Welcome back!
          </h1>
          <p className="text-[16px] text-[#716458] font-medium leading-relaxed">
            Ready to bring a new plushie to life? Head to the Studio whenever
            you're ready.
          </p>
        </div>
        <Link
          href="/app/studio"
          className="px-7 py-3 rounded-[14px] bg-[#591427] text-[#fff1b5] text-[15px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#7a1c35] hover:scale-105 active:scale-95"
        >
          Go to Studio
        </Link>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/page.tsx && git commit -m "feat: add app home/welcome page"
```

---

### Task 5: Create the Studio placeholder page

**Files:**
- Create: `app/(app)/studio/page.tsx`

- [ ] **Step 1: Create `app/(app)/studio/page.tsx`**

```tsx
import Image from "next/image";

export default function StudioPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* black-sand texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/black-sand.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.05]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 text-center max-w-[480px] px-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-[40px] font-bold text-[#1a1a1a] leading-tight">
            Let's start creating.
          </h1>
          <p className="text-[16px] text-[#716458] font-medium leading-relaxed">
            Design your custom plushie step by step — pick your animal, size,
            colors, and accessories. Your pattern will be ready in minutes.
          </p>
        </div>
        <button className="px-8 py-3.5 rounded-[14px] bg-[#417c9c] text-white text-[16px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-[#35657f] hover:scale-105 active:scale-95 cursor-pointer">
          Start designing
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/studio/ && git commit -m "feat: add studio placeholder page"
```

---

### Task 6: Create the My Patterns placeholder page

**Files:**
- Create: `app/(app)/my-patterns/page.tsx`

- [ ] **Step 1: Create `app/(app)/my-patterns/page.tsx`**

```tsx
import Image from "next/image";

export default function MyPatternsPage() {
  return (
    <div className="relative h-full w-full overflow-hidden flex flex-col items-center justify-center">
      {/* wall texture */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.06]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-3 text-center max-w-[400px] px-8">
        <div className="w-14 h-14 rounded-full bg-[#e0d9d5] flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
              stroke="#716458"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 2v6h6M9 13h6M9 17h4"
              stroke="#716458"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="text-[26px] font-bold text-[#1a1a1a]">
          No patterns yet
        </h1>
        <p className="text-[15px] text-[#716458] font-medium leading-relaxed">
          Your downloaded patterns will appear here. Head to the Studio to
          design your first plushie.
        </p>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/my-patterns/ && git commit -m "feat: add my patterns placeholder page"
```

---

### Task 7: Verify full shell in the browser

- [ ] **Step 1: Start dev server**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate && bun run dev
```

- [ ] **Step 2: Open `http://localhost:3000/app` and verify**

Check:
- White frame + rounded container visible
- Sidebar shows logo, Home/Studio/My Patterns nav items, user card, settings/logout, collapse trigger at the bottom
- Home page shows welcome text + "Go to Studio" button over smooth-flow texture
- Clicking "Studio" in sidebar navigates to `/app/studio` — sidebar item becomes active (blue pill), content area shows studio page over black-sand texture
- Clicking "My Patterns" navigates to `/app/my-patterns` — wall texture, empty state
- Collapsing sidebar via the trigger shrinks it to icon-only mode; expanding restores it
- Going to `/app/anything-unknown` hits the 404 page correctly

- [ ] **Step 3: Stop dev server**

```bash
# Ctrl+C or kill $(lsof -ti:3000)
```
