import type { Metadata } from "next"
import Link from "next/link"
import { SearchX, RotateCcw, ChevronRight } from "lucide-react"
import {
  getProducts,
  getCategories,
  getCategoryBySlug,
  getCategoryById,
} from "@/lib/data"
import { ProductCard } from "@/components/product/product-card"
import { CatalogSidebar } from "@/components/catalog/catalog-sidebar"
import { SortSelect } from "@/components/catalog/sort-select"
import { ActiveFilterChips } from "@/components/catalog/active-filter-chips"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string
    q?: string
    sort?: string
  }>
}

export async function generateMetadata({
  searchParams,
}: ProductsPageProps): Promise<Metadata> {
  const { category, q } = await searchParams
  let title = "All Products"

  if (category) {
    const cat = getCategoryBySlug(category) ?? getCategoryById(category)
    if (cat) title = `${cat.name} — Shop Products`
  } else if (q) {
    title = `Search results for "${q}"`
  }

  return {
    title: `${title} | ${siteConfig.name}`,
    description: siteConfig.description,
  }
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { category: categoryParam, q: queryParam, sort: sortParam } =
    await searchParams

  const allProducts = getProducts()
  const categories = getCategories()

  // Compute category counts before filtering
  const categoryCounts: Record<string, number> = {}
  for (const cat of categories) {
    categoryCounts[cat.id] = allProducts.filter(
      (p) => p.categoryId === cat.id,
    ).length
  }

  // Active category resolution
  const activeCategoryObj = categoryParam
    ? getCategoryBySlug(categoryParam) ?? getCategoryById(categoryParam)
    : undefined

  // Filter products
  let filtered = [...allProducts]

  // Category filter
  if (activeCategoryObj) {
    filtered = filtered.filter((p) => p.categoryId === activeCategoryObj.id)
  }

  // Query search
  const cleanQuery = queryParam?.trim().toLowerCase()
  if (cleanQuery) {
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(cleanQuery) ||
        p.brand.toLowerCase().includes(cleanQuery) ||
        p.tags.some((t) => t.toLowerCase().includes(cleanQuery)) ||
        p.shortDescription.toLowerCase().includes(cleanQuery) ||
        p.description.toLowerCase().includes(cleanQuery),
    )
  }

  // Sorting
  const sortMode = sortParam ?? "featured"
  filtered.sort((a, b) => {
    switch (sortMode) {
      case "price-asc":
        return a.price - b.price
      case "price-desc":
        return b.price - a.price
      case "newest":
        return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      case "rating":
        return b.rating - a.rating
      case "featured":
      default:
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
    }
  })

  // Title formatting
  const pageTitle = activeCategoryObj
    ? activeCategoryObj.name
    : cleanQuery
    ? `Results for "${queryParam}"`
    : "All Products"

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
        <ol className="flex items-center gap-1.5">
          <li>
            <Link href="/" className="transition hover:text-foreground">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="size-3.5" />
          </li>
          <li aria-current={!activeCategoryObj ? "page" : undefined}>
            {activeCategoryObj ? (
              <Link
                href="/products"
                className="transition hover:text-foreground"
              >
                Products
              </Link>
            ) : (
              <span className="font-medium text-foreground">Products</span>
            )}
          </li>
          {activeCategoryObj && (
            <>
              <li aria-hidden="true">
                <ChevronRight className="size-3.5" />
              </li>
              <li aria-current="page" className="font-medium text-foreground">
                {activeCategoryObj.name}
              </li>
            </>
          )}
        </ol>
      </nav>

      {/* Catalog Layout: Sidebar + Main Listing */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Left Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <CatalogSidebar
            categories={categories}
            activeCategory={activeCategoryObj?.slug}
            currentQuery={queryParam}
            currentSort={sortParam}
            categoryCounts={categoryCounts}
            totalProductsCount={allProducts.length}
          />
        </div>

        {/* Right Main Content */}
        <div className="space-y-4 lg:col-span-3">
          {/* Header Controls Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                {pageTitle}
              </h1>
              <p className="text-xs text-muted-foreground mt-0.5">
                Showing {filtered.length} of {allProducts.length} products
              </p>
            </div>

            {/* Sort Dropdown */}
            <SortSelect currentSort={sortMode} />
          </div>

          {/* Active Filter Chips */}
          <ActiveFilterChips
            categoryName={activeCategoryObj?.name}
            query={queryParam}
            sort={sortParam}
          />

          {/* Mobile Category Quick-Pills (visible below lg) */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 lg:hidden">
            <Link
              href="/products"
              className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 border transition-colors ${
                !activeCategoryObj
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-muted/60 text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              All ({allProducts.length})
            </Link>
            {categories.map((cat) => {
              const isSelected = activeCategoryObj?.id === cat.id
              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}${
                    sortParam ? `&sort=${sortParam}` : ""
                  }`}
                  className={`rounded-full px-3 py-1 text-xs font-medium shrink-0 border transition-colors ${
                    isSelected
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted/60 text-muted-foreground border-border hover:text-foreground"
                  }`}
                >
                  {cat.name} ({categoryCounts[cat.id] ?? 0})
                </Link>
              )
            })}
          </div>

          {/* Products Grid or Empty State */}
          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-3">
              {filtered.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  priority={index < 6}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center bg-card">
              <div className="flex size-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground border border-border">
                <SearchX className="size-8" />
              </div>

              <h2 className="mt-4 text-lg font-bold text-foreground">
                No matching products found
              </h2>
              <p className="mt-1.5 max-w-sm text-xs text-muted-foreground leading-relaxed">
                We couldn&apos;t find any items matching your current filters or search term. Try adjusting your search or clearing active filters.
              </p>

              <div className="mt-6">
                <Button asChild variant="cta" size="sm">
                  <Link href="/products">
                    <RotateCcw className="size-3.5 me-1.5" />
                    Reset All Filters
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

