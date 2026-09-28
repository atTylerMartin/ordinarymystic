import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getEntryBySlug } from "@/lib/content";

type Params = {
  slug: string;
};

export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const posts = await getAllBlogPosts();
  const match = posts.find((post) => post.slug === slug);

  if (!match) {
    return {
      title: "Post not found",
    };
  }

  const fm = match.frontmatter;

  return {
    title: fm.title,
    description: fm.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const posts = await getAllBlogPosts();
  const match = posts.find((post) => post.slug === slug);

  if (!match) {
    notFound();
  }

  const entry = await getEntryBySlug("blog", slug);
  const fm = entry.frontmatter as any;

  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          Blog
        </p>
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          {fm.title}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
          {fm.description}
        </p>
        <p className="text-xs text-slate-500">
          {new Date(fm.date).toLocaleDateString()}
        </p>
      </header>

      <div className="relative h-52 w-full overflow-hidden rounded-2xl bg-slate-100 sm:h-72">
        <Image
          src={fm.image}
          alt={fm.title}
          fill
          className="object-cover"
        />
      </div>

      <section
        className="prose-content max-w-none"
        dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
      />
    </article>
  );
}

