import { createClient } from "@/lib/supabase/server";
import TemplatesClient from "./TemplatesClient";

export const revalidate = 0;

export default async function TemplatesPage() {
  const supabase = await createClient();

  const { data: plushieTemplates } = await supabase
    .from("pattern_templates")
    .select("*")
    .order("animal");

  const { data: accessoryTemplates } = await supabase
    .from("accessory_templates")
    .select("*")
    .order("name");

  return (
    <TemplatesClient
      plushieTemplates={plushieTemplates ?? []}
      accessoryTemplates={accessoryTemplates ?? []}
    />
  );
}
