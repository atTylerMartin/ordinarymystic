import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/button";
import { ReaderMilestone } from "@/components/analytics/reader-milestone";
import { AuthorBox } from "@/components/blog/author-box";
import { Comments } from "@/components/blog/comments";
import { PostSidebar } from "@/components/blog/post-sidebar";
import { RelatedPostsCarousel } from "@/components/blog/related-posts-carousel";
import { DEFAULT_AUTHOR_SLUG, getAuthorBySlug } from "@/data/authors";
import { formatSlugLabel } from "@/lib/blog-taxonomy-utils";
import { getTaxonomyEntity } from "@/data/taxonomy";
import { type BlogPostFrontmatter, getAllBlogPosts, getEntryBySlug } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { withUtmParams } from "@/lib/utils";

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

  // Skip " | Ordinary Mystic" suffix when the full title would exceed 60 chars
  const SUFFIX_LEN = " | Ordinary Mystic".length;
  const seoTitle =
    fm.title.length + SUFFIX_LEN <= 60
      ? fm.title
      : { absolute: fm.title };

  return {
    title: seoTitle,
    description: fm.description,
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
    openGraph: {
      title: fm.title,
      description: fm.description,
      url: `${SITE_URL}/blog/${slug}`,
      type: "article",
      publishedTime: fm.date,
      authors: [`${SITE_URL}/authors/${fm.author ?? "tyler-martin"}`],
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.description,
    },
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
  const fm = entry.frontmatter as BlogPostFrontmatter;
  const ctaEyebrow = fm.ctaEyebrow ?? "Ready for a reading?";
  const ctaTitle = fm.ctaTitle ?? "Want help applying this to your chart?";
  const ctaBody =
    fm.ctaBody ??
    "Get a practical reading in plain English focused on your actual patterns, timing, and next steps.";
  const ctaLabel = fm.ctaLabel ?? "Book a Reading";
  const ctaUrl = withUtmParams(fm.ctaUrl ?? "/book", {
    utm_source: "blog",
    utm_medium: "cta-card",
  });
  const category = fm.category;
  const subcategory = fm.subcategory;
  const author = getAuthorBySlug(fm.author);
  const absolutePostUrl = `${SITE_URL}/blog/${slug}`;
  const breadcrumbs = [
    { label: "Blog", href: "/blog" },
    ...(category
      ? [{ label: formatSlugLabel(category), href: `/blog/categories/${category}` }]
      : []),
    ...(subcategory
      ? [{ label: formatSlugLabel(subcategory), href: `/blog/subcategories/${subcategory}` }]
      : []),
  ];

  const currentTags = new Set(fm.tags ?? []);
  const relatedPosts = posts
    .filter((post) => post.slug !== slug)
    .map((post) => {
      const sameCategory =
        Boolean(fm.category) &&
        Boolean(post.frontmatter.category) &&
        fm.category === post.frontmatter.category;
      const sharedTagCount = (post.frontmatter.tags ?? []).filter((tag) =>
        currentTags.has(tag),
      ).length;
      const hasSharedTags = sharedTagCount > 0;

      let priority = 0;
      if (sameCategory && hasSharedTags) priority = 1;
      else if (sameCategory) priority = 2;
      else if (hasSharedTags) priority = 3;

      return { post, priority, sharedTagCount };
    })
    .filter((item) => item.priority > 0)
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.sharedTagCount !== b.sharedTagCount) return b.sharedTagCount - a.sharedTagCount;
      return (
        new Date(b.post.frontmatter.date).getTime() -
        new Date(a.post.frontmatter.date).getTime()
      );
    })
    .slice(0, 3)
    .map((item) => item.post);

  const linkedMetadata = [
    ...(fm.planets ?? []).map((value) => ({
      label: getTaxonomyEntity("planets", value)?.title ?? value.replaceAll("-", " "),
      href: `/blog/planets/${value}`,
    })),
    ...(fm.signs ?? []).map((value) => ({
      label: getTaxonomyEntity("signs", value)?.title ?? value.replaceAll("-", " "),
      href: `/blog/signs/${value}`,
    })),
    ...(fm.houses ?? []).map((value) => ({
      label: getTaxonomyEntity("houses", value)?.title ?? value.replaceAll("-", " "),
      href: `/blog/houses/${value}`,
    })),
    ...(fm.cards ?? []).map((value) => ({
      label: getTaxonomyEntity("cards", value)?.title ?? value.replaceAll("-", " "),
      href: `/blog/cards/${value}`,
    })),
    ...(fm.tags ?? []).map((value) => ({
      label: value.replaceAll("-", " "),
      href: `/blog/tags/${value}`,
    })),
  ];

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: fm.title,
    description: fm.description,
    datePublished: fm.date,
    dateModified: fm.date,
    mainEntityOfPage: absolutePostUrl,
    author: {
      "@type": "Person",
      name: author.name,
      url: `${SITE_URL}/authors/${author.slug}`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    image: fm.image ? `${SITE_URL}${fm.image}` : undefined,
    articleSection: [fm.category, fm.subcategory].filter(Boolean),
    keywords: fm.tags,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.label,
      item: `${SITE_URL}${crumb.href}`,
    })),
  };

  const faq = fm.faq;

  return (
    <article>
      <ReaderMilestone slug={slug} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* HEADER */}
      <header className="mb-10 sm:mb-14">
        <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
          {breadcrumbs.map((crumb, index) => (
            <span key={crumb.href} className="inline-flex items-center gap-2">
              {index > 0 ? (
                <span className="text-[var(--color-rule)]" aria-hidden>
                  /
                </span>
              ) : null}
              {index === breadcrumbs.length - 1 ? (
                <span>{crumb.label}</span>
              ) : (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-[var(--color-oxblood)]"
                >
                  {crumb.label}
                </Link>
              )}
            </span>
          ))}
        </nav>

        {category ? (
          <div className="mt-8 inline-flex items-center gap-3">
            <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
            <Link
              href={`/blog/categories/${category}`}
              className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
            >
              {formatSlugLabel(category)}
            </Link>
          </div>
        ) : null}

        <h1 className="mt-5 font-heading text-3xl font-semibold tracking-tight leading-[1.1] text-[var(--color-ink)] sm:text-4xl lg:text-5xl">
          {fm.title}
        </h1>

        {fm.description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
            {fm.description}
          </p>
        ) : null}

        <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[var(--color-rule)] pt-5">
          <time
            dateTime={fm.date}
            className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]"
          >
            {new Date(fm.date).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          {author.slug !== DEFAULT_AUTHOR_SLUG ? (
            <>
              <span
                className="h-px flex-1 bg-[var(--color-rule)]"
                aria-hidden
              />
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
                By{" "}
                <Link
                  href={`/authors/${author.slug}`}
                  className="text-[var(--color-ink)] underline-offset-4 transition-colors hover:text-[var(--color-oxblood)] hover:underline"
                >
                  {author.name}
                </Link>
              </span>
            </>
          ) : null}
        </div>
      </header>

      {/* ARTICLE BODY */}
      <section
        className="prose-content max-w-none"
        dangerouslySetInnerHTML={{ __html: entry.contentHtml }}
      />

      <div className="mt-10">
        <PostSidebar methodology={fm.methodology} sources={fm.sources} />
      </div>

      {/* CTA CALLOUT */}
      <aside className="mt-12 border-y-2 border-[var(--color-ink)] bg-[var(--color-bone-raised)] px-6 py-9 sm:px-10 sm:py-11">
        <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
          <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
          {ctaEyebrow}
        </span>
        <h2 className="mt-4 max-w-2xl font-heading text-2xl font-semibold tracking-tight leading-[1.15] text-[var(--color-ink)] sm:text-3xl">
          {ctaTitle}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-muted)]">
          {ctaBody}
        </p>
        <Link href={ctaUrl} className="mt-6 inline-block">
          <Button
            type="button"
            size="md"
            className="rounded-none bg-[var(--color-oxblood)] text-[var(--color-bone)] hover:bg-[var(--color-oxblood-hover)]"
            rightIcon={<ArrowRight className="h-4 w-4" />}
          >
            {ctaLabel}
          </Button>
        </Link>
      </aside>

      {/* AUTHOR */}
      <div className="mt-12">
        <AuthorBox
          embedded
          author={{
            slug: author.slug,
            name: author.name,
            bio: author.bio,
            image: author.image,
            socials: author.socials,
          }}
        />
      </div>

      {/* TAGS */}
      {linkedMetadata.length > 0 ? (
        <section className="mt-12 border-t border-[var(--color-ink)] pt-8">
          <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
            <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
            Filed Under
          </span>
          <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
            {linkedMetadata.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-[var(--color-ink)] underline-offset-4 transition-colors hover:text-[var(--color-oxblood)] hover:underline"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {/* RELATED */}
      <div className="mt-12">
        <RelatedPostsCarousel items={relatedPosts} />
      </div>

      {/* COMMENTS */}
      <div className="mt-12">
        <Comments />
      </div>
    </article>
  );
}

