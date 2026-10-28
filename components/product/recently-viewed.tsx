"use client"

import { useMemo, useSyncExternalStore } from "react"
import { getStorage, STORAGE_KEYS } from "@/lib/storage"
import { getProductBySlug } from "@/lib/data"
import { ProductCard } from "@/components/product/product-card"
import { Clock } from "lucide-react"

const emptySubscribe = () => () => {}

function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

export function RecentlyViewedProducts({ currentSlug }: { currentSlug?: string }) {
  const isMounted = useIsMounted()

  const recentProducts = useMemo(() => {
    if (!isMounted) return []
    const slugs = getStorage<string[]>(STORAGE_KEYS.RECENT_PRODUCTS) || []
    return slugs
      .filter((s) => s !== currentSlug)
      .map((s) => getProductBySlug(s))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)
      .slice(0, 4)
  }, [isMounted, currentSlug])

  if (!isMounted || recentProducts.length === 0) {
    return null
  }

  return (
    <section aria-label="Recently Viewed Products" className="space-y-4 pt-6 border-t border-border/80">
      <div className="flex items-center gap-2">
        <Clock className="size-4 text-primary" />
        <h2 className="text-base font-bold text-foreground">
          Recently Viewed Products
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
        {recentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}

