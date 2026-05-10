# App Dashboard Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add four UI enhancements to the `/app` dashboard: a floating help button, news card expand-on-click dialog, sidebar tutorial/pattern preview items, and a notifications popover in the user dropdown.

**Architecture:** Each feature is extracted into its own focused component in `app/(app)/app/components/`. `AppSidebar.tsx` is modified to add sidebar preview items inline and wire up the notifications popover. `page.tsx` uses the new `NewsCard` component. `layout.tsx` renders `HelpButton`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, lucide-react, `ReactDOM.createPortal` for the news dialog.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Create | `app/(app)/app/components/HelpButton.tsx` | Floating ? button + popover |
| Create | `app/(app)/app/components/NewsCard.tsx` | News card with click-to-expand dialog |
| Create | `app/(app)/app/components/NotificationsPanel.tsx` | Notifications popover UI |
| Modify | `app/(app)/app/layout.tsx` | Render `HelpButton` |
| Modify | `app/(app)/app/page.tsx` | Use `NewsCard` component |
| Modify | `app/(app)/app/AppSidebar.tsx` | Sidebar previews + notifications wiring |

---

## Task 1: HelpButton component

**Files:**
- Create: `app/(app)/app/components/HelpButton.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { HelpCircle, BookOpen, Mail, Keyboard, Sparkles } from "lucide-react";

const HELP_ITEMS = [
  { label: "Documentation", icon: BookOpen, href: "#" },
  { label: "Contact Support", icon: Mail, href: "#" },
  { label: "Keyboard Shortcuts", icon: Keyboard, href: "#" },
  { label: "What's New", icon: Sparkles, href: "#" },
];

export default function HelpButton() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="absolute bottom-5 right-5 z-30 flex flex-col items-end gap-2">
      {open && (
        <div className="bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg py-1 w-48 mb-1">
          {HELP_ITEMS.map(({ label, icon: Icon, href }) => (
            <a
              key={label}
              href={href}
              className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c] transition-colors"
              onClick={() => setOpen(false)}
            >
              <Icon size={15} />
              <span>{label}</span>
            </a>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 border border-white/20 backdrop-blur-sm text-white flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Help and support"
      >
        <HelpCircle size={18} />
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/app/components/HelpButton.tsx
git commit -m "feat: add HelpButton component with popover"
```

---

## Task 2: Wire HelpButton into layout

**Files:**
- Modify: `app/(app)/app/layout.tsx`

- [ ] **Step 1: Add HelpButton to layout**

Replace the entire file content with:

```tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import HelpButton from "./components/HelpButton";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AppSidebar />

        {/* Content area — only this side has margin + rounded corners */}
        <main className="flex-1 overflow-hidden p-2">
          <div className="relative h-full rounded-[16px] overflow-hidden bg-[#2a3f4f]">
            <div className="absolute top-4.5 left-3 z-20">
              <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/15 rounded-[8px]" />
            </div>
            {children}
            <HelpButton />
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
```

- [ ] **Step 2: Verify the button appears**

Run `npm run dev` and open `http://localhost:3000/app`. Confirm the `?` button appears at the bottom-right of the content area. Click it — four menu items should appear above it. Click outside — popover should close.

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/app/layout.tsx
git commit -m "feat: render HelpButton in app layout"
```

---

## Task 3: NewsCard component with expand dialog

**Files:**
- Create: `app/(app)/app/components/NewsCard.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  image: string;
  date: string;
  tag: string;
}

const TAG_COLORS: Record<string, string> = {
  "New Pattern": "bg-white/20 text-white",
  Update: "bg-white/20 text-white",
  "Limited Edition": "bg-white/20 text-white",
};

export default function NewsCard({ item }: { item: NewsItem }) {
  const [open, setOpen] = useState(false);

  const formattedDate = new Date(item.date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <>
      {/* Grid card */}
      <div
        onClick={() => setOpen(true)}
        className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 overflow-hidden flex flex-col cursor-pointer hover:scale-[1.02] hover:bg-white/15 transition-all duration-200"
      >
        <div className="relative w-full aspect-4/3 bg-white/10">
          <Image src={item.image} alt={item.title} fill className="object-cover" />
        </div>
        <div className="p-4 flex flex-col gap-2 flex-1">
          <span
            className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-white/20 text-white"}`}
          >
            {item.tag}
          </span>
          <p className="text-[14px] font-semibold text-white leading-snug">{item.title}</p>
          <p className="text-[12px] text-white/65 leading-relaxed line-clamp-3 flex-1">
            {item.summary}
          </p>
          <p className="text-[11px] text-white/40 mt-1">{formattedDate}</p>
        </div>
      </div>

      {/* Expanded dialog portal */}
      {open &&
        createPortal(
          <div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            onClick={() => setOpen(false)}
          >
            <div
              className="bg-white/15 backdrop-blur-md border border-white/20 rounded-[20px] max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative w-full aspect-4/3">
                <Image src={item.image} alt={item.title} fill className="object-cover" />
                <button
                  onClick={() => setOpen(false)}
                  className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close"
                >
                  <X size={14} />
                </button>
              </div>
              <div className="p-6 flex flex-col gap-3">
                <span
                  className={`self-start text-[11px] font-semibold px-2 py-0.5 rounded-full ${TAG_COLORS[item.tag] ?? "bg-white/20 text-white"}`}
                >
                  {item.tag}
                </span>
                <p className="text-[18px] font-bold text-white leading-snug">{item.title}</p>
                <p className="text-[14px] text-white/75 leading-relaxed">{item.summary}</p>
                <p className="text-[12px] text-white/40 mt-1">{formattedDate}</p>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/app/components/NewsCard.tsx
git commit -m "feat: add NewsCard with click-to-expand dialog"
```

---

## Task 4: Use NewsCard in page.tsx

**Files:**
- Modify: `app/(app)/app/page.tsx`

- [ ] **Step 1: Replace inline card markup with NewsCard**

Replace the entire file content with:

```tsx
"use client";

import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import GrainientFade from "./components/GrainientFade";
import NewsCard from "./components/NewsCard";
import newsData from "@/content/news.json";
import tutorialsData from "@/content/tutorials.json";
import Image from "next/image";

export default function AppHomePage() {
  const firstTutorial = tutorialsData[0];

  return (
    <div className="relative h-full w-full">
      {/* Grainient background */}
      <GrainientFade
        color1="#417c9c"
        color2="#716458"
        color3="#591427"
        timeSpeed={0.2}
        warpStrength={0.8}
        warpFrequency={4}
        warpSpeed={1.5}
        warpAmplitude={40}
        blendAngle={30}
        blendSoftness={0.1}
        rotationAmount={300}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.9}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-1">
        <Image
          src="/images/textures/app/smooth-flow.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.08] mix-blend-overlay"
        />
      </div>

      {/* Scrollable content */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10">
          {/* Welcome header */}
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-white leading-tight">
                Welcome back!
              </h1>
              <p className="text-[15px] text-white/70 mt-1">
                Ready to bring a new plushie to life?
              </p>
            </div>
            <Link
              href="/app/studio"
              className="shrink-0 px-6 py-2.5 rounded-[14px] bg-[#fff1b5] text-[#591427] text-[14px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95"
            >
              Go to Studio
            </Link>
          </div>

          {/* News section */}
          <section>
            <h2 className="text-[16px] font-bold text-white mb-4">
              What&apos;s New
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {newsData.map((item) => (
                <NewsCard key={item.id} item={item} />
              ))}
            </div>
          </section>

          {/* Tutorial reminder */}
          <section>
            <h2 className="text-[16px] font-bold text-white mb-4">
              Learn the Basics
            </h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center shrink-0">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white">
                  New to crochet?
                </p>
                <p className="text-[13px] text-white/65 mt-0.5">
                  Start with the tutorials — {tutorialsData.length} technique
                  guides from the magic ring to full assembly.
                </p>
              </div>
              <Link
                href={`/app/tutorials/${firstTutorial.slug}`}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white text-[#417c9c] text-[13px] font-semibold hover:bg-white/90 transition-colors"
              >
                Start Learning
                <ArrowRight size={14} />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify news cards**

Open `http://localhost:3000/app`. Cards should look identical to before. Click a card — dialog with dark backdrop should appear. Click backdrop or `×` to close.

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/app/page.tsx
git commit -m "feat: use NewsCard component in app home page"
```

---

## Task 5: NotificationsPanel component

**Files:**
- Create: `app/(app)/app/components/NotificationsPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  message: string;
  time: string;
  read: boolean;
}

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
  { id: "1", message: "New fox pattern is now available", time: "2 hours ago", read: false },
  { id: "2", message: "Your starter kit pattern was updated", time: "3 days ago", read: false },
  { id: "3", message: "Spring Bunny Limited Edition dropping soon", time: "1 week ago", read: true },
];

interface Props {
  onClose: () => void;
}

export default function NotificationsPanel({ onClose }: Props) {
  const notifications = PLACEHOLDER_NOTIFICATIONS;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b border-[#e0d9d5]">
        <span className="text-[13px] font-semibold text-[#1a1a1a]">Notifications</span>
        <button className="text-[11px] text-[#716458] hover:text-[#417c9c] transition-colors cursor-pointer">
          Mark all read
        </button>
      </div>

      {/* Notification list */}
      {notifications.length === 0 ? (
        <p className="text-[12px] text-[#716458] text-center py-4">No notifications yet</p>
      ) : (
        <div className="py-1">
          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={onClose}
              className="w-full flex items-start gap-2.5 px-3 py-2.5 hover:bg-[#417c9c]/10 transition-colors text-left cursor-pointer"
            >
              <span
                className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-[#e0d9d5]" : "bg-[#417c9c]"}`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] text-[#1a1a1a] font-medium leading-snug">{n.message}</p>
                <p className="text-[11px] text-[#716458] mt-0.5">{n.time}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/app/components/NotificationsPanel.tsx
git commit -m "feat: add NotificationsPanel component"
```

---

## Task 6: Wire notifications + sidebar previews into AppSidebar

**Files:**
- Modify: `app/(app)/app/AppSidebar.tsx`

- [ ] **Step 1: Replace the entire AppSidebar.tsx**

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  Home,
  Wand2,
  BookMarked,
  GraduationCap,
  Settings,
  CreditCard,
  LogOut,
  ChevronUp,
  Bell,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import NotificationsPanel from "./components/NotificationsPanel";
import tutorialsData from "@/content/tutorials.json";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
  { label: "Tutorials", href: "/app/tutorials", icon: GraduationCap },
];

const PREVIEW_TUTORIALS = tutorialsData.slice(0, 3);

export default function AppSidebar() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
        setNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Sidebar collapsible="icon" className="border-none bg-white">
      {/* Logo */}
      <SidebarHeader className="border-none group-data-[collapsible=icon]:p-0">
        <Link
          href="/app"
          className="flex items-center gap-3 px-4 py-5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-5"
        >
          <div className="shrink-0 w-9 h-9 flex items-center justify-center">
            <Image
              src="/images/logos/logo-black.png"
              alt="MyToys Crate"
              width={36}
              height={36}
              className="object-contain"
            />
          </div>
          <span className="font-bold text-[16px] text-[#1a1a1a] group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="border-none">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-[5px]">
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <SidebarMenuItem key={label}>
                    <Link
                      href={href}
                      className={`flex flex-row items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                        isActive
                          ? "bg-[#417c9c] text-white"
                          : "text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c]"
                      }`}
                    >
                      <Icon size={18} className="shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {label}
                      </span>
                    </Link>

                    {/* Sidebar preview items — only in expanded mode */}
                    {label === "My Patterns" && (
                      <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                        {[0, 1, 2].map((i) => (
                          <div
                            key={i}
                            className="h-3 rounded-[6px] bg-[#716458]/15 animate-pulse my-1"
                            style={{ width: i === 0 ? "70%" : i === 1 ? "55%" : "65%" }}
                          />
                        ))}
                      </div>
                    )}

                    {label === "Tutorials" && (
                      <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                        {PREVIEW_TUTORIALS.map((t) => (
                          <Link
                            key={t.slug}
                            href={`/app/tutorials/${t.slug}`}
                            className="text-[12px] text-[#716458] hover:text-[#417c9c] truncate py-1 transition-colors"
                          >
                            {t.title}
                          </Link>
                        ))}
                      </div>
                    )}
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account with dropdown */}
      <SidebarFooter className="px-3 py-4 border-none">
        <div ref={dropdownRef} className="relative">
          {/* Notifications panel */}
          {notificationsOpen && (
            <NotificationsPanel onClose={() => setNotificationsOpen(false)} />
          )}

          {/* User dropdown menu */}
          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-[#e0d9d5] shadow-lg overflow-hidden py-1 z-50">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c] transition-colors cursor-pointer"
                onClick={() => {
                  setDropdownOpen(false);
                  setNotificationsOpen(true);
                }}
              >
                <Bell size={15} />
                <span>Notifications</span>
              </button>
              <Link
                href="/app/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <Link
                href="/app/billing"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-[#417c9c]/10 hover:text-[#417c9c] transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <CreditCard size={15} />
                <span>Billing</span>
              </Link>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-[#716458] hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={() => setDropdownOpen(false)}
              >
                <LogOut size={15} />
                <span className="group-data-[collapsible=icon]:hidden">
                  Log out
                </span>
              </button>
            </div>
          )}

          {/* User card button */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-[#417c9c]/10 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center"
          >
            <div className="w-8 h-8 rounded-full bg-[#417c9c] flex items-center justify-center shrink-0">
              <span className="text-white text-[12px] font-bold">MP</span>
            </div>
            <div className="flex flex-col min-w-0 text-left group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-[13px] font-semibold text-[#1a1a1a] truncate">
                Maria Pastin
              </span>
              <span className="text-[11px] text-[#716458] truncate">
                ivo.pastin@gmail.com
              </span>
            </div>
            <ChevronUp
              size={14}
              className={`text-[#716458] shrink-0 transition-transform group-data-[collapsible=icon]:hidden ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

- [ ] **Step 2: Verify sidebar features**

Open `http://localhost:3000/app` with the sidebar expanded:
- Under "My Patterns": three pulsing skeleton bars should appear
- Under "Tutorials": "The Magic Ring", "Single Crochet (sc)", "Double Crochet (dc)" links should appear, each linking to their tutorial page
- Click user card → dropdown should show Notifications, Settings, Billing, Log out
- Click Notifications → dropdown closes, notifications popover opens with 3 items and a "Mark all read" button
- Click outside → panel closes
- Collapse sidebar via toggle → preview items and labels should disappear

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/app/AppSidebar.tsx
git commit -m "feat: add sidebar previews and notifications panel to AppSidebar"
```

---

## Task 7: Final verification pass

- [ ] **Step 1: Check all four features together**

Open `http://localhost:3000/app` and verify:

1. **Help button** — `?` circle appears bottom-right of content area. Click opens popover with 4 items. Click outside closes it.
2. **News cards** — 3 cards render as before. Click any card → dark backdrop + expanded dialog. Click backdrop or `×` → closes. Cards show `cursor-pointer` on hover.
3. **Sidebar previews** — 3 skeleton bars under "My Patterns", 3 tutorial links under "Tutorials". All hidden when sidebar is collapsed.
4. **Notifications** — user dropdown includes "Notifications" above "Settings". Clicking it closes dropdown and opens notifications panel above user card. Click outside closes panel.

- [ ] **Step 2: Check sidebar collapsed state**

Click the sidebar toggle (top-left of content area). Confirm sidebar collapses to icon-only mode and no preview items are visible.

- [ ] **Step 3: Final commit if anything was missed**

```bash
git status
# commit any remaining changes
```
