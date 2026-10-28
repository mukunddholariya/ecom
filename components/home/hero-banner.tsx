"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react"
import type { Banner } from "@/types/banner"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface HeroBannerProps {
  banners: Banner[]
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const count = banners.length

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % count)
  }, [count])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + count) % count)
  }, [count])

  const goToSlide = useCallback((index: number) => {
    setCurrent(index)
  }, [])

  // Auto-play timer
  useEffect(() => {
    if (isPaused || count <= 1) return

    timerRef.current = setInterval(nextSlide, 5500)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [nextSlide, isPaused, count])

  if (!banners || banners.length === 0) {
    return null
  }

  return (
    <section
      role="region"
      aria-roledescription="carousel"
      aria-label="Promotional Banners"
      className="relative overflow-hidden rounded-2xl bg-muted"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      {/* Banner Slides Container */}
      <div className="relative h-64 w-full sm:h-80 md:h-96 lg:h-[420px]">
        {banners.map((banner, index) => {
          const isActive = index === current

          return (
            <div
              key={banner.id}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${index + 1} of ${count}: ${banner.title}`}
              aria-hidden={!isActive}
              className={cn(
                "absolute inset-0 transition-opacity duration-700 ease-in-out",
                isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none",
              )}
            >
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={banner.imageUrl}
                  alt={banner.title}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
                {/* Gradient Overlays for optimal readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/85 sm:via-black/50 sm:to-transparent" />
              </div>

              {/* Banner Text & Action */}
              <div className="relative flex h-full max-w-xl flex-col justify-end p-6 sm:justify-center sm:p-10 md:p-14 text-white z-20">
                <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl drop-shadow-xs">
                  {banner.title}
                </h2>
                <p className="mt-2 max-w-md text-sm text-white/90 sm:text-base md:mt-3 drop-shadow-xs">
                  {banner.subtitle}
                </p>
                <div className="mt-4 sm:mt-6">
                  <Button
                    size="lg"
                    asChild
                    className={cn(
                      "font-semibold shadow-md transition-transform hover:scale-105 active:scale-95",
                      banner.accentClass ?? "bg-cta text-cta-foreground hover:bg-cta/90",
                    )}
                  >
                    <Link href={banner.href}>
                      {banner.cta}
                      <ArrowRight className="size-4 ms-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Prev / Next Arrows */}
      {count > 1 && (
        <>
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute start-3 top-1/2 -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white sm:start-5 sm:size-11"
          >
            <ChevronLeft className="size-5 sm:size-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute end-3 top-1/2 -translate-y-1/2 z-30 flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-xs transition hover:bg-black/70 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-white sm:end-5 sm:size-11"
          >
            <ChevronRight className="size-5 sm:size-6" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {count > 1 && (
        <div className="absolute bottom-3 start-1/2 -translate-x-1/2 z-30 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1.5 backdrop-blur-xs sm:bottom-4">
          {banners.map((banner, index) => (
            <button
              key={banner.id}
              type="button"
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}: ${banner.title}`}
              aria-current={index === current ? "true" : undefined}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}
