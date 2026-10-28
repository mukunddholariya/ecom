"use client"

import { useCallback, useSyncExternalStore } from "react"
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage"

type Listener = () => void
const listeners = new Set<Listener>()

function emitChange() {
  for (const listener of listeners) {
    listener()
  }
}

let memoryWishlist: string[] | null = null

function getSnapshot(): string[] {
  if (memoryWishlist === null) {
    memoryWishlist = getStorage<string[]>(STORAGE_KEYS.WISHLIST) ?? []
  }
  return memoryWishlist
}

const SERVER_SNAPSHOT: string[] = []

function getServerSnapshot(): string[] {
  return SERVER_SNAPSHOT
}

function subscribe(listener: Listener): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function useWishlist() {
  const wishlist = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  )

  const toggleWishlist = useCallback((productId: string) => {
    const current = getSnapshot()
    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId]
    memoryWishlist = next
    setStorage(STORAGE_KEYS.WISHLIST, next)
    emitChange()
  }, [])

  const addToWishlist = useCallback((productId: string) => {
    const current = getSnapshot()
    if (!current.includes(productId)) {
      const next = [...current, productId]
      memoryWishlist = next
      setStorage(STORAGE_KEYS.WISHLIST, next)
      emitChange()
    }
  }, [])

  const removeFromWishlist = useCallback((productId: string) => {
    const current = getSnapshot()
    const next = current.filter((id) => id !== productId)
    memoryWishlist = next
    setStorage(STORAGE_KEYS.WISHLIST, next)
    emitChange()
  }, [])

  const clearWishlist = useCallback(() => {
    memoryWishlist = []
    setStorage(STORAGE_KEYS.WISHLIST, [])
    emitChange()
  }, [])

  return {
    wishlist,
    count: wishlist.length,
    isWishlisted,
    toggleWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  }
}

