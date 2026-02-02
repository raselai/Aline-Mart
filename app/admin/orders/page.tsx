'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Search, Eye, ChevronLeft, ChevronRight, X, Package, Truck, CheckCircle, XCircle, Clock, ImageOff, Printer } from 'lucide-react'
import { getOrderStatusColor, getPaymentMethodName, getStatusDisplayName, getAvailableStatusTransitions, formatPrice } from '@/lib/order-utils'
import type { AdminOrderListItem, OrderWithDetails, OrderStatus, OrderItemStatus, PaymentMethod } from '@/types/order'

interface OrderDetailsModalProps {
  order: OrderWithDetails | null
  isOpen: boolean
  onClose: () => void
  onStatusUpdate: (orderId: string, newStatus: OrderStatus, trackingNumber?: string, cancellationReason?: string) => Promise<void>
  onItemCancel: (orderId: string, itemId: string, reason: string) => Promise<void>
}

function OrderStatusBadge({ status }: { status: string }) {
  const colorClass = getOrderStatusColor(status)
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClass}`}>
      {getStatusDisplayName(status)}
    </span>
  )
}

function ItemStatusBadge({ status }: { status: string }) {
  const styles: Record<string, React.CSSProperties> = {
    ACTIVE: { backgroundColor: '#ECFDF5', color: '#065F46', border: '1px solid #A7F3D0' },
    CANCELLED: { backgroundColor: '#FEF2F2', color: '#991B1B', border: '1px solid #FECACA' },
    RETURNED: { backgroundColor: '#FFF7ED', color: '#9A3412', border: '1px solid #FED7AA' },
    REFUNDED: { backgroundColor: '#EFF6FF', color: '#1E40AF', border: '1px solid #BFDBFE' },
  }
  return (
    <span
      style={{
        padding: '2px 8px',
        fontSize: '11px',
        fontWeight: 600,
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        ...styles[status] || styles.ACTIVE,
      }}
    >
      {status}
    </span>
  )
}

function OrderDetailsModal({ order, isOpen, onClose, onStatusUpdate, onItemCancel }: OrderDetailsModalProps) {
  const [updating, setUpdating] = useState(false)
  const [trackingNumber, setTrackingNumber] = useState('')
  const [trackingFocused, setTrackingFocused] = useState(false)
  const [showCancelForm, setShowCancelForm] = useState(false)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelReasonFocused, setCancelReasonFocused] = useState(false)
  const [cancellingItemId, setCancellingItemId] = useState<string | null>(null)
  const [itemCancelReason, setItemCancelReason] = useState('')
  const [itemCancelFocused, setItemCancelFocused] = useState(false)
  const [itemUpdating, setItemUpdating] = useState(false)

  if (!isOpen || !order) return null

  const availableTransitions = getAvailableStatusTransitions(order.status)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === 'CANCELLED' && !showCancelForm) {
      setShowCancelForm(true)
      return
    }

    setUpdating(true)
    try {
      await onStatusUpdate(
        order.id,
        newStatus,
        newStatus === 'SHIPPED' ? trackingNumber : undefined,
        newStatus === 'CANCELLED' ? cancellationReason : undefined
      )
      setShowCancelForm(false)
      setCancellationReason('')
    } finally {
      setUpdating(false)
    }
  }

  const getStatusIcon = (status: string) => {
    const iconStyle = { width: '18px', height: '18px' }
    switch (status) {
      case 'PENDING': return <Clock style={iconStyle} />
      case 'PROCESSING': return <Package style={iconStyle} />
      case 'SHIPPED': return <Truck style={iconStyle} />
      case 'DELIVERED': return <CheckCircle style={iconStyle} />
      case 'CANCELLED': return <XCircle style={iconStyle} />
      default: return <Clock style={iconStyle} />
    }
  }

  const sectionHeadingStyle: React.CSSProperties = {
    fontSize: '11px',
    fontWeight: 600,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#9CA3AF',
    marginBottom: '14px',
    whiteSpace: 'normal',
    wordBreak: 'normal',
    display: 'block',
    minWidth: '100%',
  }

  const textStyle: React.CSSProperties = {
    whiteSpace: 'normal',
    wordBreak: 'normal',
    overflowWrap: 'normal',
    display: 'block',
    minWidth: '100%',
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* Modal */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          backgroundColor: '#FFFFFF',
          width: '100%',
          maxWidth: '780px',
          maxHeight: '90vh',
          overflowY: 'auto',
          margin: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          border: '1px solid #E8E6E3',
          minWidth: '320px',
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            height: '3px',
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
          }}
        />

        {/* Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E8E6E3',
            padding: '24px 28px',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
            zIndex: 10,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <h2
              className="font-serif"
              style={{
                fontSize: '22px',
                fontWeight: 400,
                color: '#2C2C2C',
                letterSpacing: '-0.3px',
                margin: 0,
                ...textStyle,
              }}
            >
              Order {order.orderNumber}
            </h2>
            <p
              style={{
                fontSize: '13px',
                color: '#6B7280',
                marginTop: '6px',
                ...textStyle,
              }}
            >
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0, marginTop: '-4px', marginRight: '-4px' }}>
            <button
              onClick={() => window.open(`/admin/orders/${order.id}/invoice`, '_blank')}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '1px solid #E8E6E3',
                cursor: 'pointer',
                transition: 'all 200ms',
                color: '#8e2157',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#fdf2f8'
                e.currentTarget.style.borderColor = '#8e2157'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#E8E6E3'
              }}
              title="Print Invoice"
              aria-label="Print Invoice"
            >
              <Printer style={{ width: '18px', height: '18px' }} />
            </button>
            <button
              onClick={onClose}
              style={{
                width: '44px',
                height: '44px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'none',
                border: '1px solid #E8E6E3',
                cursor: 'pointer',
                transition: 'all 200ms',
                color: '#6B7280',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F5F5'
                e.currentTarget.style.borderColor = '#D1D5DB'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#E8E6E3'
              }}
              aria-label="Close modal"
            >
              <X style={{ width: '18px', height: '18px' }} />
            </button>
          </div>
        </div>

        <div style={{ padding: '28px' }}>
          {/* Status & Payment Info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div
              style={{
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E6E3',
                padding: '18px 20px',
              }}
            >
              <p style={sectionHeadingStyle}>Order Status</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {getStatusIcon(order.status)}
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
            <div
              style={{
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E6E3',
                padding: '18px 20px',
              }}
            >
              <p style={sectionHeadingStyle}>Payment Method</p>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2C2C2C',
                  margin: 0,
                  ...textStyle,
                }}
              >
                {getPaymentMethodName(order.paymentMethod)}
              </p>
            </div>
          </div>

          {/* Customer Info */}
          <div style={{ marginBottom: '28px' }}>
            <p style={sectionHeadingStyle}>Customer</p>
            <div
              style={{
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E6E3',
                padding: '18px 20px',
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2C2C2C',
                  margin: 0,
                  ...textStyle,
                }}
              >
                {order.user.name}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginTop: '4px',
                  ...textStyle,
                  overflowWrap: 'anywhere',
                }}
              >
                {order.user.email}
              </p>
            </div>
          </div>

          {/* Shipping Address */}
          <div style={{ marginBottom: '28px' }}>
            <p style={sectionHeadingStyle}>Shipping Address</p>
            <div
              style={{
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E6E3',
                padding: '18px 20px',
              }}
            >
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 500,
                  color: '#2C2C2C',
                  margin: 0,
                  ...textStyle,
                }}
              >
                {order.shippingAddress.fullName}
              </p>
              <p
                style={{
                  fontSize: '13px',
                  color: '#6B7280',
                  marginTop: '4px',
                  ...textStyle,
                }}
              >
                {order.shippingAddress.phone}
              </p>
              <div
                style={{
                  marginTop: '12px',
                  paddingTop: '12px',
                  borderTop: '1px solid #E8E6E3',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                    lineHeight: 1.6,
                    ...textStyle,
                  }}
                >
                  {order.shippingAddress.addressLine1}
                  {order.shippingAddress.addressLine2 && (
                    <><br />{order.shippingAddress.addressLine2}</>
                  )}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                    marginTop: '2px',
                    ...textStyle,
                  }}
                >
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B7280',
                    margin: 0,
                    marginTop: '2px',
                    ...textStyle,
                  }}
                >
                  {order.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: '28px' }}>
            <p style={sectionHeadingStyle}>
              Order Items ({order.items.length})
            </p>
            <div
              style={{
                border: '1px solid #E8E6E3',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <div
                className="hidden md:grid"
                style={{
                  gridTemplateColumns: '1fr 70px 100px 90px 90px 100px',
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: '#FAFAF8',
                  borderBottom: '1px solid #E8E6E3',
                }}
              >
                {[
                  { label: 'Product', align: 'left' as const },
                  { label: 'Qty', align: 'center' as const },
                  { label: 'Price', align: 'right' as const },
                  { label: 'Cost', align: 'right' as const },
                  { label: 'Profit', align: 'right' as const },
                  { label: 'Total', align: 'right' as const },
                ].map(({ label, align }) => (
                  <span
                    key={label}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      letterSpacing: '1.5px',
                      textTransform: 'uppercase',
                      color: '#9CA3AF',
                      textAlign: align,
                    }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              {/* Items */}
              {order.items.map((item, index) => {
                const isCancelled = item.status === 'CANCELLED'
                const isItemCancelling = cancellingItemId === item.id
                return (
                <div
                  key={item.id}
                  style={{
                    borderTop: index === 0 ? 'none' : '1px solid #E8E6E3',
                    padding: '16px 20px',
                    opacity: isCancelled ? 0.6 : 1,
                    backgroundColor: isCancelled ? '#FAFAF8' : 'transparent',
                  }}
                >
                  {/* Sub-order header */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                      gap: '8px',
                      flexWrap: 'wrap',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                      {item.subOrderNumber && (
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#8e2157', fontFamily: 'monospace' }}>
                          {item.subOrderNumber}
                        </span>
                      )}
                      <ItemStatusBadge status={item.status || 'ACTIVE'} />
                      {item.vendor && (
                        <span style={{ fontSize: '11px', color: '#6B7280', backgroundColor: '#F3F4F6', padding: '2px 8px', borderRadius: '2px' }}>
                          {item.vendor}
                        </span>
                      )}
                    </div>
                    {item.status === 'ACTIVE' && order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                      <button
                        onClick={() => {
                          if (isItemCancelling) {
                            setCancellingItemId(null)
                            setItemCancelReason('')
                          } else {
                            setCancellingItemId(item.id)
                            setItemCancelReason('')
                          }
                        }}
                        style={{
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#991B1B',
                          backgroundColor: 'transparent',
                          border: '1px solid #FECACA',
                          padding: '4px 10px',
                          cursor: 'pointer',
                          transition: 'all 200ms',
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2' }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                      >
                        {isItemCancelling ? 'Close' : 'Cancel Item'}
                      </button>
                    )}
                  </div>

                  {/* Desktop row */}
                  <div
                    className="hidden md:grid"
                    style={{
                      gridTemplateColumns: '1fr 70px 100px 90px 90px 100px',
                      gap: '12px',
                      alignItems: 'center',
                    }}
                  >
                    {/* Product info */}
                    <div style={{ display: 'flex', gap: '14px', alignItems: 'center', minWidth: 0 }}>
                      <div
                        style={{
                          flexShrink: 0,
                          width: '56px',
                          height: '56px',
                          overflow: 'hidden',
                          backgroundColor: '#F5F5F5',
                          border: '1px solid #E8E6E3',
                        }}
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.productName}
                            width={56}
                            height={56}
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
                            }}
                          >
                            <ImageOff style={{ width: '20px', height: '20px', color: '#D1D5DB' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: 500,
                            color: isCancelled ? '#9CA3AF' : '#2C2C2C',
                            margin: 0,
                            whiteSpace: 'normal',
                            wordBreak: 'normal',
                            overflowWrap: 'normal',
                            textDecoration: isCancelled ? 'line-through' : 'none',
                          }}
                        >
                          {item.productName}
                        </p>
                        <p
                          style={{
                            fontSize: '12px',
                            fontWeight: 600,
                            letterSpacing: '0.5px',
                            color: isCancelled ? '#D1D5DB' : '#8e2157',
                            margin: 0,
                            marginTop: '2px',
                          }}
                        >
                          {item.brandName}
                        </p>
                        {item.variantName && (
                          <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, marginTop: '2px' }}>
                            {item.variantName}
                          </p>
                        )}
                      </div>
                    </div>

                    <p style={{ fontSize: '14px', color: isCancelled ? '#9CA3AF' : '#2C2C2C', textAlign: 'center', margin: 0 }}>
                      {item.quantity}
                    </p>
                    <p style={{ fontSize: '14px', color: isCancelled ? '#D1D5DB' : '#6B7280', textAlign: 'right', margin: 0, textDecoration: isCancelled ? 'line-through' : 'none' }}>
                      {formatPrice(item.price)}
                    </p>
                    <p style={{ fontSize: '13px', color: item.costPrice != null && !isCancelled ? '#6B7280' : '#D1D5DB', textAlign: 'right', margin: 0 }}>
                      {item.costPrice != null ? formatPrice(item.costPrice) : '—'}
                    </p>
                    <p style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: isCancelled ? '#D1D5DB'
                        : item.costPrice != null
                          ? (item.price - item.costPrice) >= 0 ? '#059669' : '#DC2626'
                          : '#D1D5DB',
                      textAlign: 'right',
                      margin: 0,
                    }}>
                      {item.costPrice != null && !isCancelled ? formatPrice((item.price - item.costPrice) * item.quantity) : '—'}
                    </p>
                    <p style={{ fontSize: '14px', fontWeight: 600, color: isCancelled ? '#D1D5DB' : '#2C2C2C', textAlign: 'right', margin: 0, textDecoration: isCancelled ? 'line-through' : 'none' }}>
                      {formatPrice(item.total)}
                    </p>
                  </div>

                  {/* Mobile row */}
                  <div className="flex md:hidden" style={{ gap: '12px' }}>
                    <div
                      style={{
                        flexShrink: 0,
                        width: '56px',
                        height: '56px',
                        overflow: 'hidden',
                        backgroundColor: '#F5F5F5',
                        border: '1px solid #E8E6E3',
                      }}
                    >
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          width={56}
                          height={56}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            height: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <ImageOff style={{ width: '20px', height: '20px', color: '#D1D5DB' }} />
                        </div>
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: 500,
                          color: isCancelled ? '#9CA3AF' : '#2C2C2C',
                          margin: 0,
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          textDecoration: isCancelled ? 'line-through' : 'none',
                        }}
                      >
                        {item.productName}
                      </p>
                      <p style={{ fontSize: '12px', color: isCancelled ? '#D1D5DB' : '#8e2157', margin: 0, marginTop: '2px' }}>
                        {item.brandName}
                      </p>
                      {item.variantName && (
                        <p style={{ fontSize: '12px', color: '#6B7280', margin: 0, marginTop: '2px' }}>
                          {item.variantName}
                        </p>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'baseline',
                          marginTop: '8px',
                        }}
                      >
                        <span style={{ fontSize: '13px', color: '#6B7280' }}>
                          Qty: {item.quantity} x {formatPrice(item.price)}
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: isCancelled ? '#D1D5DB' : '#2C2C2C', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                          {formatPrice(item.total)}
                        </span>
                      </div>
                      {item.costPrice != null && !isCancelled && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'baseline',
                            marginTop: '4px',
                          }}
                        >
                          <span style={{ fontSize: '12px', color: '#9CA3AF' }}>
                            Cost: {formatPrice(item.costPrice)}
                          </span>
                          <span style={{
                            fontSize: '12px',
                            fontWeight: 500,
                            color: (item.price - item.costPrice) >= 0 ? '#059669' : '#DC2626',
                          }}>
                            Profit: {formatPrice((item.price - item.costPrice) * item.quantity)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Item cancellation reason display */}
                  {isCancelled && item.itemCancellationReason && (
                    <div style={{ marginTop: '10px', padding: '10px 14px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                      <p style={{ fontSize: '12px', fontWeight: 600, color: '#991B1B', margin: 0, marginBottom: '4px' }}>
                        Cancellation Reason:
                      </p>
                      <p style={{ fontSize: '13px', color: '#991B1B', margin: 0, whiteSpace: 'pre-wrap' }}>
                        {item.itemCancellationReason}
                      </p>
                    </div>
                  )}

                  {/* Item cancel form */}
                  {isItemCancelling && (
                    <div style={{ marginTop: '12px', padding: '14px 16px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#991B1B',
                          marginBottom: '8px',
                        }}
                      >
                        Reason for cancelling this item
                      </label>
                      <textarea
                        value={itemCancelReason}
                        onChange={(e) => setItemCancelReason(e.target.value)}
                        onFocus={() => setItemCancelFocused(true)}
                        onBlur={() => setItemCancelFocused(false)}
                        placeholder="e.g. Out of stock, Damaged, Customer request..."
                        rows={2}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          color: '#2C2C2C',
                          backgroundColor: '#FFFFFF',
                          border: itemCancelFocused ? '1px solid #DC2626' : '1px solid #FECACA',
                          outline: 'none',
                          transition: 'border-color 200ms',
                          boxSizing: 'border-box',
                          resize: 'vertical',
                          fontFamily: 'inherit',
                        }}
                      />
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button
                          onClick={async () => {
                            setItemUpdating(true)
                            try {
                              await onItemCancel(order.id, item.id, itemCancelReason)
                              setCancellingItemId(null)
                              setItemCancelReason('')
                            } finally {
                              setItemUpdating(false)
                            }
                          }}
                          disabled={itemUpdating || !itemCancelReason.trim()}
                          style={{
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 600,
                            backgroundColor: '#DC2626',
                            color: '#FFFFFF',
                            border: 'none',
                            cursor: itemUpdating || !itemCancelReason.trim() ? 'not-allowed' : 'pointer',
                            opacity: itemUpdating || !itemCancelReason.trim() ? 0.5 : 1,
                            transition: 'all 200ms',
                          }}
                          onMouseEnter={(e) => {
                            if (!itemUpdating && itemCancelReason.trim()) e.currentTarget.style.backgroundColor = '#B91C1C'
                          }}
                          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#DC2626' }}
                        >
                          {itemUpdating ? 'Cancelling...' : 'Confirm Cancel'}
                        </button>
                        <button
                          onClick={() => { setCancellingItemId(null); setItemCancelReason('') }}
                          disabled={itemUpdating}
                          style={{
                            padding: '8px 16px',
                            fontSize: '12px',
                            fontWeight: 500,
                            backgroundColor: 'transparent',
                            color: '#6B7280',
                            border: '1px solid #E8E6E3',
                            cursor: 'pointer',
                            transition: 'all 200ms',
                          }}
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          </div>

          {/* Order Summary */}
          {(() => {
            const activeItems = order.items.filter(i => i.status === 'ACTIVE')
            const cancelledItems = order.items.filter(i => i.status !== 'ACTIVE')
            const activeSubtotal = activeItems.reduce((sum, i) => sum + i.total, 0)
            const cancelledSubtotal = cancelledItems.reduce((sum, i) => sum + i.total, 0)
            const hasCancelled = cancelledItems.length > 0
            const activeWithCost = activeItems.filter(i => i.costPrice != null)
            const hasCostData = activeWithCost.length > 0
            const totalCost = hasCostData ? activeWithCost.reduce((sum, i) => sum + (i.costPrice! * i.quantity), 0) : 0
            const totalProfit = hasCostData ? activeWithCost.reduce((sum, i) => sum + ((i.price - i.costPrice!) * i.quantity), 0) : 0
            return (
          <div style={{ marginBottom: '28px' }}>
            <p style={sectionHeadingStyle}>Summary</p>
            <div
              style={{
                backgroundColor: '#FAFAF8',
                border: '1px solid #E8E6E3',
                padding: '18px 20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '8px 0',
                }}
              >
                <span style={{ fontSize: '14px', color: '#6B7280', whiteSpace: 'normal', wordBreak: 'normal' }}>
                  Subtotal ({activeItems.length} item{activeItems.length !== 1 ? 's' : ''})
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#2C2C2C' }}>
                  {formatPrice(activeSubtotal)}
                </span>
              </div>
              {hasCancelled && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    padding: '8px 0',
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#DC2626' }}>
                    Cancelled ({cancelledItems.length} item{cancelledItems.length !== 1 ? 's' : ''})
                  </span>
                  <span style={{ fontSize: '14px', fontWeight: 500, color: '#DC2626', textDecoration: 'line-through' }}>
                    {formatPrice(cancelledSubtotal)}
                  </span>
                </div>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  padding: '8px 0',
                }}
              >
                <span style={{ fontSize: '14px', color: '#6B7280', whiteSpace: 'normal', wordBreak: 'normal' }}>
                  Shipping
                </span>
                <span style={{ fontSize: '14px', fontWeight: 500, color: '#2C2C2C' }}>
                  {formatPrice(order.shippingCost || 0)}
                </span>
              </div>
              {hasCostData && (
                <>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '8px 0',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Total Cost</span>
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#2C2C2C' }}>
                      {formatPrice(totalCost)}
                    </span>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      padding: '8px 0',
                    }}
                  >
                    <span style={{ fontSize: '14px', color: '#6B7280' }}>Total Profit</span>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: totalProfit >= 0 ? '#059669' : '#DC2626',
                    }}>
                      {formatPrice(totalProfit)}
                    </span>
                  </div>
                </>
              )}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                  paddingTop: '12px',
                  marginTop: '8px',
                  borderTop: '1px solid #E8E6E3',
                }}
              >
                <span
                  className="font-serif"
                  style={{
                    fontSize: '16px',
                    fontWeight: 400,
                    color: '#2C2C2C',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                  }}
                >
                  Total
                </span>
                <span
                  className="font-serif"
                  style={{
                    fontSize: '22px',
                    fontWeight: 400,
                    color: '#8e2157',
                    letterSpacing: '-0.3px',
                  }}
                >
                  {formatPrice(order.total)}
                </span>
              </div>
            </div>
          </div>
            )
          })()}

          {/* Cancellation Reason (shown on cancelled orders) */}
          {order.status === 'CANCELLED' && order.cancellationReason && (
            <div style={{ marginBottom: '28px' }}>
              <p style={sectionHeadingStyle}>Cancellation Reason</p>
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  padding: '18px 20px',
                }}
              >
                <p
                  style={{
                    fontSize: '14px',
                    color: '#991B1B',
                    margin: 0,
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    ...textStyle,
                  }}
                >
                  {order.cancellationReason}
                </p>
              </div>
            </div>
          )}

          {/* Status Actions */}
          {availableTransitions.length > 0 && (
            <div>
              <p style={sectionHeadingStyle}>Update Status</p>

              {/* Tracking number input for shipping */}
              {availableTransitions.includes('SHIPPED') && (
                <div style={{ marginBottom: '16px' }}>
                  <label
                    htmlFor="tracking"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#6B7280',
                      marginBottom: '8px',
                      whiteSpace: 'normal',
                      wordBreak: 'normal',
                    }}
                  >
                    Tracking Number (optional)
                  </label>
                  <input
                    type="text"
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    onFocus={() => setTrackingFocused(true)}
                    onBlur={() => setTrackingFocused(false)}
                    placeholder="Enter tracking number..."
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#2C2C2C',
                      backgroundColor: '#FAFAF8',
                      border: trackingFocused ? '1px solid #8e2157' : '1px solid #E8E6E3',
                      outline: 'none',
                      transition: 'border-color 200ms',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                {availableTransitions.map((status) => {
                  const isCancelled = status === 'CANCELLED'
                  if (isCancelled && showCancelForm) return null
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status as OrderStatus)}
                      disabled={updating}
                      style={{
                        padding: '12px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        border: isCancelled ? '1px solid #FECACA' : '1px solid #E8E6E3',
                        backgroundColor: isCancelled ? '#FEF2F2' : '#FAFAF8',
                        color: isCancelled ? '#991B1B' : '#8e2157',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        opacity: updating ? 0.5 : 1,
                        transition: 'all 200ms',
                        whiteSpace: 'nowrap',
                      }}
                      onMouseEnter={(e) => {
                        if (!updating) {
                          e.currentTarget.style.backgroundColor = isCancelled ? '#FEE2E2' : '#fdf2f8'
                          e.currentTarget.style.borderColor = isCancelled ? '#FCA5A5' : '#8e2157'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = isCancelled ? '#FEF2F2' : '#FAFAF8'
                        e.currentTarget.style.borderColor = isCancelled ? '#FECACA' : '#E8E6E3'
                      }}
                    >
                      {updating ? 'Updating...' : `Mark as ${getStatusDisplayName(status)}`}
                    </button>
                  )
                })}
              </div>

              {/* Cancellation reason form */}
              {showCancelForm && (
                <div
                  style={{
                    marginTop: '16px',
                    padding: '18px 20px',
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FECACA',
                  }}
                >
                  <label
                    htmlFor="cancelReason"
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#991B1B',
                      marginBottom: '8px',
                    }}
                  >
                    Reason for Cancellation
                  </label>
                  <textarea
                    id="cancelReason"
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    onFocus={() => setCancelReasonFocused(true)}
                    onBlur={() => setCancelReasonFocused(false)}
                    placeholder="Enter the reason for cancelling this order..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontSize: '14px',
                      color: '#2C2C2C',
                      backgroundColor: '#FFFFFF',
                      border: cancelReasonFocused ? '1px solid #DC2626' : '1px solid #FECACA',
                      outline: 'none',
                      transition: 'border-color 200ms',
                      boxSizing: 'border-box',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                    <button
                      onClick={() => handleStatusChange('CANCELLED' as OrderStatus)}
                      disabled={updating || !cancellationReason.trim()}
                      style={{
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: '#DC2626',
                        color: '#FFFFFF',
                        border: 'none',
                        cursor: updating || !cancellationReason.trim() ? 'not-allowed' : 'pointer',
                        opacity: updating || !cancellationReason.trim() ? 0.5 : 1,
                        transition: 'all 200ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!updating && cancellationReason.trim()) {
                          e.currentTarget.style.backgroundColor = '#B91C1C'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#DC2626'
                      }}
                    >
                      {updating ? 'Cancelling...' : 'Confirm Cancellation'}
                    </button>
                    <button
                      onClick={() => {
                        setShowCancelForm(false)
                        setCancellationReason('')
                      }}
                      disabled={updating}
                      style={{
                        padding: '10px 20px',
                        fontSize: '13px',
                        fontWeight: 500,
                        backgroundColor: 'transparent',
                        color: '#6B7280',
                        border: '1px solid #E8E6E3',
                        cursor: updating ? 'not-allowed' : 'pointer',
                        transition: 'all 200ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!updating) {
                          e.currentTarget.style.backgroundColor = '#F5F5F5'
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
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

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus, trackingNumber?: string, cancellationReason?: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, trackingNumber, cancellationReason })
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

  const handleItemCancel = async (orderId: string, itemId: string, reason: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/items/${itemId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'CANCELLED', reason })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to cancel item')
      }

      const data = await response.json()
      alert(data.message)

      // Refresh orders list and modal data
      fetchOrders()
      if (selectedOrderId === orderId) {
        fetchOrderDetails(orderId)
      }
    } catch (error) {
      console.error('Error cancelling item:', error)
      alert(error instanceof Error ? error.message : 'Failed to cancel item')
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
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
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
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            window.open(`/admin/orders/${order.id}/invoice`, '_blank')
                          }}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="Print Invoice"
                        >
                          <Printer size={18} style={{ color: '#8e2157' }} />
                        </button>
                      </div>
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
        onItemCancel={handleItemCancel}
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
