import Link from "next/link";
import type { GuideFrontmatter } from "@/lib/content";
import { RECORDED_COPY } from "@/lib/offerings";
import { buttonVariants } from "@/components/button";
import { cn } from "@/lib/utils";

// One sentence from the recorded-reading lede: the clause that says what
// comes back. Taken from offerings.ts so the description is never retyped.
const DEFAULT_BODY =
  (RECORDED_COPY.lede
    .split(/(?<=\.)\s+/)
    .find((sentence) => sentence.startsWith("What comes back")) ?? RECORDED_COPY.lede)
    .split(",")[0]
    .replace(/\.$/, "") + ".";

/** The booking prompt under every guide. Each field can be overridden from
 * frontmatter; the defaults point at recorded readings. WP-3 moves the
 * default URL to /readings/recorded. No UTM on internal links. */
export function GuideCta({ fm }: { fm: GuideFrontmatter }) {
  const eyebrow = fm.ctaEyebrow ?? "Want a personal reading?";
  const title = fm.ctaTitle ?? "Book a recorded reading";
  const body = fm.ctaBody ?? DEFAULT_BODY;
  const label = fm.ctaLabel ?? RECORDED_COPY.cta;
  const url = fm.ctaUrl ?? "/#book";

  return (
    <section className="rounded-2xl bg-gradient-to-br from-[var(--color-brand-deep)] to-[var(--color-brand-mid)] p-6 text-white shadow-md sm:p-8">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-300">
        {eyebrow}
      </p>
      <h2 className="mt-2 font-heading text-xl font-bold tracking-tight sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-200">{body}</p>
      <Link
        href={url}
        className={cn(
          buttonVariants(),
          "mt-4 bg-white text-slate-900 hover:bg-slate-200 focus-visible:ring-white",
        )}
      >
        {label}
      </Link>
    </section>
  );
}
