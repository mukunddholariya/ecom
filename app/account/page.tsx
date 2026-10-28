"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  User,
  Package,
  LogOut,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Calendar,
  CreditCard,
  Truck,
  MapPin,
  Plus,
  Trash2,
  Pencil,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { formatPrice } from "@/lib/format"
import { getAllOrdersForUser } from "@/lib/orders"
import {
  getAddressesForUser,
  saveAddress,
  deleteAddress,
  setDefaultAddress,
  type SavedAddress,
} from "@/lib/addresses"
import type { Order } from "@/types/order"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"

export default function AccountPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { session, isSignedIn, isLoaded, signOut } = useAuth()
  const { totals } = useCart()

  // Active tab state
  const [activeTab, setActiveTab] = useState("orders")

  // Address dialog states
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false)
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null)
  const [addressForm, setAddressForm] = useState({
    fullName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    isDefault: false,
  })
  const [addressError, setAddressError] = useState<string | null>(null)

  // Orders query
  const { data: orders = [], isLoading: loadingOrders } = useQuery<Order[]>({
    queryKey: ["orders", session?.userId],
    queryFn: () => {
      if (!session?.userId) return []
      return getAllOrdersForUser(session.userId)
    },
    enabled: isLoaded && !!session?.userId,
  })

  // Addresses query
  const { data: addresses = [] } = useQuery<SavedAddress[]>({
    queryKey: ["addresses", session?.userId],
    queryFn: () => {
      if (!session?.userId) return []
      return getAddressesForUser(session.userId)
    },
    enabled: isLoaded && !!session?.userId,
  })

  const handleSignOut = () => {
    signOut()
    router.push("/")
  }

  // Address Handlers
  const handleOpenAddAddress = () => {
    setEditingAddressId(null)
    setAddressForm({
      fullName: session?.name || "",
      phone: session?.phone || "",
      line1: "",
      line2: "",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560038",
      isDefault: addresses.length === 0,
    })
    setAddressError(null)
    setIsAddressModalOpen(true)
  }

  const handleOpenEditAddress = (addr: SavedAddress) => {
    setEditingAddressId(addr.id)
    setAddressForm({
      fullName: addr.fullName,
      phone: addr.phone,
      line1: addr.line1,
      line2: addr.line2 || "",
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      isDefault: !!addr.isDefault,
    })
    setAddressError(null)
    setIsAddressModalOpen(true)
  }

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault()
    setAddressError(null)

    if (!addressForm.fullName.trim() || addressForm.fullName.trim().length < 2) {
      setAddressError("Please enter a valid recipient name.")
      return
    }
    const cleanPhone = addressForm.phone.trim().replace(/\D/g, "")
    if (!cleanPhone || !/^[6-9]\d{9}$/.test(cleanPhone)) {
      setAddressError("Please enter a valid 10-digit Indian phone number starting with 6–9.")
      return
    }
    if (!addressForm.line1.trim() || addressForm.line1.trim().length < 5) {
      setAddressError("Please enter a complete street address or apartment details.")
      return
    }
    if (!addressForm.city.trim() || !addressForm.state.trim()) {
      setAddressError("City and state are required.")
      return
    }
    const cleanPin = addressForm.pincode.trim().replace(/\D/g, "")
    if (!cleanPin || !/^\d{6}$/.test(cleanPin)) {
      setAddressError("Please enter a valid 6-digit Indian PIN code (e.g. 560038).")
      return
    }

    const newId = editingAddressId || `addr-${Date.now().toString(36)}`
    saveAddress({
      id: newId,
      userId: session?.userId || "user-01",
      fullName: addressForm.fullName.trim(),
      phone: cleanPhone,
      line1: addressForm.line1.trim(),
      line2: addressForm.line2.trim() || undefined,
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pincode: cleanPin,
      isDefault: addressForm.isDefault,
    })

    queryClient.invalidateQueries({ queryKey: ["addresses", session?.userId] })
    setIsAddressModalOpen(false)
  }

  const handleDeleteAddress = (addressId: string) => {
    deleteAddress(addressId)
    queryClient.invalidateQueries({ queryKey: ["addresses", session?.userId] })
  }

  const handleSetDefault = (addressId: string) => {
    if (!session?.userId) return
    setDefaultAddress(addressId, session.userId)
    queryClient.invalidateQueries({ queryKey: ["addresses", session?.userId] })
  }

  if (!isLoaded) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-full max-w-xs" />
        <Skeleton className="h-72 w-full rounded-xl" />
      </div>
    )
  }

  // Not signed in state
  if (!isSignedIn || !session) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <div className="flex size-16 mx-auto items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
          <User className="size-8" />
        </div>
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground">
          Sign In to Your Account
        </h1>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Sign in using your mobile number or email to view past demo orders, track deliveries, manage addresses, and manage your profile.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button asChild variant="cta" size="lg" className="w-full sm:w-auto font-bold shadow-xs">
            <Link href="/login?redirect=/account">
              Sign In with OTP
              <ArrowRight className="size-4 ms-2" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto text-xs">
            <Link href="/products">Browse Store</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border/80 pb-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              My Account
            </h1>
            <Badge variant="secondary" className="text-[11px] font-medium">
              Demo Session
            </Badge>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Signed in as <strong className="text-foreground">{session.name}</strong> (+91 {session.phone})
          </p>
        </div>

        <div className="flex items-center gap-2">
          {totals.itemCount > 0 && (
            <Button asChild variant="outline" size="sm" className="text-xs">
              <Link href="/cart" className="gap-1.5">
                <ShoppingBag className="size-3.5 text-primary" />
                Cart ({totals.itemCount})
              </Link>
            </Button>
          )}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="size-3.5 me-1.5" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="orders" className="text-xs gap-1.5 font-medium">
            <Package className="size-3.5" />
            Orders ({orders.length})
          </TabsTrigger>
          <TabsTrigger value="addresses" className="text-xs gap-1.5 font-medium">
            <MapPin className="size-3.5" />
            Addresses ({addresses.length})
          </TabsTrigger>
          <TabsTrigger value="profile" className="text-xs gap-1.5 font-medium">
            <User className="size-3.5" />
            Profile
          </TabsTrigger>
        </TabsList>

        {/* ─── TAB 1: ORDERS ────────────────────────────────────────────── */}
        <TabsContent value="orders" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Past Orders & Order History
              </h2>
              <p className="text-xs text-muted-foreground">
                All mock orders placed during your browser session and demo fixtures
              </p>
            </div>
          </div>

          {loadingOrders ? (
            <div className="space-y-4">
              <Skeleton className="h-36 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          ) : orders.length === 0 ? (
            <Card className="border-border border-dashed shadow-2xs p-10 text-center">
              <div className="flex size-14 mx-auto items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
                <Package className="size-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                No orders placed yet
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Explore our catalog, add items to cart, and test placing a simulated order!
              </p>
              <div className="mt-4">
                <Button asChild variant="cta" size="sm" className="font-semibold shadow-xs">
                  <Link href="/products">
                    Explore Catalog
                    <ArrowRight className="size-3.5 ms-1.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => {
                const dateStr = new Date(order.placedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })

                return (
                  <Card key={order.id} className="border-border shadow-2xs overflow-hidden">
                    {/* Order Top Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 bg-muted/20 px-4 py-3 text-xs">
                      <div className="flex flex-wrap items-center gap-3">
                        <div>
                          <span className="text-muted-foreground">Order ID: </span>
                          <span className="font-mono font-bold text-foreground">
                            #{order.id.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-muted-foreground">|</span>
                        <div className="inline-flex items-center gap-1 text-muted-foreground">
                          <Calendar className="size-3 text-muted-foreground" />
                          <span>{dateStr}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "shipped"
                              ? "secondary"
                              : "outline"
                          }
                          className="capitalize text-[11px]"
                        >
                          {order.status === "shipped" && (
                            <Truck className="size-3 me-1 inline" />
                          )}
                          {order.status}
                        </Badge>

                        <Button asChild variant="outline" size="xs" className="h-7 text-[11px] gap-1">
                          <Link href={`/account/orders/${order.id}`}>
                            View Details
                            <ExternalLink className="size-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>

                    {/* Items Preview */}
                    <CardContent className="divide-y divide-border/60 p-4">
                      {order.items.map((item, i) => (
                        <div
                          key={item.productId + i}
                          className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
                        >
                          <div className="relative size-12 shrink-0 overflow-hidden rounded-md border border-border bg-muted/30">
                            <Image
                              src={item.image || "/images/placeholder.svg"}
                              alt={item.name}
                              fill
                              sizes="48px"
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
                            <p className="text-[11px] text-muted-foreground">
                              Qty: {item.quantity}{" "}
                              {item.variantLabel && `• Variant: ${item.variantLabel}`}
                            </p>
                          </div>

                          <div className="text-end text-xs font-bold text-foreground">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      ))}
                    </CardContent>

                    {/* Order Footer */}
                    <CardFooter className="flex flex-wrap items-center justify-between gap-2 border-t border-border/80 bg-muted/10 px-4 py-2.5 text-xs">
                      <div className="inline-flex items-center gap-1.5 text-muted-foreground">
                        <CreditCard className="size-3.5" />
                        <span className="capitalize">
                          {order.paymentMethod === "cod" ? "Cash on Delivery" : "Online Prepaid"}
                        </span>
                      </div>

                      <div className="flex items-baseline gap-1.5">
                        <span className="text-muted-foreground">Order Total:</span>
                        <span className="text-sm font-bold text-primary">
                          {formatPrice(order.total)}
                        </span>
                      </div>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 2: ADDRESSES ─────────────────────────────────────────── */}
        <TabsContent value="addresses" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground">
                Saved Delivery Addresses
              </h2>
              <p className="text-xs text-muted-foreground">
                Manage your delivery locations for fast checkout
              </p>
            </div>

            <Button
              type="button"
              variant="cta"
              size="sm"
              onClick={handleOpenAddAddress}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              <Plus className="size-3.5" />
              Add New Address
            </Button>
          </div>

          {addresses.length === 0 ? (
            <Card className="border-border border-dashed shadow-2xs p-10 text-center">
              <div className="flex size-14 mx-auto items-center justify-center rounded-full bg-muted/60 text-muted-foreground border border-border">
                <MapPin className="size-7" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-foreground">
                No saved addresses
              </h3>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                Add an address to speed up your checkout experience.
              </p>
              <div className="mt-4">
                <Button
                  type="button"
                  variant="cta"
                  size="sm"
                  onClick={handleOpenAddAddress}
                  className="font-semibold shadow-xs"
                >
                  <Plus className="size-3.5 me-1.5" />
                  Add Address
                </Button>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <Card
                  key={addr.id}
                  className={`border-border shadow-2xs relative flex flex-col justify-between ${
                    addr.isDefault ? "border-primary/50 bg-primary/2" : ""
                  }`}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-sm font-bold text-foreground">
                          {addr.fullName}
                        </CardTitle>
                        <p className="font-mono text-xs text-muted-foreground mt-0.5">
                          +91 {addr.phone}
                        </p>
                      </div>

                      {addr.isDefault && (
                        <Badge variant="default" className="text-[10px] gap-1 font-semibold">
                          <CheckCircle2 className="size-3" />
                          Default
                        </Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="text-xs text-muted-foreground space-y-1 pb-4 leading-relaxed">
                    <p>{addr.line1}</p>
                    {addr.line2 && <p>{addr.line2}</p>}
                    <p className="font-medium text-foreground">
                      {addr.city}, {addr.state} — {addr.pincode}
                    </p>
                  </CardContent>

                  <CardFooter className="flex items-center justify-between gap-2 border-t border-border/80 bg-muted/20 p-3 text-xs">
                    <div>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(addr.id)}
                          className="text-[11px] text-primary hover:underline font-medium"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleOpenEditAddress(addr)}
                        aria-label="Edit address"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Pencil className="size-3.5" />
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        onClick={() => handleDeleteAddress(addr.id)}
                        aria-label="Delete address"
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* ─── TAB 3: PROFILE ───────────────────────────────────────────── */}
        <TabsContent value="profile" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Profile Overview Card */}
            <Card className="border-border shadow-2xs md:col-span-2">
              <CardHeader className="border-b border-border/80 pb-3">
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <User className="size-4 text-primary" />
                  <span>Profile Information</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Full Name
                  </span>
                  <p className="font-semibold text-sm text-foreground mt-0.5">
                    {session.name}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Mobile Number
                  </span>
                  <p className="font-mono text-sm text-foreground mt-0.5">
                    +91 {session.phone}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Email Address
                  </span>
                  <p className="text-sm text-foreground mt-0.5 truncate">
                    {session.email}
                  </p>
                </div>

                <div>
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    Demo Account ID
                  </span>
                  <p className="font-mono text-xs text-muted-foreground mt-0.5">
                    {session.userId}
                  </p>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/80 bg-muted/10 p-4">
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                  <ShieldCheck className="size-3.5 text-primary shrink-0" />
                  <span>Prototype session active in browser localStorage.</span>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <LogOut className="size-3.5 me-1.5" />
                  Sign Out
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Stats Column */}
            <div className="space-y-4">
              <Card className="border-border shadow-2xs p-4">
                <span className="text-xs text-muted-foreground block">Total Orders</span>
                <span className="text-2xl font-bold text-foreground mt-1 block">
                  {orders.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Orders tracked in local records
                </p>
              </Card>

              <Card className="border-border shadow-2xs p-4">
                <span className="text-xs text-muted-foreground block">Saved Addresses</span>
                <span className="text-2xl font-bold text-foreground mt-1 block">
                  {addresses.length}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  Ready for fast one-click checkout
                </p>
              </Card>

              <Card className="border-border shadow-2xs p-4">
                <span className="text-xs text-muted-foreground block">Items in Cart</span>
                <span className="text-2xl font-bold text-primary mt-1 block">
                  {totals.itemCount}
                </span>
                <p className="text-[11px] text-muted-foreground mt-1">
                  {totals.itemCount > 0 ? "Ready to checkout" : "Cart is empty"}
                </p>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* ─── ADD / EDIT ADDRESS DIALOG MODAL ─────────────────────────────── */}
      <Dialog open={isAddressModalOpen} onOpenChange={setIsAddressModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">
              {editingAddressId ? "Edit Delivery Address" : "Add New Delivery Address"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Provide recipient and postal address details for simulated doorstep delivery.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-3.5 pt-2">
            {addressError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-2.5 text-xs text-destructive"
              >
                <AlertCircle className="size-4 shrink-0" />
                <span>{addressError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="addr-name" className="text-xs font-semibold">
                  Full Name *
                </Label>
                <Input
                  id="addr-name"
                  type="text"
                  placeholder="Priya Sharma"
                  value={addressForm.fullName}
                  onChange={(e) =>
                    setAddressForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addr-phone" className="text-xs font-semibold">
                  Mobile Number *
                </Label>
                <Input
                  id="addr-phone"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="9876543210"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm((f) => ({
                      ...f,
                      phone: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="addr-line1" className="text-xs font-semibold">
                Street / Apartment Address *
              </Label>
              <Input
                id="addr-line1"
                type="text"
                placeholder="Flat 402, Sunshine Apartments, 12th Main"
                value={addressForm.line1}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, line1: e.target.value }))
                }
                required
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="addr-line2" className="text-xs font-semibold">
                Landmark / Area (Optional)
              </Label>
              <Input
                id="addr-line2"
                type="text"
                placeholder="Near Metro Station"
                value={addressForm.line2}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, line2: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <Label htmlFor="addr-city" className="text-xs font-semibold">
                  City *
                </Label>
                <Input
                  id="addr-city"
                  type="text"
                  placeholder="Bengaluru"
                  value={addressForm.city}
                  onChange={(e) =>
                    setAddressForm((f) => ({ ...f, city: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addr-state" className="text-xs font-semibold">
                  State *
                </Label>
                <Input
                  id="addr-state"
                  type="text"
                  placeholder="Karnataka"
                  value={addressForm.state}
                  onChange={(e) =>
                    setAddressForm((f) => ({ ...f, state: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="addr-pincode" className="text-xs font-semibold">
                  PIN Code *
                </Label>
                <Input
                  id="addr-pincode"
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="560038"
                  value={addressForm.pincode}
                  onChange={(e) =>
                    setAddressForm((f) => ({
                      ...f,
                      pincode: e.target.value.replace(/\D/g, ""),
                    }))
                  }
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                id="addr-default"
                type="checkbox"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  setAddressForm((f) => ({ ...f, isDefault: e.target.checked }))
                }
                className="size-4 rounded border-border text-primary focus:ring-primary/20"
              />
              <Label htmlFor="addr-default" className="text-xs cursor-pointer font-normal">
                Set as my default delivery address
              </Label>
            </div>

            <DialogFooter className="pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddressModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" variant="cta" size="sm" className="font-bold shadow-xs">
                Save Address
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
