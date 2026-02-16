'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Lock, Tag, ChevronRight, Shield, Truck } from 'lucide-react'

export default function CartSummary() {
  const {
    items,
    itemCount,
    formattedSubtotal,
    formattedTax,
    formattedTotal,
    formatPrice,
  } = useCart()

  const [shippingCost, setShippingCost] = useState<number | null>(null)

  useEffect(() => {
    if (items.length === 0) {
      setShippingCost(null)
      return
    }

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
          }),
          signal: controller.signal,
        })
        if (res.ok) {
          const data = await res.json()
          setShippingCost(data.shippingCost)
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Failed to fetch shipping cost:', err)
        }
      }
    }

    fetchShipping()
    return () => controller.abort()
  }, [items])

  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)
  const [promoError, setPromoError] = useState('')
  const [promoFocused, setPromoFocused] = useState(false)

  const formattedShipping = shippingCost !== null ? formatPrice(shippingCost) : null

  const handleApplyPromo = () => {
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
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E8E6E3',
        overflow: 'hidden',
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
        }}
      />

      <div style={{ padding: '32px 28px' }}>
        {/* Title */}
        <h2
          className="font-serif"
          style={{
            fontSize: '22px',
            fontWeight: 400,
            color: '#2C2C2C',
            letterSpacing: '-0.3px',
            margin: 0,
            marginBottom: '28px',
            whiteSpace: 'normal',
            wordBreak: 'normal',
          }}
        >
          Order Summary
        </h2>

        {/* Price Breakdown */}
        <div style={{ marginBottom: '24px' }}>
          {/* Subtotal */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '10px 0',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'items'})
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#2C2C2C',
              }}
            >
              {formattedSubtotal}
            </span>
          </div>

          {/* Shipping */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '10px 0',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              Shipping
            </span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#15803d',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
              }}
            >
              {shippingCost === null ? 'Calculating...' : formattedShipping}
            </span>
          </div>

          {/* Tax */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '10px 0',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              Estimated Tax
            </span>
            <span
              style={{
                fontSize: '14px',
                fontWeight: 500,
                color: '#2C2C2C',
              }}
            >
              {formattedTax}
            </span>
          </div>

          {/* Promo discount */}
          {promoApplied && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px 0',
              }}
            >
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '14px',
                  color: '#15803d',
                }}
              >
                <Tag style={{ width: '14px', height: '14px' }} />
                Promo Applied
              </span>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  color: '#15803d',
                }}
              >
                -৳10.00
              </span>
            </div>
          )}
        </div>

        {/* Promo Code */}
        <div
          style={{
            marginBottom: '24px',
            paddingBottom: '24px',
            borderBottom: '1px solid #E8E6E3',
          }}
        >
          <label
            style={{
              display: 'block',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              marginBottom: '10px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
            }}
          >
            Promo Code
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="Enter code"
              value={promoCode}
              onChange={(e) => {
                setPromoCode(e.target.value)
                setPromoError('')
              }}
              onFocus={() => setPromoFocused(true)}
              onBlur={() => setPromoFocused(false)}
              style={{
                flex: 1,
                padding: '12px 14px',
                fontSize: '14px',
                color: '#2C2C2C',
                backgroundColor: '#FAFAF8',
                border: promoError
                  ? '1px solid #DC2626'
                  : promoFocused
                    ? '1px solid #8e2157'
                    : '1px solid #E8E6E3',
                outline: 'none',
                transition: 'border-color 200ms',
                letterSpacing: '0.5px',
              }}
            />
            <button
              onClick={handleApplyPromo}
              style={{
                padding: '12px 20px',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '1px',
                textTransform: 'uppercase',
                color: '#2C2C2C',
                backgroundColor: 'transparent',
                border: '1px solid #2C2C2C',
                cursor: 'pointer',
                transition: 'all 200ms',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#2C2C2C'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#2C2C2C'
              }}
            >
              Apply
            </button>
          </div>
          {promoError && (
            <p
              style={{
                fontSize: '13px',
                color: '#DC2626',
                marginTop: '8px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              {promoError}
            </p>
          )}
          {promoApplied && (
            <p
              style={{
                fontSize: '13px',
                color: '#15803d',
                marginTop: '8px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              Promo code &ldquo;SAVE10&rdquo; applied successfully
            </p>
          )}
        </div>

        {/* Total */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '28px',
          }}
        >
          <span
            className="font-serif"
            style={{
              fontSize: '16px',
              fontWeight: 400,
              color: '#2C2C2C',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            Total
          </span>
          <span
            className="font-serif"
            style={{
              fontSize: '26px',
              fontWeight: 400,
              color: '#2C2C2C',
              letterSpacing: '-0.5px',
            }}
          >
            {formattedTotal}
          </span>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            padding: '18px 24px',
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
            color: '#FFFFFF',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 600,
            letterSpacing: '2px',
            textTransform: 'uppercase',
            transition: 'all 300ms ease',
            border: 'none',
            cursor: 'pointer',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #a02865 0%, #6d0a3c 100%)'
            e.currentTarget.style.transform = 'translateY(-1px)'
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(92, 9, 49, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          Proceed to Checkout
          <ChevronRight style={{ width: '16px', height: '16px' }} />
        </Link>

        {/* Security & Shipping badges */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #E8E6E3',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#9CA3AF',
              whiteSpace: 'nowrap',
            }}
          >
            <Lock style={{ width: '13px', height: '13px' }} />
            Secure Checkout
          </div>
          <div
            style={{
              width: '1px',
              height: '14px',
              backgroundColor: '#E8E6E3',
            }}
          />
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              color: '#9CA3AF',
              whiteSpace: 'nowrap',
            }}
          >
            <Shield style={{ width: '13px', height: '13px' }} />
            Buyer Protection
          </div>
        </div>

        {/* Payment Methods */}
        <div
          style={{
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #E8E6E3',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              color: '#9CA3AF',
              textAlign: 'center',
              marginBottom: '12px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
            }}
          >
            We accept
          </p>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              flexWrap: 'wrap',
            }}
          >
            {['Visa', 'Mastercard', 'Amex', 'PayPal'].map((method) => (
              <div
                key={method}
                style={{
                  padding: '6px 14px',
                  backgroundColor: '#FAFAF8',
                  border: '1px solid #E8E6E3',
                  fontSize: '11px',
                  fontWeight: 500,
                  color: '#6B7280',
                  letterSpacing: '0.5px',
                }}
              >
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* Free Shipping Note */}
        <div
          style={{
            marginTop: '20px',
            padding: '14px 16px',
            backgroundColor: '#FAFAF8',
            border: '1px solid #E8E6E3',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <Truck style={{ width: '15px', height: '15px', color: '#8e2157', flexShrink: 0 }} />
          <p
            style={{
              fontSize: '13px',
              color: '#6B7280',
              margin: 0,
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            Shipping calculated by weight at checkout
          </p>
        </div>
      </div>
    </div>
  )
}
