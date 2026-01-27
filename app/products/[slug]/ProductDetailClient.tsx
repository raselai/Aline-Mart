'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import { ProductCard } from '@/components/products'
import {
  Heart,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Truck,
  RotateCcw,
  Shield,
  Check,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  salePrice?: number
  weight?: string | null
  dimensions?: string | null
  shippingFee?: string | null
  warranty?: string | null
  vendor?: string | null
  status?: 'DRAFT' | 'ACTIVE' | null
  costPrice?: number | null
  discountType?: 'percent' | 'flat' | null
  discountValue?: number | null
  inStock: boolean
  featured: boolean
  isNew: boolean
  brandId: string
  categoryId: string
  createdAt: string
  brand: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    id: string
    url: string
    alt: string | null
    order: number
  }>
  variants: Array<{
    id: string
    color: string | null
    size: string | null
    sku: string
    stock: number
  }>
}

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

export default function ProductDetailClient({
  product,
  relatedProducts,
}: ProductDetailClientProps) {
  const { addItem, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  // State
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedSize, setSelectedSize] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [expandedSections, setExpandedSections] = useState({
    shipping: true,
    returns: false,
    details: false,
  })
  const [showStickyBar, setShowStickyBar] = useState(false)

  // Refs for swipe gesture
  const touchStartX = useRef(0)
  const touchEndX = useRef(0)
  const imageContainerRef = useRef<HTMLDivElement>(null)

  // Sticky bar visibility based on scroll
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar when user scrolls past the add to cart button
      const scrollPosition = window.scrollY
      const threshold = 600 // Adjust based on your layout
      setShowStickyBar(scrollPosition > threshold)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Get unique colors and sizes from variants
  const availableColors = Array.from(
    new Set(product.variants.map((v) => v.color).filter(Boolean))
  ) as string[]
  const availableSizes = Array.from(
    new Set(product.variants.map((v) => v.size).filter(Boolean))
  ) as string[]

  // Check if product has variants
  const hasVariants = product.variants && product.variants.length > 0

  // Get selected variant or first available variant
  const selectedVariant = hasVariants
    ? product.variants.find(
        (v) =>
          (selectedColor ? v.color === selectedColor : true) &&
          (selectedSize ? v.size === selectedSize : true)
      ) || product.variants[0]
    : null

  // Calculate stock - products without variants are treated as having 1 stock if inStock is true
  const maxStock = hasVariants ? (selectedVariant?.stock || 0) : (product.inStock ? 1 : 0)
  const isProductInStock = product.inStock && maxStock > 0

  // Calculate price
  const displayPrice = product.salePrice || product.price
  const hasDiscount = Boolean(product.salePrice)
  const discountPercentage = hasDiscount
    ? Math.round(((product.price - displayPrice) / product.price) * 100)
    : 0
  const discountLabel = product.discountValue
    ? product.discountType === 'flat'
      ? `$${product.discountValue.toFixed(2)} off`
      : `${product.discountValue}% off`
    : null

  // Handlers
  const handleAddToCart = () => {
    if (!isProductInStock) {
      console.log('Cannot add to cart: Product out of stock')
      return
    }

    // For products without variants, use product.id as the variant identifier
    const cartItemId = selectedVariant?.id || `${product.id}-default`

    console.log('Adding to cart:', {
      productId: product.id,
      variantId: cartItemId,
      quantity,
      maxStock,
    })

    addItem({
      id: cartItemId,
      productId: product.id,
      variantId: cartItemId,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: product.images[0]?.url || '',
      color: selectedColor || undefined,
      size: selectedSize || undefined,
      sku: selectedVariant?.sku || `${product.slug}-default`,
      stock: maxStock,
    })

    console.log('Item added to cart successfully!')
  }

  const handleToggleWishlist = () => {
    toggleWishlist({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      price: displayPrice,
      image: product.images[0]?.url || '',
      inStock: isProductInStock,
    })
  }

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity)
    }
  }

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe && selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }

    if (isRightSwipe && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }

    // Reset
    touchStartX.current = 0
    touchEndX.current = 0
  }

  // Image navigation functions
  const goToPrevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1)
    }
  }

  const goToNextImage = () => {
    if (selectedImageIndex < product.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1)
    }
  }

  const isInWishlistState = isInWishlist(product.id)
  const cartItemId = selectedVariant?.id || `${product.id}-default`
  const isInCartState = isInCart(cartItemId)

  return (
    <div className="min-h-screen bg-white">
      {/* Main Product Section */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Gallery (60%) */}
          <div className="lg:col-span-1">
            {/* Main Image with Swipe Support */}
            <div
              ref={imageContainerRef}
              className="relative aspect-[3/4] bg-light-gray rounded-lg overflow-hidden mb-4 group"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {product.images[selectedImageIndex] ? (
                <Image
                  src={product.images[selectedImageIndex].url}
                  alt={product.images[selectedImageIndex].alt || product.name}
                  width={800}
                  height={1067}
                  className="w-full h-full object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-light-gray">
                  <span className="text-secondary">No image available</span>
                </div>
              )}

              {/* Navigation Arrows (appear on hover for desktop, visible on mobile) */}
              {product.images.length > 1 && (
                <>
                  {/* Previous Button */}
                  {selectedImageIndex > 0 && (
                    <button
                      onClick={goToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal rounded-full p-2 lg:p-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  )}

                  {/* Next Button */}
                  {selectedImageIndex < product.images.length - 1 && (
                    <button
                      onClick={goToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-charcoal rounded-full p-2 lg:p-3 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity shadow-lg z-10"
                      aria-label="Next image"
                    >
                      <ChevronRight className="w-5 h-5 lg:w-6 lg:h-6" />
                    </button>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs px-3 py-1.5 rounded-full">
                    {selectedImageIndex + 1} / {product.images.length}
                  </div>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setSelectedImageIndex(index)}
                    className={cn(
                      'aspect-square bg-light-gray rounded-md overflow-hidden border-2 transition-all',
                      selectedImageIndex === index
                        ? 'border-burgundy'
                        : 'border-transparent hover:border-gray-300'
                    )}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || product.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info (40%) */}
          <div className="lg:col-span-1">
            {/* Brand */}
            <Link
              href={`/products?brand=${product.brand.slug}`}
              className="text-sm text-charcoal hover:text-burgundy transition-colors uppercase tracking-wide font-medium"
            >
              {product.brand.name}
            </Link>

            {/* Product Name */}
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-charcoal mt-2 mb-4">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold text-charcoal">
                ${displayPrice.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xl text-secondary line-through">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="text-sm font-semibold text-white bg-burgundy px-2 py-1 rounded">
                    -{discountPercentage}%
                  </span>
                </>
              )}
            </div>

            {(product.costPrice || discountLabel) && (
              <div className="mb-6 text-sm text-charcoal/70 space-y-1">
                {product.costPrice && (
                  <p>Cost Price: ${product.costPrice.toFixed(2)}</p>
                )}
                {discountLabel && (
                  <p>Discount: {discountLabel}</p>
                )}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <p className="text-charcoal leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            {/* Color Selector */}
            {availableColors.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-semibold text-charcoal mb-3">
                  Color: {selectedColor || 'Select a color'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {availableColors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={cn(
                        'px-4 py-2 border-2 rounded-md text-sm font-medium transition-all',
                        selectedColor === color
                          ? 'border-burgundy bg-burgundy text-white'
                          : 'border-gray-200 text-charcoal hover:border-burgundy'
                      )}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-semibold text-charcoal">
                    Size: {selectedSize || 'Select a size'}
                  </label>
                  <button className="text-sm text-burgundy hover:underline">
                    Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'px-4 py-2 border-2 rounded-md text-sm font-medium transition-all min-w-[60px]',
                        selectedSize === size
                          ? 'border-burgundy bg-burgundy text-white'
                          : 'border-gray-200 text-charcoal hover:border-burgundy'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-charcoal mb-3">
                Quantity
              </label>
              <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-gray-200 rounded-md">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-3 hover:bg-light-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-6 py-2 font-semibold text-charcoal min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= maxStock}
                    className="p-3 hover:bg-light-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Stock Status */}
                <div className="text-sm">
                  {isProductInStock ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <Check className="w-4 h-4" />
                      In Stock ({maxStock} available)
                    </span>
                  ) : (
                    <span className="text-red-600 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="flex gap-3 mb-8">
              <Button
                onClick={handleAddToCart}
                disabled={!isProductInStock}
                className="flex-1 gradient-primary text-white py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInCartState ? 'Added to Cart' : 'Add to Cart'}
              </Button>

              {/* Wishlist Button */}
              <Button
                onClick={handleToggleWishlist}
                variant="outline"
                className={cn(
                  'px-6 py-6 border-2 transition-colors',
                  isInWishlistState
                    ? 'border-burgundy bg-burgundy text-white'
                    : 'border-gray-300 hover:border-burgundy hover:bg-light-gray'
                )}
              >
                <Heart
                  className={cn(
                    'w-5 h-5 text-charcoal',
                    isInWishlistState && 'fill-current text-white'
                  )}
                />
              </Button>
            </div>

            {/* Expandable Sections */}
            <div className="border-t border-gray-200">
              {/* Shipping */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('shipping')}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-light-gray transition-colors px-4"
                >
                  <div className="flex items-center gap-3">
                    <Truck className="w-5 h-5 text-burgundy" />
                    <span className="font-semibold text-charcoal">
                      Shipping & Delivery
                    </span>
                  </div>
                  {expandedSections.shipping ? (
                    <ChevronUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary" />
                  )}
                </button>
                {expandedSections.shipping && (
                  <div className="px-4 pb-4 text-sm text-charcoal space-y-2">
                    <p>• Free standard shipping on orders over $100</p>
                    <p>• Express shipping available (2-3 business days)</p>
                    <p>• International shipping available to select countries</p>
                    <p>• Delivery time: 5-7 business days (standard)</p>
                  </div>
                )}
              </div>

              {/* Returns */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('returns')}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-light-gray transition-colors px-4"
                >
                  <div className="flex items-center gap-3">
                    <RotateCcw className="w-5 h-5 text-burgundy" />
                    <span className="font-semibold text-charcoal">
                      Returns & Exchanges
                    </span>
                  </div>
                  {expandedSections.returns ? (
                    <ChevronUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary" />
                  )}
                </button>
                {expandedSections.returns && (
                  <div className="px-4 pb-4 text-sm text-charcoal space-y-2">
                    <p>• 30-day return policy for unworn items</p>
                    <p>• Free returns with prepaid shipping label</p>
                    <p>• Exchanges available for different sizes/colors</p>
                    <p>• Refunds processed within 5-7 business days</p>
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="border-b border-gray-200">
                <button
                  onClick={() => toggleSection('details')}
                  className="w-full flex items-center justify-between py-4 text-left hover:bg-light-gray transition-colors px-4"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-burgundy" />
                    <span className="font-semibold text-charcoal">
                      Product Details
                    </span>
                  </div>
                  {expandedSections.details ? (
                    <ChevronUp className="w-5 h-5 text-secondary" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-secondary" />
                  )}
                </button>
                {expandedSections.details && (
                  <div className="px-4 pb-4 text-sm text-charcoal space-y-2">
                    <p>• SKU: {selectedVariant?.sku || 'N/A'}</p>
                    <p>• Category: {product.category.name}</p>
                    <p>• Brand: {product.brand.name}</p>
                    <p>• Weight: {product.weight || 'N/A'}</p>
                    <p>• Dimensions: {product.dimensions || 'N/A'}</p>
                    <p>• Shipping Fee: {product.shippingFee || 'N/A'}</p>
                    <p>• Warranty: {product.warranty || 'N/A'}</p>
                    <p>• Vendor: {product.vendor || 'N/A'}</p>
                    <p>• Authentic luxury product with certificate</p>
                    <p>• Premium quality materials and craftsmanship</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-gray-200 bg-light-gray py-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-3xl font-bold text-charcoal mb-8">
              You May Also Like
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={{
                    ...relatedProduct,
                    images: relatedProduct.images.map(img => ({
                      url: img.url,
                      alt: img.alt || undefined
                    })),
                    variants: relatedProduct.variants.map(v => ({
                      id: v.id,
                      color: v.color || undefined,
                      size: v.size || undefined,
                      sku: v.sku,
                      stock: v.stock
                    }))
                  }}
                  variant="medium"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sticky Add to Cart Bar (only visible on mobile when scrolled) */}
      <div
        className={cn(
          'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl lg:hidden transition-transform duration-300 z-50',
          showStickyBar ? 'translate-y-0' : 'translate-y-full'
        )}
      >
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Product Image */}
            <div className="w-16 h-16 flex-shrink-0 bg-light-gray rounded-md overflow-hidden">
              {product.images[0] && (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
              <p className="text-xs text-charcoal uppercase tracking-wide truncate font-medium">
                {product.brand.name}
              </p>
              <p className="font-semibold text-sm text-charcoal truncate">
                {product.name}
              </p>
              <p className="text-sm font-bold text-charcoal">
                ${displayPrice.toFixed(2)}
                {hasDiscount && (
                  <span className="text-xs text-gray-500 line-through ml-2">
                    ${product.price.toFixed(2)}
                  </span>
                )}
              </p>
            </div>

            {/* Add to Cart Button */}
            <Button
              onClick={handleAddToCart}
              disabled={!isProductInStock}
              className="gradient-primary text-white px-6 py-3 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              {isInCartState ? 'Added' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>

      {/* Bottom Padding for Mobile Sticky Bar */}
      <div className="h-20 lg:hidden" />
    </div>
  )
}
