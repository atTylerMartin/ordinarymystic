import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Montserrat } from "next/font/google";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Container } from "@/components/container";
import { Attribution } from "@/components/attribution";
import { StructuredData } from "@/components/structured-data";
import { SITE_LIVE_MODE, SITE_URL } from "@/lib/config";
import { OG_DEFAULT } from "@/lib/metadata";
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
const siteUrl = SITE_URL;

const defaultDescription =
  "Online tarot readings for thoughtful skeptics. Recorded readings delivered as a personalized video walkthrough plus a written synthesis, and live one-on-one sessions over Zoom.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ordinary Mystic | Tarot Readings",
    template: `%s | ${siteName}`,
  },
  description: defaultDescription,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  openGraph: {
    title: "Ordinary Mystic | Tarot Readings",
    description: defaultDescription,
    url: siteUrl,
    siteName,
    type: "website",
    images: [OG_DEFAULT],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ordinary Mystic | Tarot Readings",
    description: defaultDescription,
    images: [OG_DEFAULT.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
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
        <StructuredData />
        <Attribution />
        <div className="flex min-h-screen flex-col">
          <SiteHeader />
          <main className="flex-1 pt-10 pb-16">
            <Container>{children}</Container>
          </main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
