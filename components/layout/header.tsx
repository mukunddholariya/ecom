"use client"

import { useState, useCallback, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Search, Menu, X, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { siteConfig } from "@/lib/site-config"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { cn } from "@/lib/utils"

export function Header() {
  const router = useRouter()
  const { totals, openCartSheet } = useCart()
  const { isSignedIn, session } = useAuth()
  const { count: wishlistCount } = useWishlist()
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
    { label: "Ultra Thin", href: "/products?category=ultra-thin" },
    { label: "Textured & Ribbed", href: "/products?category=textured-ribbed" },
    { label: "Flavoured", href: "/products?category=flavoured" },
    { label: "Latex-Free", href: "/products?category=latex-free" },
    { label: "Lubricants", href: "/products?category=lubricants" },
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
          <Button
            variant="ghost"
            size={isSignedIn ? "sm" : "icon-sm"}
            asChild
            className={cn(
              isSignedIn && "gap-1.5 px-2.5 text-xs font-semibold text-primary"
            )}
          >
            <Link
              href={isSignedIn ? "/account" : "/login"}
              aria-label={isSignedIn ? `Account: ${session?.name}` : "Login"}
            >
              <User className="size-4" />
              {isSignedIn && (
                <span className="hidden sm:inline max-w-24 truncate">
                  {session?.name.split(" ")[0]}
                </span>
              )}
            </Link>
          </Button>

          {/* Wishlist */}
          <Button
            variant="ghost"
            size="icon-sm"
            asChild
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative"
          >
            <Link href="/wishlist">
              <Heart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute -end-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-cta text-[10px] font-bold text-cta-foreground shadow-xs">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
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
            <li className="border-t border-border/60 pt-1 mt-1">
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-10 items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                <span className="flex items-center gap-2">
                  <Heart className="size-4" />
                  My Wishlist
                </span>
                {wishlistCount > 0 && (
                  <span className="rounded-full bg-cta px-1.5 py-0.5 text-[10px] font-bold text-cta-foreground">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
