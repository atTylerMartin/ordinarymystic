import { Check } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLink, PageHeader, Prose, SectionHeading } from "@/components/page-parts";
import { TulsaLine } from "@/components/tulsa-line";
import { ASTROLOGY_PAGE as C } from "@/lib/content/readings";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/readings/astrology");

function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="max-w-3xl space-y-3">
      {items.map((line) => (
        <li key={line} className="flex items-start gap-2 text-sm leading-relaxed text-slate-700 sm:text-base">
          <Check className="mt-1 h-4 w-4 shrink-0 text-[#213752]" aria-hidden />
          {line}
        </li>
      ))}
    </ul>
  );
}

export default function AstrologyReadingsPage() {
  return (
    <div className="space-y-14">
      <div>
        <Breadcrumbs path="/readings/astrology" />
        <PageHeader title={C.h1}>
          <p>{C.answer}</p>
        </PageHeader>
      </div>

      <section className="space-y-4">
        <SectionHeading>{C.includesTitle}</SectionHeading>
        <Checklist items={C.includes} />
        <Prose>
          <p>{C.approach}</p>
        </Prose>
      </section>

      <section className="space-y-4">
        <SectionHeading>{C.sendTitle}</SectionHeading>
        <Checklist items={C.send} />
        <Prose>
          <p>{C.sendHow}</p>
        </Prose>
        <ArrowLink href={C.birthTimeGuide.href}>{C.birthTimeGuide.label}</ArrowLink>
      </section>

      <section className="space-y-4">
        <SectionHeading>{C.formatsTitle}</SectionHeading>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <p className="flex-1 text-sm leading-relaxed text-slate-700">{C.recorded}</p>
            <p className="mt-4">
              <ArrowLink href="/readings/recorded#book">{C.recordedCta}</ArrowLink>
            </p>
          </div>
          <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <p className="flex-1 text-sm leading-relaxed text-slate-700">{C.live}</p>
            <p className="mt-4">
              <ArrowLink href="/readings/live#live">{C.liveCta}</ArrowLink>
            </p>
          </div>
        </div>
      </section>

      <TulsaLine />
    </div>
  );
}
