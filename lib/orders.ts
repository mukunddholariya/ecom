/**
 * ORDER MANAGEMENT — PROTOTYPE ONLY
 *
 * Persists created mock orders into localStorage so user-placed orders
 * survive page navigation and appear in /account and /checkout/success.
 */

import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage"
import type { Order } from "@/types/order"
import mockOrdersJson from "@/data/mock-orders.json"

const fixtureOrders = mockOrdersJson as Order[]

export function getLocalOrders(): Order[] {
  const stored = getStorage<Order[]>(STORAGE_KEYS.ORDERS)
  if (!stored || !Array.isArray(stored)) {
    return []
  }
  return stored
}

export function saveLocalOrder(order: Order): void {
  const current = getLocalOrders()
  // Prepend newest order first
  const updated = [order, ...current.filter((o) => o.id !== order.id)]
  setStorage(STORAGE_KEYS.ORDERS, updated)
}

export function findOrderById(orderId: string): Order | undefined {
  // Check newly placed orders in local storage first
  const localOrders = getLocalOrders()
  const foundLocal = localOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase())
  if (foundLocal) return foundLocal

  // Check fixture orders
  return fixtureOrders.find((o) => o.id.toLowerCase() === orderId.toLowerCase())
}

export function getAllOrdersForUser(userId: string): Order[] {
  const localOrders = getLocalOrders().filter(
    (o) => o.userId === userId || (!o.userId && userId === "guest")
  )
  const fixtureUserOrders = fixtureOrders.filter((o) => o.userId === userId)

  // Merge and deduplicate by ID, local placed orders take precedence
  const seenIds = new Set<string>()
  const merged: Order[] = []

  for (const ord of [...localOrders, ...fixtureUserOrders]) {
    if (!seenIds.has(ord.id)) {
      seenIds.add(ord.id)
      merged.push(ord)
    }
  }

  // Sort by placedAt date descending
  return merged.sort(
    (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime()
  )
}

