import { supabase } from '@/lib/supabase'

export interface ShippingConfig {
  baseFee: number
  ratePerKg: number
}

const DEFAULT_BASE_FEE = 60
const DEFAULT_RATE_PER_KG = 20

/**
 * Fetch shipping config from the settings table.
 * Falls back to defaults if rows are missing.
 */
export async function getShippingConfig(): Promise<ShippingConfig> {
  const { data } = await supabase
    .from('settings')
    .select('key, value')
    .in('key', ['shipping_base_fee', 'shipping_rate_per_kg'])

  let baseFee = DEFAULT_BASE_FEE
  let ratePerKg = DEFAULT_RATE_PER_KG

  if (data) {
    for (const row of data) {
      const parsed = parseFloat(row.value)
      if (row.key === 'shipping_base_fee' && !isNaN(parsed)) {
        baseFee = parsed
      } else if (row.key === 'shipping_rate_per_kg' && !isNaN(parsed)) {
        ratePerKg = parsed
      }
    }
  }

  return { baseFee, ratePerKg }
}

/**
 * Pure calculation: baseFee + totalWeightKg * ratePerKg, rounded to nearest integer.
 */
export function calculateShippingCost(config: ShippingConfig, totalWeightKg: number): number {
  return Math.round(config.baseFee + totalWeightKg * config.ratePerKg)
}

/**
 * Parse a product weight string to a number. Returns 0 for null/undefined/unparseable values.
 */
export function parseProductWeight(weight: string | null | undefined): number {
  if (!weight) return 0
  const parsed = parseFloat(weight)
  return isNaN(parsed) ? 0 : parsed
}
