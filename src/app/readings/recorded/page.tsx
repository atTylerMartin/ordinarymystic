import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { RecordedBullets, RecordedTiers, WalletNote } from "@/components/booking-section";
import { FaqList } from "@/components/faq-list";
import { ArrowLink, PageHeader, Prose, SectionHeading } from "@/components/page-parts";
import { ReviewsSection } from "@/components/reviews-section";
import { ScrollOnHash } from "@/components/scroll-on-hash";
import { ReadingServiceSchema } from "@/components/structured-data";
import { TulsaLine } from "@/components/tulsa-line";
import { faqItems } from "@/lib/content/faq";
import { RECORDED_PAGE as C } from "@/lib/content/readings";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/readings/recorded");

export default function RecordedReadingsPage() {
  return (
    <>
      <ScrollOnHash hash="#book" />
      <ReadingServiceSchema kind="recorded" />
      <div className="space-y-14">
        <div>
          <Breadcrumbs path="/readings/recorded" />
          <PageHeader title={C.h1}>
            <p>{C.answer}</p>
          </PageHeader>
          <RecordedBullets className="mt-6 max-w-3xl" />
        </div>

        <section id="book" className="scroll-mt-24 space-y-8">
          <SectionHeading>{C.tiersTitle}</SectionHeading>
          <RecordedTiers />
          <WalletNote />
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.arrivesTitle}</SectionHeading>
          <ul className="max-w-3xl space-y-3">
            {C.arrives.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#213752]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.questionTitle}</SectionHeading>
          <Prose>
            {C.question.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Prose>
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.prepareTitle}</SectionHeading>
          <Prose>
            <p>{C.prepare}</p>
          </Prose>
        </section>

        <ReviewsSection
          id="reviews"
          limit={3}
          kicker={null}
          title={C.testimonialsTitle}
          showLeaveButton={false}
          moreHref="/testimonials"
        />

        <section className="space-y-4">
          <SectionHeading>{C.ownProductTitle}</SectionHeading>
          <Prose>
            <p>{C.ownProduct}</p>
          </Prose>
          <ArrowLink href="/readings/live">{C.liveLink}</ArrowLink>
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.faqTitle}</SectionHeading>
          <FaqList items={faqItems(C.faqIds)} />
          <ArrowLink href="/faq">All questions</ArrowLink>
        </section>

        <TulsaLine />
      </div>
    </>
  );
}
