import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { Container } from "@/components/container";
import { SITE_LIVE_MODE, TIKTOK_URL } from "@/lib/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const siteName = "Ordinary Mystic";
const siteUrl = "https://ordinary.local";

export const metadata: Metadata = {
  title: {
    default: `${siteName} – Tarot & Astrology Without the Woo`,
    template: `%s | ${siteName}`,
  },
  description:
    "Tarot and astrology sessions for thoughtful skeptics. Calm, grounded readings focused on clarity, not theatrics.",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: `${siteName} – Tarot & Astrology Without the Woo`,
    description:
      "Tarot and astrology sessions for thoughtful skeptics. Calm, grounded readings focused on clarity, not theatrics.",
    url: siteUrl,
    siteName,
    type: "website",
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
        {/* Google tag (gtag.js) */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XF047BLMG9"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XF047BLMG9');
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} min-h-screen text-slate-900 antialiased`}
        style={{ backgroundColor: "#f5f4f2" }}
        data-site-live={SITE_LIVE_MODE ? "true" : undefined}
      >
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 pt-10 pb-16">
            <Container>{children}</Container>
          </main>
          <footer className="border-t border-white/5 bg-[#0d0c14] py-10">
            <Container className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <BookOpen className="h-4 w-4 text-slate-400" />
                  <span>Ordinary Mystic Readings: Astrology and Tarot Without the Woo</span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <Link
                    href="/terms"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </div>
              </div>
              <div className="flex flex-col gap-3 text-sm text-slate-300">
                <div className="flex items-center gap-2 font-medium text-white">
                  <User className="h-4 w-4 text-slate-400" />
                  <span>Contact</span>
                </div>
                <a
                  href="mailto:ordinarymysticreadings@gmail.com"
                  className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  ordinarymysticreadings@gmail.com
                </a>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  <a
                    href="https://www.youtube.com/@OrdinaryMysticReadings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    YouTube
                  </a>
                  <a
                    href={TIKTOK_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    TikTok
                  </a>
                  <a
                    href="https://cash.app/$ordinarymystic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    Cash App
                  </a>
                  <a
                    href="https://paypal.me/ordinarymystic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                  >
                    PayPal
                  </a>
                </div>
              </div>
            </Container>
          </footer>
        </div>
      </body>
    </html>
  );
}
