import { createClient } from "@supabase/supabase-js";

// Admin client using the service role key — BYPASSES Row Level Security.
// Use ONLY on server-side admin pages that need global data (e.g. dashboard stats).
// The service role key is server-only and must never reach the browser.
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}
