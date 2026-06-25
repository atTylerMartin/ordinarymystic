"use client";

import { useActionState, useState } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/button";
import { cn } from "@/lib/utils";
import {
  submitReview,
  type ReviewFormState,
} from "@/app/actions/submit-review";

const initialState: ReviewFormState = { status: "idle", message: "" };

export function ReviewForm({ onSuccess }: { onSuccess?: () => void }) {
  const [state, formAction, pending] = useActionState(
    submitReview,
    initialState,
  );
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  if (state.status === "success") {
    return (
      <div className="text-center">
        <p className="text-sm font-medium text-slate-900">{state.message}</p>
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
    <form action={formAction}>
      <h3 className="text-base font-semibold text-slate-900">
        Leave a review
      </h3>
      <p className="mt-1 text-sm text-slate-600">
        Had a reading? Share your experience. Reviews appear after a quick check.
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
          <input type="hidden" name="rating" value={rating || ""} />
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
            maxLength={80}
            placeholder="First name or initials"
            className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        <div>
          <label
            htmlFor="review-body"
            className="block text-sm font-medium text-slate-700"
          >
            Your review
          </label>
          <textarea
            id="review-body"
            name="body"
            required
            minLength={10}
            maxLength={1000}
            rows={4}
            placeholder="What was your reading like?"
            className="mt-1.5 w-full resize-y rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300"
          />
        </div>

        {state.status === "error" && (
          <p className="text-sm text-red-600">{state.message}</p>
        )}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Submitting…" : "Submit review"}
        </Button>
      </div>
    </form>
  );
}
