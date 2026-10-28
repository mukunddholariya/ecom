export interface Category {
  id: string
  slug: string
  name: string
  /** Lucide icon name (e.g. "shield", "sparkles", "heart") */
  icon: string
  imageUrl?: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}
