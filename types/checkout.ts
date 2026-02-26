import { z } from 'zod'

export const bangladeshPhoneRegex = /^01[3-9]\d{8}$/
export const bangladeshZipRegex = /^\d{4}$/

export const contactStepSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(bangladeshPhoneRegex, 'Invalid Bangladesh phone number (e.g., 01712345678)'),
})

export const shippingStepSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'Division/State is required'),
  zipCode: z.string().regex(bangladeshZipRegex, 'Zip code must be 4 digits'),
  country: z.literal('Bangladesh'),
  pathaoCityId: z.number().int().positive().optional(),
  pathaoZoneId: z.number().int().positive().optional(),
  pathaoAreaId: z.number().int().positive().optional(),
})

export const paymentStepSchema = z.object({
  paymentMethod: z.enum(['PAYSTATION', 'COD', 'VIRTUAL_CARD']).refine((val) => val, {
    message: 'Please select a payment method',
  }),
})

export const checkoutSchema = contactStepSchema
  .merge(shippingStepSchema)
  .merge(paymentStepSchema)

export type ContactStepData = z.infer<typeof contactStepSchema>
export type ShippingStepData = z.infer<typeof shippingStepSchema>
export type PaymentStepData = z.infer<typeof paymentStepSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const addressFormSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  phone: z.string().regex(bangladeshPhoneRegex, 'Invalid Bangladesh phone number (e.g., 01712345678)'),
  addressLine1: z.string().min(5, 'Address is required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'Division/State is required'),
  zipCode: z.string().regex(bangladeshZipRegex, 'Zip code must be 4 digits'),
  country: z.literal('Bangladesh'),
  isDefault: z.boolean().optional(),
  pathaoCityId: z.number().int().positive().optional(),
  pathaoZoneId: z.number().int().positive().optional(),
  pathaoAreaId: z.number().int().positive().optional(),
})
export type AddressFormData = z.infer<typeof addressFormSchema>

export interface SavedAddress {
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
  isDefault: boolean
  pathaoCityId?: number | null
  pathaoZoneId?: number | null
  pathaoAreaId?: number | null
  createdAt: string
  updatedAt: string
}

export interface CheckoutSession {
  sessionId: string
  cartItems: CartItem[]
  contactInfo?: ContactStepData
  shippingInfo?: ShippingStepData
  paymentInfo?: PaymentStepData
  orderId?: string
  expiresAt: number
}

export interface CartItem {
  productId: string
  productName: string
  brandName: string
  variantId: string
  variantName: string
  quantity: number
  price: number
  imageUrl?: string
  stock: number
}
