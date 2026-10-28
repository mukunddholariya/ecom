export type CouponType = "percentage" | "fixed" | "free_delivery"

export interface Coupon {
  code: string
  description: string
  type: CouponType
  value: number // Percentage (e.g. 10 for 10%) or Fixed rupees (e.g. 100)
  minOrderValue: number
  maxDiscount?: number
}

export interface CouponValidationResult {
  valid: boolean
  message: string
  discount: number
  deliveryDiscount: number
  coupon?: Coupon
}

