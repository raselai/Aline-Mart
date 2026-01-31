'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  RotateCcw,
  Check,
  XCircle,
} from 'lucide-react'
import type { Refund, RefundStatus } from '@/types/accounts'
import RefundStatusBadge from '@/components/admin/accounts/RefundStatusBadge'
import RefundModal from '@/components/admin/accounts/RefundModal'

export default function RefundsPage() {
  const [refunds, setRefunds] = useState<Refund[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  // Filters
  const [status, setStatus] = useState<RefundStatus | ''>('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const limit = 20

  // Refund modal
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<{
    id: string; orderNumber: string; total: number; paymentMethod: string;
    items?: Array<{ id: string; productName: string; brandName: string; variantName: string; quantity: number; price: number; total: number }>
  } | null>(null)

  // Create refund from order
  const [orderSearch, setOrderSearch] = useState('')
  const [orderResults, setOrderResults] = useState<Array<{
    id: string; orderNumber: string; total: number; paymentMethod: string; status: string
  }>>([])
  const [searchingOrders, setSearchingOrders] = useState(false)
  const [showOrderSearch, setShowOrderSearch] = useState(false)

  const fetchRefunds = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
      if (status) params.set('status', status)
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      if (search) params.set('search', search)

      const response = await fetch(`/api/admin/accounts/refunds?${params}`)
      if (!response.ok) throw new Error('Failed to fetch')
      const data = await response.json()
      setRefunds(data.refunds || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching refunds:', error)
    } finally {
      setLoading(false)
    }
  }, [page, status, dateFrom, dateTo, search])

  useEffect(() => { fetchRefunds() }, [fetchRefunds])

  useEffect(() => {
    const timer = setTimeout(() => setPage(1), 300)
    return () => clearTimeout(timer)
  }, [search])

  const searchOrders = async () => {
    if (!orderSearch.trim()) return
    setSearchingOrders(true)
    try {
      const response = await fetch(`/api/admin/orders?search=${encodeURIComponent(orderSearch)}&limit=10`)
      if (!response.ok) throw new Error('Failed to search orders')
      const data = await response.json()
      setOrderResults(data.orders || [])
    } catch (error) {
      console.error('Error searching orders:', error)
    } finally {
      setSearchingOrders(false)
    }
  }

  const selectOrderForRefund = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) throw new Error('Failed to fetch order')
      const data = await response.json()
      const order = data.order
      setSelectedOrder({
        id: order.id,
        orderNumber: order.orderNumber,
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: order.items,
      })
      setShowOrderSearch(false)
      setShowRefundModal(true)
    } catch (error) {
      console.error('Error fetching order:', error)
      alert('Failed to load order details')
    }
  }

  const handleCreateRefund = async (data: {
    orderId: string; orderItemId?: string; amount: number; reason: string;
    type: 'FULL' | 'PARTIAL'; restoreStock: boolean; notes?: string
  }) => {
    const response = await fetch('/api/admin/accounts/refunds', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      const err = await response.json()
      throw new Error(err.error || 'Failed to create refund')
    }
    fetchRefunds()
  }

  const handleProcessRefund = async (refundId: string, action: 'PROCESSED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/admin/accounts/refunds/${refundId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (!response.ok) throw new Error('Failed to process refund')
      fetchRefunds()
    } catch (error) {
      console.error('Error processing refund:', error)
      alert('Failed to process refund')
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>Refunds</h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>Process and track customer refunds</p>
        </div>
        <button
          onClick={() => setShowOrderSearch(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white"
          style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
        >
          <Plus size={18} />
          New Refund
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Search</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#6B7280' }} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Reason or notes..."
                className="w-full pl-10 pr-4 py-2 border rounded-md"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Status</label>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as RefundStatus | ''); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSED">Processed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>From</label>
            <input type="date" value={dateFrom} onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md" style={{ borderColor: '#d1d5db' }} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>To</label>
            <input type="date" value={dateTo} onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md" style={{ borderColor: '#d1d5db' }} />
          </div>
        </div>
      </div>

      {/* Refunds Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading refunds...</p>
          </div>
        ) : refunds.length === 0 ? (
          <div className="p-12 text-center">
            <RotateCcw className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>No refunds found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '900px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Order</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Reason</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Amount</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Date</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {refunds.map((refund) => (
                  <tr key={refund.id} className="border-t hover:bg-gray-50 transition-colors" style={{ borderColor: '#E5E7EB' }}>
                    <td className="px-6 py-4 font-mono text-sm" style={{ color: '#8e2157' }}>
                      {refund.order?.orderNumber || '—'}
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#2C2C2C' }}>
                      {refund.type === 'FULL' ? 'Full' : 'Partial'}
                    </td>
                    <td className="px-6 py-4 text-sm max-w-[200px] truncate" style={{ color: '#6B7280' }}>
                      {refund.reason}
                    </td>
                    <td className="px-6 py-4 text-right font-medium" style={{ color: '#DC2626' }}>
                      ৳{Number(refund.amount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <RefundStatusBadge status={refund.status} />
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#6B7280' }}>
                      {formatDate(refund.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {refund.status === 'PENDING' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleProcessRefund(refund.id, 'PROCESSED')}
                            className="p-1.5 rounded hover:bg-green-50"
                            title="Approve refund"
                          >
                            <Check size={18} style={{ color: '#059669' }} />
                          </button>
                          <button
                            onClick={() => handleProcessRefund(refund.id, 'REJECTED')}
                            className="p-1.5 rounded hover:bg-red-50"
                            title="Reject refund"
                          >
                            <XCircle size={18} style={{ color: '#DC2626' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && refunds.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>Showing {refunds.length} of {total} refunds</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: '#e5e7eb' }}>
              <ChevronLeft size={20} style={{ color: '#6B7280' }} />
            </button>
            <span className="px-4 py-2" style={{ color: '#2C2C2C' }}>Page {page} of {totalPages}</span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" style={{ borderColor: '#e5e7eb' }}>
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Order Search Modal (for new refund) */}
      {showOrderSearch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>Select Order</h2>
              <button onClick={() => setShowOrderSearch(false)} className="p-1 hover:bg-gray-100 rounded">
                <XCircle size={20} style={{ color: '#6B7280' }} />
              </button>
            </div>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && searchOrders()}
                placeholder="Search by order number..."
                className="flex-1 px-4 py-2 border rounded-md"
                style={{ borderColor: '#d1d5db' }}
              />
              <button
                onClick={searchOrders}
                disabled={searchingOrders}
                className="px-4 py-2 rounded-md text-white"
                style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
              >
                {searchingOrders ? '...' : 'Search'}
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {orderResults.map((order) => (
                <button
                  key={order.id}
                  onClick={() => selectOrderForRefund(order.id)}
                  className="w-full text-left p-3 rounded-md border hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#e5e7eb' }}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm" style={{ color: '#8e2157' }}>{order.orderNumber}</span>
                    <span className="font-medium" style={{ color: '#2C2C2C' }}>
                      ৳{Number(order.total).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span className="text-xs" style={{ color: '#6B7280' }}>{order.status}</span>
                    <span className="text-xs" style={{ color: '#6B7280' }}>{order.paymentMethod}</span>
                  </div>
                </button>
              ))}
              {orderResults.length === 0 && orderSearch && !searchingOrders && (
                <p className="text-center py-4 text-sm" style={{ color: '#6B7280' }}>No orders found</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Refund Modal */}
      <RefundModal
        order={selectedOrder}
        isOpen={showRefundModal}
        onClose={() => { setShowRefundModal(false); setSelectedOrder(null) }}
        onSubmit={handleCreateRefund}
      />
    </div>
  )
}
