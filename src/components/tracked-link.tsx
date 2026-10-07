"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { fireTrackedEvent, type TrackedEvent } from "@/lib/analytics";

type TrackedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  href: string;
  event: TrackedEvent;
};

/** An anchor that fires a GA4 event on click. Internal hrefs render a Next
 * `Link`; external, hash-less protocols (https, mailto) render a plain `<a>`.
 * Server components keep their markup and pass the event as plain data. */
export function TrackedLink({ href, event, onClick, children, ...rest }: TrackedLinkProps) {
  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (e) => {
    fireTrackedEvent(event);
    onClick?.(e);
  };

  if (href.startsWith("/")) {
    return (
      <Link href={href} onClick={handleClick} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  );
}
