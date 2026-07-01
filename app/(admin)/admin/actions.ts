"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function assertAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  // Fail safe: if ADMIN_EMAIL is unset, no user can match → access denied.
  if (!ADMIN_EMAIL || user?.email !== ADMIN_EMAIL) throw new Error("Unauthorized");
  return supabase;
}

// ─── Templates ───────────────────────────────────────────────

export async function addPlushieTemplate(data: {
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").insert({
    animal: data.animal,
    skill_level: data.skill_level,
    finished_size_small: data.finished_size_small,
    finished_size_medium: data.finished_size_medium,
    finished_size_large: data.finished_size_large,
    accent_colors: JSON.parse(data.accent_colors),
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function updatePlushieTemplate(id: string, data: {
  animal: string;
  skill_level: string;
  finished_size_small: string;
  finished_size_medium: string;
  finished_size_large: string;
  accent_colors: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").update({
    animal: data.animal,
    skill_level: data.skill_level,
    finished_size_small: data.finished_size_small,
    finished_size_medium: data.finished_size_medium,
    finished_size_large: data.finished_size_large,
    accent_colors: JSON.parse(data.accent_colors),
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function deletePlushieTemplate(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("pattern_templates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function addAccessoryTemplate(data: {
  name: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").insert({
    name: data.name,
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  });
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function updateAccessoryTemplate(id: string, data: {
  name: string;
  parts: string;
  assembly: string;
}) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").update({
    name: data.name,
    parts: JSON.parse(data.parts),
    assembly: JSON.parse(data.assembly),
  }).eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

export async function deleteAccessoryTemplate(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("accessory_templates").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/templates");
  return { error: null };
}

// ─── News ────────────────────────────────────────────────────

export async function addNews(formData: FormData) {
  const supabase = await assertAdmin();

  let image_url: string | null = null;
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filename, file, { upsert: true });
    if (uploadError) return { error: uploadError.message };
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filename);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("news").insert({
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    body: formData.get("body") as string,
    tag: formData.get("tag") as string,
    date: formData.get("date") as string,
    image_url,
  });

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

export async function updateNews(id: string, formData: FormData) {
  const supabase = await assertAdmin();

  let image_url: string | null = formData.get("existing_image_url") as string | null;
  const file = formData.get("image") as File | null;

  if (file && file.size > 0) {
    const ext = file.name.split(".").pop();
    const filename = `${Date.now()}.${ext}`;
    const { error: uploadError } = await supabase.storage
      .from("news-images")
      .upload(filename, file, { upsert: true });
    if (uploadError) return { error: uploadError.message };
    const { data: urlData } = supabase.storage.from("news-images").getPublicUrl(filename);
    image_url = urlData.publicUrl;
  }

  const { error } = await supabase.from("news").update({
    slug: formData.get("slug") as string,
    title: formData.get("title") as string,
    summary: formData.get("summary") as string,
    body: formData.get("body") as string,
    tag: formData.get("tag") as string,
    date: formData.get("date") as string,
    image_url,
  }).eq("id", id);

  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

export async function deleteNews(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/news");
  revalidatePath("/app");
  return { error: null };
}

// ─── Reviews ─────────────────────────────────────────────────

export async function deleteReview(id: string) {
  const supabase = await assertAdmin();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  return { error: null };
}
