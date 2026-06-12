import { createClient } from "@/lib/supabase/server";
import NewsClient from "./NewsClient";

export const revalidate = 0;

export default async function AdminNewsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  return <NewsClient items={data ?? []} />;
}
