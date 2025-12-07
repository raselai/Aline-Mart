import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface WishlistItem {
  id: string // Product ID
  slug: string
  name: string
  brand: string
  price: number
  image: string
  inStock: boolean
  addedAt: Date
}

interface WishlistState {
  items: WishlistItem[]

  // Computed values
  itemCount: number

  // Actions
  addToWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
  removeFromWishlist: (productId: string) => void
  clearWishlist: () => void

  // Helper to check if item exists
  isInWishlist: (productId: string) => boolean

  // Toggle function (add if not exists, remove if exists)
  toggleWishlist: (item: Omit<WishlistItem, 'addedAt'>) => void
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,

      addToWishlist: (newItem) => {
        const items = get().items
        const exists = items.some(item => item.id === newItem.id)

        if (!exists) {
          const updatedItems = [
            {
              ...newItem,
              addedAt: new Date()
            },
            ...items // Add new items to the beginning
          ]

          set({
            items: updatedItems,
            itemCount: updatedItems.length
          })
        }
      },

      removeFromWishlist: (productId) => {
        const updatedItems = get().items.filter(item => item.id !== productId)

        set({
          items: updatedItems,
          itemCount: updatedItems.length
        })
      },

      clearWishlist: () => {
        set({
          items: [],
          itemCount: 0
        })
      },

      isInWishlist: (productId) => {
        return get().items.some(item => item.id === productId)
      },

      toggleWishlist: (item) => {
        const isInWishlist = get().isInWishlist(item.id)

        if (isInWishlist) {
          get().removeFromWishlist(item.id)
        } else {
          get().addToWishlist(item)
        }
      }
    }),
    {
      name: 'aline-mart-wishlist', // localStorage key
      // Only persist items, compute itemCount on load
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.itemCount = state.items.length

          // Convert addedAt back to Date objects after loading from localStorage
          state.items = state.items.map(item => ({
            ...item,
            addedAt: new Date(item.addedAt)
          }))
        }
      }
    }
  )
)
