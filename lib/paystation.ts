import type {
  PayStationConfig,
  InitiatePaymentParams,
  PayStationInitiateResponse,
  PayStationTransactionStatus,
} from '@/types/paystation'

export class PayStationClient {
  private config: PayStationConfig

  constructor() {
    this.config = {
      merchantId: process.env.PAYSTATION_MERCHANT_ID || '',
      password: process.env.PAYSTATION_PASSWORD || '',
      apiUrl: process.env.PAYSTATION_API_URL || '',
      sandboxMode: process.env.PAYSTATION_SANDBOX_MODE === 'true',
      callbackUrl: process.env.PAYSTATION_CALLBACK_URL || '',
    }

    this.validateConfig()
  }

  private validateConfig() {
    // Skip validation during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return
    }

    const required = ['merchantId', 'password', 'apiUrl', 'callbackUrl']
    const missing = required.filter((key) => !this.config[key as keyof PayStationConfig])

    if (missing.length > 0) {
      throw new Error(`Missing PayStation config: ${missing.join(', ')}`)
    }
  }

  /**
   * Initiate a payment session with PayStation
   * Returns a redirect URL where the customer should be sent
   */
  async initiatePayment(params: InitiatePaymentParams): Promise<PayStationInitiateResponse> {
    try {
      const payload: Record<string, unknown> = {
        merchantId: this.config.merchantId,
        password: this.config.password,
        invoice_number: params.orderNumber,
        currency: 'BDT',
        payment_amount: params.amount,
        reference: params.reference || params.orderNumber,
        cust_name: params.customerName,
        cust_phone: params.customerPhone,
        cust_email: params.customerEmail,
        callback_url: this.config.callbackUrl,
      }

      if (params.customerAddress) {
        payload.cust_address = params.customerAddress
      }

      if (params.checkoutItems && params.checkoutItems.length > 0) {
        payload.checkout_items = params.checkoutItems
      }

      const response = await fetch(`${this.config.apiUrl}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data: PayStationInitiateResponse = await response.json()

      if (data.status !== 'success' || !data.payment_url) {
        console.error('PayStation initiate payment failed:', data.message)
        return data
      }

      return data
    } catch (error) {
      console.error('PayStation initiate payment error:', error)
      return {
        status_code: 500,
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Verify a transaction status (server-side verification - CRITICAL)
   * This MUST be called after receiving callback to prevent spoofing
   */
  async verifyTransaction(invoiceNumber: string): Promise<PayStationTransactionStatus> {
    try {
      const response = await fetch(`${this.config.apiUrl}/transaction-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'merchantId': this.config.merchantId,
        },
        body: JSON.stringify({
          invoice_number: invoiceNumber,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to verify transaction')
      }

      const data = await response.json()

      if (!data.data) {
        return {
          success: false,
          error: data.message || 'No transaction data returned',
        }
      }

      return {
        success: true,
        data: {
          trx_status: data.data.trx_status,
          trx_id: data.data.trx_id,
          invoice_number: data.data.invoice_number,
          payment_amount: parseFloat(data.data.payment_amount),
          order_date_time: data.data.order_date_time,
          payer_mobile_no: data.data.payer_mobile_no,
          payment_method: data.data.payment_method,
          reference: data.data.reference,
          checkout_items: data.data.checkout_items,
        },
      }
    } catch (error) {
      console.error('PayStation verify transaction error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}

// Export singleton instance
export const paystationClient = new PayStationClient()
