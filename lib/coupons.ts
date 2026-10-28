import rawCoupons from "@/data/coupons.json"
import type { Coupon, CouponValidationResult } from "@/types/coupon"

const coupons: Coupon[] = rawCoupons as Coupon[]

export function getAllCoupons(): Coupon[] {
  return coupons
}

export function getCouponByCode(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase()
  return coupons.find((c) => c.code.toUpperCase() === normalized)
}

export function validateCoupon(
  code: string,
  subtotal: number,
  deliveryCharge = 0,
): CouponValidationResult {
  if (!code || !code.trim()) {
    return {
      valid: false,
      message: "Please enter a coupon code.",
      discount: 0,
      deliveryDiscount: 0,
    }
  }

  const coupon = getCouponByCode(code)
  if (!coupon) {
    return {
      valid: false,
      message: `Invalid coupon code "${code.trim().toUpperCase()}". Try SAVE10 or FIRST50.`,
      discount: 0,
      deliveryDiscount: 0,
    }
  }

  if (subtotal < coupon.minOrderValue) {
    return {
      valid: false,
      message: `Coupon "${coupon.code}" requires a minimum order subtotal of ₹${coupon.minOrderValue}.`,
      discount: 0,
      deliveryDiscount: 0,
      coupon,
    }
  }

  let discount = 0
  let deliveryDiscount = 0

  if (coupon.type === "percentage") {
    const rawDisc = Math.round((subtotal * coupon.value) / 100)
    discount = coupon.maxDiscount ? Math.min(rawDisc, coupon.maxDiscount) : rawDisc
  } else if (coupon.type === "fixed") {
    discount = Math.min(coupon.value, subtotal)
  } else if (coupon.type === "free_delivery") {
    deliveryDiscount = deliveryCharge
  }

  return {
    valid: true,
    message: `Coupon "${coupon.code}" applied successfully!`,
    discount,
    deliveryDiscount,
    coupon,
  }
}

