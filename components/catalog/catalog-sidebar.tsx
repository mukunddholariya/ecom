import Link from "next/link"
import { Filter } from "lucide-react"
import type { Category } from "@/types/category"
import { cn } from "@/lib/utils"

interface CatalogSidebarProps {
  categories: Category[]
  activeCategory?: string
  currentQuery?: string
  currentSort?: string
  categoryCounts: Record<string, number>
  totalProductsCount: number
}

export function CatalogSidebar({
  categories,
  activeCategory,
  currentQuery,
  currentSort,
  categoryCounts,
  totalProductsCount,
}: CatalogSidebarProps) {
  // Helper to construct preserved URLs
  const makeCategoryUrl = (categorySlug?: string) => {
    const params = new URLSearchParams()
    if (categorySlug) params.set("category", categorySlug)
    if (currentQuery) params.set("q", currentQuery)
    if (currentSort && currentSort !== "featured") params.set("sort", currentSort)
    const qs = params.toString()
    return qs ? `/products?${qs}` : "/products"
  }

  return (
    <aside aria-label="Catalog filters" className="space-y-6">
      {/* Category Filter Section */}
      <div className="rounded-xl border border-border bg-card p-4 shadow-2xs">
        <div className="flex items-center gap-2 border-b border-border/80 pb-3">
          <Filter className="size-4 text-primary" />
          <h3 className="text-sm font-bold tracking-tight text-foreground">
            Categories
          </h3>
        </div>

        <ul className="mt-3 space-y-1 text-xs">
          {/* All Categories Option */}
          <li>
            <Link
              href={makeCategoryUrl(undefined)}
              className={cn(
                "flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors",
                !activeCategory
                  ? "bg-primary/10 font-bold text-primary"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <span>All Categories</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                {totalProductsCount}
              </span>
            </Link>
          </li>

          {/* Individual Category Links */}
          {categories.map((cat) => {
            const isSelected =
              activeCategory === cat.slug || activeCategory === cat.id
            const count = categoryCounts[cat.id] ?? 0

            return (
              <li key={cat.id}>
                <Link
                  href={makeCategoryUrl(cat.slug)}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-2.5 py-2 transition-colors",
                    isSelected
                      ? "bg-primary/10 font-bold text-primary"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-mono">
                    {count}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Shopping Perks Info Box */}
      <div className="rounded-xl border border-border/70 bg-muted/30 p-4 text-xs text-muted-foreground space-y-2">
        <p className="font-semibold text-foreground">Fast & Free Shipping</p>
        <p className="leading-relaxed text-[11px]">
          Orders above ₹499 qualify for standard free delivery across all supported PIN codes.
        </p>
      </div>
    </aside>
  )
}

