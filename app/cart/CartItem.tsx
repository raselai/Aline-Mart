'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/hooks/useCart'
import { Button } from '@/components/ui/button'
import { Minus, Plus, X } from 'lucide-react'
import { CartItem as CartItemType } from '@/store/cartStore'

interface CartItemProps {
  item: CartItemType
}

export default function CartItem({ item }: CartItemProps) {
  const { increaseQuantity, decreaseQuantity, removeItem, formatPrice } = useCart()

  const handleIncrease = () => {
    increaseQuantity(item.variantId)
  }

  const handleDecrease = () => {
    if (item.quantity > 1) {
      decreaseQuantity(item.variantId)
    }
  }

  const handleRemove = () => {
    removeItem(item.variantId)
  }

  const itemTotal = item.price * item.quantity

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link
          href={`/products/${item.slug}`}
          className="flex-shrink-0"
        >
          <div className="w-24 h-24 sm:w-32 sm:h-32 bg-light-gray rounded-md overflow-hidden">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name || 'Product image'}
                width={128}
                height={128}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No image
              </div>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {/* Brand */}
              <p className="text-xs text-secondary uppercase tracking-wide mb-1">
                {item.brand}
              </p>

              {/* Product Name */}
              <Link href={`/products/${item.slug}`}>
                <h3 className="font-semibold text-charcoal hover:text-burgundy transition-colors line-clamp-2">
                  {item.name}
                </h3>
              </Link>

              {/* Variant Info */}
              {(item.color || item.size) && (
                <div className="mt-2 flex flex-wrap gap-2 text-sm text-secondary">
                  {item.color && (
                    <span>Color: {item.color}</span>
                  )}
                  {item.size && (
                    <span>Size: {item.size}</span>
                  )}
                </div>
              )}

              {/* Price (Mobile) */}
              <p className="mt-2 sm:hidden font-semibold text-charcoal">
                {formatPrice(item.price)}
              </p>
            </div>

            {/* Remove Button */}
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-2 hover:bg-red-50 rounded-full transition-colors group"
              aria-label="Remove item"
            >
              <X className="w-4 h-4 text-burgundy group-hover:text-red-600" />
            </button>
          </div>

          {/* Quantity and Price Row (Desktop) */}
          <div className="mt-4 flex items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-200 rounded-md">
              <button
                onClick={handleDecrease}
                disabled={item.quantity <= 1}
                className="p-2 hover:bg-light-gray disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Decrease quantity"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-2 font-semibold text-charcoal min-w-[50px] text-center">
                {item.quantity}
              </span>
              <button
                onClick={handleIncrease}
                className="p-2 hover:bg-light-gray transition-colors"
                aria-label="Increase quantity"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Price (Desktop) */}
            <div className="hidden sm:block text-right">
              <p className="text-sm text-secondary">
                {formatPrice(item.price)} each
              </p>
              <p className="font-bold text-lg text-charcoal">
                {formatPrice(itemTotal)}
              </p>
            </div>
          </div>

          {/* Total (Mobile) */}
          <div className="mt-3 sm:hidden text-right">
            <p className="text-sm text-secondary">Subtotal</p>
            <p className="font-bold text-lg text-charcoal">
              {formatPrice(itemTotal)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
