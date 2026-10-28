import type { Metadata } from "next"
import type { ReactNode } from "react"
import { Geist_Mono, DM_Sans, Noto_Serif } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactQueryProvider } from "@/components/react-query-provider"
import { CartProvider } from "@/hooks/use-cart"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { CartSheet } from "@/components/cart/cart-sheet"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/site-config"

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
}

const notoSerifHeading = Noto_Serif({
  subsets: ["latin"],
  variable: "--font-heading",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        dmSans.variable,
        notoSerifHeading.variable,
      )}
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground">
        <ReactQueryProvider>
          <ThemeProvider>
            <CartProvider>
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
              <CartSheet />
            </CartProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
