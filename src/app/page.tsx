import Link from "next/link";
import type { Metadata } from "next";
import {
  ArrowRight,
  ArrowUpRight,
  ExternalLink,
} from "lucide-react";
import { NewsletterForm } from "@/components/newsletter-form";
import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { ScrollOnHash } from "@/components/scroll-on-hash";
import { DIGITAL_TAROT_APP_URL } from "@/lib/config";
import { getAllBlogPosts } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: "Ordinary Mystic – Tarot & Astrology Readings" },
  description:
    "Readings, writing, and tools for finding meaning in the patterns of ordinary life. Tarot and astrology as structured thinking.",
  alternates: {
    canonical: `${SITE_URL}/`,
  },
};

const sectionPadding = "py-20 sm:py-24";

const formatCategory = (category: string) =>
  category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

export default async function Home() {
  const allPosts = await getAllBlogPosts();
  const featuredPost = allPosts.find((p) => p.frontmatter.featured) ?? allPosts[0];
  const recentPosts = allPosts
    .filter((p) => p.slug !== featuredPost?.slug)
    .slice(0, 3);

  return (
    <div className="-mt-10 -mb-16 pb-0">
      <ScrollOnHash hash="#book" />

      {/* HERO */}
      <section
        className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen flex items-center overflow-hidden"
        aria-label="Hero"
        style={{ backgroundColor: "#1a1614" }}
      >
        <div className="relative z-10 w-full max-w-3xl mx-auto px-4 sm:px-6 py-28 sm:py-36 text-center">
          {/* SEO H1 — rendered as a newspaper flag kicker */}
          <h1 className="mx-auto flex max-w-xl items-center justify-center gap-3 px-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9a8d7d] sm:gap-4 sm:px-0 sm:text-[11px] sm:tracking-[0.3em]">
            <span className="hidden h-px w-8 bg-[#3a312b] sm:block" aria-hidden />
            <span>
              Tarot &amp; Astrology &middot; Readings, Writings, &amp; Tools
            </span>
            <span className="hidden h-px w-8 bg-[#3a312b] sm:block" aria-hidden />
          </h1>

          {/* Wordmark */}
          <p className="mt-8 font-heading text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl text-[var(--color-bone)] leading-[0.95]">
            Ordinary Mystic
          </p>

          {/* Italic tagline */}
          <p className="mt-7 font-heading text-lg italic sm:text-xl leading-relaxed max-w-xl mx-auto text-[#c9bba8]">
            Finding meaning in the patterns of ordinary life.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link href="/blog">
              <Button
                type="button"
                size="lg"
                className="rounded-none bg-[var(--color-oxblood)] text-[var(--color-bone)] hover:bg-[var(--color-oxblood-hover)]"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                Read the Blog
              </Button>
            </Link>
            <Link href="/book">
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="rounded-none border-[#9a8d7d] bg-transparent text-[#f5f0e8] hover:bg-white/5"
              >
                Book a reading
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* BLOG */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "var(--color-bone)" }}
      >
        <Container className="px-4 sm:px-6">
          {/* Featured — magazine lede treatment */}
          {featuredPost ? (
            <article className="border-t-2 border-[var(--color-ink)] pt-8 sm:pt-10">
              <div className="flex items-center gap-3">
                {featuredPost.frontmatter.category ? (
                  <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
                    {formatCategory(featuredPost.frontmatter.category)}
                  </span>
                ) : null}
                <span className="h-px flex-1 bg-[var(--color-rule)]" aria-hidden />
                <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-muted)]">
                  {formatDate(featuredPost.frontmatter.date)}
                </span>
              </div>
              <h2 className="mt-6 font-heading text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl text-[var(--color-ink)] leading-[1.1] max-w-3xl">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="transition-colors hover:text-[var(--color-oxblood)]"
                >
                  {featuredPost.frontmatter.title}
                </Link>
              </h2>
              <p className="mt-5 text-base sm:text-lg leading-relaxed text-[var(--color-muted)] max-w-2xl line-clamp-3">
                {featuredPost.frontmatter.description}
              </p>
              <Link
                href={`/blog/${featuredPost.slug}`}
                className="mt-6 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
              >
                Read Article
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ) : null}

          {/* Secondary — three-column newspaper grid */}
          {recentPosts.length > 0 ? (
            <div className="mt-16 grid border-t border-[var(--color-rule)] divide-y divide-[var(--color-rule)] md:grid-cols-3 md:divide-y-0 md:divide-x md:divide-[var(--color-rule)]">
              {recentPosts.map((post) => (
                <article
                  key={post.slug}
                  className="flex flex-col pt-8 pb-8 md:px-7 md:pb-2 md:first:pl-0 md:last:pr-0"
                >
                  {post.frontmatter.category ? (
                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
                      {formatCategory(post.frontmatter.category)}
                    </span>
                  ) : null}
                  <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="transition-colors hover:text-[var(--color-oxblood)]"
                    >
                      {post.frontmatter.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-muted)] line-clamp-3">
                    {post.frontmatter.description}
                  </p>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-5 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
                  >
                    Read Article
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </article>
              ))}
            </div>
          ) : null}

          <div className="mt-14 text-center">
            <Link href="/blog">
              <Button
                type="button"
                size="sm"
                className="rounded-none bg-[var(--color-oxblood)] text-[var(--color-bone)] hover:bg-[var(--color-oxblood-hover)]"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                All Posts
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* ABOUT */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{
          backgroundColor: "var(--color-bone-raised)",
          borderTop: "1px solid var(--color-rule)",
          borderBottom: "1px solid var(--color-rule)",
        }}
      >
        <Container className="px-4 sm:px-6">
          <div className="grid gap-10 md:grid-cols-12 md:gap-12">
            <div className="md:col-span-4">
              <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
                <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
                About
              </span>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-[var(--color-ink)] leading-[1.1]">
                About Ordinary Mystic
              </h2>
            </div>
            <div className="md:col-span-8 md:border-l md:border-[var(--color-rule)] md:pl-10 space-y-5">
              <p className="font-heading text-xl sm:text-2xl leading-snug text-[var(--color-ink)] first-letter:font-heading first-letter:text-5xl first-letter:font-semibold first-letter:float-left first-letter:mr-2 first-letter:leading-[0.9] first-letter:mt-1">
                Hi, I&apos;m Tyler. I use Tarot and astrology as pattern-recognition tools, structured ways to map timing, friction, and possibility. No scripts about fate. No vague predictions. Just clear thinking applied to symbolic systems that have been around longer than most of us give them credit for.
              </p>
              <p className="text-base leading-relaxed text-[var(--color-muted)]">
                I write about how these systems actually work when you strip the theatrics away, and I build tools for practitioners who want to track and deepen their practice over time.
              </p>
              <Link
                href="/about"
                className="inline-flex items-center gap-2 pt-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
              >
                More About the Project
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* QUERENT */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "#1a1614" }}
      >
        <Container className="px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9bba8]">
              <span className="h-px w-6 bg-[#c9bba8]" aria-hidden />
              In Development
              <span className="h-px w-6 bg-[#c9bba8]" aria-hidden />
            </span>
            <h2 className="mt-6 font-heading text-4xl font-semibold tracking-tight sm:text-5xl text-[var(--color-bone)]">
              Querent
            </h2>
            <p className="mt-4 font-heading text-lg italic text-[#c9bba8]">
              A reading companion that learns you.
            </p>
            <div
              className="mx-auto mt-8 h-px w-12 bg-[var(--color-oxblood)]"
              aria-hidden
            />
            <p className="mt-8 text-base sm:text-lg leading-relaxed max-w-lg mx-auto text-[#9a8d7d]">
              Software for tarot and astrology practitioners who want better tools for logging readings, tracking patterns, and building a personal reference system that grows with their practice.
            </p>
            <div className="mt-10 w-full">
              <p className="mb-6 text-sm leading-relaxed text-[#9a8d7d]">
                Subscribe to the weekly astrology letter and be first to know when Querent beta launches.
              </p>
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </section>

      {/* TOOLS */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "var(--color-bone)" }}
      >
        <Container className="px-4 sm:px-6">
          <div>
            <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
              <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
              Tools
            </span>
            <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-[var(--color-ink)] leading-[1.1]">
              Tools for Practitioners
            </h2>
            <p className="mt-4 text-base sm:text-lg leading-relaxed max-w-2xl text-[var(--color-muted)]">
              Systems and software for people who want to track and deepen their practice over time, not just move through it.
            </p>
          </div>

          <div className="mt-12 border-y border-[var(--color-ink)] grid md:grid-cols-3 md:divide-x md:divide-[var(--color-rule)]">
            <div className="p-7 md:p-8 flex flex-col gap-5 border-b md:border-b-0 border-[var(--color-rule)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Notion Template &middot; $12
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
                  Simple Tarot Journal
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                A searchable Notion template to log readings and card pulls, build a living card library, and surface past insights when you need them.
              </p>
              <div className="mt-auto pt-1">
                <Link
                  href="https://ordinarymystic.gumroad.com/l/tarotjournal"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button type="button" size="sm" className="rounded-none">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-7 md:p-8 flex flex-col gap-5 border-b md:border-b-0 border-[var(--color-rule)]">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Notion Template &middot; $32
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
                  Complete Tarot Dashboard
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                Advanced Notion system to track readings in full detail, with upright and reversed cards, contextual meanings, and statistics that deepen over time.
              </p>
              <div className="mt-auto pt-1">
                <Link
                  href="https://ordinarymystic.gumroad.com/l/tarotdashboard"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button type="button" size="sm" className="rounded-none">
                    Buy Now
                  </Button>
                </Link>
              </div>
            </div>

            <div className="p-7 md:p-8 flex flex-col gap-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-muted)]">
                  Free Web App
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight text-[var(--color-ink)] leading-snug">
                  Digital Tarot
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                A free desktop web app to shuffle, pull, and rearrange tarot cards. Currently in beta.
              </p>
              <div className="mt-auto pt-1">
                <Link href={DIGITAL_TAROT_APP_URL} target="_blank" rel="noopener noreferrer">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="rounded-none"
                    rightIcon={<ExternalLink className="h-4 w-4" />}
                  >
                    Try Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
            >
              Browse All Resources
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
            </Link>
          </div>
        </Container>
      </section>

      {/* WORK WITH ME — rate card */}
      <section
        id="book"
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "var(--color-bone-raised)" }}
      >
        <Container className="px-4 sm:px-6">
          <div className="grid gap-8 md:grid-cols-12 md:items-end md:gap-12">
            <div className="md:col-span-5">
              <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
                <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
                Readings
              </span>
              <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight sm:text-4xl text-[var(--color-ink)] leading-[1.1]">
                Work With Me
              </h2>
            </div>
            <p className="md:col-span-7 text-base leading-relaxed text-[var(--color-muted)]">
              One-on-one readings for people who want a structured conversation, not a performance. Tarot or astrology, delivered as a written report or recorded video.
            </p>
          </div>

          <div className="mt-12 border-y border-[var(--color-ink)] grid md:grid-cols-2 md:divide-x md:divide-[var(--color-rule)]">
            {[
              {
                name: "Tarot",
                price: "From $25",
                description:
                  "Quick pulls, full written spreads, or recorded video readings. No birth data required.",
              },
              {
                name: "Astrology",
                price: "From $65",
                description:
                  "Hellenistic natal chart interpretation and transit forecasting, delivered as a written report. Requires accurate birth time.",
              },
            ].map((offer, index) => (
              <div
                key={offer.name}
                className={`p-7 md:p-8 flex flex-col gap-4 ${
                  index < 1 ? "border-b md:border-b-0 border-[var(--color-rule)]" : ""
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-[var(--color-ink)]">
                    {offer.name}
                  </h3>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-ink)]">
                    {offer.price}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                  {offer.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/book">
              <Button
                type="button"
                size="md"
                className="rounded-none bg-[var(--color-oxblood)] text-[var(--color-bone)] hover:bg-[var(--color-oxblood-hover)]"
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                See All Reading Options
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </div>
  );
}
