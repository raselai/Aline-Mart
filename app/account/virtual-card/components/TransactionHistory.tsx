'use client'

import { useState, useEffect } from 'react'
import { ArrowDownCircle, ArrowUpCircle, RotateCcw } from 'lucide-react'
import type { VirtualCardTransactionRecord } from '@/types/virtual-card'

interface TransactionHistoryProps {
  email: string
}

const typeConfig: Record<string, { icon: typeof ArrowDownCircle; color: string; label: string }> = {
  TOPUP: { icon: ArrowDownCircle, color: '#16A34A', label: 'Top-up' },
  SPEND: { icon: ArrowUpCircle, color: '#DC2626', label: 'Purchase' },
  REFUND_CREDIT: { icon: RotateCcw, color: '#2563EB', label: 'Refund' },
}

export default function TransactionHistory({ email }: TransactionHistoryProps) {
  const [transactions, setTransactions] = useState<VirtualCardTransactionRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const limit = 10

  useEffect(() => {
    async function fetchTransactions() {
      setIsLoading(true)
      try {
        const res = await fetch(
          `/api/virtual-card/transactions?email=${encodeURIComponent(email)}&page=${page}&limit=${limit}`
        )
        if (res.ok) {
          const data = await res.json()
          setTransactions(data.transactions || [])
          setTotal(data.total || 0)
        }
      } catch {
        // Silently fail
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [email, page])

  const totalPages = Math.ceil(total / limit)

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#2C2C2C',
          margin: '0 0 20px',
        }}
      >
        Transaction History
      </h2>

      {isLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: '48px',
                backgroundColor: '#F5F5F5',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <p style={{ fontSize: '0.875rem', color: '#6B7280' }}>
          No transactions yet. Top up your card to get started.
        </p>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {transactions.map((tx) => {
              const config = typeConfig[tx.type] || typeConfig.TOPUP
              const Icon = config.icon
              const isCredit = tx.type === 'TOPUP' || tx.type === 'REFUND_CREDIT'

              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    borderRadius: '8px',
                    backgroundColor: '#FAFAFA',
                  }}
                >
                  <Icon size={20} color={config.color} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, color: '#2C2C2C' }}>
                      {config.label}
                    </div>
                    {tx.description && (
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: '#9CA3AF',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {tx.description}
                      </div>
                    )}
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        color: isCredit ? '#16A34A' : '#DC2626',
                      }}
                    >
                      {isCredit ? '+' : '-'}৳{Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                    <div style={{ fontSize: '0.65rem', color: '#9CA3AF' }}>
                      Bal: ৳{Number(tx.balanceAfter).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#9CA3AF', flexShrink: 0, width: '70px', textAlign: 'right' }}>
                    {new Date(tx.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '12px',
                marginTop: '16px',
              }}
            >
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: page === 1 ? '#F3F4F6' : '#FFFFFF',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem',
                  color: page === 1 ? '#9CA3AF' : '#2C2C2C',
                }}
              >
                Previous
              </button>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #E5E7EB',
                  backgroundColor: page === totalPages ? '#F3F4F6' : '#FFFFFF',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem',
                  color: page === totalPages ? '#9CA3AF' : '#2C2C2C',
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
