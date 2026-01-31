'use client'

import Link from 'next/link'
import { Banknote, RotateCcw, Wallet, ArrowRight } from 'lucide-react'

interface PendingItemsCardsProps {
  codCollections: number
  refunds: number
  vendorPayouts: number
}

export default function PendingItemsCards({
  codCollections,
  refunds,
  vendorPayouts,
}: PendingItemsCardsProps) {
  const items = [
    {
      title: 'COD to Collect',
      count: codCollections,
      icon: Banknote,
      color: '#D97706',
      bg: '#FEF3C7',
      href: '/admin/accounts/cod-collections',
    },
    {
      title: 'Refunds Pending',
      count: refunds,
      icon: RotateCcw,
      color: '#DC2626',
      bg: '#FEE2E2',
      href: '/admin/accounts/refunds',
    },
    {
      title: 'Payouts Due',
      count: vendorPayouts,
      icon: Wallet,
      color: '#7C3AED',
      bg: '#EDE9FE',
      href: '/admin/accounts/vendor-payouts',
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-serif font-bold mb-4" style={{ color: '#2C2C2C' }}>
        Pending Actions
      </h3>
      <div className="space-y-3">
        {items.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full" style={{ backgroundColor: item.bg }}>
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
              </div>
              <div>
                <p className="font-medium text-sm" style={{ color: '#2C2C2C' }}>
                  {item.title}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="text-lg font-bold"
                style={{ color: item.count > 0 ? item.color : '#9CA3AF' }}
              >
                {item.count}
              </span>
              <ArrowRight size={16} style={{ color: '#9CA3AF' }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
