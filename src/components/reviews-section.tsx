import { Container } from "@/components/container";
import { Stars } from "@/components/stars";
import { LeaveReviewButton } from "@/components/leave-review-button";
import { getApprovedReviews } from "@/lib/reviews";

function averageRating(ratings: number[]): number {
  if (ratings.length === 0) return 0;
  return ratings.reduce((sum, r) => sum + r, 0) / ratings.length;
}

export async function ReviewsSection() {
  const reviews = await getApprovedReviews();
  const avg = averageRating(reviews.map((r) => r.rating));

  return (
    <section
      id="reviews"
      className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen py-16 sm:py-20"
      style={{ backgroundColor: "#f3eee9" }}
    >
      <Container className="px-4 sm:px-6">
        <p className="text-center text-sm font-medium uppercase tracking-widest text-slate-500">
          Reviews
        </p>
        <h2 className="mt-2 font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          What People Are Saying
        </h2>

        {reviews.length > 0 && (
          <div className="mt-4 flex items-center justify-center gap-2">
            <Stars rating={avg} />
            <span className="text-sm text-slate-600">
              {avg.toFixed(1)} · {reviews.length} review
              {reviews.length === 1 ? "" : "s"}
            </span>
          </div>
        )}

        <div className="mt-8 flex justify-center">
          <LeaveReviewButton />
        </div>

        {/* Reviews list */}
        <div className="mx-auto mt-10 max-w-5xl">
          {reviews.length === 0 ? (
            <div className="flex min-h-[8rem] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/40 p-6 text-center">
              <p className="text-sm text-slate-600">
                No reviews yet — be the first to share your experience.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {reviews.map((review) => (
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
      </Container>
    </section>
  );
}
