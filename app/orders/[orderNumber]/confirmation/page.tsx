import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Package, MapPin, CreditCard, Mail, Truck, Home } from 'lucide-react'
import { formatPrice, getPaymentMethodName } from '@/lib/order-utils'
import { OrderItem, OrderStatus } from '@/types/order'

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>
  searchParams: Promise<{ clearCart?: string }>
}

export const metadata: Metadata = {
  title: 'Order Confirmation | Aline Mart',
  description: 'Your order has been placed successfully',
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
  { key: 'PENDING', label: 'Order Placed', icon: CheckCircle2 },
  { key: 'PROCESSING', label: 'Processing', icon: Package },
  { key: 'SHIPPED', label: 'Shipped', icon: Truck },
  { key: 'DELIVERED', label: 'Delivered', icon: Home },
]

function getStepIndex(status: OrderStatus): number {
  if (status === 'CANCELLED') return -1
  const idx = ORDER_STEPS.findIndex((s) => s.key === status)
  return idx >= 0 ? idx : 0
}

export default async function OrderConfirmationPage({
  params,
  searchParams,
}: OrderConfirmationPageProps) {
  const { orderNumber } = await params
  const { clearCart } = await searchParams

  const order = await getOrderDetails(orderNumber)

  if (!order) {
    notFound()
  }

  const shouldClearCart = clearCart === 'true'
  const currentStepIndex = getStepIndex(order.status as OrderStatus)
  const isCancelled = order.status === 'CANCELLED'

  return (
    <div style={{ maxWidth: '900px', minWidth: '320px', margin: '0 auto', paddingTop: '120px', paddingBottom: '48px', paddingLeft: '16px', paddingRight: '16px' }}>
      {/* Success Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
            marginBottom: '24px',
          }}
        >
          <CheckCircle2 style={{ width: '48px', height: '48px', color: '#ffffff' }} />
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-serif, Playfair Display, serif)',
            fontSize: '2.25rem',
            fontWeight: 700,
            color: '#1a1a1a',
            marginBottom: '12px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
          }}
        >
          Order Confirmed!
        </h1>
        <p
          style={{
            fontSize: '1.125rem',
            color: '#8e2157',
            fontWeight: 600,
            marginBottom: '8px',
            whiteSpace: 'normal',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            lineHeight: 1.6,
          }}
        >
          Congratulations! Your order has been placed successfully. Our customer care team will get back to you soon.
        </p>
        <p
          style={{
            fontSize: '0.95rem',
            color: '#6B7280',
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
      </div>

      {/* Order Tracking Stepper */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px 24px',
          marginBottom: '32px',
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

      {/* Order Details Card */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          padding: '32px',
          marginBottom: '32px',
        }}
      >
        {/* Shipping Address */}
        <div style={{ paddingBottom: '24px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <MapPin style={{ width: '20px', height: '20px', color: '#8e2157' }} />
            <h2
              style={{
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1a1a1a',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Shipping Address
            </h2>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#374151', paddingLeft: '28px', lineHeight: 1.7 }}>
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

        {/* Payment Method */}
        <div style={{ paddingBottom: '24px', borderBottom: '1px solid #e5e7eb', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <CreditCard style={{ width: '20px', height: '20px', color: '#8e2157' }} />
            <h2
              style={{
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1a1a1a',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Payment Method
            </h2>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#374151', paddingLeft: '28px' }}>
            <p style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
              {getPaymentMethodName(order.paymentMethod)}
            </p>
            {order.paystationTransactionId && (
              <p style={{ fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', fontFamily: 'monospace', whiteSpace: 'normal', wordBreak: 'break-all', overflowWrap: 'break-word' }}>
                Transaction ID: {order.paystationTransactionId}
              </p>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Package style={{ width: '20px', height: '20px', color: '#8e2157' }} />
            <h2
              style={{
                fontWeight: 600,
                fontSize: '1rem',
                color: '#1a1a1a',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
              }}
            >
              Order Items
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {order.items.map((item: OrderItem) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ flex: 1 }}>
                  <p
                    style={{
                      fontWeight: 500,
                      color: '#1a1a1a',
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {item.productName}
                  </p>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      color: '#6B7280',
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
                      whiteSpace: 'normal',
                      wordBreak: 'break-word',
                      overflowWrap: 'break-word',
                    }}
                  >
                    {item.variantName}
                  </p>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>Qty: {item.quantity}</p>
                </div>
                <p style={{ fontWeight: 600, color: '#8e2157', whiteSpace: 'nowrap', marginLeft: '16px' }}>
                  {formatPrice(item.total)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Order Total */}
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '8px' }}>
            <span style={{ color: '#6B7280' }}>Subtotal</span>
            <span style={{ color: '#374151' }}>{formatPrice(order.total - order.shippingCost)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '16px' }}>
            <span style={{ color: '#6B7280' }}>Shipping</span>
            <span style={{ color: order.shippingCost === 0 ? '#16a34a' : '#374151' }}>
              {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '1.25rem',
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

      {/* Email Confirmation Notice */}
      <div
        style={{
          background: '#f0f4ff',
          border: '1px solid #c7d2fe',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <Mail style={{ width: '20px', height: '20px', color: '#4f46e5', flexShrink: 0, marginTop: '2px' }} />
        <div>
          <p
            style={{
              fontWeight: 600,
              color: '#312e81',
              marginBottom: '4px',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            Confirmation Email Sent
          </p>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#4338ca',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: 1.6,
            }}
          >
            We&apos;ve sent a confirmation email to{' '}
            <span style={{ fontWeight: 500 }}>{order.user.email}</span>.
            {order.paymentMethod === 'COD' &&
              ' You will receive tracking information once your order is shipped.'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '16px',
          justifyContent: 'center',
        }}
      >
        <Link
          href="/products"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 32px',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 500,
            color: '#374151',
            textDecoration: 'none',
            background: '#ffffff',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          Continue Shopping
        </Link>
        <Link
          href={`/orders/${order.orderNumber}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '14px 32px',
            border: 'none',
            borderRadius: '8px',
            fontSize: '0.95rem',
            fontWeight: 600,
            color: '#ffffff',
            textDecoration: 'none',
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
            whiteSpace: 'nowrap',
            transition: 'all 0.2s ease',
          }}
        >
          View Order Details
        </Link>
      </div>

      {shouldClearCart && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('cart-storage');
                window.dispatchEvent(new Event('storage'));
              } catch (e) {
                console.error('Failed to clear cart:', e);
              }
            `,
          }}
        />
      )}
    </div>
  )
}
