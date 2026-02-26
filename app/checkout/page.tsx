import { Suspense } from 'react'
import { Metadata } from 'next'
import CheckoutClient from './CheckoutClient'

export const metadata: Metadata = {
  title: 'Checkout | Aline Mart',
  description: 'Complete your purchase securely with PayStation or Cash on Delivery',
}

export default function CheckoutPage() {
  return (
    <Suspense>
      <CheckoutClient />
    </Suspense>
  )
}
