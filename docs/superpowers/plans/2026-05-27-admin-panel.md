# Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a `/admin` section accessible only to `ivo.pastin@gmail.com` with dashboard analytics, template management, news management (backed by Supabase), and review moderation.

**Architecture:** New route group `app/(admin)/` alongside `app/(app)/`. Middleware gates `/admin/*` to admin email only. Admin layout reuses the same visual style (GrainientFade background). News migrates from static `news.json` to a Supabase `news` table with Supabase Storage for images. All mutations go through server actions in a single `actions.ts` file.

**Tech Stack:** Next.js 15 App Router, Supabase (postgres + storage), shadcn/ui (charts, table, dialog), Tailwind v4, lucide-react

---

## File Map

**New files:**
- `app/(admin)/layout.tsx` — admin shell with GrainientFade + admin sidebar
- `app/(admin)/admin/page.tsx` — redirects to `/admin/dashboard`
- `app/(admin)/admin/dashboard/page.tsx` — stat cards + charts
- `app/(admin)/admin/templates/page.tsx` — template manager (tabs: plushie / accessory)
- `app/(admin)/admin/news/page.tsx` — news manager
- `app/(admin)/admin/reviews/page.tsx` — reviews table with delete
- `app/(admin)/admin/actions.ts` — all server actions
- `components/admin/AdminSidebar.tsx` — sidebar for admin section

**Modified files:**
- `middleware.ts` — add `/admin` guard
- `app/(app)/app/page.tsx` — switch from `news.json` to Supabase `news` table

---

## Task 1: Middleware — Guard `/admin` routes

**Files:**
- Modify: `middleware.ts`

- [ ] **Step 1: Add admin guard to middleware**

Replace the contents of `middleware.ts` with:

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_EMAIL = "ivo.pastin@gmail.com";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as Parameters<typeof supabaseResponse.cookies.set>[2])
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Block non-admins from /admin/*
  if (pathname.startsWith("/admin") && user?.email !== ADMIN_EMAIL) {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Unauthenticated user trying to access /app/*
  if (!user && pathname.startsWith("/app")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Authenticated user trying to access /login
  if (user && pathname === "/login") {
    return NextResponse.redirect(new URL("/app", request.url));
  }

  if (pathname === "/reset-password") {
    return supabaseResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|auth/callback|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- [ ] **Step 2: Verify middleware compiles**

```bash
cd /Users/mariapastin/Developer/Facultate/licenta/mytoys-crate && npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Commit**

```bash
git add middleware.ts
git commit -m "feat: guard /admin routes to admin email only"
```

---

## Task 2: Create `news` Supabase table and seed it

**Files:**
- No code files — SQL only

- [ ] **Step 1: Run this SQL in Supabase SQL Editor**

```sql
CREATE TABLE public.news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  summary text NOT NULL,
  body text NOT NULL,
  image_url text,
  date date NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read news" ON public.news
  FOR SELECT USING (true);

CREATE POLICY "Admin full access" ON public.news
  FOR ALL
  USING (auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com');
```

- [ ] **Step 2: Seed existing news items**

```sql
INSERT INTO public.news (slug, title, summary, body, image_url, date, tag) VALUES
(
  'new-animal',
  'New Animal Pattern: The Fox',
  'A brand-new fox pattern has been added to the collection — complete with bushy tail, pointy ears, and optional scarf accessory.',
  'We''re excited to introduce the Fox pattern — one of the most requested animals from the community! This intermediate-level pattern features a full-body construction with a distinctive bushy tail, articulated pointy ears, and a charming narrow snout. The optional winter scarf accessory is included as a bonus and uses simple colour-change techniques.

The fox uses size 2.5mm hooks with DK weight yarn in rust, cream, and black. Safety eyes in 9mm are recommended for the best expression. The pattern includes step-by-step photo instructions for the tail shaping, which uses a modified magic ring technique to create the natural taper.

Total stitch count comes in at around 320 rounds for the full body. Estimated completion time for an experienced crocheter is 6–8 hours. The pattern PDF is available immediately in your My Patterns library.',
  '/images/news/new-animal.png',
  '2026-05-05',
  'New Pattern'
),
(
  'new-pattern',
  'Starter Kit Pattern Now Available',
  'We''ve released a beginner-friendly starter kit pattern with simplified shapes and extra-detailed photo instructions. Perfect for your first plushie.',
  'The Starter Kit pattern is designed from the ground up for beginners — no prior amigurumi experience needed. It features a simple round bear with minimal shaping, so you can focus entirely on getting your tension and stitch count right before moving on to more complex animals.

Every step of the pattern comes with a reference photo taken from multiple angles, so you always know exactly what your work should look like. We''ve also included a dedicated troubleshooting section covering the most common beginner mistakes: uneven magic rings, tension issues, and how to close the final round without a visible gap.

The kit includes the pattern PDF, a materials checklist with budget-friendly yarn recommendations, and a printable stitch reference card. It''s free for all members and available now in the Tutorials section under "Getting Started".',
  '/images/news/new-pattern.png',
  '2026-04-28',
  'Update'
),
(
  'new-rabbit',
  'Spring Bunny Limited Edition',
  'Celebrate spring with the limited-edition bunny pattern — floppy ears, rosy cheeks, and a tiny carrot accessory included in the download.',
  'The Spring Bunny is our first seasonal limited-edition pattern, available only through the end of May. It features signature floppy ears constructed with a clever wire armature technique that lets you pose them however you like — upright, drooping, or asymmetric for extra personality.

The rosy cheek embroidery guide is included as a separate mini-tutorial within the PDF. We''ve also added a full accessory pattern for a tiny carrot with a green tuft top — about 4cm finished size — that can be stitched to the bunny''s paw or left loose as a prop.

This pattern is rated beginner-friendly despite the ear technique, because the armature method is explained with a dedicated photo sequence. Finished size is approximately 18cm seated. Yarn requirements: white or cream main body, pink for cheeks, orange and green for the carrot. Available as a one-time download — grab it before it''s gone!',
  '/images/news/new-rabbit.png',
  '2026-04-15',
  'Limited Edition'
);
```

- [ ] **Step 3: Verify rows exist**

Go to Supabase → Table Editor → `news` — should show 3 rows.

---

## Task 3: Create `news-images` Supabase Storage bucket

**Files:**
- No code files — Supabase dashboard only

- [ ] **Step 1: Create the bucket**

Go to **Supabase → Storage → New bucket**:
- Name: `news-images`
- Public: **yes** (toggle on)
- Click Create

- [ ] **Step 2: Add storage policy for admin uploads**

Go to **Supabase → Storage → news-images → Policies → New policy → For full customization**:

```sql
-- Allow admin to upload/delete
CREATE POLICY "Admin can manage news images"
ON storage.objects
FOR ALL
USING (
  bucket_id = 'news-images'
  AND auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com'
)
WITH CHECK (
  bucket_id = 'news-images'
  AND auth.jwt() ->> 'email' = 'ivo.pastin@gmail.com'
);
```

---

## Task 4: Migrate home page from `news.json` to Supabase

**Files:**
- Modify: `app/(app)/app/page.tsx`

- [ ] **Step 1: Update the home page to fetch news from Supabase**

Replace `app/(app)/app/page.tsx` with:

```typescript
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import GrainientFade from "@/components/app/GrainientFade";
import NewsCard from "@/components/app/NewsCard";
import ReviewsCarousel, { type ReviewItem } from "@/components/app/ReviewsCarousel";
import tutorialsData from "@/content/tutorials.json";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

export type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  image_url: string | null;
  date: string;
  tag: string;
};

export default async function AppHomePage() {
  const supabase = await createClient();
  const firstTutorial = tutorialsData[0];

  const { data: rawReviews } = await supabase
    .from("reviews")
    .select("id, user_name, stars, description, pattern_label")
    .order("created_at", { ascending: false })
    .limit(10);

  const reviews = (rawReviews ?? []) as ReviewItem[];

  const { data: newsData } = await supabase
    .from("news")
    .select("id, slug, title, summary, body, image_url, date, tag")
    .order("date", { ascending: false })
    .limit(6);

  const news = (newsData ?? []) as NewsItem[];

  return (
    <div className="relative h-full w-full">
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

      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-3xl mx-auto px-8 py-10 flex flex-col gap-10">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold text-white leading-tight">Welcome back!</h1>
              <p className="text-[15px] text-white/70 mt-1">Ready to bring a new plushie to life?</p>
            </div>
            <Link
              href="/app/studio"
              className="shrink-0 px-6 py-2.5 rounded-[14px] bg-[var(--color-accent)] text-[var(--color-deep)] text-[14px] font-bold transition-all duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:bg-white hover:scale-105 active:scale-95"
            >
              Go to Studio
            </Link>
          </div>

          {reviews.length > 0 && (
            <section>
              <h2 className="text-[16px] font-bold text-white mb-4">What Others Are Saying</h2>
              <ReviewsCarousel reviews={reviews} />
            </section>
          )}

          {news.length > 0 && (
            <section id="whats-new">
              <h2 className="text-[16px] font-bold text-white mb-4">What&apos;s New</h2>
              <div className="grid grid-cols-3 gap-4">
                {news.map((item) => (
                  <NewsCard key={item.id} item={{
                    id: item.id,
                    title: item.title,
                    summary: item.summary,
                    body: item.body,
                    image: item.image_url ?? "/images/news/placeholder.png",
                    date: item.date,
                    tag: item.tag,
                  }} />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-[16px] font-bold text-white mb-4">Learn the Basics</h2>
            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex items-center gap-5">
              <div className="w-12 h-12 rounded-[14px] bg-white/15 flex items-center justify-center shrink-0">
                <GraduationCap size={24} className="text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-semibold text-white">New to crochet?</p>
                <p className="text-[13px] text-white/65 mt-0.5">
                  Start with the tutorials — {tutorialsData.length} technique guides from the magic ring to full assembly.
                </p>
              </div>
              <Link
                href={`/app/tutorials/${firstTutorial.slug}`}
                className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-[12px] bg-white text-[var(--color-brand)] text-[13px] font-semibold hover:bg-white/90 transition-colors"
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

- [ ] **Step 2: Verify build compiles**

```bash
npx tsc --noEmit
```

Expected: no errors

- [ ] **Step 3: Start dev server and verify home page still shows 3 news cards**

```bash
npm run dev
```

Open `http://localhost:3000/app` — news cards should appear as before.

- [ ] **Step 4: Commit**

```bash
git add "app/(app)/app/page.tsx"
git commit -m "feat: migrate home page news from json to supabase"
```

---

## Task 5: Admin layout and sidebar

**Files:**
- Create: `app/(admin)/layout.tsx`
- Create: `components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar component**

Create `components/admin/AdminSidebar.tsx`:

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Layers, Newspaper, Star, LogOut } from "lucide-react";
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
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Templates", href: "/admin/templates", icon: Layers },
  { label: "News", href: "/admin/news", icon: Newspaper },
  { label: "Reviews", href: "/admin/reviews", icon: Star },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <Sidebar>
      <SidebarHeader className="px-4 py-5">
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-bold text-ink">MyToys Crate</span>
          <span className="text-[11px] text-warm font-medium">Admin Panel</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
                const active = pathname === href || pathname.startsWith(href + "/");
                return (
                  <SidebarMenuItem key={href}>
                    <Link
                      href={href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-[10px] text-[13px] font-medium transition-colors ${
                        active
                          ? "bg-deep/10 text-deep font-semibold"
                          : "text-warm hover:bg-black/5 hover:text-ink"
                      }`}
                    >
                      <Icon size={16} />
                      {label}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 py-4 border-t border-border-soft">
        <div className="flex items-center justify-between">
          <Link href="/app" className="text-[12px] text-warm hover:text-ink transition-colors">
            ← Back to App
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[12px] text-warm hover:text-ink transition-colors cursor-pointer"
          >
            <LogOut size={13} />
            Sign out
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
```

- [ ] **Step 2: Create admin layout**

Create `app/(admin)/layout.tsx`:

```typescript
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 flex bg-white">
      <SidebarProvider>
        <AdminSidebar />
        <main className="flex-1 overflow-hidden p-2">
          <div
            className="relative h-full rounded-[16px] overflow-hidden bg-[#2a3f4f]"
          >
            <div className="absolute top-4.5 left-3 z-20">
              <SidebarTrigger className="text-white/70 hover:text-white hover:bg-white/15 rounded-[8px]" />
            </div>
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
```

- [ ] **Step 3: Create redirect page**

Create `app/(admin)/admin/page.tsx`:

```typescript
import { redirect } from "next/navigation";

export default function AdminRoot() {
  redirect("/admin/dashboard");
}
```

- [ ] **Step 4: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 5: Commit**

```bash
git add "app/(admin)/layout.tsx" "app/(admin)/admin/page.tsx" components/admin/AdminSidebar.tsx
git commit -m "feat: admin layout and sidebar"
```

---

## Task 6: Server actions

**Files:**
- Create: `app/(admin)/admin/actions.ts`

- [ ] **Step 1: Create actions file**

Create `app/(admin)/admin/actions.ts`:

```typescript
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = "ivo.pastin@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user?.email !== ADMIN_EMAIL) throw new Error("Unauthorized");
  return supabase;
}

// ─── Templates ───────────────────────────────────────────────

export async function addPlushieTemplate(data: {
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").insert({
    animal: data.animal,
    skill_level: data.skill_level,
    finished_size_small: data.finished_size_small,
    finished_size_medium: data.finished_size_medium,
    finished_size_large: data.finished_size_large,
    accent_colors: JSON.parse(data.accent_colors),
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function updatePlushieTemplate(id: string, data: {
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").update({
    animal: data.animal,
    skill_level: data.skill_level,
    finished_size_small: data.finished_size_small,
    finished_size_medium: data.finished_size_medium,
    finished_size_large: data.finished_size_large,
    accent_colors: JSON.parse(data.accent_colors),
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function deletePlushieTemplate(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function addAccessoryTemplate(data: {
  name: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").insert({
    name: data.name,
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function updateAccessoryTemplate(id: string, data: {
  name: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").update({
    name: data.name,
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function deleteAccessoryTemplate(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

// ─── News ────────────────────────────────────────────────────

export async function addNews(formData: FormData) {
  const supabase = await assertAdmin();

  let image_url: string | null = null;
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filename, file, { upsert: true });
    if (uploadError) return { error: uploadError.message };
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filename);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("news").insert({
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    body: formData.get("body") as string,
    tag: formData.get("tag") as string,
    date: formData.get("date") as string,
    image_url,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await assertAdmin();

  let image_url: string | null = formData.get("existing_image_url") as string | null;
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filename, file, { upsert: true });
    if (uploadError) return { error: uploadError.message };
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filename);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("news").update({
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    body: formData.get("body") as string,
    tag: formData.get("tag") as string,
    date: formData.get("date") as string,
    image_url,
  }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

export async function deleteNews(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

// ─── Reviews ─────────────────────────────────────────────────

export async function deleteReview(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  return { error: null };
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Commit**

```bash
git add "app/(admin)/admin/actions.ts"
git commit -m "feat: admin server actions for templates, news, reviews"
```

---

## Task 7: Dashboard page

**Files:**
- Create: `app/(admin)/admin/dashboard/page.tsx`

- [ ] **Step 1: Create dashboard page**

Create `app/(admin)/admin/dashboard/page.tsx`:

```typescript
import { createClient } from "@/lib/supabase/server";
import GrainientFade from "@/components/app/GrainientFade";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Users, FileText, Star, TrendingUp } from "lucide-react";

export const revalidate = 300;

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5 flex items-center gap-4">
      <div className="w-10 h-10 rounded-[12px] bg-white/15 flex items-center justify-center shrink-0">
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-[13px] text-white/60">{label}</p>
        <p className="text-[24px] font-bold text-white leading-tight">{value}</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: patternCount },
    { count: reviewCount },
    { data: reviewsForAvg },
    { data: profilesForChart },
    { data: reviewsForChart },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("patterns").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("stars"),
    supabase.from("profiles").select("created_at").order("created_at", { ascending: true }),
    supabase.from("reviews").select("created_at").order("created_at", { ascending: true }),
  ]);

  const avgRating = reviewsForAvg && reviewsForAvg.length > 0
    ? (reviewsForAvg.reduce((sum, r) => sum + (r.stars ?? 0), 0) / reviewsForAvg.length).toFixed(1)
    : "—";

  // Build last-30-days buckets
  const now = new Date();
  const days30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  function bucketByDay(rows: { created_at: string }[] | null) {
    const counts: Record<string, number> = {};
    days30.forEach((d) => (counts[d] = 0));
    (rows ?? []).forEach((r) => {
      const day = r.created_at.slice(0, 10);
      if (day in counts) counts[day]++;
    });
    return days30.map((d) => ({ date: d.slice(5), count: counts[d] }));
  }

  const userChartData = bucketByDay(profilesForChart);
  const reviewChartData = bucketByDay(reviewsForChart);

  const chartConfig = {
    count: { label: "Count", color: "rgba(255,255,255,0.7)" },
  };

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-8">
          <h1 className="text-[24px] font-bold text-white">Dashboard</h1>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Users" value={String(userCount ?? 0)} icon={Users} />
            <StatCard label="Total Patterns" value={String(patternCount ?? 0)} icon={FileText} />
            <StatCard label="Total Reviews" value={String(reviewCount ?? 0)} icon={Star} />
            <StatCard label="Avg Rating" value={`${avgRating} ★`} icon={TrendingUp} />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5">
              <p className="text-[14px] font-semibold text-white mb-4">New Users (30 days)</p>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <LineChart data={userChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="count" stroke="rgba(255,255,255,0.8)" strokeWidth={2} dot={false} />
                </LineChart>
              </ChartContainer>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 p-5">
              <p className="text-[14px] font-semibold text-white mb-4">Reviews (30 days)</p>
              <ChartContainer config={chartConfig} className="h-[180px] w-full">
                <BarChart data={reviewChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="rgba(255,255,255,0.5)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 3: Visit `/admin/dashboard` in browser and confirm stat cards and charts render**

- [ ] **Step 4: Commit**

```bash
git add "app/(admin)/admin/dashboard/page.tsx"
git commit -m "feat: admin dashboard with stat cards and charts"
```

---

## Task 8: Templates page

**Files:**
- Create: `app/(admin)/admin/templates/page.tsx`
- Create: `app/(admin)/admin/templates/TemplatesClient.tsx`

- [ ] **Step 1: Create the server page**

Create `app/(admin)/admin/templates/page.tsx`:

```typescript
import { createClient } from "@/lib/supabase/server";
import TemplatesClient from "./TemplatesClient";

export const revalidate = 0;

export default async function TemplatesPage() {
  const supabase = await createClient();

  const { data: plushieTemplates } = await supabase
    .from("pattern_templates")
    .select("*")
    .order("animal");

  const { data: accessoryTemplates } = await supabase
    .from("accessory_templates")
    .select("*")
    .order("name");

  return (
    <TemplatesClient
      plushieTemplates={plushieTemplates ?? []}
      accessoryTemplates={accessoryTemplates ?? []}
    />
  );
}
```

- [ ] **Step 2: Create the client component**

Create `app/(admin)/admin/templates/TemplatesClient.tsx`:

```typescript
"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Trash2, Pencil, Plus, X, Check } from "lucide-react";
import {
  addPlushieTemplate, updatePlushieTemplate, deletePlushieTemplate,
  addAccessoryTemplate, updateAccessoryTemplate, deleteAccessoryTemplate,
} from "../actions";

type PlushieTemplate = {
  id: string;
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: unknown;
  parts: unknown;
  assembly: unknown;
};

type AccessoryTemplate = {
  id: string;
  name: string;
  parts: unknown;
  assembly: unknown;
};

function JsonError({ text }: { text: string }) {
  try { JSON.parse(text); return null; } catch { return <p className="text-red-400 text-[11px] mt-0.5">Invalid JSON</p>; }
}

function PlushieForm({ initial, onSubmit, onCancel }: {
  initial?: PlushieTemplate;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    animal: initial?.animal ?? "",
    skill_level: initial?.skill_level ?? "beginner",
    finished_size_small: initial?.finished_size_small ?? "",
    finished_size_medium: initial?.finished_size_medium ?? "",
    finished_size_large: initial?.finished_size_large ?? "",
    accent_colors: initial ? JSON.stringify(initial.accent_colors, null, 2) : "[]",
    parts: initial ? JSON.stringify(initial.parts, null, 2) : "[]",
    assembly: initial ? JSON.stringify(initial.assembly, null, 2) : "[]",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try {
      JSON.parse(form.accent_colors);
      JSON.parse(form.parts);
      JSON.parse(form.assembly);
    } catch {
      setError("Fix JSON errors before saving");
      setLoading(false);
      return;
    }
    await onSubmit(form);
    setLoading(false);
  }

  const field = (key: keyof typeof form, label: string, textarea = false) => (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">{label}</label>
      {textarea ? (
        <>
          <textarea
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            rows={5}
            className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white font-mono focus:outline-none focus:border-white/40 resize-y"
          />
          <JsonError text={form[key]} />
        </>
      ) : (
        <input
          value={form[key]}
          onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
          className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40"
        />
      )}
    </div>
  );

  return (
    <div className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        {field("animal", "Animal")}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Skill Level</label>
          <select
            value={form.skill_level}
            onChange={(e) => setForm((f) => ({ ...f, skill_level: e.target.value }))}
            className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        {field("finished_size_small", "Size Small")}
        {field("finished_size_medium", "Size Medium")}
        {field("finished_size_large", "Size Large")}
      </div>
      {field("accent_colors", "Accent Colors (JSON)", true)}
      {field("parts", "Parts (JSON)", true)}
      {field("assembly", "Assembly (JSON)", true)}
      {error && <p className="text-red-400 text-[12px]">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white text-deep text-[12px] font-semibold hover:bg-white/90 disabled:opacity-50 cursor-pointer">
          <Check size={13} /> {loading ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 cursor-pointer">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

function AccessoryForm({ initial, onSubmit, onCancel }: {
  initial?: AccessoryTemplate;
  onSubmit: (data: Record<string, string>) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    parts: initial ? JSON.stringify(initial.parts, null, 2) : "[]",
    assembly: initial ? JSON.stringify(initial.assembly, null, 2) : "[]",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    try { JSON.parse(form.parts); JSON.parse(form.assembly); } catch {
      setError("Fix JSON errors before saving"); setLoading(false); return;
    }
    await onSubmit(form);
    setLoading(false);
  }

  return (
    <div className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Name (slug)</label>
        <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40" />
      </div>
      {["parts", "assembly"].map((key) => (
        <div key={key} className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">{key} (JSON)</label>
          <textarea value={form[key as "parts" | "assembly"]} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} rows={5} className="w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white font-mono focus:outline-none resize-y" />
          <JsonError text={form[key as "parts" | "assembly"]} />
        </div>
      ))}
      {error && <p className="text-red-400 text-[12px]">{error}</p>}
      <div className="flex gap-2 pt-1">
        <button onClick={handleSubmit} disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white text-deep text-[12px] font-semibold hover:bg-white/90 disabled:opacity-50 cursor-pointer">
          <Check size={13} /> {loading ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 cursor-pointer">
          <X size={13} /> Cancel
        </button>
      </div>
    </div>
  );
}

export default function TemplatesClient({ plushieTemplates, accessoryTemplates }: {
  plushieTemplates: PlushieTemplate[];
  accessoryTemplates: AccessoryTemplate[];
}) {
  const [tab, setTab] = useState<"plushie" | "accessory">("plushie");
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleAddPlushie(data: Record<string, string>) {
    await addPlushieTemplate(data as Parameters<typeof addPlushieTemplate>[0]);
    setAdding(false);
  }

  async function handleUpdatePlushie(id: string, data: Record<string, string>) {
    await updatePlushieTemplate(id, data as Parameters<typeof updatePlushieTemplate>[1]);
    setEditingId(null);
  }

  async function handleAddAccessory(data: Record<string, string>) {
    await addAccessoryTemplate(data as Parameters<typeof addAccessoryTemplate>[0]);
    setAdding(false);
  }

  async function handleUpdateAccessory(id: string, data: Record<string, string>) {
    await updateAccessoryTemplate(id, data as Parameters<typeof updateAccessoryTemplate>[1]);
    setEditingId(null);
  }

  async function handleDelete(type: "plushie" | "accessory", id: string) {
    if (type === "plushie") await deletePlushieTemplate(id);
    else await deleteAccessoryTemplate(id);
    setDeletingId(null);
  }

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-white">Templates</h1>
            <button onClick={() => { setAdding(true); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white text-deep text-[13px] font-semibold hover:bg-white/90 transition-colors cursor-pointer">
              <Plus size={14} /> Add New
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2">
            {(["plushie", "accessory"] as const).map((t) => (
              <button key={t} onClick={() => { setTab(t); setAdding(false); setEditingId(null); }}
                className={`px-4 py-1.5 rounded-full text-[12px] font-semibold transition-colors cursor-pointer ${tab === t ? "bg-white text-deep" : "bg-white/15 text-white/70 hover:bg-white/25"}`}>
                {t === "plushie" ? "Plushie" : "Accessory"}
              </button>
            ))}
          </div>

          {/* Add form */}
          {adding && tab === "plushie" && (
            <PlushieForm onSubmit={handleAddPlushie} onCancel={() => setAdding(false)} />
          )}
          {adding && tab === "accessory" && (
            <AccessoryForm onSubmit={handleAddAccessory} onCancel={() => setAdding(false)} />
          )}

          {/* List */}
          <div className="flex flex-col gap-3">
            {tab === "plushie" && plushieTemplates.map((t) => (
              <div key={t.id}>
                {editingId === t.id ? (
                  <PlushieForm initial={t} onSubmit={(d) => handleUpdatePlushie(t.id, d)} onCancel={() => setEditingId(null)} />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between">
                    <div>
                      <p className="text-[14px] font-semibold text-white capitalize">{t.animal}</p>
                      <p className="text-[12px] text-white/50">{t.skill_level} · S:{t.finished_size_small} M:{t.finished_size_medium} L:{t.finished_size_large}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === t.id ? (
                        <div className="flex gap-1 items-center">
                          <span className="text-[11px] text-white/60">Sure?</span>
                          <button onClick={() => handleDelete("plushie", t.id)} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {tab === "accessory" && accessoryTemplates.map((t) => (
              <div key={t.id}>
                {editingId === t.id ? (
                  <AccessoryForm initial={t} onSubmit={(d) => handleUpdateAccessory(t.id, d)} onCancel={() => setEditingId(null)} />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between">
                    <p className="text-[14px] font-semibold text-white capitalize">{t.name}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === t.id ? (
                        <div className="flex gap-1 items-center">
                          <span className="text-[11px] text-white/60">Sure?</span>
                          <button onClick={() => handleDelete("accessory", t.id)} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(t.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add "app/(admin)/admin/templates/page.tsx" "app/(admin)/admin/templates/TemplatesClient.tsx"
git commit -m "feat: admin templates manager"
```

---

## Task 9: News page

**Files:**
- Create: `app/(admin)/admin/news/page.tsx`
- Create: `app/(admin)/admin/news/NewsClient.tsx`

- [ ] **Step 1: Create the server page**

Create `app/(admin)/admin/news/page.tsx`:

```typescript
import { createClient } from "@/lib/supabase/server";
import NewsClient from "./NewsClient";

export const revalidate = 0;

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  return <NewsClient items={data ?? []} />;
}
```

- [ ] **Step 2: Create the client component**

Create `app/(admin)/admin/news/NewsClient.tsx`:

```typescript
"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { addNews, updateNews, deleteNews } from "../actions";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  body: string;
  image_url: string | null;
  date: string;
  tag: string;
};

function NewsForm({ initial, onSubmit, onCancel }: {
  initial?: NewsItem;
  onSubmit: (formData: FormData) => Promise<void>;
  onCancel: () => void;
}) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (initial) formData.append("existing_image_url", initial.image_url ?? "");
    await onSubmit(formData);
    setLoading(false);
  }

  const inputClass = "w-full bg-white/10 border border-white/20 rounded-[8px] px-3 py-2 text-[12px] text-white focus:outline-none focus:border-white/40 placeholder:text-white/30";

  return (
    <form onSubmit={handleSubmit} className="bg-white/10 border border-white/20 rounded-[14px] p-5 flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Title</label>
          <input name="title" defaultValue={initial?.title} required className={inputClass} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Slug</label>
          <input name="slug" defaultValue={initial?.slug} required className={inputClass} placeholder="e.g. new-fox-pattern" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Tag</label>
          <input name="tag" defaultValue={initial?.tag} required className={inputClass} placeholder="New Pattern" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Date</label>
          <input name="date" type="date" defaultValue={initial?.date} required className={inputClass} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Summary</label>
        <textarea name="summary" defaultValue={initial?.summary} required rows={2} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Body</label>
        <textarea name="body" defaultValue={initial?.body} required rows={6} className={inputClass} />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[11px] font-semibold text-white/60 uppercase tracking-wider">Image</label>
        {initial?.image_url && <p className="text-[11px] text-white/40 mb-1">Current: {initial.image_url}</p>}
        <input name="image" type="file" accept="image/*" className="text-[12px] text-white/70 file:mr-3 file:px-3 file:py-1.5 file:rounded-[6px] file:bg-white/15 file:text-white file:text-[11px] file:border-0 file:cursor-pointer" />
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={loading} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white text-deep text-[12px] font-semibold hover:bg-white/90 disabled:opacity-50 cursor-pointer">
          <Check size={13} /> {loading ? "Saving…" : "Save"}
        </button>
        <button type="button" onClick={onCancel} className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] bg-white/15 text-white text-[12px] font-semibold hover:bg-white/25 cursor-pointer">
          <X size={13} /> Cancel
        </button>
      </div>
    </form>
  );
}

export default function NewsClient({ items }: { items: NewsItem[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-[24px] font-bold text-white">News</h1>
            <button onClick={() => { setAdding(true); setEditingId(null); }} className="flex items-center gap-2 px-4 py-2 rounded-[10px] bg-white text-deep text-[13px] font-semibold hover:bg-white/90 cursor-pointer">
              <Plus size={14} /> Add News
            </button>
          </div>

          {adding && (
            <NewsForm
              onSubmit={async (fd) => { await addNews(fd); setAdding(false); }}
              onCancel={() => setAdding(false)}
            />
          )}

          <div className="flex flex-col gap-3">
            {items.map((item) => (
              <div key={item.id}>
                {editingId === item.id ? (
                  <NewsForm
                    initial={item}
                    onSubmit={async (fd) => { await updateNews(item.id, fd); setEditingId(null); }}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="bg-white/10 border border-white/20 rounded-[14px] p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">{item.tag}</span>
                        <span className="text-[11px] text-white/40">{item.date}</span>
                      </div>
                      <p className="text-[14px] font-semibold text-white truncate">{item.title}</p>
                      <p className="text-[12px] text-white/50 truncate">{item.summary}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => setEditingId(item.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-white/20 text-white cursor-pointer"><Pencil size={13} /></button>
                      {deletingId === item.id ? (
                        <div className="flex gap-1 items-center">
                          <span className="text-[11px] text-white/60">Sure?</span>
                          <button onClick={async () => { await deleteNews(item.id); setDeletingId(null); }} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Yes</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">No</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(item.id)} className="p-2 rounded-[8px] bg-white/10 hover:bg-red-500/30 text-white cursor-pointer"><Trash2 size={13} /></button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add "app/(admin)/admin/news/page.tsx" "app/(admin)/admin/news/NewsClient.tsx"
git commit -m "feat: admin news manager with image upload"
```

---

## Task 10: Reviews page

**Files:**
- Create: `app/(admin)/admin/reviews/page.tsx`
- Create: `app/(admin)/admin/reviews/ReviewsClient.tsx`

- [ ] **Step 1: Create the server page**

Create `app/(admin)/admin/reviews/page.tsx`:

```typescript
import { createClient } from "@/lib/supabase/server";
import ReviewsClient from "./ReviewsClient";

export const revalidate = 0;

export default async function AdminReviewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, user_name, stars, description, pattern_label, created_at")
    .order("created_at", { ascending: false });

  return <ReviewsClient reviews={data ?? []} />;
}
```

- [ ] **Step 2: Create the client component**

Create `app/(admin)/admin/reviews/ReviewsClient.tsx`:

```typescript
"use client";

import { useState } from "react";
import GrainientFade from "@/components/app/GrainientFade";
import { Star, Trash2 } from "lucide-react";
import { deleteReview } from "../actions";

type Review = {
  id: string;
  user_name: string;
  stars: number;
  description: string;
  pattern_label: string | null;
  created_at: string;
};

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={11} fill={s <= stars ? "#c9a96e" : "none"} stroke={s <= stars ? "#c9a96e" : "rgba(255,255,255,0.25)"} />
      ))}
    </div>
  );
}

export default function ReviewsClient({ reviews }: { reviews: Review[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  return (
    <div className="relative h-full w-full">
      <GrainientFade color1="#417c9c" color2="#716458" color3="#591427" timeSpeed={0.2} warpStrength={0.8} warpFrequency={4} warpSpeed={1.5} warpAmplitude={40} blendAngle={30} blendSoftness={0.1} rotationAmount={300} noiseScale={2} grainAmount={0.08} grainScale={2} contrast={1.2} saturation={0.9} zoom={0.9} />
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto px-8 py-10 flex flex-col gap-6">
          <h1 className="text-[24px] font-bold text-white">Reviews <span className="text-white/40 font-normal text-[18px]">({reviews.length})</span></h1>

          <div className="bg-white/10 border border-white/20 rounded-[16px] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {["User", "Stars", "Description", "Pattern", "Date", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[11px] font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 text-[12px] font-semibold text-white">{r.user_name}</td>
                    <td className="px-4 py-3"><StarRow stars={r.stars} /></td>
                    <td className="px-4 py-3 text-[12px] text-white/70 max-w-[220px]">
                      <span title={r.description}>{r.description.length > 80 ? r.description.slice(0, 80) + "…" : r.description}</span>
                    </td>
                    <td className="px-4 py-3 text-[12px] text-white/50">{r.pattern_label ?? "—"}</td>
                    <td className="px-4 py-3 text-[11px] text-white/40 whitespace-nowrap">{new Date(r.created_at).toLocaleDateString("en-GB")}</td>
                    <td className="px-4 py-3">
                      {deletingId === r.id ? (
                        <div className="flex gap-1 items-center">
                          <button onClick={async () => { await deleteReview(r.id); setDeletingId(null); }} className="px-2 py-1 rounded-[6px] bg-red-500/80 text-white text-[11px] font-semibold cursor-pointer">Delete</button>
                          <button onClick={() => setDeletingId(null)} className="px-2 py-1 rounded-[6px] bg-white/15 text-white text-[11px] cursor-pointer">Cancel</button>
                        </div>
                      ) : (
                        <button onClick={() => setDeletingId(r.id)} className="p-1.5 rounded-[6px] text-white/40 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer">
                          <Trash2 size={13} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {reviews.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-white/40">No reviews yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Verify it compiles**

```bash
npx tsc --noEmit
```

- [ ] **Step 4: Commit**

```bash
git add "app/(admin)/admin/reviews/page.tsx" "app/(admin)/admin/reviews/ReviewsClient.tsx"
git commit -m "feat: admin reviews table with delete"
```

---

## Task 11: Final verification

- [ ] **Step 1: Full build check**

```bash
npm run build
```

Expected: no errors

- [ ] **Step 2: Manual smoke test**

1. Visit `http://localhost:3000/admin` — should redirect to `/admin/dashboard`
2. Confirm stat cards show real numbers
3. Confirm charts render (may be empty bars/lines if few data points)
4. Visit `/admin/templates` — confirm plushie and accessory lists load, add/edit/delete work
5. Visit `/admin/news` — confirm 3 seeded news items appear, add/edit/delete work
6. Visit `/admin/reviews` — confirm all reviews show, delete works
7. Visit `http://localhost:3000/app` — confirm news section still shows 3 cards from DB
8. Test in incognito (not logged in as admin) — `/admin` should redirect to `/app`

- [ ] **Step 3: Push to Vercel**

```bash
git push
```

Confirm Vercel deploys successfully and `/admin` works on production.
