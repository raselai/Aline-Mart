/**
 * Parse a product weight string to a number. Returns 0 for null/undefined/unparseable values.
 */
export function parseProductWeight(weight: string | null | undefined): number {
  if (!weight) return 0
  const parsed = parseFloat(weight)
  return isNaN(parsed) ? 0 : parsed
}
