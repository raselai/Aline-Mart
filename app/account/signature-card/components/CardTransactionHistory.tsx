'use client'

import { useState, useEffect } from 'react'
import type { CardTransactionRecord } from '@/types/signature-card'

const TYPE_STYLES: Record<string, { color: string; bg: string; label: string }> = {
  PURCHASE: { color: '#15803D', bg: '#F0FDF4', label: 'Purchase' },
  SPEND: { color: '#B91C1C', bg: '#FEF2F2', label: 'Spend' },
  DISCOUNT_USED: { color: '#1D4ED8', bg: '#EFF6FF', label: 'Discount' },
  REFUND_CREDIT: { color: '#C2410C', bg: '#FFF7ED', label: 'Refund' },
}

interface CardTransactionHistoryProps {
  cardId: string
}

export default function CardTransactionHistory({ cardId }: CardTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<CardTransactionRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const limit = 10

  useEffect(() => {
    setLoading(true)
    fetch(`/api/signature-card/transactions?cardId=${cardId}&page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        setTransactions(data.transactions || [])
        setTotal(data.total || 0)
      })
      .catch(() => setTransactions([]))
      .finally(() => setLoading(false))
  }, [cardId, page])

  const totalPages = Math.ceil(total / limit)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 rounded-lg animate-pulse" style={{ backgroundColor: '#F3F4F6' }} />
        ))}
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <p
        className="text-sm text-center py-8"
        style={{
          color: '#9CA3AF',
          whiteSpace: 'normal',
          wordBreak: 'normal',
          overflowWrap: 'normal',
        }}
      >
        No transactions yet
      </p>
    )
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx) => {
        const style = TYPE_STYLES[tx.type] || TYPE_STYLES.SPEND
        const isCredit = tx.type === 'PURCHASE' || tx.type === 'REFUND_CREDIT'

        return (
          <div
            key={tx.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className="text-xs font-semibold px-2 py-1 rounded"
                style={{
                  color: style.color,
                  backgroundColor: style.bg,
                  whiteSpace: 'nowrap',
                }}
              >
                {style.label}
              </span>
              <div>
                <p
                  className="text-sm"
                  style={{
                    color: '#374151',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                >
                  {tx.description || style.label}
                </p>
                <p className="text-xs" style={{ color: '#9CA3AF' }}>
                  {new Date(tx.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-semibold"
                style={{ color: isCredit ? '#16A34A' : '#DC2626', whiteSpace: 'nowrap' }}
              >
                {isCredit ? '+' : '-'}৳{Number(tx.amount).toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}>
                Bal: ৳{Number(tx.balanceAfter).toLocaleString()}
              </p>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="text-sm font-medium disabled:cursor-not-allowed"
            style={{ color: page === 1 ? '#D1D5DB' : '#8e2157' }}
          >
            ← Previous
          </button>
          <span className="text-xs" style={{ color: '#9CA3AF' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="text-sm font-medium disabled:cursor-not-allowed"
            style={{ color: page === totalPages ? '#D1D5DB' : '#8e2157' }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}
