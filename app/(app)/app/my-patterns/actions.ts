"use server";

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
