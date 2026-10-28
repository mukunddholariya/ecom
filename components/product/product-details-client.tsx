"use client"

import { PincodeChecker } from "@/components/product/pincode-checker"
import { PriceDisplay } from "@/components/product/price-display"
import { QuantitySelector } from "@/components/product/quantity-selector"
import { RatingBadge } from "@/components/product/rating-badge"
import { Button } from "@/components/ui/button"
import { useCart } from "@/hooks/use-cart"
import { useWishlist } from "@/hooks/use-wishlist"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { Product, ProductVariant } from "@/types/product"
import {
  Check,
  Heart,
  Layers,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useMemo, useState } from "react"

interface ProductDetailsClientProps {
  product: Product
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  // Variant handling
  const [selectedVariant, setSelectedVariant] = useState<
    ProductVariant | undefined
  >(
    product.variants && product.variants.length > 0
      ? product.variants[0]
      : undefined
  )

  // Stock & Price for current variant or base product
  const currentStock = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.stock === "number") {
      return selectedVariant.stock
    }
    return product.stock
  }, [selectedVariant, product.stock])

  const currentPrice = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.price === "number") {
      return selectedVariant.price
    }
    return product.price
  }, [selectedVariant, product.price])

  const currentOriginalPrice = useMemo(() => {
    if (selectedVariant && typeof selectedVariant.originalPrice === "number") {
      return selectedVariant.originalPrice
    }
    return product.originalPrice
  }, [selectedVariant, product.originalPrice])

  // Quantity bounded by stock
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)

  const wishlisted = isWishlisted(product.id)

  // Ensure quantity does not exceed stock when switching variants
  const handleVariantSelect = useCallback(
    (v: ProductVariant) => {
      setSelectedVariant(v)
      if (quantity > v.stock) {
        setQuantity(Math.max(1, v.stock))
      }
    },
    [quantity]
  )

  const handleAddToCart = useCallback(() => {
    if (currentStock <= 0) return

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: selectedVariant?.image || product.images[0] || "",
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        variantLabel: selectedVariant ? selectedVariant.label : undefined,
      },
      quantity
    )

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1800)
  }, [
    addItem,
    product,
    selectedVariant,
    quantity,
    currentStock,
    currentPrice,
    currentOriginalPrice,
  ])

  const handleBuyNow = useCallback(() => {
    if (currentStock <= 0) return

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: selectedVariant?.image || product.images[0] || "",
        price: currentPrice,
        originalPrice: currentOriginalPrice,
        variantLabel: selectedVariant ? selectedVariant.label : undefined,
      },
      quantity
    )

    router.push("/cart")
  }, [
    addItem,
    product,
    selectedVariant,
    quantity,
    currentStock,
    currentPrice,
    currentOriginalPrice,
    router,
  ])

  const isLowStock = currentStock > 0 && currentStock <= 5
  const isOutOfStock = currentStock <= 0

  return (
    <div className="flex flex-col space-y-6">
      {/* Brand, Title & Wishlist */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold tracking-widest text-primary uppercase">
            {product.brand}
          </span>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => toggleWishlist(product.id)}
            className={cn(
              "h-8 gap-1.5 border-border text-xs font-medium transition",
              wishlisted && "border-cta/40 bg-cta/10 text-cta hover:bg-cta/20"
            )}
          >
            <Heart
              className={cn(
                "size-3.5 transition-colors",
                wishlisted && "fill-cta text-cta"
              )}
            />
            <span>{wishlisted ? "Wishlisted" : "Wishlist"}</span>
          </Button>
        </div>

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
          <span className="font-mono text-xs text-muted-foreground">
            SKU: {selectedVariant?.sku || product.sku}
          </span>
        </div>
      </div>

      {/* Price Section */}
      <div className="rounded-xl border border-border/80 bg-muted/20 p-4">
        <PriceDisplay
          price={currentPrice}
          originalPrice={currentOriginalPrice}
          size="lg"
        />
        <p className="mt-1 text-xs text-muted-foreground">
          Inclusive of all applicable taxes. Free delivery on orders over ₹499.
        </p>
      </div>

      {/* Stock Status */}
      <div className="flex items-center gap-2 text-xs font-medium">
        {isOutOfStock ? (
          <span className="font-semibold text-destructive">
            ✕ Currently out of stock
          </span>
        ) : isLowStock ? (
          <span className="inline-flex items-center gap-1 font-semibold text-amber-600 dark:text-amber-400">
            ⚡ Only {currentStock} left in stock — order soon
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
            ✓ In Stock ({currentStock} units available)
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
                        : "border-border text-foreground hover:border-primary/40"
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
                      : "border-border bg-background text-foreground hover:border-primary/40"
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
        <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
          {/* Add to Cart (Mango Orange CTA) */}
          <Button
            type="button"
            variant={isAdded ? "default" : "cta"}
            size="lg"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={cn(
              "w-full font-semibold shadow-xs transition-all",
              isAdded && "bg-emerald-600 text-white hover:bg-emerald-600"
            )}
            aria-label={
              isAdded
                ? `Added ${quantity} item(s) to cart`
                : "Add product to cart"
            }
          >
            {isAdded ? (
              <>
                <Check className="me-2 size-4" />
                Added to Cart ({quantity})
              </>
            ) : (
              <>
                <ShoppingCart className="me-2 size-4" />
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
            <Zap className="me-2 size-4" />
            Buy Now
          </Button>
        </div>
      </div>

      {/* Pincode Serviceability Estimator */}
      <PincodeChecker />

      {/* Highlights / Key Features (Part D & E) */}
      {product.highlights && product.highlights.length > 0 && (
        <div className="space-y-2.5 rounded-xl border border-border bg-card p-4">
          <h3 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
            <Sparkles className="size-3.5 text-primary" />
            Key Highlights
          </h3>
          <ul className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-2">
            {product.highlights.map((h, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="font-bold text-primary">•</span>
                <span>{h}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Description */}
      <div className="space-y-2 border-t border-border/80 pt-5">
        <h3 className="text-sm font-semibold tracking-wider text-foreground uppercase">
          About This Product
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {product.description}
        </p>
      </div>

      {/* Dynamic Category Specifications (Part D) */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="space-y-3 border-t border-border/80 pt-5">
          <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wider text-foreground uppercase">
            <Layers className="size-4 text-primary" />
            Technical Specifications & Details
          </h3>

          <div className="divide-y divide-border/60 overflow-hidden rounded-xl border border-border text-xs">
            {product.specifications.map((spec, idx) => (
              <div
                key={idx}
                className="grid grid-cols-3 bg-card p-3 transition-colors hover:bg-muted/20"
              >
                <span className="col-span-1 font-medium text-muted-foreground">
                  {spec.name}
                </span>
                <span className="col-span-2 font-semibold text-foreground">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Warranty Information (Part D) */}
      {product.warranty && (
        <div className="flex items-center gap-2.5 rounded-xl border border-primary/20 bg-primary/5 p-3.5 text-xs text-foreground">
          <ShieldCheck className="size-5 shrink-0 text-primary" />
          <div>
            <span className="block font-bold">Warranty & Guarantee:</span>
            <span className="text-muted-foreground">{product.warranty}</span>
          </div>
        </div>
      )}

      {/* Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-2">
          <span className="me-1 text-xs font-semibold text-muted-foreground">
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

      {/* Mobile Sticky Bottom Action Bar (Part C) */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-border bg-background/95 p-3 px-4 shadow-lg backdrop-blur-md md:hidden">
        <div className="min-w-0">
          <span className="block truncate text-xs text-muted-foreground">
            {product.name}
          </span>
          <span className="text-base font-bold text-foreground">
            {formatPrice(currentPrice)}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            type="button"
            variant={isAdded ? "default" : "cta"}
            size="sm"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className="text-xs font-semibold shadow-xs"
          >
            {isAdded ? (
              <>
                <Check className="me-1 size-3.5" /> Added
              </>
            ) : (
              <>
                <ShoppingCart className="me-1 size-3.5" /> Add to Cart
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="default"
            size="sm"
            disabled={isOutOfStock}
            onClick={handleBuyNow}
            className="text-xs font-semibold"
          >
            <Zap className="me-1 size-3.5" /> Buy Now
          </Button>
        </div>
      </div>
    </div>
  )
}
