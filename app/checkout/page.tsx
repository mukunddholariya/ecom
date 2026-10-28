"use client"

import { useState, useMemo, type FormEvent } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  ArrowRight,
  AlertCircle,
  MapPin,
  User,
  Sparkles,
  ChevronRight,
  Loader2,
  Lock,
} from "lucide-react"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { getProductById } from "@/lib/data"
import { formatPrice } from "@/lib/format"
import { saveLocalOrder } from "@/lib/orders"
import { getAddressesForUser } from "@/lib/addresses"
import type { Address, Order, OrderItem, PaymentMethod } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

export default function CheckoutPage() {
  const router = useRouter()
  const { cart, isLoaded: isCartLoaded, clearCart } = useCart()
  const { session, isSignedIn, isLoaded: isAuthLoaded } = useAuth()

  // Address form fields
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [line1, setLine1] = useState("")
  const [line2, setLine2] = useState("")
  const [city, setCity] = useState("Bengaluru")
  const [state, setState] = useState("Karnataka")
  const [pincode, setPincode] = useState("560038")

  // Payment method and simulation mode
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("online")
  const [simulateOutcome, setSimulateOutcome] = useState<"success" | "failure">("success")

  // Submission & UI feedback
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Derived effective values with fallback to session
  const effectiveName = fullName !== "" ? fullName : (session?.name || "")
  const effectivePhone = phone !== "" ? phone : (session?.phone || "")

  // Trusted recalculation of cart totals from authoritative product data
  const { verifiedItems, subtotal, deliveryCharge, grandTotal, totalSavings } = useMemo(() => {
    const verified: OrderItem[] = []
    let calcSubtotal = 0
    let calcSavings = 0

    for (const item of cart.items) {
      const liveProduct = getProductById(item.productId)
      const unitPrice = liveProduct ? liveProduct.price : item.price
      const origPrice = liveProduct ? liveProduct.originalPrice : item.originalPrice
      const qty = item.quantity

      verified.push({
        productId: item.productId,
        slug: item.slug,
        name: liveProduct ? liveProduct.name : item.name,
        image: liveProduct && liveProduct.images[0] ? liveProduct.images[0] : item.image,
        price: unitPrice,
        quantity: qty,
        variantLabel: item.variantLabel,
      })

      calcSubtotal += unitPrice * qty
      if (origPrice && origPrice > unitPrice) {
        calcSavings += (origPrice - unitPrice) * qty
      }
    }

    const calcDelivery = calcSubtotal >= 499 || calcSubtotal === 0 ? 0 : 49
    const calcGrandTotal = calcSubtotal + calcDelivery

    return {
      verifiedItems: verified,
      subtotal: calcSubtotal,
      deliveryCharge: calcDelivery,
      grandTotal: calcGrandTotal,
      totalSavings: calcSavings,
    }
  }, [cart.items])

  // Handle filling demo address
  const handleAutofillDemoAddress = () => {
    if (session?.userId) {
      const userAddresses = getAddressesForUser(session.userId)
      const primary = userAddresses.find((a) => a.isDefault) || userAddresses[0]
      if (primary) {
        setFullName(primary.fullName)
        setPhone(primary.phone)
        setLine1(primary.line1)
        setLine2(primary.line2 || "")
        setCity(primary.city)
        setState(primary.state)
        setPincode(primary.pincode)
        setErrorMessage(null)
        return
      }
    }

    setFullName(session?.name || "Priya Sharma")
    setPhone(session?.phone || "9876543210")
    setLine1("Flat 402, Sunshine Apartments, 12th Main Road")
    setLine2("Near Metro Station, Indiranagar")
    setCity("Bengaluru")
    setState("Karnataka")
    setPincode("560038")
    setErrorMessage(null)
  }

  // Validate address form
  const validateAddress = (): string | null => {
    if (!effectiveName.trim() || effectiveName.trim().length < 2) {
      return "Please enter your full recipient name."
    }
    const cleanPhone = effectivePhone.trim().replace(/\D/g, "")
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      return "Please enter a valid 10-digit Indian contact number starting with 6–9."
    }
    if (!line1.trim() || line1.trim().length < 5) {
      return "Please enter a complete street address or apartment details."
    }
    if (!city.trim()) {
      return "Please enter your delivery city."
    }
    if (!state.trim()) {
      return "Please enter your state."
    }
    const cleanPin = pincode.trim().replace(/\D/g, "")
    if (!cleanPin || !/^\d{6}$/.test(cleanPin)) {
      return "Please enter a valid 6-digit Indian postal PIN code (e.g. 560038)."
    }
    return null
  }

  // Order submission
  const handlePlaceOrder = (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (verifiedItems.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before placing an order.")
      return
    }

    const validationError = validateAddress()
    if (validationError) {
      setErrorMessage(validationError)
      return
    }

    setIsSubmitting(true)

    // Simulate online payment delay (600ms)
    setTimeout(() => {
      // Handle simulated payment failure test
      if (paymentMethod === "online" && simulateOutcome === "failure") {
        setIsSubmitting(false)
        setErrorMessage(
          "Simulated Payment Failed: The simulated banking gateway rejected this transaction. Your cart and entered address are intact. You may try again or select Cash on Delivery.",
        )
        return
      }

      // Successful order creation
      const addressSnapshot: Address = {
        fullName: effectiveName.trim(),
        phone: effectivePhone.trim().replace(/\D/g, ""),
        line1: line1.trim(),
        line2: line2.trim() || undefined,
        city: city.trim(),
        state: state.trim(),
        pincode: pincode.trim().replace(/\D/g, ""),
      }

      const generatedId = `ord-${Date.now().toString(36).slice(-4)}-${Math.random()
        .toString(36)
        .substring(2, 6)}`

      const newOrder: Order = {
        id: generatedId,
        userId: session?.userId || "guest",
        placedAt: new Date().toISOString(),
        status: "confirmed",
        paymentMethod,
        items: verifiedItems,
        address: addressSnapshot,
        subtotal,
        deliveryCharge,
        total: grandTotal,
      }

      // Persist to local order storage
      saveLocalOrder(newOrder)

      // Clear cart only after successful order placement
      clearCart()

      // Redirect to confirmation page
      router.push(`/checkout/success?orderId=${encodeURIComponent(generatedId)}`)
    }, 700)
  }

  if (!isCartLoaded || !isAuthLoaded) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <Skeleton className="h-96 w-full rounded-xl lg:col-span-2" />
          <Skeleton className="h-80 w-full rounded-xl" />
        </div>
      </div>
    )
  }

  // Empty cart fallback
  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="flex size-16 mx-auto items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
          <Truck className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Your Cart is Empty
        </h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          You don&apos;t have any items in your cart to checkout. Browse our wide range of products and deals!
        </p>
        <div className="mt-6">
          <Button asChild variant="cta" size="lg" className="font-bold shadow-xs">
            <Link href="/products">
              Explore Products
              <ArrowRight className="size-4 ms-2" />
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
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
          <li>
            <Link href="/cart" className="transition hover:text-foreground">
              Cart
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current="page" className="font-medium text-foreground">
            Checkout
          </li>
        </ol>
      </nav>

      {/* Page Title */}
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-border/80 pb-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Checkout
          </h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Complete your delivery address and choose a simulated payment option
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
          <Lock className="size-3.5" />
          <span className="font-medium">Safe Demo Checkout</span>
        </div>
      </div>

      {/* Main Grid */}
      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column: Details & Payment */}
        <div className="space-y-6 lg:col-span-2">
          {/* Global Error Banner */}
          {errorMessage && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs text-destructive leading-relaxed"
            >
              <AlertCircle className="size-4.5 shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-semibold block">Checkout Notice:</span>
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Section 1: User / Customer Info */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span>1. Contact Details</span>
                </CardTitle>
                {isSignedIn ? (
                  <span className="text-[11px] text-muted-foreground bg-muted/60 px-2 py-0.5 rounded-md font-mono">
                    Signed in as {session?.name}
                  </span>
                ) : (
                  <Link
                    href="/login?redirect=/checkout"
                    className="text-xs text-primary font-medium hover:underline"
                  >
                    Sign in with OTP for faster checkout
                  </Link>
                )}
              </div>
            </CardHeader>
            <CardContent className="pt-4 text-xs text-muted-foreground">
              {isSignedIn ? (
                <p>
                  Order updates will be linked to your account (<strong>{session?.phone}</strong> / <strong>{session?.email}</strong>).
                </p>
              ) : (
                <p>
                  You are checking out as a guest. You can sign in anytime to link your past orders.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Delivery Address Form */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <MapPin className="size-4 text-primary" />
                  <span>2. Delivery Address</span>
                </CardTitle>
                <Button
                  type="button"
                  variant="outline"
                  size="xs"
                  onClick={handleAutofillDemoAddress}
                  className="gap-1 text-[11px] text-primary hover:text-primary"
                >
                  <Sparkles className="size-3" />
                  Autofill Demo Address
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-name" className="text-xs font-semibold text-foreground">
                    Full Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkout-name"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={effectiveName}
                    onChange={(e) => {
                      setFullName(e.target.value)
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>

                {/* Mobile Phone */}
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-phone" className="text-xs font-semibold text-foreground">
                    10-Digit Mobile Number <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex rounded-lg border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                    <div className="flex items-center border-e border-border bg-muted/50 px-2.5 text-xs font-medium text-muted-foreground select-none">
                      +91
                    </div>
                    <Input
                      id="checkout-phone"
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      placeholder="9876543210"
                      value={effectivePhone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""))
                        setErrorMessage(null)
                      }}
                      className="border-0 shadow-none focus-visible:ring-0 text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Street Address Line 1 */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-line1" className="text-xs font-semibold text-foreground">
                  House / Flat / Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="checkout-line1"
                  type="text"
                  placeholder="e.g. Flat 402, Sunshine Apartments, 12th Main Road"
                  value={line1}
                  onChange={(e) => {
                    setLine1(e.target.value)
                    setErrorMessage(null)
                  }}
                  required
                />
              </div>

              {/* Line 2 / Landmark */}
              <div className="space-y-1.5">
                <Label htmlFor="checkout-line2" className="text-xs font-semibold text-foreground">
                  Apartment, Suite, or Landmark (Optional)
                </Label>
                <Input
                  id="checkout-line2"
                  type="text"
                  placeholder="e.g. Near Metro Station / Opposite Park"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                />
              </div>

              {/* City, State, PIN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-city" className="text-xs font-semibold text-foreground">
                    City / Town <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkout-city"
                    type="text"
                    placeholder="Bengaluru"
                    value={city}
                    onChange={(e) => {
                      setCity(e.target.value)
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkout-state" className="text-xs font-semibold text-foreground">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkout-state"
                    type="text"
                    placeholder="Karnataka"
                    value={state}
                    onChange={(e) => {
                      setState(e.target.value)
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="checkout-pincode" className="text-xs font-semibold text-foreground">
                    PIN Code <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="checkout-pincode"
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="560038"
                    value={pincode}
                    onChange={(e) => {
                      setPincode(e.target.value.replace(/\D/g, ""))
                      setErrorMessage(null)
                    }}
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Payment Method */}
          <Card className="border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <CreditCard className="size-4 text-primary" />
                <span>3. Payment Method</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4">
              <RadioGroup
                value={paymentMethod}
                onValueChange={(val: string) => {
                  setPaymentMethod(val as PaymentMethod)
                  setErrorMessage(null)
                }}
                className="gap-3"
              >
                {/* Option 1: Online Payment Simulation */}
                <label
                  htmlFor="payment-online"
                  className={`flex flex-col rounded-xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "online"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="online" id="payment-online" />
                      <div>
                        <span className="font-semibold text-sm text-foreground block">
                          Online Payment (Demo Simulation)
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Simulate UPI, Credit/Debit Card, or Net Banking
                        </span>
                      </div>
                    </div>
                    <CreditCard className="size-5 text-primary" />
                  </div>

                  {paymentMethod === "online" && (
                    <div className="mt-3.5 space-y-2.5 rounded-lg border border-border bg-card p-3 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                        <span>No real payment gateway connected. No card details or OTP required.</span>
                      </div>

                      {/* Simulation Outcome Selector */}
                      <div className="pt-1.5 border-t border-border/60">
                        <span className="font-semibold text-[11px] text-muted-foreground uppercase tracking-wider block mb-1.5">
                          Simulation Test Controls:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => setSimulateOutcome("success")}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                              simulateOutcome === "success"
                                ? "bg-emerald-600 text-white shadow-2xs"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            ✓ Simulate Success
                          </button>
                          <button
                            type="button"
                            onClick={() => setSimulateOutcome("failure")}
                            className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                              simulateOutcome === "failure"
                                ? "bg-destructive text-destructive-foreground shadow-2xs"
                                : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            ✕ Test Payment Failure
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </label>

                {/* Option 2: Cash on Delivery */}
                <label
                  htmlFor="payment-cod"
                  className={`flex flex-col rounded-xl border p-4 cursor-pointer transition-all ${
                    paymentMethod === "cod"
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="payment-cod" />
                      <div>
                        <span className="font-semibold text-sm text-foreground block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Pay cash or UPI at your doorstep upon package delivery
                        </span>
                      </div>
                    </div>
                    <Banknote className="size-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                </label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Order Summary Card */}
        <div>
          <Card className="sticky top-20 border-border shadow-2xs">
            <CardHeader className="border-b border-border/80 pb-3">
              <CardTitle className="text-base font-bold">
                Order Summary ({verifiedItems.length} {verifiedItems.length === 1 ? "item" : "items"})
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4 pt-4 text-xs">
              {/* Items List Mini */}
              <div className="divide-y divide-border/60 max-h-56 overflow-y-auto pe-1">
                {verifiedItems.map((item, idx) => (
                  <div
                    key={item.productId + (item.variantLabel || "") + idx}
                    className="flex items-center gap-2.5 py-2 first:pt-0 last:pb-0"
                  >
                    <div className="relative size-11 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                      <Image
                        src={item.image || "/images/placeholder.svg"}
                        alt={item.name}
                        fill
                        sizes="44px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="font-medium text-foreground line-clamp-1 block text-xs">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Qty: {item.quantity}{" "}
                        {item.variantLabel && `• ${item.variantLabel}`}
                      </span>
                    </div>
                    <span className="font-semibold text-foreground text-xs shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">
                    {formatPrice(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Delivery Charges</span>
                  <span>
                    {deliveryCharge === 0 ? (
                      <strong className="text-emerald-600 dark:text-emerald-400 font-semibold">
                        FREE
                      </strong>
                    ) : (
                      <span className="text-foreground font-medium">
                        {formatPrice(deliveryCharge)}
                      </span>
                    )}
                  </span>
                </div>

                {totalSavings > 0 && (
                  <div className="flex items-center justify-between rounded-lg bg-cta/15 px-2 py-1 text-xs font-bold text-amber-950 dark:text-amber-300 border border-cta/30">
                    <span className="inline-flex items-center gap-1">
                      <Sparkles className="size-3" /> Total Savings
                    </span>
                    <span>-{formatPrice(totalSavings)}</span>
                  </div>
                )}
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Grand Total</span>
                <span className="text-base text-primary">
                  {formatPrice(grandTotal)}
                </span>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col gap-3 pt-3 border-t border-border/80">
              <Button
                type="submit"
                variant="cta"
                size="lg"
                disabled={isSubmitting}
                className="w-full font-bold shadow-xs text-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin me-2" />
                    Processing Order…
                  </>
                ) : (
                  <>
                    Place Order ({formatPrice(grandTotal)})
                    <ArrowRight className="size-4 ms-2" />
                  </>
                )}
              </Button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="size-3.5 text-primary" />
                <span>Simulated Order: No bank charge or real delivery.</span>
              </div>
            </CardFooter>
          </Card>
        </div>
      </form>
    </div>
  )
}
