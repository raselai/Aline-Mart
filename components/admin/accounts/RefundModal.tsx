'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { REFUND_REASONS } from '@/types/accounts'

interface OrderForRefund {
  id: string
  orderNumber: string
  total: number
  paymentMethod: string
  items?: Array<{
    id: string
    productName: string
    brandName: string
    variantName: string
    quantity: number
    price: number
    total: number
  }>
}

interface RefundModalProps {
  order: OrderForRefund | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: {
    orderId: string
    orderItemId?: string
    amount: number
    reason: string
    type: 'FULL' | 'PARTIAL'
    restoreStock: boolean
    notes?: string
  }) => Promise<void>
}

export default function RefundModal({ order, isOpen, onClose, onSubmit }: RefundModalProps) {
  const [refundType, setRefundType] = useState<'FULL' | 'PARTIAL'>('FULL')
  const [selectedItemId, setSelectedItemId] = useState('')
  const [amount, setAmount] = useState('')
  const [reason, setReason] = useState('')
  const [customReason, setCustomReason] = useState('')
  const [restoreStock, setRestoreStock] = useState(true)
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isOpen || !order) return null

  const handleTypeChange = (type: 'FULL' | 'PARTIAL') => {
    setRefundType(type)
    if (type === 'FULL') {
      setAmount(String(order.total))
      setSelectedItemId('')
    } else {
      setAmount('')
    }
  }

  const handleItemSelect = (itemId: string) => {
    setSelectedItemId(itemId)
    const item = order.items?.find(i => i.id === itemId)
    if (item) {
      setAmount(String(item.total))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const finalReason = reason === 'Other' ? customReason : reason
    if (!finalReason || !amount) return

    setSubmitting(true)
    try {
      await onSubmit({
        orderId: order.id,
        orderItemId: selectedItemId || undefined,
        amount: Number(amount),
        reason: finalReason,
        type: refundType,
        restoreStock,
        notes: notes || undefined,
      })
      // Reset form
      setRefundType('FULL')
      setSelectedItemId('')
      setAmount('')
      setReason('')
      setCustomReason('')
      setRestoreStock(true)
      setNotes('')
      onClose()
    } catch (error) {
      console.error('Error submitting refund:', error)
      alert('Failed to create refund')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Process Refund
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
              <p className="font-medium" style={{ color: '#8e2157' }}>{order.orderNumber}</p>
            </div>
            <div>
              <p style={{ color: '#6B7280' }}>Total</p>
              <p className="font-bold" style={{ color: '#2C2C2C' }}>
                ৳{Number(order.total).toLocaleString('en-BD', { minimumFractionDigits: 2 })}
              </p>
            </div>
            <div>
              <p style={{ color: '#6B7280' }}>Payment Method</p>
              <p className="font-medium" style={{ color: '#2C2C2C' }}>{order.paymentMethod}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Refund Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>Refund Type</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('FULL')}
                className="flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors"
                style={{
                  borderColor: refundType === 'FULL' ? '#8e2157' : '#d1d5db',
                  backgroundColor: refundType === 'FULL' ? '#8e2157' : 'white',
                  color: refundType === 'FULL' ? 'white' : '#2C2C2C',
                }}
              >
                Full Refund
              </button>
              <button
                type="button"
                onClick={() => handleTypeChange('PARTIAL')}
                className="flex-1 px-4 py-2 rounded-md border text-sm font-medium transition-colors"
                style={{
                  borderColor: refundType === 'PARTIAL' ? '#8e2157' : '#d1d5db',
                  backgroundColor: refundType === 'PARTIAL' ? '#8e2157' : 'white',
                  color: refundType === 'PARTIAL' ? 'white' : '#2C2C2C',
                }}
              >
                Partial Refund
              </button>
            </div>
          </div>

          {/* Item Selection for Partial */}
          {refundType === 'PARTIAL' && order.items && order.items.length > 0 && (
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
                Select Item (optional)
              </label>
              <select
                value={selectedItemId}
                onChange={(e) => handleItemSelect(e.target.value)}
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: '#d1d5db' }}
              >
                <option value="">Custom amount</option>
                {order.items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.productName} ({item.variantName}) - ৳{item.total}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Amount */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Refund Amount (৳)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max={order.total}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
              readOnly={refundType === 'FULL'}
              required
            />
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
              style={{ borderColor: '#d1d5db' }}
              required
            >
              <option value="">Select a reason</option>
              {REFUND_REASONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Custom Reason */}
          {reason === 'Other' && (
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Custom Reason</label>
              <input
                type="text"
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Enter reason..."
                className="w-full px-4 py-2 border rounded-md"
                style={{ borderColor: '#d1d5db' }}
                required
              />
            </div>
          )}

          {/* Restore Stock */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="restoreStock"
              checked={restoreStock}
              onChange={(e) => setRestoreStock(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <label htmlFor="restoreStock" className="text-sm" style={{ color: '#2C2C2C' }}>
              Restore stock for refunded items
            </label>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              rows={2}
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
              {submitting ? 'Processing...' : 'Create Refund'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
