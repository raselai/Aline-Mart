'use client'

import type { RefundStatus } from '@/types/accounts'

interface RefundStatusBadgeProps {
  status: RefundStatus
}

const STATUS_CONFIG: Record<RefundStatus, { label: string; color: string; bg: string }> = {
  PENDING: { label: 'Pending', color: '#D97706', bg: '#FEF3C7' },
  PROCESSED: { label: 'Processed', color: '#059669', bg: '#D1FAE5' },
  REJECTED: { label: 'Rejected', color: '#DC2626', bg: '#FEE2E2' },
}

export default function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
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
