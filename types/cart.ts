/** Prices in rupees — matches Product.price convention. */

export interface CartItem {
  productId: string
  slug: string
  name: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  stock?: number
  variantLabel?: string
}

export interface Cart {
  items: CartItem[]
}

/** Derived totals — computed, never stored */
export interface CartTotals {
  subtotal: number
  itemCount: number
  deliveryCharge: number
  total: number
  totalSavings: number
  couponDiscount?: number
  appliedCouponCode?: string
}
