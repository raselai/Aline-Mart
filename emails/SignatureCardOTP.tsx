import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from '@react-email/components'

interface SignatureCardOTPProps {
  otpCode: string
  cardholderName: string
}

export default function SignatureCardOTP({
  otpCode,
  cardholderName,
}: SignatureCardOTPProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Aline Mart verification code: {otpCode}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verification Code</Heading>

          <Text style={text}>Hi {cardholderName},</Text>

          <Text style={text}>
            Your one-time verification code for Signature Card payment:
          </Text>

          <Text style={codeStyle}>{otpCode}</Text>

          <Text style={footerText}>
            This code is valid for 10 minutes. Do not share it with anyone.
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
  fontWeight: '700' as const,
  color: '#8e2157',
  textAlign: 'center' as const,
  padding: '17px 0 0',
}

const text = {
  color: '#2C2C2C',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 24px',
}

const codeStyle = {
  fontSize: '36px',
  fontWeight: '700' as const,
  color: '#8e2157',
  textAlign: 'center' as const,
  letterSpacing: '8px',
  padding: '16px 24px',
  margin: '16px 0',
}

const footerText = {
  color: '#6B7280',
  fontSize: '12px',
  lineHeight: '20px',
  padding: '0 24px',
  textAlign: 'center' as const,
}
