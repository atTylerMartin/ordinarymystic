import { Breadcrumbs } from "@/components/breadcrumbs";
import { ReviewsSection } from "@/components/reviews-section";
import { TESTIMONIALS as C } from "@/lib/content/testimonials";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/testimonials");

// No review schema here: the reviews load client-side and are self-collected.
export default function TestimonialsPage() {
  return (
    <div className="space-y-8">
      <Breadcrumbs path="/testimonials" />
      <ReviewsSection
        id="reviews"
        limit={100}
        kicker={null}
        title={C.h1}
        headingLevel="h1"
        intro={
          <>
            <p>{C.intro}</p>
            <p>{C.moderation}</p>
          </>
        }
      />
    </div>
  );
}
