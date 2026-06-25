"use client";

import { useState, type FormEvent } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import { getSupabase } from "@/lib/supabase";

const MAX_NAME = 80;
const MIN_BODY = 10;
const MAX_BODY = 1000;

export function ReviewForm({ onSuccess }: { onSuccess?: () => void }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot: real users never fill this hidden field.
    if (((data.get("company") as string) || "").trim() !== "") {
      setSubmitted(true);
      return;
    }

    const name = ((data.get("name") as string) || "").trim();
    const body = ((data.get("body") as string) || "").trim();

    if (!name || name.length > MAX_NAME) {
      setError("Please enter your name.");
      return;
    }
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      setError("Please choose a star rating.");
      return;
    }
    if (body.length < MIN_BODY) {
      setError(`Please write at least ${MIN_BODY} characters.`);
      return;
    }
    if (body.length > MAX_BODY) {
      setError("That testimonial is a little too long.");
      return;
    }

    const supabase = getSupabase();
    if (!supabase) {
      setError("Testimonials are temporarily unavailable. Please try again later.");
      return;
    }

    setPending(true);
    const { error: insertError } = await supabase
      .from("reviews")
      .insert({ name, rating, body, status: "pending" });
    setPending(false);

    if (insertError) {
      console.error("Failed to submit review:", insertError.message);
      setError("Something went wrong. Please try again in a moment.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="text-center">
        <p className="text-sm font-medium text-slate-900">
          Thank you! Your testimonial was submitted and will appear once approved.
        </p>
        {onSuccess && (
          <Button
            type="button"
            variant="outline"
            className="mt-4"
            onClick={onSuccess}
          >
            Close
          </Button>
        )}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 className="text-base font-semibold text-slate-900">
        Leave a testimonial
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Had a reading? Share your experience. Testimonials appear after a quick check.
      </p>

      {/* Honeypot — hidden from real users */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label>
          Company
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <span className="block text-sm font-medium text-slate-700">
            Your rating
          </span>
          <div className="mt-1.5 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
              const value = i + 1;
              const active = (hover || rating) >= value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  onMouseEnter={() => setHover(value)}
                  onMouseLeave={() => setHover(0)}
                  className="cursor-pointer p-0.5"
                  aria-label={`${value} star${value > 1 ? "s" : ""}`}
                  aria-pressed={rating === value}
                >
                  <Star
                    className={cn(
                      "h-7 w-7 transition-colors",
                      active
                        ? "fill-amber-400 text-amber-400"
                        : "fill-slate-200 text-slate-200 hover:text-amber-300",
                    )}
                  />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label
            htmlFor="review-name"
            className="block text-sm font-medium text-slate-700"
          >
            Name
          </label>
          <input
            id="review-name"
            name="name"
            type="text"
            required
            maxLength={MAX_NAME}
            placeholder="First name or initials"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label
            htmlFor="review-body"
            className="block text-sm font-medium text-slate-700"
          >
            Your testimonial
          </label>
          <textarea
            id="review-body"
            name="body"
            required
            minLength={MIN_BODY}
            maxLength={MAX_BODY}
            rows={4}
            placeholder="What was your reading like?"
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Submitting…" : "Submit testimonial"}
        </Button>
      </div>
    </form>
  );
}
