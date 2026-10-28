export interface Banner {
  id: string
  title: string
  subtitle: string
  cta: string
  href: string
  /** Absolute URL or path relative to /public */
  imageUrl: string
  /** Controls text/button colour scheme on the banner */
  theme: "light" | "dark"
  /** Optional accent/highlight colour for the CTA button (Tailwind bg class) */
  accentClass?: string
}
