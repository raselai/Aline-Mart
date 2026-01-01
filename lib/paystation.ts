import crypto from 'crypto'
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
      successUrl: process.env.PAYSTATION_SUCCESS_URL || '',
      failUrl: process.env.PAYSTATION_FAIL_URL || '',
      cancelUrl: process.env.PAYSTATION_CANCEL_URL || '',
    }

    this.validateConfig()
  }

  private validateConfig() {
    // Skip validation during build time
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return
    }

    const required = ['merchantId', 'password', 'apiUrl', 'successUrl']
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
      const payload = {
        merchant_id: this.config.merchantId,
        password: this.config.password,
        invoice_number: params.orderNumber,
        amount: params.amount.toFixed(2),
        currency: 'BDT',
        customer_name: params.customerName,
        customer_email: params.customerEmail,
        customer_phone: params.customerPhone,
        description: params.description || `Order ${params.orderNumber}`,
        success_url: this.config.successUrl,
        fail_url: this.config.failUrl,
        cancel_url: this.config.cancelUrl,
        mode: this.config.sandboxMode ? 'sandbox' : 'live',
      }

      const response = await fetch(`${this.config.apiUrl}/initiate-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'PayStation API error')
      }

      const data = await response.json()

      return {
        success: true,
        data: {
          payment_url: data.payment_url,
          invoice_number: data.invoice_number,
          session_key: data.session_key,
        },
      }
    } catch (error) {
      console.error('PayStation initiate payment error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Verify a transaction status (server-side verification - CRITICAL)
   * This MUST be called after receiving callback to prevent spoofing
   */
  async verifyTransaction(invoiceNumber: string): Promise<PayStationTransactionStatus> {
    try {
      const payload = {
        merchant_id: this.config.merchantId,
        password: this.config.password,
        invoice_number: invoiceNumber,
      }

      const response = await fetch(`${this.config.apiUrl}/v2/transaction-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Failed to verify transaction')
      }

      const data = await response.json()

      return {
        success: true,
        data: {
          status: data.status,
          trx_id: data.trx_id,
          invoice_number: data.invoice_number,
          amount: parseFloat(data.amount),
          currency: data.currency,
          payment_time: data.payment_time,
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

  /**
   * Verify HMAC signature from callback URL
   * This prevents URL parameter tampering
   */
  verifyCallbackSignature(params: Record<string, string>, signature: string): boolean {
    try {
      // Create sorted query string (excluding signature)
      const { token, ...restParams } = params
      const sortedParams = Object.keys(restParams)
        .sort()
        .map((key) => `${key}=${restParams[key]}`)
        .join('&')

      // Generate HMAC signature
      const expectedSignature = crypto
        .createHmac('sha256', this.config.password)
        .update(sortedParams)
        .digest('hex')

      return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
      )
    } catch (error) {
      console.error('Signature verification error:', error)
      return false
    }
  }
}

// Export singleton instance
export const paystationClient = new PayStationClient()
