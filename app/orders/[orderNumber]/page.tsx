import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, MapPin, CreditCard, CheckCircle2, Truck, Home } from 'lucide-react'
import { formatPrice, getPaymentMethodName } from '@/lib/order-utils'
import { OrderItem, OrderStatus } from '@/types/order'

interface OrderPageProps {
  params: Promise<{ orderNumber: string }>
}

export const metadata: Metadata = {
  title: 'Order Details | Aline Mart',
  description: 'View your order details and tracking information',
}

async function getOrderDetails(orderNumber: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/orders/${orderNumber}`,
      { cache: 'no-store' }
    )

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    return data.order
  } catch (error) {
    console.error('Error fetching order:', error)
    return null
  }
}

const ORDER_STEPS: { key: OrderStatus; label: string; icon: typeof Package }[] = [
  { key: 'NEW', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'PENDING', label: 'Pending', icon: Package },
  { key: 'CONFIRM', label: 'Confirmed', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
]

function getStepIndex(status: OrderStatus): number {
  if (status === 'CANCEL') return -1
  const idx = ORDER_STEPS.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

function getStatusInlineStyle(status: string): React.CSSProperties {
  const base = { padding: '6px 16px', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600 } as const
  const styles: Record<string, React.CSSProperties> = {
    NEW: { ...base, background: '#e0f2fe', color: '#0c4a6e' },
    PENDING: { ...base, background: '#fef9c3', color: '#854d0e' },
    CONFIRM: { ...base, background: '#dcfce7', color: '#166534' },
    CANCEL: { ...base, background: '#fee2e2', color: '#991b1b' },
    RETURN: { ...base, background: '#ffedd5', color: '#9a3412' },
    REFUND: { ...base, background: '#f3e8ff', color: '#6b21a8' },
    PARTIAL_CONFIRMED: { ...base, background: '#fef3c7', color: '#92400e' },
    DELIVERED: { ...base, background: '#dcfce7', color: '#166534' },
    RETURN_TO_VENDOR: { ...base, background: '#ffe4e6', color: '#9f1239' },
  }
  return styles[status] || { ...base, background: '#f3f4f6', color: '#374151' }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { orderNumber } = await params
  const order = await getOrderDetails(orderNumber)

  if (!order) {
    notFound()
  }

  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const currentStepIndex = getStepIndex(order.status as OrderStatus)
  const isCancelled = order.status === 'CANCEL'

  return (
    <div style={{ maxWidth: '960px', minWidth: '320px', margin: '0 auto', padding: '32px 16px' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <Link
          href="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.875rem',
            color: '#6B7280',
            textDecoration: 'none',
            marginBottom: '16px',
            padding: '8px 0',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          <span>Back to Shopping</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1
              style={{
                fontFamily: 'var(--font-serif, Playfair Display, serif)',
                fontSize: '1.875rem',
                fontWeight: 700,
                color: '#1a1a1a',
                marginBottom: '8px',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Order Details
            </h1>
            <p
              style={{
                color: '#6B7280',
                fontSize: '0.95rem',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Order Number:{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#8e2157' }}>
                {order.orderNumber}
              </span>
            </p>
            <p
              style={{
                fontSize: '0.875rem',
                color: '#9ca3af',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Placed on {orderDate}
            </p>
          </div>
          <span style={getStatusInlineStyle(order.status)}>
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Tracking Stepper */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px 24px',
          marginBottom: '24px',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-serif, Playfair Display, serif)',
            fontSize: '1.125rem',
            fontWeight: 600,
            marginBottom: '28px',
            color: '#1a1a1a',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Order Progress
        </h2>
        {isCancelled ? (
          <div
            style={{
              textAlign: 'center',
              padding: '16px',
              background: '#fef2f2',
              borderRadius: '8px',
              color: '#991b1b',
              fontWeight: 600,
            }}
          >
            This order has been cancelled.
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative' }}>
            {/* Progress line behind steps */}
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '40px',
                right: '40px',
                height: '3px',
                background: '#e5e7eb',
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: 'absolute',
                top: '20px',
                left: '40px',
                width: `${currentStepIndex >= ORDER_STEPS.length - 1 ? 100 : (currentStepIndex / (ORDER_STEPS.length - 1)) * 100}%`,
                maxWidth: 'calc(100% - 80px)',
                height: '3px',
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                zIndex: 1,
                transition: 'width 0.5s ease',
              }}
            />
            {ORDER_STEPS.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex
              const StepIcon = step.icon
              return (
                <div
                  key={step.key}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    flex: 1,
                    position: 'relative',
                    zIndex: 2,
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isCompleted
                        ? 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                        : '#ffffff',
                      border: isCompleted ? 'none' : '2px solid #d1d5db',
                      boxShadow: isCurrent ? '0 0 0 4px rgba(142, 33, 87, 0.15)' : 'none',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <StepIcon
                      style={{
                        width: '18px',
                        height: '18px',
                        color: isCompleted ? '#ffffff' : '#9ca3af',
                      }}
                    />
                  </div>
                  <span
                    style={{
                      marginTop: '8px',
                      fontSize: '0.75rem',
                      fontWeight: isCurrent ? 700 : isCompleted ? 600 : 400,
                      color: isCompleted ? '#8e2157' : '#9ca3af',
                      textAlign: 'center',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {step.label}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Order Information Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '24px' }}>
        {/* Shipping Address */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MapPin style={{ width: '20px', height: '20px', color: '#8e2157' }} />
            <h2
              style={{
                fontWeight: 600,
                fontSize: '1.05rem',
                color: '#1a1a1a',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Shipping Address
            </h2>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
            <p style={{ fontWeight: 500, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {order.shippingAddress.fullName}
            </p>
            <p style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {order.shippingAddress.addressLine1}
            </p>
            {order.shippingAddress.addressLine2 && (
              <p style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {order.shippingAddress.addressLine2}
              </p>
            )}
            <p style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
            </p>
            <p style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {order.shippingAddress.country}
            </p>
            <p style={{ marginTop: '8px', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              Phone: {order.shippingAddress.phone}
            </p>
          </div>
        </div>

        {/* Payment Information */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <CreditCard style={{ width: '20px', height: '20px', color: '#8e2157' }} />
            <h2
              style={{
                fontWeight: 600,
                fontSize: '1.05rem',
                color: '#1a1a1a',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Payment Information
            </h2>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#374151', lineHeight: 1.7 }}>
            <div>
              <p style={{ color: '#6B7280', fontSize: '0.8rem', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                Payment Method
              </p>
              <p style={{ fontWeight: 500, whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {getPaymentMethodName(order.paymentMethod)}
              </p>
            </div>
            {order.paystationTransactionId && (
              <div style={{ marginTop: '12px' }}>
                <p style={{ color: '#6B7280', fontSize: '0.8rem', whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                  Transaction ID
                </p>
                <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', whiteSpace: 'normal', wordBreak: 'break-all', overflowWrap: 'break-word' }}>
                  {order.paystationTransactionId}
                </p>
              </div>
            )}
            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #e5e7eb' }}>
              <p style={{ color: '#6B7280', fontSize: '0.8rem' }}>Total Paid</p>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, color: '#8e2157' }}>
                {formatPrice(order.total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          <Package style={{ width: '20px', height: '20px', color: '#8e2157' }} />
          <h2
            style={{
              fontWeight: 600,
              fontSize: '1.05rem',
              color: '#1a1a1a',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            Order Items
          </h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {order.items.map((item: OrderItem, index: number) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                paddingBottom: index < order.items.length - 1 ? '24px' : '0',
                borderBottom: index < order.items.length - 1 ? '1px solid #e5e7eb' : 'none',
              }}
            >
              <div style={{ flex: 1 }}>
                <h3
                  style={{
                    fontWeight: 500,
                    fontSize: '1.05rem',
                    color: '#1a1a1a',
                    marginBottom: '4px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {item.productName}
                </h3>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#6B7280',
                    marginBottom: '4px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {item.brandName}
                </p>
                <p
                  style={{
                    fontSize: '0.875rem',
                    color: '#9ca3af',
                    marginBottom: '8px',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word',
                  }}
                >
                  {item.variantName}
                </p>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem' }}>
                  <span style={{ color: '#6B7280' }}>
                    Quantity: <span style={{ fontWeight: 500, color: '#374151' }}>{item.quantity}</span>
                  </span>
                  <span style={{ color: '#6B7280' }}>
                    Price: <span style={{ fontWeight: 500, color: '#374151' }}>{formatPrice(item.price)}</span>
                  </span>
                </div>
              </div>
              <div style={{ textAlign: 'right', marginLeft: '16px' }}>
                <p style={{ fontSize: '1.125rem', fontWeight: 700, color: '#8e2157', whiteSpace: 'nowrap' }}>
                  {formatPrice(item.total)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '24px', paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Subtotal</span>
            <span style={{ fontWeight: 500, color: '#374151' }}>{formatPrice(order.total - order.shippingCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '16px' }}>
            <span style={{ color: '#6B7280' }}>Shipping</span>
            <span style={{ fontWeight: 500, color: order.shippingCost === 0 ? '#16a34a' : '#374151' }}>
              {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.5rem',
              fontWeight: 700,
              paddingTop: '16px',
              borderTop: '1px solid #e5e7eb',
            }}
          >
            <span style={{ color: '#1a1a1a' }}>Total</span>
            <span style={{ color: '#8e2157' }}>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
