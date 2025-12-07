import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Package } from 'lucide-react'

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-light-gray rounded-full mb-6">
          <Package className="w-10 h-10 text-burgundy" />
        </div>

        {/* Title */}
        <h1 className="font-serif text-4xl font-bold text-charcoal mb-4">
          Product Not Found
        </h1>

        {/* Description */}
        <p className="text-secondary text-lg mb-8">
          Sorry, we couldn't find the product you're looking for. It may have been removed or is temporarily unavailable.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button className="gradient-primary text-white w-full sm:w-auto">
              Browse All Products
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto border-2">
              Return Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
