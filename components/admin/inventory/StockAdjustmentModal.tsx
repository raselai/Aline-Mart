'use client'

import { useState } from 'react'
import { X, Plus, Minus, AlertTriangle } from 'lucide-react'
import type { ChangeType, InventoryVariant } from '@/types/inventory'
import { CHANGE_TYPE_LABELS } from '@/types/inventory'

interface StockAdjustmentModalProps {
  variant: InventoryVariant | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (adjustment: number, changeType: ChangeType, reason: string) => Promise<void>
}

export default function StockAdjustmentModal({
  variant,
  isOpen,
  onClose,
  onSubmit
}: StockAdjustmentModalProps) {
  const [adjustment, setAdjustment] = useState(0)
  const [changeType, setChangeType] = useState<ChangeType>('MANUAL_ADJUSTMENT')
  const [reason, setReason] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen || !variant) return null

  const newStock = variant.stock + adjustment

  const handleSubmit = async () => {
    if (adjustment === 0) {
      setError('Adjustment cannot be zero')
      return
    }
    if (newStock < 0) {
      setError('Stock cannot be negative')
      return
    }
    if (!reason.trim()) {
      setError('Please provide a reason for this adjustment')
      return
    }

    setError('')
    setSubmitting(true)
    try {
      await onSubmit(adjustment, changeType, reason.trim())
      handleClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to adjust stock')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    setAdjustment(0)
    setChangeType('MANUAL_ADJUSTMENT')
    setReason('')
    setError('')
    onClose()
  }

  const adjustmentTypes: { value: ChangeType; label: string }[] = [
    { value: 'MANUAL_ADJUSTMENT', label: CHANGE_TYPE_LABELS.MANUAL_ADJUSTMENT },
    { value: 'RESTOCK', label: CHANGE_TYPE_LABELS.RESTOCK },
    { value: 'RETURN', label: CHANGE_TYPE_LABELS.RETURN },
    { value: 'DAMAGED', label: CHANGE_TYPE_LABELS.DAMAGED }
  ]

  const getVariantName = () => {
    const parts: string[] = []
    if (variant.color) parts.push(variant.color)
    if (variant.size) parts.push(variant.size)
    return parts.length > 0 ? parts.join(' / ') : 'Default'
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <div>
            <h2 className="text-lg font-serif font-bold" style={{ color: '#2C2C2C' }}>
              Adjust Stock
            </h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {variant.product.name}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Variant Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p style={{ color: '#6B7280' }}>SKU</p>
                <p className="font-medium" style={{ color: '#2C2C2C' }}>{variant.sku}</p>
              </div>
              <div>
                <p style={{ color: '#6B7280' }}>Variant</p>
                <p className="font-medium" style={{ color: '#2C2C2C' }}>{getVariantName()}</p>
              </div>
              <div>
                <p style={{ color: '#6B7280' }}>Current Stock</p>
                <p className="font-medium text-lg" style={{ color: '#2C2C2C' }}>{variant.stock}</p>
              </div>
              <div>
                <p style={{ color: '#6B7280' }}>New Stock</p>
                <p
                  className="font-medium text-lg"
                  style={{ color: newStock < 0 ? '#DC2626' : newStock <= variant.lowStockThreshold ? '#D97706' : '#059669' }}
                >
                  {newStock}
                </p>
              </div>
            </div>
          </div>

          {/* Adjustment Controls */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Adjustment Amount
            </label>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAdjustment(a => a - 1)}
                className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              >
                <Minus className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
              <input
                type="number"
                value={adjustment}
                onChange={(e) => setAdjustment(parseInt(e.target.value) || 0)}
                className="flex-1 text-center text-xl font-medium px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
              <button
                onClick={() => setAdjustment(a => a + 1)}
                className="p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                style={{ borderColor: '#e5e7eb' }}
              >
                <Plus className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
              Use negative numbers to decrease stock
            </p>
          </div>

          {/* Change Type */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Reason Type
            </label>
            <select
              value={changeType}
              onChange={(e) => setChangeType(e.target.value as ChangeType)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              {adjustmentTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Reason Details
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for adjustment..."
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 resize-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg" style={{ backgroundColor: '#FEE2E2', color: '#991B1B' }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleClose}
              className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
              style={{ borderColor: '#d1d5db', color: '#6B7280' }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || adjustment === 0 || !reason.trim()}
              className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#8e2157' }}
            >
              {submitting ? 'Updating...' : 'Update Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
