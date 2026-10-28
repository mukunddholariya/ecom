/**
 * DATA ACCESS — PROTOTYPE ONLY
 *
 * This module reads from local JSON fixtures in /data/*.json.
 * These functions are intended for use in Next.js Server Components and
 * Route Handlers (server-side only).
 *
 * ⚠️  Replace these with real server-side database calls before production.
 *     Do not import this module directly in Client Components.
 */

import type { Product } from "@/types/product"
import type { Category } from "@/types/category"
import type { Banner } from "@/types/banner"
import type { MockUser } from "@/types/user"
import type { Order } from "@/types/order"

import productsJson from "@/data/products.json"
import categoriesJson from "@/data/categories.json"
import bannersJson from "@/data/banners.json"
import mockUsersJson from "@/data/mock-users.json"
import mockOrdersJson from "@/data/mock-orders.json"

// Cast imported JSON to typed arrays once
const products = productsJson as Product[]
const categories = categoriesJson as Category[]
const banners = bannersJson as Banner[]
const mockUsers = mockUsersJson as MockUser[]
const mockOrders = mockOrdersJson as Order[]

// ─── Products ────────────────────────────────────────────────────────────────

export function getProducts(): Product[] {
  return products
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug)
}

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.isFeatured)
}

export function getNewProducts(): Product[] {
  return products.filter((p) => p.isNew)
}

/**
 * Filter products by either category ID ("cat-01") or category slug ("electronics").
 */
export function getProductsByCategory(categoryOrSlug: string): Product[] {
  const cat = categories.find(
    (c) => c.id === categoryOrSlug || c.slug === categoryOrSlug
  )
  const targetId = cat ? cat.id : categoryOrSlug
  return products.filter((p) => p.categoryId === targetId)
}

export function searchProducts(query: string): Product[] {
  const q = query.toLowerCase().trim()
  if (!q) return products
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.shortDescription.toLowerCase().includes(q)
  )
}

// ─── Categories ──────────────────────────────────────────────────────────────

export function getCategories(): Category[] {
  return categories
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find((c) => c.id === id)
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug)
}

// ─── Banners ─────────────────────────────────────────────────────────────────

export function getBanners(): Banner[] {
  return banners
}

// ─── Mock Users (prototype auth only) ────────────────────────────────────────

export function getMockUsers(): MockUser[] {
  return mockUsers
}

export function getMockUserByPhone(phone: string): MockUser | undefined {
  return mockUsers.find((u) => u.phone === phone)
}

export function getMockUserByEmail(email: string): MockUser | undefined {
  return mockUsers.find((u) => u.email === email)
}

export function getMockUserById(id: string): MockUser | undefined {
  return mockUsers.find((u) => u.id === id)
}

// ─── Mock Orders (prototype orders only) ──────────────────────────────────────

export function getMockOrders(): Order[] {
  return mockOrders
}

export function getMockOrderById(id: string): Order | undefined {
  return mockOrders.find((o) => o.id === id)
}

export function getMockOrdersByUserId(userId: string): Order[] {
  return mockOrders.filter((o) => o.userId === userId)
}
