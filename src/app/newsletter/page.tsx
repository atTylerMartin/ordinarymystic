import Link from "next/link";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { Card } from "@/components/card";
import { NewsletterForm } from "@/components/newsletter-form";
import { PageHeader, Prose, SectionHeading } from "@/components/page-parts";
import { NEWSLETTER_PAGE as C } from "@/lib/content/newsletter";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/newsletter");

export default function NewsletterPage() {
  return (
    <div className="space-y-12">
      <div>
        <Breadcrumbs path="/newsletter" />
        <PageHeader kicker={C.kicker} title={C.h1}>
          <p>{C.lede}</p>
        </PageHeader>
      </div>

      <Card className="max-w-md">
        <NewsletterForm />
      </Card>

      <section className="space-y-4">
        <SectionHeading>{C.expectHeading}</SectionHeading>
        <ul className="grid gap-4 md:grid-cols-3">
          {C.expect.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{item.body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <SectionHeading>{C.privacyHeading}</SectionHeading>
        <Prose>
          <p>
            {C.privacy}{" "}
            <Link
              href="/privacy"
              className="font-medium text-slate-900 underline-offset-4 hover:underline"
            >
              {C.privacyLinkLabel}
            </Link>
            .
          </p>
        </Prose>
      </section>
    </div>
  );
}
