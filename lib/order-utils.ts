import { nanoid } from 'nanoid'
import type { OrderStatus, ShippingStatus } from '@/types/order'

/**
 * Generate a unique order number
 * Format: AM-{timestamp}-{random}
 * Example: AM-LQ7X8Y9Z-A1B2C3
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = nanoid(6).toUpperCase()
  return `AM-${timestamp}-${random}`
}

/**
 * Format price in BDT currency
 */
export function formatPrice(amount: number): string {
  return `৳${amount.toLocaleString('en-BD', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`
}

/**
 * All order status options
 */
export const ORDER_STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: 'NEW', label: 'New' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'CONFIRM', label: 'Confirm' },
  { value: 'CANCEL', label: 'Cancel' },
  { value: 'RETURN', label: 'Return' },
  { value: 'REFUND', label: 'Refund' },
  { value: 'PARTIAL_CONFIRMED', label: 'Partial Confirmed' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'RETURN_TO_VENDOR', label: 'Return to Vendor' },
]

/**
 * All shipping status options
 */
export const SHIPPING_STATUS_OPTIONS: { value: ShippingStatus; label: string }[] = [
  { value: 'PROCESSING', label: 'Processing' },
  { value: 'READY_TO_DISPATCH', label: 'Ready to Dispatch' },
  { value: 'IN_DESTINATION', label: 'In Destination' },
  { value: 'ON_THE_WAY', label: 'On the Way to Delivery' },
  { value: 'DELIVERED', label: 'Delivered' },
  { value: 'CANCEL', label: 'Cancel' },
  { value: 'RETURN', label: 'Return' },
]

/**
 * Parse order status color for UI
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    NEW: 'bg-sky-100 text-sky-800',
    PENDING: 'bg-yellow-100 text-yellow-800',
    CONFIRM: 'bg-green-100 text-green-800',
    CANCEL: 'bg-red-100 text-red-800',
    RETURN: 'bg-orange-100 text-orange-800',
    REFUND: 'bg-purple-100 text-purple-800',
    PARTIAL_CONFIRMED: 'bg-amber-100 text-amber-800',
    DELIVERED: 'bg-emerald-100 text-emerald-800',
    RETURN_TO_VENDOR: 'bg-rose-100 text-rose-800',
    // Legacy fallbacks
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Parse shipping status color for UI
 */
export function getShippingStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PROCESSING: 'bg-blue-100 text-blue-800',
    READY_TO_DISPATCH: 'bg-indigo-100 text-indigo-800',
    IN_DESTINATION: 'bg-violet-100 text-violet-800',
    ON_THE_WAY: 'bg-amber-100 text-amber-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCEL: 'bg-red-100 text-red-800',
    RETURN: 'bg-orange-100 text-orange-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get order status display name
 */
export function getStatusDisplayName(status: string): string {
  const found = ORDER_STATUS_OPTIONS.find(o => o.value === status)
  if (found) return found.label
  // Legacy fallbacks
  const legacy: Record<string, string> = {
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    CANCELLED: 'Cancelled',
  }
  return legacy[status] || status
}

/**
 * Get shipping status display name
 */
export function getShippingStatusDisplayName(status: string): string {
  const found = SHIPPING_STATUS_OPTIONS.find(o => o.value === status)
  if (found) return found.label
  return status
}

/**
 * Get payment method display name
 */
export function getPaymentMethodName(method: string): string {
  const names: Record<string, string> = {
    PAYSTATION: 'PayStation (bKash/Nagad/Cards)',
    COD: 'Cash on Delivery',
  }
  return names[method] || method
}

/**
 * Parse payment status color for UI badges
 */
export function getPaymentStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PAID: 'bg-green-100 text-green-800',
    UNPAID: 'bg-yellow-100 text-yellow-800',
    FAILED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
}

/**
 * Get payment status display name
 */
export function getPaymentStatusName(status: string): string {
  const names: Record<string, string> = {
    PAID: 'Paid',
    UNPAID: 'Unpaid',
    FAILED: 'Failed',
  }
  return names[status] || status
}
