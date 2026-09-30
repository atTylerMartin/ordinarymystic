import type { Guide } from "@/lib/content";

export const CATEGORY_LABELS: Record<Guide["frontmatter"]["category"], string> = {
  tarot: "Tarot",
  astrology: "Astrology",
  "general-spirituality": "Getting started",
};

// "Updated September 2026 · 6 min read". UTC so a date-only ISO string never
// slips a day (and so a month) at build.
export function formatMonthYear(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function GuideMeta({
  guide,
  showPublished = false,
}: {
  guide: Guide;
  /** Guide pages add "Published Month Year" when it differs from Updated. */
  showPublished?: boolean;
}) {
  const { date, updated } = guide.frontmatter;
  const published = formatMonthYear(date);
  const showBoth = showPublished && published !== formatMonthYear(updated);

  return (
    <p className="text-xs text-slate-500">
      <time dateTime={updated}>{`Updated ${formatMonthYear(updated)}`}</time>
      {` · ${guide.readingMinutes} min read`}
      {showBoth && (
        <span className="ml-2 text-[11px] text-slate-400">
          <time dateTime={date}>{`Published ${published}`}</time>
        </span>
      )}
    </p>
  );
}
