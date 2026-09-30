"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/container";
import { Stars } from "@/components/stars";
import { LeaveReviewButton } from "@/components/leave-review-button";
import { TESTIMONIALS } from "@/lib/content/testimonials";
import { getApprovedReviews, type Review } from "@/lib/reviews";

function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

/** Approved testimonials, fetched client-side from Supabase.
 *
 * `fullBleed` is the homepage band (warm sand, edge to edge). Without it the
 * section sits in the page column, for /testimonials and the readings pages.
 * `limit` caps how many show; `moreHref` adds a link to the full list. */
export function ReviewsSection({
  id = "reviews",
  limit = 12,
  title = TESTIMONIALS.stripTitle,
  kicker = TESTIMONIALS.kicker,
  headingLevel = "h2",
  fullBleed = false,
  showLeaveButton = true,
  moreHref,
  intro,
}: {
  id?: string;
  limit?: number;
  title?: string;
  kicker?: string | null;
  headingLevel?: "h1" | "h2";
  fullBleed?: boolean;
  showLeaveButton?: boolean;
  moreHref?: string;
  /** Shown under the heading, above the leave-a-testimonial button. */
  intro?: ReactNode;
}) {
  // null = still loading (avoids flashing the empty state before data arrives).
  const [reviews, setReviews] = useState<Review[] | null>(null);

  useEffect(() => {
    let active = true;
    getApprovedReviews(limit).then((data) => {
      if (active) setReviews(data);
    });
    return () => {
      active = false;
    };
  }, [limit]);

  const loaded = reviews !== null;
  const list = reviews ?? [];
  const avg = averageRating(list.map((r) => r.rating));
  const Heading = headingLevel;

  const inner = (
    <>
      {kicker ? (
        <p className="text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          {kicker}
        </p>
      ) : null}
      <Heading className="mt-2 font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </Heading>
      {intro ? (
        <div className="mx-auto mt-4 max-w-2xl space-y-2 text-center text-sm leading-relaxed text-slate-600">
          {intro}
        </div>
      ) : null}

      {list.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <Stars rating={avg} />
          <span className="text-sm text-slate-600">
            {avg.toFixed(1)} · {list.length} testimonial
            {list.length === 1 ? "" : "s"}
          </span>
        </div>
      )}

      {showLeaveButton && (
        <div className="mt-8 flex justify-center">
          <LeaveReviewButton />
        </div>
      )}

      {/* Only render once loaded, to avoid an empty-state flash. */}
      {loaded && (
        <div className="mx-auto mt-10 max-w-5xl">
          {list.length === 0 ? (
            <div className="flex min-h-[8rem] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 p-6 text-center">
              <p className="text-sm text-slate-600">{TESTIMONIALS.empty}</p>
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

      {moreHref && (
        <p className="mt-8 text-center">
          <Link
            href={moreHref}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
          >
            {TESTIMONIALS.moreLabel}
            <ChevronRight className="h-4 w-4" aria-hidden />
          </Link>
        </p>
      )}
    </>
  );

  if (!fullBleed) {
    return (
      <section id={id} className="scroll-mt-24">
        {inner}
      </section>
    );
  }

  return (
    <section
      id={id}
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen scroll-mt-16 py-16 sm:py-20"
      style={{ backgroundColor: "#f3eee9" }}
    >
      <Container className="px-4 sm:px-6">{inner}</Container>
    </section>
  );
}
