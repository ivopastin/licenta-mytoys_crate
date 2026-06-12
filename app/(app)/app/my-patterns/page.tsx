import { createClient } from "@/lib/supabase/server";
import GrainientFade from "@/components/app/GrainientFade";
import MyPatternsClient from "@/components/app/my-patterns/MyPatternsClient";
import type { PatternRow } from "@/components/app/my-patterns/PatternCard";

export default async function MyPatternsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let patterns: PatternRow[] = [];

  if (user) {
    const { data } = await supabase
      .from("patterns")
      .select("id, name, animal, size, color, color_name, accessory, accessory_color, skill_level, is_favourite, pattern_data")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    patterns = (data ?? []) as PatternRow[];
  }

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


      <div className="relative z-10 h-full flex flex-col px-20 py-8">
        <h1 className="text-[24px] font-bold text-white shrink-0 mb-6">My Patterns</h1>
        <MyPatternsClient initialPatterns={patterns} />
      </div>
    </div>
  );
}
