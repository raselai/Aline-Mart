'use client'

import { useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export type SortOption =
  | 'featured'
  | 'price-asc'
  | 'price-desc'
  | 'newest'
  | 'name-asc'
  | 'name-desc'

interface SortOptionConfig {
  value: SortOption
  label: string
  description?: string
}

const sortOptions: SortOptionConfig[] = [
  {
    value: 'featured',
    label: 'Featured',
    description: 'Recommended for you'
  },
  {
    value: 'newest',
    label: 'Newest Arrivals',
    description: 'Latest products first'
  },
  {
    value: 'price-asc',
    label: 'Price: Low to High',
    description: 'Lowest price first'
  },
  {
    value: 'price-desc',
    label: 'Price: High to Low',
    description: 'Highest price first'
  },
  {
    value: 'name-asc',
    label: 'Name: A-Z',
    description: 'Alphabetical order'
  },
  {
    value: 'name-desc',
    label: 'Name: Z-A',
    description: 'Reverse alphabetical'
  }
]

interface ProductSorterProps {
  value: SortOption
  onChange: (value: SortOption) => void
  resultCount?: number
}

export default function ProductSorter({
  value,
  onChange,
  resultCount
}: ProductSorterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]

  const handleSelect = (option: SortOption) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      {/* Result Count */}
      {resultCount !== undefined && (
        <p className="text-sm text-text-secondary">
          <span className="font-semibold text-charcoal">{resultCount.toLocaleString()}</span>
          {' '}
          {resultCount === 1 ? 'product' : 'products'}
        </p>
      )}

      {/* Sort Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-md hover:border-burgundy transition-colors bg-white text-sm font-medium text-charcoal min-w-[200px] justify-between"
        >
          <span className="flex items-center gap-2">
            <span className="text-text-secondary text-xs">Sort by:</span>
            {selectedOption.label}
          </span>
          <ChevronDown
            className={cn(
              'w-4 h-4 text-text-secondary transition-transform',
              isOpen && 'rotate-180'
            )}
          />
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={cn(
                    'w-full px-4 py-3 text-left hover:bg-light-gray transition-colors flex items-start gap-3',
                    value === option.value && 'bg-burgundy/5'
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'text-sm font-medium',
                          value === option.value ? 'text-burgundy' : 'text-charcoal'
                        )}
                      >
                        {option.label}
                      </span>
                    </div>
                    {option.description && (
                      <p className="text-xs text-text-secondary mt-0.5">
                        {option.description}
                      </p>
                    )}
                  </div>
                  {value === option.value && (
                    <Check className="w-4 h-4 text-burgundy flex-shrink-0 mt-0.5" />
                  )}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
