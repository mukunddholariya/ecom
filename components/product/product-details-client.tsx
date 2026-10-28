"use client"

import { useState, useMemo, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ShoppingCart, Zap, Check, ShieldCheck, RotateCcw, Truck } from "lucide-react"
import type { Product, ProductVariant } from "@/types/product"
import { PriceDisplay } from "@/components/product/price-display"
import { RatingBadge } from "@/components/product/rating-badge"
import { QuantitySelector } from "@/components/product/quantity-selector"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { cn } from "@/lib/utils"

interface ProductDetailsClientProps {
  product: Product
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter()
  const { addItem } = useCart()

  // Variant handling
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | undefined>(
    product.variants && product.variants.length > 0 ? product.variants[0] : undefined,
  )

  // Stock for current variant or base product
  const currentStock = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.stock === "number") {
      return selectedVariant.stock
    }
    return product.stock
  }, [selectedVariant, product.stock])

  // Quantity bounded by stock
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  // Ensure quantity does not exceed stock when switching variants
  const handleVariantSelect = useCallback((v: ProductVariant) => {
    setSelectedVariant(v)
    if (quantity > v.stock) {
      setQuantity(Math.max(1, v.stock))
    }
  }, [quantity])

  const handleAddToCart = useCallback(() => {
    if (currentStock <= 0) return

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        variantLabel: selectedVariant ? selectedVariant.label : undefined,
      },
      quantity,
    )

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1800)
  }, [addItem, product, selectedVariant, quantity, currentStock])

  const handleBuyNow = useCallback(() => {
    if (currentStock <= 0) return

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        variantLabel: selectedVariant ? selectedVariant.label : undefined,
      },
      quantity,
    )

    router.push("/cart")
  }, [addItem, product, selectedVariant, quantity, currentStock, router])

  const isLowStock = currentStock > 0 && currentStock <= 5
  const isOutOfStock = currentStock <= 0

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand & Title */}
      <div>
        <span className="text-xs font-bold uppercase tracking-widest text-primary">
          {product.brand}
        </span>
        <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
          {product.name}
        </h1>

        {/* Rating and Reviews */}
        <div className="mt-3 flex items-center gap-3">
          <RatingBadge
            rating={product.rating}
            reviewCount={product.reviewCount}
            size="md"
          />
          <span className="text-xs text-muted-foreground">|</span>
          <span className="text-xs font-mono text-muted-foreground">
            SKU: {product.sku}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
        <PriceDisplay
          price={product.price}
          originalPrice={product.originalPrice}
          size="lg"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Inclusive of all applicable taxes. Free shipping on this order.
        </p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-xs font-medium">
        {isOutOfStock ? (
          <span className="text-destructive font-semibold">
            ✕ Currently out of stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
            ⚡ Only {currentStock} left in stock — order soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
            ✓ In Stock ({currentStock} available)
          </span>
        )}
      </div>

      {/* Variants (if available) */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3 border-t border-border/80 pt-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">
              Select {product.variants[0].type === "color" ? "Color" : "Size"}:
            </span>
            <span className="font-medium text-muted-foreground">
              {selectedVariant?.label}
            </span>
          </div>

          <div
            className="flex flex-wrap gap-2"
            role="radiogroup"
            aria-label={`Select ${product.variants[0].type}`}
          >
            {product.variants.map((variant) => {
              const isSelected = selectedVariant?.value === variant.value

              if (variant.type === "color") {
                return (
                  <button
                    key={variant.value}
                    type="button"
                    role="radio"
                    aria-checked={isSelected}
                    onClick={() => handleVariantSelect(variant)}
                    title={`${variant.label} (${variant.stock} in stock)`}
                    className={cn(
                      "group relative flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
                      isSelected
                        ? "border-primary bg-primary/10 text-primary ring-2 ring-primary/30"
                        : "border-border hover:border-primary/40 text-foreground",
                    )}
                  >
                    <span
                      className="size-3.5 rounded-full border border-black/20 shadow-2xs"
                      style={{ backgroundColor: variant.value }}
                      aria-hidden="true"
                    />
                    <span>{variant.label}</span>
                  </button>
                )
              }

              return (
                <button
                  key={variant.value}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  onClick={() => handleVariantSelect(variant)}
                  className={cn(
                    "min-w-10 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-all",
                    isSelected
                      ? "border-primary bg-primary text-primary-foreground shadow-xs"
                      : "border-border hover:border-primary/40 text-foreground bg-background",
                  )}
                >
                  {variant.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Quantity & Action Controls */}
      <div className="space-y-4 border-t border-border/80 pt-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-foreground">
            Quantity:
          </span>
          <QuantitySelector
            quantity={quantity}
            max={Math.max(1, currentStock)}
            onChange={setQuantity}
            disabled={isOutOfStock}
          />
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {/* Add to Cart (Mango Orange CTA) */}
          <Button
            type="button"
            variant={isAdded ? "default" : "cta"}
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={cn(
              "w-full font-semibold shadow-xs transition-all",
              isAdded && "bg-emerald-600 hover:bg-emerald-600 text-white",
            )}
            aria-label={
              isAdded
                ? `Added ${quantity} item(s) to cart`
                : "Add product to cart"
            }
          >
            {isAdded ? (
              <>
                <Check className="size-4 me-2" />
                Added to Cart ({quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="size-4 me-2" />
                Add to Cart
              </>
            )}
          </Button>

          {/* Buy Now (Teal Brand secondary action) */}
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="w-full font-semibold shadow-xs"
          >
            <Zap className="size-4 me-2" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Honest Delivery & Guarantee Perks */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-3.5 text-xs text-muted-foreground shadow-2xs">
        <div className="flex items-center gap-2">
          <Truck className="size-4 text-primary shrink-0" />
          <span>Free delivery in 2–4 days</span>
        </div>
        <div className="flex items-center gap-2">
          <RotateCcw className="size-4 text-primary shrink-0" />
          <span>7-day easy returns</span>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-4 text-primary shrink-0" />
          <span>100% Genuine product</span>
        </div>
      </div>

      {/* Description */}
      <div className="border-t border-border/80 pt-5 space-y-2">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
          About This Product
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="text-xs font-semibold text-muted-foreground me-1">
            Tags:
          </span>
          {product.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md border border-border bg-muted/40 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

