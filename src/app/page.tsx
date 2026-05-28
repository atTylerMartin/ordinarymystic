import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ChevronRight,
  FileText,
  ExternalLink,
} from "lucide-react";
import { TarotCardsIcon } from "@/components/tarot-cards-icon";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Container } from "@/components/container";
import { ScrollOnHash } from "@/components/scroll-on-hash";
import {
  CONTACT_EMAIL,
  DIGITAL_TAROT_APP_URL,
  SITE_LIVE_MODE,
  TIKTOK_URL,
} from "@/lib/config";

export const metadata: Metadata = {
  title: "Ordinary Mystic Readings – Practical Tarot and Astrology Without the Woo",
  description:
    "Practical tarot and astrology without the woo. Book a live reading (Zoom or Tulsa), a recorded reading, or a written PDF report.",
};

const sectionPadding = "py-16 sm:py-20";

export default async function Home() {
  return (
    <div className="-mt-10 -mb-16 pb-0">
      <ScrollOnHash hash="#book" />

      {/* HERO — full-width gradient #151326 → #213752 */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen min-h-[32rem] flex items-center overflow-hidden bg-gradient-to-br from-[#151326] via-[#1a2742] to-[#213752] ${SITE_LIVE_MODE ? "hero-live-pulse" : ""}`}
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
            Ordinary Mystic Readings
          </h1>
          <p className="mt-5 text-lg text-slate-200 sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Practical tarot and astrology without the woo. Affordable readings and resources for bringing the mystical into your ordinary life.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="https://cash.app/$ordinarymystic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                size="lg"
                className="bg-white text-[#151326] hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#151326]"
              >
                Pay via Cash App
              </Button>
            </a>
            <a
              href="https://paypal.me/ordinarymystic"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                type="button"
                size="lg"
                className="bg-white text-[#151326] hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#151326]"
              >
                Pay via PayPal
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5">
            <a
              href="https://www.youtube.com/@OrdinaryMysticReadings"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-100 transition-opacity"
              aria-label="YouTube"
            >
              <Image
                src="/images/youtube-app-white-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </a>
            <a
              href={TIKTOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-100 transition-opacity"
              aria-label="TikTok"
            >
              <Image
                src="/images/tiktok-white-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </a>
            <a
              href="https://cash.app/$ordinarymystic"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Cash App"
            >
              <Image
                src="/images/cashapp-white-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </a>
            <a
              href="https://paypal.me/ordinarymystic"
              target="_blank"
              rel="noopener noreferrer"
              className="opacity-90 hover:opacity-100 transition-opacity"
              aria-label="PayPal"
            >
              <Image
                src="/images/paypal-white-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </a>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="opacity-90 hover:opacity-100 transition-opacity"
              aria-label="Email"
            >
              <Image
                src="/images/email-white-icon.png"
                alt=""
                width={28}
                height={28}
                className="h-7 w-7"
              />
            </a>
          </div>
        </div>
      </section>

      {/* SECTION: Sittings & Engagements — warm off-white */}
      <section
        id="book"
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "#faf8f6" }}
      >
        <Container className="px-4 sm:px-6">
          <p className="text-center text-sm font-medium uppercase tracking-widest text-slate-500">
            Offerings
          </p>
          <h2 className="mt-2 font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Sittings &amp; Engagements
          </h2>
          <div className="mx-auto mt-10 grid max-w-3xl gap-6 md:grid-cols-2">
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d2a4a] text-white">
                  <TarotCardsIcon className="h-5 w-5" />
                </div>
                <CardTitle>Private Reading</CardTitle>
                <CardDescription>
                  In person in Tulsa or by video. Bring a question or do not. Either works.
                </CardDescription>
                <p className="text-sm font-medium text-slate-700">
                  15, 30, or 60 minutes · $25 / $65 / $100
                </p>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d2a4a] text-white">
                  <FileText className="h-5 w-5" />
                </div>
                <CardTitle>Written or Recorded Reading</CardTitle>
                <CardDescription>
                  Send your question. You receive a careful, considered reading delivered as a written document or a recorded video, your choice.
                </CardDescription>
                <p className="text-sm font-medium text-slate-700">
                  Delivered in 5 to 7 days · $50
                </p>
              </CardHeader>
            </Card>
          </div>
          <p className="mt-8 text-center text-sm text-slate-600">
            To inquire or book, send via Cash App or PayPal above, or{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
            >
              email me
            </a>
            .
          </p>
        </Container>
      </section>

      {/* SECTION: Tools to Support Your Readings — soft blue-gray */}
      <section
        className={`relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen ${sectionPadding}`}
        style={{ backgroundColor: "#eef1f5" }}
      >
        <Container className="px-4 sm:px-6">
          <h2 className="font-heading text-center text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            Tools to Support Your Readings
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            <Card className="flex flex-col">
              <CardHeader className="space-y-2">
                <CardTitle>Simple Tarot Journal</CardTitle>
                <CardDescription>
                  A simple, searchable Notion template to log readings and card pulls, build a living card library, and surface past insights when you need them.
                </CardDescription>
                <p className="text-xs text-slate-500">Simple & searchable</p>
                <p className="text-sm font-medium text-slate-700">$12</p>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="https://ordinarymystic.gumroad.com/l/tarotjournal" target="_blank" rel="noopener noreferrer">
                  <Button type="button" size="sm">
                    Buy now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="space-y-2">
                <CardTitle>Complete Tarot Dashboard</CardTitle>
                <CardDescription>
                  Advanced Notion system to track readings in full detail—upright and reversed cards, contextual meanings, and statistics so your practice deepens over time.
                </CardDescription>
                <p className="text-xs text-slate-500">Advanced & flexible</p>
                <p className="text-sm font-medium text-slate-700">$32</p>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href="https://ordinarymystic.gumroad.com/l/tarotdashboard" target="_blank" rel="noopener noreferrer">
                  <Button type="button" size="sm">
                    Buy now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
            <Card className="flex flex-col">
              <CardHeader className="space-y-2">
                <CardTitle>Digital Tarot</CardTitle>
                <CardDescription>
                  A free online desktop simulator app to shuffle, pull, and rearrange Tarot cards. This website is in beta, and mobile view is not currently supported.
                </CardDescription>
                <p className="text-xs text-slate-500">Free web app</p>
              </CardHeader>
              <CardFooter className="mt-auto">
                <Link href={DIGITAL_TAROT_APP_URL} target="_blank" rel="noopener noreferrer">
                  <Button type="button" size="sm" rightIcon={<ExternalLink className="h-4 w-4" />}>
                    Try now
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </div>
          <p className="mt-8 text-center">
            <Link
              href="/tools"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-700 underline-offset-4 hover:text-slate-900 hover:underline"
            >
              Browse All Resources
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </p>
        </Container>
      </section>
    </div>
  );
}
