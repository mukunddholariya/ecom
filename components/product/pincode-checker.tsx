"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, MapPin, Truck } from "lucide-react"
import { useState, type FormEvent } from "react"

interface DeliveryEstimate {
  city: string
  state: string
  eta: string
  codAvailable: boolean
  freeDelivery: boolean
}

const SAMPLE_PINCODES: Record<string, DeliveryEstimate> = {
  "560038": {
    city: "Bengaluru",
    state: "Karnataka",
    eta: "Tomorrow by 5 PM",
    codAvailable: true,
    freeDelivery: true,
  },
  "110001": {
    city: "New Delhi",
    state: "Delhi",
    eta: "Within 2 business days",
    codAvailable: true,
    freeDelivery: true,
  },
  "400001": {
    city: "Mumbai",
    state: "Maharashtra",
    eta: "Within 2-3 business days",
    codAvailable: true,
    freeDelivery: true,
  },
  "600001": {
    city: "Chennai",
    state: "Tamil Nadu",
    eta: "Within 2-3 business days",
    codAvailable: true,
    freeDelivery: true,
  },
  "700001": {
    city: "Kolkata",
    state: "West Bengal",
    eta: "Within 3-4 business days",
    codAvailable: true,
    freeDelivery: true,
  },
}

export function PincodeChecker() {
  const [pincode, setPincode] = useState("")
  const [estimate, setEstimate] = useState<DeliveryEstimate | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = (codeToCheck?: string) => {
    const code = (codeToCheck ?? pincode).trim().replace(/\D/g, "")
    setError(null)

    if (code.length !== 6) {
      setError("Please enter a valid 6-digit Indian PIN code.")
      setEstimate(null)
      return
    }

    if (SAMPLE_PINCODES[code]) {
      setEstimate(SAMPLE_PINCODES[code])
      setPincode(code)
    } else {
      // Default estimate for valid 6-digit Indian pincode
      setEstimate({
        city: "Major City",
        state: "India",
        eta: "Standard delivery in 3–5 business days",
        codAvailable: true,
        freeDelivery: true,
      })
      setPincode(code)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleCheck()
  }

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-foreground uppercase">
        <MapPin className="size-3.5 text-primary" />
        <span>Delivery Options & Pincode Check</span>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter 6-digit PIN (e.g. 560038)"
          value={pincode}
          maxLength={6}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
          className="h-8 font-mono text-xs"
        />
        <Button
          type="submit"
          variant="outline"
          size="sm"
          className="h-8 shrink-0 text-xs font-medium"
        >
          Check
        </Button>
      </form>

      {/* Quick sample chips */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
        <span className="text-[10px] text-muted-foreground">Try:</span>
        {Object.keys(SAMPLE_PINCODES)
          .slice(0, 3)
          .map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => handleCheck(code)}
              className="rounded border border-border/70 bg-muted/30 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {code} ({SAMPLE_PINCODES[code].city})
            </button>
          ))}
      </div>

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="size-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {estimate && (
        <div className="space-y-1.5 rounded-lg border border-primary/20 bg-primary/5 p-2.5 text-xs text-foreground">
          <div className="flex items-center gap-1.5 font-semibold text-primary">
            <Truck className="size-3.5 shrink-0" />
            <span>
              Delivering to {estimate.city}, {estimate.state}
            </span>
          </div>
          <div className="space-y-0.5 ps-5 text-[11px] text-muted-foreground">
            <p>
              • Estimated: <strong>{estimate.eta}</strong>
            </p>
            <p>
              •{" "}
              {estimate.codAvailable
                ? "Cash on Delivery available"
                : "Prepaid orders only"}
            </p>
            <p>• Standard returns within 7 days of delivery</p>
          </div>
        </div>
      )}
    </div>
  )
}
