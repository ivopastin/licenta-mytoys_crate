# Settings Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/app/settings` page with Profile, Account, and Billing tabs navigated via `?tab=` URL param.

**Architecture:** Async Server Component reads `searchParams.tab`, fetches the user's profile from Supabase, and renders the active tab section as a Client Component with profile data passed as props. Tab switching uses `<Link>` — no client state needed. Profile writes to the `profiles` table; Account writes to Supabase Auth.

**Tech Stack:** Next.js 16 App Router, Supabase (`@supabase/ssr`), TypeScript, Tailwind CSS, Bun

---

## File Map

| Action | File |
|--------|------|
| Manual | Supabase Dashboard — add redirect URL |
| Create | `app/(app)/app/settings/page.tsx` |
| Create | `app/(app)/app/settings/TabNav.tsx` |
| Create | `app/(app)/app/settings/ProfileSection.tsx` |
| Create | `app/(app)/app/settings/AccountSection.tsx` |
| Create | `app/(app)/app/settings/BillingSection.tsx` |

---

### Task 1: Supabase Dashboard — Add Redirect URL

**Files:** None (manual step)

- [ ] **Step 1: Add redirect URL for email change**

In Supabase Dashboard → **Authentication → URL Configuration → Redirect URLs**, click **Add URL** and add:
```
http://localhost:3000/app/settings
```
Click Save. This allows Supabase to redirect back to the settings page after the user confirms their email change.

---

### Task 2: TabNav Component

**Files:**
- Create: `app/(app)/app/settings/TabNav.tsx`

- [ ] **Step 1: Create TabNav**

```tsx
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { User, Lock, CreditCard } from "lucide-react";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "account", label: "Account", icon: Lock },
  { key: "billing", label: "Billing", icon: CreditCard },
];

export default function TabNav() {
  const searchParams = useSearchParams();
  const activeTab = searchParams.get("tab") ?? "profile";

  return (
    <nav className="flex flex-col gap-1 w-[180px] shrink-0">
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        return (
          <Link
            key={key}
            href={`/app/settings?tab=${key}`}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-[12px] text-[14px] font-semibold transition-colors ${
              isActive
                ? "bg-white/20 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={16} className="shrink-0" />
            {label}
          </Link>
        );
      })}
    </nav>
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
git add "app/(app)/app/settings/TabNav.tsx"
git commit -m "feat: add settings TabNav component"
```

---

### Task 3: ProfileSection Component

**Files:**
- Create: `app/(app)/app/settings/ProfileSection.tsx`

- [ ] **Step 1: Create ProfileSection**

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

interface ProfileSectionProps {
  userId: string;
  initialDisplayName: string | null;
  initialAvatarColor: string | null;
  initialExperienceLevel: string | null;
}

export default function ProfileSection({
  userId,
  initialDisplayName,
  initialAvatarColor,
  initialExperienceLevel,
}: ProfileSectionProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "");
  const [avatarColor, setAvatarColor] = useState(initialAvatarColor ?? "#417c9c");
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(
    (initialExperienceLevel as ExperienceLevel) ?? null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const supabase = createClient();

  async function handleSave() {
    setError(null);
    setLoading(true);

    const { error } = await supabase
      .from("profiles")
      .update({
        display_name: displayName.trim(),
        avatar_color: avatarColor,
        experience_level: experienceLevel,
      })
      .eq("id", userId);

    setLoading(false);

    if (error) {
      setError("Failed to save. Please try again.");
      return;
    }

    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[18px] font-bold text-ink">Profile</h2>

      {/* Avatar preview */}
      <div className="flex items-center gap-4">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 transition-colors duration-200"
          style={{ backgroundColor: avatarColor }}
        >
          <span className="text-white text-[22px] font-bold">
            {getInitials(displayName)}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[14px] font-semibold text-ink">
            {displayName.trim() || "Your name"}
          </span>
          <span className="text-[12px] text-warm">Avatar preview</span>
        </div>
      </div>

      {/* Display name */}
      <div className="flex flex-col gap-1.5">
        <label className="text-[13px] font-semibold text-warm">Display Name</label>
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
        <label className="text-[13px] font-semibold text-warm">Avatar Color</label>
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
              onClick={() => setExperienceLevel(experienceLevel === value ? null : value)}
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

      {/* Feedback */}
      {error && <p className="text-[13px] text-red-500 font-medium">{error}</p>}
      {success && <p className="text-[13px] text-green-600 font-medium">Profile updated!</p>}

      {/* Save */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
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
git add "app/(app)/app/settings/ProfileSection.tsx"
git commit -m "feat: add settings ProfileSection component"
```

---

### Task 4: AccountSection Component

**Files:**
- Create: `app/(app)/app/settings/AccountSection.tsx`

- [ ] **Step 1: Create AccountSection**

```tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function getPasswordStrength(password: string): "weak" | "medium" | "strong" {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /[0-9]/.test(password);
  const score = [hasLower, hasUpper, hasDigit].filter(Boolean).length;
  if (password.length < 6) return "weak";
  if (score === 3) return "strong";
  if (score === 2) return "medium";
  return "weak";
}

const strengthConfig = {
  weak: { label: "Weak", color: "bg-red-400", width: "w-1/3" },
  medium: { label: "Medium", color: "bg-yellow-400", width: "w-2/3" },
  strong: { label: "Strong", color: "bg-green-500", width: "w-full" },
};

export default function AccountSection() {
  const [newEmail, setNewEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const supabase = createClient();
  const passwordStrength = newPassword ? getPasswordStrength(newPassword) : null;

  async function handleEmailChange() {
    setEmailError(null);
    setEmailSuccess(false);
    setEmailLoading(true);

    const { error } = await supabase.auth.updateUser({ email: newEmail });

    setEmailLoading(false);

    if (error) {
      setEmailError(error.message);
      return;
    }

    setEmailSuccess(true);
    setNewEmail("");
  }

  async function handlePasswordChange() {
    setPasswordError(null);
    setPasswordSuccess(false);

    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }

    setPasswordLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPasswordLoading(false);

    if (error) {
      setPasswordError(error.message);
      return;
    }

    setPasswordSuccess(true);
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => setPasswordSuccess(false), 3000);
  }

  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-bold text-ink">Account</h2>

      {/* Change Email */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-ink">Change Email</h3>
          <p className="text-[13px] text-warm">
            A confirmation link will be sent to your new email address.
          </p>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">New Email</label>
          <input
            type="email"
            placeholder="new@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            className="w-full border border-border-soft rounded-[12px] px-4 py-3 text-[15px] text-ink outline-none focus:border-brand transition-colors"
          />
        </div>

        {emailError && <p className="text-[13px] text-red-500 font-medium">{emailError}</p>}
        {emailSuccess && (
          <p className="text-[13px] text-green-600 font-medium">
            A confirmation link has been sent to your new email. Click it to apply the change.
          </p>
        )}

        <button
          type="button"
          onClick={handleEmailChange}
          disabled={!newEmail.trim() || emailLoading}
          className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {emailLoading ? "Sending…" : "Send confirmation"}
        </button>
      </div>

      {/* Divider */}
      <div className="h-px bg-border-soft" />

      {/* Change Password */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h3 className="text-[15px] font-semibold text-ink">Change Password</h3>
          <p className="text-[13px] text-warm">
            Choose a strong password with uppercase, lowercase and digits.
          </p>
        </div>

        {/* New password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full border border-border-soft rounded-[12px] px-4 py-3 pr-11 text-[15px] text-ink outline-none focus:border-brand transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm hover:text-ink transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
          {newPassword && passwordStrength && (
            <div className="flex flex-col gap-1 mt-1">
              <div className="h-1 w-full bg-border-soft rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strengthConfig[passwordStrength].color} ${strengthConfig[passwordStrength].width}`}
                />
              </div>
              <span className={`text-[11px] font-semibold ${
                passwordStrength === "strong" ? "text-green-500" :
                passwordStrength === "medium" ? "text-yellow-500" : "text-red-400"
              }`}>
                {strengthConfig[passwordStrength].label}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-semibold text-warm">Confirm Password</label>
          <div className="relative">
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full border border-border-soft rounded-[12px] px-4 py-3 pr-11 text-[15px] text-ink outline-none focus:border-brand transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-warm hover:text-ink transition-colors cursor-pointer"
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
            </button>
          </div>
        </div>

        {passwordError && <p className="text-[13px] text-red-500 font-medium">{passwordError}</p>}
        {passwordSuccess && <p className="text-[13px] text-green-600 font-medium">Password updated!</p>}

        <button
          type="button"
          onClick={handlePasswordChange}
          disabled={!newPassword.trim() || passwordLoading}
          className="self-start px-6 py-2.5 bg-deep text-(--color-accent) rounded-[12px] text-[14px] font-bold hover:bg-[#7a1c35] transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:scale-[1.02] active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
        >
          {passwordLoading ? "Updating…" : "Update password"}
        </button>
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
git add "app/(app)/app/settings/AccountSection.tsx"
git commit -m "feat: add settings AccountSection with email and password change"
```

---

### Task 5: BillingSection Component

**Files:**
- Create: `app/(app)/app/settings/BillingSection.tsx`

- [ ] **Step 1: Create BillingSection**

```tsx
interface BillingSectionProps {
  displayName: string | null;
}

export default function BillingSection({ displayName }: BillingSectionProps) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[18px] font-bold text-ink">Billing</h2>

      {/* Current Plan */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Current Plan</h3>
        <div className="flex items-center justify-between p-4 border border-border-soft rounded-[14px]">
          <div className="flex flex-col gap-0.5">
            <span className="text-[15px] font-bold text-ink">Free Plan</span>
            <span className="text-[13px] text-warm">Access to all core features.</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
              Coming soon
            </span>
            <button
              disabled
              className="px-4 py-2 rounded-[10px] text-[13px] font-semibold bg-deep text-(--color-accent) opacity-50 cursor-not-allowed"
            >
              Upgrade
            </button>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="flex flex-col gap-3">
        <h3 className="text-[15px] font-semibold text-ink">Payment Method</h3>

        {/* Credit card visual */}
        <div
          className="relative w-full max-w-[320px] h-[180px] rounded-[20px] p-6 flex flex-col justify-between overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #417c9c 0%, #2a3f4f 50%, #8b1a33 100%)",
          }}
        >
          {/* Card shine */}
          <div className="absolute inset-0 opacity-10"
            style={{
              background: "linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 60%)",
            }}
          />

          {/* Top row */}
          <div className="flex items-center justify-between relative z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/60 text-[10px] font-medium uppercase tracking-wider">
                MyToys Crate
              </span>
            </div>
            <span className="text-white font-bold text-[18px] italic tracking-widest">
              VISA
            </span>
          </div>

          {/* Card number */}
          <div className="relative z-10">
            <span className="text-white text-[18px] font-mono tracking-[0.2em]">
              •••• •••• •••• 4242
            </span>
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between relative z-10">
            <div className="flex flex-col gap-0.5">
              <span className="text-white/50 text-[9px] uppercase tracking-wider">Card Holder</span>
              <span className="text-white text-[13px] font-semibold truncate max-w-[160px]">
                {displayName?.toUpperCase() || "CARD HOLDER"}
              </span>
            </div>
            <div className="flex flex-col gap-0.5 items-end">
              <span className="text-white/50 text-[9px] uppercase tracking-wider">Expires</span>
              <span className="text-white text-[13px] font-semibold">12/27</span>
            </div>
          </div>
        </div>

        {/* Add new card */}
        <div className="flex items-center gap-2 mt-1">
          <button
            disabled
            className="px-4 py-2 rounded-[10px] text-[13px] font-semibold border border-border-soft text-warm opacity-50 cursor-not-allowed"
          >
            + Add new card
          </button>
          <span className="text-[11px] font-semibold px-2 py-1 rounded-full bg-amber-100 text-amber-600">
            Coming soon
          </span>
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
git add "app/(app)/app/settings/BillingSection.tsx"
git commit -m "feat: add settings BillingSection with design-only card UI"
```

---

### Task 6: Settings Page (Server Component)

**Files:**
- Create: `app/(app)/app/settings/page.tsx`

- [ ] **Step 1: Create the settings page**

```tsx
import { createClient } from "@/lib/supabase/server";
import TabNav from "./TabNav";
import ProfileSection from "./ProfileSection";
import AccountSection from "./AccountSection";
import BillingSection from "./BillingSection";
import { Suspense } from "react";

type Tab = "profile" | "account" | "billing";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const { tab } = await searchParams;
  const activeTab: Tab =
    tab === "account" || tab === "billing" ? tab : "profile";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let profile: {
    display_name: string | null;
    avatar_color: string | null;
    experience_level: string | null;
  } | null = null;

  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("display_name, avatar_color, experience_level")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  return (
    <div className="relative h-full w-full overflow-y-auto">
      <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-8">
        {/* Header */}
        <h1 className="text-[28px] font-bold text-white leading-tight">Settings</h1>

        {/* Two-column layout */}
        <div className="flex gap-8 items-start">
          {/* Left: Tab nav */}
          <Suspense>
            <TabNav />
          </Suspense>

          {/* Right: Active section */}
          <div className="flex-1 bg-white rounded-[16px] p-6">
            {activeTab === "profile" && user && (
              <ProfileSection
                userId={user.id}
                initialDisplayName={profile?.display_name ?? null}
                initialAvatarColor={profile?.avatar_color ?? null}
                initialExperienceLevel={profile?.experience_level ?? null}
              />
            )}
            {activeTab === "account" && <AccountSection />}
            {activeTab === "billing" && (
              <BillingSection displayName={profile?.display_name ?? null} />
            )}
          </div>
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

- [ ] **Step 3: Smoke test**

```bash
bun dev
```

1. Open `http://localhost:3000/app/settings` — should show Profile tab with your name/color pre-filled
2. Change display name, pick a different color → click Save → should show "Profile updated!" and sidebar updates
3. Click Account tab → should show email + password sections
4. Click Billing tab → should show the credit card and plan UI
5. Tab switching should update the URL (`?tab=account`, `?tab=billing`)
6. Refresh on each tab — should stay on the same tab

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/settings/page.tsx"
git commit -m "feat: add settings page with Profile, Account, and Billing tabs"
```
