'use client'

import { useState } from 'react'
import Image from 'next/image'
import CardBenefits from './CardBenefits'
import type { CardTypeConfig, SignatureCardCategory } from '@/types/signature-card'

const CARD_IMAGES: Record<string, string> = {
  CROWN: '/Cards/Crown_front_bg.jpg.jpeg',
  PRIVILEGE: '/Cards/privilege_front_bg.jpg.jpeg',
  CAMPUS: '/Cards/Campus_friendly_front_bg.jpg.jpeg',
}

interface PurchaseFormProps {
  cardTypes: CardTypeConfig[]
  userId: string
  userEmail: string
  onCancel: () => void
}

export default function PurchaseForm({
  cardTypes,
  userId,
  userEmail,
  onCancel,
}: PurchaseFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [selectedCategory, setSelectedCategory] = useState<SignatureCardCategory | null>(null)
  const [formData, setFormData] = useState({
    cardholderName: '',
    email: userEmail,
    phone: '',
    mailingAddress: '',
    dateOfBirth: '',
    weddingAnniversary: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showBenefits, setShowBenefits] = useState<SignatureCardCategory | null>(null)

  const selectedType = cardTypes.find((t) => t.category === selectedCategory)

  const handleSelectCard = (category: SignatureCardCategory) => {
    setSelectedCategory(category)
    setStep(2)
  }

  const handleFormSubmit = () => {
    if (!formData.cardholderName.trim()) {
      setError('Cardholder name is required')
      return
    }
    if (!formData.email.trim()) {
      setError('Email is required')
      return
    }
    if (!formData.phone.trim()) {
      setError('Phone number is required')
      return
    }
    if (!formData.mailingAddress.trim()) {
      setError('Mailing address is required (for physical card delivery)')
      return
    }
    setError(null)
    setStep(3)
  }

  const handleConfirm = async () => {
    if (!selectedCategory || !selectedType) return
    setIsSubmitting(true)
    setError(null)

    try {
      const res = await fetch('/api/signature-card/purchase/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          category: selectedCategory,
          cardholderName: formData.cardholderName,
          email: formData.email,
          phone: formData.phone,
          mailingAddress: formData.mailingAddress,
          dateOfBirth: formData.dateOfBirth || null,
          weddingAnniversary: formData.weddingAnniversary || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to initiate purchase')
      }

      const { paymentUrl } = await res.json()
      window.location.href = paymentUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
        <span style={{ color: step >= 1 ? '#8e2157' : '#6B7280', fontWeight: step >= 1 ? 600 : 400 }}>
          Select Card
        </span>
        <span>→</span>
        <span style={{ color: step >= 2 ? '#8e2157' : '#6B7280', fontWeight: step >= 2 ? 600 : 400 }}>
          Your Details
        </span>
        <span>→</span>
        <span style={{ color: step >= 3 ? '#8e2157' : '#6B7280', fontWeight: step >= 3 ? 600 : 400 }}>
          Confirm & Pay
        </span>
      </div>

      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm"
          style={{
            color: '#B91C1C',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            display: 'block',
            minWidth: '100%',
          }}
        >
          {error}
        </div>
      )}

      {/* Step 1: Select Card Type */}
      {step === 1 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cardTypes.map((type) => (
              <div
                key={type.category}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                style={{ minWidth: '0' }}
              >
                <div className="relative w-full" style={{ aspectRatio: '1.586' }}>
                  <Image
                    src={CARD_IMAGES[type.category] || CARD_IMAGES.PRIVILEGE}
                    alt={type.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4">
                    <p className="text-white font-bold text-lg" style={{ whiteSpace: 'nowrap' }}>
                      {type.label}
                    </p>
                    <p
                      className="text-white/70 text-xs"
                      style={{
                        whiteSpace: 'normal',
                        wordBreak: 'normal',
                        overflowWrap: 'normal',
                      }}
                    >
                      {type.description}
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-2xl font-bold" style={{ color: '#8e2157' }}>
                    ৳{type.price.toLocaleString()}
                  </p>
                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => handleSelectCard(type.category)}
                      className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                      }}
                    >
                      Apply Now
                    </button>
                    <button
                      onClick={() => setShowBenefits(type.category)}
                      className="flex-1 text-white text-sm font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity"
                      style={{
                        background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                      }}
                    >
                      Benefits
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Benefits Modal */}
          {showBenefits && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl w-full max-h-[90vh] overflow-y-auto" style={{ maxWidth: '672px' }}>
                <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
                  <h2
                    className="text-xl font-serif font-bold"
                    style={{ color: '#111827' }}
                  >
                    {showBenefits} Benefits
                  </h2>
                  <button
                    onClick={() => setShowBenefits(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <CardBenefits category={showBenefits} cardTypes={cardTypes} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Step 2: Cardholder Details */}
      {step === 2 && (
        <div
          className="bg-white rounded-xl shadow-sm p-6"
          style={{ maxWidth: '600px', minWidth: '320px' }}
        >
          <h2
            className="text-lg font-serif font-bold mb-4"
            style={{ color: '#111827' }}
          >
            Cardholder Details
          </h2>
          <p
            className="text-sm mb-6"
            style={{
              color: '#6B7280',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              display: 'block',
              minWidth: '100%',
            }}
          >
            Selected: <span style={{ fontWeight: 600, color: '#8e2157' }}>{selectedType?.label}</span> — ৳{selectedType?.price.toLocaleString()}
          </p>

          <div className="space-y-4">
            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151', whiteSpace: 'nowrap' }}
              >
                Cardholder Name (as per NID) *
              </label>
              <input
                type="text"
                value={formData.cardholderName}
                onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{ focusRingColor: 'rgba(142, 33, 87, 0.5)' } as React.CSSProperties}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151', whiteSpace: 'nowrap' }}
              >
                Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{ color: '#374151', whiteSpace: 'nowrap' }}
              >
                Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1"
                style={{
                  color: '#374151',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                Mailing Address (for physical card) *
              </label>
              <textarea
                value={formData.mailingAddress}
                onChange={(e) => setFormData({ ...formData, mailingAddress: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                rows={3}
                placeholder="Full mailing address"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#374151', whiteSpace: 'nowrap' }}
                >
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <p
                  className="mt-1"
                  style={{
                    fontSize: '10px',
                    color: '#9CA3AF',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                >
                  For birthday bonus discount
                </p>
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1"
                  style={{ color: '#374151', whiteSpace: 'nowrap' }}
                >
                  Wedding Anniversary
                </label>
                <input
                  type="date"
                  value={formData.weddingAnniversary}
                  onChange={(e) => setFormData({ ...formData, weddingAnniversary: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2"
                />
                <p
                  className="mt-1"
                  style={{
                    fontSize: '10px',
                    color: '#9CA3AF',
                    whiteSpace: 'normal',
                    wordBreak: 'normal',
                    overflowWrap: 'normal',
                  }}
                >
                  For anniversary bonus discount
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              style={{ color: '#4B5563' }}
            >
              Back
            </button>
            <button
              onClick={handleFormSubmit}
              className="flex-1 text-white py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              }}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Confirm & Pay */}
      {step === 3 && selectedType && (
        <div
          className="bg-white rounded-xl shadow-sm p-6"
          style={{ maxWidth: '600px', minWidth: '320px' }}
        >
          <h2
            className="text-lg font-serif font-bold mb-4"
            style={{ color: '#111827' }}
          >
            Confirm Your Purchase
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span style={{ color: '#6B7280' }}>Card Type</span>
              <span className="font-semibold" style={{ color: '#111827' }}>{selectedType.label}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span style={{ color: '#6B7280' }}>Name</span>
              <span className="font-medium" style={{ color: '#111827' }}>{formData.cardholderName}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span style={{ color: '#6B7280' }}>Email</span>
              <span className="font-medium" style={{ color: '#111827' }}>{formData.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span style={{ color: '#6B7280' }}>Phone</span>
              <span className="font-medium" style={{ color: '#111827' }}>{formData.phone}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span style={{ color: '#6B7280' }}>Mailing Address</span>
              <span
                className="font-medium text-right"
                style={{
                  color: '#111827',
                  maxWidth: '200px',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {formData.mailingAddress}
              </span>
            </div>
            {formData.dateOfBirth && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span style={{ color: '#6B7280' }}>Date of Birth</span>
                <span className="font-medium" style={{ color: '#111827' }}>{formData.dateOfBirth}</span>
              </div>
            )}
            {formData.weddingAnniversary && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span style={{ color: '#6B7280' }}>Wedding Anniversary</span>
                <span className="font-medium" style={{ color: '#111827' }}>{formData.weddingAnniversary}</span>
              </div>
            )}
            <div className="flex justify-between py-3 border-t-2 border-gray-200">
              <span className="font-bold text-base" style={{ color: '#111827' }}>Total</span>
              <span className="font-bold text-xl" style={{ color: '#8e2157' }}>
                ৳{selectedType.price.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setStep(2)}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              style={{ color: '#4B5563' }}
            >
              Back
            </button>
            <button
              onClick={handleConfirm}
              disabled={isSubmitting}
              className="flex-1 text-white py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </>
              ) : (
                `Pay ৳${selectedType.price.toLocaleString()}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Cancel */}
      <button
        onClick={onCancel}
        className="text-sm hover:opacity-80 transition-opacity"
        style={{ color: '#6B7280' }}
      >
        ← Back to Account
      </button>
    </div>
  )
}
