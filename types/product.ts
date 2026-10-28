/** Prices are stored in RUPEES (not paise). See lib/format.ts for convention. */

export interface ProductVariant {
  type: "size" | "color"
  label: string // e.g. "Large", "Midnight Black"
  value: string // e.g. "L", "#1a1a1a"
  stock: number
}

export interface Product {
  id: string
  slug: string
  name: string
  brand: string
  categoryId: string
  shortDescription: string
  description: string
  /** Sale price in rupees */
  price: number
  /** Original / MRP in rupees — only present when there is a real discount */
  originalPrice?: number
  currency: "INR"
  /** Array of image paths relative to /public, or absolute placeholder URLs */
  images: string[]
  /** 1–5 star rating */
  rating: number
  reviewCount: number
  stock: number
  sku: string
  tags: string[]
  isFeatured: boolean
  isNew: boolean
  variants?: ProductVariant[]
}
