import Link from "next/link";
import Image from "next/image";
import { Container } from "@/components/container";
import { SiteNav } from "@/components/site-nav";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#151326] to-[#213752] backdrop-blur-sm">
      <Container className="flex items-center justify-between gap-3 py-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <Image
            src="/images/profile-img.png"
            alt=""
            width={32}
            height={32}
            className="h-8 w-8 rounded-full object-cover"
          />
          <span className="text-sm font-semibold tracking-tight text-white">
            Ordinary Mystic
          </span>
        </Link>

        <SiteNav />
      </Container>
    </header>
  );
}
