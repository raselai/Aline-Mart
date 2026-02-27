'use client'

import type { SignatureCardCategory, CardTypeConfig } from '@/types/signature-card'

interface CardBenefitsProps {
  category: SignatureCardCategory
  cardTypes: CardTypeConfig[]
}

export default function CardBenefits({ category, cardTypes }: CardBenefitsProps) {
  const config = cardTypes.find((t) => t.category === category)

  return (
    <div className="p-6 space-y-6">
      {/* Shopping Discounts */}
      <section>
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: '#8e2157' }}
        >
          Shopping Discounts (Applied at Checkout)
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span
              className="text-sm"
              style={{
                color: '#374151',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Aline Fashion Products
            </span>
            <span className="text-sm font-bold" style={{ color: '#15803D', whiteSpace: 'nowrap' }}>
              {config?.alineFashionDiscount || 0}% OFF
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span
              className="text-sm"
              style={{
                color: '#374151',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Other Brand Products
            </span>
            <span className="text-sm font-bold" style={{ color: '#15803D', whiteSpace: 'nowrap' }}>
              {config?.otherBrandsDiscount || 0}% OFF
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
            <span
              className="text-sm"
              style={{
                color: '#374151',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Birthday / Anniversary Bonus
            </span>
            <span className="text-sm font-bold" style={{ color: '#B45309', whiteSpace: 'nowrap' }}>
              +10% Additional
            </span>
          </div>
          {config?.freeDelivery && (
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span
                className="text-sm"
                style={{
                  color: '#374151',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                Free Home Delivery
              </span>
              <span className="text-sm font-bold" style={{ color: '#1D4ED8', whiteSpace: 'nowrap' }}>
                All Orders
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Dining Privileges */}
      {category !== 'CAMPUS' && (
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#8e2157' }}
          >
            Dining Privileges
          </h3>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <p
              className="text-sm mb-2"
              style={{
                color: '#4B5563',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Up to <span style={{ fontWeight: 700, color: '#8e2157' }}>{category === 'CROWN' ? '40%' : '30%'}</span> off at partner restaurants
            </p>
            <p
              className="text-xs"
              style={{
                color: '#9CA3AF',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Partner restaurants will be announced. Present your card at the venue.
            </p>
          </div>
        </section>
      )}

      {/* Hotel & Resort */}
      {category !== 'CAMPUS' && (
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#8e2157' }}
          >
            Hotel & Resort Offers
          </h3>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <p
              className="text-sm mb-2"
              style={{
                color: '#4B5563',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Up to <span style={{ fontWeight: 700, color: '#8e2157' }}>{category === 'CROWN' ? '60%' : '50%'}</span> off at partner hotels and resorts
            </p>
            <p
              className="text-xs"
              style={{
                color: '#9CA3AF',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Partner hotels will be announced. Booking through Aline Mart concierge.
            </p>
          </div>
        </section>
      )}

      {/* Travel Benefits */}
      {category !== 'CAMPUS' && (
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#8e2157' }}
          >
            Travel Benefits
          </h3>
          <div className="rounded-lg p-4" style={{ backgroundColor: '#F9FAFB' }}>
            <p
              className="text-sm mb-2"
              style={{
                color: '#4B5563',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              <span style={{ fontWeight: 700, color: '#8e2157' }}>{category === 'CROWN' ? '30%' : '20%'}</span> flight cashback
            </p>
            <p
              className="text-xs"
              style={{
                color: '#9CA3AF',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Applicable on partner airline bookings.
            </p>
          </div>
        </section>
      )}

      {/* Health Coverage */}
      <section>
        <h3
          className="text-sm font-semibold uppercase tracking-wider mb-3"
          style={{ color: '#8e2157' }}
        >
          Health Coverage
        </h3>
        <div className="rounded-lg p-4" style={{ backgroundColor: '#F9FAFB' }}>
          {category === 'CROWN' ? (
            <p
              className="text-sm"
              style={{
                color: '#4B5563',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Coverage up to <span style={{ fontWeight: 700, color: '#8e2157' }}>৳10,00,000</span>
            </p>
          ) : category === 'PRIVILEGE' ? (
            <p
              className="text-sm"
              style={{
                color: '#4B5563',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Coverage up to <span style={{ fontWeight: 700, color: '#8e2157' }}>৳2,00,000</span>
            </p>
          ) : (
            <p
              className="text-sm"
              style={{
                color: '#9CA3AF',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Health coverage information will be shared with eligible cardholders.
            </p>
          )}
        </div>
      </section>

      {/* Crown Exclusive */}
      {category === 'CROWN' && (
        <section>
          <h3
            className="text-sm font-semibold uppercase tracking-wider mb-3"
            style={{ color: '#8e2157' }}
          >
            Crown Exclusive
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <span style={{ color: '#F59E0B' }}>★</span>
              <span
                className="text-sm"
                style={{
                  color: '#374151',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                Personal Concierge Service
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <span style={{ color: '#F59E0B' }}>★</span>
              <span
                className="text-sm"
                style={{
                  color: '#374151',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                VIP Event Access
              </span>
            </div>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg">
              <span style={{ color: '#F59E0B' }}>★</span>
              <span
                className="text-sm"
                style={{
                  color: '#374151',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                Investment Advisory Access
              </span>
            </div>
          </div>
        </section>
      )}

      {/* Campus Info */}
      {category === 'CAMPUS' && (
        <section>
          <div className="bg-blue-50 rounded-lg p-4">
            <p
              className="text-sm"
              style={{
                color: '#1D4ED8',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Campus Friendly is designed for students. Enjoy the same shopping discounts as Privilege
              members. Additional offline perks may be added in the future.
            </p>
          </div>
        </section>
      )}

      {/* Terms */}
      <section className="border-t border-gray-100 pt-4">
        <h3
          className="text-xs font-semibold uppercase tracking-wider mb-2"
          style={{ color: '#9CA3AF' }}
        >
          Terms & Conditions
        </h3>
        <ul
          className="text-xs space-y-1 list-disc list-inside"
          style={{
            color: '#9CA3AF',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
          }}
        >
          <li>Card is valid for 1 year from the date of activation</li>
          <li>Balance is non-refundable and non-transferable</li>
          <li>Discounts are applied automatically at checkout when paying with Signature Card</li>
          <li>Birthday/Anniversary bonus requires date to be set in cardholder profile</li>
          <li>Offline perks (dining, hotels, travel, health) subject to partner availability</li>
          <li>Aline Mart reserves the right to modify benefits with prior notice</li>
        </ul>
      </section>
    </div>
  )
}
