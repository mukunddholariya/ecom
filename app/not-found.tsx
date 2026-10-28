import Link from "next/link"
import { ArrowLeft, Compass } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border shadow-2xs">
        <Compass className="size-10 text-primary" />
      </div>

      <span className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">
        404 — Page Not Found
      </span>

      <h1 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        We couldn&apos;t find that page
      </h1>

      <p className="mt-2 max-w-md text-xs text-muted-foreground leading-relaxed">
        The page you are looking for might have been moved, removed, or the link may be broken. Explore our categories or return home.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="cta" size="sm" className="font-semibold shadow-xs">
          <Link href="/products">
            Browse All Products
            <ArrowLeft className="size-3.5 ms-2 rotate-180" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="sm" className="text-xs">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

