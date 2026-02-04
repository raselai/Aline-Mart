import { nanoid } from 'nanoid'

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
 * Parse order status color for UI
 */
export function getOrderStatusColor(status: string): string {
  const colors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-800',
    PROCESSING: 'bg-blue-100 text-blue-800',
    SHIPPED: 'bg-purple-100 text-purple-800',
    DELIVERED: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800',
  }
  return colors[status] || 'bg-gray-100 text-gray-800'
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

/**
 * Valid status transitions map
 * Key: current status, Value: array of valid next statuses
 */
const STATUS_TRANSITIONS: Record<string, string[]> = {
  PENDING: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Final state
  CANCELLED: ['PENDING'], // Can reactivate
}

/**
 * Check if a status transition is valid
 */
export function canTransitionStatus(
  currentStatus: string,
  newStatus: string
): boolean {
  const validTransitions = STATUS_TRANSITIONS[currentStatus] || []
  return validTransitions.includes(newStatus)
}

/**
 * Get available status transitions for a given status
 */
export function getAvailableStatusTransitions(status: string): string[] {
  return STATUS_TRANSITIONS[status] || []
}

/**
 * Get status display name
 */
export function getStatusDisplayName(status: string): string {
  const names: Record<string, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
  }
  return names[status] || status
}
