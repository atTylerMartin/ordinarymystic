import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/button";
import { CONTACT_EMAIL } from "@/lib/config";
import { THANKS_RECORDED as C } from "@/lib/content/readings";
import { NOINDEX } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Thanks for booking",
  description:
    "Your recorded reading is booked. Send any context by email; the reading arrives within three business days.",
  ...NOINDEX,
};

const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
  C.mailtoSubject,
)}&body=${encodeURIComponent(C.mailtoBody)}`;

export default function ThanksRecordedPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {C.title}
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>{C.have}</p>
        <p>{C.context}</p>
      </div>
      <p>
        <a href={mailto}>
          <Button type="button" leftIcon={<Mail className="h-4 w-4" />}>
            {C.mailtoLabel}
          </Button>
        </a>
      </p>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>{C.delivery}</p>
        <p>{C.astrology}</p>
        <p>
          Questions before then? Write to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-medium text-slate-900 underline-offset-4 hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
      <p>
        <Link
          href="/"
          className="text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
        >
          Back to home
        </Link>
      </p>
    </div>
  );
}
