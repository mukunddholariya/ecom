import { NextResponse } from "next/server"
import { getBanners } from "@/lib/data"

export async function GET() {
  return NextResponse.json(getBanners())
}
