"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildPatternData } from "@/lib/pattern/buildPatternData";
import type { PlushieConfig } from "./types";
import type { PatternData, PatternPart } from "@/lib/pattern/types";

type TemplateRow = {
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: Record<string, string>;
  parts: PatternPart[];
  assembly: { step: string }[];
};

export async function generatePattern(
  config: PlushieConfig
): Promise<{ patternId: string; patternData: PatternData }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Not authenticated");
  }

  const { data: template, error: templateError } = await supabase
    .from("pattern_templates")
    .select(
      "skill_level, finished_size_small, finished_size_medium, finished_size_large, accent_colors, parts, assembly"
    )
    .eq("animal", config.animal)
    .single<TemplateRow>();

  if (templateError || !template) {
    throw new Error(`Template not found for animal: ${config.animal}`);
  }

  const patternData = buildPatternData(template, config);

  const { data: inserted, error: insertError } = await supabase
    .from("patterns")
    .insert({
      user_id: user.id,
      name: config.name ?? "My Plushie",
      animal: config.animal,
      size: config.size,
      color: config.color,
      color_name: patternData.materials.yarn[0]?.colorName ?? "Custom",
      eyes: config.eyes,
      accessory: config.accessory ?? null,
      accessory_color: config.accessoryColor ?? null,
      skill_level: patternData.skillLevel,
      pattern_data: patternData,
      is_favourite: false,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    throw new Error("Failed to save pattern");
  }

  // Invalidate the app layout so the sidebar re-fetches recent patterns
  revalidatePath("/app", "layout");

  return { patternId: inserted.id, patternData };
}
