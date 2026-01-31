// ============================================
// Accounts/Finance Management Types
// ============================================

// --- Transaction ---

export type TransactionType = 'SALE' | 'REFUND' | 'COD_COLLECTION' | 'VENDOR_PAYOUT' | 'ADJUSTMENT'

export interface Transaction {
  id: string
  type: TransactionType
  amount: number
  orderId?: string | null
  refundId?: string | null
  vendorPayoutId?: string | null
  description?: string | null
  reference?: string | null
  createdAt: string
  createdBy?: string | null
  // Joined relations
  order?: {
    orderNumber: string
    total: number
  } | null
}

export interface TransactionFilters {
  type?: TransactionType
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface TransactionListResponse {
  transactions: Transaction[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- Refund ---

export type RefundStatus = 'PENDING' | 'PROCESSED' | 'REJECTED'
export type RefundType = 'FULL' | 'PARTIAL'

export interface Refund {
  id: string
  orderId: string
  orderItemId?: string | null
  amount: number
  reason: string
  status: RefundStatus
  type: RefundType
  restoreStock: boolean
  processedAt?: string | null
  processedBy?: string | null
  notes?: string | null
  createdAt: string
  // Joined relations
  order?: {
    orderNumber: string
    total: number
    paymentMethod: string
  } | null
}

export interface RefundFilters {
  status?: RefundStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface RefundListResponse {
  refunds: Refund[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- COD Collection ---

export type CODCollectionStatus = 'PENDING' | 'COLLECTED' | 'PARTIAL' | 'FAILED'

export interface CODCollection {
  id: string
  orderId: string
  expectedAmount: number
  collectedAmount?: number | null
  collectedAt?: string | null
  collectedBy?: string | null
  status: CODCollectionStatus
  notes?: string | null
  createdAt: string
  // Joined relations
  order?: {
    orderNumber: string
    total: number
    status: string
    createdAt: string
    user?: {
      name: string | null
      email: string
    } | null
    shippingAddress?: {
      fullName: string
      city: string
    } | null
  } | null
}

export interface CODCollectionFilters {
  status?: CODCollectionStatus
  dateFrom?: string
  dateTo?: string
  search?: string
  page?: number
  limit?: number
}

export interface CODCollectionListResponse {
  collections: CODCollection[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- Vendor Payout ---

export type PayoutStatus = 'PENDING' | 'PAID'

export interface VendorPayout {
  id: string
  vendorId: string
  periodStart: string
  periodEnd: string
  totalSales: number
  commissionRate: number
  commissionAmount: number
  payoutAmount: number
  status: PayoutStatus
  paidAt?: string | null
  paidBy?: string | null
  reference?: string | null
  notes?: string | null
  createdAt: string
  // Joined relations
  vendor?: {
    shopName: string
    ownerName: string
    email: string
    bankName?: string | null
    accountNumber?: string | null
  } | null
}

export interface VendorPayoutFilters {
  vendorId?: string
  status?: PayoutStatus
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

export interface VendorPayoutListResponse {
  payouts: VendorPayout[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// --- Dashboard ---

export interface FinancialDashboardStats {
  totalRevenue: number
  netRevenue: number
  pendingCOD: number
  totalRefunds: number
  pendingRefunds: number
  pendingPayouts: number
  revenueByPeriod: {
    date: string
    amount: number
  }[]
  revenueByPaymentMethod: {
    method: string
    amount: number
    count: number
  }[]
  pendingCounts: {
    codCollections: number
    refunds: number
    vendorPayouts: number
  }
}

// --- Reports ---

export interface RevenueReportRow {
  date: string
  orderCount: number
  grossRevenue: number
  refunds: number
  netRevenue: number
  codCollections: number
  vendorPayouts: number
}

export type ReportType = 'sales' | 'revenue' | 'refunds' | 'payouts'

export interface ReportFilters {
  type: ReportType
  dateFrom?: string
  dateTo?: string
  vendorId?: string
  groupBy?: 'day' | 'week' | 'month'
}

// --- Refund Reasons ---

export const REFUND_REASONS = [
  'Customer requested cancellation',
  'Item out of stock',
  'Item damaged during shipping',
  'Wrong item delivered',
  'Item not as described',
  'Quality issue',
  'Other',
] as const

export type RefundReason = typeof REFUND_REASONS[number]
