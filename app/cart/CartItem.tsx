'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Minus, Plus, X } from 'lucide-react'
import { CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
  isLast?: boolean
}

export default function CartItem({ item, isLast }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem, formatPrice } = useCart()

  const handleIncrease = () => {
    increaseQuantity(item.variantId)
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      decreaseQuantity(item.variantId)
    }
  }

  const handleRemove = () => {
    removeItem(item.variantId)
  }

  const itemTotal = item.price * item.quantity

  return (
    <div
      style={{
        borderBottom: isLast ? 'none' : '1px solid #E8E6E3',
        padding: '24px 0',
        transition: 'background-color 200ms',
      }}
    >
      {/* Desktop layout */}
      <div
        className="hidden lg:grid"
        style={{
          gridTemplateColumns: '1fr 140px 140px 100px',
          gap: '16px',
          alignItems: 'center',
        }}
      >
        {/* Product info */}
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          {/* Image */}
          <Link
            href={`/products/${item.slug}`}
            style={{
              flexShrink: 0,
              display: 'block',
              width: '100px',
              height: '120px',
              overflow: 'hidden',
              backgroundColor: '#F5F5F5',
            }}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name || 'Product image'}
                width={100}
                height={120}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 400ms ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  fontSize: '12px',
                }}
              >
                No image
              </div>
            )}
          </Link>

          {/* Details */}
          <div style={{ minWidth: 0 }}>
            <p
              style={{
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                color: '#8e2157',
                marginBottom: '4px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              {item.brand}
            </p>
            <Link
              href={`/products/${item.slug}`}
              style={{ textDecoration: 'none' }}
            >
              <h3
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2C2C2C',
                  lineHeight: 1.4,
                  transition: 'color 200ms',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  margin: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#8e2157')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#2C2C2C')}
              >
                {item.name}
              </h3>
            </Link>
            {(item.color || item.size) && (
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginTop: '6px',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                }}
              >
                {[item.color, item.size].filter(Boolean).join(' / ')}
              </p>
            )}
          </div>
        </div>

        {/* Quantity controls */}
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid #E8E6E3',
            }}
          >
            <button
              onClick={handleDecrease}
              disabled={item.quantity <= 1}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                opacity: item.quantity <= 1 ? 0.3 : 1,
                transition: 'background-color 200ms',
                color: '#2C2C2C',
              }}
              onMouseEnter={(e) => {
                if (item.quantity > 1) e.currentTarget.style.backgroundColor = '#F5F5F5'
              }}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Decrease quantity"
            >
              <Minus style={{ width: '14px', height: '14px' }} />
            </button>
            <span
              style={{
                width: '44px',
                textAlign: 'center',
                fontSize: '14px',
                fontWeight: 500,
                color: '#2C2C2C',
                borderLeft: '1px solid #E8E6E3',
                borderRight: '1px solid #E8E6E3',
                lineHeight: '40px',
              }}
            >
              {item.quantity}
            </span>
            <button
              onClick={handleIncrease}
              style={{
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 200ms',
                color: '#2C2C2C',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              aria-label="Increase quantity"
            >
              <Plus style={{ width: '14px', height: '14px' }} />
            </button>
          </div>
        </div>

        {/* Price */}
        <div style={{ textAlign: 'right' }}>
          <p
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#2C2C2C',
              margin: 0,
            }}
          >
            {formatPrice(itemTotal)}
          </p>
          {item.quantity > 1 && (
            <p
              style={{
                fontSize: '12px',
                color: '#9CA3AF',
                marginTop: '4px',
              }}
            >
              {formatPrice(item.price)} each
            </p>
          )}
        </div>

        {/* Remove */}
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={handleRemove}
            style={{
              width: '44px',
              height: '44px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9CA3AF',
              transition: 'all 200ms',
              borderRadius: '50%',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#DC2626'
              e.currentTarget.style.backgroundColor = '#FEF2F2'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#9CA3AF'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            aria-label="Remove item"
          >
            <X style={{ width: '18px', height: '18px' }} />
          </button>
        </div>
      </div>

      {/* Mobile layout */}
      <div className="lg:hidden">
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Image */}
          <Link
            href={`/products/${item.slug}`}
            style={{
              flexShrink: 0,
              display: 'block',
              width: '90px',
              height: '110px',
              overflow: 'hidden',
              backgroundColor: '#F5F5F5',
            }}
          >
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name || 'Product image'}
                width={90}
                height={110}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#D1D5DB',
                  fontSize: '11px',
                }}
              >
                No image
              </div>
            )}
          </Link>

          {/* Details */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
              <div style={{ minWidth: 0 }}>
                <p
                  style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '1.5px',
                    textTransform: 'uppercase',
                    color: '#8e2157',
                    marginBottom: '2px',
                  }}
                >
                  {item.brand}
                </p>
                <Link href={`/products/${item.slug}`} style={{ textDecoration: 'none' }}>
                  <h3
                    style={{
                      fontSize: '14px',
                      fontWeight: 500,
                      color: '#2C2C2C',
                      lineHeight: 1.3,
                      margin: 0,
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {item.name}
                  </h3>
                </Link>
              </div>
              <button
                onClick={handleRemove}
                style={{
                  flexShrink: 0,
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9CA3AF',
                  marginTop: '-8px',
                  marginRight: '-8px',
                }}
                aria-label="Remove item"
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            {(item.color || item.size) && (
              <p
                style={{
                  fontSize: '12px',
                  color: '#6B7280',
                  marginTop: '4px',
                }}
              >
                {[item.color, item.size].filter(Boolean).join(' / ')}
              </p>
            )}

            {/* Quantity + Price row */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '12px',
              }}
            >
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  border: '1px solid #E8E6E3',
                }}
              >
                <button
                  onClick={handleDecrease}
                  disabled={item.quantity <= 1}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                    opacity: item.quantity <= 1 ? 0.3 : 1,
                    color: '#2C2C2C',
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus style={{ width: '14px', height: '14px' }} />
                </button>
                <span
                  style={{
                    width: '36px',
                    textAlign: 'center',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#2C2C2C',
                    borderLeft: '1px solid #E8E6E3',
                    borderRight: '1px solid #E8E6E3',
                    lineHeight: '36px',
                  }}
                >
                  {item.quantity}
                </span>
                <button
                  onClick={handleIncrease}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#2C2C2C',
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus style={{ width: '14px', height: '14px' }} />
                </button>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#2C2C2C',
                    margin: 0,
                  }}
                >
                  {formatPrice(itemTotal)}
                </p>
                {item.quantity > 1 && (
                  <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '2px' }}>
                    {formatPrice(item.price)} each
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
