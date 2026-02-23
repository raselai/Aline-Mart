'use client'

import type { VirtualCard, VirtualCardTier } from '@/types/virtual-card'

interface VirtualCardDisplayProps {
  card: VirtualCard
  tiers: VirtualCardTier[]
  holderName: string
}

const tierColors: Record<string, { badge: string; text: string }> = {
  STANDARD: { badge: 'rgba(255,255,255,0.2)', text: '#FFFFFF' },
  SILVER: { badge: 'rgba(192,192,192,0.4)', text: '#E8E8E8' },
  GOLD: { badge: 'rgba(212,175,55,0.4)', text: '#D4AF37' },
  PLATINUM: { badge: 'rgba(229,228,226,0.4)', text: '#E5E4E2' },
}

export default function VirtualCardDisplay({ card, tiers, holderName }: VirtualCardDisplayProps) {
  const balance = Number(card.balance)
  const lifetimeLoaded = Number(card.lifetimeLoaded)
  const discountPercent = Number(card.discountPercent)
  const colors = tierColors[card.tierLevel] || tierColors.STANDARD

  // Find next tier for progress display
  const sortedTiers = [...tiers].sort((a, b) => a.minLifetimeLoad - b.minLifetimeLoad)
  const currentTierIndex = sortedTiers.findIndex((t) => t.name === card.tierLevel)
  const nextTier = currentTierIndex < sortedTiers.length - 1 ? sortedTiers[currentTierIndex + 1] : null
  const progressToNext = nextTier
    ? Math.min(100, (lifetimeLoaded / nextTier.minLifetimeLoad) * 100)
    : 100

  return (
    <div>
      {/* Card Visual */}
      <div
        style={{
          background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 60%, #3a0520 100%)',
          borderRadius: '16px',
          padding: '28px 24px',
          color: '#FFFFFF',
          maxWidth: '420px',
          width: '100%',
          aspectRatio: '1.586 / 1',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          boxShadow: '0 8px 32px rgba(92, 9, 49, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '-30px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        {/* Top row: brand + tier */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em' }}>
              ALINE MART
            </div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.1em', opacity: 0.7, marginTop: '2px' }}>
              VIRTUAL CARD
            </div>
          </div>
          <div
            style={{
              background: colors.badge,
              color: colors.text,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              padding: '4px 10px',
              borderRadius: '4px',
            }}
          >
            {card.tierLevel}
          </div>
        </div>

        {/* Card number */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 500, letterSpacing: '0.15em', fontFamily: 'monospace' }}>
            {card.cardNumber}
          </div>
        </div>

        {/* Bottom row: holder + balance */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.08em', opacity: 0.6, marginBottom: '2px' }}>
              CARD HOLDER
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              {holderName || 'VALUED MEMBER'}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.08em', opacity: 0.6, marginBottom: '2px' }}>
              BALANCE
            </div>
            <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>
              ৳{balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        </div>
      </div>

      {/* Tier Progress */}
      <div style={{ maxWidth: '420px', marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>
            {discountPercent > 0 ? `${discountPercent}% discount on purchases` : 'No discount yet'}
          </span>
          {nextTier && (
            <span style={{ fontSize: '0.75rem', color: '#8e2157', fontWeight: 600 }}>
              Next: {nextTier.name} ({nextTier.discountPercent}%)
            </span>
          )}
        </div>
        {nextTier && (
          <div style={{ width: '100%', height: '6px', backgroundColor: '#F3F4F6', borderRadius: '3px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${progressToNext}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #8e2157, #D4AF37)',
                borderRadius: '3px',
                transition: 'width 600ms ease',
              }}
            />
          </div>
        )}
        {nextTier && (
          <div style={{ fontSize: '0.7rem', color: '#9CA3AF', marginTop: '4px' }}>
            ৳{lifetimeLoaded.toLocaleString()} / ৳{nextTier.minLifetimeLoad.toLocaleString()} lifetime loaded
          </div>
        )}
        {!nextTier && (
          <div style={{ fontSize: '0.75rem', color: '#D4AF37', fontWeight: 600 }}>
            Maximum tier reached
          </div>
        )}
      </div>
    </div>
  )
}
