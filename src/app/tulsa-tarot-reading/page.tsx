import Link from "next/link";
import { Button } from "@/components/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ArrowLink } from "@/components/page-parts";
import { ReadingServiceSchema } from "@/components/structured-data";
import { pageMetadata } from "@/lib/metadata";
import {
  TULSA_TAROT_READER_EVENTS_URL,
  TULSA_TAROT_READER_URL,
} from "@/lib/offerings";

export const metadata = pageMetadata("/tulsa-tarot-reading");

export default function TulsaTarotPage() {
  return (
    <>
      <ReadingServiceSchema kind="recorded" />
      <ReadingServiceSchema kind="live" />
      <div className="space-y-6">
        <Breadcrumbs path="/tulsa-tarot-reading" />
        <header className="space-y-3">
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tulsa tarot readings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
            Looking for tarot in Tulsa? Ordinary Mystic offers online readings
            from Tulsa-based reader Tyler Martin. For private in-person readings
            and local events, visit{" "}
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
            Everything on this site is delivered online, which is the point. A
            recorded reading means you send the question whenever it occurs to
            you, I read it privately and sit with the patterns before I say
            anything about them, and what comes back is a personalized video
            walkthrough plus a written synthesis you can re-read a month later.
            Nothing to schedule, nothing to drive to.
          </p>
          <p>
            Live readings happen over Zoom. The cards come out while you watch,
            you hear the thinking as it happens, and you can interrupt, add
            context, or chase a thread I would not have known to follow. A
            written synthesis follows once I have had time to reflect on the full
            reading.
          </p>
          <p>
            Instead of dramatic predictions, we focus on clear questions and
            real-world decisions. If you are weighing a job move, sorting
            through relationship dynamics, or simply feeling stuck, tarot
            becomes a structured way to map what is going on and what you might
            try next.
          </p>
        </section>

        <section className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-heading text-lg font-black tracking-tight text-slate-900">
            Want to sit down in person instead?
          </h2>
          <p className="text-sm leading-relaxed text-slate-700">
            Same reader, different practice. Tulsa Tarot Reader covers private
            in-person sittings in Tulsa, plus parties, weddings, corporate
            gatherings, festivals, and markets across the metro.
          </p>
          <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            <a
              href={TULSA_TAROT_READER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
            >
              Tulsa Tarot Reader
            </a>
            <a
              href={TULSA_TAROT_READER_EVENTS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
            >
              Tarot for events in Tulsa
            </a>
          </p>
        </section>

        <p className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/readings/recorded">
            <Button type="button" size="md">
              Book an online reading
            </Button>
          </Link>
          <ArrowLink href="/readings">Compare recorded and live readings</ArrowLink>
        </p>
      </div>
    </>
  );
}
