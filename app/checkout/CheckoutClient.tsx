'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useVirtualCard } from '@/hooks/useVirtualCard'
import ContactStep from './components/ContactStep'
import ShippingStep from './components/ShippingStep'
import PaymentStep from './components/PaymentStep'
import OrderSummary from './components/OrderSummary'
import type { ContactStepData, ShippingStepData, PaymentStepData, SavedAddress } from '@/types/checkout'

export default function CheckoutClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, subtotal } = useCart()
  const { isAuthenticated, userEmail } = useAuth()
  const { card: virtualCard, fetchCard, discountPercent: vcDiscount } = useVirtualCard()
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const [contactData, setContactData] = useState<ContactStepData>()
  const [shippingData, setShippingData] = useState<ShippingStepData>()
  const [paymentData, setPaymentData] = useState<PaymentStepData>()
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([])
  const [saveAddress, setSaveAddress] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null)

  // Show payment failure/error message from PayStation callback redirect
  useEffect(() => {
    const paymentStatus = searchParams.get('payment')
    if (paymentStatus === 'failed') {
      setPaymentError('Your payment was not completed. Please try again or choose a different payment method.')
      // Clean the URL param without a full navigation
      router.replace('/checkout', { scroll: false })
    } else if (paymentStatus === 'error') {
      setPaymentError('Something went wrong during payment processing. Please try again.')
      router.replace('/checkout', { scroll: false })
    }
  }, [searchParams, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      router.push('/cart')
    }
  }, [items.length, router])

  // Fetch virtual card for authenticated users
  useEffect(() => {
    if (isAuthenticated && userEmail) {
      fetchCard(userEmail)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, userEmail])

  // Fetch saved addresses for authenticated users and auto-fill from default
  useEffect(() => {
    if (!isAuthenticated || !userEmail) return
    async function fetchAddresses() {
      try {
        const res = await fetch(`/api/addresses?email=${encodeURIComponent(userEmail!)}`)
        if (res.ok) {
          const data = await res.json()
          const addresses: SavedAddress[] = data.addresses || []
          setSavedAddresses(addresses)

          // Auto-fill from default address if no data entered yet
          const defaultAddr = addresses.find((a) => a.isDefault)
          if (defaultAddr && !contactData && !shippingData) {
            setContactData({
              email: userEmail!,
              phone: defaultAddr.phone,
            })
            setShippingData({
              fullName: defaultAddr.fullName,
              addressLine1: defaultAddr.addressLine1,
              addressLine2: defaultAddr.addressLine2 || '',
              city: defaultAddr.city,
              state: defaultAddr.state,
              zipCode: defaultAddr.zipCode,
              country: 'Bangladesh',
            })
            setSelectedAddressId(defaultAddr.id)
            setCurrentStep(3)
          }
        }
      } catch {
        // silently fail
      }
    }
    fetchAddresses()
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // COD and VIRTUAL_CARD both go straight to confirmation
        // VIRTUAL_CARD payment is processed server-side in create-order
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

          {paymentError && (
            <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
              <div className="flex-1">
                <p className="text-sm font-medium text-red-800">{paymentError}</p>
              </div>
              <button
                onClick={() => setPaymentError(null)}
                className="text-red-400 hover:text-red-600 transition-colors"
                aria-label="Dismiss"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}

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
              virtualCard={isAuthenticated ? virtualCard : null}
              orderSubtotal={subtotal}
            />
          </div>

          {/* Right: Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              virtualCardDiscount={paymentData?.paymentMethod === 'VIRTUAL_CARD' ? vcDiscount : 0}
            />
          </div>
        </div>
        </div>
      </div>
    </div>
  )
}
