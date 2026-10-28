"use client"

import { useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface ProductGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductGallery({
  images,
  productName,
  className,
}: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [imageError, setImageError] = useState<Record<number, boolean>>({})

  const safeImages = images.length > 0 ? images : ["/images/placeholder.svg"]

  const currentImage = imageError[selectedIndex]
    ? "/images/placeholder.svg"
    : safeImages[selectedIndex]

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Main Image Display */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-border bg-muted/30 shadow-xs sm:aspect-[4/4]">
        <Image
          src={currentImage}
          alt={`${productName} — view ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() =>
            setImageError((prev) => ({ ...prev, [selectedIndex]: true }))
          }
          className="object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails (shown if 2+ images) */}
      {safeImages.length > 1 && (
        <div
          className="flex items-center gap-2 overflow-x-auto py-1"
          role="tablist"
          aria-label="Product thumbnails"
        >
          {safeImages.map((img, idx) => {
            const isSelected = idx === selectedIndex
            const thumbSrc = imageError[idx]
              ? `https://placehold.co/120x120/0f333a/ffffff?text=${idx + 1}`
              : img

            return (
              <button
                key={img + idx}
                type="button"
                role="tab"
                aria-selected={isSelected}
                aria-label={`Select image ${idx + 1}`}
                onClick={() => setSelectedIndex(idx)}
                className={cn(
                  "relative size-16 shrink-0 overflow-hidden rounded-lg border bg-muted/40 transition-all sm:size-20",
                  isSelected
                    ? "border-primary ring-2 ring-primary/30"
                    : "border-border hover:border-primary/40 opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={thumbSrc}
                  alt=""
                  fill
                  sizes="80px"
                  onError={() =>
                    setImageError((prev) => ({ ...prev, [idx]: true }))
                  }
                  className="object-cover"
                />
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

