"use server";

import { getSupabase } from "@/lib/supabase";

export type ReviewFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const MAX_NAME = 80;
const MIN_BODY = 10;
const MAX_BODY = 1000;

/**
 * Handle a public review submission. New reviews are stored as `pending` and
 * only appear on the site after manual approval in Supabase. Includes a
 * honeypot field ("company") to deflect simple spam bots.
 */
export async function submitReview(
  _prevState: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  // Honeypot: real users never fill this hidden field.
  if (((formData.get("company") as string) || "").trim() !== "") {
    return { status: "success", message: "Thanks for your review!" };
  }

  const name = ((formData.get("name") as string) || "").trim();
  const body = ((formData.get("body") as string) || "").trim();
  const ratingRaw = (formData.get("rating") as string) || "";
  const rating = Number.parseInt(ratingRaw, 10);

  if (!name || name.length > MAX_NAME) {
    return { status: "error", message: "Please enter your name." };
  }
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return { status: "error", message: "Please choose a star rating." };
  }
  if (body.length < MIN_BODY) {
    return {
      status: "error",
      message: `Please write at least ${MIN_BODY} characters.`,
    };
  }
  if (body.length > MAX_BODY) {
    return { status: "error", message: "That review is a little too long." };
  }

  const supabase = getSupabase();
  if (!supabase) {
    return {
      status: "error",
      message: "Reviews are temporarily unavailable. Please try again later.",
    };
  }

  const { error } = await supabase
    .from("reviews")
    .insert({ name, rating, body, status: "pending" });

  if (error) {
    console.error("Failed to submit review:", error.message);
    return {
      status: "error",
      message: "Something went wrong. Please try again in a moment.",
    };
  }

  return {
    status: "success",
    message: "Thank you! Your review was submitted and will appear once approved.",
  };
}
