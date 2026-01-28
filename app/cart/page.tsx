import { Metadata } from 'next'
import CartClient from './CartClient'
import CartBreadcrumb from './CartBreadcrumb'

export const metadata: Metadata = {
  title: 'Shopping Cart | Aline Mart',
  description: 'Review your curated luxury items and proceed to checkout at Aline Mart.',
  openGraph: {
    title: 'Shopping Cart | Aline Mart',
    description: 'Review your curated luxury items and proceed to checkout.',
    type: 'website',
  },
}

export default function CartPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FAFAF8',
      }}
    >
      {/* Thin accent bar */}
      <div
        style={{
          height: '3px',
          background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
        }}
      />

      {/* Breadcrumb */}
      <CartBreadcrumb />

      {/* Page Header */}
      <div
        style={{
          borderBottom: '1px solid #E8E6E3',
          backgroundColor: '#FFFFFF',
        }}
      >
        <div
          style={{
            maxWidth: '1400px',
            minWidth: '320px',
            margin: '0 auto',
            padding: '40px 24px',
          }}
        >
          <h1
            className="font-serif"
            style={{
              fontSize: 'clamp(28px, 4vw, 42px)',
              fontWeight: 400,
              color: '#2C2C2C',
              letterSpacing: '-0.5px',
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Your Cart
          </h1>
          <div
            style={{
              width: '48px',
              height: '2px',
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              marginTop: '16px',
            }}
          />
        </div>
      </div>

      {/* Cart Content */}
      <CartClient />
    </div>
  )
}
