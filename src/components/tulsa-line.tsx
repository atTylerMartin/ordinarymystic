import {
  TULSA_CROSSLINK,
  TULSA_TAROT_READER_URL,
} from "@/lib/offerings";

/** One line handing in-person intent to Tulsa Tarot Reader. */
export function TulsaLine() {
  return (
    <p className="border-t border-slate-200 pt-6 text-sm text-slate-600">
      {TULSA_CROSSLINK.body}{" "}
      <a
        href={TULSA_TAROT_READER_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-slate-800 underline underline-offset-4 hover:text-slate-900"
      >
        {TULSA_CROSSLINK.cta}
      </a>
    </p>
  );
}
