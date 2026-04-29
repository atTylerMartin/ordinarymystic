import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import { Newsreader } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { WeekendPromoBanner } from "@/components/weekend-promo-banner";
import { Container } from "@/components/container";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { DIGITAL_TAROT_APP_URL, SITE_LIVE_MODE } from "@/lib/config";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const siteName = SITE_NAME;
const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} – Tarot & Astrology`,
    template: `%s | ${siteName}`,
  },
  description:
    "Readings, writing, and tools for finding meaning in the patterns of ordinary life. Tarot and astrology as structured thinking.",
  openGraph: {
    title: `${siteName} – Tarot & Astrology`,
    description:
      "Readings, writing, and tools for finding meaning in the patterns of ordinary life. Tarot and astrology as structured thinking.",
    url: siteUrl,
    siteName,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} – Tarot & Astrology`,
    description:
      "Readings, writing, and tools for finding meaning in the patterns of ordinary life. Tarot and astrology as structured thinking.",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <PersonJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} min-h-screen antialiased`}
        data-site-live={SITE_LIVE_MODE ? "true" : undefined}
      >
        <div className="flex min-h-screen flex-col">
          <WeekendPromoBanner />
          <SiteHeader />
          <main className="flex-1 pt-10 pb-16">
            <Container>{children}</Container>
          </main>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-XF047BLMG9"
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XF047BLMG9');
          `}</Script>
          <footer
            className="py-16"
            style={{ backgroundColor: "#1a1614" }}
          >
            <Container>
              <div className="grid gap-10 md:grid-cols-4 md:gap-12">
                {/* Brand column */}
                <div className="md:col-span-1 space-y-4">
                  <span className="font-heading text-lg font-semibold tracking-tight text-[var(--color-bone)]">
                    Ordinary Mystic
                  </span>
                  <span className="block h-px w-8 bg-[var(--color-oxblood)]" aria-hidden />
                  <p className="text-sm leading-relaxed text-[#9a8d7d]">
                    Finding meaning in the patterns of ordinary life.
                  </p>
                </div>

                {/* Writing column */}
                <div>
                  <h4 className="border-b border-[#2d2620] pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9bba8]">
                    Writing
                  </h4>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    <li>
                      <Link href="/blog" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/categories/astrology" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Astrology
                      </Link>
                    </li>
                    <li>
                      <Link href="/blog/categories/tarot" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Tarot
                      </Link>
                    </li>
                    <li>
                      <Link href="/knowledge-base" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Knowledge Base
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Tools & Work column */}
                <div>
                  <h4 className="border-b border-[#2d2620] pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9bba8]">
                    Tools &amp; Work
                  </h4>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    <li>
                      <Link href="/resources" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Resources
                      </Link>
                    </li>
                    <li>
                      <Link href="/book" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Book a Reading
                      </Link>
                    </li>
                    <li>
                      <a href={DIGITAL_TAROT_APP_URL} target="_blank" rel="noopener noreferrer" className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]">
                        Digital Tarot
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Connect column */}
                <div>
                  <h4 className="border-b border-[#2d2620] pb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#c9bba8]">
                    Connect
                  </h4>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    <li>
                      <a
                        href="mailto:ordinarymysticreadings@gmail.com"
                        className="text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]"
                      >
                        Email
                      </a>
                    </li>
                  </ul>
                </div>
              </div>

              <div
                className="mt-12 flex flex-col gap-3 pt-6 sm:flex-row sm:items-center sm:justify-between"
                style={{ borderTop: "1px solid #2d2620" }}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a8d7d]">
                  Tulsa, Oklahoma
                </p>
                <Link
                  href="/about"
                  className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9a8d7d] transition-colors hover:text-[var(--color-bone)]"
                >
                  About this project
                </Link>
              </div>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
