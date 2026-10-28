"use client"

import { use, useMemo, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Package,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Check,
} from "lucide-react"
import { findOrderById } from "@/lib/orders"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/hooks/use-cart"
import type { OrderStatus } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

interface OrderDetailPageProps {
  params: Promise<{ id: string }>
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = use(params)
  const router = useRouter()
  const { addItem } = useCart()
  const [reordered, setReordered] = useState(false)

  const order = useMemo(() => {
    return findOrderById(id)
  }, [id])

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
          No order matching ID <strong className="font-mono text-foreground">{id}</strong> was found in local prototype records.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild variant="cta" size="default" className="font-bold shadow-xs">
            <Link href="/account">Back to My Account</Link>
          </Button>
          <Button asChild variant="outline" size="default">
            <Link href="/products">Browse Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Timeline steps
  const steps: { status: OrderStatus; label: string }[] = [
    { status: "confirmed", label: "Confirmed" },
    { status: "shipped", label: "Shipped" },
    { status: "delivered", label: "Delivered" },
  ]

  const statusIndexMap: Record<OrderStatus, number> = {
    placed: 0,
    confirmed: 0,
    shipped: 1,
    delivered: 2,
    cancelled: -1,
  }

  const currentStepIndex = statusIndexMap[order.status] ?? 0

  const handleReorder = () => {
    for (const item of order.items) {
      addItem(
        {
          productId: item.productId,
          slug: item.slug,
          name: item.name,
          image: item.image,
          price: item.price,
          variantLabel: item.variantLabel,
        },
        item.quantity,
      )
    }
    setReordered(true)
    setTimeout(() => {
      router.push("/cart")
    }, 800)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Back button */}
      <div>
        <Button asChild variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <Link href="/account">
            <ArrowLeft className="size-3.5 me-1.5" />
            Back to Account & Orders
          </Link>
        </Button>
      </div>

      {/* Header Info Banner */}
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Order #{order.id.toUpperCase()}
            </h1>
            <Badge
              variant={
                order.status === "delivered"
                  ? "default"
                  : order.status === "shipped"
                  ? "secondary"
                  : "outline"
              }
              className="capitalize text-xs font-semibold"
            >
              {order.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
            <Calendar className="size-3.5 text-muted-foreground" />
            Placed on {dateStr}
          </p>
        </div>

        <Button
          type="button"
          variant={reordered ? "default" : "cta"}
          size="sm"
          onClick={handleReorder}
          disabled={reordered}
          className="font-semibold shadow-xs text-xs"
        >
          {reordered ? (
            <>
              <Check className="size-3.5 me-1.5" />
              Added to Cart!
            </>
          ) : (
            <>
              <RotateCcw className="size-3.5 me-1.5" />
              Reorder All Items
            </>
          )}
        </Button>
      </div>

      {/* Order Status Progress Tracker */}
      {order.status !== "cancelled" && (
        <Card className="border-border shadow-2xs p-4 sm:p-6">
          <div className="flex items-center justify-between max-w-xl mx-auto relative">
            <div className="absolute top-1/2 -translate-y-1/2 start-6 end-6 h-1 bg-muted z-0" />
            <div
              className="absolute top-1/2 -translate-y-1/2 start-6 h-1 bg-primary transition-all duration-300 z-0"
              style={{
                width:
                  currentStepIndex === 0
                    ? "0%"
                    : currentStepIndex === 1
                    ? "50%"
                    : "calc(100% - 3rem)",
              }}
            />

            {steps.map((s, idx) => {
              const isPastOrCurrent = currentStepIndex >= idx
              const isCurrent = currentStepIndex === idx

              return (
                <div key={s.status} className="relative z-10 flex flex-col items-center">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full border-2 transition-all ${
                      isPastOrCurrent
                        ? "border-primary bg-primary text-primary-foreground shadow-xs"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    {isPastOrCurrent ? (
                      <CheckCircle2 className="size-4.5" />
                    ) : (
                      <Clock className="size-4" />
                    )}
                  </div>
                  <span
                    className={`mt-2 text-xs font-medium capitalize ${
                      isCurrent
                        ? "text-primary font-bold"
                        : isPastOrCurrent
                        ? "text-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Left Column: Items */}
        <div className="space-y-6 md:col-span-2">
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <ShoppingBag className="size-4 text-primary" />
                <span>Items in this Order ({order.items.length})</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="divide-y divide-border/60 p-4">
              {order.items.map((item, idx) => (
                <div
                  key={item.productId + (item.variantLabel || "") + idx}
                  className="flex items-center gap-3.5 py-3 first:pt-0 last:pb-0"
                >
                  <Link
                    href={`/products/${item.slug}`}
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
                      className="text-xs font-semibold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                      {item.name}
                    </Link>

                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-0.5">
                      <span>Qty: <strong>{item.quantity}</strong></span>
                      {item.variantLabel && <span>• Variant: {item.variantLabel}</span>}
                      <span>• Unit Price: {formatPrice(item.price)}</span>
                    </div>
                  </div>

                  <div className="text-end text-xs font-bold text-foreground shrink-0">
                    {formatPrice(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Delivery Address Snapshot */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <MapPin className="size-4 text-primary" />
                <span>Delivery Address (Snapshot)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 text-xs space-y-1.5 leading-relaxed">
              <p className="font-semibold text-foreground text-sm">
                {order.address.fullName}
              </p>
              <p className="text-muted-foreground">
                {order.address.line1}
                {order.address.line2 && `, ${order.address.line2}`}
                <br />
                {order.address.city}, {order.address.state} — {order.address.pincode}
              </p>
              <p className="font-mono text-muted-foreground pt-1">
                Contact: +91 {order.address.phone}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Payment & Price Summary */}
        <div className="space-y-6">
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <span>Payment & Totals</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block mb-1">
                  Payment Method
                </span>
                <Badge
                  variant={order.paymentMethod === "online" ? "default" : "secondary"}
                  className="text-[11px]"
                >
                  {order.paymentMethod === "online"
                    ? "Online Payment (Simulated)"
                    : "Cash on Delivery (COD)"}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Items Subtotal</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charges</span>
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
                  <span>Total Amount</span>
                  <span className="text-base text-primary">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-2 pt-3 border-t border-border/80 bg-muted/20">
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary shrink-0" />
                <span>Simulated record. Guaranteed immutable snapshot.</span>
              </div>
            </CardFooter>
          </Card>

          {/* Quick Perks */}
          <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground space-y-2.5">
            <div className="flex items-center gap-2">
              <Truck className="size-4 text-primary shrink-0" />
              <span>Doorstep express dispatch</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="size-4 text-primary shrink-0" />
              <span>7-day easy demo replacement</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

