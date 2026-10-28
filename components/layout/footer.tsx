import Link from "next/link"
import { siteConfig } from "@/lib/site-config"
import { ThemeToggle } from "@/components/theme-toggle"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const categories = [
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Fashion", href: "/products?category=fashion" },
    { label: "Home & Kitchen", href: "/products?category=home-kitchen" },
    { label: "Beauty & Personal Care", href: "/products?category=beauty" },
    { label: "Sports & Fitness", href: "/products?category=sports" },
  ]

  const customerCare = [
    { label: "Help & FAQs (Mock)", href: "/help" },
    { label: "Track Your Order", href: "/account" },
    { label: "Shipping Policy (Mock)", href: "/shipping-policy" },
    { label: "Returns & Exchanges", href: "/returns" },
    { label: "Contact Us", href: "/contact" },
  ]

  const aboutLinks = [
    { label: "About This Prototype", href: "/about" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Developer Context", href: "https://github.com" },
  ]

  return (
    <footer className="border-t border-border bg-muted/40 text-muted-foreground transition-colors">
      {/* Upper footer links */}
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4 lg:gap-12">
          {/* Brand info */}
          <div className="space-y-3">
            <Link
              href="/"
              className="text-xl font-bold tracking-tight text-foreground"
            >
              {siteConfig.name}
            </Link>
            <p className="text-sm leading-relaxed">
              {siteConfig.description}
            </p>
            <div className="pt-2">
              <span className="inline-block rounded border border-border bg-background px-2.5 py-1 text-xs font-mono font-medium text-foreground">
                PROTOTYPE MODE — Local Data
              </span>
            </div>
          </div>

          {/* Shop categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Shop Categories
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categories.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer service */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              Customer Care
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {customerCare.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Prototype details */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
              About Project
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Prototype disclosure banner */}
        <div className="mt-10 rounded-lg border border-border/80 bg-background/80 p-4 text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">
            ⚠️ Simulated Indian Storefront Prototype
          </p>
          <p className="mt-1">
            This application is a functional user-interface prototype running entirely on local dummy JSON data.
            No real payments, SMS OTPs, bank transactions, or actual product deliveries occur.
            All prices are shown in Indian Rupees (₹) for demonstration purposes.
          </p>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs sm:flex-row">
          <p>© {currentYear} {siteConfig.name}. Built with Next.js App Router & Tailwind CSS.</p>

          <div className="flex items-center gap-4">
            <span className="text-xs">Theme:</span>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}

