import { Resend } from 'resend'
import OrderConfirmationEmail from '@/emails/OrderConfirmation'
import PaymentReceivedEmail from '@/emails/PaymentReceived'
import OrderShippedEmail from '@/emails/OrderShipped'
import SignatureCardWelcomeEmail from '@/emails/SignatureCardWelcome'
import SignatureCardOTPEmail from '@/emails/SignatureCardOTP'
import type { OrderWithDetails } from '@/types/order'
import type { SignatureCard } from '@/types/signature-card'

// Lazy load Resend client to avoid build-time errors
let resendClient: Resend | null = null

function getResendClient(): Resend {
  if (!resendClient) {
    // Use placeholder API key during build, real key at runtime
    const apiKey = process.env.RESEND_API_KEY || 're_placeholder_key_for_build'
    resendClient = new Resend(apiKey)
  }
  return resendClient
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'orders@yourdomain.com'
const FROM_NAME = process.env.FROM_NAME || 'Aline Mart'

/**
 * Send order confirmation email (sent immediately after order creation)
 */
export async function sendOrderConfirmationEmail(
  order: OrderWithDetails,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Order Confirmation - ${order.orderNumber}`,
      react: OrderConfirmationEmail({ order }),
    })

    if (error) {
      console.error('Failed to send order confirmation email:', error)
      return { success: false, error: error.message }
    }

    console.log('Order confirmation email sent:', data?.id)
    return { success: true }
  } catch (error) {
    console.error('Email sending error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send payment received email (sent after PayStation payment confirmed)
 */
export async function sendPaymentReceivedEmail(
  order: OrderWithDetails,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Payment Received - ${order.orderNumber}`,
      react: PaymentReceivedEmail({ order }),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send order shipped email (sent when admin marks order as SHIPPED)
 */
export async function sendOrderShippedEmail(
  order: OrderWithDetails,
  recipientEmail: string,
  trackingNumber?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Your Order Has Been Shipped - ${order.orderNumber}`,
      react: OrderShippedEmail({ order, trackingNumber }),
    })

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send Signature Card welcome email on card activation
 */
export async function sendSignatureCardWelcomeEmail(
  card: SignatureCard,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()

    const maskedCard = `****-****-****-${card.cardNumber.slice(-4)}`
    const validUntil = card.validUntil
      ? new Date(card.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : 'N/A'

    const discountMap: Record<string, string> = {
      CROWN: '40% off Aline Fashion, 15% off other brands, Free delivery on all orders',
      PRIVILEGE: '30% off Aline Fashion, 10% off other brands',
      CAMPUS: '30% off Aline Fashion, 10% off other brands',
    }

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Welcome to Signature ${card.category} - Aline Mart`,
      react: SignatureCardWelcomeEmail({
        cardholderName: card.cardholderName,
        category: card.category,
        maskedCardNumber: maskedCard,
        validUntil,
        discountInfo: discountMap[card.category] || '',
      }),
    })

    if (error) {
      console.error('Failed to send signature card welcome email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Send Signature Card OTP email
 */
export async function sendSignatureCardOTPEmail(
  otpCode: string,
  recipientEmail: string,
  cardholderName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resend = getResendClient()

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: recipientEmail,
      subject: `Your Verification Code - Aline Mart`,
      react: SignatureCardOTPEmail({ otpCode, cardholderName }),
    })

    if (error) {
      console.error('Failed to send OTP email:', error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
