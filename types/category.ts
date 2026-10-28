export interface Category {
  id: string
  slug: string
  name: string
  /** Lucide icon name (e.g. "smartphone", "shirt", "home") */
  icon: string
  imageUrl?: string
  description?: string
}
