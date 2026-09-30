import Link from "next/link";
import { listGuides, type Guide } from "@/lib/content";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/card";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CATEGORY_LABELS, GuideMeta } from "@/components/guide-meta";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/guides");

const SEASON_ARCHIVE = "Season archive";

function groupGuides(guides: Guide[]) {
  const archive = guides.filter((g) => g.frontmatter.kicker === SEASON_ARCHIVE);
  const current = guides.filter((g) => g.frontmatter.kicker !== SEASON_ARCHIVE);
  return [
    ...(["tarot", "astrology", "general-spirituality"] as const).map((category) => ({
      heading: CATEGORY_LABELS[category],
      guides: current.filter((g) => g.frontmatter.category === category),
    })),
    { heading: SEASON_ARCHIVE, guides: archive },
  ].filter((group) => group.guides.length > 0);
}

export default function GuidesIndexPage() {
  const groups = groupGuides(listGuides("guides"));

  return (
    <div className="space-y-8">
      <Breadcrumbs path="/guides" />
      <header className="space-y-3">
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Guides to Tarot and Astrology
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
          Plain-English guides to reading tarot and astrology well: how the
          cards and the chart actually work, how to practice on your own, and
          what the year&apos;s major transits describe.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.heading} className="space-y-4">
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">
            {group.heading}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {group.guides.map((guide) => {
              const fm = guide.frontmatter;
              return (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="group block"
                >
                  <Card className="flex h-full flex-col transition-shadow group-hover:shadow-lg">
                    <CardHeader className="mb-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                        {fm.kicker ?? CATEGORY_LABELS[fm.category]}
                      </p>
                      <CardTitle className="group-hover:underline underline-offset-4">
                        {fm.title}
                      </CardTitle>
                      <CardDescription>{fm.description}</CardDescription>
                    </CardHeader>
                    <div className="mt-auto">
                      <GuideMeta guide={guide} />
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
