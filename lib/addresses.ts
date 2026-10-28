/**
 * ADDRESS BOOK MANAGEMENT — PROTOTYPE ONLY
 *
 * Persists user addresses in localStorage with initial fixtures for demo accounts.
 */

import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage"
import type { Address } from "@/types/order"

export interface SavedAddress extends Address {
  id: string
  userId: string
  isDefault?: boolean
}

const DEFAULT_FIXTURE_ADDRESSES: SavedAddress[] = [
  {
    id: "addr-01",
    userId: "user-01",
    fullName: "Priya Sharma",
    phone: "9876543210",
    line1: "Flat 402, Sunshine Apartments, 12th Main",
    line2: "Near Metro Station, Indiranagar",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560038",
    isDefault: true,
  },
  {
    id: "addr-02",
    userId: "user-01",
    fullName: "Priya Sharma",
    phone: "9876543210",
    line1: "Prestige Tech Park, Block 3, 4th Floor",
    line2: "Marathahalli-Sarjapur Outer Ring Road",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    isDefault: false,
  },
  {
    id: "addr-03",
    userId: "user-02",
    fullName: "Rahul Mehta",
    phone: "9123456780",
    line1: "12B Green Glen Layout",
    line2: "Bellandur",
    city: "Bengaluru",
    state: "Karnataka",
    pincode: "560103",
    isDefault: true,
  },
]

export function getAllSavedAddresses(): SavedAddress[] {
  const stored = getStorage<SavedAddress[]>(STORAGE_KEYS.ADDRESSES)
  if (!stored || !Array.isArray(stored)) {
    return DEFAULT_FIXTURE_ADDRESSES
  }
  return stored
}

export function getAddressesForUser(userId: string): SavedAddress[] {
  const all = getAllSavedAddresses()
  return all.filter((a) => a.userId === userId)
}

export function saveAddress(address: SavedAddress): void {
  const all = getAllSavedAddresses()
  const exists = all.findIndex((a) => a.id === address.id)

  let updated: SavedAddress[]
  if (exists > -1) {
    updated = all.map((a) => (a.id === address.id ? address : a))
  } else {
    // If marked default, unmark other defaults for this user
    if (address.isDefault) {
      updated = [
        address,
        ...all.map((a) =>
          a.userId === address.userId ? { ...a, isDefault: false } : a
        ),
      ]
    } else {
      updated = [address, ...all]
    }
  }

  setStorage(STORAGE_KEYS.ADDRESSES, updated)
}

export function deleteAddress(addressId: string): void {
  const all = getAllSavedAddresses()
  const updated = all.filter((a) => a.id !== addressId)
  setStorage(STORAGE_KEYS.ADDRESSES, updated)
}

export function setDefaultAddress(addressId: string, userId: string): void {
  const all = getAllSavedAddresses()
  const updated = all.map((a) => {
    if (a.userId === userId) {
      return { ...a, isDefault: a.id === addressId }
    }
    return a
  })
  setStorage(STORAGE_KEYS.ADDRESSES, updated)
}

