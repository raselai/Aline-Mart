'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface VendorPayoutModalProps {
  payout: {
    id: string
    vendorId: string
    payoutAmount: number
    totalSales: number
    commissionRate: number
    commissionAmount: number
    periodStart: string
    periodEnd: string
    vendor?: {
      shopName: string
      ownerName: string
      bankName?: string | null
      accountNumber?: string | null
    } | null
  } | null
  isOpen: boolean
  onClose: () => void
  onMarkPaid: (payoutId: string, reference: string) => Promise<void>
}

export default function VendorPayoutModal({ payout, isOpen, onClose, onMarkPaid }: VendorPayoutModalProps) {
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !payout) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onMarkPaid(payout.id, reference)
      setReference('')
      onClose()
    } catch (error) {
      console.error('Error marking payout paid:', error)
      alert('Failed to mark as paid')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Mark Payout as Paid
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Payout Info */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#6B7280' }}>Vendor</span>
              <span className="font-medium" style={{ color: '#2C2C2C' }}>
                {payout.vendor?.shopName || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280' }}>Period</span>
              <span style={{ color: '#2C2C2C' }}>
                {new Date(payout.periodStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                {' - '}
                {new Date(payout.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280' }}>Total Sales</span>
              <span style={{ color: '#2C2C2C' }}>
                ৳{Number(payout.totalSales).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280' }}>Commission ({payout.commissionRate}%)</span>
              <span style={{ color: '#DC2626' }}>
                -৳{Number(payout.commissionAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="border-t pt-2" style={{ borderColor: '#E5E7EB' }}>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: '#2C2C2C' }}>Payout Amount</span>
                <span className="text-lg font-bold" style={{ color: '#059669' }}>
                  ৳{Number(payout.payoutAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {payout.vendor?.bankName && (
              <div className="flex justify-between">
                <span style={{ color: '#6B7280' }}>Bank</span>
                <span style={{ color: '#2C2C2C' }}>
                  {payout.vendor.bankName} ({payout.vendor.accountNumber || '—'})
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Payment Reference / Transaction ID
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., bank transfer reference"
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md hover:bg-gray-50"
              style={{ borderColor: '#d1d5db', color: '#6B7280' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-md text-white disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)' }}
            >
              {submitting ? 'Processing...' : 'Mark as Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
