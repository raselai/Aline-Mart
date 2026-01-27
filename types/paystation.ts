export interface PayStationConfig {
  merchantId: string
  password: string
  apiUrl: string
  sandboxMode: boolean
  callbackUrl: string
}

export interface CheckoutItem {
  name: string
  quantity: number
  price: number
}

export interface InitiatePaymentParams {
  orderNumber: string
  amount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  customerAddress?: string
  reference?: string
  checkoutItems?: CheckoutItem[]
}

export interface PayStationInitiateResponse {
  status_code: number
  status: string
  message: string
  payment_url?: string
  invoice_number?: string
}

export interface PayStationCallbackParams {
  status: string // 'Success' | 'Failed' | 'Cancelled'
  invoice_number: string
  trx_id?: string
}

export interface PayStationTransactionStatus {
  success: boolean
  data?: {
    trx_status: 'Success' | 'Failed' | 'Pending' | 'Cancelled'
    trx_id: string
    invoice_number: string
    payment_amount: number
    order_date_time: string
    payer_mobile_no?: string
    payment_method?: string
    reference?: string
    checkout_items?: CheckoutItem[]
  }
  error?: string
}
