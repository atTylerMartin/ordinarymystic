import type { Metadata } from "next";
import { AdminReviews } from "@/components/admin-reviews";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default function AdminPage() {
  return <AdminReviews />;
}
