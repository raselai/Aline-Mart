'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import type { SignatureCard } from '@/types/signature-card'

const CARD_IMAGES: Record<string, { front: string; back: string }> = {
  CROWN: {
    front: '/Cards/Crown_front_bg.jpg.jpeg',
    back: '/Cards/Crown_back_bg.jpg.jpeg',
  },
  PRIVILEGE: {
    front: '/Cards/privilege_front_bg.jpg.jpeg',
    back: '/Cards/privilege_back_bg.jpg.jpeg',
  },
  CAMPUS: {
    front: '/Cards/Campus_friendly_front_bg.jpg.jpeg',
    back: '/Cards/Campus_friendly_back.jpg.jpeg',
  },
}

function deriveCardCVV(cardId: string): string {
  let hash = 0
  for (let i = 0; i < cardId.length; i++) {
    hash = ((hash << 5) - hash + cardId.charCodeAt(i)) | 0
  }
  return String(Math.abs(hash) % 1000).padStart(3, '0')
}

interface SignatureCardDisplayProps {
  card: SignatureCard
  onViewBenefits: () => void
  onViewTransactions: () => void
}

export default function SignatureCardDisplay({
  card,
  onViewBenefits,
  onViewTransactions,
}: SignatureCardDisplayProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const printRef = useRef<HTMLDivElement>(null)

  const images = CARD_IMAGES[card.category] || CARD_IMAGES.PRIVILEGE
  const isExpired = card.validUntil && new Date(card.validUntil) < new Date()
  const isValid = card.isActive && !isExpired

  const handlePrint = () => {
    const content = printRef.current
    if (!content) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const validDate = card.validUntil
      ? new Date(card.validUntil).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
      : 'N/A'
    const cvv = deriveCardCVV(card.id)

    printWindow.document.write(`
      <html>
        <head>
          <title>Signature Card - ${card.cardholderName}</title>
          <style>
            body { margin: 0; padding: 20px; display: flex; flex-direction: column; align-items: center; gap: 24px; min-height: 100vh; background: #f5f5f5; font-family: system-ui, sans-serif; }
            .card { position: relative; width: 400px; aspect-ratio: 1.586; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
            .card img { width: 100%; height: 100%; object-fit: cover; }
            .badge { position: absolute; top: 16px; right: 16px; background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 20px; color: white; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .balance { position: absolute; top: 16px; left: 16px; background: rgba(255,255,255,0.15); padding: 6px 12px; border-radius: 20px; color: white; font-size: 12px; font-weight: 700; }
            .card-number { position: absolute; left: 20px; top: 72%; color: white; font-family: monospace; font-size: 16px; letter-spacing: 3px; text-shadow: 0 2px 6px rgba(0,0,0,0.5); }
            .bottom-row { position: absolute; bottom: 0; left: 0; right: 0; padding: 16px 20px; display: flex; justify-content: space-between; align-items: flex-end; text-shadow: 0 1px 4px rgba(0,0,0,0.5); }
            .holder-name { color: white; font-weight: 600; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
            .valid-label { color: rgba(255,255,255,0.6); font-size: 8px; text-transform: uppercase; letter-spacing: 2px; text-align: right; }
            .valid-date { color: white; font-size: 12px; margin-top: 2px; text-align: right; }
            .back-overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.3); padding: 20px; display: flex; flex-direction: column; justify-content: space-between; }
            .mag-strip { width: calc(100% + 40px); height: 32px; background: rgba(17,24,39,0.7); margin: 4px -20px 0; }
            .cvv-row { display: flex; gap: 8px; align-items: center; justify-content: flex-end; }
            .cvv-label { color: rgba(255,255,255,0.5); font-size: 9px; text-transform: uppercase; letter-spacing: 2px; }
            .cvv-box { background: rgba(255,255,255,0.9); border-radius: 4px; padding: 6px 12px; }
            .cvv-text { font-family: monospace; font-size: 14px; font-weight: 700; color: #1f2937; letter-spacing: 2px; }
            .terms { color: rgba(255,255,255,0.5); font-size: 9px; line-height: 1.4; }
            .label-title { text-align: center; color: #666; font-size: 12px; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 2px; }
            @media print { body { background: white; } }
          </style>
        </head>
        <body>
          <p class="label-title">Front</p>
          <div class="card">
            <img src="${images.front}" alt="Card Front" />
            <div class="badge">${card.category}</div>
            <div class="balance">৳${Number(card.balance).toLocaleString()}</div>
            <div class="card-number">${card.cardNumber}</div>
            <div class="bottom-row">
              <div class="holder-name">${card.cardholderName}</div>
              <div>
                <div class="valid-label">Valid Thru</div>
                <div class="valid-date">${validDate}</div>
              </div>
            </div>
          </div>
          <p class="label-title">Back</p>
          <div class="card">
            <img src="${images.back}" alt="Card Back" />
            <div class="back-overlay">
              <div class="mag-strip"></div>
              <div class="cvv-row">
                <span class="cvv-label">CVV</span>
                <div class="cvv-box"><span class="cvv-text">${cvv}</span></div>
              </div>
              <div class="terms">Valid for 1 year from activation. Balance can be used at checkout. Card discounts apply automatically. Non-refundable. Non-transferable.</div>
            </div>
          </div>
          <script>setTimeout(() => { window.print(); window.close(); }, 500);</script>
        </body>
      </html>
    `)
    printWindow.document.close()
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden" ref={printRef}>
      {/* Card Visual */}
      <div
        className="relative cursor-pointer"
        onClick={() => setIsFlipped(!isFlipped)}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative transition-transform duration-500"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          }}
        >
          {/* Front */}
          <div className="relative w-full" style={{ aspectRatio: '1.586', backfaceVisibility: 'hidden' }}>
            <Image
              src={images.front}
              alt={`${card.category} card front`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {/* Category Badge */}
            <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
              <span className="text-white text-xs font-semibold uppercase tracking-wider">
                {card.category}
              </span>
            </div>
            {/* Balance Badge */}
            <div
              className="absolute top-4 left-4 bg-white/15 backdrop-blur-sm px-3 py-1.5 rounded-full"
              style={{ textShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
            >
              <span className="text-white text-xs font-bold">
                ৳{Number(card.balance).toLocaleString()}
              </span>
            </div>
            {/* Status Badge */}
            {!isValid && (
              <div className="absolute top-12 left-4 bg-red-500/90 px-3 py-1 rounded-full">
                <span className="text-white text-xs font-semibold">
                  {isExpired ? 'Expired' : 'Inactive'}
                </span>
              </div>
            )}
            {/* Card Number — below chip area */}
            <div
              className="absolute left-5 right-5 flex items-center"
              style={{ top: '72%', textShadow: '0 2px 6px rgba(0,0,0,0.5)' }}
            >
              <p className="text-white font-mono text-base sm:text-lg tracking-[3px]">
                {card.cardNumber}
              </p>
            </div>
            {/* Bottom row — Name (left), Valid Thru (right) */}
            <div
              className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex justify-between items-end"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
            >
              <div>
                <p className="text-white font-semibold text-sm uppercase tracking-wide" style={{ whiteSpace: 'nowrap' }}>
                  {card.cardholderName}
                </p>
              </div>
              <div className="text-right">
                <p className="text-white/60 uppercase text-[9px] tracking-widest leading-none mb-0.5">
                  Valid Thru
                </p>
                <p className="text-white text-xs font-medium">
                  {card.validUntil
                    ? new Date(card.validUntil).toLocaleDateString('en-US', { month: '2-digit', year: '2-digit' })
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Back (hidden, shown on flip) */}
          <div
            className="absolute inset-0 w-full"
            style={{
              aspectRatio: '1.586',
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
          >
            <Image
              src={images.back}
              alt={`${card.category} card back`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/30 p-5 flex flex-col justify-between">
              {/* Magnetic strip */}
              <div className="w-full h-8 bg-gray-900/70 -mx-5 mt-1" style={{ width: 'calc(100% + 40px)' }} />

              {/* CVV area */}
              <div className="flex items-center justify-end gap-2">
                <span className="text-white/50 text-[9px] uppercase tracking-wider">CVV</span>
                <div className="bg-white/90 rounded px-3 py-1.5">
                  <span className="text-gray-800 font-mono text-sm font-bold tracking-wider">
                    {deriveCardCVV(card.id)}
                  </span>
                </div>
              </div>

              {/* Terms */}
              <p
                className="text-white/50 leading-relaxed"
                style={{ fontSize: '9px' }}
              >
                Valid for 1 year from activation. Balance can be used at checkout.
                Card discounts apply automatically. Non-refundable. Non-transferable.
              </p>
            </div>
          </div>
        </div>

        <p className="absolute bottom-2 right-3 text-white/50 z-10" style={{ fontSize: '10px' }}>
          Tap to flip
        </p>
      </div>

      {/* Action Buttons */}
      <div className="p-4 flex gap-2">
        <button
          onClick={onViewBenefits}
          className="flex-1 text-sm font-semibold rounded-lg py-2 transition-colors"
          style={{
            color: '#8e2157',
            border: '1px solid rgba(142, 33, 87, 0.3)',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(142, 33, 87, 0.05)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          View Benefits
        </button>
        <button
          onClick={onViewTransactions}
          className="flex-1 text-sm font-semibold border border-gray-200 rounded-lg py-2 hover:bg-gray-50 transition-colors"
          style={{ color: '#374151' }}
        >
          Transactions
        </button>
        <button
          onClick={handlePrint}
          className="px-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          style={{ color: '#6B7280' }}
          title="Download / Print"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
        </button>
      </div>
    </div>
  )
}
