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
  // Use a gray SVG placeholder if no image is available
  const placeholderImage = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="500"%3E%3Crect width="400" height="500" fill="%23f5f5f5"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="20" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
  const primaryImage = product.images[0]?.url || placeholderImage
  const secondaryImage = product.images[1]?.url || primaryImage

  // Get default variant (first one with stock, or first one)
  const defaultVariant = product.variants?.find(v => v.stock > 0) || product.variants?.[0]

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0

  // Determine price to display — prefer salePrice when available
  const displayPrice = product.salePrice
    ? product.salePrice
    : defaultVariant?.price || product.price

  const originalPrice = product.price

  // Handle add to cart
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // For products without variants, use product.id as the variant identifier
    const cartItemId = defaultVariant?.id || `${product.id}-default`
    const itemStock = hasVariants ? (defaultVariant?.stock || 0) : 1 // Treat no-variant products as having 1 stock

    addItem({
      id: cartItemId,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: primaryImage,
      variantId: cartItemId,
      color: defaultVariant?.color,
      size: defaultVariant?.size,
      sku: defaultVariant?.sku || `${product.slug}-default`,
      stock: itemStock
    })
  }

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Products without variants are considered in stock if they have no variant requirement
    const isInStock = hasVariants ? (defaultVariant?.stock || 0) > 0 : true

    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: primaryImage,
      inStock: isInStock
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
    small: 'aspect-[4/5]',
    medium: 'aspect-[4/5]',
    large: 'aspect-[4/5]'
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
              disabled={hasVariants && (!defaultVariant || defaultVariant.stock === 0)}
            >
              <ShoppingCart className="w-4 h-4" />
              {hasVariants && defaultVariant?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
