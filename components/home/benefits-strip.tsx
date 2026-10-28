import { Truck, RotateCcw, Banknote, ShieldCheck } from "lucide-react"

const benefits = [
  {
    icon: Truck,
    title: "Free Delivery",
    description: "On eligible orders over ₹499",
  },
  {
    icon: RotateCcw,
    title: "7-Day Easy Returns",
    description: "Hassle-free return & refund",
  },
  {
    icon: Banknote,
    title: "Cash on Delivery",
    description: "Pay at your doorstep",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    description: "Curated quality products",
  },
]

export function BenefitsStrip() {
  return (
    <section
      aria-label="Service benefits"
      className="rounded-2xl border border-border bg-card p-4 sm:p-6 shadow-xs"
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 sm:gap-6">
        {benefits.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.title} className="flex items-start gap-3 sm:gap-3.5">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-semibold text-foreground sm:text-sm">
                  {item.title}
                </h4>
                <p className="text-[11px] text-muted-foreground sm:text-xs">
                  {item.description}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

