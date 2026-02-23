'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
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
  const customCallbackUrl = searchParams.get('callback_url')

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
    const baseCallbackPath = customCallbackUrl || '/api/checkout/paystation/callback'
    let callbackUrl = ''

    if (action === 'success') {
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
      callbackUrl = `${baseCallbackPath}?${params.toString()}`
    } else if (action === 'fail') {
      const params = new URLSearchParams({
        invoice_number: invoiceNumber || '',
        status: 'Failed',
      })
      callbackUrl = `${baseCallbackPath}?${params.toString()}`
    } else {
      const params = new URLSearchParams({
        invoice_number: invoiceNumber || '',
        status: 'Cancelled',
      })
      callbackUrl = `${baseCallbackPath}?${params.toString()}`
    }

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
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#F5F5F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            padding: '32px',
            maxWidth: '600px',
            minWidth: '320px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          <AlertCircle size={64} color="#EF4444" style={{ margin: '0 auto 16px' }} />
          <h1
            style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              color: '#2C2C2C',
              marginBottom: '8px',
              whiteSpace: 'nowrap',
            }}
          >
            Invalid Payment Session
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: '#6B7280',
              marginBottom: '24px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            Missing required payment parameters.
          </p>
          <button
            onClick={() => router.push('/checkout')}
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Return to Checkout
          </button>
        </div>
      </div>
    )
  }

  const methodOptions: { key: 'bkash' | 'nagad' | 'card'; label: string; desc: string; color: string; Icon: typeof Smartphone }[] = [
    { key: 'bkash', label: 'bKash', desc: 'Pay with bKash mobile wallet', color: '#EC4899', Icon: Smartphone },
    { key: 'nagad', label: 'Nagad', desc: 'Pay with Nagad mobile wallet', color: '#F97316', Icon: Wallet },
    { key: 'card', label: 'Debit/Credit Card', desc: 'Visa, Mastercard, Amex', color: '#3B82F6', Icon: CreditCard },
  ]

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        padding: 'clamp(120px, 15vw, 200px) 16px 32px',
      }}
    >
      <div
        style={{
          maxWidth: '600px',
          minWidth: '320px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
            }}
          >
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#2C2C2C',
                margin: 0,
                whiteSpace: 'nowrap',
              }}
            >
              PayStation Payment
            </h1>
            <span
              style={{
                backgroundColor: '#FEF9C3',
                color: '#854D0E',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '20px',
                whiteSpace: 'nowrap',
              }}
            >
              DEV MODE
            </span>
          </div>

          <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
                marginBottom: '8px',
              }}
            >
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Order Number:</span>
              <span
                style={{
                  fontWeight: 600,
                  color: '#2C2C2C',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                  textAlign: 'right',
                  maxWidth: '60%',
                  fontSize: '0.8rem',
                }}
              >
                {invoiceNumber}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.875rem',
                marginBottom: '12px',
              }}
            >
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Merchant ID:</span>
              <span
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
                  fontSize: '0.75rem',
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap',
                }}
              >
                {merchantId || 'SANDBOX'}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #E5E7EB',
                paddingTop: '12px',
              }}
            >
              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#2C2C2C', whiteSpace: 'nowrap' }}>
                Amount to Pay:
              </span>
              <span style={{ fontSize: '1.25rem', fontWeight: 700, color: '#8e2157', whiteSpace: 'nowrap' }}>
                ৳{parseFloat(amount).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              fontSize: '1.1rem',
              fontWeight: 600,
              color: '#2C2C2C',
              margin: '0 0 16px',
              whiteSpace: 'nowrap',
            }}
          >
            Select Payment Method
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {methodOptions.map(({ key, label, desc, color, Icon }) => {
              const isSelected = selectedMethod === key
              return (
                <button
                  key={key}
                  onClick={() => handleMethodSelect(key)}
                  style={{
                    width: '100%',
                    padding: '16px',
                    border: `2px solid ${isSelected ? color : '#E5E7EB'}`,
                    borderRadius: '10px',
                    backgroundColor: isSelected ? `${color}10` : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    transition: 'border-color 200ms ease',
                  }}
                >
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: color,
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Icon size={24} color="#FFFFFF" />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left', minWidth: 0 }}>
                    <div
                      style={{
                        fontWeight: 600,
                        color: '#2C2C2C',
                        fontSize: '0.95rem',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8rem',
                        color: '#6B7280',
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal',
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                  {isSelected && <CheckCircle size={24} color={color} style={{ flexShrink: 0 }} />}
                </button>
              )
            })}
          </div>

          {error && (
            <div
              style={{
                marginTop: '16px',
                padding: '12px',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <AlertCircle size={18} color="#EF4444" style={{ flexShrink: 0, marginTop: '1px' }} />
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#B91C1C',
                  margin: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Dev Mode Actions */}
        <div
          style={{
            backgroundColor: '#FEFCE8',
            border: '2px solid #FDE68A',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
            minWidth: '280px',
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '16px' }}>
            <AlertCircle size={18} color="#CA8A04" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
              <h3
                style={{
                  fontWeight: 600,
                  color: '#713F12',
                  fontSize: '0.95rem',
                  margin: '0 0 4px',
                  whiteSpace: 'nowrap',
                }}
              >
                Development Mode
              </h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: '#A16207',
                  margin: 0,
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  display: 'block',
                  minWidth: '100%',
                }}
              >
                This is a mock PayStation interface for testing. Choose an action to simulate payment outcome.
              </p>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
            }}
          >
            {/* Success Button */}
            <button
              onClick={handleProceed}
              disabled={processing || !selectedMethod}
              style={{
                padding: '12px 8px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: processing || !selectedMethod ? 'not-allowed' : 'pointer',
                backgroundColor: processing || !selectedMethod ? '#D1D5DB' : '#22C55E',
                color: processing || !selectedMethod ? '#6B7280' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'opacity 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              {processing ? (
                <>
                  <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                  Wait...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Success
                </>
              )}
            </button>

            {/* Fail Button */}
            <button
              onClick={() => handlePayment('fail')}
              disabled={processing}
              style={{
                padding: '12px 8px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: processing ? 'not-allowed' : 'pointer',
                backgroundColor: processing ? '#D1D5DB' : '#EF4444',
                color: processing ? '#6B7280' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'opacity 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              <AlertCircle size={16} />
              Fail
            </button>

            {/* Cancel Button */}
            <button
              onClick={() => handlePayment('cancel')}
              disabled={processing}
              style={{
                padding: '12px 8px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: processing ? 'not-allowed' : 'pointer',
                backgroundColor: processing ? '#D1D5DB' : '#6B7280',
                color: processing ? '#6B7280' : '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'opacity 200ms ease',
                whiteSpace: 'nowrap',
              }}
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Security Badge */}
        <div style={{ textAlign: 'center' }}>
          <p
            style={{
              fontSize: '0.8rem',
              color: '#6B7280',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <svg style={{ width: '16px', height: '16px' }} fill="currentColor" viewBox="0 0 20 20">
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
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            backgroundColor: '#F5F5F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Loader2
              size={32}
              style={{ animation: 'spin 1s linear infinite', color: '#8e2157', margin: '0 auto 16px' }}
            />
            <p
              style={{
                fontSize: '0.875rem',
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Loading payment page...
            </p>
          </div>
        </div>
      }
    >
      <PayStationPaymentContent />
    </Suspense>
  )
}
