'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

interface TopUpFormProps {
  email: string
}

const PRESET_AMOUNTS = [1000, 2000, 5000, 10000]
const MIN_TOPUP = 1000

export default function TopUpForm({ email }: TopUpFormProps) {
  const [amount, setAmount] = useState<number>(0)
  const [customAmount, setCustomAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePresetClick = (preset: number) => {
    setAmount(preset)
    setCustomAmount('')
    setError(null)
  }

  const handleCustomChange = (value: string) => {
    const num = value.replace(/[^0-9]/g, '')
    setCustomAmount(num)
    setAmount(Number(num) || 0)
    setError(null)
  }

  const handleTopUp = async () => {
    if (amount < MIN_TOPUP) {
      setError(`Minimum top-up amount is ৳${MIN_TOPUP.toLocaleString()}`)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/virtual-card/topup/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, amount }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to initiate top-up')
      }

      const { paymentUrl } = await res.json()
      window.location.href = paymentUrl
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initiate top-up')
      setIsLoading(false)
    }
  }

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      }}
    >
      <h2
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '1.25rem',
          fontWeight: 600,
          color: '#2C2C2C',
          margin: '0 0 20px',
        }}
      >
        Top Up Balance
      </h2>

      {/* Preset buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            onClick={() => handlePresetClick(preset)}
            style={{
              padding: '12px',
              borderRadius: '8px',
              border: amount === preset && !customAmount ? '2px solid #8e2157' : '2px solid #E5E7EB',
              backgroundColor: amount === preset && !customAmount ? 'rgba(142, 33, 87, 0.05)' : '#FFFFFF',
              cursor: 'pointer',
              fontSize: '0.95rem',
              fontWeight: 600,
              color: amount === preset && !customAmount ? '#8e2157' : '#2C2C2C',
              transition: 'all 200ms ease',
            }}
          >
            ৳{preset.toLocaleString()}
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '0.8rem', color: '#6B7280', marginBottom: '6px' }}>
          Or enter custom amount
        </label>
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '0.95rem',
              color: '#6B7280',
            }}
          >
            ৳
          </span>
          <input
            type="text"
            inputMode="numeric"
            value={customAmount}
            onChange={(e) => handleCustomChange(e.target.value)}
            placeholder={`Minimum ৳${MIN_TOPUP.toLocaleString()}`}
            style={{
              width: '100%',
              padding: '12px 12px 12px 28px',
              borderRadius: '8px',
              border: '2px solid #E5E7EB',
              fontSize: '0.95rem',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: '10px 12px',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            fontSize: '0.8rem',
            color: '#DC2626',
            marginBottom: '16px',
          }}
        >
          {error}
        </div>
      )}

      {/* Top-up button */}
      <button
        onClick={handleTopUp}
        disabled={isLoading || amount < MIN_TOPUP}
        style={{
          width: '100%',
          padding: '14px',
          borderRadius: '8px',
          border: 'none',
          background: amount >= MIN_TOPUP && !isLoading
            ? 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
            : '#D1D5DB',
          color: '#FFFFFF',
          fontSize: '0.95rem',
          fontWeight: 600,
          cursor: amount >= MIN_TOPUP && !isLoading ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          transition: 'opacity 200ms ease',
        }}
      >
        {isLoading ? (
          <>
            <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
            Processing...
          </>
        ) : amount >= MIN_TOPUP ? (
          `Top Up ৳${amount.toLocaleString()} via PayStation`
        ) : (
          'Select an amount'
        )}
      </button>
    </div>
  )
}
