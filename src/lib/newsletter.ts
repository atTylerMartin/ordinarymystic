import { attributionSource, readAttribution } from "@/lib/attribution";
import { getSupabase } from "@/lib/supabase";

export type SubscribeResult = "ok" | "duplicate" | "error";

const MAX_EMAIL = 254;
const MAX_FIRST_NAME = 80;
// Deliberately loose: the real check is the confirmation email. This only
// catches typos before a round trip.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** What brought the visitor here, from first-touch attribution. */
export function signupContext(): { source: string; campaign: string; landing: string } {
  const record = readAttribution();
  const landing =
    record?.landing ?? (typeof window !== "undefined" ? window.location.pathname : "");
  return {
    source: attributionSource(),
    campaign: record?.utm_campaign ?? "",
    landing,
  };
}

/**
 * Add an address to the list: one insert into `public.subscribers` with the
 * publishable key (insert-only RLS; see `supabase/subscribers.sql`). A
 * Database Webhook then calls `subscribe-welcome`, which creates the Resend
 * contact and sends the welcome. Never throws.
 *
 * - A filled honeypot returns `ok` without inserting.
 * - A unique violation (already subscribed) returns `duplicate`; the form
 *   shows it as success.
 * - No Supabase config, a bad address or any failure returns `error`.
 */
export async function subscribe(input: {
  email: string;
  firstName?: string;
  honeypot?: string;
}): Promise<SubscribeResult> {
  try {
    if ((input.honeypot ?? "").trim() !== "") return "ok";

    const email = input.email.trim();
    if (!email || email.length > MAX_EMAIL || !EMAIL_PATTERN.test(email)) return "error";

    const firstName = (input.firstName ?? "").trim().slice(0, MAX_FIRST_NAME);

    const supabase = getSupabase();
    if (!supabase) return "error";

    const { source, campaign, landing } = signupContext();

    // No `.select()`: the table has no select policy, so asking for the row
    // back would fail.
    const { error } = await supabase.from("subscribers").insert({
      email,
      first_name: firstName || null,
      brand: "om",
      source: source.slice(0, 200) || null,
      campaign: campaign.slice(0, 100) || null,
      landing: landing.slice(0, 200) || null,
    });

    if (!error) return "ok";
    if (error.code === "23505") return "duplicate";
    console.error("Newsletter signup failed:", error.message);
    return "error";
  } catch (err) {
    console.error("Newsletter signup failed:", err);
    return "error";
  }
}
