"use client"

import { useQuery } from "@tanstack/react-query"
import apiClient from "@/lib/axios"
import type { Product } from "@/types/product"
import type { Category } from "@/types/category"
import type { Banner } from "@/types/banner"

// ─── Query key factory ────────────────────────────────────────────────────────
export const productKeys = {
  all: ["products"] as const,
  list: (params?: { category?: string; q?: string }) =>
    [...productKeys.all, "list", params] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
}

export const categoryKeys = {
  all: ["categories"] as const,
}

export const bannerKeys = {
  all: ["banners"] as const,
}

// ─── Products ─────────────────────────────────────────────────────────────────

export function useProducts(params?: { category?: string; q?: string }) {
  return useQuery({
    queryKey: productKeys.list(params),
    queryFn: async () => {
      const response = await apiClient.get<Product[]>("/products", {
        params,
      })
      return response.data
    },
  })
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: async () => {
      const response = await apiClient.get<Product>(`/products/${slug}`)
      return response.data
    },
    enabled: Boolean(slug),
  })
}

// ─── Categories ───────────────────────────────────────────────────────────────

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<Category[]>("/categories")
      return response.data
    },
    staleTime: Infinity, // categories rarely change
  })
}

// ─── Banners ─────────────────────────────────────────────────────────────────

export function useBanners() {
  return useQuery({
    queryKey: bannerKeys.all,
    queryFn: async () => {
      const response = await apiClient.get<Banner[]>("/banners")
      return response.data
    },
    staleTime: Infinity,
  })
}
