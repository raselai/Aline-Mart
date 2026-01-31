'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Banknote,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
} from 'lucide-react'
import type { CODCollection, CODCollectionStatus } from '@/types/accounts'
import CODCollectionModal from '@/components/admin/accounts/CODCollectionModal'

const STATUS_CONFIG: Record<CODCollectionStatus, { label: string; color: string; bg: string; icon: typeof CheckCircle }> = {
  PENDING: { label: 'Pending', color: '#D97706', bg: '#FEF3C7', icon: Clock },
  COLLECTED: { label: 'Collected', color: '#059669', bg: '#D1FAE5', icon: CheckCircle },
  PARTIAL: { label: 'Partial', color: '#2563EB', bg: '#DBEAFE', icon: AlertCircle },
  FAILED: { label: 'Failed', color: '#DC2626', bg: '#FEE2E2', icon: AlertCircle },
}

export default function CODCollectionsPage() {
  const [collections, setCollections] = useState<CODCollection[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [pendingTotal, setPendingTotal] = useState(0)

  // Filters
  const [status, setStatus] = useState<CODCollectionStatus | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Modal
  const [selectedCollection, setSelectedCollection] = useState<CODCollection | null>(null)

  const fetchCollections = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      if (status) params.set('status', status)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)

      const response = await fetch(`/api/admin/accounts/cod-collections?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')

      const data = await response.json()
      setCollections(data.collections || [])
      setTotal(data.total || 0)
      setPendingTotal(data.pendingTotal || 0)
    } catch (error) {
      console.error('Error fetching COD collections:', error)
    } finally {
      setLoading(false)
    }
  }, [page, status, dateFrom, dateTo])

  useEffect(() => {
    fetchCollections()
  }, [fetchCollections])

  const handleCollect = async (orderId: string, collectedAmount: number, notes: string) => {
    const response = await fetch(`/api/admin/accounts/cod-collections/${orderId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ collectedAmount, notes }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || 'Failed to record collection')
    }

    fetchCollections()
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            COD Collections
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Track and manage Cash on Delivery payments
          </p>
        </div>
      </div>

      {/* Pending Total Card */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-full" style={{ backgroundColor: '#FEF3C7' }}>
            <Banknote className="w-8 h-8" style={{ color: '#D97706' }} />
          </div>
          <div>
            <p className="text-sm" style={{ color: '#6B7280' }}>Total Pending Collection</p>
            <p className="text-3xl font-bold" style={{ color: '#2C2C2C' }}>
              ৳{pendingTotal.toLocaleString('en-BD', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as CODCollectionStatus | ''); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="COLLECTED">Collected</option>
              <option value="PARTIAL">Partial</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>From Date</label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>To Date</label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>
        </div>
      </div>

      {/* Collections Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading COD collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-12 text-center">
            <Banknote className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>No COD collections found</p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>COD orders will appear here automatically</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '800px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Order</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Date</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Expected</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Collected</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {collections.map((col) => {
                  const statusConf = STATUS_CONFIG[col.status]
                  return (
                    <tr key={col.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                      <td className="px-6 py-4 font-mono text-sm" style={{ color: '#8e2157' }}>
                        {col.order?.orderNumber || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#2C2C2C' }}>
                        {col.order?.shippingAddress?.fullName || col.order?.user?.name || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>
                        {formatDate(col.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: '#2C2C2C' }}>
                        ৳{Number(col.expectedAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 text-right font-medium" style={{ color: col.collectedAmount ? '#059669' : '#9CA3AF' }}>
                        {col.collectedAmount
                          ? `৳${Number(col.collectedAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                          style={{ color: statusConf.color, backgroundColor: statusConf.bg }}
                        >
                          {statusConf.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {col.status === 'PENDING' && (
                          <button
                            onClick={() => setSelectedCollection(col)}
                            className="px-3 py-1.5 rounded text-sm text-white"
                            style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
                          >
                            Collect
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && collections.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {collections.length} of {total} collections
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronLeft size={20} style={{ color: '#6B7280' }} />
            </button>
            <span className="px-4 py-2" style={{ color: '#2C2C2C' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Collection Modal */}
      <CODCollectionModal
        collection={selectedCollection}
        isOpen={!!selectedCollection}
        onClose={() => setSelectedCollection(null)}
        onSubmit={handleCollect}
      />
    </div>
  )
}
