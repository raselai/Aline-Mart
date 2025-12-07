# State Management - Zustand Stores

This directory contains Zustand stores for managing global application state.

## Stores

### Cart Store (`cartStore.ts`)

Manages shopping cart state with localStorage persistence.

**Features:**
- Add/remove items from cart
- Update item quantities
- Stock validation
- Automatic subtotal and item count calculation
- localStorage persistence

**Usage:**
```typescript
import { useCart } from '@/hooks/useCart'

function ProductPage() {
  const { addItem, items, itemCount, formattedSubtotal } = useCart()

  const handleAddToCart = () => {
    addItem({
      id: variantId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: variant.price,
      image: product.images[0].url,
      variantId: variant.id,
      color: variant.color,
      size: variant.size,
      sku: variant.sku,
      stock: variant.stock
    })
  }

  return (
    <div>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <p>Cart: {itemCount} items - {formattedSubtotal}</p>
    </div>
  )
}
```

### Wishlist Store (`wishlistStore.ts`)

Manages user's wishlist with localStorage persistence.

**Features:**
- Add/remove items from wishlist
- Toggle items (add if not exists, remove if exists)
- Check if item is in wishlist
- Sort and filter wishlist items
- localStorage persistence

**Usage:**
```typescript
import { useWishlist } from '@/hooks/useWishlist'

function ProductCard({ product }) {
  const { toggleWishlist, isInWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: product.price,
      image: product.images[0].url,
      inStock: product.stock > 0
    })
  }

  return (
    <button onClick={handleToggleWishlist}>
      {inWishlist ? '❤️' : '🤍'}
    </button>
  )
}
```

## Testing

Visit `/test-store` in development mode to test cart and wishlist functionality:
- Add/remove items
- Verify localStorage persistence (refresh page)
- Check computed values (subtotal, tax, total)

## Implementation Details

### Persistence Strategy

Both stores use Zustand's `persist` middleware to save state to localStorage:
- **Cart Key:** `aline-mart-cart`
- **Wishlist Key:** `aline-mart-wishlist`

Only core data (items array) is persisted. Computed values (subtotal, itemCount) are recalculated on rehydration.

### Type Safety

All stores are fully typed with TypeScript interfaces:
- `CartItem` - Individual cart item structure
- `WishlistItem` - Individual wishlist item structure
- Store state and actions are properly typed

### Stock Validation

The cart store validates stock levels:
- Adding items checks available stock
- Updating quantities enforces stock limits
- Stock is validated at the store level before checkout

### Price Formatting

The `useCart` hook includes price formatting utilities:
- `formatPrice(price)` - Formats price as USD currency
- `formattedSubtotal` - Pre-formatted subtotal
- `formattedTax` - Pre-formatted estimated tax
- `formattedTotal` - Pre-formatted total

## Next Steps

When implementing authentication (Phase 3), you can:
1. Sync cart/wishlist from localStorage to database on login
2. Load user's cart/wishlist from database after authentication
3. Merge local cart with server cart (if both exist)
4. Clear localStorage and use database as source of truth for authenticated users

Example sync function (to be implemented):
```typescript
async function syncCartWithServer(userId: string) {
  const localCart = useCartStore.getState().items
  const serverCart = await fetchUserCart(userId)

  // Merge logic here
  const mergedCart = mergeLocalAndServerCart(localCart, serverCart)

  // Update server
  await updateUserCart(userId, mergedCart)

  // Update local store
  useCartStore.setState({ items: mergedCart })
}
```
