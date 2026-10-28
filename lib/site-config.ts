/**
 * Site-wide configuration — single source of truth for brand identity.
 * To rename the store, change `name` here ONLY.
 * Every page title, navbar, footer, and metadata imports from this file.
 */
export const siteConfig = {
  /** Display name of the store. Change here → updates everywhere. */
  name: "ecom",
  tagline: "Everything. Delivered.",
  description:
    "Shop the widest selection of electronics, fashion, home essentials, and more — all in one place.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const

export type SiteConfig = typeof siteConfig
