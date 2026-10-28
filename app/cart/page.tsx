"use client"

import Link from "next/link"
import Image from "next/image"
import {
  ShoppingCart,
  Trash2,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  Truck,
  Sparkles,
  ChevronRight,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/format"
import { QuantitySelector } from "@/components/product/quantity-selector"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function CartPage() {
  const { cart, totals, isLoaded, updateQuantity, removeItem, clearCart } =
    useCart()

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-28 w-full rounded-xl" />
            <Skeleton className="h-28 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  const isEmpty = cart.items.length === 0
  const freeDeliveryThreshold = 499
  const amountNeededForFreeDelivery = Math.max(
    0,
    freeDeliveryThreshold - totals.subtotal,
  )

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
            Shopping Cart
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/80 pb-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Shopping Cart
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            {isEmpty
              ? "Your cart is currently empty"
              : `You have ${totals.itemCount} ${
                  totals.itemCount === 1 ? "item" : "items"
                } in your cart`}
          </p>
        </div>

        {!isEmpty && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear Cart
          </Button>
        )}
      </div>

      {isEmpty ? (
        /* Empty Cart State */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-12 text-center shadow-2xs">
          <div className="flex size-20 items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
            <ShoppingCart className="size-10" />
          </div>

          <h2 className="mt-5 text-xl font-bold text-foreground">
            Your cart is empty
          </h2>
          <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
            Looks like you haven&apos;t added any items to your cart yet. Explore our wide collection of electronics, fashion, and home essentials!
          </p>

          <div className="mt-6">
            <Button asChild variant="cta" size="lg" className="font-semibold shadow-xs">
              <Link href="/products">
                Start Shopping Now
                <ArrowRight className="size-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      ) : (
        /* Main Cart View */
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Items List */}
          <div className="space-y-4 lg:col-span-2">
            {/* Free Delivery Bar */}
            {amountNeededForFreeDelivery > 0 ? (
              <div className="flex items-center gap-2.5 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-900 dark:text-amber-300">
                <Truck className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>
                  Add{" "}
                  <strong>{formatPrice(amountNeededForFreeDelivery)}</strong>{" "}
                  more of eligible items to get <strong>FREE delivery</strong>!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-300">
                <Truck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  🎉 You qualify for <strong>FREE Delivery</strong> on this order!
                </span>
              </div>
            )}

            {/* Cart Items Cards */}
            <div className="divide-y divide-border rounded-xl border border-border bg-card shadow-2xs">
              {cart.items.map((item) => {
                const lineTotal = item.price * item.quantity
                const maxStock = item.stock ?? 99

                return (
                  <div
                    key={item.productId + (item.variantLabel ?? "")}
                    className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6"
                  >
                    {/* Item Image */}
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative aspect-square size-20 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30 sm:size-24"
                    >
                      <Image
                        src={item.image || "/images/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex flex-1 flex-col gap-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        className="font-medium text-sm text-foreground hover:text-primary transition-colors line-clamp-2"
                      >
                        {item.name}
                      </Link>

                      {item.variantLabel && (
                        <span className="text-xs text-muted-foreground">
                          Variant:{" "}
                          <strong className="text-foreground font-medium">
                            {item.variantLabel}
                          </strong>
                        </span>
                      )}

                      <div className="flex items-baseline gap-2 pt-1">
                        <span className="text-sm font-bold text-foreground">
                          {formatPrice(item.price)}
                        </span>
                        {item.originalPrice && item.originalPrice > item.price && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(item.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Selector & Remove Action */}
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-3 shrink-0">
                      <div className="flex items-center gap-3">
                        <QuantitySelector
                          quantity={item.quantity}
                          max={maxStock}
                          size="sm"
                          onChange={(newQty) =>
                            updateQuantity(
                              item.productId,
                              newQty,
                              item.variantLabel,
                            )
                          }
                        />

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          onClick={() =>
                            removeItem(item.productId, item.variantLabel)
                          }
                          aria-label={`Remove ${item.name} from cart`}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      {/* Line Item Total */}
                      <span className="text-sm font-bold text-foreground">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Shopping Guarantees */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Truck className="size-4 text-primary shrink-0" />
                <span>Fast doorstep delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="size-4 text-primary shrink-0" />
                <span>7-day easy returns</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-primary shrink-0" />
                <span>Genuine quality products</span>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div>
            <Card className="sticky top-20 border-border shadow-2xs">
              <CardHeader className="border-b border-border/80 pb-3">
                <CardTitle className="text-base font-bold">
                  Order Summary
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 pt-4 text-xs">
                {/* Items Subtotal */}
                <div className="flex justify-between text-muted-foreground">
                  <span>Price ({totals.itemCount} items)</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>

                {/* Delivery */}
                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charges</span>
                  <span>
                    {totals.deliveryCharge === 0 ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        FREE
                      </strong>
                    ) : (
                      <span className="text-foreground font-medium">
                        {formatPrice(totals.deliveryCharge)}
                      </span>
                    )}
                  </span>
                </div>

                {/* Savings highlight if any */}
                {totals.totalSavings > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-cta/15 px-2.5 py-1.5 text-xs font-bold text-amber-950 dark:text-amber-300 border border-cta/30">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="size-3.5" /> Total Savings
                    </span>
                    <span>-{formatPrice(totals.totalSavings)}</span>
                  </div>
                )}

                <Separator />

                {/* Total */}
                <div className="flex justify-between text-sm font-bold text-foreground pt-1">
                  <span>Total Amount</span>
                  <span className="text-base text-primary">
                    {formatPrice(totals.total)}
                  </span>
                </div>

                <p className="text-[11px] text-muted-foreground">
                  Taxes included. Cash on Delivery and simulated cards available at checkout.
                </p>
              </CardContent>

              <CardFooter className="flex flex-col gap-2 pt-2 border-t border-border/80">
                <Button
                  asChild
                  variant="cta"
                  size="lg"
                  className="w-full font-bold shadow-xs"
                >
                  <Link href="/checkout">
                    Proceed to Checkout
                    <ArrowRight className="size-4 ms-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                >
                  <Link href="/products">Continue Shopping</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Prototype notice */}
            <div className="mt-4 rounded-xl border border-dashed border-border bg-muted/30 p-3.5 text-[11px] text-muted-foreground leading-relaxed">
              <strong className="text-foreground font-semibold">
                Prototype Notice:
              </strong>{" "}
              Cart items are securely stored locally in your browser session. No actual bank or payment transactions will occur.
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

