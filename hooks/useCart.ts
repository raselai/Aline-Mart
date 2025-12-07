import { useCartStore, CartItem } from '@/store/cartStore'

/**
 * Custom hook for cart operations
 *
 * Provides a clean interface to cart functionality:
 * - Add items to cart
 * - Remove items from cart
 * - Update quantities
 * - Clear entire cart
 * - Get cart state (items, count, subtotal)
 */
export function useCart() {
  const items = useCartStore((state) => state.items)
  const itemCount = useCartStore((state) => state.itemCount)
  const subtotal = useCartStore((state) => state.subtotal)
  const addItem = useCartStore((state) => state.addItem)
  const removeItem = useCartStore((state) => state.removeItem)
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const clearCart = useCartStore((state) => state.clearCart)
  const isInCart = useCartStore((state) => state.isInCart)

  /**
   * Format price for display
   */
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  /**
   * Get formatted subtotal
   */
  const formattedSubtotal = formatPrice(subtotal)

  /**
   * Calculate estimated tax (8% for example)
   */
  const estimatedTax = subtotal * 0.08
  const formattedTax = formatPrice(estimatedTax)

  /**
   * Calculate total (subtotal + tax)
   * Note: Shipping will be added during checkout
   */
  const total = subtotal + estimatedTax
  const formattedTotal = formatPrice(total)

  /**
   * Check if cart is empty
   */
  const isEmpty = items.length === 0

  /**
   * Get item by variant ID
   */
  const getItem = (variantId: string): CartItem | undefined => {
    return items.find(item => item.variantId === variantId)
  }

  /**
   * Increase item quantity by 1
   */
  const increaseQuantity = (variantId: string) => {
    const item = getItem(variantId)
    if (item) {
      updateQuantity(variantId, item.quantity + 1)
    }
  }

  /**
   * Decrease item quantity by 1
   */
  const decreaseQuantity = (variantId: string) => {
    const item = getItem(variantId)
    if (item) {
      updateQuantity(variantId, item.quantity - 1)
    }
  }

  return {
    // State
    items,
    itemCount,
    subtotal,
    isEmpty,

    // Formatted values
    formattedSubtotal,
    estimatedTax,
    formattedTax,
    total,
    formattedTotal,

    // Actions
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isInCart,
    getItem,

    // Helper actions
    increaseQuantity,
    decreaseQuantity,
    formatPrice
  }
}
