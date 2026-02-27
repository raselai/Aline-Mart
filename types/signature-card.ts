export type SignatureCardCategory = 'CROWN' | 'PRIVILEGE' | 'CAMPUS'
export type PhysicalCardStatus = 'PENDING' | 'SHIPPED' | 'DELIVERED'
export type CardTransactionType = 'PURCHASE' | 'SPEND' | 'DISCOUNT_USED' | 'REFUND_CREDIT'

export interface SignatureCard {
  id: string
  userId: string
  category: SignatureCardCategory
  cardNumber: string
  cardholderName: string
  balance: number
  purchasePrice: number
  validFrom: string | null
  validUntil: string | null
  isActive: boolean
  paystationTrxId: string | null
  mailingAddress: string
  physicalCardStatus: PhysicalCardStatus
  email: string
  phone: string
  dateOfBirth: string | null
  weddingAnniversary: string | null
  perCardOffers: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface CardTypeConfig {
  category: SignatureCardCategory
  price: number
  label: string
  description: string
  alineFashionDiscount: number
  otherBrandsDiscount: number
  freeDelivery: boolean
  birthdayBonus: number
}

export interface CardTransactionRecord {
  id: string
  cardId: string
  type: CardTransactionType
  amount: number
  balanceAfter: number
  orderId: string | null
  paystationTrxId: string | null
  description: string | null
  createdAt: string
}

export interface DiscountBreakdown {
  alineFashionDiscount: number
  otherBrandsDiscount: number
  birthdayBonus: number
  totalDiscount: number
  totalAfterDiscount: number
}
