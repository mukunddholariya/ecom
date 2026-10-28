/** Prices in rupees. */

export type OrderStatus =
  "placed" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type PaymentMethod = "cod" | "online"

export interface OrderItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  quantity: number
  variantLabel?: string
}

export interface Address {
  fullName: string
  phone: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
}

export interface Order {
  id: string
  userId?: string
  placedAt: string // ISO date string
  status: OrderStatus
  paymentMethod: PaymentMethod
  items: OrderItem[]
  address: Address
  subtotal: number
  deliveryCharge: number
  couponCode?: string
  couponDiscount?: number
  total: number
}

/** Alias to match Phase 01 specification */
export type MockOrder = Order
