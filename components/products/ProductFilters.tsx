'use client'

import { useState } from 'react'
import { X, Search, ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface FilterOptions {
  categories?: Array<{ id: string; name: string; count?: number }>
  brands?: Array<{ id: string; name: string; count?: number }>
  priceRange?: { min: number; max: number }
  colors?: string[]
  sizes?: string[]
}

export interface ActiveFilters {
  categories: string[]
  brands: string[]
  priceRange: { min: number; max: number }
  colors: string[]
  sizes: string[]
}

interface ProductFiltersProps {
  options: FilterOptions
  activeFilters: ActiveFilters
  onFilterChange: (filters: ActiveFilters) => void
  onClearAll?: () => void
}

export default function ProductFilters({
  options,
  activeFilters,
  onFilterChange,
  onClearAll
}: ProductFiltersProps) {
  const [brandSearch, setBrandSearch] = useState('')
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    brands: true,
    price: true,
    colors: true,
    sizes: true
  })

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  // Handle category toggle
  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(id => id !== categoryId)
      : [...activeFilters.categories, categoryId]

    onFilterChange({
      ...activeFilters,
      categories: newCategories
    })
  }

  // Handle brand toggle
  const handleBrandToggle = (brandId: string) => {
    const newBrands = activeFilters.brands.includes(brandId)
      ? activeFilters.brands.filter(id => id !== brandId)
      : [...activeFilters.brands, brandId]

    onFilterChange({
      ...activeFilters,
      brands: newBrands
    })
  }

  // Handle color toggle
  const handleColorToggle = (color: string) => {
    const newColors = activeFilters.colors.includes(color)
      ? activeFilters.colors.filter(c => c !== color)
      : [...activeFilters.colors, color]

    onFilterChange({
      ...activeFilters,
      colors: newColors
    })
  }

  // Handle size toggle
  const handleSizeToggle = (size: string) => {
    const newSizes = activeFilters.sizes.includes(size)
      ? activeFilters.sizes.filter(s => s !== size)
      : [...activeFilters.sizes, size]

    onFilterChange({
      ...activeFilters,
      sizes: newSizes
    })
  }

  // Handle price range change
  const handlePriceChange = (type: 'min' | 'max', value: number) => {
    onFilterChange({
      ...activeFilters,
      priceRange: {
        ...activeFilters.priceRange,
        [type]: value
      }
    })
  }

  // Filter brands by search
  const filteredBrands = options.brands?.filter(brand =>
    brand.name.toLowerCase().includes(brandSearch.toLowerCase())
  )

  // Count active filters
  const activeFilterCount =
    activeFilters.categories.length +
    activeFilters.brands.length +
    activeFilters.colors.length +
    activeFilters.sizes.length

  // Color mapping for display
  const colorClasses: Record<string, string> = {
    Black: 'bg-black',
    White: 'bg-white border-2 border-gray-300',
    Red: 'bg-red-600',
    Blue: 'bg-blue-600',
    Green: 'bg-green-600',
    Yellow: 'bg-yellow-400',
    Pink: 'bg-pink-500',
    Purple: 'bg-purple-600',
    Gray: 'bg-gray-500',
    Brown: 'bg-amber-800',
    Navy: 'bg-blue-900',
    Beige: 'bg-amber-100 border-2 border-gray-300'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-200">
        <h2 className="font-serif text-xl font-bold text-charcoal">Filters</h2>
        {activeFilterCount > 0 && (
          <Button
            onClick={onClearAll}
            variant="ghost"
            size="sm"
            className="text-text-secondary hover:text-burgundy"
          >
            Clear All ({activeFilterCount})
          </Button>
        )}
      </div>

      {/* Categories */}
      {options.categories && options.categories.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-charcoal">Categories</h3>
            {expandedSections.categories ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {expandedSections.categories && (
            <div className="space-y-2 pl-1">
              {options.categories.map(category => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={activeFilters.categories.includes(category.id)}
                    onChange={() => handleCategoryToggle(category.id)}
                    className="w-4 h-4 rounded border-gray-300 text-burgundy focus:ring-burgundy cursor-pointer"
                  />
                  <span className="text-sm text-charcoal group-hover:text-burgundy transition-colors">
                    {category.name}
                    {category.count !== undefined && (
                      <span className="text-text-secondary ml-1">({category.count})</span>
                    )}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Brands */}
      {options.brands && options.brands.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-charcoal">Brands</h3>
            {expandedSections.brands ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {expandedSections.brands && (
            <div className="space-y-3">
              {/* Brand Search */}
              {options.brands.length > 5 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                  <input
                    type="text"
                    placeholder="Search brands..."
                    value={brandSearch}
                    onChange={(e) => setBrandSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy"
                  />
                </div>
              )}

              {/* Brand List */}
              <div className="space-y-2 pl-1 max-h-[240px] overflow-y-auto">
                {filteredBrands?.map(brand => (
                  <label
                    key={brand.id}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={activeFilters.brands.includes(brand.id)}
                      onChange={() => handleBrandToggle(brand.id)}
                      className="w-4 h-4 rounded border-gray-300 text-burgundy focus:ring-burgundy cursor-pointer"
                    />
                    <span className="text-sm text-charcoal group-hover:text-burgundy transition-colors">
                      {brand.name}
                      {brand.count !== undefined && (
                        <span className="text-text-secondary ml-1">({brand.count})</span>
                      )}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Price Range */}
      {options.priceRange && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-charcoal">Price Range</h3>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {expandedSections.price && (
            <div className="space-y-4 pl-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Min</label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.min}
                    onChange={(e) => handlePriceChange('min', Number(e.target.value))}
                    min={options.priceRange.min}
                    max={activeFilters.priceRange.max}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy"
                  />
                </div>
                <div>
                  <label className="text-xs text-text-secondary mb-1 block">Max</label>
                  <input
                    type="number"
                    value={activeFilters.priceRange.max}
                    onChange={(e) => handlePriceChange('max', Number(e.target.value))}
                    min={activeFilters.priceRange.min}
                    max={options.priceRange.max}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-burgundy/20 focus:border-burgundy"
                  />
                </div>
              </div>
              <div className="text-xs text-text-secondary">
                ${activeFilters.priceRange.min.toLocaleString()} - ${activeFilters.priceRange.max.toLocaleString()}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Colors */}
      {options.colors && options.colors.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('colors')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-charcoal">Colors</h3>
            {expandedSections.colors ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {expandedSections.colors && (
            <div className="flex flex-wrap gap-2 pl-1">
              {options.colors.map(color => (
                <button
                  key={color}
                  onClick={() => handleColorToggle(color)}
                  className={cn(
                    'w-10 h-10 rounded-full transition-all',
                    colorClasses[color] || 'bg-gray-300',
                    activeFilters.colors.includes(color)
                      ? 'ring-2 ring-burgundy ring-offset-2'
                      : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                  )}
                  title={color}
                  aria-label={color}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sizes */}
      {options.sizes && options.sizes.length > 0 && (
        <div className="space-y-3">
          <button
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full text-left"
          >
            <h3 className="font-semibold text-charcoal">Sizes</h3>
            {expandedSections.sizes ? (
              <ChevronUp className="w-4 h-4 text-text-secondary" />
            ) : (
              <ChevronDown className="w-4 h-4 text-text-secondary" />
            )}
          </button>

          {expandedSections.sizes && (
            <div className="flex flex-wrap gap-2 pl-1">
              {options.sizes.map(size => (
                <button
                  key={size}
                  onClick={() => handleSizeToggle(size)}
                  className={cn(
                    'px-4 py-2 border rounded-md text-sm font-medium transition-all',
                    activeFilters.sizes.includes(size)
                      ? 'border-burgundy bg-burgundy text-white'
                      : 'border-gray-200 text-charcoal hover:border-burgundy hover:text-burgundy'
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            {activeFilters.categories.map(categoryId => {
              const category = options.categories?.find(c => c.id === categoryId)
              return category ? (
                <button
                  key={categoryId}
                  onClick={() => handleCategoryToggle(categoryId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/10 text-burgundy rounded-full text-xs font-medium hover:bg-burgundy/20 transition-colors"
                >
                  {category.name}
                  <X className="w-3 h-3" />
                </button>
              ) : null
            })}

            {activeFilters.brands.map(brandId => {
              const brand = options.brands?.find(b => b.id === brandId)
              return brand ? (
                <button
                  key={brandId}
                  onClick={() => handleBrandToggle(brandId)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/10 text-burgundy rounded-full text-xs font-medium hover:bg-burgundy/20 transition-colors"
                >
                  {brand.name}
                  <X className="w-3 h-3" />
                </button>
              ) : null
            })}

            {activeFilters.colors.map(color => (
              <button
                key={color}
                onClick={() => handleColorToggle(color)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/10 text-burgundy rounded-full text-xs font-medium hover:bg-burgundy/20 transition-colors"
              >
                {color}
                <X className="w-3 h-3" />
              </button>
            ))}

            {activeFilters.sizes.map(size => (
              <button
                key={size}
                onClick={() => handleSizeToggle(size)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-burgundy/10 text-burgundy rounded-full text-xs font-medium hover:bg-burgundy/20 transition-colors"
              >
                Size {size}
                <X className="w-3 h-3" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
