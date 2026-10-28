import { NextResponse } from "next/server"
import { getProducts, searchProducts, getProductsByCategory } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const category = searchParams.get("category")
  const query = searchParams.get("q")

  let products = getProducts()

  if (category) {
    products = getProductsByCategory(category)
  }

  if (query) {
    products = searchProducts(query)
  }

  return NextResponse.json(products)
}
