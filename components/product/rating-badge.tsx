import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface RatingBadgeProps {
  rating: number
  reviewCount?: number
  className?: string
  size?: "sm" | "md"
}

/**
 * Accessible rating badge with star icon and optional review count.
 */
export function RatingBadge({
  rating,
  reviewCount,
  className,
  size = "sm",
}: RatingBadgeProps) {
  const isHighRating = rating >= 4.0

  return (
    <div
      className={cn("inline-flex items-center gap-1.5 text-xs", className)}
      aria-label={`Rating: ${rating.toFixed(1)} out of 5${
        reviewCount
          ? ` across ${reviewCount.toLocaleString("en-IN")} reviews`
          : ""
      }`}
    >
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded px-1.5 py-0.5 font-medium text-white",
          isHighRating
            ? "bg-emerald-600 dark:bg-emerald-500"
            : "bg-amber-600 dark:bg-amber-500",
          size === "sm" ? "text-[11px]" : "text-xs"
        )}
      >
        <span>{rating.toFixed(1)}</span>
        <Star className="size-3 fill-current" aria-hidden="true" />
      </span>

      {reviewCount !== undefined && (
        <span className="text-muted-foreground">
          ({reviewCount.toLocaleString("en-IN")})
        </span>
      )}
    </div>
  )
}
