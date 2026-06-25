import { getSupabase } from "@/lib/supabase";

export type Review = {
  id: string;
  name: string;
  rating: number;
  body: string;
  created_at: string;
};

/**
 * Fetch approved reviews for public display, newest first. Returns an empty
 * list if Supabase isn't configured or the query fails, so the homepage never
 * breaks on a transient backend issue.
 */
export async function getApprovedReviews(limit = 12): Promise<Review[]> {
  const supabase = getSupabase();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("reviews")
    .select("id, name, rating, body, created_at")
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Failed to load reviews:", error.message);
    return [];
  }

  return data ?? [];
}
