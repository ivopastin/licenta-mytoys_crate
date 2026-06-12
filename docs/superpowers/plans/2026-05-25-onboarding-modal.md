# Onboarding Modal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Show a profile setup modal (display name, avatar color, experience level) on every login until the user completes it, persisted in a Supabase `profiles` table.

**Architecture:** A `profiles` table with a trigger auto-creates a row on signup. The app layout (Server Component) fetches the profile on every request and renders `OnboardingModal` if `onboarding_completed` is false. The modal updates the profile row and calls `router.refresh()` to close.

**Tech Stack:** Next.js 16 App Router, Supabase (PostgreSQL + RLS), `@supabase/ssr`, TypeScript, Tailwind CSS, Bun

---

## File Map

| Action | File |
|--------|------|
| Manual (SQL) | Supabase SQL Editor — create `profiles` table + trigger |
| Create | `app/(app)/app/components/OnboardingModal.tsx` |
| Modify | `app/(app)/app/layout.tsx` |
| Modify | `app/(app)/app/AppSidebar.tsx` |

---

### Task 1: Create profiles Table and Trigger in Supabase

**Files:** None (done via Supabase SQL Editor)

- [ ] **Step 1: Open the SQL Editor**

In the Supabase Dashboard, go to **SQL Editor** in the left sidebar. Click **New query**.

- [ ] **Step 2: Run the table + RLS SQL**

Paste and run:

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

create policy "Users can read own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);
```

Expected: "Success. No rows returned."

- [ ] **Step 3: Run the trigger SQL**

Paste and run in a new query:

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

Expected: "Success. No rows returned."

- [ ] **Step 4: Manually insert a profile row for existing users**

Existing users (created before the trigger) won't have a profile row yet. Run this to backfill them:

```sql
insert into profiles (id)
select id from auth.users
on conflict (id) do nothing;
```

Expected: "Success. X rows affected." (one per existing user)

- [ ] **Step 5: Verify**

Go to **Table Editor → profiles** in Supabase. You should see one row per existing user with `onboarding_completed = false`.

---

### Task 2: OnboardingModal Component

**Files:**
- Create: `app/(app)/app/components/OnboardingModal.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const AVATAR_COLORS = [
  { name: "Brand blue", hex: "#417c9c" },
  { name: "Deep burgundy", hex: "#8b1a33" },
  { name: "Warm brown", hex: "#716458" },
  { name: "Soft green", hex: "#4a7c59" },
  { name: "Muted purple", hex: "#6b5b8a" },
  { name: "Coral", hex: "#c4614a" },
  { name: "Slate", hex: "#4a5568" },
  { name: "Sand", hex: "#b8956a" },
];

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

type ExperienceLevel = "beginner" | "intermediate" | "advanced";

function getInitials(name: string): string {
  if (!name.trim()) return "?";
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export default function OnboardingModal() {
  const [visible, setVisible] = useState(true);
  const [displayName, setDisplayName] = useState("");
  const [avatarColor, setAvatarColor] = useState(AVATAR_COLORS[0].hex);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  if (!visible) return null;

  async function handleSave() {
    setError(null);
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        avatar_color: avatarColor,
        experience_level: experienceLevel,
        onboarding_completed: true,
      })
      .eq("id", user.id);

    setLoading(false);

    if (error) {
      setError("Something went wrong. Please try again.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-[20px] shadow-2xl w-full max-w-[420px] mx-4 p-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-[24px] font-bold text-ink leading-tight">
            Welcome to MyToys Crate!
          </h2>
          <p className="text-[14px] text-warm font-medium">
            Set up your profile to get started.
          </p>
        </div>

        {/* Avatar preview */}
        <div className="flex justify-center">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-200"
            style={{ backgroundColor: avatarColor }}
          >
            <span className="text-white text-[22px] font-bold">
              {getInitials(displayName)}
            </span>
          </div>
        </div>

        {/* Display name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">
            Display Name
          </label>
          <input
            type="text"
            placeholder="How should we call you?"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {/* Avatar color */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-warm">
            Avatar Color
          </label>
          <div className="flex gap-2 flex-wrap">
            {AVATAR_COLORS.map(({ name, hex }) => (
              <button
                key={hex}
                type="button"
                title={name}
                onClick={() => setAvatarColor(hex)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
                style={{ backgroundColor: hex }}
              >
                {avatarColor === hex && (
                  <Check size={14} className="text-white" strokeWidth={3} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Experience level */}
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-semibold text-warm">
            Crochet Experience <span className="font-normal text-warm/60">(optional)</span>
          </label>
          <div className="flex gap-2">
            {EXPERIENCE_LEVELS.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() =>
                  setExperienceLevel(experienceLevel === value ? null : value)
                }
                className={`flex-1 py-2 rounded-[10px] text-[13px] font-semibold border transition-colors cursor-pointer ${
                  experienceLevel === value
                    ? "bg-brand text-white border-brand"
                    : "bg-white text-warm border-border-soft hover:border-brand hover:text-brand"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <p className="text-[13px] text-red-500 font-medium">{error}</p>
        )}

        {/* Actions */}
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!displayName.trim() || loading}
            className="w-full bg-deep text-(--color-accent) rounded-[12px] py-3 text-[15px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
          >
            {loading ? "Saving…" : "Save & continue"}
          </button>
          <button
            type="button"
            onClick={() => setVisible(false)}
            className="w-full py-2.5 text-[13px] font-medium text-warm hover:text-ink transition-colors cursor-pointer"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/components/OnboardingModal.tsx"
git commit -m "feat: add OnboardingModal component"
```

---

### Task 3: Wire Modal into App Layout

**Files:**
- Modify: `app/(app)/app/layout.tsx`

- [ ] **Step 1: Replace layout.tsx with async server version**

```tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "./AppSidebar";
import HelpButton from "./components/HelpButton";
import OnboardingModal from "./components/OnboardingModal";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: {
    display_name: string | null;
    avatar_color: string | null;
    experience_level: string | null;
    onboarding_completed: boolean;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_color, experience_level, onboarding_completed")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const showOnboarding = profile !== null && !profile.onboarding_completed;

  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AppSidebar
          displayName={profile?.display_name ?? null}
          avatarColor={profile?.avatar_color ?? null}
          email={user?.email ?? null}
        />

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

      {showOnboarding && <OnboardingModal />}
    </div>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit
```

Expected: no errors. If you see a type error about `AppSidebar` props, proceed to Task 4 first then return here.

- [ ] **Step 3: Commit**

```bash
git add "app/(app)/app/layout.tsx"
git commit -m "feat: wire OnboardingModal into app layout via server-side profile fetch"
```

---

### Task 4: Update AppSidebar to Accept Profile Props

**Files:**
- Modify: `app/(app)/app/AppSidebar.tsx`

- [ ] **Step 1: Replace AppSidebar.tsx with prop-driven version**

The sidebar currently fetches `userEmail` client-side. We replace that with props passed from the server layout, and derive initials + color from profile data.

```tsx
"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { label: "Home", href: "/app", icon: Home },
  { label: "Studio", href: "/app/studio", icon: Wand2 },
  { label: "My Patterns", href: "/app/my-patterns", icon: BookMarked },
  { label: "Tutorials", href: "/app/tutorials", icon: GraduationCap },
];

const PREVIEW_TUTORIALS = tutorialsData.slice(0, 3);
const supabase = createClient();

function getInitials(displayName: string | null, email: string | null): string {
  if (displayName?.trim()) {
    return displayName
      .trim()
      .split(/\s+/)
      .map((w) => w[0].toUpperCase())
      .slice(0, 2)
      .join("");
  }
  if (email) return email.slice(0, 2).toUpperCase();
  return "?";
}

interface AppSidebarProps {
  displayName: string | null;
  avatarColor: string | null;
  email: string | null;
}

export default function AppSidebar({ displayName, avatarColor, email }: AppSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
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

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  const initials = getInitials(displayName, email);
  const color = avatarColor ?? "#417c9c";
  const label = displayName?.trim() || email || "Your account";

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
          <span className="font-bold text-[16px] text-ink group-data-[collapsible=icon]:hidden">
            MyToys Crate
          </span>
        </Link>
      </SidebarHeader>

      {/* Nav items */}
      <SidebarContent className="border-none">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-[5px]">
              {NAV_ITEMS.map(({ label: navLabel, href, icon: Icon }) => {
                const isActive =
                  href === "/app"
                    ? pathname === "/app"
                    : pathname.startsWith(href);
                return (
                  <React.Fragment key={navLabel}>
                    <SidebarMenuItem>
                      <Link
                        href={href}
                        className={`flex flex-row items-center gap-3 w-full px-3 py-2.5 rounded-[12px] font-semibold text-[14px] transition-colors group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:mx-auto ${
                          isActive
                            ? "bg-[var(--color-brand)] text-white"
                            : "text-warm hover:bg-[var(--color-brand)]/10 hover:text-brand"
                        }`}
                      >
                        <Icon size={18} className="shrink-0" />
                        <span className="group-data-[collapsible=icon]:hidden">
                          {navLabel}
                        </span>
                      </Link>

                      {navLabel === "My Patterns" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {[0, 1, 2].map((i) => (
                            <div
                              key={i}
                              className="h-3 rounded-[6px] bg-warm/15 animate-pulse my-1"
                              style={{ width: i === 0 ? "70%" : i === 1 ? "55%" : "65%" }}
                            />
                          ))}
                        </div>
                      )}

                      {navLabel === "Tutorials" && (
                        <div className="pl-9 pb-1 flex flex-col gap-0.5 group-data-[collapsible=icon]:hidden">
                          {PREVIEW_TUTORIALS.map((t) => (
                            <Link
                              key={t.slug}
                              href={`/app/tutorials/${t.slug}`}
                              className="text-[12px] text-warm hover:text-brand truncate py-1 transition-colors"
                            >
                              {t.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </SidebarMenuItem>

                    {(navLabel === "Studio" || navLabel === "My Patterns") && (
                      <div
                        key={`divider-${navLabel}`}
                        className="mx-3 my-1 h-px bg-border-soft group-data-[collapsible=icon]:mx-1"
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User account with dropdown */}
      <SidebarFooter className="px-3 py-4 border-none">
        <div ref={dropdownRef} className="relative">
          {notificationsOpen && (
            <NotificationsPanel
              onBack={() => { setNotificationsOpen(false); setDropdownOpen(true); }}
              onClose={() => setNotificationsOpen(false)}
            />
          )}

          {dropdownOpen && (
            <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-[12px] border border-border-soft shadow-lg overflow-hidden py-1 z-50">
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-[var(--color-brand)]/10 hover:text-brand transition-colors cursor-pointer"
                onClick={() => { setDropdownOpen(false); setNotificationsOpen(true); }}
              >
                <Bell size={15} />
                <span>Notifications</span>
              </button>
              <Link
                href="/app/settings"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-[var(--color-brand)]/10 hover:text-brand transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <Settings size={15} />
                <span>Settings</span>
              </Link>
              <Link
                href="/app/billing"
                className="flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-[var(--color-brand)]/10 hover:text-brand transition-colors"
                onClick={() => setDropdownOpen(false)}
              >
                <CreditCard size={15} />
                <span>Billing</span>
              </Link>
              <button
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-[13px] font-medium text-warm hover:bg-red-50 hover:text-red-500 transition-colors cursor-pointer"
                onClick={handleLogout}
              >
                <LogOut size={15} />
                <span className="group-data-[collapsible=icon]:hidden">Log out</span>
              </button>
            </div>
          )}

          {/* User card button */}
          <button
            onClick={() => setDropdownOpen((v) => !v)}
            className="w-full flex items-center gap-3 px-2 py-2 rounded-[12px] hover:bg-[var(--color-brand)]/10 transition-colors cursor-pointer group-data-[collapsible=icon]:justify-center"
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              style={{ backgroundColor: color }}
            >
              <span className="text-white text-[12px] font-bold">{initials}</span>
            </div>
            <div className="flex flex-col min-w-0 text-left group-data-[collapsible=icon]:hidden flex-1">
              <span className="text-[13px] font-semibold text-ink truncate">
                {label}
              </span>
              {displayName && (
                <span className="text-[11px] text-warm truncate">{email}</span>
              )}
            </div>
            <ChevronUp
              size={14}
              className={`text-warm shrink-0 transition-transform group-data-[collapsible=icon]:hidden ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
bunx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Smoke test**

```bash
bun dev
```

1. Open `http://localhost:3000/app` — the onboarding modal should appear (since your existing user has `onboarding_completed = false`)
2. Type a display name → avatar preview should update live with initials
3. Click a color swatch → avatar preview should update color
4. Click an experience level pill → it should highlight
5. Click **Save & continue** → modal should disappear, sidebar should show the display name and color
6. Refresh the page → modal should NOT reappear

- [ ] **Step 4: Test skip behavior**

1. Manually set `onboarding_completed = false` for your user in Supabase Dashboard → Table Editor → profiles
2. Reload `/app` → modal appears
3. Click **Skip for now** → modal disappears
4. Refresh the page → modal appears again (skip doesn't persist)

- [ ] **Step 5: Commit**

```bash
git add "app/(app)/app/AppSidebar.tsx"
git commit -m "feat: update AppSidebar to show real profile data (display name, avatar color)"
```
