import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { PageHeader, SectionHeading } from "@/components/page-parts";
import { FaqSchema } from "@/components/structured-data";
import { FAQ } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/faq");

function slug(heading: string) {
  return heading.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export default function FaqPage() {
  return (
    <>
      {/* The site's only FAQPage. */}
      <FaqSchema />
      <div className="space-y-12">
        <div>
          <Breadcrumbs path="/faq" />
          <PageHeader title="Frequently asked questions">
            <p>
              Everything people ask about booking a reading, how recorded and
              live readings work, astrology, the reader, and in-person readings
              in Tulsa.
            </p>
          </PageHeader>
          <nav aria-label="FAQ sections" className="mt-6">
            <ul className="flex flex-wrap gap-2">
              {FAQ.map((group) => (
                <li key={group.heading}>
                  <a
                    href={`#${slug(group.heading)}`}
                    className="inline-flex rounded-full border border-slate-300 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-white"
                  >
                    {group.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {FAQ.map((group) => (
          <section key={group.heading} className="space-y-4">
            <SectionHeading id={slug(group.heading)}>{group.heading}</SectionHeading>
            <FaqList items={group.items} />
          </section>
        ))}
      </div>
    </>
  );
}
