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
import { formatPrice } from '@/lib/order-utils'

interface PaymentReceivedEmailProps {
  order: OrderWithDetails
}

export default function PaymentReceivedEmail({ order }: PaymentReceivedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Payment received for order {order.orderNumber} - Aline Mart</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <div style={successBadge}>✓</div>
          <Heading style={h1}>Payment Received!</Heading>
          <Text style={text}>
            We've received your payment and your order is now being processed.
          </Text>

          {/* Order Info */}
          <Section style={orderInfo}>
            <Text style={orderNumber}>
              Order Number: <strong>{order.orderNumber}</strong>
            </Text>
            {order.paystationTransactionId && (
              <Text style={transactionId}>
                Transaction ID: {order.paystationTransactionId}
              </Text>
            )}
          </Section>

          <Hr style={hr} />

          {/* Payment Summary */}
          <Section style={section}>
            <Heading style={h2}>Payment Summary</Heading>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Subtotal:</Text>
              <Text style={summaryValue}>{formatPrice(order.total - order.shippingCost)}</Text>
            </div>
            <div style={summaryRow}>
              <Text style={summaryLabel}>Shipping:</Text>
              <Text style={summaryValue}>FREE</Text>
            </div>
            <div style={totalRow}>
              <Text style={totalLabel}>Total Paid:</Text>
              <Text style={totalValue}>{formatPrice(order.total)}</Text>
            </div>
          </Section>

          <Hr style={hr} />

          {/* Next Steps */}
          <Section style={section}>
            <Heading style={h2}>What's Next?</Heading>
            <Text style={text}>
              1. <strong>Order Processing:</strong> We're preparing your items for shipment<br />
              2. <strong>Quality Check:</strong> Each item is carefully inspected<br />
              3. <strong>Shipping:</strong> You'll receive a tracking number once your order ships<br />
              4. <strong>Delivery:</strong> Your order will arrive within 3-7 business days
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Shipping Address */}
          <Section style={section}>
            <Heading style={h2}>Shipping To</Heading>
            <Text style={address}>
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.addressLine1}<br />
              {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading style={h2}>Your Items</Heading>
            {order.items.map((item) => (
              <div key={item.id} style={itemRow}>
                <div style={itemDetails}>
                  <Text style={itemName}>{item.productName}</Text>
                  <Text style={itemMeta}>Qty: {item.quantity} × {formatPrice(item.price)}</Text>
                </div>
                <Text style={itemPrice}>{formatPrice(item.total)}</Text>
              </div>
            ))}
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Thank you for shopping with Aline Mart!
          </Text>
          <Text style={footer}>
            Questions? Contact us at orders@alinemart.com
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

const successBadge = {
  backgroundColor: '#10b981',
  borderRadius: '50%',
  color: '#ffffff',
  fontSize: '48px',
  fontWeight: 'bold',
  height: '80px',
  lineHeight: '80px',
  margin: '40px auto 20px',
  textAlign: 'center' as const,
  width: '80px',
}

const h1 = {
  color: '#8e2157',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
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
  textAlign: 'center' as const,
}

const orderNumber = {
  color: '#8e2157',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '8px 0',
}

const transactionId = {
  color: '#666666',
  fontSize: '12px',
  fontFamily: 'monospace',
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
  marginBottom: '12px',
  paddingBottom: '12px',
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
  borderTop: '2px solid #10b981',
}

const totalLabel = {
  color: '#333333',
  fontSize: '18px',
  fontWeight: 'bold',
}

const totalValue = {
  color: '#10b981',
  fontSize: '24px',
  fontWeight: 'bold',
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
  margin: '8px 0',
}
