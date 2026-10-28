"use client"

import { type ChangeEvent } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  quantity: number
  max: number
  min?: number
  onChange: (quantity: number) => void
  disabled?: boolean
  className?: string
  size?: "sm" | "md"
}

export function QuantitySelector({
  quantity,
  max,
  min = 1,
  onChange,
  disabled = false,
  className,
  size = "md",
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1)
    }
  }

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1)
    }
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10)
    if (isNaN(val)) return
    const clamped = Math.max(min, Math.min(max, val))
    onChange(clamped)
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-lg border border-border bg-background shadow-2xs",
        className,
      )}
      role="group"
      aria-label="Quantity selector"
    >
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={handleDecrement}
        disabled={disabled || quantity <= min}
        aria-label="Decrease quantity"
        className={cn(
          "rounded-e-none text-muted-foreground hover:text-foreground",
          size === "sm" ? "size-7" : "size-9",
        )}
      >
        <Minus className="size-3.5" />
      </Button>

      <input
        type="number"
        min={min}
        max={max}
        value={quantity}
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Item quantity"
        className={cn(
          "w-10 border-x border-border bg-transparent text-center text-xs font-semibold text-foreground outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
          size === "sm" ? "h-7" : "h-9",
        )}
      />

      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={handleIncrement}
        disabled={disabled || quantity >= max}
        aria-label="Increase quantity"
        className={cn(
          "rounded-s-none text-muted-foreground hover:text-foreground",
          size === "sm" ? "size-7" : "size-9",
        )}
      >
        <Plus className="size-3.5" />
      </Button>
    </div>
  )
}
