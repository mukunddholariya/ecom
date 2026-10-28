"use client"

import { Suspense, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import {
  CheckCircle2,
  Package,
  Calendar,
  CreditCard,
  MapPin,
  ArrowRight,
  ShoppingBag,
  ShieldCheck,
  Truck,
} from "lucide-react"
import { findOrderById } from "@/lib/orders"
import { formatPrice } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const order = useMemo(() => {
    if (!orderId) return undefined
    return findOrderById(orderId)
  }, [orderId])

  if (!order) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="flex size-16 mx-auto items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
          <Package className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Order Not Found
        </h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          We couldn&apos;t locate details for this order. It may have expired from your local storage session.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="cta" size="default" className="font-bold shadow-xs">
            <Link href="/products">Browse Store</Link>
          </Button>
          <Button asChild variant="outline" size="default">
            <Link href="/account">My Account</Link>
          </Button>
        </div>
      </div>
    )
  }

  const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Success Celebration Banner */}
      <div className="text-center space-y-3">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shadow-xs">
          <CheckCircle2 className="size-9" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Order Confirmed!
        </h1>
        <p className="text-xs text-muted-foreground max-w-md mx-auto leading-relaxed">
          Thank you for testing our storefront! Your order{" "}
          <strong className="font-mono text-foreground font-semibold">
            #{order.id.toUpperCase()}
          </strong>{" "}
          has been placed in prototype mode.
        </p>
      </div>

      {/* Main Order Card */}
      <Card className="border-border shadow-md overflow-hidden">
        {/* Card Header with Meta */}
        <CardHeader className="border-b border-border/80 bg-muted/20 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Order ID</span>
              <span className="font-mono font-bold text-sm text-foreground">
                #{order.id.toUpperCase()}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Placed On</span>
              <span className="text-foreground font-medium inline-flex items-center gap-1">
                <Calendar className="size-3 text-muted-foreground" />
                {dateStr}
              </span>
            </div>

            <div className="space-y-0.5">
              <span className="text-muted-foreground text-[11px] block">Order Status</span>
              <Badge variant="default" className="text-xs capitalize">
                <Truck className="size-3 me-1 inline" />
                {order.status}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 p-5 text-xs">
          {/* Items List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-foreground flex items-center gap-2">
              <ShoppingBag className="size-4 text-primary" />
              <span>Purchased Items ({order.items.length})</span>
            </h3>

            <div className="divide-y divide-border/60 rounded-xl border border-border bg-card p-2 shadow-2xs">
              {order.items.map((item, idx) => (
                <div
                  key={item.productId + (item.variantLabel || "") + idx}
                  className="flex items-center gap-3 py-3 px-2 first:pt-2 last:pb-2"
                >
                  <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-border bg-muted/30">
                    <Image
                      src={item.image || "/images/placeholder.svg"}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Quantity: <strong>{item.quantity}</strong>{" "}
                      {item.variantLabel && `• Variant: ${item.variantLabel}`}
                    </p>
                  </div>

                  <div className="text-end shrink-0">
                    <span className="text-xs font-bold text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                    <p className="text-[10px] text-muted-foreground">
                      {formatPrice(item.price)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Delivery Address */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-1.5">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="size-3.5 text-primary" />
                Delivery Address
              </span>
              <p className="font-semibold text-foreground text-xs pt-1">
                {order.address.fullName}
              </p>
              <p className="text-muted-foreground leading-relaxed">
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
                <br />
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="font-mono text-muted-foreground pt-1">
                Phone: +91 {order.address.phone}
              </p>
            </div>

            {/* Payment Details */}
            <div className="rounded-xl border border-border bg-muted/20 p-4 space-y-2">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="size-3.5 text-primary" />
                Payment Summary
              </span>
              <div className="pt-1">
                <Badge
                  variant={order.paymentMethod === "online" ? "default" : "secondary"}
                  className="text-[11px]"
                >
                  {order.paymentMethod === "online"
                    ? "Online Payment (Simulated)"
                    : "Cash on Delivery (COD)"}
                </Badge>
              </div>
              <p className="text-muted-foreground leading-relaxed text-[11px]">
                {order.paymentMethod === "online"
                  ? "Simulated transaction settled instantly in demo mode. No charges applied."
                  : "Payable in cash or via UPI to courier upon package delivery."}
              </p>
            </div>
          </div>

          <Separator />

          {/* Pricing Breakdown */}
          <div className="space-y-2 max-w-sm ms-auto text-xs">
            <div className="flex justify-between text-muted-foreground">
              <span>Items Subtotal</span>
              <span className="text-foreground font-medium">
                {formatPrice(order.subtotal)}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>Delivery Fee</span>
              <span>
                {order.deliveryCharge === 0 ? (
                  <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                    FREE
                  </strong>
                ) : (
                  <span className="text-foreground font-medium">
                    {formatPrice(order.deliveryCharge)}
                  </span>
                )}
              </span>
            </div>

            <Separator />

            <div className="flex justify-between text-sm font-bold text-foreground">
              <span>Total Paid</span>
              <span className="text-base text-primary">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/10 p-4">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Order saved locally. Visible under your account order history.</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button asChild variant="outline" size="sm" className="w-full sm:w-auto text-xs">
              <Link href="/account">View in My Account</Link>
            </Button>
            <Button asChild variant="cta" size="sm" className="w-full sm:w-auto font-bold shadow-xs">
              <Link href="/products">
                Continue Shopping
                <ArrowRight className="size-3.5 ms-1.5" />
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

function SuccessSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      <Skeleton className="h-16 w-16 rounded-full mx-auto" />
      <Skeleton className="h-8 w-64 mx-auto" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<SuccessSkeleton />}>
      <SuccessContent />
    </Suspense>
  )
}
