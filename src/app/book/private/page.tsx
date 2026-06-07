import type { Metadata } from "next";
import Link from "next/link";
import { Clock } from "lucide-react";
import { Button } from "@/components/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Container } from "@/components/container";
import {
  PRIVATE_15_URL,
  PRIVATE_30_URL,
  PRIVATE_60_URL,
} from "@/lib/config";

export const metadata: Metadata = {
  title: "Book a Private Reading — Ordinary Mystic",
  description:
    "Private one-on-one tarot readings, 15, 30, or 60 minutes. Zoom or in person in Tulsa.",
};

const OPTIONS = [
  {
    duration: "15 minutes",
    price: 25,
    url: PRIVATE_15_URL,
    summary: "A focused sit-down for a single question or topic.",
  },
  {
    duration: "30 minutes",
    price: 65,
    url: PRIVATE_30_URL,
    summary: "Room to look at a question from a few angles, or cover two related ones.",
  },
  {
    duration: "60 minutes",
    price: 100,
    url: PRIVATE_60_URL,
    summary: "A full reading — multiple questions, deeper exploration, no rush.",
  },
];

export default function PrivateReadingPage() {
  return (
    <Container className="py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-slate-500">
          Private Reading
        </p>
        <h1 className="mt-2 font-heading text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
          Book a Private Reading
        </h1>
        <p className="mt-4 text-base leading-relaxed text-slate-700">
          Zoom or in person in Tulsa &mdash; we&apos;ll find a time that works for both of us after you book. Pick the length that fits the question you&apos;re bringing.
        </p>
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-3">
        {OPTIONS.map((opt) => (
          <Card key={opt.duration} className="flex flex-col">
            <CardHeader className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2d2a4a] text-white">
                <Clock className="h-5 w-5" />
              </div>
              <CardTitle>{opt.duration}</CardTitle>
              <CardDescription>{opt.summary}</CardDescription>
              <p className="text-2xl font-bold text-slate-900">${opt.price}</p>
            </CardHeader>
            <CardFooter className="mt-auto">
              <Link
                href={opt.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full"
              >
                <Button type="button" size="sm" className="w-full">
                  Book {opt.duration}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  );
}
