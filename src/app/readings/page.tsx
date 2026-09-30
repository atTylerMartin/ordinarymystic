import { Breadcrumbs } from "@/components/breadcrumbs";
import { LiveTiers, RecordedTiers, TulsaCrosslink } from "@/components/booking-section";
import { ArrowLink, PageHeader, Prose, SectionHeading } from "@/components/page-parts";
import { ReadingServiceSchema } from "@/components/structured-data";
import { READINGS_OVERVIEW as C } from "@/lib/content/readings";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/readings");

export default function ReadingsPage() {
  return (
    <>
      <ReadingServiceSchema kind="recorded" />
      <ReadingServiceSchema kind="live" />
      <div className="space-y-14">
        <div>
          <Breadcrumbs path="/readings" />
          <PageHeader title={C.h1}>
            <p>{C.intro}</p>
          </PageHeader>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {C.sections.map((s) => (
            <section
              key={s.key}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm"
            >
              <h2 className="font-heading text-xl font-black tracking-tight text-slate-900">
                {s.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-700">{s.body}</p>
              <p className="mt-4">
                <ArrowLink href={s.href}>{s.cta}</ArrowLink>
              </p>
            </section>
          ))}
        </div>

        <section className="space-y-3">
          <SectionHeading>{C.chooseTitle}</SectionHeading>
          <Prose>
            <p>{C.choose}</p>
          </Prose>
        </section>

        <section className="space-y-6">
          <SectionHeading>{C.recordedTiersTitle}</SectionHeading>
          <RecordedTiers />
        </section>

        <section className="space-y-6">
          <SectionHeading>{C.liveTiersTitle}</SectionHeading>
          <LiveTiers />
        </section>

        <TulsaCrosslink />
      </div>
    </>
  );
}
