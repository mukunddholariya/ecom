import Link from "next/link"
import {
  getBanners,
  getCategories,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/data"
import { HeroBanner } from "@/components/home/hero-banner"
import { CategoryStrip } from "@/components/home/category-strip"
import { BenefitsStrip } from "@/components/home/benefits-strip"
import { SectionHeader } from "@/components/home/section-header"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  const banners = getBanners()
  const categories = getCategories()
  const featuredProducts = getFeaturedProducts()
  const newProducts = getNewProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {/* 1. Category Quick Navigation */}
      <section aria-label="Browse Categories">
        <CategoryStrip categories={categories} />
      </section>

      {/* 2. Hero Promotion Banner */}
      <section aria-label="Featured Promotions">
        <HeroBanner banners={banners} />
      </section>

      {/* 3. Honest Service Benefits Strip */}
      <section aria-label="Store Benefits">
        <BenefitsStrip />
      </section>

      {/* 4. Featured Deals & Bestsellers */}
      <section aria-label="Featured Deals">
        <SectionHeader
          title="Featured Deals & Bestsellers"
          subtitle="Top rated customer favourites handpicked for quality and value"
          viewAllHref="/products"
          viewAllLabel="View all products"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {featuredProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              priority={index < 4}
            />
          ))}
        </div>
      </section>

      {/* 5. Category Spotlight Card */}
      <section
        aria-label="Category Spotlight"
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950 via-slate-900 to-teal-950 p-6 sm:p-10 text-white shadow-md border border-teal-800/40"
      >
        <div className="max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
            <Sparkles className="size-3.5" />
            Curated Category Spotlight
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
            Upgrade Your Everyday Tech
          </h3>
          <p className="text-sm text-teal-100/90 sm:text-base leading-relaxed">
            Discover premium audio, AMOLED smartwatches, and high-speed USB-C accessories designed for seamless daily productivity.
          </p>
          <div className="pt-2">
            <Button size="lg" variant="cta" asChild className="font-semibold shadow-md">
              <Link href="/products?category=electronics">
                Explore Electronics
                <ArrowRight className="size-4 ms-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* 6. New Arrivals */}
      <section aria-label="New Arrivals">
        <SectionHeader
          title="New Arrivals"
          subtitle="The latest styles, appliances, and accessories just added to the store"
          viewAllHref="/products"
          viewAllLabel="Explore new items"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {newProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 7. Prototype Status Banner */}
      <section
        aria-label="Prototype Information"
        className="rounded-xl border border-dashed border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground sm:text-sm"
      >
        <p className="font-semibold text-foreground">
          Ecommerce Prototype Storefront
        </p>
        <p className="mt-1 max-w-2xl mx-auto">
          All products, prices, and orders are rendered from local JSON data. You can add items to your cart, inspect the cart counter in the header, and navigate between categories.
        </p>
      </section>
    </div>
  )
}
