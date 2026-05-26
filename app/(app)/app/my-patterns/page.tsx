import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import GrainientFade from "../components/GrainientFade";
import FavouritesPanel from "./FavouritesPanel";
import PatternsGrid from "./PatternsGrid";
import type { PatternRow } from "./PatternCard";

export default async function MyPatternsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let patterns: PatternRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("patterns")
      .select("id, name, animal, size, color_name, skill_level, is_favourite, pattern_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    patterns = (data ?? []) as PatternRow[];
  }

  const favourites = patterns.filter((p) => p.is_favourite);

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* Background */}
      <GrainientFade
        color1="#417c9c"
        color2="#2d5f7a"
        color3="#5a8fa8"
        timeSpeed={0.15}
        warpStrength={0.7}
        warpFrequency={3}
        warpSpeed={1.5}
        warpAmplitude={35}
        blendAngle={60}
        blendSoftness={0.1}
        rotationAmount={250}
        noiseScale={2}
        grainAmount={0.08}
        grainScale={2}
        contrast={1.2}
        saturation={0.85}
        zoom={0.9}
      />

      {/* Texture overlay */}
      <div className="absolute inset-0 pointer-events-none z-[1]">
        <Image
          src="/images/textures/app/wall.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.12] mix-blend-overlay"
        />
      </div>

      <div className="relative z-10 h-full flex flex-col px-8 py-8">
        {/* Page title */}
        <h1 className="text-[24px] font-bold text-white shrink-0 mb-6">My Patterns</h1>

        {patterns.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-white/15 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 2h9l5 5v15a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2v6h6M9 13h6M9 17h4"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-[26px] font-bold text-white">No patterns yet</p>
            <p className="text-[15px] text-white/70 font-medium leading-relaxed max-w-[320px]">
              Your saved patterns will appear here. Head to the Studio to design your first plushie.
            </p>
            <Link
              href="/app/studio"
              className="mt-2 px-6 py-2.5 rounded-[12px] bg-white text-deep text-[14px] font-bold hover:bg-white/90 transition-colors"
            >
              Go to Studio
            </Link>
          </div>
        ) : (
          /* ── Two-column split ── */
          <div className="flex-1 min-h-0 flex gap-6">
            {/* Left — Favourites (1/3), scrollable */}
            {favourites.length > 0 && (
              <div className="w-[32%] shrink-0 flex flex-col min-h-0">
                <FavouritesPanel patterns={favourites} />
              </div>
            )}

            {/* Right — All patterns (sticky, viewport-fit) */}
            <div className={`flex flex-col min-h-0 ${favourites.length > 0 ? "flex-1" : "w-full"}`}>
              <PatternsGrid patterns={patterns} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
