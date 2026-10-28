/**
 * PROTOTYPE ONLY — fictional test accounts.
 * Never store real user data here.
 * OTP is always "123456" for every mock account in demo mode.
 */
export interface MockUser {
  id: string
  name: string
  email: string
  /** 10-digit Indian mobile number — fictional */
  phone: string
  /** Always "123456" for demo. Replace with real OTP service in production. */
  otp: string
}

/** Active session stored in localStorage (no real tokens) */
export interface MockSession {
  userId: string
  name: string
  email: string
  phone: string
}
