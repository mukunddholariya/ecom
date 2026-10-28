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

  return {
    title: `${product.name} — ${siteConfig.name}`,
    description: product.shortDescription,
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-12">
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
            className="font-medium text-foreground truncate max-w-[200px] sm:max-w-xs"
          >
            {product.name}
          </li>
        </ol>
      </nav>

      {/* Main PDP Grid (Gallery + Details) */}
      <section className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:gap-12">
        {/* Left: Gallery */}
        <div>
          <ProductGallery
            images={product.images}
            productName={product.name}
          />
        </div>

        {/* Right: Product Details & Purchase Actions */}
        <div>
          <ProductDetailsClient product={product} />
        </div>
      </section>

      {/* Related Products from same category */}
      {relatedProducts.length > 0 && (
        <section aria-label="Related Products" className="border-t border-border/80 pt-10">
          <SectionHeader
            title="Customers Also Viewed"
            subtitle={`More popular picks from ${category ? category.name : "this category"}`}
            viewAllHref={category ? `/products?category=${category.slug}` : "/products"}
            viewAllLabel="View more"
          />

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
            {relatedProducts.map((relProduct) => (
              <ProductCard key={relProduct.id} product={relProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

