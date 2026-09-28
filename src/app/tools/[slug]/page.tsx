import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllTools, getEntryBySlug } from "@/lib/content";
import { Button } from "@/components/button";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { pageMetadata } from "@/lib/metadata";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const tools = await getAllTools();
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tools = await getAllTools();
  const match = tools.find((tool) => tool.slug === slug);

  if (!match) {
    return {
      title: "Tool not found",
    };
  }

  return pageMetadata(`/tools/${slug}`);
}

export default async function ToolDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const tools = await getAllTools();
  const match = tools.find((tool) => tool.slug === slug);

  if (!match) {
    notFound();
  }

  const entry = await getEntryBySlug("tools", slug);
  const fm = entry.frontmatter as any;

  return (
    <article className="space-y-6">
      <Breadcrumbs path={`/tools/${slug}`} />
      <header className="space-y-4 md:flex md:items-start md:justify-between md:gap-8">
        <div className="space-y-3">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Tool
          </p>
          <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {fm.title}
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
            {fm.description}
          </p>
          <p className="text-sm font-medium text-slate-900">{fm.price}</p>
          <p className="text-xs text-slate-500">{fm.type}</p>
        </div>
          <div className="flex flex-col items-end gap-3">
          <div className="relative h-32 w-56 overflow-hidden rounded-2xl bg-slate-100 sm:h-40 sm:w-72">
            <Image
              src={fm.image}
              alt={fm.title}
              fill
              className="object-cover"
            />
          </div>
          <Link href={fm.ctaUrl} target="_blank">
            <Button type="button">{fm.ctaLabel}</Button>
          </Link>
        </div>
      </header>

      <section
        className="prose-content max-w-none"
        dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
      />
    </article>
  );
}

