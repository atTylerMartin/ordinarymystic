import type { FaqItem } from "@/lib/content/faq";
import { cn } from "@/lib/utils";

/** A visible FAQ: every answer on the page, no disclosure. Carries no schema;
 * the one FAQPage lives on /faq (`FaqSchema`). */
export function FaqList({
  items,
  className,
}: {
  items: FaqItem[];
  className?: string;
}) {
  return (
    <dl className={cn("divide-y divide-slate-200 border-y border-slate-200", className)}>
      {items.map((item) => (
        <div
          key={item.id}
          id={item.id}
          className="grid scroll-mt-24 gap-2 py-5 md:grid-cols-[2fr_3fr] md:gap-8"
        >
          <dt className="font-heading text-base font-bold tracking-tight text-slate-900">
            {item.question}
          </dt>
          <dd className="text-sm leading-relaxed text-slate-700">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
