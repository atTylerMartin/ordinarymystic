import type { ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { Button, buttonVariants } from "@/components/button";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/card";
import { RecordedTiers, TulsaCrosslink } from "@/components/booking-section";
import { Container } from "@/components/container";
import { CATEGORY_LABELS, GuideMeta } from "@/components/guide-meta";
import { ArrowLink } from "@/components/page-parts";
import { ReviewsSection } from "@/components/reviews-section";
import { ScrollOnHash } from "@/components/scroll-on-hash";
import { ReadingServiceSchema } from "@/components/structured-data";
import { listGuides } from "@/lib/content";
import { HOME as C } from "@/lib/content/home";
import { CONTACT_EMAIL, SITE_LIVE_MODE, SOCIALS, TIKTOK_URL } from "@/lib/config";
import { pageMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";

export const metadata = pageMetadata("/");

const fullBleed = "relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen";
const sectionPadding = "py-16 sm:py-20";
const heroButton =
  "bg-white text-[#151326] hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#151326]";

function SectionIntro({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="text-sm font-medium uppercase tracking-widest text-slate-500">{kicker}</p>
      <h2 className="mt-2 font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
        {title}
      </h2>
      {children ? (
        <div className="mt-4 space-y-3 text-base leading-relaxed text-slate-700">{children}</div>
      ) : null}
    </div>
  );
}

const socialIcons = [
  { href: SOCIALS.youtube, label: "YouTube", icon: "/images/youtube-app-white-icon.png", external: true },
  { href: TIKTOK_URL, label: "TikTok", icon: "/images/tiktok-white-icon.png", external: true },
  { href: `mailto:${CONTACT_EMAIL}`, label: "Email", icon: "/images/email-white-icon.png", external: false },
];

export default function Home() {
  const guides = listGuides("guides").slice(0, 3);

  return (
    <div className="-mt-10 -mb-16 pb-0">
      {/* Old links and /pay point at these three anchors on /. */}
      <ScrollOnHash hash="#book" />
      <ScrollOnHash hash="#live" />
      <ScrollOnHash hash="#reviews" />
      <ReadingServiceSchema kind="recorded" />
      <ReadingServiceSchema kind="live" />

      {/* HERO */}
      <section
        className={`${fullBleed} min-h-[28rem] flex items-center overflow-hidden bg-gradient-to-br from-[#151326] via-[#1a2742] to-[#213752] ${SITE_LIVE_MODE ? "hero-live-pulse" : ""}`}
        aria-label="Hero"
      >
        <div
          className="hero-bg absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: "var(--hero-bg-image, none)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#151326]/90 via-[#1a2742]/90 to-[#213752]/90" aria-hidden />
        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-20 text-center">
          {SITE_LIVE_MODE ? (
            <Link
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-rose-300/40 bg-rose-400/10 px-3 py-1.5 text-sm font-medium text-rose-100 hover:bg-rose-400/20"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse" aria-hidden />
              Live on TikTok
            </Link>
          ) : null}
          <h1 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            {C.h1}
          </h1>
          <p className="mt-5 text-lg text-slate-200 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            {C.hero}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link href={C.heroPrimary.href}>
              <Button type="button" size="lg" className={heroButton}>
                {C.heroPrimary.label}
              </Button>
            </Link>
            <Link href={C.heroSecondary.href}>
              <Button
                type="button"
                size="lg"
                variant="outline"
                className="border-white/60 text-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-[#151326]"
              >
                {C.heroSecondary.label}
              </Button>
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            {socialIcons.map((s) => (
              <a
                key={s.label}
                href={s.href}
                {...(s.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="opacity-90 hover:opacity-100 transition-opacity"
                aria-label={s.label}
              >
                <Image src={s.icon} alt="" width={28} height={28} className="h-7 w-7" />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* RECORDED: the primary offer. Keeps #book. */}
      <section id="book" className={`${fullBleed} scroll-mt-16 ${sectionPadding}`} style={{ backgroundColor: "#faf8f6" }}>
        <Container className="px-4 sm:px-6">
          <SectionIntro kicker={C.recorded.kicker} title={C.recorded.title}>
            <p>{C.recorded.lede}</p>
          </SectionIntro>
          <RecordedTiers className="mt-10" />
          <p className="mt-4 text-center">
            <ArrowLink href={C.recorded.link.href}>{C.recorded.link.label}</ArrowLink>
          </p>
        </Container>
      </section>

      {/* TESTIMONIALS: keeps #reviews. */}
      <ReviewsSection id="reviews" fullBleed limit={3} moreHref="/testimonials" />

      {/* LIVE: keeps #live. */}
      <section id="live" className={`${fullBleed} scroll-mt-16 ${sectionPadding}`} style={{ backgroundColor: "#faf8f6" }}>
        <Container className="px-4 sm:px-6">
          <SectionIntro kicker={C.live.kicker} title={C.live.title}>
            <p>{C.live.lede}</p>
            <p className="text-sm text-slate-600">{C.live.detail}</p>
          </SectionIntro>
          <p className="mt-8 text-center">
            <Link href={C.live.link.href} className={buttonVariants()}>
              {C.live.link.label}
            </Link>
          </p>
        </Container>
      </section>

      {/* GUIDES: the three most recently updated. */}
      <section className={`${fullBleed} ${sectionPadding}`} style={{ backgroundColor: "#eef1f5" }}>
        <Container className="px-4 sm:px-6">
          <SectionIntro kicker={C.guides.kicker} title={C.guides.title} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {guides.map((guide) => (
              <Link key={guide.slug} href={`/guides/${guide.slug}`} className="group block">
                <Card className="flex h-full flex-col transition-shadow group-hover:shadow-lg">
                  <CardHeader className="mb-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      {guide.frontmatter.kicker ?? CATEGORY_LABELS[guide.frontmatter.category]}
                    </p>
                    <CardTitle className="group-hover:underline underline-offset-4">
                      {guide.frontmatter.title}
                    </CardTitle>
                    <CardDescription>{guide.frontmatter.description}</CardDescription>
                  </CardHeader>
                  <div className="mt-auto">
                    <GuideMeta guide={guide} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
          <p className="mt-8 text-center">
            <ArrowLink href={C.guides.link.href}>{C.guides.link.label}</ArrowLink>
          </p>
        </Container>
      </section>

      {/* FOR READERS */}
      <section className={`${fullBleed} ${sectionPadding}`} style={{ backgroundColor: "#faf8f6" }}>
        <Container className="px-4 sm:px-6">
          <SectionIntro kicker={C.readers.kicker} title={C.readers.title} />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {C.readers.items.map((item) => (
              <Card key={item.title} className="flex flex-col">
                <CardHeader className="space-y-2">
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Link
                    href={item.href}
                    {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
                  >
                    {item.cta}
                    {item.external ? <ExternalLink className="ml-2 h-4 w-4" aria-hidden /> : null}
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
          <TulsaCrosslink className="mt-16" />
        </Container>
      </section>
    </div>
  );
}
