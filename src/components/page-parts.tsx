import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** H1 plus an optional kicker and lede, for the readings, about and FAQ pages. */
export function PageHeader({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <header className="space-y-3">
      {kicker ? (
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">{kicker}</p>
      ) : null}
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h1>
      {children ? (
        <div className="max-w-3xl space-y-3 text-base leading-relaxed text-slate-700">
          {children}
        </div>
      ) : null}
    </header>
  );
}

export function SectionHeading({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      id={id}
      className={cn(
        "scroll-mt-24 font-heading text-2xl font-black tracking-tight text-slate-900",
        className,
      )}
    >
      {children}
    </h2>
  );
}

/** Body copy in the page column. */
export function Prose({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("max-w-3xl space-y-4 text-sm leading-relaxed text-slate-700 sm:text-base", className)}>
      {children}
    </div>
  );
}

/** An internal "read more" link with a chevron. */
export function ArrowLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-800 underline-offset-4 hover:text-slate-900 hover:underline"
    >
      {children}
      <ChevronRight className="h-4 w-4" aria-hidden />
    </Link>
  );
}
