"use client"

/**
 * PROTOTYPE ONLY — mock authentication using localStorage.
 * No real tokens, JWTs, or session cookies are used.
 * Replace this with a proper auth solution before production.
 */

import { getMockUserByEmail, getMockUserByPhone } from "@/lib/data"
import {
  getStorage,
  removeStorage,
  setStorage,
  STORAGE_KEYS,
} from "@/lib/storage"
import type { MockSession } from "@/types/user"
import { useCallback, useEffect, useState } from "react"

interface AuthActions {
  /**
   * Check if a phone/email exists and the OTP matches.
   * Returns true on success, false on invalid credentials.
   * In production, replace with a real OTP verification API call.
   */
  verifyOtp: (identifier: string, otp: string) => boolean
  signOut: () => void
}

interface UseAuthReturn extends AuthActions {
  session: MockSession | null
  isSignedIn: boolean
}

export function useAuth(): UseAuthReturn {
  const [session, setSession] = useState<MockSession | null>(() => {
    return getStorage<MockSession>(STORAGE_KEYS.SESSION)
  })

  useEffect(() => {
    if (session) {
      setStorage(STORAGE_KEYS.SESSION, session)
    } else {
      removeStorage(STORAGE_KEYS.SESSION)
    }
  }, [session])

  const verifyOtp = useCallback((identifier: string, otp: string): boolean => {
    // Try phone then email
    const user =
      getMockUserByPhone(identifier) ?? getMockUserByEmail(identifier)

    if (!user || user.otp !== otp) return false

    const newSession: MockSession = {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
    }
    setSession(newSession)
    return true
  }, [])

  const signOut = useCallback(() => {
    setSession(null)
  }, [])

  return {
    session,
    isSignedIn: session !== null,
    verifyOtp,
    signOut,
  }
}
