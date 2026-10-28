import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import {
  getProductBySlug,
  getCategoryById,
  getProductsByCategory,
} from "@/lib/data"
import { ProductGallery } from "@/components/product/product-gallery"
import { ProductDetailsClient } from "@/components/product/product-details-client"
import { ProductCard } from "@/components/product/product-card"
import { SectionHeader } from "@/components/home/section-header"
import { RecordProductView } from "@/components/product/record-view"
import { RecentlyViewedProducts } from "@/components/product/recently-viewed"
import { siteConfig } from "@/lib/site-config"

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found",
    }
  }

  const title = `${product.name} — ${siteConfig.name}`
  const description = product.shortDescription

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: product.images.length > 0 ? [{ url: product.images[0] }] : [],
      type: "website",
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = getProductBySlug(slug)

  if (!product) {
    notFound()
  }

  const category = getCategoryById(product.categoryId)
  const relatedProducts = getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  // JSON-LD Product Schema for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images,
    description: product.shortDescription,
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: product.currency,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
  }

  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        suppressHydrationWarning
      />

      {/* Record Product View in localStorage for Recently Viewed */}
      <RecordProductView slug={product.slug} />

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-12 pb-16 md:pb-6">
        {/* Accessible Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li>
              <Link href="/" className="transition hover:text-foreground">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li>
              <Link href="/products" className="transition hover:text-foreground">
                Products
              </Link>
            </li>
            {category && (
              <>
                <li aria-hidden="true">
                  <ChevronRight className="size-3.5" />
                </li>
                <li>
                  <Link
                    href={`/products?category=${category.slug}`}
                    className="transition hover:text-foreground"
                  >
                    {category.name}
                  </Link>
                </li>
              </>
            )}
            <li aria-hidden="true">
              <ChevronRight className="size-3.5" />
            </li>
            <li
              aria-current="page"
              className="max-w-[200px] truncate font-medium text-foreground sm:max-w-none"
            >
              {product.name}
            </li>
          </ol>
        </nav>

        {/* Main Product Section: Gallery + Details */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left: Gallery */}
          <div>
            <ProductGallery
              images={product.images}
              productName={product.name}
              className="sticky top-20"
            />
          </div>

          {/* Right: Details & Purchase Controls */}
          <div>
            <ProductDetailsClient product={product} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section aria-label="Related Products" className="space-y-6 pt-6 border-t border-border/80">
            <SectionHeader
              title="Similar Products You May Like"
              subtitle={`More bestsellers from our ${category?.name ?? "catalogue"} collection`}
              viewAllHref={category ? `/products?category=${category.slug}` : "/products"}
              viewAllLabel="View collection"
            />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}

        {/* Recently Viewed Products */}
        <RecentlyViewedProducts currentSlug={product.slug} />
      </div>
    </>
  )
}
