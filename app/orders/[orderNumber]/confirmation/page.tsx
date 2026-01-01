import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CheckCircle2, Package, MapPin, CreditCard, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice, getPaymentMethodName } from '@/lib/order-utils'

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

  // Clear cart on client side if flag is set
  const shouldClearCart = clearCart === 'true'

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Order Confirmed!</h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order
          </p>
          <p className="text-gray-500">
            Order Number: <span className="font-mono font-semibold text-burgundy">{order.orderNumber}</span>
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white border border-gray-200 rounded-lg p-8 mb-8">
          {/* Order Status */}
          <div className="flex items-center gap-4 pb-6 border-b border-gray-200 mb-6">
            <Package className="h-6 w-6 text-burgundy" />
            <div>
              <p className="text-sm text-gray-600">Order Status</p>
              <p className="font-semibold text-lg capitalize">{order.status.toLowerCase()}</p>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold">Shipping Address</h2>
            </div>
            <div className="text-sm text-gray-700 pl-7">
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

          {/* Payment Method */}
          <div className="pb-6 border-b border-gray-200 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <h2 className="font-semibold">Payment Method</h2>
            </div>
            <div className="text-sm text-gray-700 pl-7">
              <p>{getPaymentMethodName(order.paymentMethod)}</p>
              {order.paystationTransactionId && (
                <p className="text-xs text-gray-500 mt-1">
                  Transaction ID: {order.paystationTransactionId}
                </p>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div className="mb-6">
            <h2 className="font-semibold mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item: any) => (
                <div key={item.id} className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-gray-600">{item.brandName}</p>
                    <p className="text-sm text-gray-500">{item.variantName}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold text-burgundy">{formatPrice(item.total)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Order Total */}
          <div className="border-t border-gray-200 pt-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatPrice(order.total - order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold pt-4 border-t border-gray-200">
              <span>Total</span>
              <span className="text-burgundy">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Email Confirmation Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="font-semibold text-blue-900 mb-1">Confirmation Email Sent</p>
              <p className="text-sm text-blue-700">
                We've sent a confirmation email to <span className="font-medium">{order.user.email}</span>.
                {order.paymentMethod === 'COD' && ' You will receive tracking information once your order is shipped.'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/products">Continue Shopping</Link>
          </Button>
          <Button asChild className="gradient-primary" size="lg">
            <Link href={`/orders/${order.orderNumber}`}>View Order Details</Link>
          </Button>
        </div>

        {shouldClearCart && (
          <script dangerouslySetInnerHTML={{
            __html: `
              try {
                localStorage.removeItem('cart-storage');
                window.dispatchEvent(new Event('storage'));
              } catch (e) {
                console.error('Failed to clear cart:', e);
              }
            `
          }} />
        )}
      </div>
    </div>
  )
}
