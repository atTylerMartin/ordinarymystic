import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/button";
import { SITE_URL } from "@/lib/config";
import { TULSA_TAROT_READER_URL } from "@/lib/offerings";

const pageTitle = "Tulsa astrology readings – timing, patterns, and context";
const pageDescription =
  "Online astrology consultations from Tulsa-based reader Tyler Martin, focused on timing, patterns, and practical choices. Recorded readings and live Zoom sessions.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  alternates: { canonical: "/tulsa-astrology-reading" },
};

// Delivered online, so this is a Service provided by an Organization rather
// than a LocalBusiness with a Tulsa service area — local in-person intent
// belongs to Tulsa Tarot Reader.
const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: "Online astrology readings",
  serviceType: "Astrology reading",
  url: `${SITE_URL}/tulsa-astrology-reading`,
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

export default function TulsaAstrologyPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <div className="space-y-6">
        <header className="space-y-3">
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tulsa astrology readings
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
            Looking for astrology in Tulsa? Ordinary Mystic offers online
            readings from Tulsa-based reader Tyler Martin — grounded
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
