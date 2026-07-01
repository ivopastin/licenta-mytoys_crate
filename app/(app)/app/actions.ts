"use server";

import { Resend } from "resend";
import { createClient } from "@/lib/supabase/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendSupportEmail(formData: {
  subject: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Not authenticated." };

  const { subject, message } = formData;

  if (!subject.trim() || !message.trim()) {
    return { success: false, error: "Subject and message are required." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail) {
    return { success: false, error: "Support is temporarily unavailable." };
  }

  const { error } = await resend.emails.send({
    from: "MyToys Crate <hello@mytoys-crate.com>",
    to: adminEmail,
    replyTo: user.email!,
    subject: `[Support] ${subject}`,
    text: `New support request from ${user.email}\n\n${message}`,
  });

  if (error) return { success: false, error: error.message };
  return { success: true };
}
