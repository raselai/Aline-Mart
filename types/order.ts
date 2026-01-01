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
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  brandName: string
  variantId: string
  variantName: string
  quantity: number
  price: number
  total: number
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
