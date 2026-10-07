"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { trackPayPaid } from "@/lib/analytics";
import { STREAM_COPY } from "@/lib/offerings";

// Stripe Payment Links redirect to /pay?paid=1. Read client-side, since the
// page is a static export.
export function PaidNotice() {
  const params = useSearchParams();
  const paid = params.get("paid") === "1";
  const fired = useRef(false);

  // Once per page load, even if the effect runs twice in development.
  useEffect(() => {
    if (!paid || fired.current) return;
    fired.current = true;
    trackPayPaid();
  }, [paid]);

  if (!paid) return null;

  return (
    <p
      role="status"
      className="flex items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-900"
    >
      <CheckCircle className="h-4 w-4 shrink-0" aria-hidden />
      {STREAM_COPY.paid}
    </p>
  );
}
