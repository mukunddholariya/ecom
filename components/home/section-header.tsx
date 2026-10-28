import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  className?: string
}

export function SectionHeader({
  title,
  subtitle,
  viewAllHref,
  viewAllLabel = "View all",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-2 pb-4",
        className,
      )}
    >
      <div>
        <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
            {subtitle}
          </p>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="group inline-flex items-center text-xs font-semibold text-primary transition-colors hover:text-primary/80 sm:text-sm"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="size-3.5 ms-1 transition-transform group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5" />
        </Link>
      )}
    </div>
  )
}

