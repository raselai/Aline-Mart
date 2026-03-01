import nodemailer from 'nodemailer'
import { render } from '@react-email/render'
import OrderConfirmationEmail from '@/emails/OrderConfirmation'
import PaymentReceivedEmail from '@/emails/PaymentReceived'
import OrderShippedEmail from '@/emails/OrderShipped'
import SignatureCardWelcomeEmail from '@/emails/SignatureCardWelcome'
import SignatureCardOTPEmail from '@/emails/SignatureCardOTP'
import type { OrderWithDetails } from '@/types/order'
import type { SignatureCard } from '@/types/signature-card'

// Lazy-load transporter to avoid build-time errors when env vars are missing
let transporter: nodemailer.Transporter | null = null

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp-relay.brevo.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    })
  }
  return transporter
}

const FROM_EMAIL = process.env.FROM_EMAIL || 'support@alinemart.com'
const FROM_NAME = process.env.FROM_NAME || 'Aline Mart'

async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<{ success: boolean; error?: string }> {
  try {
    const transport = getTransporter()
    await transport.sendMail({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    })
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
 * Send order confirmation email (sent immediately after order creation)
 */
export async function sendOrderConfirmationEmail(
  order: OrderWithDetails,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  const html = await render(OrderConfirmationEmail({ order }))
  return sendEmail({
    to: recipientEmail,
    subject: `Order Confirmation - ${order.orderNumber}`,
    html,
  })
}

/**
 * Send payment received email (sent after PayStation payment confirmed)
 */
export async function sendPaymentReceivedEmail(
  order: OrderWithDetails,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  const html = await render(PaymentReceivedEmail({ order }))
  return sendEmail({
    to: recipientEmail,
    subject: `Payment Received - ${order.orderNumber}`,
    html,
  })
}

/**
 * Send order shipped email (sent when admin marks order as SHIPPED)
 */
export async function sendOrderShippedEmail(
  order: OrderWithDetails,
  recipientEmail: string,
  trackingNumber?: string
): Promise<{ success: boolean; error?: string }> {
  const html = await render(OrderShippedEmail({ order, trackingNumber }))
  return sendEmail({
    to: recipientEmail,
    subject: `Your Order Has Been Shipped - ${order.orderNumber}`,
    html,
  })
}

/**
 * Send Signature Card welcome email on card activation
 */
export async function sendSignatureCardWelcomeEmail(
  card: SignatureCard,
  recipientEmail: string
): Promise<{ success: boolean; error?: string }> {
  const maskedCard = `****-****-****-${card.cardNumber.slice(-4)}`
  const validUntil = card.validUntil
    ? new Date(card.validUntil).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'N/A'

  const discountMap: Record<string, string> = {
    CROWN: '40% off Aline Fashion, 15% off other brands, Free delivery on all orders',
    PRIVILEGE: '30% off Aline Fashion, 10% off other brands',
    CAMPUS: '30% off Aline Fashion, 10% off other brands',
  }

  const html = await render(SignatureCardWelcomeEmail({
    cardholderName: card.cardholderName,
    category: card.category,
    maskedCardNumber: maskedCard,
    validUntil,
    discountInfo: discountMap[card.category] || '',
  }))

  return sendEmail({
    to: recipientEmail,
    subject: `Welcome to Signature ${card.category} - Aline Mart`,
    html,
  })
}

/**
 * Send Signature Card OTP email
 */
export async function sendSignatureCardOTPEmail(
  otpCode: string,
  recipientEmail: string,
  cardholderName: string
): Promise<{ success: boolean; error?: string }> {
  const html = await render(SignatureCardOTPEmail({ otpCode, cardholderName }))
  return sendEmail({
    to: recipientEmail,
    subject: `Your Verification Code - Aline Mart`,
    html,
  })
}
