'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { CreditCard, Smartphone, Wallet, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

function PayStationPaymentContent() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [selectedMethod, setSelectedMethod] = useState<'bkash' | 'nagad' | 'card' | null>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get payment details from URL params
  const invoiceNumber = searchParams.get('invoice_number')
  const amount = searchParams.get('amount')
  const merchantId = searchParams.get('merchant_id')

  useEffect(() => {
    if (!invoiceNumber || !amount) {
      setError('Invalid payment session. Missing required parameters.')
    }
  }, [invoiceNumber, amount])

  const handlePayment = async (action: 'success' | 'fail' | 'cancel') => {
    setProcessing(true)
    setError(null)

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Build callback URL based on action
    let callbackUrl = ''

    if (action === 'success') {
      // Simulate successful payment callback with payment method
      const methodMap: Record<string, string> = {
        bkash: 'bKash',
        nagad: 'Nagad',
        card: 'Card',
      }
      const params = new URLSearchParams({
        invoice_number: invoiceNumber || '',
        status: 'Success',
        trx_id: `TXN${Date.now()}`,
        payment_method: selectedMethod ? methodMap[selectedMethod] : '',
      })
      callbackUrl = `/api/checkout/paystation/callback?${params.toString()}`
    } else if (action === 'fail') {
      // Route through callback so the order gets marked as FAILED
      const params = new URLSearchParams({
        invoice_number: invoiceNumber || '',
        status: 'Failed',
      })
      callbackUrl = `/api/checkout/paystation/callback?${params.toString()}`
    } else {
      // Cancel also routes through callback to mark as FAILED
      const params = new URLSearchParams({
        invoice_number: invoiceNumber || '',
        status: 'Cancelled',
      })
      callbackUrl = `/api/checkout/paystation/callback?${params.toString()}`
    }

    // Redirect to callback URL
    window.location.href = callbackUrl
  }

  const handleMethodSelect = (method: 'bkash' | 'nagad' | 'card') => {
    setSelectedMethod(method)
    setError(null)
  }

  const handleProceed = () => {
    if (!selectedMethod) {
      setError('Please select a payment method')
      return
    }
    handlePayment('success')
  }

  if (!invoiceNumber || !amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Invalid Payment Session</h1>
          <p className="text-gray-600 mb-6">Missing required payment parameters.</p>
          <button
            onClick={() => router.push('/checkout')}
            className="bg-burgundy text-white px-6 py-2 rounded-lg hover:bg-burgundy/90 transition"
          >
            Return to Checkout
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">PayStation Payment</h1>
            <div className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded-full">
              DEV MODE
            </div>
          </div>
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Order Number:</span>
              <span className="font-semibold text-gray-900">{invoiceNumber}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Merchant ID:</span>
              <span className="font-mono text-xs text-gray-900">{merchantId || 'SANDBOX'}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
              <span className="text-gray-900">Amount to Pay:</span>
              <span className="text-burgundy">৳{parseFloat(amount).toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Payment Method</h2>

          <div className="space-y-3">
            {/* bKash */}
            <button
              onClick={() => handleMethodSelect('bkash')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition ${
                selectedMethod === 'bkash'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-gray-200 hover:border-pink-300'
              }`}
            >
              <div className="w-12 h-12 bg-pink-500 rounded flex items-center justify-center flex-shrink-0">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">bKash</div>
                <div className="text-sm text-gray-500">Pay with bKash mobile wallet</div>
              </div>
              {selectedMethod === 'bkash' && (
                <CheckCircle className="h-6 w-6 text-pink-500" />
              )}
            </button>

            {/* Nagad */}
            <button
              onClick={() => handleMethodSelect('nagad')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition ${
                selectedMethod === 'nagad'
                  ? 'border-orange-500 bg-orange-50'
                  : 'border-gray-200 hover:border-orange-300'
              }`}
            >
              <div className="w-12 h-12 bg-orange-500 rounded flex items-center justify-center flex-shrink-0">
                <Wallet className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Nagad</div>
                <div className="text-sm text-gray-500">Pay with Nagad mobile wallet</div>
              </div>
              {selectedMethod === 'nagad' && (
                <CheckCircle className="h-6 w-6 text-orange-500" />
              )}
            </button>

            {/* Card */}
            <button
              onClick={() => handleMethodSelect('card')}
              className={`w-full p-4 border-2 rounded-lg flex items-center gap-4 transition ${
                selectedMethod === 'card'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="w-12 h-12 bg-blue-500 rounded flex items-center justify-center flex-shrink-0">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1 text-left">
                <div className="font-semibold text-gray-900">Debit/Credit Card</div>
                <div className="text-sm text-gray-500">Visa, Mastercard, Amex</div>
              </div>
              {selectedMethod === 'card' && (
                <CheckCircle className="h-6 w-6 text-blue-500" />
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}
        </div>

        {/* Dev Mode Actions */}
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-2 mb-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-900">Development Mode</h3>
              <p className="text-sm text-yellow-700">
                This is a mock PayStation interface for testing. Choose an action to simulate payment outcome.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleProceed}
              disabled={processing || !selectedMethod}
              className={`px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                processing || !selectedMethod
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Success
                </>
              )}
            </button>

            <button
              onClick={() => handlePayment('fail')}
              disabled={processing}
              className={`px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              Fail
            </button>

            <button
              onClick={() => handlePayment('cancel')}
              disabled={processing}
              className={`px-4 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                processing
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div className="text-center text-sm text-gray-500">
          <p className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secured by PayStation (Mock)
          </p>
        </div>
      </div>
    </div>
  )
}

export default function PayStationPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-burgundy mx-auto mb-4" />
          <p className="text-gray-600">Loading payment page...</p>
        </div>
      </div>
    }>
      <PayStationPaymentContent />
    </Suspense>
  )
}
