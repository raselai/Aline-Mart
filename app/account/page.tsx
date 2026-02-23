'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useWishlistStore } from '@/store/wishlistStore'
import { useVirtualCard } from '@/hooks/useVirtualCard'

interface OrderSummary {
  id: string
  orderNumber: string
  total: number
  status: string
  createdAt: string
}

export default function AccountPage() {
  const { userName, userEmail, signOut } = useAuth()
  const wishlistCount = useWishlistStore((s) => s.itemCount)
  const { card, isLoading: cardLoading, fetchCard, formattedBalance, tierLevel } = useVirtualCard()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderSummary[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [addressCount, setAddressCount] = useState(0)
  const [loadingOrders, setLoadingOrders] = useState(true)
  const [signingOut, setSigningOut] = useState(false)

  useEffect(() => {
    if (!userEmail) return

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(userEmail!)}`)
        if (res.ok) {
          const data = await res.json()
          const allOrders = data.orders || []
          setOrderCount(allOrders.length)
          setOrders(allOrders.slice(0, 3))
        }
      } catch {
        // Silently fail — orders just won't show
      } finally {
        setLoadingOrders(false)
      }
    }

    async function fetchAddressCount() {
      try {
        const res = await fetch(`/api/addresses?email=${encodeURIComponent(userEmail!)}`)
        if (res.ok) {
          const data = await res.json()
          setAddressCount((data.addresses || []).length)
        }
      } catch {
        // Silently fail
      }
    }

    fetchOrders()
    fetchAddressCount()
    if (userEmail) fetchCard(userEmail)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
    router.replace('/')
  }

  const displayName = userName || 'there'

  return (
    <div
      style={{
        maxWidth: '960px',
        minWidth: '320px',
        margin: '0 auto',
        padding: '120px 16px 80px',
        paddingTop: 'clamp(120px, 15vw, 200px)',
      }}
    >
      {/* Welcome Header */}
      <div style={{ marginBottom: '40px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2C2C2C',
            whiteSpace: 'nowrap',
            margin: 0,
          }}
        >
          Hello, {displayName}
        </h1>
        {userEmail && (
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              marginTop: '4px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            {userEmail}
          </p>
        )}
      </div>

      {/* Quick Stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '16px',
          marginBottom: '40px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#8e2157',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {loadingOrders ? '—' : orderCount}
          </p>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '4px',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Orders
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: '2rem',
              fontWeight: 700,
              color: '#8e2157',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
          >
            {wishlistCount}
          </p>
          <p
            style={{
              fontSize: '0.75rem',
              color: '#6B7280',
              marginTop: '4px',
              whiteSpace: 'nowrap',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Wishlist
          </p>
        </div>
      </div>

      {/* Section Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          marginBottom: '48px',
        }}
      >
        {/* My Orders Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              My Orders
            </h2>
            {loadingOrders ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      height: '20px',
                      backgroundColor: '#F5F5F5',
                      borderRadius: '4px',
                    }}
                  />
                ))}
              </div>
            ) : orders.length === 0 ? (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                No orders yet. Start shopping to see your orders here.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {orders.map((order) => (
                  <div
                    key={order.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span
                      style={{
                        color: '#2C2C2C',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      #{order.orderNumber}
                    </span>
                    <span
                      style={{
                        color: '#6B7280',
                        whiteSpace: 'nowrap',
                        fontSize: '0.8rem',
                      }}
                    >
                      QAR {Number(order.total).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <div style={{ marginTop: '20px' }}>
              <Link
                href="/account/orders"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8e2157',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                View All Orders &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              Profile
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#2C2C2C',
                  margin: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {userName || 'No name set'}
              </p>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#6B7280',
                  margin: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'break-all',
                  overflowWrap: 'anywhere',
                }}
              >
                {userEmail}
              </p>
            </div>
            <div style={{ marginTop: '20px' }}>
              <Link
                href="/account/profile"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8e2157',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Edit Profile &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Wishlist Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              Wishlist
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              {wishlistCount === 0
                ? 'Your wishlist is empty.'
                : `${wishlistCount} item${wishlistCount !== 1 ? 's' : ''} saved.`}
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link
                href="/wishlist"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8e2157',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                View Wishlist &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Addresses Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              Addresses
            </h2>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                margin: 0,
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              {addressCount === 0
                ? 'No addresses saved yet.'
                : `${addressCount} saved address${addressCount !== 1 ? 'es' : ''}.`}
            </p>
            <div style={{ marginTop: '20px' }}>
              <Link
                href="/account/addresses"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8e2157',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Manage Addresses &rarr;
              </Link>
            </div>
          </div>
        </div>

        {/* Virtual Card */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ padding: '24px' }}>
            <h2
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#2C2C2C',
                margin: '0 0 16px',
                whiteSpace: 'nowrap',
              }}
            >
              Virtual Card
            </h2>
            {cardLoading ? (
              <div
                style={{
                  height: '20px',
                  backgroundColor: '#F5F5F5',
                  borderRadius: '4px',
                }}
              />
            ) : card ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <p
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    color: '#8e2157',
                    margin: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {formattedBalance}
                </p>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: '#6B7280',
                    margin: 0,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {tierLevel} Tier
                </p>
              </div>
            ) : (
              <p
                style={{
                  fontSize: '0.875rem',
                  color: '#6B7280',
                  margin: 0,
                }}
              >
                Get your virtual card for exclusive discounts.
              </p>
            )}
            <div style={{ marginTop: '20px' }}>
              <Link
                href="/account/virtual-card"
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#8e2157',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {card ? 'Manage Card' : 'Get Your Card'} &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Out Button */}
      <div style={{ textAlign: 'center' }}>
        <button
          onClick={handleSignOut}
          disabled={signingOut}
          style={{
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 32px',
            fontSize: '0.875rem',
            fontWeight: 600,
            cursor: signingOut ? 'not-allowed' : 'pointer',
            opacity: signingOut ? 0.7 : 1,
            transition: 'opacity 200ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          {signingOut ? 'Signing out...' : 'Sign Out'}
        </button>
      </div>
    </div>
  )
}
