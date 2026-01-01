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

interface OrderShippedEmailProps {
  order: OrderWithDetails
  trackingNumber?: string
}

export default function OrderShippedEmail({ order, trackingNumber }: OrderShippedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your order {order.orderNumber} has been shipped - Aline Mart</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <div style={shippingBadge}>📦</div>
          <Heading style={h1}>Your Order Has Been Shipped!</Heading>
          <Text style={text}>
            Good news! Your order is on its way to you.
          </Text>

          {/* Order Info */}
          <Section style={orderInfo}>
            <Text style={orderNumber}>
              Order Number: <strong>{order.orderNumber}</strong>
            </Text>
            {trackingNumber && (
              <div style={trackingBox}>
                <Text style={trackingLabel}>Tracking Number</Text>
                <Text style={trackingValue}>{trackingNumber}</Text>
              </div>
            )}
          </Section>

          <Hr style={hr} />

          {/* Delivery Information */}
          <Section style={section}>
            <Heading style={h2}>Delivery Information</Heading>
            <Text style={text}>
              <strong>Estimated Delivery:</strong> 3-7 business days from shipment date
            </Text>
            <Text style={deliveryNote}>
              A delivery person will contact you before delivery. Please ensure someone is available to receive the package.
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
              {order.shippingAddress.country}<br />
              Phone: {order.shippingAddress.phone}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Order Items */}
          <Section style={section}>
            <Heading style={h2}>Items in This Shipment</Heading>
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

          {/* Payment Information */}
          {order.paymentMethod === 'COD' && (
            <Section style={section}>
              <Heading style={h2}>Payment Information</Heading>
              <div style={codBox}>
                <Text style={codLabel}>Cash on Delivery</Text>
                <Text style={codAmount}>Amount to Pay: {formatPrice(order.total)}</Text>
                <Text style={codNote}>
                  Please have the exact amount ready when the delivery arrives.
                </Text>
              </div>
            </Section>
          )}

          <Hr style={hr} />

          {/* Customer Support */}
          <Section style={section}>
            <Heading style={h2}>Need Help?</Heading>
            <Text style={text}>
              If you have any questions about your delivery, please contact our customer support:
            </Text>
            <Text style={contactInfo}>
              Email: orders@alinemart.com<br />
              Phone: +880 1XXX-XXXXXX
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Text style={footer}>
            Thank you for shopping with Aline Mart!
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

const shippingBadge = {
  fontSize: '64px',
  margin: '40px auto 20px',
  textAlign: 'center' as const,
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
  margin: '8px 0',
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

const trackingBox = {
  backgroundColor: '#f3f4f6',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px auto',
  maxWidth: '400px',
}

const trackingLabel = {
  color: '#666666',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  margin: '0 0 8px',
}

const trackingValue = {
  color: '#333333',
  fontSize: '20px',
  fontWeight: 'bold',
  fontFamily: 'monospace',
  margin: '0',
}

const section = {
  padding: '0 40px',
}

const deliveryNote = {
  backgroundColor: '#fef3c7',
  border: '1px solid #fbbf24',
  borderRadius: '6px',
  color: '#92400e',
  fontSize: '14px',
  padding: '12px',
  margin: '12px 0',
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

const codBox = {
  backgroundColor: '#fff7ed',
  border: '2px solid #ff6b00',
  borderRadius: '8px',
  padding: '16px',
  margin: '12px 0',
}

const codLabel = {
  color: '#ff6b00',
  fontSize: '14px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const codAmount = {
  color: '#333333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 8px',
}

const codNote = {
  color: '#666666',
  fontSize: '13px',
  margin: '0',
}

const contactInfo = {
  color: '#666666',
  fontSize: '14px',
  lineHeight: '20px',
  margin: '12px 0',
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
