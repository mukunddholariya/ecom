"use client"

import { useEffect } from "react"
import { getStorage, setStorage, STORAGE_KEYS } from "@/lib/storage"

export function RecordProductView({ slug }: { slug: string }) {
  useEffect(() => {
    const recents = getStorage<string[]>(STORAGE_KEYS.RECENT_PRODUCTS) || []
    const updated = [slug, ...recents.filter((s) => s !== slug)].slice(0, 8)
    setStorage(STORAGE_KEYS.RECENT_PRODUCTS, updated)
  }, [slug])

  return null
}

