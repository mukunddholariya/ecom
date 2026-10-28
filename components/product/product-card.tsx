"use client"

import { useState, useCallback, type MouseEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Check } from "lucide-react"
import type { Product } from "@/types/product"
import { PriceDisplay } from "@/components/product/price-display"
import { RatingBadge } from "@/components/product/rating-badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface ProductCardProps {
  product: Product
  className?: string
  priority?: boolean
}

export function ProductCard({
  product,
  className,
  priority = false,
}: ProductCardProps) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleAddToCart = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault()
      e.stopPropagation()

      addItem({
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
      })

      setIsAdded(true)
      setTimeout(() => setIsAdded(false), 1400)
    },
    [addItem, product],
  )

  const imageUrl =
    !imageError && product.images[0]
      ? product.images[0]
      : "/images/placeholder.svg"

  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-xs transition-all duration-200 hover:border-primary/40 hover:shadow-md",
        className,
      )}
    >
      {/* Clickable Image Container */}
      <Link
        href={`/products/${product.slug}`}
        className="relative aspect-square w-full overflow-hidden bg-muted/40"
        tabIndex={-1}
        aria-hidden="true"
      >
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={priority}
          onError={() => setImageError(true)}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badges Overlay */}
        <div className="absolute start-2.5 top-2.5 flex flex-col gap-1.5 z-10">
          {product.isNew && (
            <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-foreground shadow-xs">
              New
            </span>
          )}
          {product.isFeatured && !product.isNew && (
            <span className="rounded bg-cta px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-cta-foreground shadow-xs">
              Featured
            </span>
          )}
        </div>
      </Link>

      {/* Card Details */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand */}
        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {product.brand}
        </span>

        {/* Title */}
        <Link
          href={`/products/${product.slug}`}
          className="mt-1 line-clamp-2 text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
        >
          {product.name}
        </Link>

        {/* Rating */}
        <div className="mt-2">
          <RatingBadge
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-3">
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            size="sm"
          />

          <div className="mt-3">
            <Button
              type="button"
              variant={isAdded ? "default" : "cta"}
              size="sm"
              className={cn(
                "w-full transition-all duration-200 text-xs font-semibold",
                isAdded && "bg-emerald-600 hover:bg-emerald-600 text-white",
              )}
              onClick={handleAddToCart}
              aria-label={
                isAdded
                  ? `Added ${product.name} to cart`
                  : `Add ${product.name} to cart`
              }
            >
              {isAdded ? (
                <>
                  <Check className="size-3.5 me-1" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="size-3.5 me-1" />
                  Add to Cart
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
