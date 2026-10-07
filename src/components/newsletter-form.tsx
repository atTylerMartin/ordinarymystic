"use client";

import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/button";
import { trackNewsletterSignup } from "@/lib/analytics";
import { NEWSLETTER as C } from "@/lib/content/newsletter";
import { signupContext, subscribe } from "@/lib/newsletter";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300";

/** The one signup form, used on /newsletter, /links, the homepage band and
 * under every guide. Same visual language as the review form; wrap it in a
 * `Card` where it needs one. It never throws: with Supabase unconfigured or an
 * insert that fails it shows the error line and the page carries on. */
export function NewsletterForm({
  headingLevel = "h2",
  hideHeading = false,
}: {
  headingLevel?: "h2" | "h3";
  hideHeading?: boolean;
}) {
  const id = useId();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"ok" | "duplicate" | null>(null);

  const Heading = headingLevel;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const data = new FormData(e.currentTarget);
    const email = ((data.get("email") as string) || "").trim();
    const firstName = ((data.get("first_name") as string) || "").trim();
    // Honeypot: real people never fill this hidden field.
    const honeypot = ((data.get("company") as string) || "").trim();

    if (!email) {
      setError(C.error);
      return;
    }

    setPending(true);
    const result = await subscribe({ email, firstName, honeypot });
    setPending(false);

    if (result === "error") {
      setError(C.error);
      return;
    }

    // Bots (honeypot) and repeat signups see success but are not counted.
    if (result === "ok" && !honeypot) {
      const { source, campaign } = signupContext();
      trackNewsletterSignup({ campaign, source });
    }
    setDone(result);
  }

  if (done) {
    return (
      <p role="status" className="text-sm font-medium text-slate-900">
        {done === "duplicate" ? C.duplicate : C.success}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      {hideHeading ? null : (
        <>
          <Heading className="text-base font-semibold text-slate-900">{C.heading}</Heading>
          <p className="mt-1 text-sm text-slate-600">{C.body}</p>
        </>
      )}

      {/* Honeypot, hidden from real users */}
      <div className="absolute left-[-9999px]" aria-hidden>
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor={`${id}-email`} className="block text-sm font-medium text-slate-700">
            {C.emailLabel}
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            placeholder={C.emailPlaceholder}
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor={`${id}-first-name`} className="block text-sm font-medium text-slate-700">
            {C.firstNameLabel}
          </label>
          <input
            id={`${id}-first-name`}
            name="first_name"
            type="text"
            maxLength={80}
            autoComplete="given-name"
            placeholder={C.firstNamePlaceholder}
            className={inputClass}
          />
        </div>

        {error ? (
          <p role="alert" className="text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={pending} className="w-full">
          {pending ? C.pending : C.button}
        </Button>

        <p className="text-xs text-slate-500">{C.privacy}</p>
      </div>
    </form>
  );
}
