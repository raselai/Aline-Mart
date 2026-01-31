'use client'

import type { TransactionType } from '@/types/accounts'

interface TransactionTypeBadgeProps {
  type: TransactionType
}

const TYPE_CONFIG: Record<TransactionType, { label: string; color: string; bg: string }> = {
  SALE: { label: 'Sale', color: '#059669', bg: '#D1FAE5' },
  REFUND: { label: 'Refund', color: '#DC2626', bg: '#FEE2E2' },
  COD_COLLECTION: { label: 'COD Collection', color: '#2563EB', bg: '#DBEAFE' },
  VENDOR_PAYOUT: { label: 'Vendor Payout', color: '#7C3AED', bg: '#EDE9FE' },
  ADJUSTMENT: { label: 'Adjustment', color: '#D97706', bg: '#FEF3C7' },
}

export default function TransactionTypeBadge({ type }: TransactionTypeBadgeProps) {
  const config = TYPE_CONFIG[type] || { label: type, color: '#6B7280', bg: '#F3F4F6' }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}
