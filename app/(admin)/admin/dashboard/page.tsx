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

          <div className="grid grid-cols-4 gap-4">
            <StatCard label="Total Users" value={String(userCount ?? 0)} icon={Users} />
            <StatCard label="Total Patterns" value={String(patternCount ?? 0)} icon={FileText} />
            <StatCard label="Total Reviews" value={String(reviewCount ?? 0)} icon={Star} />
            <StatCard label="Avg Rating" value={`${avgRating} ★`} icon={TrendingUp} />
          </div>

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
