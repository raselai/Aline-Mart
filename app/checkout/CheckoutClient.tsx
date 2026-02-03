'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import ContactStep from './components/ContactStep'
import ShippingStep from './components/ShippingStep'
import PaymentStep from './components/PaymentStep'
import OrderSummary from './components/OrderSummary'
import type { ContactStepData, ShippingStepData, PaymentStepData, SavedAddress } from '@/types/checkout'

export default function CheckoutClient() {
  const router = useRouter()
  const { items } = useCart()
  const { isAuthenticated, userEmail } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)

  const [contactData, setContactData] = useState<ContactStepData>()
  const [shippingData, setShippingData] = useState<ShippingStepData>()
  const [paymentData, setPaymentData] = useState<PaymentStepData>()
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [saveAddress, setSaveAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  // Fetch saved addresses for authenticated users
  useEffect(() => {
    if (!isAuthenticated || !userEmail) return
    async function fetchAddresses() {
      try {
        const res = await fetch(`/api/addresses?email=${encodeURIComponent(userEmail!)}`)
        if (res.ok) {
          const data = await res.json()
          setSavedAddresses(data.addresses || [])
        }
      } catch {
        // silently fail
      }
    }
    fetchAddresses()
  }, [isAuthenticated, userEmail])

  if (items.length === 0) {
    return null
  }

  const handleContactComplete = (data: ContactStepData) => {
    setContactData(data)
    setCurrentStep(2)
  }

  const handleShippingComplete = (
    data: ShippingStepData,
    options?: { saveAddress?: boolean; selectedAddressId?: string | null }
  ) => {
    setShippingData(data)
    if (options) {
      setSaveAddress(options.saveAddress ?? false)
      setSelectedAddressId(options.selectedAddressId ?? null)
    }
    setCurrentStep(3)
  }

  const handlePaymentComplete = async (data: PaymentStepData) => {
    setPaymentData(data)
    setIsProcessing(true)

    try {
      // Format cart items for API
      const cartItems = items.map((item) => ({
        productId: item.productId,
        productName: item.name,
        brandName: item.brand,
        variantId: item.variantId,
        variantName: item.color && item.size ? `${item.color} / ${item.size}` : item.color || item.size || 'Standard',
        quantity: item.quantity,
        price: item.price,
        imageUrl: item.image,
        stock: item.stock,
      }))

      // Create order
      const orderResponse = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...contactData,
          ...shippingData,
          ...data,
          cartItems,
          saveAddress,
          selectedAddressId,
        }),
      })

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json()
        throw new Error(errorData.error || 'Failed to create order')
      }

      const { order } = await orderResponse.json()

      // If PayStation, initiate payment
      if (data.paymentMethod === 'PAYSTATION') {
        const paymentResponse = await fetch('/api/checkout/paystation/initiate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId: order.id }),
        })

        if (!paymentResponse.ok) {
          throw new Error('Failed to initiate payment')
        }

        const { paymentUrl } = await paymentResponse.json()

        // Redirect to PayStation
        window.location.href = paymentUrl
      } else {
        // Cash on Delivery - go to confirmation
        // Don't clearCart() here — it triggers the empty-cart useEffect redirect to /cart
        // Instead pass clearCart=true so the confirmation page clears it after loading
        window.location.href = `/orders/${order.orderNumber}/confirmation?clearCart=true`
      }
    } catch (error) {
      console.error('Checkout error:', error)
      alert(error instanceof Error ? error.message : 'Failed to process checkout. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32 pb-16">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-12">Checkout</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left: Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Step 1: Contact */}
            <ContactStep
              isActive={currentStep === 1}
              isComplete={!!contactData}
              data={contactData}
              onComplete={handleContactComplete}
              onEdit={() => setCurrentStep(1)}
            />

            {/* Step 2: Shipping */}
            <ShippingStep
              isActive={currentStep === 2}
              isComplete={!!shippingData}
              data={shippingData}
              onComplete={handleShippingComplete}
              onEdit={() => setCurrentStep(2)}
              disabled={!contactData}
              savedAddresses={isAuthenticated ? savedAddresses : undefined}
              isAuthenticated={isAuthenticated}
            />

            {/* Step 3: Payment */}
            <PaymentStep
              isActive={currentStep === 3}
              isComplete={!!paymentData}
              data={paymentData}
              onComplete={handlePaymentComplete}
              onEdit={() => setCurrentStep(3)}
              disabled={!shippingData}
              isProcessing={isProcessing}
            />
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary paymentMethod={paymentData?.paymentMethod} />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
