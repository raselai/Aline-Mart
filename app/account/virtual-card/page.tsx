'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useVirtualCard } from '@/hooks/useVirtualCard'
import VirtualCardDisplay from './components/VirtualCardDisplay'
import TopUpForm from './components/TopUpForm'
import TransactionHistory from './components/TransactionHistory'
import { ArrowLeft, Loader2 } from 'lucide-react'

function VirtualCardContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAuthenticated, isLoading: authLoading, userEmail, userName } = useAuth()
  const { card, tiers, isLoading: cardLoading, fetchCard } = useVirtualCard()
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [creating, setCreating] = useState(false)

  // Handle topup result from query params
  useEffect(() => {
    const topupResult = searchParams.get('topup')
    if (topupResult === 'success') {
      setToast({ type: 'success', message: 'Top-up successful! Your balance has been updated.' })
      // Refresh card data
      if (userEmail) fetchCard(userEmail)
    } else if (topupResult === 'failed') {
      setToast({ type: 'error', message: 'Top-up payment failed. Please try again.' })
    } else if (topupResult === 'error') {
      setToast({ type: 'error', message: 'Something went wrong with the top-up. Please try again.' })
    }

    // Clear query params after showing toast
    if (topupResult) {
      const timer = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(timer)
    }
  }, [searchParams, userEmail, fetchCard])

  // Fetch card on mount
  useEffect(() => {
    if (userEmail) {
      fetchCard(userEmail)
    }
  }, [userEmail, fetchCard])

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login?redirect=/account/virtual-card')
    }
  }, [authLoading, isAuthenticated, router])

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8e2157' }} />
      </div>
    )
  }

  const handleCreateCard = async () => {
    if (!userEmail) return
    setCreating(true)
    try {
      const res = await fetch('/api/virtual-card/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })
      if (res.ok) {
        await fetchCard(userEmail)
      }
    } catch {
      // Silently fail
    } finally {
      setCreating(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: '960px',
        minWidth: '320px',
        margin: '0 auto',
        padding: '120px 16px 80px',
        paddingTop: 'clamp(120px, 15vw, 200px)',
      }}
    >
      {/* Back link */}
      <Link
        href="/account"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.875rem',
          color: '#6B7280',
          textDecoration: 'none',
          marginBottom: '24px',
        }}
      >
        <ArrowLeft size={16} />
        Back to Account
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#2C2C2C',
          margin: '0 0 32px',
        }}
      >
        Virtual Card
      </h1>

      {/* Toast notification */}
      {toast && (
        <div
          style={{
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '24px',
            backgroundColor: toast.type === 'success' ? '#F0FDF4' : '#FEF2F2',
            border: `1px solid ${toast.type === 'success' ? '#BBF7D0' : '#FECACA'}`,
            color: toast.type === 'success' ? '#166534' : '#DC2626',
            fontSize: '0.875rem',
          }}
        >
          {toast.message}
        </div>
      )}

      {cardLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: i === 1 ? '260px' : '120px',
                backgroundColor: '#F5F5F5',
                borderRadius: '12px',
              }}
            />
          ))}
        </div>
      ) : !card ? (
        /* No card yet — CTA */
        <div
          style={{
            textAlign: 'center',
            padding: '60px 24px',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          }}
        >
          <div
            style={{
              width: '80px',
              height: '50px',
              margin: '0 auto 20px',
              background: 'linear-gradient(135deg, #8e2157, #5c0931)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            ALINE
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#2C2C2C',
              margin: '0 0 8px',
            }}
          >
            Get Your Virtual Card
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '24px', maxWidth: '400px', margin: '0 auto 24px' }}>
            Load balance onto your Aline Mart virtual card and enjoy tier-based discounts on every purchase.
          </p>
          <button
            onClick={handleCreateCard}
            disabled={creating}
            style={{
              padding: '14px 32px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: creating ? 'not-allowed' : 'pointer',
              opacity: creating ? 0.7 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            {creating ? 'Creating...' : 'Create Virtual Card'}
          </button>
        </div>
      ) : (
        /* Card exists — show full dashboard */
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
          {/* Card display + Top-up side by side on larger screens */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px',
            }}
          >
            <VirtualCardDisplay
              card={card}
              tiers={tiers}
              holderName={userName || ''}
            />
            <TopUpForm email={userEmail!} />
          </div>

          {/* Transaction History */}
          <TransactionHistory email={userEmail!} />
        </div>
      )}
    </div>
  )
}

export default function VirtualCardPage() {
  return (
    <Suspense
      fallback={
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <Loader2 size={32} style={{ animation: 'spin 1s linear infinite', color: '#8e2157' }} />
        </div>
      }
    >
      <VirtualCardContent />
    </Suspense>
  )
}
