'use client'

import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { ShoppingBag, ArrowLeft, Trash2 } from 'lucide-react'
import CartItem from './CartItem'
import CartSummary from './CartSummary'

export default function CartClient() {
  const { items, isEmpty, itemCount, clearCart } = useCart()

  // Empty cart state
  if (isEmpty) {
    return (
      <div
        style={{
          maxWidth: '1400px',
          minWidth: '320px',
          margin: '0 auto',
          padding: '80px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '480px',
            margin: '0 auto',
            textAlign: 'center',
          }}
        >
          {/* Icon */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '88px',
              height: '88px',
              borderRadius: '50%',
              border: '2px solid #E8E6E3',
              marginBottom: '32px',
            }}
          >
            <ShoppingBag
              style={{ width: '36px', height: '36px', color: '#8e2157' }}
              strokeWidth={1.5}
            />
          </div>

          {/* Title */}
          <h2
            className="font-serif"
            style={{
              fontSize: '32px',
              fontWeight: 400,
              color: '#2C2C2C',
              marginBottom: '16px',
              letterSpacing: '-0.3px',
            }}
          >
            Your Cart is Empty
          </h2>

          {/* Description */}
          <p
            style={{
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              color: '#6B7280',
              fontSize: '16px',
              lineHeight: 1.6,
              marginBottom: '40px',
              minWidth: '100%',
            }}
          >
            Discover our curated selection of luxury pieces from the world&apos;s most prestigious brands.
          </p>

          {/* CTA */}
          <Link
            href="/products"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '16px 40px',
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '1px',
              textTransform: 'uppercase',
              transition: 'all 300ms ease',
              borderRadius: '0',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #a02865 0%, #6d0a3c 100%)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <ArrowLeft style={{ width: '16px', height: '16px' }} />
            Explore Collection
          </Link>
        </div>
      </div>
    )
  }

  const handleClearCart = () => {
    if (window.confirm('Remove all items from your cart?')) {
      clearCart()
    }
  }

  return (
    <div
      style={{
        maxWidth: '1400px',
        minWidth: '320px',
        margin: '0 auto',
        padding: '40px 24px 80px',
      }}
    >
      {/* Top actions bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '32px',
          paddingBottom: '16px',
          borderBottom: '1px solid #E8E6E3',
        }}
      >
        <Link
          href="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#6B7280',
            textDecoration: 'none',
            fontSize: '13px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            transition: 'color 200ms',
            minHeight: '44px',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#8e2157')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Continue Shopping
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span
            style={{
              fontSize: '13px',
              color: '#6B7280',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
          </span>
          <button
            onClick={handleClearCart}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              color: '#6B7280',
              fontSize: '13px',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms',
              minHeight: '44px',
              padding: '0 4px',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#DC2626')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            <Trash2 style={{ width: '14px', height: '14px' }} />
            Clear All
          </button>
        </div>
      </div>

      {/* Main grid: Cart items + Summary */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '48px',
        }}
        className="lg:!grid-cols-[1fr_380px]"
      >
        {/* Cart Items */}
        <div>
          {/* Column headers (desktop) */}
          <div
            className="hidden lg:grid"
            style={{
              gridTemplateColumns: '1fr 140px 140px 100px',
              gap: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid #E8E6E3',
              marginBottom: '0',
            }}
          >
            {['Product', 'Quantity', 'Price', ''].map((label) => (
              <span
                key={label}
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  textAlign: label === 'Price' ? 'right' : 'left',
                }}
              >
                {label}
              </span>
            ))}
          </div>

          {/* Items list */}
          <div>
            {items.map((item, index) => (
              <CartItem
                key={`${item.productId}-${item.variantId}`}
                item={item}
                isLast={index === items.length - 1}
              />
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div>
          <div
            className="lg:sticky"
            style={{ top: '32px' }}
          >
            <CartSummary />
          </div>
        </div>
      </div>

      {/* Mobile continue shopping */}
      <div className="lg:hidden" style={{ marginTop: '32px' }}>
        <Link
          href="/products"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '16px',
            border: '1px solid #E8E6E3',
            color: '#2C2C2C',
            textDecoration: 'none',
            fontSize: '13px',
            fontWeight: 500,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            transition: 'all 200ms',
            backgroundColor: '#FFFFFF',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Continue Shopping
        </Link>
      </div>
    </div>
  )
}
