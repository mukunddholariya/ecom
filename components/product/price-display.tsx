import { formatPrice, discountPercent } from "@/lib/format"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  className?: string
  size?: "sm" | "md" | "lg"
  showDiscountBadge?: boolean
}

/**
 * Clean, accessible price display atom.
 * Supports current price, struck-through original MRP, and discount percentage badge.
 */
export function PriceDisplay({
  price,
  originalPrice,
  className,
  size = "md",
  showDiscountBadge = true,
}: PriceDisplayProps) {
  const discount = discountPercent(originalPrice, price)

  const sizeClasses = {
    sm: {
      price: "text-sm font-semibold",
      original: "text-xs",
      badge: "text-[10px] px-1.5 py-0.5",
    },
    md: {
      price: "text-base font-bold",
      original: "text-xs",
      badge: "text-xs px-2 py-0.5",
    },
    lg: {
      price: "text-2xl font-bold",
      original: "text-sm",
      badge: "text-xs px-2.5 py-0.5",
    },
  }[size]

  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className={cn("text-foreground", sizeClasses.price)}>
        {formatPrice(price)}
      </span>

      {originalPrice && originalPrice > price && (
        <span
          className={cn(
            "text-muted-foreground line-through decoration-muted-foreground/70",
            sizeClasses.original,
          )}
          aria-label={`Original price: ${formatPrice(originalPrice)}`}
        >
          {formatPrice(originalPrice)}
        </span>
      )}

      {showDiscountBadge && discount !== null && (
        <span
          className={cn(
            "inline-flex items-center rounded-xs bg-cta/15 font-bold text-amber-950 dark:text-amber-300 border border-cta/30",
            sizeClasses.badge,
          )}
          aria-label={`${discount}% discount`}
        >
          {discount}% OFF
        </span>
      )}
    </div>
  )
}
