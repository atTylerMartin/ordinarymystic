import type { Metadata } from "next";
import Image from "next/image";
import { getGuide, listGuides, type GuideFrontmatter } from "@/lib/content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AuthorBox } from "@/components/author-box";
import { GuideCta } from "@/components/guide-cta";
import { CATEGORY_LABELS, GuideMeta } from "@/components/guide-meta";
import { ArticleSchema } from "@/components/structured-data";
import { OG_DEFAULT, pageMetadata } from "@/lib/metadata";

type Params = { slug: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return listGuides("guides").map((guide) => ({ slug: guide.slug }));
}

// Featured images under public/images/featured are 1600x900.
function ogImage(fm: GuideFrontmatter): typeof OG_DEFAULT | undefined {
  if (!fm.image) return undefined;
  return { url: fm.image, width: 1600, height: 900, alt: fm.imageAlt ?? fm.title };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { frontmatter: fm } = await getGuide(slug);
  return pageMetadata(`/guides/${slug}`, {
    article: { publishedTime: fm.date, modifiedTime: fm.updated },
    image: ogImage(fm),
  });
}

export default async function GuidePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const guide = await getGuide(slug);
  const fm = guide.frontmatter;

  return (
    <article className="space-y-8">
      <ArticleSchema guide={guide} />
      <div className="space-y-3">
        <Breadcrumbs path={`/guides/${slug}`} />
        <header className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            {fm.kicker ?? CATEGORY_LABELS[fm.category]}
          </p>
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {fm.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
            {fm.description}
          </p>
          <GuideMeta guide={guide} showPublished />
        </header>
      </div>

      {fm.image && (
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-slate-100">
          <Image
            src={fm.image}
            alt={fm.imageAlt ?? fm.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}

      <div
        className="prose-content max-w-none"
        dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
      />

      {fm.faq && fm.faq.length > 0 && (
        <section className="space-y-3">
          <h2 className="font-heading text-xl font-bold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <dl className="space-y-4">
            {fm.faq.map((item) => (
              <div key={item.question}>
                <dt className="text-sm font-semibold text-slate-900">{item.question}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-slate-700">{item.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <GuideCta fm={fm} slug={slug} />
      <AuthorBox />
    </article>
  );
}
