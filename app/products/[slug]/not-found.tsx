import Link from "next/link"
import { ArrowLeft, PackageSearch } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProductNotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border">
        <PackageSearch className="size-10" />
      </div>

      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        Product Not Found
      </h1>

      <p className="mt-2 text-sm text-muted-foreground">
        We could not find the product you were looking for. It may have been removed, or the link may be invalid.
      </p>

      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Button asChild variant="default">
          <Link href="/products">
            <ArrowLeft className="size-4 me-2" />
            Browse All Products
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  )
}

