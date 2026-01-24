/**
 * Inventory Management Types
 * Used for stock tracking, adjustments, and audit logging
 */

// Types of inventory changes for audit trail
export type ChangeType =
  | 'SALE'              // Stock decreased due to order sale
  | 'MANUAL_ADJUSTMENT' // Manual stock adjustment by admin
  | 'RETURN'            // Stock restored from customer return
  | 'DAMAGED'           // Stock decreased due to damaged goods
  | 'RESTOCK'           // Stock increased from supplier
  | 'CANCELLED_ORDER'   // Stock restored from cancelled order
  | 'BULK_UPDATE'       // Bulk stock update by admin

// Display labels for change types
export const CHANGE_TYPE_LABELS: Record<ChangeType, string> = {
  SALE: 'Sale',
  MANUAL_ADJUSTMENT: 'Manual Adjustment',
  RETURN: 'Return',
  DAMAGED: 'Damaged',
  RESTOCK: 'Restock',
  CANCELLED_ORDER: 'Cancelled Order',
  BULK_UPDATE: 'Bulk Update'
}

// Colors for change types (for UI badges)
export const CHANGE_TYPE_COLORS: Record<ChangeType, { bg: string; text: string }> = {
  SALE: { bg: 'bg-blue-100', text: 'text-blue-800' },
  MANUAL_ADJUSTMENT: { bg: 'bg-gray-100', text: 'text-gray-800' },
  RETURN: { bg: 'bg-green-100', text: 'text-green-800' },
  DAMAGED: { bg: 'bg-red-100', text: 'text-red-800' },
  RESTOCK: { bg: 'bg-emerald-100', text: 'text-emerald-800' },
  CANCELLED_ORDER: { bg: 'bg-orange-100', text: 'text-orange-800' },
  BULK_UPDATE: { bg: 'bg-purple-100', text: 'text-purple-800' }
}

// Inventory log entry from database
export interface InventoryLog {
  id: string
  variantId: string
  productId: string
  previousStock: number
  newStock: number
  changeAmount: number
  changeType: ChangeType
  reason?: string | null
  orderId?: string | null
  adminId?: string | null
  createdAt: string
  // Joined relations (optional)
  variant?: {
    sku: string
    color?: string | null
    size?: string | null
  }
  product?: {
    name: string
    slug: string
  }
  admin?: {
    name: string | null
    email: string
  }
  order?: {
    orderNumber: string
  }
}

// Product variant with inventory details
export interface InventoryVariant {
  id: string
  sku: string
  color?: string | null
  size?: string | null
  stock: number
  lowStockThreshold: number
  productId: string
  product: {
    id: string
    name: string
    slug: string
    images: Array<{ url: string; order?: number }>
    brand: {
      id: string
      name: string
      slug: string
    }
    category: {
      id: string
      name: string
      slug: string
    }
  }
}

// Stock adjustment request
export interface StockAdjustment {
  adjustment: number  // Positive or negative
  reason: string
  changeType: ChangeType
}

// Bulk update item
export interface BulkUpdateItem {
  variantId: string
  newStock: number
}

// Bulk update request
export interface BulkUpdateRequest {
  updates: BulkUpdateItem[]
  reason: string
  changeType: ChangeType
}

// Create inventory log entry data
export interface CreateInventoryLogData {
  variantId: string
  productId: string
  previousStock: number
  newStock: number
  changeAmount: number
  changeType: ChangeType
  reason?: string
  orderId?: string
  adminId?: string
}

// Stock status for filtering
export type StockStatus = 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'

// Stock status display info
export const STOCK_STATUS_INFO: Record<StockStatus, { label: string; color: string }> = {
  all: { label: 'All', color: '' },
  in_stock: { label: 'In Stock', color: 'text-green-600' },
  low_stock: { label: 'Low Stock', color: 'text-yellow-600' },
  out_of_stock: { label: 'Out of Stock', color: 'text-red-600' }
}

// Inventory filters for list API
export interface InventoryFilters {
  search?: string
  stockStatus?: StockStatus
  brandId?: string
  categoryId?: string
  page?: number
  limit?: number
  sortBy?: 'stock' | 'name' | 'sku' | 'updatedAt'
  sortOrder?: 'asc' | 'desc'
}

// Inventory history filters
export interface InventoryHistoryFilters {
  variantId?: string
  changeType?: ChangeType
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

// Inventory list API response
export interface InventoryListResponse {
  variants: InventoryVariant[]
  total: number
  page: number
  limit: number
  stats: InventoryStats
}

// Inventory stats for dashboard
export interface InventoryStats {
  totalVariants: number
  totalInStock: number
  totalLowStock: number
  totalOutOfStock: number
  totalStockValue?: number
}

// Inventory history API response
export interface InventoryHistoryResponse {
  logs: InventoryLog[]
  total: number
  page: number
  limit: number
}

// Adjust stock API response
export interface AdjustStockResponse {
  success: boolean
  variant: {
    id: string
    sku: string
    previousStock: number
    newStock: number
  }
  log: InventoryLog
}

// Bulk update API response
export interface BulkUpdateResponse {
  success: boolean
  updatedCount: number
  logs: InventoryLog[]
  errors?: Array<{
    variantId: string
    error: string
  }>
}

// Helper type for variant name display
export function getVariantDisplayName(variant: { color?: string | null; size?: string | null }): string {
  const parts: string[] = []
  if (variant.color) parts.push(variant.color)
  if (variant.size) parts.push(variant.size)
  return parts.length > 0 ? parts.join(' / ') : 'Default'
}

// Helper to determine stock status
export function getStockStatus(stock: number, threshold: number): StockStatus {
  if (stock === 0) return 'out_of_stock'
  if (stock <= threshold) return 'low_stock'
  return 'in_stock'
}

// Helper to get stock status badge styles
export function getStockStatusStyles(status: StockStatus): { bg: string; text: string } {
  switch (status) {
    case 'out_of_stock':
      return { bg: 'bg-red-100', text: 'text-red-800' }
    case 'low_stock':
      return { bg: 'bg-yellow-100', text: 'text-yellow-800' }
    case 'in_stock':
      return { bg: 'bg-green-100', text: 'text-green-800' }
    default:
      return { bg: 'bg-gray-100', text: 'text-gray-800' }
  }
}
