import { Resend } from 'resend'
import OrderConfirmationEmail from '@/emails/OrderConfirmation'
import PaymentReceivedEmail from '@/emails/PaymentReceived'
import OrderShippedEmail from '@/emails/OrderShipped'
import type { OrderWithDetails } from '@/types/order'

const resend = new Resend(process.env.RESEND_API_KEY)

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
