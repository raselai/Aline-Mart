'use client'

import { useState, useEffect, useMemo } from 'react'
import { useCart } from '@/hooks/useCart'
import Image from 'next/image'
import { formatPrice } from '@/lib/order-utils'
import type { CardTypeConfig, SignatureCard } from '@/types/signature-card'

interface OrderSummaryProps {
  signatureCardConfig?: CardTypeConfig | null
  signatureCard?: SignatureCard | null
  shippingData?: {
    pathaoCityId?: number
    pathaoZoneId?: number
  }
}

export default function OrderSummary({
  signatureCardConfig = null,
  signatureCard = null,
  shippingData,
}: OrderSummaryProps) {
  const { items, subtotal } = useCart()
  const [shippingCost, setShippingCost] = useState<number | null>(null)
  const [shippingMessage, setShippingMessage] = useState<string | null>(null)

  const pathaoCityId = shippingData?.pathaoCityId
  const pathaoZoneId = shippingData?.pathaoZoneId

  useEffect(() => {
    if (items.length === 0) return

    if (!pathaoCityId || !pathaoZoneId) {
      setShippingCost(null)
      setShippingMessage('Select delivery area')
      return
    }

    setShippingMessage(null)

    const controller = new AbortController()

    async function fetchShipping() {
      try {
        const res = await fetch('/api/shipping/calculate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
            })),
            pathaoCityId,
            pathaoZoneId,
          }),
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setShippingCost(data.shippingCost)
          if (data.shippingCost === null && data.message) {
            setShippingMessage(data.message)
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to fetch shipping cost:', err)
        }
      }
    }

    fetchShipping()
    return () => controller.abort()
  }, [items, pathaoCityId, pathaoZoneId])

  // Calculate signature card discounts (client-side preview)
  const discountPreview = useMemo(() => {
    if (!signatureCardConfig) return null

    // We don't have brandId info on client side, so show general discount rates
    // Server will do the actual per-item calculation
    const alineRate = signatureCardConfig.alineFashionDiscount
    const otherRate = signatureCardConfig.otherBrandsDiscount

    // For display, show a rough estimate assuming all items are "other brands"
    // (Server calculates exact amounts per item's actual brand)
    const estimatedDiscount = subtotal * (otherRate / 100)

    return {
      alineRate,
      otherRate,
      estimatedDiscount,
      freeDelivery: signatureCardConfig.freeDelivery,
    }
  }, [signatureCardConfig, subtotal])

  // Check birthday/anniversary bonus
  const hasBirthdayBonus = useMemo(() => {
    if (!signatureCard?.dateOfBirth && !signatureCard?.weddingAnniversary) return false
    const today = new Date()
    const todayMonth = today.getMonth() + 1
    const todayDay = today.getDate()

    if (signatureCard.dateOfBirth) {
      const dob = new Date(signatureCard.dateOfBirth)
      if (dob.getMonth() + 1 === todayMonth && dob.getDate() === todayDay) return true
    }
    if (signatureCard.weddingAnniversary) {
      const ann = new Date(signatureCard.weddingAnniversary)
      if (ann.getMonth() + 1 === todayMonth && ann.getDate() === todayDay) return true
    }
    return false
  }, [signatureCard])

  const effectiveShipping = discountPreview?.freeDelivery ? 0 : (shippingCost ?? 0)
  const totalDiscountEstimate = discountPreview ? discountPreview.estimatedDiscount + (hasBirthdayBonus ? subtotal * 0.1 : 0) : 0
  const total = subtotal - totalDiscountEstimate + effectiveShipping

  return (
    <div className="border border-gray-200 rounded-lg p-6 bg-white sticky top-4">
      <h2 className="text-xl font-bold mb-6">Order Summary</h2>

      {/* Cart Items */}
      <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto">
        {items.map((item) => (
          <div key={`${item.variantId}`} className="flex gap-4">
            <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No image
                </div>
              )}
              <div className="absolute top-1 right-1 bg-burgundy text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {item.quantity}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-gray-900 truncate">
                {item.name}
              </h3>
              <p className="text-xs text-gray-500 truncate">{item.brand}</p>
              <p className="text-xs text-gray-500">{item.color && item.size ? `${item.color} / ${item.size}` : item.color || item.size || 'Standard'}</p>
              <p className="text-sm font-semibold text-burgundy mt-1">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formatPrice(subtotal)}</span>
        </div>

        {/* Signature Card Discounts */}
        {discountPreview && (
          <>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                Aline Fashion Discount ({discountPreview.alineRate}%)
              </span>
              <span className="font-medium text-green-600">Applied at checkout</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-600">
                Other Items Discount ({discountPreview.otherRate}%)
              </span>
              <span className="font-medium text-green-600">
                ~-{formatPrice(discountPreview.estimatedDiscount)}
              </span>
            </div>
            {hasBirthdayBonus && (
              <div className="flex justify-between text-sm">
                <span className="text-amber-600 font-medium">
                  Birthday/Anniversary Bonus (10%)
                </span>
                <span className="font-medium text-amber-600">
                  ~-{formatPrice(subtotal * 0.1)}
                </span>
              </div>
            )}
            {discountPreview.freeDelivery && (
              <div className="flex justify-between text-sm">
                <span className="text-green-600 font-medium">Free Delivery (Crown Privilege)</span>
                <span className="font-medium text-green-600">৳0</span>
              </div>
            )}
          </>
        )}

        {/* Shipping */}
        {!(discountPreview?.freeDelivery) && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            {shippingCost !== null ? (
              <span className="font-medium">{formatPrice(shippingCost)}</span>
            ) : (
              <span className="text-gray-400 text-xs">{shippingMessage || 'Calculating...'}</span>
            )}
          </div>
        )}

        {/* Total */}
        <div className="flex justify-between text-lg font-bold pt-3 border-t border-gray-200">
          <span>Total</span>
          <span className="text-burgundy">
            {discountPreview ? `~${formatPrice(total)}` : formatPrice(subtotal + effectiveShipping)}
          </span>
        </div>

        {discountPreview && (
          <p className="text-[10px] text-gray-400">
            Exact discounts calculated server-side based on each item&apos;s brand.
          </p>
        )}

        {/* Security Badge */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
          <div className="flex items-center gap-2">
            <svg
              className="h-5 w-5 text-green-600"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <div>
              <p className="text-xs font-semibold text-green-900">Secure Checkout</p>
              <p className="text-xs text-green-700">Your data is protected</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
