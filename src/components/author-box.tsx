import Image from "next/image";
import { DEFAULT_AUTHOR, type AuthorProfile } from "@/data/authors";

/** "About the author" block at the foot of every guide. */
export function AuthorBox({ author = DEFAULT_AUTHOR }: { author?: AuthorProfile }) {
  return (
    <section className="flex items-start gap-4 border-t border-slate-200 pt-6">
      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full bg-slate-100">
        <Image src={author.image} alt={author.name} fill className="object-cover" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
          About the author
        </p>
        <p className="font-heading text-base font-bold text-slate-900">{author.name}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-700">
          {author.description}
        </p>
      </div>
    </section>
  );
}
