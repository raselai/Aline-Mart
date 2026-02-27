'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentStepSchema, type PaymentStepData } from '@/types/checkout'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Edit2, CreditCard, Banknote, Loader2, Wallet } from 'lucide-react'
import type { SignatureCard } from '@/types/signature-card'

interface PaymentStepProps {
  isActive: boolean
  isComplete: boolean
  disabled: boolean
  isProcessing: boolean
  data?: PaymentStepData
  onComplete: (data: PaymentStepData) => void
  onEdit: () => void
  signatureCards: SignatureCard[]
  orderSubtotal?: number
  selectedSignatureCard: SignatureCard | null
  onSelectSignatureCard: (card: SignatureCard | null) => void
  otpVerified: boolean
  otpId: string | null
  onOtpVerified: (otpId: string) => void
}

export default function PaymentStep({
  isActive,
  isComplete,
  disabled,
  isProcessing,
  data,
  onComplete,
  onEdit,
  signatureCards,
  orderSubtotal = 0,
  selectedSignatureCard,
  onSelectSignatureCard,
  otpVerified,
  otpId,
  onOtpVerified,
}: PaymentStepProps) {
  const [otpSending, setOtpSending] = useState(false)
  const [otpSent, setOtpSent] = useState(false)
  const [otpCode, setOtpCode] = useState('')
  const [otpVerifying, setOtpVerifying] = useState(false)
  const [otpError, setOtpError] = useState<string | null>(null)
  const [maskedEmail, setMaskedEmail] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PaymentStepData>({
    resolver: zodResolver(paymentStepSchema),
    defaultValues: data,
  })

  const selectedPaymentMethod = watch('paymentMethod')

  const handleCardSelect = (card: SignatureCard) => {
    onSelectSignatureCard(card)
    setValue('signatureCardNumber', card.cardNumber)
    // Reset OTP state when switching cards
    setOtpSent(false)
    setOtpCode('')
    setOtpError(null)
  }

  const handleSendOTP = async () => {
    if (!selectedSignatureCard) return
    setOtpSending(true)
    setOtpError(null)

    try {
      const res = await fetch('/api/signature-card/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardNumber: selectedSignatureCard.cardNumber }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Failed to send OTP')

      setOtpSent(true)
      setMaskedEmail(result.maskedEmail || null)
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to send OTP')
    } finally {
      setOtpSending(false)
    }
  }

  const handleVerifyOTP = async () => {
    if (!selectedSignatureCard || !otpCode) return
    setOtpVerifying(true)
    setOtpError(null)

    try {
      const res = await fetch('/api/signature-card/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardNumber: selectedSignatureCard.cardNumber,
          otpCode,
        }),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Verification failed')

      onOtpVerified(result.otpId)
      setValue('discountOtpId', result.otpId)
    } catch (err) {
      setOtpError(err instanceof Error ? err.message : 'Failed to verify OTP')
    } finally {
      setOtpVerifying(false)
    }
  }

  const onSubmit = (formData: PaymentStepData) => {
    if (formData.paymentMethod === 'SIGNATURE_CARD') {
      if (!selectedSignatureCard) {
        setOtpError('Please select a card')
        return
      }
      if (!otpVerified || !otpId) {
        setOtpError('Please verify OTP before proceeding')
        return
      }
      formData.signatureCardNumber = selectedSignatureCard.cardNumber
      formData.discountOtpId = otpId
    }
    onComplete(formData)
  }

  if (isComplete && !isActive) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Payment Method</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-medium">
            {data?.paymentMethod === 'PAYSTATION'
              ? 'PayStation (bKash / Nagad / Cards)'
              : data?.paymentMethod === 'SIGNATURE_CARD'
              ? `Signature Card (****${selectedSignatureCard?.cardNumber.slice(-4) || ''})`
              : 'Cash on Delivery (COD)'}
          </p>
        </div>
      </div>
    )
  }

  const hasSignatureCards = signatureCards.length > 0

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-burgundy bg-white' : disabled ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${isActive ? 'bg-burgundy' : 'bg-gray-400'}`}>
          3
        </div>
        <h3 className="text-lg font-semibold">Payment Method</h3>
      </div>

      {isActive && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* PayStation Option */}
          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-burgundy ${
              selectedPaymentMethod === 'PAYSTATION'
                ? 'border-burgundy bg-burgundy bg-opacity-5'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              value="PAYSTATION"
              {...register('paymentMethod')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-5 w-5 text-burgundy" />
                <span className="font-semibold">PayStation</span>
              </div>
              <p className="text-sm text-gray-600">
                Pay securely with bKash, Nagad, or Credit/Debit Cards
              </p>
              <div className="flex gap-2 mt-2">
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">bKash</div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Nagad</div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Cards</div>
              </div>
            </div>
          </label>

          {/* Cash on Delivery Option */}
          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-burgundy ${
              selectedPaymentMethod === 'COD'
                ? 'border-burgundy bg-burgundy bg-opacity-5'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              value="COD"
              {...register('paymentMethod')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Banknote className="h-5 w-5 text-burgundy" />
                <span className="font-semibold">Cash on Delivery</span>
              </div>
              <p className="text-sm text-gray-600">
                Pay with cash when your order is delivered
              </p>
            </div>
          </label>

          {/* Signature Card Option */}
          {hasSignatureCards && (
            <div
              className={`p-4 border-2 rounded-lg transition-all ${
                selectedPaymentMethod === 'SIGNATURE_CARD'
                  ? 'border-burgundy bg-burgundy bg-opacity-5'
                  : 'border-gray-200'
              }`}
            >
              <label className="flex items-start gap-4 cursor-pointer">
                <input
                  type="radio"
                  value="SIGNATURE_CARD"
                  {...register('paymentMethod')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="h-5 w-5 text-burgundy" />
                    <span className="font-semibold">Signature Card</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pay with your Signature Card balance and get exclusive discounts
                  </p>
                </div>
              </label>

              {/* Card Selection + OTP Flow */}
              {selectedPaymentMethod === 'SIGNATURE_CARD' && (
                <div className="mt-4 ml-8 space-y-3">
                  {/* Card Dropdown */}
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Select Card</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/50 focus:border-burgundy"
                      value={selectedSignatureCard?.id || ''}
                      onChange={(e) => {
                        const card = signatureCards.find((c) => c.id === e.target.value) || null
                        if (card) handleCardSelect(card)
                      }}
                    >
                      <option value="">Choose a card...</option>
                      {signatureCards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.category} — ****{card.cardNumber.slice(-4)} — ৳{Number(card.balance).toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Card Info */}
                  {selectedSignatureCard && (
                    <div className="bg-gray-50 rounded-lg p-3 text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Balance</span>
                        <span className="font-semibold">৳{Number(selectedSignatureCard.balance).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Valid Until</span>
                        <span className="font-medium">
                          {selectedSignatureCard.validUntil
                            ? new Date(selectedSignatureCard.validUntil).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Tier</span>
                        <span className="font-medium text-burgundy">{selectedSignatureCard.category}</span>
                      </div>
                    </div>
                  )}

                  {/* OTP Flow */}
                  {selectedSignatureCard && !otpVerified && (
                    <div className="space-y-2">
                      {!otpSent ? (
                        <button
                          type="button"
                          onClick={handleSendOTP}
                          disabled={otpSending}
                          className="w-full py-2 text-sm font-semibold text-burgundy border border-burgundy rounded-lg hover:bg-burgundy/5 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {otpSending ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Sending...
                            </>
                          ) : (
                            'Send Verification Code'
                          )}
                        </button>
                      ) : (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500">
                            OTP sent to {maskedEmail || 'your registered email'}
                          </p>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                              placeholder="Enter 6-digit code"
                              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-center tracking-wider font-mono focus:outline-none focus:ring-2 focus:ring-burgundy/50 focus:border-burgundy"
                              maxLength={6}
                            />
                            <button
                              type="button"
                              onClick={handleVerifyOTP}
                              disabled={otpVerifying || otpCode.length !== 6}
                              className="px-4 py-2 text-sm font-semibold gradient-primary text-white rounded-lg disabled:opacity-50 flex items-center gap-1"
                            >
                              {otpVerifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={handleSendOTP}
                            disabled={otpSending}
                            className="text-xs text-burgundy hover:underline"
                          >
                            Resend OTP
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* OTP Verified */}
                  {otpVerified && (
                    <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 rounded-lg p-2">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="font-medium">Card verified successfully</span>
                    </div>
                  )}

                  {/* OTP Error */}
                  {otpError && (
                    <p className="text-sm text-red-600">{otpError}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {errors.paymentMethod && (
            <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-1">Secure Checkout</p>
            <p className="text-blue-700">
              {selectedPaymentMethod === 'PAYSTATION'
                ? 'You will be redirected to PayStation\'s secure payment gateway to complete your purchase.'
                : selectedPaymentMethod === 'SIGNATURE_CARD'
                ? 'Your Signature Card balance will be deducted and tier-based discounts applied automatically.'
                : 'You will receive an order confirmation. Pay in cash when your order arrives.'}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-white"
            disabled={isProcessing || (selectedPaymentMethod === 'SIGNATURE_CARD' && (!otpVerified || !selectedSignatureCard))}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              selectedPaymentMethod === 'PAYSTATION'
                ? 'Proceed to Payment'
                : selectedPaymentMethod === 'SIGNATURE_CARD'
                ? 'Pay with Signature Card'
                : 'Place Order'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
