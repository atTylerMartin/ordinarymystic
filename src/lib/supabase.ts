import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Whether Supabase is configured. When the env vars are missing (e.g. a
 * preview build without secrets) we degrade gracefully instead of throwing.
 */
export const isSupabaseConfigured = Boolean(url && anonKey);

let client: SupabaseClient | null = null;

/**
 * Supabase client (publishable key → anon role). This site is a static export,
 * so the browser talks to Supabase directly. Row Level Security lets the public
 * insert pending reviews and read approved ones; an authenticated admin can
 * read all reviews and change their status. Sessions persist so the admin stays
 * logged in. Memoized to a single instance to avoid the "Multiple GoTrueClient
 * instances" warning.
 */
export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true },
    });
  }
  return client;
}
