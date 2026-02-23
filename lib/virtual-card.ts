import { createServerClient } from '@/lib/supabase/server'
import type { VirtualCardTier } from '@/types/virtual-card'

/**
 * Generate a unique 16-digit card number formatted as XXXX-XXXX-XXXX-XXXX
 */
export function generateCardNumber(): string {
  const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 16)}`
}

/**
 * Read tier configuration from the settings table
 */
export async function getVirtualCardTiers(): Promise<VirtualCardTier[]> {
  const supabase = await createServerClient()

  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'virtual_card_tiers')
    .single()

  if (error || !data) {
    // Fallback defaults if settings not found
    return [
      { name: 'STANDARD', minLifetimeLoad: 0, discountPercent: 0 },
      { name: 'SILVER', minLifetimeLoad: 5000, discountPercent: 3 },
      { name: 'GOLD', minLifetimeLoad: 15000, discountPercent: 5 },
      { name: 'PLATINUM', minLifetimeLoad: 50000, discountPercent: 8 },
    ]
  }

  // Settings table uses JSONB — Supabase returns it already parsed
  const value = data.value
  if (typeof value === 'string') {
    return JSON.parse(value) as VirtualCardTier[]
  }
  return value as VirtualCardTier[]
}

/**
 * Calculate the tier for a given lifetime loaded amount
 */
export function calculateTier(
  lifetimeLoaded: number,
  tiers: VirtualCardTier[]
): { tierLevel: string; discountPercent: number } {
  // Sort tiers descending by minLifetimeLoad to find highest qualifying tier
  const sorted = [...tiers].sort((a, b) => b.minLifetimeLoad - a.minLifetimeLoad)
  const matched = sorted.find((t) => lifetimeLoaded >= t.minLifetimeLoad)

  return {
    tierLevel: matched?.name ?? 'STANDARD',
    discountPercent: matched?.discountPercent ?? 0,
  }
}

/**
 * Add balance to a virtual card (top-up).
 * Also recalculates tier based on new lifetime loaded.
 */
export async function addBalance(
  cardId: string,
  amount: number,
  paystationTrxId: string,
  description: string
): Promise<{ newBalance: number; tierLevel: string; discountPercent: number }> {
  const supabase = await createServerClient()

  // Get current card state
  const { data: card, error: cardError } = await supabase
    .from('VirtualCard')
    .select('*')
    .eq('id', cardId)
    .single()

  if (cardError || !card) {
    throw new Error('Virtual card not found')
  }

  const newBalance = Number(card.balance) + amount
  const newLifetimeLoaded = Number(card.lifetimeLoaded) + amount

  // Recalculate tier
  const tiers = await getVirtualCardTiers()
  const { tierLevel, discountPercent } = calculateTier(newLifetimeLoaded, tiers)

  // Update card
  const { error: updateError } = await supabase
    .from('VirtualCard')
    .update({
      balance: newBalance,
      lifetimeLoaded: newLifetimeLoaded,
      tierLevel,
      discountPercent,
      updatedAt: new Date().toISOString(),
    })
    .eq('id', cardId)

  if (updateError) {
    throw new Error('Failed to update card balance')
  }

  // Log transaction
  const { error: txError } = await supabase
    .from('VirtualCardTransaction')
    .insert({
      cardId,
      type: 'TOPUP',
      amount,
      balanceAfter: newBalance,
      paystationTrxId,
      description,
    })

  if (txError) {
    console.error('Failed to log top-up transaction:', txError)
  }

  return { newBalance, tierLevel, discountPercent }
}

/**
 * Deduct balance from a virtual card (spend).
 * Uses Postgres function for atomic deduction with row-level lock.
 */
export async function deductBalance(
  cardId: string,
  amount: number,
  orderId: string,
  description: string
): Promise<number> {
  const supabase = await createServerClient()

  // Call the atomic Postgres function
  const { data, error } = await supabase.rpc('deduct_virtual_card_balance', {
    card_id: cardId,
    deduct_amount: amount,
  })

  if (error) {
    throw new Error(error.message || 'Failed to deduct balance')
  }

  const newBalance = Number(data)

  // Log transaction
  const { error: txError } = await supabase
    .from('VirtualCardTransaction')
    .insert({
      cardId,
      type: 'SPEND',
      amount,
      balanceAfter: newBalance,
      orderId,
      description,
    })

  if (txError) {
    console.error('Failed to log spend transaction:', txError)
  }

  return newBalance
}
