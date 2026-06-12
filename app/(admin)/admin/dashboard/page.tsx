import { createClient } from "@/lib/supabase/server";
import GrainientFade from "@/components/app/GrainientFade";
import DashboardCharts from "./DashboardCharts";
import { Users, FileText, Star, TrendingUp, Newspaper } from "lucide-react";

export const revalidate = 300;

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-[16px] border border-white/20 px-4 py-3 flex justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-white/50 truncate">
          {label}
        </p>
        <p className="text-[22px] font-bold text-white leading-tight">
          {value}
        </p>
        {sub && <p className="text-[10px] text-white/35 truncate">{sub}</p>}
      </div>
      <div className="w-8 h-8 rounded-[9px] bg-white/15 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-white/80" />
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
    { count: newsCount },
    { data: reviewsForAvg },
    { data: profilesForChart },
    { data: reviewsForChart },
    { data: recentReviews },
    { data: patternsForChart },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("patterns").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("news").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("stars"),
    supabase
      .from("profiles")
      .select("created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("reviews")
      .select("created_at")
      .order("created_at", { ascending: true }),
    supabase
      .from("reviews")
      .select("user_name, stars, description, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("patterns")
      .select("created_at")
      .order("created_at", { ascending: true }),
  ]);

  const avgRating =
    reviewsForAvg && reviewsForAvg.length > 0
      ? (
          reviewsForAvg.reduce((sum, r) => sum + (r.stars ?? 0), 0) /
          reviewsForAvg.length
        ).toFixed(1)
      : "—";

  // Star distribution
  const starDist = [5, 4, 3, 2, 1].map((s) => ({
    star: `${s}★`,
    count: (reviewsForAvg ?? []).filter((r) => r.stars === s).length,
  }));

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
  const patternChartData = bucketByDay(patternsForChart);

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
        <div className="max-w-5xl mx-auto px-8 py-10 flex flex-col gap-8">
          <div className="flex items-baseline gap-3">
            <h1 className="text-[28px] font-bold text-white">Dashboard</h1>
            <p className="text-[13px] text-white/40">Overview of your store</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-5 gap-3">
            <StatCard
              label="Users"
              value={String(userCount ?? 0)}
              icon={Users}
              sub="total registered"
            />
            <StatCard
              label="Patterns"
              value={String(patternCount ?? 0)}
              icon={FileText}
              sub="created"
            />
            <StatCard
              label="Reviews"
              value={String(reviewCount ?? 0)}
              icon={Star}
              sub="submitted"
            />
            <StatCard
              label="Avg Rating"
              value={avgRating === "—" ? "—" : `${avgRating}`}
              icon={TrendingUp}
              sub="out of 5 stars"
            />
            <StatCard
              label="News Items"
              value={String(newsCount ?? 0)}
              icon={Newspaper}
              sub="published"
            />
          </div>

          <DashboardCharts
            userChartData={userChartData}
            reviewChartData={reviewChartData}
            patternChartData={patternChartData}
            starDist={starDist}
            recentReviews={recentReviews ?? []}
          />
        </div>
      </div>
    </div>
  );
}
