import { create } from 'zustand'
import type { VirtualCard, VirtualCardTier } from '@/types/virtual-card'

interface VirtualCardState {
  card: VirtualCard | null
  tiers: VirtualCardTier[]
  isLoading: boolean

  fetchCard: (email: string) => Promise<void>
  clearCard: () => void
}

export const useVirtualCardStore = create<VirtualCardState>()((set) => ({
  card: null,
  tiers: [],
  isLoading: false,

  fetchCard: async (email: string) => {
    set({ isLoading: true })
    try {
      const res = await fetch(`/api/virtual-card?email=${encodeURIComponent(email)}`)
      if (res.ok) {
        const data = await res.json()
        set({ card: data.card || null, tiers: data.tiers || [] })
      }
    } catch {
      // Silently fail
    } finally {
      set({ isLoading: false })
    }
  },

  clearCard: () => {
    set({ card: null, tiers: [], isLoading: false })
  },
}))
