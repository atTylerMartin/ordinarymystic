import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import { Container } from "@/components/container";
import { CONTACT_EMAIL, SOCIALS, TIKTOK_URL } from "@/lib/config";
import { TULSA_TAROT_READER_URL } from "@/lib/offerings";

export function SiteFooter() {
  return (
    <footer className="border-t border-white/5 bg-[#0d0c14] py-10">
      <Container className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="space-y-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-white">
            <BookOpen className="h-4 w-4 text-slate-400" />
            <span>Ordinary Mystic Readings: Astrology and Tarot Without the Woo</span>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link
              href="/tools"
              className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
            >
              Tools
            </Link>
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
          <p className="text-slate-400">
            In-person readings and events in Tulsa:{" "}
            <a
              href={TULSA_TAROT_READER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
            >
              Tulsa Tarot Reader
            </a>
          </p>
        </div>
        <div className="flex flex-col gap-3 text-sm text-slate-300">
          <div className="flex items-center gap-2 font-medium text-white">
            <User className="h-4 w-4 text-slate-400" />
            <span>Contact</span>
          </div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href={SOCIALS.youtube}
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
  );
}
