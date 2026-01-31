'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { CODCollection } from '@/types/accounts'

interface CODCollectionModalProps {
  collection: CODCollection | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (orderId: string, collectedAmount: number, notes: string) => Promise<void>
}

export default function CODCollectionModal({
  collection,
  isOpen,
  onClose,
  onSubmit,
}: CODCollectionModalProps) {
  const [collectedAmount, setCollectedAmount] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !collection) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const amount = Number(collectedAmount)
    if (amount < 0) return

    setSubmitting(true)
    try {
      await onSubmit(collection.orderId, amount, notes)
      setCollectedAmount('')
      setNotes('')
      onClose()
    } catch (error) {
      console.error('Error submitting COD collection:', error)
      alert('Failed to record collection')
    } finally {
      setSubmitting(false)
    }
  }

  const handleFillExpected = () => {
    setCollectedAmount(String(collection.expectedAmount))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Record COD Collection
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Order Info */}
        <div className="mb-6 p-4 rounded-lg" style={{ backgroundColor: '#F5F5F5' }}>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p style={{ color: '#6B7280' }}>Order</p>
              <p className="font-medium" style={{ color: '#8e2157' }}>
                {collection.order?.orderNumber || '—'}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280' }}>Customer</p>
              <p className="font-medium" style={{ color: '#2C2C2C' }}>
                {collection.order?.user?.name || collection.order?.user?.email || '—'}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280' }}>Expected Amount</p>
              <p className="font-bold text-lg" style={{ color: '#2C2C2C' }}>
                ৳{Number(collection.expectedAmount).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280' }}>Status</p>
              <p className="font-medium" style={{ color: '#2C2C2C' }}>
                {collection.status}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Collected Amount (৳)
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                step="0.01"
                min="0"
                value={collectedAmount}
                onChange={(e) => setCollectedAmount(e.target.value)}
                placeholder="0.00"
                className="flex-1 px-4 py-2 border rounded-md"
                style={{ borderColor: '#d1d5db' }}
                required
              />
              <button
                type="button"
                onClick={handleFillExpected}
                className="px-3 py-2 border rounded-md text-sm hover:bg-gray-50"
                style={{ borderColor: '#d1d5db', color: '#8e2157' }}
              >
                Full Amount
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any notes about this collection..."
              rows={3}
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
              {submitting ? 'Recording...' : 'Mark as Collected'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
