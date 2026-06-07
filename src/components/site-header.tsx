import Link from "next/link";
import Image from "next/image";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/button";
import { Container } from "@/components/container";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-gradient-to-r from-[#151326] to-[#213752] backdrop-blur-sm">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-2">
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

        <Link href="/#book">
          <Button
            type="button"
            size="sm"
            className="bg-white text-[#151326] hover:bg-slate-100 focus-visible:ring-white focus-visible:ring-offset-[#151326]"
            leftIcon={<CalendarDays className="h-4 w-4" />}
          >
            Book a Reading
          </Button>
        </Link>
      </Container>
    </header>
  );
}
