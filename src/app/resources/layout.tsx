import type { Metadata } from "next";
import { NOINDEX } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Resources",
  ...NOINDEX,
};

export default function ResourcesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
