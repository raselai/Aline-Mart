export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
export type PaymentMethod = 'PAYSTATION' | 'COD'

export interface Order {
  id: string
  orderNumber: string
  userId: string
  total: number
  status: OrderStatus
  shippingAddressId: string
  paymentMethod: PaymentMethod
  shippingCost: number
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
  paymentMethod: PaymentMethod
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
  paymentMethod?: PaymentMethod
  search?: string
  dateFrom?: string
  dateTo?: string
  sort?: 'createdAt' | 'total' | 'orderNumber'
  order?: 'asc' | 'desc'
  page?: number
  limit?: number
}
