'use client'

import { useState, useEffect } from 'react'
import { X, ArrowUp, ArrowDown, Minus, ChevronLeft, ChevronRight, Clock, ExternalLink } from 'lucide-react'
import type { InventoryLog, InventoryVariant, ChangeType } from '@/types/inventory'
import { CHANGE_TYPE_LABELS, CHANGE_TYPE_COLORS } from '@/types/inventory'
import Link from 'next/link'

interface InventoryHistoryModalProps {
  variant: InventoryVariant | null
  isOpen: boolean
  onClose: () => void
}

export default function InventoryHistoryModal({
  variant,
  isOpen,
  onClose
}: InventoryHistoryModalProps) {
  const [logs, setLogs] = useState<InventoryLog[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const limit = 10

  useEffect(() => {
    if (isOpen && variant) {
      fetchHistory()
    }
  }, [isOpen, variant, page])

  const fetchHistory = async () => {
    if (!variant) return

    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      const response = await fetch(`/api/admin/inventory/${variant.id}/history?${params}`)
      if (!response.ok) throw new Error('Failed to fetch history')

      const data = await response.json()
      setLogs(data.logs || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching history:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !variant) return null

  const totalPages = Math.ceil(total / limit)

  const getChangeIcon = (amount: number) => {
    if (amount > 0) return <ArrowUp className="w-4 h-4 text-green-600" />
    if (amount < 0) return <ArrowDown className="w-4 h-4 text-red-600" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getVariantName = () => {
    const parts: string[] = []
    if (variant.color) parts.push(variant.color)
    if (variant.size) parts.push(variant.size)
    return parts.length > 0 ? parts.join(' / ') : 'Default'
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="text-lg font-serif font-bold" style={{ color: '#2C2C2C' }}>
              Stock History
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {variant.product.name} - {getVariantName()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {loading ? (
            <div className="py-12 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
              <p className="mt-4 text-sm" style={{ color: '#6B7280' }}>Loading history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="py-12 text-center">
              <Clock className="w-12 h-12 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
              <p style={{ color: '#6B7280' }}>No stock changes recorded</p>
              <p className="text-sm mt-2" style={{ color: '#9CA3AF' }}>
                Stock adjustments will appear here
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => {
                const colors = CHANGE_TYPE_COLORS[log.changeType as ChangeType] || CHANGE_TYPE_COLORS.MANUAL_ADJUSTMENT

                return (
                  <div
                    key={log.id}
                    className="border rounded-lg p-4"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          {getChangeIcon(log.changeAmount)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${colors.bg} ${colors.text}`}>
                              {CHANGE_TYPE_LABELS[log.changeType as ChangeType] || log.changeType}
                            </span>
                            {log.orderId && (
                              <Link
                                href={`/admin/orders?id=${log.orderId}`}
                                className="flex items-center gap-1 text-xs hover:underline"
                                style={{ color: '#8e2157' }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                View Order <ExternalLink className="w-3 h-3" />
                              </Link>
                            )}
                          </div>
                          <p className="mt-1 text-sm" style={{ color: '#2C2C2C' }}>
                            Stock changed from{' '}
                            <span className="font-medium">{log.previousStock}</span>
                            {' '}to{' '}
                            <span className="font-medium">{log.newStock}</span>
                            {' '}
                            <span style={{ color: log.changeAmount > 0 ? '#059669' : '#DC2626' }}>
                              ({log.changeAmount > 0 ? '+' : ''}{log.changeAmount})
                            </span>
                          </p>
                          {log.reason && (
                            <p className="mt-1 text-sm" style={{ color: '#6B7280' }}>
                              {log.reason}
                            </p>
                          )}
                          {log.admin && (
                            <p className="mt-1 text-xs" style={{ color: '#9CA3AF' }}>
                              By: {log.admin.name || log.admin.email}
                            </p>
                          )}
                        </div>
                      </div>
                      <p className="text-xs whitespace-nowrap flex-shrink-0" style={{ color: '#9CA3AF' }}>
                        {formatDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && logs.length > 0 && totalPages > 1 && (
          <div className="sticky bottom-0 bg-white border-t px-6 py-3 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              Showing {logs.length} of {total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              >
                <ChevronLeft className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
              <span className="text-sm px-2" style={{ color: '#2C2C2C' }}>
                {page} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              >
                <ChevronRight className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
