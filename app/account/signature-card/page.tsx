'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useSignatureCard } from '@/hooks/useSignatureCard'
import SignatureCardDisplay from './components/SignatureCardDisplay'
import PurchaseForm from './components/PurchaseForm'
import CardBenefits from './components/CardBenefits'
import CardTransactionHistory from './components/CardTransactionHistory'
import type { SignatureCard } from '@/types/signature-card'

export default function SignatureCardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, userEmail } = useAuth()
  const { cards, cardTypes, isLoading, fetchCards, activeCards, userId } = useSignatureCard()
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [selectedCard, setSelectedCard] = useState<SignatureCard | null>(null)
  const [showPurchase, setShowPurchase] = useState(false)
  const [showBenefits, setShowBenefits] = useState<SignatureCard | null>(null)

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth/login?redirect=/account/signature-card')
    }
  }, [isAuthenticated, router])

  // Fetch cards
  useEffect(() => {
    if (userEmail) {
      fetchCards(userEmail)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail])

  // Handle query param toasts
  useEffect(() => {
    const purchase = searchParams.get('purchase')
    if (purchase === 'success') {
      setToast({ type: 'success', message: 'Your Signature Card has been activated successfully!' })
      if (userEmail) fetchCards(userEmail)
      router.replace('/account/signature-card', { scroll: false })
    } else if (purchase === 'failed') {
      setToast({ type: 'error', message: 'Payment was not completed. Please try again.' })
      router.replace('/account/signature-card', { scroll: false })
    } else if (purchase === 'error') {
      setToast({ type: 'error', message: 'Something went wrong. Please try again.' })
      router.replace('/account/signature-card', { scroll: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen pb-16" style={{ backgroundColor: '#F9FAFB', paddingTop: 'clamp(120px, 15vw, 200px)' }}>
      <div
        className="mx-auto px-6 sm:px-8 lg:px-12"
        style={{ maxWidth: '1152px', minWidth: '320px' }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-serif font-bold"
              style={{ color: '#111827' }}
            >
              Signature Cards
            </h1>
            <p
              className="text-sm mt-1"
              style={{
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Premium membership cards with exclusive shopping discounts
            </p>
          </div>
          {cards.length > 0 && (
            <button
              onClick={() => setShowPurchase(true)}
              className="text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                whiteSpace: 'nowrap',
              }}
            >
              Get Another Card
            </button>
          )}
        </div>

        {/* Toast */}
        {toast && (
          <div
            className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
              toast.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-800'
                : 'bg-red-50 border border-red-200 text-red-800'
            }`}
          >
            <span
              className="text-sm font-medium flex-1"
              style={{
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '0',
              }}
            >
              {toast.message}
            </span>
            <button onClick={() => setToast(null)} className="text-current opacity-50 hover:opacity-100">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-xl h-64 animate-pulse" />
            ))}
          </div>
        ) : cards.length === 0 && !showPurchase ? (
          /* No cards — show purchase options */
          <PurchaseForm
            cardTypes={cardTypes}
            userId={userId || ''}
            userEmail={userEmail || ''}
            onCancel={() => router.push('/account')}
          />
        ) : showPurchase ? (
          <PurchaseForm
            cardTypes={cardTypes}
            userId={userId || ''}
            userEmail={userEmail || ''}
            onCancel={() => setShowPurchase(false)}
          />
        ) : (
          <div className="space-y-8">
            {/* Card Gallery */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cards.map((card) => (
                <SignatureCardDisplay
                  key={card.id}
                  card={card}
                  onViewBenefits={() => setShowBenefits(card)}
                  onViewTransactions={() => setSelectedCard(card)}
                />
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
                      {showBenefits.category} Benefits
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
                  <CardBenefits category={showBenefits.category} cardTypes={cardTypes} />
                </div>
              </div>
            )}

            {/* Transaction History */}
            {selectedCard && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2
                    className="text-xl font-serif font-bold"
                    style={{ color: '#111827' }}
                  >
                    Transaction History — ****{selectedCard.cardNumber.slice(-4)}
                  </h2>
                  <button
                    onClick={() => setSelectedCard(null)}
                    className="text-sm font-semibold hover:underline"
                    style={{ color: '#8e2157' }}
                  >
                    Close
                  </button>
                </div>
                <CardTransactionHistory cardId={selectedCard.id} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
