import { create } from 'zustand'
import type { SignatureCard, CardTypeConfig } from '@/types/signature-card'

interface SignatureCardState {
  cards: SignatureCard[]
  cardTypes: CardTypeConfig[]
  userId: string | null
  isLoading: boolean
  fetchCards: (email: string) => Promise<void>
  clearCards: () => void
}

export const useSignatureCardStore = create<SignatureCardState>()((set) => ({
  cards: [],
  cardTypes: [],
  userId: null,
  isLoading: false,
  fetchCards: async (email: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`/api/signature-card?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        set({
          cards: data.cards || [],
          cardTypes: data.cardTypes || [],
          userId: data.userId || null,
        })
      }
    } catch {
      // Silently fail
    } finally {
      set({ isLoading: false })
    }
  },
  clearCards: () => set({ cards: [], cardTypes: [], userId: null, isLoading: false }),
}))
