"use client";

import { useEffect, useState } from "react";
import { Container } from "@/components/container";
import { Stars } from "@/components/stars";
import { LeaveReviewButton } from "@/components/leave-review-button";
import { getApprovedReviews, type Review } from "@/lib/reviews";

function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

export function ReviewsSection() {
  // null = still loading (avoids flashing the empty state before data arrives).
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let active = true;
    getApprovedReviews().then((data) => {
      if (active) setReviews(data);
    });
    return () => {
      active = false;
    };
  }, []);

  const loaded = reviews !== null;
  const list = reviews ?? [];
  const avg = averageRating(list.map((r) => r.rating));

  return (
    <section
      id="reviews"
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-16 sm:py-20"
      style={{ backgroundColor: "#f3eee9" }}
    >
      <Container className="px-4 sm:px-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          Testimonials
        </p>
        <h2 className="mt-2 font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          What People Are Saying
        </h2>

        {list.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars rating={avg} />
            <span className="text-sm text-slate-600">
              {avg.toFixed(1)} · {list.length} testimonial
              {list.length === 1 ? "" : "s"}
            </span>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <LeaveReviewButton />
        </div>

        {/* Reviews list — only render once loaded to avoid an empty-state flash */}
        {loaded && (
          <div className="mx-auto mt-10 max-w-5xl">
            {list.length === 0 ? (
              <div className="flex min-h-[8rem] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 p-6 text-center">
                <p className="text-sm text-slate-600">
                  No testimonials yet — be the first to share your experience.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((review) => (
                  <figure
                    key={review.id}
                    className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-md"
                  >
                    <Stars rating={review.rating} />
                    <blockquote className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">
                      “{review.body}”
                    </blockquote>
                    <figcaption className="mt-4 text-sm font-medium text-slate-900">
                      {review.name}
                    </figcaption>
                  </figure>
                ))}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}
