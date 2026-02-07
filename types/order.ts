export type OrderStatus = 'NEW' | 'PENDING' | 'CONFIRM' | 'CANCEL' | 'RETURN' | 'REFUND' | 'PARTIAL_CONFIRMED' | 'DELIVERED' | 'RETURN_TO_VENDOR'
export type ShippingStatus = 'PROCESSING' | 'READY_TO_DISPATCH' | 'IN_DESTINATION' | 'ON_THE_WAY' | 'DELIVERED' | 'CANCEL' | 'RETURN'
export type PaymentMethod = 'PAYSTATION' | 'COD'
export type PaymentStatus = 'UNPAID' | 'PAID' | 'FAILED'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  total: number
  status: OrderStatus
  shippingStatus: ShippingStatus
  shippingAddressId: string
  paymentMethod: PaymentMethod
  shippingCost: number
  paymentStatus?: PaymentStatus
  paymentChannel?: string | null
  paystationTransactionId?: string | null
  cancellationReason?: string | null
  createdAt: string
  updatedAt: string
}

export type OrderItemStatus = 'ACTIVE' | 'CANCELLED' | 'RETURNED' | 'REFUNDED'

export interface OrderItem {
  id: string
  orderId: string
  subOrderNumber?: string | null
  status: OrderItemStatus
  productId: string
  productName: string
  brandName: string
  variantId: string
  variantName: string
  quantity: number
  price: number
  total: number
  costPrice?: number | null
  vendor?: string | null
  itemCancellationReason?: string | null
  image?: string | null
}

export interface OrderWithDetails extends Order {
  items: OrderItem[]
  shippingAddress: Address
  user: {
    name: string
    email: string
  }
}

export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string | null
  city: string
  state: string
  zipCode: string
  country: string
  createdAt: string
  updatedAt: string
}

/**
 * Order item for admin list view (reduced fields for performance)
 */
export interface AdminOrderListItem {
  id: string
  orderNumber: string
  total: number
  status: OrderStatus
  shippingStatus: ShippingStatus
  paymentMethod: PaymentMethod
  paymentStatus?: PaymentStatus
  createdAt: string
  user: {
    name: string | null
    email: string
  }
  shippingAddress: {
    city: string
    fullName: string
  }
  itemCount: number
}

/**
 * Filters for admin order queries
 */
export interface OrderFilters {
  status?: OrderStatus
  shippingStatus?: ShippingStatus
  paymentMethod?: PaymentMethod
  search?: string
  dateFrom?: string
  dateTo?: string
  sort?: 'createdAt' | 'total' | 'orderNumber'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}
