"use client"

import { useState, useCallback, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { cn } from "@/lib/utils"

export function Header() {
  const router = useRouter()
  const { totals, openCartSheet } = useCart()
  const { isSignedIn, session } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSearch = useCallback(
    (e: FormEvent) => {
      e.preventDefault()
      const q = searchQuery.trim()
      if (q) router.push(`/products?q=${encodeURIComponent(q)}`)
    },
    [searchQuery, router]
  )

  const navLinks = [
    { label: "Electronics", href: "/products?category=electronics" },
    { label: "Fashion", href: "/products?category=fashion" },
    { label: "Home & Kitchen", href: "/products?category=home-kitchen" },
    { label: "Beauty", href: "/products?category=beauty" },
    { label: "Sports", href: "/products?category=sports" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Top bar */}
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-primary"
        >
          {siteConfig.name}
        </Link>

        {/* Search — desktop */}
        <form
          onSubmit={handleSearch}
          className="relative hidden max-w-xl flex-1 md:flex"
        >
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            id="header-search"
            type="search"
            placeholder="Search products, brands and more…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-muted ps-9 pe-4 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </form>

        {/* Right controls */}
        <div className="ms-auto flex items-center gap-1">
          {/* Account */}
          <Button variant="ghost" size="icon-sm" asChild>
            <Link
              href={isSignedIn ? "/account" : "/login"}
              aria-label={isSignedIn ? `Account: ${session?.name}` : "Login"}
            >
              <User className="size-5" />
            </Link>
          </Button>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={openCartSheet}
            aria-label={`Cart, ${totals.itemCount} items`}
            className="relative"
          >
            <ShoppingCart className="size-5" />
            {totals.itemCount > 0 && (
              <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-cta-foreground shadow-xs">
                {totals.itemCount > 9 ? "9+" : totals.itemCount}
              </span>
            )}
          </Button>

          {/* Mobile menu toggle */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="md:hidden"
            onClick={() => setMobileMenuOpen((o) => !o)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile search */}
      <form
        onSubmit={handleSearch}
        className="border-t border-border px-4 py-2 md:hidden"
      >
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search products…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-9 w-full rounded-lg border border-border bg-muted ps-9 pe-4 text-sm transition outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </form>

      {/* Category nav — desktop */}
      <nav
        aria-label="Category navigation"
        className="hidden border-t border-border md:block"
      >
        <ul className="mx-auto flex max-w-7xl gap-0 px-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex h-10 items-center rounded-none px-4 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile menu dropdown */}
      <div
        className={cn(
          "overflow-hidden border-t border-border transition-all duration-200 md:hidden",
          mobileMenuOpen ? "max-h-80" : "max-h-0"
        )}
      >
        <nav aria-label="Mobile navigation">
          <ul className="flex flex-col px-4 py-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex h-10 items-center text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  )
}
