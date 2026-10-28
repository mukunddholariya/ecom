"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { type ReactNode } from "react"

/**
 * Create a stable QueryClient instance per browser session.
 * Using a ref ensures the client is not recreated on every render.
 */
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data stays fresh for 60 s; no background refetch for static mock data
        staleTime: 60 * 1000,
        // Retry once on failure (mock API routes should not fail, but just in case)
        retry: 1,
      },
    },
  })
}

let browserQueryClient: QueryClient | undefined

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client (no shared state between requests)
    return makeQueryClient()
  }
  // Browser: reuse the same client across renders
  if (!browserQueryClient) browserQueryClient = makeQueryClient()
  return browserQueryClient
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  // NOTE: useState is intentional — avoids recreating the client on every render
  // when this component is used inside a Suspense boundary.
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
