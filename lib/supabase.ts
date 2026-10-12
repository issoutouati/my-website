// lib/supabase.ts
import { createClient } from "@supabase/supabase-js";

/**
 * Reads config from environment variables in production, falling back to the
 * project's known values for local/dev. Either a NEW publishable key
 * (sb_publishable_...) or a LEGACY anon JWT works here — set
 * NEXT_PUBLIC_SUPABASE_ANON_KEY to switch without touching code.
 *
 * If orders/newsletter ever fail with "Invalid API key", the most common cause
 * is an outdated @supabase/supabase-js that doesn't understand the new key
 * format — upgrade it, or drop in the legacy anon key via env.
 */
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://meuirbfzmiogxjkeavnm.supabase.co";

const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1ldWlyYmZ6bWlvZ3hqa2Vhdm5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTQ1MTUsImV4cCI6MjA5NjU5MDUxNX0.IxZBXtu19PK9l2qK7YIEuZ3B-OVpkyy8YP514B-GRq4";""
  "sb_publishable_DmmQNb0Aq5LcfBNZlVNXhA_WEnZPKMC";

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "[supabase] Missing config. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);