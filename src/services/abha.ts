
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
