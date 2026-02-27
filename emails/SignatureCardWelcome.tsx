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

interface SignatureCardWelcomeProps {
  cardholderName: string
  category: string
  maskedCardNumber: string
  validUntil: string
  discountInfo: string
}

export default function SignatureCardWelcome({
  cardholderName,
  category,
  maskedCardNumber,
  validUntil,
  discountInfo,
}: SignatureCardWelcomeProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Aline Mart Signature {category} - Your card is now active!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Welcome to Signature {category}</Heading>
          <Hr style={hr} />

          <Text style={text}>Dear {cardholderName},</Text>

          <Text style={text}>
            Congratulations! Your Aline Mart Signature {category} card has been activated successfully.
          </Text>

          <Section style={cardSection}>
            <Text style={cardLabel}>Card Number</Text>
            <Text style={cardValue}>{maskedCardNumber}</Text>

            <Text style={cardLabel}>Valid Until</Text>
            <Text style={cardValue}>{validUntil}</Text>
          </Section>

          <Section style={benefitsSection}>
            <Text style={benefitsHeading}>Your Benefits</Text>
            <Text style={text}>{discountInfo}</Text>
          </Section>

          <Hr style={hr} />

          <Text style={footerText}>
            Your physical card will be shipped to your mailing address. You can start using your card
            balance for online purchases immediately.
          </Text>

          <Text style={footerText}>
            To use your card at checkout, select &quot;Signature Card&quot; as your payment method and
            verify with the OTP sent to your registered email.
          </Text>

          <Text style={footerText}>
            Thank you for choosing Aline Mart.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

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

const heading = {
  fontSize: '24px',
  letterSpacing: '-0.5px',
  lineHeight: '1.3',
  fontWeight: '700' as const,
  color: '#8e2157',
  padding: '17px 0 0',
  textAlign: 'center' as const,
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
}

const text = {
  color: '#2C2C2C',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 24px',
}

const cardSection = {
  backgroundColor: '#fdf2f8',
  borderRadius: '8px',
  padding: '16px 24px',
  margin: '0 24px',
}

const cardLabel = {
  color: '#6B7280',
  fontSize: '12px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.05em',
  margin: '0 0 2px',
}

const cardValue = {
  color: '#2C2C2C',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0 0 12px',
}

const benefitsSection = {
  padding: '0 24px',
  marginTop: '16px',
}

const benefitsHeading = {
  color: '#8e2157',
  fontSize: '16px',
  fontWeight: '600' as const,
  margin: '0 0 8px',
}

const footerText = {
  color: '#6B7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 24px',
}
