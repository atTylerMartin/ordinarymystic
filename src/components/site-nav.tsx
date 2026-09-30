import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/button";
import { MobileNav } from "@/components/mobile-nav";
import { NAV_BOOK, NAV_LINKS } from "@/lib/content/nav";

const bookButtonClass =
  "bg-white text-[#151326] hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#151326]";

/** Header nav: the links from nav.ts plus the Book button. Desktop shows them
 * inline; below lg they sit in a disclosure menu. */
export function SiteNav() {
  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-slate-200 underline-offset-8 hover:text-white hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <Link href={NAV_BOOK.href}>
        <Button
          type="button"
          size="sm"
          className={bookButtonClass}
          leftIcon={<CalendarDays className="h-4 w-4" />}
        >
          <span className="sm:hidden">Book</span>
          <span className="hidden sm:inline">{NAV_BOOK.label}</span>
        </Button>
      </Link>

      <MobileNav links={NAV_LINKS} />
    </div>
  );
}
