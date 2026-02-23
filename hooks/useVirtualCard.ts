import { useVirtualCardStore } from '@/store/virtualCardStore'

export function useVirtualCard() {
  const card = useVirtualCardStore((s) => s.card)
  const tiers = useVirtualCardStore((s) => s.tiers)
  const isLoading = useVirtualCardStore((s) => s.isLoading)
  const fetchCard = useVirtualCardStore((s) => s.fetchCard)
  const clearCard = useVirtualCardStore((s) => s.clearCard)

  const balance = card ? Number(card.balance) : 0
  const tierLevel = card?.tierLevel ?? 'STANDARD'
  const discountPercent = card ? Number(card.discountPercent) : 0
  const hasCard = !!card

  const formatBalance = (amount: number): string => {
    return '৳' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  }

  return {
    card,
    tiers,
    isLoading,
    balance,
    tierLevel,
    discountPercent,
    hasCard,
    formattedBalance: formatBalance(balance),
    fetchCard,
    clearCard,
    formatBalance,
  }
}
