import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { OrderWithDetails } from '@/types/order'
import { formatPrice, getPaymentMethodName } from '@/lib/order-utils'

interface OrderConfirmationEmailProps {
  order: OrderWithDetails
}

export default function OrderConfirmationEmail({ order }: OrderConfirmationEmailProps) {
  const orderDate = new Date(order.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <Html>
      <Head />
      <Preview>Your order {order.orderNumber} has been received - Aline Mart</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Heading style={h1}>Order Confirmation</Heading>
          <Text style={text}>
            Thank you for your order! We've received your order and will process it shortly.
          </Text>

          {/* Order Info */}
          <Section style={orderInfo}>
            <Text style={orderNumber}>
              Order Number: <strong>{order.orderNumber}</strong>
            </Text>
            <Text style={orderDateStyle}>
              Date: {orderDate}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Heading style={h2}>Shipping Address</Heading>
            <Text style={address}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && (
                <>
                  {order.shippingAddress.addressLine2}
                  <br />
                </>
              )}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading style={h2}>Order Items</Heading>
            {order.items.map((item) => (
              <div key={item.id} style={itemRow}>
                <div style={itemDetails}>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemMeta}>{item.brandName} - {item.variantName}</Text>
                  <Text style={itemMeta}>Quantity: {item.quantity}</Text>
                </div>
                <Text style={itemPrice}>{formatPrice(item.total)}</Text>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Order Summary */}
          <Section style={section}>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Subtotal:</Text>
              <Text style={summaryValue}>{formatPrice(order.total - order.shippingCost)}</Text>
            </div>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Shipping:</Text>
              <Text style={summaryValue}>
                {order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)}
              </Text>
            </div>
            <div style={totalRow}>
              <Text style={totalLabel}>Total:</Text>
              <Text style={totalValue}>{formatPrice(order.total)}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Payment Method */}
          <Section style={section}>
            <Heading style={h2}>Payment Method</Heading>
            <Text style={text}>{getPaymentMethodName(order.paymentMethod)}</Text>
            {order.paymentMethod === 'COD' && (
              <Text style={note}>
                Please have the exact amount ready when the delivery arrives.
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            If you have any questions about your order, please contact us at orders@alinemart.com
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} Aline Mart. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const h1 = {
  color: '#8e2157',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '40px 0 20px',
  padding: '0 40px',
}

const h2 = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '16px 0 8px',
}

const text = {
  color: '#333333',
  fontSize: '16px',
  lineHeight: '24px',
  padding: '0 40px',
}

const orderInfo = {
  padding: '0 40px',
}

const orderNumber = {
  color: '#8e2157',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '8px 0',
}

const orderDateStyle = {
  color: '#666666',
  fontSize: '14px',
  margin: '4px 0',
}

const section = {
  padding: '0 40px',
}

const address = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '8px 0',
}

const itemRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '16px',
  paddingBottom: '16px',
  borderBottom: '1px solid #eeeeee',
}

const itemDetails = {
  flex: 1,
}

const itemName = {
  color: '#333333',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0 0 4px',
}

const itemMeta = {
  color: '#666666',
  fontSize: '14px',
  margin: '2px 0',
}

const itemPrice = {
  color: '#8e2157',
  fontSize: '16px',
  fontWeight: 'bold',
  textAlign: 'right' as const,
}

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
}

const summaryLabel = {
  color: '#666666',
  fontSize: '14px',
}

const summaryValue = {
  color: '#333333',
  fontSize: '14px',
  fontWeight: '600',
}

const totalRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '16px',
  paddingTop: '16px',
  borderTop: '2px solid #8e2157',
}

const totalLabel = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
}

const totalValue = {
  color: '#8e2157',
  fontSize: '24px',
  fontWeight: 'bold',
}

const note = {
  color: '#ff6b00',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '8px 0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  textAlign: 'center' as const,
}
