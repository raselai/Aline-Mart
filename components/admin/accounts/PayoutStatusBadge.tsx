'use client'

import type { PayoutStatus } from '@/types/accounts'

interface PayoutStatusBadgeProps {
  status: PayoutStatus
}

const STATUS_CONFIG: Record<PayoutStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  PAID: { label: 'Paid', color: '#059669', bg: '#D1FAE5' },
}

export default function PayoutStatusBadge({ status }: PayoutStatusBadgeProps) {
  const config = STATUS_CONFIG[status] || { label: status, color: '#6B7280', bg: '#F3F4F6' }

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ color: config.color, backgroundColor: config.bg }}
    >
      {config.label}
    </span>
  )
}
