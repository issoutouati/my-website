// lib/newsletter.ts
import { supabase } from "../lib/supabase";

/** Returns "ok" for a new subscriber, "exists" if already subscribed. */
export async function subscribe(email: string): Promise<"ok" | "exists"> {
  const { error } = await supabase
    .from("subscribers")
    .insert({ email: email.trim().toLowerCase() });

  if (error) {
    if (error.code === "23505") return "exists"; // unique_violation → already subscribed
    console.error("[newsletter] insert failed", {
      code: error.code,
      message: error.message,
      details: (error as { details?: string }).details,
      hint: (error as { hint?: string }).hint,
    });
    throw new Error(error.message);
  }
  return "ok";
}