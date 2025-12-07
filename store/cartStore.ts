import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string // Product variant ID
  productId: string
  slug: string
  name: string
  brand: string
  price: number
  image: string
  variantId: string
  color?: string
  size?: string
  sku: string
  quantity: number
  stock: number
}

interface CartState {
  items: CartItem[]

  // Computed values
  itemCount: number
  subtotal: number

  // Actions
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (variantId: string) => void
  updateQuantity: (variantId: string, quantity: number) => void
  clearCart: () => void

  // Helper to check if item exists
  isInCart: (variantId: string) => boolean
}

const calculateSubtotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.price * item.quantity), 0)
}

const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      itemCount: 0,
      subtotal: 0,

      addItem: (newItem) => {
        const items = get().items
        const existingItem = items.find(item => item.variantId === newItem.variantId)

        let updatedItems: CartItem[]

        if (existingItem) {
          // Item already in cart, increase quantity
          const newQuantity = Math.min(
            existingItem.quantity + 1,
            newItem.stock
          )

          updatedItems = items.map(item =>
            item.variantId === newItem.variantId
              ? { ...item, quantity: newQuantity }
              : item
          )
        } else {
          // New item, add to cart
          updatedItems = [
            ...items,
            {
              ...newItem,
              quantity: 1,
              id: newItem.variantId
            }
          ]
        }

        set({
          items: updatedItems,
          subtotal: calculateSubtotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      removeItem: (variantId) => {
        const updatedItems = get().items.filter(item => item.variantId !== variantId)

        set({
          items: updatedItems,
          subtotal: calculateSubtotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(variantId)
          return
        }

        const updatedItems = get().items.map(item => {
          if (item.variantId === variantId) {
            // Ensure quantity doesn't exceed stock
            const newQuantity = Math.min(quantity, item.stock)
            return { ...item, quantity: newQuantity }
          }
          return item
        })

        set({
          items: updatedItems,
          subtotal: calculateSubtotal(updatedItems),
          itemCount: calculateItemCount(updatedItems)
        })
      },

      clearCart: () => {
        set({
          items: [],
          subtotal: 0,
          itemCount: 0
        })
      },

      isInCart: (variantId) => {
        return get().items.some(item => item.variantId === variantId)
      }
    }),
    {
      name: 'aline-mart-cart', // localStorage key
      // Only persist items, compute subtotal/itemCount on load
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.subtotal = calculateSubtotal(state.items)
          state.itemCount = calculateItemCount(state.items)
        }
      }
    }
  )
)
