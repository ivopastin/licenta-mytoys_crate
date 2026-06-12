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
