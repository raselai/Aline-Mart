'use client'

import { useState, useEffect } from 'react'
import { Search, Eye, ChevronLeft, ChevronRight, X, Package, Truck, CheckCircle, XCircle, Clock } from 'lucide-react'
import { getOrderStatusColor, getPaymentMethodName, getStatusDisplayName, getAvailableStatusTransitions, formatPrice } from '@/lib/order-utils'
import type { AdminOrderListItem, OrderWithDetails, OrderStatus, PaymentMethod } from '@/types/order'

interface OrderDetailsModalProps {
  order: OrderWithDetails | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, trackingNumber?: string) => Promise<void>
}

function OrderStatusBadge({ status }: { status: string }) {
  const colorClass = getOrderStatusColor(status)
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {getStatusDisplayName(status)}
    </span>
  )
}

function OrderDetailsModal({ order, isOpen, onClose, onStatusUpdate }: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')

  if (!isOpen || !order) return null

  const availableTransitions = getAvailableStatusTransitions(order.status)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    setUpdating(true)
    try {
      await onStatusUpdate(order.id, newStatus, newStatus === 'SHIPPED' ? trackingNumber : undefined)
    } finally {
      setUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <Clock className="w-5 h-5" />
      case 'PROCESSING': return <Package className="w-5 h-5" />
      case 'SHIPPED': return <Truck className="w-5 h-5" />
      case 'DELIVERED': return <CheckCircle className="w-5 h-5" />
      case 'CANCELLED': return <XCircle className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
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
        className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
              Order {order.orderNumber}
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status & Payment Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Order Status</p>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm font-medium mb-2" style={{ color: '#6B7280' }}>Payment Method</p>
              <p className="font-medium" style={{ color: '#2C2C2C' }}>
                {getPaymentMethodName(order.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C2C2C' }}>Customer</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium" style={{ color: '#2C2C2C' }}>{order.user.name}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{order.user.email}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C2C2C' }}>Shipping Address</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="font-medium" style={{ color: '#2C2C2C' }}>{order.shippingAddress.fullName}</p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{order.shippingAddress.phone}</p>
              <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
                {order.shippingAddress.addressLine1}
                {order.shippingAddress.addressLine2 && <><br />{order.shippingAddress.addressLine2}</>}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm" style={{ color: '#6B7280' }}>{order.shippingAddress.country}</p>
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C2C2C' }}>Order Items</h3>
            <div className="border rounded-lg overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
              <table className="w-full">
                <thead style={{ backgroundColor: '#F5F5F5' }}>
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium" style={{ color: '#2C2C2C' }}>Product</th>
                    <th className="text-center px-4 py-3 text-sm font-medium" style={{ color: '#2C2C2C' }}>Qty</th>
                    <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#2C2C2C' }}>Price</th>
                    <th className="text-right px-4 py-3 text-sm font-medium" style={{ color: '#2C2C2C' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item.id} className="border-t" style={{ borderColor: '#e5e7eb' }}>
                      <td className="px-4 py-3">
                        <p className="font-medium" style={{ color: '#2C2C2C' }}>{item.productName}</p>
                        <p className="text-sm" style={{ color: '#6B7280' }}>{item.brandName}</p>
                        {item.variantName && (
                          <p className="text-sm" style={{ color: '#6B7280' }}>{item.variantName}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center" style={{ color: '#2C2C2C' }}>{item.quantity}</td>
                      <td className="px-4 py-3 text-right" style={{ color: '#2C2C2C' }}>{formatPrice(item.price)}</td>
                      <td className="px-4 py-3 text-right font-medium" style={{ color: '#2C2C2C' }}>{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C2C2C' }}>Summary</h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Subtotal</span>
                <span style={{ color: '#2C2C2C' }}>{formatPrice(order.total - (order.shippingCost || 0))}</span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Shipping</span>
                <span style={{ color: '#2C2C2C' }}>{formatPrice(order.shippingCost || 0)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t" style={{ borderColor: '#e5e7eb' }}>
                <span className="font-semibold" style={{ color: '#2C2C2C' }}>Total</span>
                <span className="font-semibold" style={{ color: '#8e2157' }}>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Status Actions */}
          {availableTransitions.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3" style={{ color: '#2C2C2C' }}>Update Status</h3>

              {/* Tracking number input for shipping */}
              {availableTransitions.includes('SHIPPED') && (
                <div className="mb-4">
                  <label htmlFor="tracking" className="block text-sm font-medium mb-2" style={{ color: '#6B7280' }}>
                    Tracking Number (optional)
                  </label>
                  <input
                    type="text"
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number..."
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                    style={{ borderColor: '#d1d5db' }}
                  />
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {availableTransitions.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status as OrderStatus)}
                    disabled={updating}
                    className="px-4 py-2 rounded-md font-medium transition-all disabled:opacity-50"
                    style={{
                      backgroundColor: status === 'CANCELLED' ? '#FEE2E2' : '#fdf2f8',
                      color: status === 'CANCELLED' ? '#991B1B' : '#8e2157'
                    }}
                  >
                    {updating ? 'Updating...' : `Mark as ${getStatusDisplayName(status)}`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrderListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterPayment, setFilterPayment] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [sortBy, setSortBy] = useState<'createdAt' | 'total' | 'orderNumber'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Modal state
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [searchQuery, filterStatus, filterPayment, dateFrom, dateTo, sortBy, sortOrder, page])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: filterStatus,
        paymentMethod: filterPayment,
        dateFrom,
        dateTo,
        sort: sortBy,
        order: sortOrder,
        page: page.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/orders?${params}`)
      if (!response.ok) throw new Error('Failed to fetch orders')

      const data = await response.json()
      setOrders(data.orders || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchOrderDetails = async (orderId: string) => {
    setModalLoading(true)
    setSelectedOrderId(orderId)
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`)
      if (!response.ok) throw new Error('Failed to fetch order details')

      const data = await response.json()
      setSelectedOrder(data.order)
    } catch (error) {
      console.error('Error fetching order details:', error)
      alert('Failed to load order details')
      setSelectedOrderId(null)
    } finally {
      setModalLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, trackingNumber?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update order status')
      }

      const data = await response.json()
      alert(data.message)

      // Refresh orders list and modal data
      fetchOrders()
      if (selectedOrderId === orderId) {
        fetchOrderDetails(orderId)
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      alert(error instanceof Error ? error.message : 'Failed to update order status')
    }
  }

  const closeModal = () => {
    setSelectedOrderId(null)
    setSelectedOrder(null)
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex justify-between items-center mb-8" style={{ minWidth: '280px', width: '100%' }}>
        <div>
          <h1
            className="text-3xl font-serif font-bold"
            style={{
              color: '#2C2C2C',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal'
            }}
          >
            Orders
          </h1>
          <p
            className="mt-2"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%'
            }}
          >
            Manage customer orders and shipments
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div
        className="bg-white rounded-lg shadow-sm p-6 mb-6"
        style={{ minWidth: '280px', width: '100%' }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Search
            </label>
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: '#6B7280' }}
              />
              <input
                type="text"
                id="search"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="Order number..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db', minWidth: '100%' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Status
            </label>
            <select
              id="status"
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Payment Filter */}
          <div>
            <label htmlFor="payment" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Payment
            </label>
            <select
              id="payment"
              value={filterPayment}
              onChange={(e) => { setFilterPayment(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Methods</option>
              <option value="COD">Cash on Delivery</option>
              <option value="PAYSTATION">PayStation</option>
            </select>
          </div>

          {/* Date From */}
          <div>
            <label htmlFor="dateFrom" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              From Date
            </label>
            <input
              type="date"
              id="dateFrom"
              value={dateFrom}
              onChange={(e) => { setDateFrom(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          {/* Date To */}
          <div>
            <label htmlFor="dateTo" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              To Date
            </label>
            <input
              type="date"
              id="dateTo"
              value={dateTo}
              onChange={(e) => { setDateTo(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          {/* Sort */}
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Sort By
            </label>
            <select
              id="sortBy"
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [sort, order] = e.target.value.split('-')
                setSortBy(sort as any)
                setSortOrder(order as any)
                setPage(1)
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="total-desc">Highest Amount</option>
              <option value="total-asc">Lowest Amount</option>
              <option value="orderNumber-asc">Order # (A-Z)</option>
              <option value="orderNumber-desc">Order # (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="bg-white rounded-lg shadow-sm overflow-hidden"
        style={{ minWidth: '280px', width: '100%' }}
      >
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
              No orders found
            </p>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              {searchQuery || filterStatus || filterPayment || dateFrom || dateTo
                ? 'Try adjusting your filters'
                : 'Orders will appear here when customers make purchases'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '900px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Order #</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Date</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Items</th>
                  <th className="text-right px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Total</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Payment</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Status</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-t hover:bg-gray-50 transition-colors cursor-pointer"
                    style={{ borderColor: '#E5E7EB' }}
                    onClick={() => fetchOrderDetails(order.id)}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: '#8e2157' }}>{order.orderNumber}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: '#2C2C2C' }}>
                        {order.shippingAddress.fullName}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {order.user.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p style={{ color: '#2C2C2C' }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>
                        {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
                        style={{ backgroundColor: '#F3F4F6', color: '#2C2C2C' }}
                      >
                        {order.itemCount}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <p className="font-medium" style={{ color: '#2C2C2C' }}>{formatPrice(order.total)}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: order.paymentMethod === 'COD' ? '#FEF3C7' : '#DBEAFE',
                          color: order.paymentMethod === 'COD' ? '#92400E' : '#1E40AF'
                        }}
                      >
                        {order.paymentMethod === 'COD' ? 'COD' : 'PayStation'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          fetchOrderDetails(order.id)
                        }}
                        className="p-2 rounded hover:bg-gray-100 transition-colors"
                        title="View order details"
                      >
                        <Eye size={18} style={{ color: '#6B7280' }} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && orders.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {orders.length} of {total} orders
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={selectedOrder}
        isOpen={!!selectedOrderId}
        onClose={closeModal}
        onStatusUpdate={handleStatusUpdate}
      />

      {/* Modal Loading Overlay */}
      {modalLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg p-8 shadow-xl">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading order details...</p>
          </div>
        </div>
      )}
    </div>
  )
}
