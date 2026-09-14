import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const { patientId, language, consent } = await request.json()
  if (!patientId || !language || consent?.status !== "granted") return NextResponse.json({ message: "Verified patient, language, and granted consent are required." }, { status: 400 })
  // TODO: persist encrypted PatientIntakeSession and structured Consent in the production database.
  return NextResponse.json({ message: "Intake persistence is not configured." }, { status: 503 })
}
