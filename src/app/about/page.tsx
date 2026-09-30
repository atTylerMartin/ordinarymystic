import Image from "next/image";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { FaqList } from "@/components/faq-list";
import { ArrowLink, Prose, SectionHeading } from "@/components/page-parts";
import { ABOUT as C } from "@/lib/content/about";
import { faqItems } from "@/lib/content/faq";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <div className="space-y-14">
      <div>
        <Breadcrumbs path="/about" />
        {/* The Person schema's @id is /about#tyler-martin. */}
        <section id="tyler-martin" className="scroll-mt-24 space-y-8">
          <header className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {/* TODO headshot: swap for a real headshot once one is supplied. */}
            <Image
              src={C.image}
              alt={C.imageAlt}
              width={160}
              height={160}
              priority
              className="h-32 w-32 shrink-0 rounded-full object-cover shadow-md sm:h-40 sm:w-40"
            />
            <div className="space-y-2">
              <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
                {C.kicker}
              </p>
              <h1 className="font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
                {C.h1}
              </h1>
              <p className="text-base text-slate-700">{C.tagline}</p>
            </div>
          </header>

          <Prose>
            {C.bio.map((p) => (
              <p key={p}>{p}</p>
            ))}
            <p>
              {C.brands.before}
              <a
                href={C.brands.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-slate-900 underline underline-offset-4"
              >
                {C.brands.linkLabel}
              </a>
              {C.brands.after}
            </p>
            <p>{C.audiences}</p>
          </Prose>

          <p className="flex flex-wrap gap-x-6 gap-y-2">
            {C.links.map((l) => (
              <ArrowLink key={l.href} href={l.href}>
                {l.label}
              </ArrowLink>
            ))}
          </p>
        </section>
      </div>

      <section className="space-y-4">
        <SectionHeading>{C.faqTitle}</SectionHeading>
        <FaqList items={faqItems(C.faqIds)} />
        <ArrowLink href="/faq">{C.faqMore}</ArrowLink>
      </section>
    </div>
  );
}
