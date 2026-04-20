import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "About – Tarot Reader & Astrologer",
  description:
    "Who is Ordinary Mystic, why it exists, and how Tyler Martin approaches tarot, astrology, and building tools for serious practitioners.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
};

const faqs = [
  {
    question: "What do you mean by 'structured thinking'?",
    answer:
      "Tarot and astrology give you a vocabulary for things that are hard to articulate: timing, tension, patterns that keep repeating. I treat them as frameworks for organizing what you already sense but haven't named yet. That's structured thinking, taking the vague and making it legible.",
  },
  {
    question: "Do you predict the future?",
    answer:
      "No. I talk about timing, tendencies, and patterns, but you always keep agency. Instead of \"this will happen,\" we focus on \"here is what might be useful to pay attention to right now.\"",
  },
  {
    question: "What happens in a reading?",
    answer:
      "We start by clarifying your questions and context. From there, we look at cards or your chart together, translating symbolism into clear language and practical takeaways. You can ask follow-up questions at any point, since it's a dialogue, not a monologue.",
  },
  {
    question: "Who is this for?",
    answer:
      "People who are curious about tarot and astrology but put off by the theatrics. Skeptics who are open to useful frameworks. Practitioners who want better tools and clearer thinking. If you want signal over noise, you're in the right place.",
  },
  {
    question: "What's Querent?",
    answer:
      "Querent is software I'm building for tarot and astrology practitioners, a reading companion that helps you log, review, and deepen your practice over time. It's still early. The ideas get tested in real readings first, then written about, then built.",
  },
];

const workItems = [
  {
    eyebrow: "Writing",
    title: "The Blog",
    description:
      "Essays on how tarot and astrology work as thinking tools. Grounded, practical, and without the mystical theater.",
    href: "/blog",
    cta: "Read the Blog",
  },
  {
    eyebrow: "Tools",
    title: "Resources",
    description:
      "Notion templates, a digital tarot app, and Querent, software for logging and deepening your practice.",
    href: "/resources",
    cta: "Browse Tools",
  },
  {
    eyebrow: "Readings",
    title: "Work With Me",
    description:
      "One-on-one sessions where we work through your questions together. Collaborative, grounded, practical.",
    href: "/book",
    cta: "See Options",
  },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        eyebrow="About"
        title="About Ordinary Mystic"
        description="Who is Ordinary Mystic, why it exists, and how tarot and astrology can be treated as frameworks for thinking, not as predictions, performances, or fate."
      />

      {/* Philosophy */}
      <section className="max-w-3xl">
        <p className="font-heading text-xl leading-snug text-[var(--color-ink)] first-letter:float-left first-letter:mr-2 first-letter:mt-1 first-letter:text-4xl first-letter:font-semibold first-letter:leading-[0.9] sm:text-2xl sm:first-letter:text-5xl">
          I&apos;m Tyler. I use tarot and astrology as pattern-recognition tools, structured ways to map timing, friction, and possibility in ordinary life. I write about how these systems actually work when you strip the theatrics away, and I build tools for practitioners who want to track and deepen their practice over time.
        </p>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          Ordinary Mystic started with a question:{" "}
          <em className="font-heading not-italic font-semibold text-[var(--color-ink)]">
            what if readings were treated like structured conversations instead of performances?
          </em>{" "}
          That question shaped everything, from how sessions are framed to how I write to what I&apos;m building next.
        </p>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          In practice, that means using tarot and astrology as languages for pattern and timing, not as scripts for fate. Readings are collaborative: you bring your context and questions, the cards and charts bring structure, and together we look for perspectives and possibilities that feel grounded in your actual life.
        </p>
        <p className="mt-5 text-base leading-relaxed text-[var(--color-muted)] sm:text-lg">
          You&apos;ll never hear that something is &ldquo;meant to be&rdquo; or that you&apos;re locked into a particular path. Instead, we talk about options, trade-offs, and experiments you can try in the real world.
        </p>
      </section>

      {/* Current work */}
      <section className="mt-16 sm:mt-20">
        <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
          <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
          Current Work
        </span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight leading-[1.1] text-[var(--color-ink)] sm:text-4xl">
          What I&apos;m working on
        </h2>

        <div className="mt-10 grid border-y border-[var(--color-ink)] md:grid-cols-3 md:divide-x md:divide-[var(--color-rule)]">
          {workItems.map((item, index) => (
            <article
              key={item.href}
              className={`flex flex-col gap-4 p-7 md:p-8 ${
                index < workItems.length - 1
                  ? "border-b border-[var(--color-rule)] md:border-b-0"
                  : ""
              }`}
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
                  {item.eyebrow}
                </p>
                <h3 className="mt-3 font-heading text-xl font-semibold tracking-tight leading-snug text-[var(--color-ink)]">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-[var(--color-muted)]">
                {item.description}
              </p>
              <Link
                href={item.href}
                className="mt-auto inline-flex items-center gap-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-[var(--color-oxblood)] transition-colors hover:text-[var(--color-oxblood-hover)]"
              >
                {item.cta}
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mt-16 sm:mt-20">
        <span className="inline-flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[var(--color-oxblood)]">
          <span className="h-px w-6 bg-[var(--color-oxblood)]" aria-hidden />
          Common Questions
        </span>
        <h2 className="mt-4 font-heading text-3xl font-semibold tracking-tight leading-[1.1] text-[var(--color-ink)] sm:text-4xl">
          Frequently asked
        </h2>

        <div className="mt-10 divide-y divide-[var(--color-rule)] border-t-2 border-[var(--color-ink)]">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="grid gap-3 py-7 md:grid-cols-[1fr_2fr] md:gap-10"
            >
              <h3 className="font-heading text-lg font-semibold tracking-tight leading-snug text-[var(--color-ink)] sm:text-xl">
                {item.question}
              </h3>
              <p className="text-base leading-relaxed text-[var(--color-muted)]">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
