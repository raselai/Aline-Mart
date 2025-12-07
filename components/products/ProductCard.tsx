'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Heart, Eye, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { cn } from '@/lib/utils'

interface ProductCardProps {
  product: {
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
  variant?: 'small' | 'medium' | 'large' // For magazine-style variable heights
  onQuickView?: (productId: string) => void
}

export default function ProductCard({
  product,
  variant = 'medium',
  onQuickView
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageIndex, setImageIndex] = useState(0)

  const { addItem, formatPrice } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const inWishlist = isInWishlist(product.id)

  // Determine which images to show
  const primaryImage = product.images[0]?.url || '/placeholder.jpg'
  const secondaryImage = product.images[1]?.url || primaryImage

  // Get default variant (first one with stock, or first one)
  const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0]

  // Determine price to display
  const displayPrice = product.isOnSale && product.salePrice
    ? product.salePrice
    : defaultVariant?.price || product.price

  const originalPrice = product.price

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!defaultVariant) return

    addItem({
      id: defaultVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: primaryImage,
      variantId: defaultVariant.id,
      color: defaultVariant.color,
      size: defaultVariant.size,
      sku: defaultVariant.sku,
      stock: defaultVariant.stock
    })
  }

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: primaryImage,
      inStock: (defaultVariant?.stock || 0) > 0
    })
  }

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onQuickView?.(product.id)
  }

  // Variable height classes based on variant
  const heightClasses = {
    small: 'h-[320px]',
    medium: 'h-[420px]',
    large: 'h-[520px]'
  }

  return (
    <div
      className={cn(
        'group relative bg-white rounded-lg overflow-hidden transition-all duration-300',
        'hover:shadow-lg hover:-translate-y-1',
        'border border-gray-100'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.slug}`}>
        {/* Image Container */}
        <div className={cn('relative overflow-hidden bg-light-gray', heightClasses[variant])}>
          {/* Primary Image */}
          <Image
            src={isHovered && secondaryImage !== primaryImage ? secondaryImage : primaryImage}
            alt={product.name}
            fill
            className={cn(
              'object-cover transition-all duration-500',
              isHovered ? 'scale-110' : 'scale-100'
            )}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
            {product.isNew && (
              <span className="gradient-primary px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md">
                New
              </span>
            )}
            {product.isOnSale && (
              <span className="bg-red-600 px-3 py-1 text-xs font-semibold text-white rounded-full shadow-md">
                Sale
              </span>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div
            className={cn(
              'absolute top-3 right-3 flex flex-col gap-2 transition-all duration-300',
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
            )}
          >
            {/* Wishlist Button */}
            <button
              onClick={handleWishlistToggle}
              className={cn(
                'p-3 rounded-full transition-all duration-200 shadow-md backdrop-blur-sm min-w-[44px] min-h-[44px] flex items-center justify-center',
                inWishlist
                  ? 'bg-burgundy text-white'
                  : 'bg-white/90 text-charcoal hover:bg-burgundy hover:text-white'
              )}
              aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart
                className={cn('w-5 h-5', inWishlist && 'fill-current')}
              />
            </button>

            {/* Quick View Button */}
            {onQuickView && (
              <button
                onClick={handleQuickView}
                className="p-3 bg-white/90 backdrop-blur-sm text-charcoal rounded-full hover:bg-burgundy hover:text-white transition-all duration-200 shadow-md min-w-[44px] min-h-[44px] flex items-center justify-center"
                aria-label="Quick view"
              >
                <Eye className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Add to Cart - Shows on Hover (Bottom) */}
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 p-4 transition-all duration-300',
              isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
            )}
          >
            <Button
              onClick={handleAddToCart}
              className="w-full gradient-primary hover:gradient-hover text-white font-semibold shadow-lg"
              disabled={!defaultVariant || defaultVariant.stock === 0}
            >
              <ShoppingCart className="w-4 h-4" />
              {defaultVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          {/* Brand */}
          <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            {product.brand.name}
          </p>

          {/* Product Name */}
          <h3 className="font-serif text-base font-semibold text-charcoal line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Category (Optional) */}
          {product.category && (
            <p className="text-xs text-text-secondary">
              {product.category.name}
            </p>
          )}

          {/* Price */}
          <div className="flex items-center gap-2">
            {product.isOnSale && product.salePrice ? (
              <>
                <span className="font-semibold text-burgundy">
                  {formatPrice(displayPrice)}
                </span>
                <span className="text-sm text-text-secondary line-through">
                  {formatPrice(originalPrice)}
                </span>
              </>
            ) : (
              <span className="font-semibold text-charcoal">
                {formatPrice(displayPrice)}
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
