"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCart, Trash2, ArrowRight, Tag, X } from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/format"
import { QuantitySelector } from "@/components/product/quantity-selector"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

export function CartSheet() {
  const {
    cart,
    totals,
    appliedCoupon,
    removeCoupon,
    isCartSheetOpen,
    setIsCartSheetOpen,
    updateQuantity,
    removeItem,
  } = useCart()

  const isEmpty = cart.items.length === 0

  return (
    <Sheet open={isCartSheetOpen} onOpenChange={setIsCartSheetOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col sm:max-w-md p-0"
      >
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle className="flex items-center gap-2 text-base font-bold">
            <ShoppingCart className="size-5 text-primary" />
            <span>Your Cart ({totals.itemCount})</span>
          </SheetTitle>
        </SheetHeader>

        {isEmpty ? (
          <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
            <div className="flex size-16 items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
              <ShoppingCart className="size-8" />
            </div>
            <h3 className="mt-4 text-base font-bold text-foreground">
              Your cart is empty
            </h3>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Add some items from our product catalogue to get started.
            </p>
            <div className="mt-5">
              <Button
                asChild
                variant="cta"
                size="sm"
                onClick={() => setIsCartSheetOpen(false)}
              >
                <Link href="/products">Browse Catalogue</Link>
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable list of items */}
            <div className="flex-1 overflow-y-auto divide-y divide-border px-4 py-2">
              {cart.items.map((item) => {
                const lineTotal = item.price * item.quantity
                const maxStock = item.stock ?? 99

                return (
                  <div
                    key={item.productId + (item.variantLabel ?? "")}
                    className="flex items-center gap-3 py-3"
                  >
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={() => setIsCartSheetOpen(false)}
                      className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30"
                    >
                      <Image
                        src={item.image || "/images/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.slug}`}
                        onClick={() => setIsCartSheetOpen(false)}
                        className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                      >
                        {item.name}
                      </Link>

                      {item.variantLabel && (
                        <p className="text-[11px] text-muted-foreground">
                          Variant: {item.variantLabel}
                        </p>
                      )}

                      <div className="flex items-center justify-between gap-2 pt-1.5">
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

                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-foreground">
                            {formatPrice(lineTotal)}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeItem(item.productId, item.variantLabel)
                            }
                            aria-label={`Remove ${item.name}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Footer Summary & Checkout */}
            <SheetFooter className="border-t border-border p-4 bg-muted/20 space-y-3">
              {appliedCoupon && (
                <div className="flex items-center justify-between rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1.5 text-xs text-emerald-950 dark:text-emerald-200 w-full">
                  <div className="flex items-center gap-1.5 font-medium truncate">
                    <Tag className="size-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>Coupon: <strong>{appliedCoupon.code}</strong></span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    aria-label="Remove coupon"
                    className="text-muted-foreground hover:text-destructive p-0.5"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              )}

              <div className="space-y-1.5 text-xs w-full">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-semibold text-foreground">
                    {formatPrice(totals.subtotal)}
                  </span>
                </div>
                {totals.couponDiscount && totals.couponDiscount > 0 ? (
                  <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span className="flex items-center gap-1">
                      <Tag className="size-3" />
                      Coupon Discount ({totals.appliedCouponCode})
                    </span>
                    <span>-{formatPrice(totals.couponDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Delivery</span>
                  <span>
                    {totals.deliveryCharge === 0 ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        FREE
                      </strong>
                    ) : (
                      formatPrice(totals.deliveryCharge)
                    )}
                  </span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between text-sm font-bold text-foreground">
                  <span>Total Amount</span>
                  <span className="text-primary">
                    {formatPrice(totals.total)}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full pt-1">
                <Button
                  asChild
                  variant="cta"
                  size="default"
                  className="w-full font-bold shadow-xs"
                  onClick={() => setIsCartSheetOpen(false)}
                >
                  <Link href="/checkout">
                    Checkout Now
                    <ArrowRight className="size-4 ms-2" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={() => setIsCartSheetOpen(false)}
                >
                  <Link href="/cart">View Full Cart</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

