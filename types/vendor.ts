export type BusinessType = 'INDIVIDUAL' | 'COMPANY'
export type VendorStatus = 'ACTIVE' | 'INACTIVE'

export interface MobileBanking {
  bkash?: string
  nagad?: string
  rocket?: string
}

export interface Vendor {
  id: string

  // Basic Information
  shopName: string
  ownerName: string
  mobile: string
  email: string
  businessType: BusinessType

  // Identity Documents
  nationalId?: string | null
  tinNumber?: string | null

  // Addresses
  pickupAddress: string
  returnAddress?: string | null

  // Status
  status: VendorStatus
  onboardingDate: string

  // Payment Information - Bank
  bankName?: string | null
  bankBranch?: string | null
  accountHolderName?: string | null
  accountNumber?: string | null
  routingNumber?: string | null

  // Payment Information - Mobile Banking
  mobileBanking?: MobileBanking | null

  // Notes
  notes?: string | null

  // Timestamps
  createdAt: string
  updatedAt: string
}

export interface VendorFormData {
  shopName: string
  ownerName: string
  mobile: string
  email: string
  businessType: BusinessType
  nationalId?: string
  tinNumber?: string
  pickupAddress: string
  returnAddress?: string
  status: VendorStatus
  onboardingDate?: string
  bankName?: string
  bankBranch?: string
  accountHolderName?: string
  accountNumber?: string
  routingNumber?: string
  bkash?: string
  nagad?: string
  rocket?: string
  notes?: string
}

export interface VendorFilters {
  search?: string
  status?: VendorStatus
  businessType?: BusinessType
  page?: number
  limit?: number
}

export interface VendorListResponse {
  vendors: Vendor[]
  total: number
  page: number
  limit: number
  totalPages: number
}
