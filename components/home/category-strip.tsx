import Link from "next/link"
import {
  Smartphone,
  Shirt,
  Home,
  Sparkles,
  Dumbbell,
  ShoppingBag,
  type LucideIcon,
} from "lucide-react"
import type { Category } from "@/types/category"
import { cn } from "@/lib/utils"

interface CategoryStripProps {
  categories: Category[]
  className?: string
}

const iconMap: Record<string, LucideIcon> = {
  smartphone: Smartphone,
  shirt: Shirt,
  home: Home,
  sparkles: Sparkles,
  dumbbell: Dumbbell,
}

export function CategoryStrip({
  categories,
  className,
}: CategoryStripProps) {
  return (
    <section
      aria-label="Popular Categories"
      className={cn("w-full overflow-x-auto py-2", className)}
    >
      <div className="flex min-w-full items-center justify-between gap-3 px-1 sm:justify-center sm:gap-6 md:gap-8">
        {categories.map((category) => {
          const Icon = iconMap[category.icon] ?? ShoppingBag

          return (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col items-center gap-2 rounded-xl p-2 text-center transition-transform hover:-translate-y-0.5 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring shrink-0"
            >
              <div className="flex size-14 items-center justify-center rounded-2xl border border-border bg-muted/60 transition-colors group-hover:border-primary/40 group-hover:bg-primary/10 sm:size-16">
                <Icon className="size-6 text-foreground transition-colors group-hover:text-primary sm:size-7" />
              </div>
              <span className="text-xs font-semibold text-foreground group-hover:text-primary sm:text-sm whitespace-nowrap">
                {category.name}
              </span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

