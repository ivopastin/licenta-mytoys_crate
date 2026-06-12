"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { buildPatternData } from "@/lib/pattern/buildPatternData";
import type { PlushieConfig } from "@/components/app/studio/types";
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

  let patternData: PatternData;

  if (config.mode === "accessory") {
    // Accessory-only: no animal template needed
    if (!config.accessory) throw new Error("No accessory selected");

    const { data: accessoryTemplate, error: accError } = await supabase
      .from("accessory_templates")
      .select("name, parts, assembly")
      .eq("slug", config.accessory)
      .single<{ name: string; parts: PatternPart[]; assembly: { step: string }[] }>();

    if (accError || !accessoryTemplate) {
      throw new Error(`Accessory template not found: ${config.accessory}`);
    }

    patternData = {
      plushieName: config.name ?? "My Accessory",
      animal: "",
      size: config.size ?? "medium",
      skillLevel: "beginner",
      finishedSize: "",
      materials: {
        yarn: [],
        hook: "",
        eyes: null,
        other: ["Yarn needle"],
      },
      abbreviations: [],
      notes: [],
      parts: [],
      assembly: [],
      accessoryName: accessoryTemplate.name,
      accessoryParts: accessoryTemplate.parts,
      accessoryAssembly: accessoryTemplate.assembly,
    };
  } else {
    // Plushie or Both: fetch animal template
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

    patternData = buildPatternData(template, config);

    // Attach accessory if mode is "both"
    if (config.accessory && config.mode === "both") {
      const { data: accessoryTemplate } = await supabase
        .from("accessory_templates")
        .select("name, parts, assembly")
        .eq("slug", config.accessory)
        .single<{ name: string; parts: PatternPart[]; assembly: { step: string }[] }>();

      if (accessoryTemplate) {
        patternData.accessoryName = accessoryTemplate.name;
        patternData.accessoryParts = accessoryTemplate.parts;
        patternData.accessoryAssembly = accessoryTemplate.assembly;
      }
    }
  }

  const { data: inserted, error: insertError } = await supabase
    .from("patterns")
    .insert({
      user_id: user.id,
      name: config.name ?? "My Accessory",
      animal: config.animal ?? null,
      size: config.size ?? null,
      color: config.color ?? null,
      color_name: patternData.materials.yarn[0]?.colorName ?? null,
      eyes: config.eyes ?? null,
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
