import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getPaymentMethodName, getOrderStatusColor } from '@/lib/order-utils'

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4">
            <Link href="/products">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Shopping
            </Link>
          </Button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif font-bold mb-2">Order Details</h1>
              <p className="text-gray-600">
                Order Number: <span className="font-mono font-semibold text-burgundy">{order.orderNumber}</span>
              </p>
              <p className="text-sm text-gray-500">Placed on {orderDate}</p>
            </div>
            <div>
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getOrderStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          </div>
        </div>

        {/* Order Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Shipping Address */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-burgundy" />
              <h2 className="font-semibold text-lg">Shipping Address</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p className="font-medium">{order.shippingAddress.fullName}</p>
              <p>{order.shippingAddress.addressLine1}</p>
              {order.shippingAddress.addressLine2 && (
                <p>{order.shippingAddress.addressLine2}</p>
              )}
              <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
              <p>{order.shippingAddress.country}</p>
              <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Information */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-burgundy" />
              <h2 className="font-semibold text-lg">Payment Information</h2>
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <div>
                <p className="text-gray-600">Payment Method</p>
                <p className="font-medium">{getPaymentMethodName(order.paymentMethod)}</p>
              </div>
              {order.paystationTransactionId && (
                <div>
                  <p className="text-gray-600">Transaction ID</p>
                  <p className="font-mono text-xs">{order.paystationTransactionId}</p>
                </div>
              )}
              <div className="pt-2 border-t border-gray-200">
                <p className="text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-burgundy">{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Package className="h-5 w-5 text-burgundy" />
            <h2 className="font-semibold text-lg">Order Items</h2>
          </div>

          <div className="space-y-6">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-start pb-6 border-b border-gray-200 last:border-0 last:pb-0">
                <div className="flex-1">
                  <h3 className="font-medium text-lg mb-1">{item.productName}</h3>
                  <p className="text-sm text-gray-600 mb-1">{item.brandName}</p>
                  <p className="text-sm text-gray-500 mb-2">{item.variantName}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-600">Quantity: <span className="font-medium">{item.quantity}</span></span>
                    <span className="text-gray-600">Price: <span className="font-medium">{formatPrice(item.price)}</span></span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-burgundy">{formatPrice(item.total)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 mt-6 pt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(order.total - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {order.shippingCost === 0 ? (
                  <span className="text-green-600">FREE</span>
                ) : (
                  formatPrice(order.shippingCost)
                )}
              </span>
            </div>
            <div className="flex justify-between text-2xl font-bold pt-3 border-t border-gray-200">
              <span>Total</span>
              <span className="text-burgundy">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
