export interface PayStationConfig {
  merchantId: string
  password: string
  apiUrl: string
  sandboxMode: boolean
  successUrl: string
  failUrl: string
  cancelUrl: string
}

export interface InitiatePaymentParams {
  orderNumber: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  description?: string
}

export interface PayStationInitiateResponse {
  success: boolean
  message?: string
  data?: {
    payment_url: string
    invoice_number: string
    session_key?: string
  }
  error?: string
}

export interface PayStationCallbackParams {
  status: string // 'Successful' | 'Failed' | 'Cancelled'
  invoice_number: string
  trx_id: string
  amount: string
  token: string // HMAC signature
}

export interface PayStationTransactionStatus {
  success: boolean
  data?: {
    status: 'Successful' | 'Failed' | 'Pending' | 'Cancelled'
    trx_id: string
    invoice_number: string
    amount: number
    currency: string
    payment_time: string
  }
  error?: string
}

export interface PayStationError {
  code: string
  message: string
  details?: any
}
