export interface VirtualCard {
  id: string
  userId: string
  cardNumber: string
  balance: number
  lifetimeLoaded: number
  tierLevel: string
  discountPercent: number
  createdAt: string
  updatedAt: string
}

export interface VirtualCardTier {
  name: string
  minLifetimeLoad: number
  discountPercent: number
}

export interface VirtualCardTransactionRecord {
  id: string
  cardId: string
  type: 'TOPUP' | 'SPEND' | 'REFUND_CREDIT'
  amount: number
  balanceAfter: number
  orderId: string | null
  paystationTrxId: string | null
  description: string | null
  createdAt: string
}
