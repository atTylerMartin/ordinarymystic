import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { DIGITAL_TAROT_APP_URL } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";
import { recommendedResources } from "@/data/resources";

export const metadata = pageMetadata("/tools");

export default function ToolsIndexPage() {
  const byCategory = recommendedResources.reduce<
    Record<string, typeof recommendedResources>
  >((acc, resource) => {
    const category = resource.tags[0] ?? "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(resource);
    return acc;
  }, {});

  const categories = Object.keys(byCategory).sort((a, b) =>
    a === "Tarot" ? -1 : b === "Tarot" ? 1 : a.localeCompare(b),
  );

  return (
    <div className="space-y-12">
      <Breadcrumbs path="/tools" />
      <header className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Tools & resources
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
          Clean, minimal tools that help you track readings, patterns, and
          experiments.
        </p>
      </header>

      <section>
        <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
          Tools to support your readings
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-700">
          I&apos;m a Notion-certified template creator and power user, and have
          been using Notion personally and professionally for 10+ years.
          I&apos;ve built and sold templates, I&apos;ve been a Notion consultant
          for companies, and I believe this is the #1 tool for organizing
          anything. That makes it a great resource for tracking your Tarot
          readings! Browse my Notion templates and other online tools below.
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <Card className="flex flex-col p-0 overflow-hidden">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100">
              <Image
                src="/images/resource/simple_tarot_journal.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardHeader className="space-y-2 px-6 pt-4">
              <CardTitle>Simple Tarot Journal</CardTitle>
              <CardDescription>
                A simple, searchable Notion template to log readings and card
                pulls, build a living card library, and surface past insights
                when you need them.
              </CardDescription>
              <p className="text-xs text-slate-500">
                Simple & searchable
              </p>
              <p className="text-sm font-medium text-slate-700">$12</p>
            </CardHeader>
            <CardFooter className="mt-auto px-6 pb-6">
              <Link
                href="https://ordinarymystic.gumroad.com/l/tarotjournal"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button" size="sm">
                  Buy now
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex flex-col p-0 overflow-hidden">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100">
              <Image
                src="/images/resource/complete_tarot_dashboard.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardHeader className="space-y-2 px-6 pt-4">
              <CardTitle>Complete Tarot Dashboard</CardTitle>
              <CardDescription>
                Advanced Notion system to track readings in full detail:
                upright and reversed cards, contextual meanings, and statistics
                so your practice deepens over time.
              </CardDescription>
              <p className="text-xs text-slate-500">
                Advanced & flexible
              </p>
              <p className="text-sm font-medium text-slate-700">$32</p>
            </CardHeader>
            <CardFooter className="mt-auto px-6 pb-6">
              <Link
                href="https://ordinarymystic.gumroad.com/l/tarotdashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button type="button" size="sm">
                  Buy now
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card className="flex flex-col p-0 overflow-hidden">
            <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100">
              <Image
                src="/images/resource/digital_tarot.png"
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
            <CardHeader className="space-y-2 px-6 pt-4">
              <CardTitle>Digital Tarot</CardTitle>
              <CardDescription>
                A free online desktop simulator app to shuffle, pull, and
                rearrange Tarot cards. This website is in beta, and mobile view
                is not currently supported.
              </CardDescription>
              <p className="text-xs text-slate-500">
                Free web app
              </p>
            </CardHeader>
            <CardFooter className="mt-auto px-6 pb-6">
              <Link
                href={DIGITAL_TAROT_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  type="button"
                  size="sm"
                  rightIcon={<ExternalLink className="h-4 w-4" />}
                >
                  Try now
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </section>

      <section id="recommended-resources" className="space-y-6">
        <div>
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Recommended resources
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-700">
            If there&apos;s a star (★), it&apos;s an affiliate link. If you
            purchase using this link, I&apos;ll get a small kickback. Thank you
            for your support! Keep in mind that even if I didn&apos;t get
            anything, these are still the resources I&apos;d recommend.
          </p>
        </div>
        <div className="space-y-8">
          {categories.map((category) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
                {category}
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {byCategory[category].map((resource) => (
                  <Card key={resource.url} className="flex flex-col p-0 sm:flex-row overflow-hidden">
                    <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-t-2xl bg-slate-100 sm:w-28 sm:rounded-l-2xl sm:rounded-r-none">
                      <Image
                        src={resource.image}
                        alt=""
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 640px) 100vw, 7rem"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col justify-center gap-2 p-4 overflow-visible">
                      <h4 className="font-medium text-slate-900">
                        {resource.affiliate && (
                          <span className="mr-1" aria-hidden>★</span>
                        )}
                        {resource.title}
                      </h4>
                      <p className="text-sm text-slate-700">{resource.desc}</p>
                      <Link
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-fit"
                      >
                        <Button type="button" size="sm">
                          View product
                        </Button>
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
