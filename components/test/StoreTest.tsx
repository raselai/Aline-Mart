'use client'

import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'

/**
 * Test component to verify cart and wishlist stores
 * This can be temporarily added to a page to test functionality
 */
export default function StoreTest() {
  const {
    items: cartItems,
    itemCount: cartCount,
    formattedSubtotal,
    formattedTotal,
    addItem: addToCart,
    removeItem: removeFromCart,
    clearCart
  } = useCart()

  const {
    items: wishlistItems,
    itemCount: wishlistCount,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isInWishlist,
    clearWishlist
  } = useWishlist()

  // Sample test product data
  const testProduct = {
    id: 'variant-1',
    productId: 'test-product-1',
    slug: 'test-rolex-submariner',
    name: 'Submariner Date',
    brand: 'Rolex',
    price: 12500,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49',
    variantId: 'variant-1',
    color: 'Black',
    size: '40mm',
    sku: 'ROLEX-SUB-BLK-40',
    stock: 5
  }

  const testWishlistProduct = {
    id: 'test-product-2',
    slug: 'test-gucci-bag',
    name: 'GG Marmont Bag',
    brand: 'Gucci',
    price: 2500,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3',
    inStock: true
  }

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-serif font-bold">Store Test Component</h1>

      {/* Cart Test Section */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-serif font-bold">Cart Store Test</h2>

        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            Cart Items: <span className="font-semibold text-charcoal">{cartCount}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Subtotal: <span className="font-semibold text-charcoal">{formattedSubtotal}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Total (with tax): <span className="font-semibold text-charcoal">{formattedTotal}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => addToCart(testProduct)}
            className="px-4 py-2 bg-burgundy text-white rounded hover:bg-plum transition-colors"
          >
            Add Test Product to Cart
          </button>
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-200 text-charcoal rounded hover:bg-gray-300 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        {cartItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Cart Items:</h3>
            {cartItems.map((item) => (
              <div
                key={item.variantId}
                className="flex items-center justify-between p-3 bg-light-gray rounded"
              >
                <div>
                  <p className="font-semibold">{item.brand} - {item.name}</p>
                  <p className="text-sm text-text-secondary">
                    {item.color} | {item.size} | Qty: {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.variantId)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wishlist Test Section */}
      <div className="border border-gray-200 rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-serif font-bold">Wishlist Store Test</h2>

        <div className="space-y-2">
          <p className="text-sm text-text-secondary">
            Wishlist Items: <span className="font-semibold text-charcoal">{wishlistCount}</span>
          </p>
          <p className="text-sm text-text-secondary">
            Is test product in wishlist:{' '}
            <span className="font-semibold text-charcoal">
              {isInWishlist(testWishlistProduct.id) ? 'Yes' : 'No'}
            </span>
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => toggleWishlist(testWishlistProduct)}
            className="px-4 py-2 bg-burgundy text-white rounded hover:bg-plum transition-colors"
          >
            Toggle Test Product in Wishlist
          </button>
          <button
            onClick={clearWishlist}
            className="px-4 py-2 bg-gray-200 text-charcoal rounded hover:bg-gray-300 transition-colors"
          >
            Clear Wishlist
          </button>
        </div>

        {wishlistItems.length > 0 && (
          <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Wishlist Items:</h3>
            {wishlistItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 bg-light-gray rounded"
              >
                <div>
                  <p className="font-semibold">{item.brand} - {item.name}</p>
                  <p className="text-sm text-text-secondary">
                    ${item.price.toLocaleString()} | {item.inStock ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
                <button
                  onClick={() => removeFromWishlist(item.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Note:</strong> This is a test component. Changes persist in localStorage.
          Refresh the page to verify persistence.
        </p>
      </div>
    </div>
  )
}
