import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { SITE_URL } from "@/lib/config";
import {
  TULSA_TAROT_READER_EVENTS_URL,
  TULSA_TAROT_READER_URL,
} from "@/lib/offerings";

const pageTitle = "Tulsa tarot readings – online, grounded, practical insight";
const pageDescription =
  "Online tarot readings from Tulsa-based reader Tyler Martin. Recorded readings and live Zoom sessions. For in-person readings and events in Tulsa, visit Tulsa Tarot Reader.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/tulsa-tarot-reading" },
};

// Ordinary Mystic delivers online. Marking it as a LocalBusiness with a Tulsa
// service area would compete with Tulsa Tarot Reader's local signals, so this
// is a Service provided by an Organization, delivered online.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online tarot readings",
  serviceType: "Tarot reading",
  url: `${SITE_URL}/tulsa-tarot-reading`,
  provider: {
    "@type": "Organization",
    name: "Ordinary Mystic",
    url: SITE_URL,
  },
  serviceOutput: "A personalized video walkthrough and a written synthesis",
  availableChannel: {
    "@type": "ServiceChannel",
    serviceUrl: `${SITE_URL}/#book`,
    availableLanguage: "en",
  },
  areaServed: { "@type": "Country", name: "United States" },
};

export default function TulsaTarotPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="space-y-6">
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

        <p>
          <Link href="/#book">
            <Button type="button" size="md">
              Book an online reading
            </Button>
          </Link>
        </p>
      </div>
    </>
  );
}
