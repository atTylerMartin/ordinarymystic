import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { LiveTiers, OngoingCard, WalletNote } from "@/components/booking-section";
import { FaqList } from "@/components/faq-list";
import { ArrowLink, PageHeader, Prose, SectionHeading } from "@/components/page-parts";
import { ReviewsSection } from "@/components/reviews-section";
import { ScrollOnHash } from "@/components/scroll-on-hash";
import { ReadingServiceSchema } from "@/components/structured-data";
import { TulsaLine } from "@/components/tulsa-line";
import { faqItems } from "@/lib/content/faq";
import { LIVE_PAGE as C } from "@/lib/content/readings";
import { LIVE_COPY } from "@/lib/offerings";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/readings/live");

export default function LiveReadingsPage() {
  return (
    <>
      <ScrollOnHash hash="#live" />
      <ScrollOnHash hash="#ongoing" />
      <ReadingServiceSchema kind="live" />
      <div className="space-y-14">
        <div>
          <Breadcrumbs path="/readings/live" />
          <PageHeader title={C.h1}>
            <p>{C.answer}</p>
            <p>{LIVE_COPY.lede}</p>
          </PageHeader>
        </div>

        <section id="live" className="scroll-mt-24 space-y-8">
          <SectionHeading>{C.tiersTitle}</SectionHeading>
          <LiveTiers />
          <WalletNote />
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.expectTitle}</SectionHeading>
          <ul className="max-w-3xl space-y-3">
            {C.expect.map((line) => (
              <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 sm:text-base">
                <Check className="mt-1 h-4 w-4 shrink-0 text-[#213752]" aria-hidden />
                {line}
              </li>
            ))}
          </ul>
        </section>

        <section className="space-y-4">
          <SectionHeading>{C.whyTitle}</SectionHeading>
          <Prose>
            <p>{C.why}</p>
          </Prose>
          <ArrowLink href="/readings/recorded">{C.recordedLink}</ArrowLink>
        </section>

        <OngoingCard id="ongoing" className="mx-0" />

        <ReviewsSection
          id="reviews"
          limit={3}
          kicker={null}
          title={C.testimonialsTitle}
          showLeaveButton={false}
          moreHref="/testimonials"
        />

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
