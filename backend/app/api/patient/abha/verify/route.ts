import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { abhaId } = await request.json()
  if (typeof abhaId !== "string" || !/^\d{2}-\d{4}-\d{4}-\d{4}$/.test(abhaId)) return NextResponse.json({ message: "Invalid ABHA ID format." }, { status: 400 })
  // TODO: authenticate server-to-server with ABDM; never expose ABDM credentials to the browser.
  return NextResponse.json({ message: "ABDM verification is not configured." }, { status: 503 })
}
