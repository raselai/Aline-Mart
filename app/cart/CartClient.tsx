'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { ShoppingBag, ArrowLeft } from 'lucide-react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartClient() {
  const { items, isEmpty, clearCart } = useCart()

  // Empty cart state
  if (isEmpty) {
    return (
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-md mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-light-gray rounded-full mb-6">
            <ShoppingBag className="w-10 h-10 text-burgundy" />
          </div>

          {/* Title */}
          <h2 className="font-serif text-3xl font-bold text-charcoal mb-4">
            Your Cart is Empty
          </h2>

          {/* Description */}
          <p className="text-secondary text-lg mb-8">
            Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
          </p>

          {/* CTA */}
          <Link href="/products">
            <Button className="gradient-primary text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  // Handle clear cart with confirmation
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      clearCart()
    }
  }

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items (Left - 70%) */}
        <div className="lg:col-span-2">
          {/* Action Buttons */}
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/products"
              className="text-sm text-burgundy hover:underline flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
            <button
              onClick={handleClearCart}
              className="text-sm text-secondary hover:text-charcoal transition-colors"
            >
              Clear Cart
            </button>
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <CartItem key={`${item.productId}-${item.variantId}`} item={item} />
            ))}
          </div>

          {/* Continue Shopping (Mobile) */}
          <div className="mt-6 lg:hidden">
            <Link href="/products">
              <Button variant="outline" className="w-full border-2">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Order Summary (Right - 30%) */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  )
}
