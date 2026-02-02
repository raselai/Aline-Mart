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
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        className="w-full bg-white rounded-lg shadow-xl p-8"
        style={{ maxWidth: '600px', minWidth: '320px' }}
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            className="text-xl font-serif font-bold"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Mark Payout as Paid
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded">
            <X size={20} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Payout Info */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5', width: '100%', minWidth: '280px' }}>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Vendor</span>
              <span className="font-medium" style={{ color: '#2C2C2C', whiteSpace: 'normal', wordBreak: 'normal', overflowWrap: 'normal' }}>
                {payout.vendor?.shopName || '—'}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Period</span>
              <span style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>
                {new Date(payout.periodStart).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                {' - '}
                {new Date(payout.periodEnd).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Total Sales</span>
              <span style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>
                ৳{Number(payout.totalSales).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Commission ({payout.commissionRate}%)</span>
              <span style={{ color: '#DC2626', whiteSpace: 'nowrap' }}>
                -৳{Number(payout.commissionAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="pt-2" style={{ borderTop: '1px solid #E5E7EB' }}>
              <div className="flex justify-between">
                <span className="font-medium" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>Payout Amount</span>
                <span className="text-lg font-bold" style={{ color: '#059669', whiteSpace: 'nowrap' }}>
                  ৳{Number(payout.payoutAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            {payout.vendor?.bankName && (
              <div className="flex justify-between">
                <span style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Bank</span>
                <span style={{
                  color: '#2C2C2C',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                }}>
                  {payout.vendor.bankName} ({payout.vendor.accountNumber || '—'})
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              Payment Reference / Transaction ID
            </label>
            <input
              type="text"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="e.g., bank transfer reference"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{
                borderColor: '#d1d5db',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-md transition-colors"
              style={{
                borderColor: '#d1d5db',
                color: '#6B7280',
                backgroundColor: '#ffffff',
                whiteSpace: 'nowrap',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 rounded-md text-white transition-colors"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              {submitting ? 'Processing...' : 'Mark as Paid'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
