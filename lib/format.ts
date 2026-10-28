/**
 * INR price convention:
 * - All prices in JSON and types are stored in RUPEES (e.g. 499.00).
 * - Business logic (discount %, subtotals) operates on rupees.
 * - NEVER mix paise and rupees in the same expression.
 * - If paise precision is required for payment gateways, convert safely using helpers below.
 */

/**
 * Format a rupee amount for display in the Indian numbering system.
 * @param rupees - Amount in rupees (e.g. 1299)
 * @returns Formatted string like "₹1,299" or "₹—" for missing/invalid amounts
 */
export function formatPrice(rupees?: number | null): string {
  if (
    rupees === undefined ||
    rupees === null ||
    !isFinite(rupees) ||
    isNaN(rupees)
  ) {
    return "₹—"
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(rupees)
}

/**
 * Calculate the discount percentage between original MRP and sale price.
 * Returns null if there is no meaningful discount.
 */
export function discountPercent(
  originalPrice?: number | null,
  salePrice?: number | null
): number | null {
  if (
    originalPrice === undefined ||
    originalPrice === null ||
    salePrice === undefined ||
    salePrice === null
  ) {
    return null
  }
  if (originalPrice <= 0 || salePrice <= 0) return null
  if (salePrice >= originalPrice) return null
  const pct = Math.round(((originalPrice - salePrice) / originalPrice) * 100)
  return pct > 0 ? pct : null
}

/**
 * Format an ISO date string or Date object for display.
 * @returns e.g. "28 Oct 2026"
 */
export function formatDate(date?: string | Date | null): string {
  if (!date) return "—"
  const d = typeof date === "string" ? new Date(date) : date
  if (isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

/**
 * Convert rupees to integer paise safely (e.g. 499 -> 49900).
 */
export function rupeesToPaise(rupees: number): number {
  if (!isFinite(rupees) || isNaN(rupees)) return 0
  return Math.round(rupees * 100)
}

/**
 * Convert integer paise to rupees safely (e.g. 49900 -> 499).
 */
export function paiseToRupees(paise: number): number {
  if (!isFinite(paise) || paise === 0) return 0
  return paise / 100
}
