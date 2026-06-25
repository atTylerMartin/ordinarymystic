import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarsProps {
  rating: number;
  className?: string;
}

/** Static 5-star display for a given rating (1–5). */
export function Stars({ rating, className }: StarsProps) {
  const clamped = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`${clamped} out of 5 stars`}
      role="img"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < clamped
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-200 text-slate-200",
          )}
          aria-hidden
        />
      ))}
    </div>
  );
}
