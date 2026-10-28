import { NextResponse } from "next/server"
import { getMockOrders, getMockOrdersByUserId } from "@/lib/data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (userId) {
    const userOrders = getMockOrdersByUserId(userId)
    return NextResponse.json(userOrders)
  }

  return NextResponse.json(getMockOrders())
}

