// Core Types for Aline Mart

export interface Brand {
  id: string
  name: string
  slug: string
  logo?: string
  description?: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  parent?: Category
  children?: Category[]
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  brandId: string
  brand: Brand
  categoryId: string
  category: Category
  images: ProductImage[]
  variants: ProductVariant[]
  featured: boolean
  isNew: boolean
  inStock: boolean
  createdAt: Date
  updatedAt: Date
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  order: number
  productId: string
}

export interface ProductVariant {
  id: string
  productId: string
  color?: string
  size?: string
  sku: string
  stock: number
  priceModifier: number
}

export interface User {
  id: string
  email: string
  name?: string
  createdAt: Date
  updatedAt: Date
}

export interface Address {
  id: string
  userId: string
  fullName: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  userId: string
  user: User
  items: OrderItem[]
  total: number
  status: OrderStatus
  shippingAddressId: string
  shippingAddress: Address
  stripePaymentId?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  brandName: string
  variantId?: string
  quantity: number
  price: number
  total: number
}

export interface WishlistItem {
  id: string
  userId: string
  productId: string
  createdAt: Date
}

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'

export interface CartItem {
  productId: string
  variantId?: string
  quantity: number
  product: Product
  variant?: ProductVariant
}

export interface CartState {
  items: CartItem[]
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void
  removeItem: (productId: string, variantId?: string) => void
  updateQuantity: (productId: string, quantity: number, variantId?: string) => void
  clearCart: () => void
  getTotal: () => number
  getItemCount: () => number
}
