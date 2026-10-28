"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { ArrowUpDown } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortSelectProps {
  currentSort?: string
}

const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "newest", label: "Newest Arrivals" },
  { value: "rating", label: "Highest Rated" },
]

export function SortSelect({ currentSort = "featured" }: SortSelectProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleSortChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (val && val !== "featured") {
      params.set("sort", val)
    } else {
      params.delete("sort")
    }

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="hidden text-xs font-medium text-muted-foreground sm:inline-flex items-center gap-1">
        <ArrowUpDown className="size-3.5" />
        Sort by:
      </span>
      <Select value={currentSort} onValueChange={handleSortChange}>
        <SelectTrigger className="w-[170px] text-xs h-8 bg-background">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent align="end">
          {sortOptions.map((opt) => (
            <SelectItem key={opt.value} value={opt.value} className="text-xs">
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
