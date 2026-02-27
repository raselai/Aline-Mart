import { createServerClient } from '@/lib/supabase/server'
import type { CardTypeConfig, SignatureCardCategory, DiscountBreakdown } from '@/types/signature-card'

const DEFAULT_CARD_TYPES: CardTypeConfig[] = [
  {
    category: 'CROWN',
    price: 100000,
    label: 'Signature Crown',
    description: 'Elite Privilege Membership',
    alineFashionDiscount: 40,
    otherBrandsDiscount: 15,
    freeDelivery: true,
    birthdayBonus: 10,
  },
  {
    category: 'PRIVILEGE',
    price: 10000,
    label: 'Signature Privilege',
    description: 'Premium membership for the discerning shopper',
    alineFashionDiscount: 30,
    otherBrandsDiscount: 10,
    freeDelivery: false,
    birthdayBonus: 10,
  },
  {
    category: 'CAMPUS',
    price: 5000,
    label: 'Signature Campus Friendly',
    description: 'Exclusive student membership',
    alineFashionDiscount: 30,
    otherBrandsDiscount: 10,
    freeDelivery: false,
    birthdayBonus: 10,
  },
]

export function generateCardNumber(): string {
  const digits = Array.from({ length: 16 }, () => Math.floor(Math.random() * 10)).join('')
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8, 12)}-${digits.slice(12, 16)}`
}

export async function getCardTypeConfigs(): Promise<CardTypeConfig[]> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'signature_card_types')
    .single()

  if (error || !data) {
    return DEFAULT_CARD_TYPES
  }

  const value = data.value
  if (typeof value === 'string') {
    return JSON.parse(value) as CardTypeConfig[]
  }
  return value as CardTypeConfig[]
}

export async function getAlineFashionBrandId(): Promise<number | null> {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', 'aline_fashion_brand_id')
    .single()

  if (error || !data) return null
  return typeof data.value === 'number' ? data.value : Number(data.value)
}

export function getDiscountRates(
  category: SignatureCardCategory,
  cardTypes?: CardTypeConfig[]
): { alineFashionDiscount: number; otherBrandsDiscount: number } {
  const types = cardTypes || DEFAULT_CARD_TYPES
  const config = types.find((t) => t.category === category)
  return {
    alineFashionDiscount: config?.alineFashionDiscount ?? 0,
    otherBrandsDiscount: config?.otherBrandsDiscount ?? 0,
  }
}

export async function activateCard(
  cardId: string,
  paystationTrxId: string
): Promise<void> {
  const supabase = await createServerClient()

  const now = new Date()
  const validUntil = new Date(now)
  validUntil.setFullYear(validUntil.getFullYear() + 1)

  const { data: card, error: fetchError } = await supabase
    .from('SignatureCard')
    .select('purchasePrice')
    .eq('id', cardId)
    .single()

  if (fetchError || !card) throw new Error('Card not found')

  const { error: updateError } = await supabase
    .from('SignatureCard')
    .update({
      isActive: true,
      paystationTrxId,
      validFrom: now.toISOString(),
      validUntil: validUntil.toISOString(),
      balance: card.purchasePrice,
      updatedAt: now.toISOString(),
    })
    .eq('id', cardId)

  if (updateError) throw new Error('Failed to activate card')

  // Log PURCHASE transaction
  await supabase.from('CardTransaction').insert({
    cardId,
    type: 'PURCHASE',
    amount: Number(card.purchasePrice),
    balanceAfter: Number(card.purchasePrice),
    paystationTrxId,
    description: 'Card purchase and activation',
  })
}

export async function deductBalance(
  cardId: string,
  amount: number,
  orderId: string,
  description: string
): Promise<number> {
  const supabase = await createServerClient()

  const { data, error } = await supabase.rpc('deduct_signature_card_balance', {
    card_id: cardId,
    deduct_amount: amount,
  })

  if (error) throw new Error(error.message || 'Failed to deduct balance')

  const newBalance = Number(data)

  await supabase.from('CardTransaction').insert({
    cardId,
    type: 'SPEND',
    amount,
    balanceAfter: newBalance,
    orderId,
    description,
  })

  return newBalance
}

export async function generateOTP(cardId: string): Promise<string> {
  const supabase = await createServerClient()

  // Rate limit: max 3 OTPs per hour
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString()
  const { count } = await supabase
    .from('CardOTP')
    .select('*', { count: 'exact', head: true })
    .eq('cardId', cardId)
    .gte('createdAt', oneHourAgo)

  if (count !== null && count >= 3) {
    throw new Error('Too many OTP requests. Please wait before trying again.')
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000))
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString()

  const { error } = await supabase.from('CardOTP').insert({
    cardId,
    otpCode,
    expiresAt,
  })

  if (error) throw new Error('Failed to generate OTP')

  return otpCode
}

export async function verifyOTP(
  cardId: string,
  otpCode: string
): Promise<string> {
  const supabase = await createServerClient()

  // Find the latest unexpired, unused OTP for this card
  const { data: otp, error } = await supabase
    .from('CardOTP')
    .select('*')
    .eq('cardId', cardId)
    .is('usedAt', null)
    .gte('expiresAt', new Date().toISOString())
    .order('createdAt', { ascending: false })
    .limit(1)
    .single()

  if (error || !otp) {
    throw new Error('No valid OTP found. Please request a new one.')
  }

  if (otp.attempts >= 3) {
    throw new Error('Maximum attempts exceeded. Please request a new OTP.')
  }

  // Increment attempts
  await supabase
    .from('CardOTP')
    .update({ attempts: otp.attempts + 1 })
    .eq('id', otp.id)

  if (otp.otpCode !== otpCode) {
    const remaining = 2 - otp.attempts
    throw new Error(
      remaining > 0
        ? `Invalid OTP. ${remaining} attempt(s) remaining.`
        : 'Invalid OTP. Maximum attempts exceeded. Please request a new OTP.'
    )
  }

  // Mark as used
  await supabase
    .from('CardOTP')
    .update({ usedAt: new Date().toISOString() })
    .eq('id', otp.id)

  return otp.id
}

export async function isOTPTokenValid(
  otpId: string,
  cardId: string
): Promise<boolean> {
  const supabase = await createServerClient()

  const { data: otp } = await supabase
    .from('CardOTP')
    .select('*')
    .eq('id', otpId)
    .eq('cardId', cardId)
    .single()

  if (!otp) return false
  if (!otp.usedAt) return false // Must have been verified
  if (otp.usedForOrderId) return false // Already consumed by another order
  return true
}

export function isBirthdayOrAnniversary(
  dateOfBirth: string | null,
  weddingAnniversary: string | null
): boolean {
  const today = new Date()
  const todayMonth = today.getMonth() + 1
  const todayDay = today.getDate()

  if (dateOfBirth) {
    const dob = new Date(dateOfBirth)
    if (dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay) return true
  }

  if (weddingAnniversary) {
    const anniversary = new Date(weddingAnniversary)
    if (anniversary.getMonth() + 1 === todayMonth && anniversary.getDate() === todayDay) return true
  }

  return false
}

export interface CartItemForDiscount {
  price: number
  quantity: number
  brandId: number | null
}

export function calculateDiscounts(
  cartItems: CartItemForDiscount[],
  alineFashionBrandId: number | null,
  cardCategory: SignatureCardCategory,
  dateOfBirth: string | null = null,
  weddingAnniversary: string | null = null,
  cardTypes?: CardTypeConfig[]
): DiscountBreakdown {
  const rates = getDiscountRates(cardCategory, cardTypes)
  const hasBirthdayBonus = isBirthdayOrAnniversary(dateOfBirth, weddingAnniversary)
  const bonusRate = hasBirthdayBonus ? 10 : 0

  let alineFashionDiscount = 0
  let otherBrandsDiscount = 0
  let birthdayBonus = 0
  let totalBeforeDiscount = 0

  for (const item of cartItems) {
    const itemTotal = item.price * item.quantity
    totalBeforeDiscount += itemTotal

    const isAlineFashion = alineFashionBrandId !== null && item.brandId === alineFashionBrandId

    if (isAlineFashion) {
      alineFashionDiscount += itemTotal * (rates.alineFashionDiscount / 100)
    } else {
      otherBrandsDiscount += itemTotal * (rates.otherBrandsDiscount / 100)
    }

    if (hasBirthdayBonus) {
      birthdayBonus += itemTotal * (bonusRate / 100)
    }
  }

  const totalDiscount = alineFashionDiscount + otherBrandsDiscount + birthdayBonus

  return {
    alineFashionDiscount: Math.round(alineFashionDiscount * 100) / 100,
    otherBrandsDiscount: Math.round(otherBrandsDiscount * 100) / 100,
    birthdayBonus: Math.round(birthdayBonus * 100) / 100,
    totalDiscount: Math.round(totalDiscount * 100) / 100,
    totalAfterDiscount: Math.round((totalBeforeDiscount - totalDiscount) * 100) / 100,
  }
}

export function isCardValid(card: { isActive: boolean; validUntil: string | null }): boolean {
  if (!card.isActive) return false
  if (card.validUntil && new Date(card.validUntil) < new Date()) return false
  return true
}

export function shouldApplyFreeDelivery(cardCategory: SignatureCardCategory): boolean {
  return cardCategory === 'CROWN'
}
