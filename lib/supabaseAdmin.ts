// lib/supabaseAdmin.ts
// SERVER-ONLY. Never import this in a client component. Uses the service-role
// key (full DB access, bypasses RLS) and must only run inside API routes.
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "Supabase admin not configured: set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY (server env)."
    );
  }
  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}