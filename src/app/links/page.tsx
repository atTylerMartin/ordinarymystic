import type { Metadata } from "next";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { Card } from "@/components/card";
import { NewsletterForm } from "@/components/newsletter-form";
import { TrackedLink } from "@/components/tracked-link";
import { listGuides } from "@/lib/content";
import {
  BOOKING_ROWS,
  LINKS_COPY,
  SOCIAL_ROWS,
  TOOL_ROWS,
  TULSA_ROW,
  type LinkRow,
} from "@/lib/content/links";
import { NOINDEX } from "@/lib/metadata";

// The TikTok bio page. It only repeats links that live elsewhere, so it stays
// out of search and out of the route registry and the sitemap. Same column as
// /pay.
export const metadata: Metadata = {
  ...NOINDEX,
  title: "Links",
  alternates: { canonical: "/links" },
};

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

function Row({ row }: { row: LinkRow }) {
  return (
    <TrackedLink
      href={row.href}
      event={{ type: "link_tap", label: row.label }}
      {...(row.external ? external : {})}
      className="group flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-white px-5 py-3 text-left shadow-md transition-colors hover:border-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      <span className="flex flex-col gap-0.5">
        <span className="text-base font-semibold text-slate-900">{row.title}</span>
        <span className="line-clamp-2 text-sm leading-snug text-slate-600">{row.body}</span>
      </span>
      <ChevronRight
        className="h-5 w-5 shrink-0 text-slate-400 transition-colors group-hover:text-slate-700"
        aria-hidden
      />
    </TrackedLink>
  );
}

function Group({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3" aria-label={heading}>
      <h2 className="text-center text-xs font-semibold uppercase tracking-widest text-slate-500">
        {heading}
      </h2>
      {children}
    </section>
  );
}

export default function LinksPage() {
  const guides = listGuides("guides").slice(0, 3);

  return (
    <div className="mx-auto flex max-w-md flex-col gap-6">
      {/* ── Masthead ─────────────────────────────────────────────────────── */}
      <header className="flex flex-col items-center gap-3 text-center">
        <Image
          src="/images/profile-img.png"
          alt=""
          width={96}
          height={96}
          priority
          className="h-24 w-24 rounded-full object-cover ring-2 ring-[#213752] ring-offset-4 ring-offset-[#f5f4f2]"
        />
        <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900">
          {LINKS_COPY.brand}
        </h1>
        <p className="text-base leading-relaxed text-slate-700">{LINKS_COPY.lede}</p>
      </header>

      {/* ── Booking ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3">
        {BOOKING_ROWS.map((row) => (
          <Row key={row.label} row={row} />
        ))}
      </div>

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <Card className="px-5 py-4">
        <NewsletterForm />
      </Card>

      {/* ── Free tools ───────────────────────────────────────────────────── */}
      <Group heading={LINKS_COPY.toolsHeading}>
        {TOOL_ROWS.map((row) => (
          <Row key={row.label} row={row} />
        ))}
      </Group>

      {/* ── Newest guides ────────────────────────────────────────────────── */}
      {guides.length > 0 ? (
        <Group heading={LINKS_COPY.guidesHeading}>
          {guides.map((guide) => (
            <Row
              key={guide.slug}
              row={{
                label: `guide-${guide.slug}`,
                title: guide.frontmatter.title,
                body: guide.frontmatter.description,
                href: `/guides/${guide.slug}`,
              }}
            />
          ))}
        </Group>
      ) : null}

      {/* ── Tulsa, then the channels ─────────────────────────────────────── */}
      <Row row={TULSA_ROW} />
      <Group heading={LINKS_COPY.moreHeading}>
        {SOCIAL_ROWS.map((row) => (
          <Row key={row.label} row={row} />
        ))}
      </Group>
    </div>
  );
}
