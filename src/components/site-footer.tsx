import Link from "next/link";
import { BookOpen } from "lucide-react";
import { Container } from "@/components/container";
import { TrackedLink } from "@/components/tracked-link";
import { FOOTER_COLUMNS, FOOTER_TAGLINE, type NavLink } from "@/lib/content/nav";

const linkClass = "text-slate-200 underline-offset-4 hover:text-white hover:underline";

function FooterLink({ link }: { link: NavLink }) {
  const label = (
    <>
      {link.label}
      {link.note ? <span className="text-slate-400"> ({link.note})</span> : null}
    </>
  );

  if (link.track) {
    const external = link.external
      ? { target: "_blank", rel: "noopener noreferrer" }
      : {};
    return (
      <TrackedLink
        href={link.href}
        event={{ type: "social_tap", label: link.track }}
        className={`${linkClass}${link.href.startsWith("mailto:") ? " break-all" : ""}`}
        {...external}
      >
        {label}
      </TrackedLink>
    );
  }
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
        {label}
      </a>
    );
  }
  if (link.href.startsWith("mailto:")) {
    return (
      <a href={link.href} className={`${linkClass} break-all`}>
        {label}
      </a>
    );
  }
  return (
    <Link href={link.href} className={linkClass}>
      {label}
    </Link>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0d0c14] py-10">
      <Container className="space-y-8">
        <div className="flex items-center gap-2 text-sm font-medium text-white">
          <BookOpen className="h-4 w-4 text-slate-400" aria-hidden />
          <span>{FOOTER_TAGLINE}</span>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-label={column.heading}>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {column.heading}
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <FooterLink link={link} />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </Container>
    </footer>
  );
}
