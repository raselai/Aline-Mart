import { useWishlistStore, WishlistItem } from '@/store/wishlistStore'

/**
 * Custom hook for wishlist operations
 *
 * Provides a clean interface to wishlist functionality:
 * - Add items to wishlist
 * - Remove items from wishlist
 * - Clear entire wishlist
 * - Toggle items (add/remove)
 * - Get wishlist state
 */
export function useWishlist() {
  const items = useWishlistStore((state) => state.items)
  const itemCount = useWishlistStore((state) => state.itemCount)
  const addToWishlist = useWishlistStore((state) => state.addToWishlist)
  const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist)
  const clearWishlist = useWishlistStore((state) => state.clearWishlist)
  const isInWishlist = useWishlistStore((state) => state.isInWishlist)
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist)

  /**
   * Check if wishlist is empty
   */
  const isEmpty = items.length === 0

  /**
   * Get item by product ID
   */
  const getItem = (productId: string): WishlistItem | undefined => {
    return items.find(item => item.id === productId)
  }

  /**
   * Get all in-stock items
   */
  const inStockItems = items.filter(item => item.inStock)

  /**
   * Get all out-of-stock items
   */
  const outOfStockItems = items.filter(item => !item.inStock)

  /**
   * Sort items by date added (newest first)
   */
  const sortedByNewest = [...items].sort(
    (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
  )

  /**
   * Sort items by date added (oldest first)
   */
  const sortedByOldest = [...items].sort(
    (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
  )

  /**
   * Sort items by price (low to high)
   */
  const sortedByPriceLow = [...items].sort((a, b) => a.price - b.price)

  /**
   * Sort items by price (high to low)
   */
  const sortedByPriceHigh = [...items].sort((a, b) => b.price - a.price)

  /**
   * Get items by brand
   */
  const getItemsByBrand = (brand: string): WishlistItem[] => {
    return items.filter(
      item => item.brand.toLowerCase() === brand.toLowerCase()
    )
  }

  return {
    // State
    items,
    itemCount,
    isEmpty,

    // Filtered lists
    inStockItems,
    outOfStockItems,

    // Sorted lists
    sortedByNewest,
    sortedByOldest,
    sortedByPriceLow,
    sortedByPriceHigh,

    // Actions
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
    isInWishlist,

    // Helpers
    getItem,
    getItemsByBrand
  }
}
