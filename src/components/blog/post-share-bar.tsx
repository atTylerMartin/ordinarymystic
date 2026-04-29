"use client";

import { useState } from "react";
import { Copy, Share2 } from "lucide-react";

type PostShareBarProps = {
  title: string;
  url: string;
};

export function PostShareBar({ title: _title, url }: PostShareBarProps) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <section className="rounded border border-[var(--color-rule)] bg-[var(--color-bone)] p-4">
      <div className="flex flex-wrap items-center gap-2">
        <p className="mr-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-muted)]">
          <Share2 className="h-3.5 w-3.5" />
          Share
        </p>
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1 rounded-full border border-[var(--color-rule)] bg-[var(--color-bone-raised)] px-3 py-1.5 text-xs font-medium text-[var(--color-ink)] hover:bg-[var(--color-bone)]"
        >
          <Copy className="h-3.5 w-3.5" />
          {copied ? "Copied" : "Copy Link"}
        </button>
      </div>
    </section>
  );
}
