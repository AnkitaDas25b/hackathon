import type { VerifiedPatientIdentity } from "../types"

/** Identifier capture is intentionally separate from validation and verification. */
export const ABHA_PATTERN = /^\d{2}-\d{4}-\d{4}-\d{4}$/

export function normalizeAbha(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 14)
  return digits.replace(/(\d{2})(\d{0,4})(\d{0,4})(\d{0,4})/, (_, a, b, c, d) =>
    [a, b, c, d].filter(Boolean).join("-"),
  )
}

export function extractAbhaIdentifier(value: string) {
  const match = value.match(/\b\d{2}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/)
  return match ? normalizeAbha(match[0]) : null
}

export function validateAbha(value: string) {
  return ABHA_PATTERN.test(value)
    ? null
    : "Enter the 14-digit ABHA ID in the format 12-3456-7890-1234."
}

export type VerificationResult = {
  ok: true
  patient: VerifiedPatientIdentity
} | { ok: false, message: string }

/** Development-only adapter. Replace with an authenticated server-side ABDM adapter; it is not ABDM authentication. */
export async function verifyAbhaForDevelopment(
  abha: string,
): Promise<VerificationResult> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  if (abha.endsWith("0000"))
    return {
      ok: false,
      message:
        "We couldn't verify the ABHA ID right now. Please try again or enter it manually.",
    }
  return {
    ok: true,
    patient: {
      patientId: `patient-${abha.replace(/\D/g, "").slice(-6)}`,
      name: "Verified patient",
      age: 42,
      gender: "Not displayed",
    },
  }
}
