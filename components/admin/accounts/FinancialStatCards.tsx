'use client'

import { DollarSign, TrendingUp, RotateCcw, Wallet } from 'lucide-react'

interface FinancialStatCardsProps {
  totalRevenue: number
  netRevenue: number
  totalRefunds: number
  pendingCOD: number
}

export default function FinancialStatCards({
  totalRevenue,
  netRevenue,
  totalRefunds,
  pendingCOD,
}: FinancialStatCardsProps) {
  const formatAmount = (amount: number) =>
    `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`

  const cards = [
    {
      title: 'Total Revenue',
      value: formatAmount(totalRevenue),
      icon: DollarSign,
      color: '#059669',
      bg: '#D1FAE5',
    },
    {
      title: 'Net Revenue',
      value: formatAmount(netRevenue),
      icon: TrendingUp,
      color: '#2563EB',
      bg: '#DBEAFE',
    },
    {
      title: 'Total Refunds',
      value: formatAmount(totalRefunds),
      icon: RotateCcw,
      color: '#DC2626',
      bg: '#FEE2E2',
    },
    {
      title: 'Pending COD',
      value: formatAmount(pendingCOD),
      icon: Wallet,
      color: '#D97706',
      bg: '#FEF3C7',
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm" style={{ color: '#6B7280' }}>{card.title}</p>
              <p className="text-2xl font-bold mt-1" style={{ color: '#2C2C2C' }}>
                {card.value}
              </p>
            </div>
            <div className="p-3 rounded-full" style={{ backgroundColor: card.bg }}>
              <card.icon className="w-6 h-6" style={{ color: card.color }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
