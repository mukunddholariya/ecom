"use client"

/**
 * PROTOTYPE ONLY — mock authentication using localStorage.
 * No real tokens, JWTs, or session cookies are used.
 * Replace this with a proper auth solution before production.
 */

import { useCallback, useEffect, useState, useSyncExternalStore } from "react"
import { getMockUserByEmail, getMockUserByPhone } from "@/lib/data"
import {
  getStorage,
  removeStorage,
  setStorage,
  STORAGE_KEYS,
} from "@/lib/storage"
import type { MockSession } from "@/types/user"

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

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
  isLoaded: boolean
}

export function useAuth(): UseAuthReturn {
  const isLoaded = useIsMounted()
  const [session, setSession] = useState<MockSession | null>(() => {
    return getStorage<MockSession>(STORAGE_KEYS.SESSION)
  })

  useEffect(() => {
    if (!isLoaded) return
    if (session) {
      setStorage(STORAGE_KEYS.SESSION, session)
    } else {
      removeStorage(STORAGE_KEYS.SESSION)
    }
  }, [session, isLoaded])

  const verifyOtp = useCallback((identifier: string, otp: string): boolean => {
    // Fixed demo OTP for local prototype
    if (otp !== "123456") return false

    // Try finding existing mock fixture user by phone or email
    const trimmed = identifier.trim()
    const user =
      getMockUserByPhone(trimmed) ?? getMockUserByEmail(trimmed.toLowerCase())

    const isEmail = trimmed.includes("@")
    const newSession: MockSession = {
      userId: user?.id ?? `user-${Date.now().toString(36)}`,
      name: user?.name ?? (isEmail ? trimmed.split("@")[0] : `Shopper ${trimmed.slice(-4)}`),
      email: user?.email ?? (isEmail ? trimmed.toLowerCase() : `${trimmed}@demo.store`),
      phone: user?.phone ?? (isEmail ? "9876543210" : trimmed),
    }

    setSession(newSession)
    return true
  }, [])

  const signOut = useCallback(() => {
    setSession(null)
  }, [])

  const activeSession = isLoaded ? session : null

  return {
    session: activeSession,
    isSignedIn: activeSession !== null,
    isLoaded,
    verifyOtp,
    signOut,
  }
}
