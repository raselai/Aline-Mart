'use client'

export default function CartBreadcrumb() {
  return (
    <div style={{ borderBottom: '1px solid #E8E6E3' }}>
      <div
        style={{
          maxWidth: '1400px',
          minWidth: '320px',
          margin: '0 auto',
          padding: '16px 24px',
        }}
      >
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            whiteSpace: 'normal',
            wordBreak: 'normal',
          }}
        >
          <a
            href="/"
            style={{
              color: '#6B7280',
              textDecoration: 'none',
              transition: 'color 200ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#2C2C2C')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#6B7280')}
          >
            Home
          </a>
          <span style={{ color: '#D1D5DB' }}>/</span>
          <span style={{ color: '#2C2C2C', fontWeight: 500 }}>Shopping Cart</span>
        </nav>
      </div>
    </div>
  )
}
