import Link from "next/link";
import { Button } from "@/components/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLink } from "@/components/page-parts";
import { ReadingServiceSchema } from "@/components/structured-data";
import { pageMetadata } from "@/lib/metadata";
import { TULSA_TAROT_READER_URL } from "@/lib/offerings";

export const metadata = pageMetadata("/tulsa-astrology-reading");

export default function TulsaAstrologyPage() {
  return (
    <>
      <ReadingServiceSchema kind="recorded" />
      <ReadingServiceSchema kind="live" />
      <div className="space-y-6">
        <Breadcrumbs path="/tulsa-astrology-reading" />
        <header className="space-y-3">
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tulsa astrology readings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
            Looking for astrology in Tulsa? Ordinary Mystic offers online
            readings from Tulsa-based reader Tyler Martin: grounded
            consultations that focus on timing, patterns, and context, not
            generic horoscopes. For private in-person readings and local events,
            visit{" "}
            <a
              href={TULSA_TAROT_READER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-900 underline underline-offset-4"
            >
              Tulsa Tarot Reader
            </a>
            .
          </p>
        </header>

        <section className="space-y-4 text-sm leading-relaxed text-slate-700">
          <p>
            Readings are delivered online. A recorded reading comes back as a
            personalized video walkthrough plus a written synthesis, prepared
            privately after I have had time to sit with your chart. A live
            reading happens over Zoom, where we can follow a question wherever
            it goes and a written synthesis follows afterward.
          </p>
          <p>
            You might book an astrology reading when you are navigating a job
            transition, reevaluating relationships, or sensing that a new
            chapter is opening but cannot quite name what is shifting. Together
            we will look at your chart for patterns around energy,
            responsibility, growth, and release.
          </p>
          <p>
            Instead of fixed identity labels, we use the chart as a reflective
            map. The goal is clearer language for what you are feeling and more
            confident choices about what comes next.
          </p>
        </section>

        <p className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/readings/astrology">
            <Button type="button" size="md">
              Book an online astrology reading
            </Button>
          </Link>
          <ArrowLink href="/readings/astrology">What a chart reading includes</ArrowLink>
        </p>
      </div>
    </>
  );
}
