import Link from "next/link"
import {
  getBanners,
  getCategories,
  getFeaturedProducts,
  getNewProducts,
} from "@/lib/data"
import { getHomepageSections } from "@/lib/homepage"
import { HeroBanner } from "@/components/home/hero-banner"
import { CategoryStrip } from "@/components/home/category-strip"
import { BenefitsStrip } from "@/components/home/benefits-strip"
import { SectionHeader } from "@/components/home/section-header"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HomePage() {
  const sections = getHomepageSections()
  const banners = getBanners()
  const categories = getCategories()
  const featuredProducts = getFeaturedProducts()
  const newProducts = getNewProducts()

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
      {sections.map((section) => {
        switch (section.type) {
          case "category_strip":
            return (
              <section key={section.id} aria-label="Browse Categories">
                <CategoryStrip categories={categories} />
              </section>
            )

          case "hero_banner":
            return (
              <section key={section.id} aria-label="Featured Promotions">
                <HeroBanner banners={banners} />
              </section>
            )

          case "benefits_strip":
            return (
              <section key={section.id} aria-label="Store Benefits">
                <BenefitsStrip />
              </section>
            )

          case "featured_products":
            return (
              <section key={section.id} aria-label="Featured Deals">
                <SectionHeader
                  title={section.title || "Featured Deals & Bestsellers"}
                  subtitle={
                    section.subtitle ||
                    "Top rated customer favourites handpicked for quality and value"
                  }
                  viewAllHref={section.viewAllHref || "/products"}
                  viewAllLabel={section.viewAllLabel || "View all products"}
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
            )

          case "spotlight":
            if (!section.spotlight) return null
            return (
              <section
                key={section.id}
                aria-label="Category Spotlight"
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-950 via-slate-900 to-teal-950 p-6 sm:p-10 text-white shadow-md border border-teal-800/40"
              >
                <div className="max-w-xl space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 px-3 py-1 text-xs font-semibold backdrop-blur-xs">
                    <Sparkles className="size-3.5" />
                    {section.spotlight.badge}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl">
                    {section.spotlight.title}
                  </h3>
                  <p className="text-sm text-teal-100/90 sm:text-base leading-relaxed">
                    {section.spotlight.description}
                  </p>
                  <div className="pt-2">
                    <Button
                      size="lg"
                      variant="cta"
                      asChild
                      className="font-semibold shadow-md"
                    >
                      <Link href={section.spotlight.ctaHref}>
                        {section.spotlight.ctaText}
                        <ArrowRight className="size-4 ms-2" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            )

          case "new_arrivals":
            return (
              <section key={section.id} aria-label="New Arrivals">
                <SectionHeader
                  title={section.title || "New Arrivals"}
                  subtitle={
                    section.subtitle ||
                    "The latest styles, appliances, and accessories just added to the store"
                  }
                  viewAllHref={section.viewAllHref || "/products"}
                  viewAllLabel={section.viewAllLabel || "Explore new items"}
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                  {newProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </section>
            )

          case "prototype_notice":
            return (
              <section
                key={section.id}
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
            )

          default:
            return null
        }
      })}
    </div>
  )
}
