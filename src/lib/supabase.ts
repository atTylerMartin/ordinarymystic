import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is configured. When the env vars are missing (e.g. a
 * preview build without secrets) we degrade gracefully instead of throwing.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

/**
 * Anonymous, server-side Supabase client. Relies on Row Level Security:
 * the public may insert pending reviews and read approved ones. No user
 * session is persisted — this is used from server components / actions only.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
