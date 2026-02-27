import { useMemo } from 'react'
import { useSignatureCardStore } from '@/store/signatureCardStore'
import type { SignatureCard } from '@/types/signature-card'

export function useSignatureCard() {
  const cards = useSignatureCardStore((s) => s.cards)
  const cardTypes = useSignatureCardStore((s) => s.cardTypes)
  const isLoading = useSignatureCardStore((s) => s.isLoading)
  const fetchCards = useSignatureCardStore((s) => s.fetchCards)
  const userId = useSignatureCardStore((s) => s.userId)
  const clearCards = useSignatureCardStore((s) => s.clearCards)

  const activeCards = useMemo(() => {
    const now = new Date()
    return cards.filter(
      (c) => c.isActive && (!c.validUntil || new Date(c.validUntil) > now)
    )
  }, [cards])

  const hasActiveCard = activeCards.length > 0

  const highestTierCard = useMemo((): SignatureCard | null => {
    if (activeCards.length === 0) return null
    const priority: Record<string, number> = { CROWN: 3, PRIVILEGE: 2, CAMPUS: 1 }
    return activeCards.reduce((best, card) =>
      (priority[card.category] || 0) > (priority[best.category] || 0) ? card : best
    )
  }, [activeCards])

  const totalBalance = useMemo(() => {
    return activeCards.reduce((sum, c) => sum + Number(c.balance), 0)
  }, [activeCards])

  const formatBalance = (amount: number): string =>
    '৳' + amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  return {
    cards,
    activeCards,
    cardTypes,
    isLoading,
    hasActiveCard,
    highestTierCard,
    totalBalance,
    formattedTotalBalance: formatBalance(totalBalance),
    userId,
    fetchCards,
    clearCards,
    formatBalance,
  }
}
