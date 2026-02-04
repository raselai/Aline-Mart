'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useWishlist } from '@/hooks/useWishlist'
import type { WishlistItem } from '@/store/wishlistStore'

type SortOption = 'newest' | 'oldest' | 'price-low' | 'price-high'

export default function WishlistPage() {
  const {
    items,
    itemCount,
    isEmpty,
    sortedByNewest,
    sortedByOldest,
    sortedByPriceLow,
    sortedByPriceHigh,
    removeFromWishlist,
    clearWishlist,
  } = useWishlist()

  const [sort, setSort] = useState<SortOption>('newest')
  const [clearing, setClearing] = useState(false)

  function getSortedItems(): WishlistItem[] {
    switch (sort) {
      case 'oldest':
        return sortedByOldest
      case 'price-low':
        return sortedByPriceLow
      case 'price-high':
        return sortedByPriceHigh
      default:
        return sortedByNewest
    }
  }

  function handleClearAll() {
    setClearing(true)
    clearWishlist()
    setTimeout(() => setClearing(false), 300)
  }

  const sortedItems = getSortedItems()

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF8',
      }}
    >
      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid #E8E6E3',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            minWidth: '320px',
            margin: '0 auto',
            padding: 'clamp(120px, 15vw, 200px) 24px 32px',
          }}
        >
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 400,
              color: '#2C2C2C',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            My Wishlist
          </h1>
          {!isEmpty && (
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                marginTop: '8px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              {itemCount} item{itemCount !== 1 ? 's' : ''} saved
            </p>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '1200px',
          minWidth: '320px',
          margin: '0 auto',
          padding: '32px 24px 80px',
        }}
      >
        {isEmpty ? (
          /* Empty State */
          <div
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
              padding: '64px 24px',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                margin: '0 auto 20px',
                borderRadius: '50%',
                backgroundColor: '#F5F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 8px',
                whiteSpace: 'nowrap',
              }}
            >
              Your wishlist is empty
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: '0 0 28px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Browse our collection and save your favourite pieces.
            </p>
            <Link
              href="/products"
              style={{
                display: 'inline-block',
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                color: '#FFFFFF',
                borderRadius: '8px',
                padding: '12px 32px',
                fontSize: '0.875rem',
                fontWeight: 600,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Explore Products
            </Link>
          </div>
        ) : (
          <>
            {/* Toolbar: Sort + Clear */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
                marginBottom: '24px',
              }}
            >
              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span
                  style={{
                    fontSize: '0.8rem',
                    color: '#6B7280',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Sort by:
                </span>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  style={{
                    fontSize: '0.8rem',
                    color: '#2C2C2C',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7EB',
                    borderRadius: '6px',
                    padding: '6px 10px',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>

              {/* Clear all */}
              <button
                onClick={handleClearAll}
                disabled={clearing}
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: '#991B1B',
                  backgroundColor: 'transparent',
                  border: '1px solid #FCA5A5',
                  borderRadius: '6px',
                  padding: '6px 14px',
                  cursor: clearing ? 'not-allowed' : 'pointer',
                  opacity: clearing ? 0.5 : 1,
                  transition: 'opacity 200ms ease',
                  whiteSpace: 'nowrap',
                }}
              >
                Clear All
              </button>
            </div>

            {/* Product Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: '20px',
              }}
            >
              {sortedItems.map((item) => {
                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Image */}
                    <Link href={`/products/${item.slug}`}>
                      <div
                        style={{
                          position: 'relative',
                          width: '100%',
                          aspectRatio: '3 / 4',
                          backgroundColor: '#F5F5F5',
                          overflow: 'hidden',
                        }}
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          style={{ objectFit: 'cover' }}
                        />
                        {!item.inStock && (
                          <div
                            style={{
                              position: 'absolute',
                              top: '10px',
                              left: '10px',
                              backgroundColor: '#2C2C2C',
                              color: '#FFFFFF',
                              fontSize: '0.65rem',
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              letterSpacing: '0.05em',
                              padding: '4px 10px',
                              borderRadius: '4px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Out of Stock
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* Details */}
                    <div
                      style={{
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        flex: 1,
                      }}
                    >
                      <p
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          color: '#8e2157',
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          margin: '0 0 4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
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
                            fontSize: '0.9rem',
                            fontWeight: 500,
                            color: '#2C2C2C',
                            margin: '0 0 8px',
                            lineHeight: 1.4,
                            whiteSpace: 'normal',
                            wordBreak: 'normal',
                            overflowWrap: 'normal',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {item.name}
                        </h3>
                      </Link>
                      <p
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#2C2C2C',
                          margin: '0 0 16px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        QAR {item.price.toFixed(2)}
                      </p>

                      {/* Action buttons */}
                      <div
                        style={{
                          marginTop: 'auto',
                          display: 'flex',
                          gap: '8px',
                        }}
                      >
                        {item.inStock ? (
                          <Link
                            href={`/products/${item.slug}`}
                            style={{
                              flex: 1,
                              display: 'block',
                              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 0',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              textAlign: 'center',
                              textDecoration: 'none',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            View Product
                          </Link>
                        ) : (
                          <span
                            style={{
                              flex: 1,
                              textAlign: 'center',
                              backgroundColor: '#F5F5F5',
                              color: '#9CA3AF',
                              borderRadius: '8px',
                              padding: '10px 0',
                              fontSize: '0.8rem',
                              fontWeight: 600,
                              whiteSpace: 'nowrap',
                            }}
                          >
                            Out of Stock
                          </span>
                        )}
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          title="Remove from wishlist"
                          style={{
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#FEE2E2',
                            color: '#991B1B',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            flexShrink: 0,
                            transition: 'opacity 200ms ease',
                          }}
                        >
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
