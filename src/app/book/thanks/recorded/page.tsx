import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/config";

export const metadata: Metadata = {
  title: "Thanks for booking",
  description: "Your recorded reading is confirmed. You'll receive your video and notes once it's ready.",
};

export default function ThanksRecordedPage() {
  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        Thanks for booking!
      </h1>
      <div className="space-y-4 text-sm leading-relaxed text-slate-700">
        <p>
          Your <strong className="text-slate-900">recorded reading</strong> is
          confirmed. I should have everything I need from you—if I need any
          follow-up or clarification, I&apos;ll get in touch.
        </p>
        <p>
          I&apos;ll read privately, off camera, and take the time to sit with the
          patterns before I say anything about them. You&apos;ll receive a
          personalized video walkthrough of the reading plus a written synthesis
          you can keep and come back to.
        </p>
        <p>
          If you have questions before you hear from me, reach out at{" "}
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
