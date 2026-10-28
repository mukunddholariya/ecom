import rawSections from "@/data/homepage-sections.json"

export type HomepageSectionType =
  | "category_strip"
  | "hero_banner"
  | "benefits_strip"
  | "featured_products"
  | "spotlight"
  | "new_arrivals"
  | "prototype_notice"

export interface HomepageSpotlight {
  badge: string
  title: string
  description: string
  ctaText: string
  ctaHref: string
}

export interface HomepageSection {
  id: string
  type: HomepageSectionType
  enabled: boolean
  title?: string
  subtitle?: string
  viewAllHref?: string
  viewAllLabel?: string
  spotlight?: HomepageSpotlight
}

const sections: HomepageSection[] = rawSections as HomepageSection[]

export function getHomepageSections(): HomepageSection[] {
  return sections.filter((s) => s.enabled)
}

