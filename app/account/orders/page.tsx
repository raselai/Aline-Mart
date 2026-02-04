'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'

interface Order {
  id: string
  orderNumber: string
  total: number
  status: string
  paymentMethod: string
  createdAt: string
}

const statusColors: Record<string, { bg: string; text: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E' },
  processing: { bg: '#DBEAFE', text: '#1E40AF' },
  confirmed: { bg: '#D1FAE5', text: '#065F46' },
  shipped: { bg: '#E0E7FF', text: '#3730A3' },
  delivered: { bg: '#D1FAE5', text: '#065F46' },
  cancelled: { bg: '#FEE2E2', text: '#991B1B' },
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export default function OrdersPage() {
  const { userEmail } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userEmail) return

    async function fetchOrders() {
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(userEmail!)}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data.orders || [])
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [userEmail])

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
      {/* Back link */}
      <Link
        href="/account"
        style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '24px',
          whiteSpace: 'nowrap',
        }}
      >
        &larr; Back to Account
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#2C2C2C',
          margin: '0 0 32px',
          whiteSpace: 'nowrap',
        }}
      >
        My Orders
      </h1>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '72px',
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '48px 24px',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: '#6B7280',
              marginBottom: '20px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/products"
            style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '0.875rem',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {orders.map((order) => {
            const colors = statusColors[order.status] || statusColors.pending
            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                  padding: '20px 24px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  {/* Order number and date */}
                  <div style={{ minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        color: '#2C2C2C',
                        margin: 0,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      #{order.orderNumber}
                    </p>
                    <p
                      style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        margin: '2px 0 0',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Status + Total */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        backgroundColor: colors.bg,
                        color: colors.text,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {order.status}
                    </span>
                    <span
                      style={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#2C2C2C',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      QAR {Number(order.total).toFixed(2)}
                    </span>
                    <Link
                      href={`/orders/${order.orderNumber}`}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: '#8e2157',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
