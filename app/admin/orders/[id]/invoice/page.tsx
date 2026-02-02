'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Printer, ArrowLeft } from 'lucide-react'
import { formatPrice, getPaymentMethodName, getStatusDisplayName } from '@/lib/order-utils'
import type { OrderWithDetails } from '@/types/order'
import { useParams } from 'next/navigation'

export default function InvoicePage() {
  const params = useParams()
  const id = params.id as string
  const [order, setOrder] = useState<OrderWithDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`/api/admin/orders/${id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }
        const data = await response.json()
        setOrder(data.order)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load order')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOrder()
  }, [id])

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <p style={{ color: '#6B7280', fontSize: '16px' }}>Loading invoice...</p>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', flexDirection: 'column', gap: '16px' }}>
        <p style={{ color: '#991B1B', fontSize: '16px' }}>{error || 'Order not found'}</p>
        <button
          onClick={() => window.close()}
          style={{
            padding: '10px 20px',
            fontSize: '14px',
            border: '1px solid #E8E6E3',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    )
  }

  const subtotal = order.total - (order.shippingCost || 0)
  const orderDate = new Date(order.createdAt)

  return (
    <>
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          @page {
            size: A4;
            margin: 15mm 20mm;
          }
          .invoice-container {
            box-shadow: none !important;
            border: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: 100% !important;
          }
        }
        @media screen {
          body {
            background: #F5F5F5;
          }
        }
      `}</style>

      {/* Print Controls - hidden in print */}
      <div
        className="no-print"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E8E6E3',
          padding: '12px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}
      >
        <button
          onClick={() => window.close()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            fontSize: '14px',
            color: '#6B7280',
            border: '1px solid #E8E6E3',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft style={{ width: '16px', height: '16px' }} />
          Back
        </button>
        <button
          onClick={() => window.print()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 24px',
            fontSize: '14px',
            fontWeight: 600,
            color: '#FFFFFF',
            background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
            border: 'none',
            cursor: 'pointer',
            letterSpacing: '0.5px',
          }}
        >
          <Printer style={{ width: '16px', height: '16px' }} />
          Print Invoice
        </button>
      </div>

      {/* Invoice */}
      <div
        className="invoice-container"
        style={{
          maxWidth: '800px',
          margin: '32px auto',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #E8E6E3',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '40px 48px 32px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '3px solid #8e2157',
          }}
        >
          <div>
            <Image
              src="/Logo.png"
              alt="Aline Mart"
              width={160}
              height={48}
              style={{ height: 'auto', maxWidth: '160px' }}
              priority
            />
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '8px' }}>
              Luxury Multi-Brand Marketplace
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <h1
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '32px',
                fontWeight: 400,
                color: '#8e2157',
                margin: 0,
                letterSpacing: '4px',
                textTransform: 'uppercase',
              }}
            >
              Invoice
            </h1>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#2C2C2C', marginTop: '8px' }}>
              #{order.orderNumber}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '4px' }}>
              {orderDate.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>

        {/* Bill To / Ship To */}
        <div
          style={{
            padding: '32px 48px',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            borderBottom: '1px solid #E8E6E3',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#9CA3AF',
                marginBottom: '12px',
              }}
            >
              Bill To
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C2C2C', margin: 0 }}>
              {order.user.name}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
              {order.user.email}
            </p>
          </div>
          <div>
            <p
              style={{
                fontSize: '10px',
                fontWeight: 600,
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: '#9CA3AF',
                marginBottom: '12px',
              }}
            >
              Ship To
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#2C2C2C', margin: 0 }}>
              {order.shippingAddress.fullName}
            </p>
            <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0', lineHeight: 1.6 }}>
              {order.shippingAddress.addressLine1}
              {order.shippingAddress.addressLine2 && (
                <><br />{order.shippingAddress.addressLine2}</>
              )}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              <br />
              {order.shippingAddress.country}
            </p>
            {order.shippingAddress.phone && (
              <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>
                Phone: {order.shippingAddress.phone}
              </p>
            )}
          </div>
        </div>

        {/* Items Table */}
        <div style={{ padding: '0 48px' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '14px',
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: '2px solid #E8E6E3',
                }}
              >
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 0',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    width: '40px',
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: '16px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                  }}
                >
                  Product
                </th>
                <th
                  style={{
                    textAlign: 'center',
                    padding: '16px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    width: '60px',
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '16px 8px',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    width: '110px',
                  }}
                >
                  Unit Price
                </th>
                <th
                  style={{
                    textAlign: 'right',
                    padding: '16px 0',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '2px',
                    textTransform: 'uppercase',
                    color: '#9CA3AF',
                    width: '110px',
                  }}
                >
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item, index) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #F3F4F6',
                  }}
                >
                  <td
                    style={{
                      padding: '16px 0',
                      color: '#9CA3AF',
                      verticalAlign: 'top',
                      fontSize: '13px',
                    }}
                  >
                    {index + 1}
                  </td>
                  <td style={{ padding: '16px 8px', verticalAlign: 'top' }}>
                    <p style={{ fontWeight: 500, color: '#2C2C2C', margin: 0 }}>
                      {item.productName}
                    </p>
                    <p
                      style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#8e2157',
                        margin: '2px 0 0',
                        letterSpacing: '0.3px',
                      }}
                    >
                      {item.brandName}
                    </p>
                    {item.variantName && (
                      <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>
                        {item.variantName}
                      </p>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '16px 8px',
                      textAlign: 'center',
                      color: '#2C2C2C',
                      verticalAlign: 'top',
                    }}
                  >
                    {item.quantity}
                  </td>
                  <td
                    style={{
                      padding: '16px 8px',
                      textAlign: 'right',
                      color: '#6B7280',
                      verticalAlign: 'top',
                    }}
                  >
                    {formatPrice(item.price)}
                  </td>
                  <td
                    style={{
                      padding: '16px 0',
                      textAlign: 'right',
                      fontWeight: 600,
                      color: '#2C2C2C',
                      verticalAlign: 'top',
                    }}
                  >
                    {formatPrice(item.total)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div
          style={{
            padding: '24px 48px 32px',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <div style={{ width: '260px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '14px',
              }}
            >
              <span style={{ color: '#6B7280' }}>Subtotal</span>
              <span style={{ fontWeight: 500, color: '#2C2C2C' }}>{formatPrice(subtotal)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '14px',
              }}
            >
              <span style={{ color: '#6B7280' }}>Shipping</span>
              <span style={{ fontWeight: 500, color: '#2C2C2C' }}>{formatPrice(order.shippingCost || 0)}</span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '14px 0 0',
                marginTop: '8px',
                borderTop: '2px solid #2C2C2C',
                fontSize: '18px',
              }}
            >
              <span
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontWeight: 400,
                  color: '#2C2C2C',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}
              >
                Total
              </span>
              <span
                style={{
                  fontFamily: 'Playfair Display, Georgia, serif',
                  fontWeight: 600,
                  color: '#8e2157',
                }}
              >
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '24px 48px 40px',
            borderTop: '1px solid #E8E6E3',
            backgroundColor: '#FAFAF8',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '24px',
              marginBottom: '24px',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  marginBottom: '8px',
                }}
              >
                Payment Method
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#2C2C2C', margin: 0 }}>
                {getPaymentMethodName(order.paymentMethod)}
              </p>
              {order.paystationTransactionId && (
                <p style={{ fontSize: '12px', color: '#6B7280', margin: '4px 0 0' }}>
                  Transaction: {order.paystationTransactionId}
                </p>
              )}
            </div>
            <div>
              <p
                style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '2px',
                  textTransform: 'uppercase',
                  color: '#9CA3AF',
                  marginBottom: '8px',
                }}
              >
                Order Status
              </p>
              <p style={{ fontSize: '14px', fontWeight: 500, color: '#2C2C2C', margin: 0 }}>
                {getStatusDisplayName(order.status)}
              </p>
            </div>
          </div>

          <div
            style={{
              paddingTop: '20px',
              borderTop: '1px solid #E8E6E3',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'Playfair Display, Georgia, serif',
                fontSize: '16px',
                fontWeight: 400,
                color: '#2C2C2C',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              Thank you for shopping with Aline Mart
            </p>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '8px 0 0' }}>
              support@alinemart.com
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
