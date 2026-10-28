"use client"

import { useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Heart,
  ShoppingCart,
  Trash2,
  ArrowRight,
  ChevronRight,
} from "lucide-react"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { getProductById } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { Product } from "@/types/product"

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist()
  const { addItem } = useCart()

  // Resolve product objects from IDs
  const wishlistedProducts = useMemo(() => {
    return wishlist
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined)
  }, [wishlist])

  const isEmpty = wishlistedProducts.length === 0

  const handleMoveToCart = (product: Product) => {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0] ?? "/images/placeholder.svg",
      price: product.price,
      stock: product.stock,
    })
    removeFromWishlist(product.id)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            Wishlist
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl flex items-center gap-2">
            <Heart className="size-6 text-cta fill-cta" />
            <span>My Wishlist</span>
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEmpty
              ? "Your saved items will appear here."
              : `You have ${wishlistedProducts.length} saved ${
                  wishlistedProducts.length === 1 ? "item" : "items"
                }`}
          </p>
        </div>

        {!isEmpty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearWishlist}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear Wishlist
          </Button>
        )}
      </div>

      {isEmpty ? (
        /* Empty Wishlist State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-2xs">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
            <Heart className="size-10" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Your wishlist is empty
          </h2>
          <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
            Explore our curated selection and save your favorite items here to purchase later or keep track of prices!
          </p>

          <div className="mt-6">
            <Button asChild variant="cta" size="lg" className="font-semibold shadow-xs">
              <Link href="/products">
                Discover Products
                <ArrowRight className="size-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {wishlistedProducts.map((product) => {
            const isOutOfStock = product.stock <= 0

            return (
              <Card
                key={product.id}
                className="group relative flex flex-col overflow-hidden border-border bg-card text-card-foreground shadow-xs hover:border-primary/40 hover:shadow-md transition-all duration-200"
              >
                {/* Remove from wishlist button */}
                <button
                  type="button"
                  onClick={() => removeFromWishlist(product.id)}
                  aria-label={`Remove ${product.name} from wishlist`}
                  className="absolute end-2.5 top-2.5 z-10 flex size-7 items-center justify-center rounded-full bg-background/80 text-muted-foreground backdrop-blur-xs hover:text-destructive hover:bg-background transition"
                >
                  <Trash2 className="size-3.5" />
                </button>

                {/* Product Image */}
                <Link
                  href={`/products/${product.slug}`}
                  className="relative aspect-square w-full overflow-hidden bg-muted/40"
                >
                  <Image
                    src={product.images[0] || "/images/placeholder.svg"}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  {isOutOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70 backdrop-blur-2xs">
                      <span className="rounded bg-destructive px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-destructive-foreground">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </Link>

                {/* Details */}
                <div className="flex flex-1 flex-col p-4">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {product.brand}
                  </span>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-1 line-clamp-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {product.name}
                  </Link>

                  <div className="mt-auto pt-3 space-y-3">
                    <div className="flex items-baseline gap-2">
                      <span className="text-base font-bold text-foreground">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    <Button
                      type="button"
                      variant="cta"
                      size="sm"
                      disabled={isOutOfStock}
                      onClick={() => handleMoveToCart(product)}
                      className="w-full text-xs font-semibold shadow-xs"
                    >
                      <ShoppingCart className="size-3.5 me-1.5" />
                      Move to Cart
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
