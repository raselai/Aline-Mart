import { Metadata } from 'next'
import CartClient from './CartClient'

export const metadata: Metadata = {
  title: 'Shopping Cart | Aline Mart',
  description: 'Review your luxury items and proceed to checkout. Free shipping on orders over $100.',
  openGraph: {
    title: 'Shopping Cart | Aline Mart',
    description: 'Review your luxury items and proceed to checkout.',
    type: 'website',
  },
}

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-secondary">
            <a href="/" className="hover:text-charcoal transition-colors">
              Home
            </a>
            <span>/</span>
            <span className="text-charcoal font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      {/* Page Header */}
      <div className="border-b border-gray-200 bg-light-gray">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal">
            Shopping Cart
          </h1>
        </div>
      </div>

      {/* Cart Content */}
      <CartClient />
    </div>
  )
}
