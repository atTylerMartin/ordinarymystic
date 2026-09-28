import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getRoute } from "@/lib/routes";
import { BreadcrumbSchema } from "@/components/structured-data";

function trail(path: string) {
  const items = [];
  let current: string | undefined = path;
  while (current) {
    const route = getRoute(current);
    items.unshift(route);
    current = route.parent;
  }
  return items;
}

/** Visible breadcrumb nav plus `BreadcrumbSchema`, both driven by `parent`
 * links in `routes.ts`. Render on every registered page except `/`. */
export function Breadcrumbs({ path }: { path: string }) {
  const items = trail(path);

  return (
    <>
      <BreadcrumbSchema path={path} />
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-xs text-slate-500">
          {items.map((route, i) => {
            const isLast = i === items.length - 1;
            return (
              <li key={route.path} className="flex items-center gap-1">
                {i > 0 && (
                  <ChevronRight className="h-3 w-3 text-slate-400" aria-hidden />
                )}
                {isLast ? (
                  <span className="font-medium text-slate-700">
                    {route.label}
                  </span>
                ) : (
                  <Link
                    href={route.path}
                    className="hover:text-slate-700 hover:underline underline-offset-4"
                  >
                    {route.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
