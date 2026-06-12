"use client";

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
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";
import { Star } from "lucide-react";

type ChartData = { date: string; count: number }[];
type StarDist = { star: string; count: number }[];
type RecentReview = { user_name: string; stars: number; description: string; created_at: string };

const chartConfig = {
  count: { label: "Count", color: "rgba(255,255,255,0.7)" },
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-[13px] font-semibold text-white/50 uppercase tracking-widest mb-4">{children}</p>;
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-[20px] border border-white/15 p-5 ${className}`}>
      {children}
    </div>
  );
}

function StarRow({ stars }: { stars: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={10} fill={s <= stars ? "#c9a96e" : "none"} stroke={s <= stars ? "#c9a96e" : "rgba(255,255,255,0.2)"} />
      ))}
    </div>
  );
}

export default function DashboardCharts({
  userChartData,
  reviewChartData,
  patternChartData,
  starDist,
  recentReviews,
}: {
  userChartData: ChartData;
  reviewChartData: ChartData;
  patternChartData: ChartData;
  starDist: StarDist;
  recentReviews: RecentReview[];
}) {
  const maxStarCount = Math.max(...starDist.map((s) => s.count), 1);

  return (
    <div className="flex flex-col gap-6">
      {/* Full-width area chart: new users */}
      <div>
        <SectionTitle>New Users — Last 30 Days</SectionTitle>
        <Card>
          <ChartContainer config={chartConfig} className="h-[200px] w-full">
            <AreaChart data={userChartData}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="rgba(255,255,255,0.3)" stopOpacity={1} />
                  <stop offset="95%" stopColor="rgba(255,255,255,0)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
              <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} width={24} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Area type="monotone" dataKey="count" stroke="rgba(255,255,255,0.8)" strokeWidth={2} fill="url(#userGrad)" dot={false} />
            </AreaChart>
          </ChartContainer>
        </Card>
      </div>

      {/* Two side-by-side: reviews over time + patterns over time */}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <SectionTitle>Reviews — Last 30 Days</SectionTitle>
          <Card>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <BarChart data={reviewChartData} barSize={6}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} width={20} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="count" fill="rgba(201,169,110,0.7)" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </Card>
        </div>

        <div>
          <SectionTitle>Patterns Created — Last 30 Days</SectionTitle>
          <Card>
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <LineChart data={patternChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis dataKey="date" tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} interval={6} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.35)", fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} width={20} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="rgba(150,200,255,0.8)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </Card>
        </div>
      </div>

      {/* Bottom row: star distribution + recent reviews */}
      <div className="grid grid-cols-5 gap-5">
        {/* Star distribution — 2 cols */}
        <div className="col-span-2">
          <SectionTitle>Rating Breakdown</SectionTitle>
          <Card className="flex flex-col gap-3">
            {starDist.map(({ star, count }) => (
              <div key={star} className="flex items-center gap-3">
                <span className="text-[12px] text-white/60 w-6 shrink-0">{star}</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-[#c9a96e] transition-all"
                    style={{ width: `${maxStarCount === 0 ? 0 : (count / maxStarCount) * 100}%` }}
                  />
                </div>
                <span className="text-[12px] text-white/40 w-6 text-right shrink-0">{count}</span>
              </div>
            ))}
          </Card>
        </div>

        {/* Recent reviews — 3 cols */}
        <div className="col-span-3">
          <SectionTitle>Recent Reviews</SectionTitle>
          <Card className="flex flex-col gap-3">
            {recentReviews.length === 0 && (
              <p className="text-[12px] text-white/30 text-center py-4">No reviews yet</p>
            )}
            {recentReviews.map((r, i) => (
              <div key={i} className="flex gap-3 items-start border-b border-white/8 last:border-0 pb-3 last:pb-0">
                <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center shrink-0 text-[11px] font-bold text-white">
                  {r.user_name?.[0]?.toUpperCase() ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[12px] font-semibold text-white">{r.user_name}</span>
                    <span className="text-[10px] text-white/30">{new Date(r.created_at).toLocaleDateString("en-GB")}</span>
                  </div>
                  <StarRow stars={r.stars} />
                  <p className="text-[11px] text-white/50 mt-1 truncate">{r.description}</p>
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
