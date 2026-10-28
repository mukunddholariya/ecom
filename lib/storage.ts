/**
 * localStorage helpers with SSR guards.
 *
 * All reads return null on the server (window is undefined) so that
 * Server Components and the initial SSR pass stay hydration-safe.
 * Malformed stored JSON is caught and treated as a cache miss.
 */

function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Read and deserialise a value from localStorage.
 * Returns null on server, on missing key, or on parse error.
 */
export function getStorage<T>(key: string): T | null {
  if (!isBrowser()) return null
  try {
    const raw = window.localStorage.getItem(key)
    if (raw === null) return null
    return JSON.parse(raw) as T
  } catch {
    return null
  }
}

/**
 * Serialise and store a value in localStorage.
 * Silently ignores failures (quota exceeded, private browsing, etc.).
 */
export function setStorage<T>(key: string, value: T): void {
  if (!isBrowser()) return
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Storage unavailable — prototype degrades to in-memory only
  }
}

/**
 * Remove a key from localStorage.
 */
export function removeStorage(key: string): void {
  if (!isBrowser()) return
  try {
    window.localStorage.removeItem(key)
  } catch {
    // Silently ignore
  }
}

/** Namespaced keys — change prefix here if the store is renamed. */
export const STORAGE_KEYS = {
  CART: "ecom:cart",
  SESSION: "ecom:session",
  RECENT_PRODUCTS: "ecom:recent_products",
} as const
