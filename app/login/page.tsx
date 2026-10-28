"use client"

import { useState, useEffect, Suspense, type FormEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Smartphone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { siteConfig } from "@/lib/site-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

type AuthMethod = "phone" | "email"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTarget = searchParams.get("redirect") || "/account"
  const { isSignedIn, verifyOtp } = useAuth()

  // Form states
  const [method, setMethod] = useState<AuthMethod>("phone")
  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [step, setStep] = useState<"input" | "otp">("input")
  const [otp, setOtp] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const [cooldown, setCooldown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  // Redirect if already signed in
  useEffect(() => {
    if (isSignedIn && !isSuccess) {
      router.replace(redirectTarget)
    }
  }, [isSignedIn, isSuccess, router, redirectTarget])

  // Cooldown countdown timer for resending OTP
  useEffect(() => {
    if (step !== "otp") return

    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          setCanResend(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [step, canResend])

  // Validate phone or email on request OTP
  const handleRequestOtp = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (method === "phone") {
      const cleanPhone = phone.trim().replace(/\D/g, "")
      if (!cleanPhone) {
        setError("Please enter your 10-digit mobile number.")
        return
      }
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        setError("Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).")
        return
      }
    } else {
      const cleanEmail = email.trim().toLowerCase()
      if (!cleanEmail) {
        setError("Please enter your email address.")
        return
      }
      if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
        setError("Please enter a valid email address (e.g. priya.sharma@example.com).")
        return
      }
    }

    setOtp("")
    setCooldown(30)
    setCanResend(false)
    setStep("otp")
  }

  // Handle OTP submission
  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const cleanOtp = otp.trim()
    if (!cleanOtp) {
      setError("Please enter the 6-digit verification code.")
      return
    }

    const identifier = method === "phone" ? phone.trim().replace(/\D/g, "") : email.trim().toLowerCase()
    const success = verifyOtp(identifier, cleanOtp)

    if (!success) {
      setError("Incorrect verification code. For this demo mode, please use test code 123456.")
      return
    }

    setIsSuccess(true)
    setTimeout(() => {
      router.push(redirectTarget)
    }, 900)
  }

  // Quick demo autofill handlers
  const handleAutofillPriya = () => {
    setMethod("phone")
    setPhone("9876543210")
    setError(null)
  }

  const handleAutofillRahul = () => {
    setMethod("email")
    setEmail("rahul.mehta@example.com")
    setError(null)
  }

  const handleUseDemoCode = () => {
    setOtp("123456")
    setError(null)
  }

  const activeIdentifier = method === "phone" ? `+91 ${phone}` : email

  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-lg flex-col justify-center px-4 py-12">
      {/* Brand Header */}
      <div className="mb-6 text-center">
        <Link
          href="/"
          className="inline-block text-2xl font-bold tracking-tight text-primary transition hover:opacity-90"
        >
          {siteConfig.name}
        </Link>
        <p className="mt-1 text-xs text-muted-foreground">
          Sign in to track orders, manage addresses, and checkout faster
        </p>
      </div>

      <Card className="border-border shadow-md">
        <CardHeader className="space-y-1.5 pb-4">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground">
            {step === "input" ? "Sign In or Register" : "Verify OTP"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {step === "input"
              ? "We will generate a simulated one-time password to verify your account."
              : `Enter the 6-digit verification code sent to ${activeIdentifier}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div
              role="alert"
              className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive"
            >
              <AlertCircle className="size-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success State */}
          {isSuccess && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="font-medium">
                Verification successful! Redirecting to your destination…
              </span>
            </div>
          )}

          {step === "input" ? (
            /* Step 1: Identifier Input Form */
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <Tabs
                value={method}
                onValueChange={(v: string) => {
                  setMethod(v as AuthMethod)
                  setError(null)
                }}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="phone" className="gap-1.5 text-xs font-medium">
                    <Smartphone className="size-3.5" />
                    Mobile Number
                  </TabsTrigger>
                  <TabsTrigger value="email" className="gap-1.5 text-xs font-medium">
                    <Mail className="size-3.5" />
                    Email Address
                  </TabsTrigger>
                </TabsList>

                {/* Mobile Phone Input */}
                <TabsContent value="phone" className="space-y-2 pt-3">
                  <Label htmlFor="login-phone" className="text-xs text-foreground font-semibold">
                    Indian Mobile Number
                  </Label>
                  <div className="flex rounded-lg border border-input bg-background shadow-xs focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
                    <div className="flex items-center border-e border-border bg-muted/50 px-3 text-xs font-medium text-muted-foreground select-none">
                      +91
                    </div>
                    <Input
                      id="login-phone"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="9876543210"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""))
                        setError(null)
                      }}
                      className="border-0 shadow-none focus-visible:ring-0 text-sm"
                      autoFocus
                    />
                  </div>
                  <p className="text-[11px] text-muted-foreground">
                    Enter any 10-digit mobile number starting with 6–9.
                  </p>
                </TabsContent>

                {/* Email Address Input */}
                <TabsContent value="email" className="space-y-2 pt-3">
                  <Label htmlFor="login-email" className="text-xs text-foreground font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="priya.sharma@example.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setError(null)
                    }}
                    className="text-sm"
                    autoFocus
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Enter your email to receive a simulated verification code.
                  </p>
                </TabsContent>
              </Tabs>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="cta"
                size="lg"
                className="w-full font-bold shadow-xs mt-2"
              >
                Get Demo OTP
                <ArrowRight className="size-4 ms-2" />
              </Button>
            </form>
          ) : (
            /* Step 2: OTP Verification Form */
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              {/* Target info with Edit action */}
              <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  {method === "phone" ? (
                    <Smartphone className="size-4 text-primary shrink-0" />
                  ) : (
                    <Mail className="size-4 text-primary shrink-0" />
                  )}
                  <span className="font-medium text-foreground truncate">
                    {activeIdentifier}
                  </span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("input")
                    setError(null)
                  }}
                  className="h-7 text-xs text-primary hover:text-primary/80"
                >
                  Change
                </Button>
              </div>

              {/* Demo Mode Fixed OTP Notice */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs space-y-1.5 text-amber-950 dark:text-amber-200">
                <div className="flex items-center justify-between">
                  <span className="font-semibold inline-flex items-center gap-1.5">
                    <KeyRound className="size-4 text-amber-600 dark:text-amber-400" />
                    Simulated Test Code: <span className="font-mono font-bold text-sm tracking-widest text-primary dark:text-amber-300">123456</span>
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="xs"
                    onClick={handleUseDemoCode}
                    className="border-amber-500/40 bg-background/80 text-[11px] hover:bg-background"
                  >
                    Insert Code
                  </Button>
                </div>
                <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
                  No actual SMS or email has been transmitted. This storefront operates in prototype mode.
                </p>
              </div>

              {/* OTP Input Field */}
              <div className="space-y-2">
                <Label htmlFor="login-otp" className="text-xs text-foreground font-semibold">
                  6-Digit Verification Code
                </Label>
                <Input
                  id="login-otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""))
                    setError(null)
                  }}
                  className="h-11 text-center font-mono text-xl tracking-[0.4em] font-semibold"
                  autoFocus
                />
              </div>

              {/* Resend Cooldown UI */}
              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
                <span>Didn&apos;t receive code?</span>
                {canResend ? (
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    onClick={() => {
                      setCooldown(30)
                      setCanResend(false)
                      setError(null)
                    }}
                    className="h-auto p-0 text-xs text-primary font-medium"
                  >
                    Resend Demo Code
                  </Button>
                ) : (
                  <span className="text-xs font-mono text-muted-foreground">
                    Resend in {cooldown}s
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  type="submit"
                  variant="cta"
                  size="lg"
                  disabled={isSuccess}
                  className="w-full font-bold shadow-xs"
                >
                  Verify & Proceed
                  <ArrowRight className="size-4 ms-2" />
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setStep("input")
                    setError(null)
                  }}
                  className="text-xs text-muted-foreground"
                >
                  <ArrowLeft className="size-3.5 me-1.5" />
                  Back to {method === "phone" ? "Mobile Number" : "Email"}
                </Button>
              </div>
            </form>
          )}

          {/* Quick Demo Pre-filled Accounts */}
          {step === "input" && (
            <div className="rounded-xl border border-dashed border-border bg-muted/20 p-3 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                <Sparkles className="size-3.5 text-primary" />
                <span>Quick Demo Accounts:</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleAutofillPriya}
                  className="flex flex-col items-start rounded-lg border border-border bg-card p-2 text-start transition hover:border-primary/50 hover:bg-muted/40"
                >
                  <span className="font-semibold text-foreground">Priya Sharma</span>
                  <span className="font-mono text-[11px] text-muted-foreground">+91 9876543210</span>
                </button>
                <button
                  type="button"
                  onClick={handleAutofillRahul}
                  className="flex flex-col items-start rounded-lg border border-border bg-card p-2 text-start transition hover:border-primary/50 hover:bg-muted/40"
                >
                  <span className="font-semibold text-foreground">Rahul Mehta</span>
                  <span className="font-mono text-[11px] text-muted-foreground">rahul.mehta@example.com</span>
                </button>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-2 border-t border-border/80 pt-4 text-center">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="size-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Honest Storefront: Prototype only. No personal data collected.</span>
          </div>
          <Link
            href="/products"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip login and continue shopping
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

function LoginSkeleton() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-14rem)] max-w-lg flex-col justify-center px-4 py-12 space-y-4">
      <Skeleton className="h-8 w-48 mx-auto" />
      <Skeleton className="h-4 w-72 mx-auto" />
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  )
}
