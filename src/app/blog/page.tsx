import type { Metadata } from "next";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { PageHeader } from "@/components/page-header";
import { getAllBlogPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Tarot & Astrology Blog",
  description:
    "Short, grounded essays on tarot, astrology, and reflective practice, without the theatrics.",
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const posts = await getAllBlogPosts();
  const resolvedSearchParams = searchParams ?? {};
  const tag = Array.isArray(resolvedSearchParams?.tag)
    ? resolvedSearchParams?.tag[0]
    : resolvedSearchParams?.tag;
  const archive = Array.isArray(resolvedSearchParams?.archive)
    ? resolvedSearchParams?.archive[0]
    : resolvedSearchParams?.archive;

  return (
    <div>
      <PageHeader
        eyebrow="Writings & Reflections"
        title="Ordinary Mystic Blog"
        description="Essays and notes on tarot, astrology, and reflective tools, written for people who like nuance more than predictions."
      />

      <BlogExplorer
        posts={posts}
        currentPath="/blog"
        activeTag={tag}
        activeArchive={archive}
        emptyMessage="No posts match your current search."
      />
    </div>
  );
}
