import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { email } = await request.json()
  if (typeof email !== "string" || !/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ message: "A valid email address is required." }, { status: 400 })
  // TODO: generate, hash, persist, expire, and deliver a code through the hospital email provider.
  return NextResponse.json({ status: "pending", message: "Email verification delivery must be configured by the server operator." }, { status: 202 })
}
