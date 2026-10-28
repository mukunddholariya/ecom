"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import Link from "next/link"
import { X, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface ActiveFilterChipsProps {
  categoryName?: string
  query?: string
  sort?: string
}

export function ActiveFilterChips({
  categoryName,
  query,
  sort,
}: ActiveFilterChipsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const removeParam = (key: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    router.push(`${pathname}?${params.toString()}`)
  }

  const hasFilters = Boolean(categoryName || query || (sort && sort !== "featured"))

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap items-center gap-2 pt-2">
      <span className="text-xs text-muted-foreground font-medium">Active Filters:</span>

      {/* Query filter chip */}
      {query && (
        <Badge
          variant="outline"
          className="gap-1.5 pe-1 bg-background text-foreground border-border text-xs"
        >
          <span>Search: &ldquo;{query}&rdquo;</span>
          <button
            type="button"
            onClick={() => removeParam("q")}
            aria-label="Remove search filter"
            className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {/* Category filter chip */}
      {categoryName && (
        <Badge
          variant="outline"
          className="gap-1.5 pe-1 bg-background text-foreground border-border text-xs"
        >
          <span>Category: {categoryName}</span>
          <button
            type="button"
            onClick={() => removeParam("category")}
            aria-label="Remove category filter"
            className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {/* Sort filter chip if non-default */}
      {sort && sort !== "featured" && (
        <Badge
          variant="outline"
          className="gap-1.5 pe-1 bg-background text-foreground border-border text-xs"
        >
          <span className="capitalize">Sort: {sort.replace("-", " ")}</span>
          <button
            type="button"
            onClick={() => removeParam("sort")}
            aria-label="Reset sort"
            className="rounded-full p-0.5 hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}

      {/* Clear all */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 ms-1"
      >
        <RotateCcw className="size-3" />
        Clear all
      </Link>
    </div>
  )
}

