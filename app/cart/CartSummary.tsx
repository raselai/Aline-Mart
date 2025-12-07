'use client'

import { useState } from 'react'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Lock, Tag } from 'lucide-react'

export default function CartSummary() {
  const {
    itemCount,
    formattedSubtotal,
    formattedTax,
    formattedTotal,
    formatPrice,
  } = useCart()

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')

  const shippingCost = 0 // Free shipping
  const formattedShipping = formatPrice(shippingCost)

  const handleApplyPromo = () => {
    // Mock promo code validation
    if (promoCode.toLowerCase() === 'save10') {
      setPromoApplied(true)
      setPromoError('')
    } else if (promoCode.trim() === '') {
      setPromoError('Please enter a promo code')
    } else {
      setPromoError('Invalid promo code')
      setPromoApplied(false)
    }
  }

  return (
    <div className="bg-light-gray rounded-lg p-6">
      {/* Title */}
      <h2 className="font-serif text-2xl font-bold text-charcoal mb-6">
        Order Summary
      </h2>

      {/* Price Breakdown */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-secondary">
          <span>Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})</span>
          <span className="font-semibold">{formattedSubtotal}</span>
        </div>

        <div className="flex justify-between text-secondary">
          <span>Shipping</span>
          <span className="font-semibold text-green-600">
            {shippingCost === 0 ? 'FREE' : formattedShipping}
          </span>
        </div>

        <div className="flex justify-between text-secondary">
          <span>Estimated Tax</span>
          <span className="font-semibold">{formattedTax}</span>
        </div>

        {promoApplied && (
          <div className="flex justify-between text-green-600">
            <span className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Promo Applied
            </span>
            <span className="font-semibold">-$10.00</span>
          </div>
        )}
      </div>

      {/* Promo Code */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-charcoal mb-2">
          Promo Code
        </label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter code"
            value={promoCode}
            onChange={(e) => {
              setPromoCode(e.target.value)
              setPromoError('')
            }}
            className={promoError ? 'border-red-500' : ''}
          />
          <Button
            onClick={handleApplyPromo}
            variant="outline"
            className="border-2 whitespace-nowrap"
          >
            Apply
          </Button>
        </div>
        {promoError && (
          <p className="text-sm text-red-600 mt-1">{promoError}</p>
        )}
        {promoApplied && (
          <p className="text-sm text-green-600 mt-1">
            Promo code "SAVE10" applied!
          </p>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-gray-300 pt-4 mb-6">
        <div className="flex justify-between items-baseline">
          <span className="font-serif text-xl font-bold text-charcoal">Total</span>
          <span className="font-serif text-2xl font-bold text-charcoal">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Checkout Button */}
      <Button className="w-full gradient-primary text-white py-6 text-base font-semibold mb-4">
        Proceed to Checkout
      </Button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-secondary">
        <Lock className="w-4 h-4" />
        <span>Secure Checkout</span>
      </div>

      {/* Payment Methods */}
      <div className="mt-4 pt-4 border-t border-gray-300">
        <p className="text-xs text-secondary text-center mb-2">We accept</p>
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <div className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-semibold">
            VISA
          </div>
          <div className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-semibold">
            MASTERCARD
          </div>
          <div className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-semibold">
            AMEX
          </div>
          <div className="px-3 py-1 bg-white rounded border border-gray-200 text-xs font-semibold">
            PAYPAL
          </div>
        </div>
      </div>

      {/* Free Shipping Note */}
      <div className="mt-4 p-3 bg-white rounded-md">
        <p className="text-sm text-secondary text-center">
          🚚 Free shipping on all orders over $100
        </p>
      </div>
    </div>
  )
}
