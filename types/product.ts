/** Prices are stored in RUPEES (not paise). See lib/format.ts for convention. */

export interface ProductSpecification {
  name: string
  value: string
  group?: string
}

export interface ProductVariant {
  type: "size" | "color" | "pack"
  label: string // e.g. "Pack of 10", "100ml"
  value: string // e.g. "10", "100ml"
  stock: number
  sku?: string
  price?: number
  originalPrice?: number
  image?: string
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
  demoOnly?: boolean
  variants?: ProductVariant[]
  highlights?: string[]
  specifications?: ProductSpecification[]
  warranty?: string
}
