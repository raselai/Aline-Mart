'use client'

import { useState } from 'react'
import ProductCard from './ProductCard'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

interface Product {
  id: string
  slug: string
  name: string
  price: number
  images: Array<{ url: string; alt?: string }>
  brand: {
    name: string
    slug: string
  }
  category?: {
    name: string
  }
  variants?: Array<{
    id: string
    color?: string
    size?: string
    sku: string
    stock: number
    price?: number
  }>
  isNew?: boolean
  isOnSale?: boolean
  salePrice?: number
}

interface ProductGridProps {
  products: Product[]
  loading?: boolean
  hasMore?: boolean
  onLoadMore?: () => void
  onQuickView?: (productId: string) => void
}

export default function ProductGrid({
  products,
  loading = false,
  hasMore = false,
  onLoadMore,
  onQuickView
}: ProductGridProps) {
  const [loadingMore, setLoadingMore] = useState(false)

  // Handle load more
  const handleLoadMore = async () => {
    if (loadingMore || !onLoadMore) return

    setLoadingMore(true)
    try {
      await onLoadMore()
    } finally {
      setLoadingMore(false)
    }
  }

  // Create magazine-style pattern (repeating pattern for variety)
  // Pattern: medium, large, small, medium, small, large (repeats)
  const variantPattern: Array<'small' | 'medium' | 'large'> = [
    'medium',
    'large',
    'small',
    'medium',
    'small',
    'large'
  ]

  const getVariant = (index: number): 'small' | 'medium' | 'large' => {
    return variantPattern[index % variantPattern.length]
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="w-24 h-24 mb-6 rounded-full bg-light-gray flex items-center justify-center">
          <svg
            className="w-12 h-12 text-text-secondary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            />
          </svg>
        </div>
        <h3 className="font-serif text-2xl font-bold text-charcoal mb-2">
          No Products Found
        </h3>
        <p className="text-text-secondary max-w-md">
          We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
        </p>
      </div>
    )
  }

  // Loading skeleton
  if (loading && products.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-light-gray rounded-lg animate-pulse"
            style={{ height: i % 2 === 0 ? '420px' : '520px' }}
          >
            <div className="h-3/4 bg-gray-200" />
            <div className="p-4 space-y-3">
              <div className="h-3 bg-gray-200 rounded w-1/4" />
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Product Grid - Magazine/Editorial Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-auto">
        {products.map((product, index) => (
          <ProductCard
            key={product.id}
            product={product}
            variant={getVariant(index)}
            onQuickView={onQuickView}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-8">
          <Button
            onClick={handleLoadMore}
            disabled={loadingMore}
            size="lg"
            variant="outline"
            className="min-w-[200px]"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Products'
            )}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={`loading-${i}`}
              className="bg-light-gray rounded-lg animate-pulse h-[420px]"
            >
              <div className="h-3/4 bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
