"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function toggleFavourite(
  patternId: string,
  isFavourite: boolean
): Promise<void> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("patterns")
    .update({ is_favourite: isFavourite })
    .eq("id", patternId)
    .eq("user_id", user.id);

  if (error) throw new Error("Failed to update favourite");
}

export async function submitReview(
  stars: number,
  description: string,
  patternLabel: string | null
): Promise<{ error?: string }> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) return { error: "Not authenticated" };

  const today = new Date().toISOString().slice(0, 10);
  const { count } = await supabase
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("created_at", `${today}T00:00:00Z`)
    .lte("created_at", `${today}T23:59:59Z`);

  if ((count ?? 0) > 0) {
    return { error: "You already left a review today. Come back tomorrow!" };
  }

  const userName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split("@")[0] ??
    "Anonymous";

  const { error: insertError } = await supabase.from("reviews").insert({
    user_id: user.id,
    user_name: userName,
    stars,
    description,
    pattern_label: patternLabel,
  });

  if (insertError) return { error: "Failed to save review" };

  revalidatePath("/app", "layout");
  return {};
}
