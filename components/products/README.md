# Product Components

This directory contains all product-related UI components for the Aline Mart eCommerce platform.

## Components

### 1. ProductCard

A magazine-style product card with hover effects and quick actions.

**Features:**
- Variable heights (small/medium/large) for editorial layout
- Image hover effect with zoom + secondary image swap
- Quick action buttons (wishlist heart, quick view eye)
- Add to Cart button (appears on hover)
- "New" and "Sale" badges with gradients
- Price display with sale price formatting
- Stock status handling

**Usage:**
```tsx
import { ProductCard } from '@/components/products'

<ProductCard
  product={{
    id: "1",
    slug: "rolex-submariner",
    name: "Submariner Date",
    price: 12500,
    images: [
      { url: "/image1.jpg", alt: "Product image" },
      { url: "/image2.jpg", alt: "Product hover image" }
    ],
    brand: { name: "Rolex", slug: "rolex" },
    category: { name: "Watches" },
    variants: [
      {
        id: "v1",
        color: "Black",
        size: "40mm",
        sku: "ROLEX-SUB-BLK",
        stock: 5,
        price: 12500
      }
    ],
    isNew: true,
    isOnSale: false
  }}
  variant="medium"
  onQuickView={(id) => console.log('Quick view:', id)}
/>
```

**Props:**
- `product` (required) - Product data object
- `variant` - Card size: 'small' | 'medium' | 'large' (default: 'medium')
- `onQuickView` - Optional callback for quick view button

**Integration:**
- Uses `useCart` hook for add to cart functionality
- Uses `useWishlist` hook for wishlist toggle
- Automatically handles stock validation
- Links to `/products/[slug]` for product detail page

---

### 2. ProductGrid

A responsive grid layout with magazine-style variable heights.

**Features:**
- Responsive columns: 3 desktop, 2 tablet, 1 mobile
- Variable height cards for editorial feel (NOT uniform grid)
- "Load More" button for pagination
- Loading skeletons
- Empty state with icon and message
- Infinite scroll ready

**Usage:**
```tsx
import { ProductGrid } from '@/components/products'

<ProductGrid
  products={products}
  loading={false}
  hasMore={true}
  onLoadMore={async () => {
    // Fetch more products
  }}
  onQuickView={(id) => setQuickViewId(id)}
/>
```

**Props:**
- `products` (required) - Array of product objects
- `loading` - Show loading skeletons (default: false)
- `hasMore` - Show "Load More" button (default: false)
- `onLoadMore` - Callback for loading more products
- `onQuickView` - Optional quick view handler

**Layout Pattern:**
The grid uses a repeating pattern for variety:
- Medium → Large → Small → Medium → Small → Large (repeats)

This creates visual interest while maintaining order.

---

### 3. ProductFilters

A comprehensive filtering sidebar with collapsible sections.

**Features:**
- Category checkboxes with product counts
- Brand checkboxes with search (for 5+ brands)
- Price range min/max inputs
- Color swatches (visual color picker)
- Size buttons (chip-style selection)
- Active filter chips (removable)
- "Clear All" button
- Collapsible sections with chevrons
- Responsive: overlay on mobile, sidebar on desktop

**Usage:**
```tsx
import { ProductFilters, FilterOptions, ActiveFilters } from '@/components/products'

const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
  categories: [],
  brands: [],
  priceRange: { min: 0, max: 50000 },
  colors: [],
  sizes: []
})

const filterOptions: FilterOptions = {
  categories: [
    { id: '1', name: 'Men', count: 12 },
    { id: '2', name: 'Women', count: 15 }
  ],
  brands: [
    { id: '1', name: 'Rolex', count: 5 },
    { id: '2', name: 'Gucci', count: 8 }
  ],
  priceRange: { min: 0, max: 50000 },
  colors: ['Black', 'White', 'Red', 'Blue'],
  sizes: ['S', 'M', 'L', 'XL']
}

<ProductFilters
  options={filterOptions}
  activeFilters={activeFilters}
  onFilterChange={setActiveFilters}
  onClearAll={() => {
    setActiveFilters({
      categories: [],
      brands: [],
      priceRange: { min: 0, max: 50000 },
      colors: [],
      sizes: []
    })
  }}
/>
```

**Props:**
- `options` (required) - Available filter options
- `activeFilters` (required) - Currently selected filters
- `onFilterChange` (required) - Callback when filters change
- `onClearAll` - Optional callback for clear all button

**Color Mapping:**
Built-in support for these colors:
- Black, White, Red, Blue, Green, Yellow, Pink, Purple, Gray, Brown, Navy, Beige

Custom colors will show as gray by default.

---

### 4. ProductSorter

A dropdown sorter with result count display.

**Features:**
- 6 sort options with descriptions
- Result count display
- Check mark on selected option
- Hover states and transitions
- Click-outside-to-close behavior

**Usage:**
```tsx
import { ProductSorter, SortOption } from '@/components/products'

const [sortBy, setSortBy] = useState<SortOption>('featured')

<ProductSorter
  value={sortBy}
  onChange={setSortBy}
  resultCount={42}
/>
```

**Props:**
- `value` (required) - Current sort option
- `onChange` (required) - Callback when sort changes
- `resultCount` - Optional product count to display

**Sort Options:**
- `featured` - Recommended products
- `newest` - Latest arrivals
- `price-asc` - Price: Low to High
- `price-desc` - Price: High to Low
- `name-asc` - Name: A-Z
- `name-desc` - Name: Z-A

**API Integration:**
Map sort options to API parameters:
```typescript
const sortMapping = {
  'featured': { sortBy: 'featured', sortOrder: 'desc' },
  'newest': { sortBy: 'createdAt', sortOrder: 'desc' },
  'price-asc': { sortBy: 'price', sortOrder: 'asc' },
  'price-desc': { sortBy: 'price', sortOrder: 'desc' },
  'name-asc': { sortBy: 'name', sortOrder: 'asc' },
  'name-desc': { sortBy: 'name', sortOrder: 'desc' }
}
```

---

## Complete Example: Product Listing Page

Here's how to use all components together:

```tsx
'use client'

import { useState, useEffect } from 'react'
import {
  ProductGrid,
  ProductFilters,
  ProductSorter,
  FilterOptions,
  ActiveFilters,
  SortOption
} from '@/components/products'

export default function ProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalCount, setTotalCount] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>('featured')

  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
    colors: [],
    sizes: []
  })

  const [activeFilters, setActiveFilters] = useState<ActiveFilters>({
    categories: [],
    brands: [],
    priceRange: { min: 0, max: 50000 },
    colors: [],
    sizes: []
  })

  useEffect(() => {
    // Fetch filter options (one time on mount)
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    // Fetch products when filters or sort changes
    fetchProducts()
  }, [activeFilters, sortBy])

  const fetchProducts = async () => {
    setLoading(true)
    // Build API query with filters and sorting
    const params = new URLSearchParams()

    // Add filter params
    if (activeFilters.brands.length > 0) {
      params.append('brands', activeFilters.brands.join(','))
    }
    // ... add other filters

    // Add sort params
    const sortMap = {
      'price-asc': { sortBy: 'price', sortOrder: 'asc' },
      'price-desc': { sortBy: 'price', sortOrder: 'desc' },
      // ... other mappings
    }
    const sort = sortMap[sortBy]
    if (sort) {
      params.append('sortBy', sort.sortBy)
      params.append('sortOrder', sort.sortOrder)
    }

    const response = await fetch(`/api/products?${params}`)
    const data = await response.json()

    setProducts(data.products)
    setTotalCount(data.total)
    setLoading(false)
  }

  return (
    <div className="flex gap-8">
      {/* Sidebar */}
      <aside className="w-64">
        <ProductFilters
          options={filterOptions}
          activeFilters={activeFilters}
          onFilterChange={setActiveFilters}
          onClearAll={() => {
            setActiveFilters({
              categories: [],
              brands: [],
              priceRange: { min: 0, max: 50000 },
              colors: [],
              sizes: []
            })
          }}
        />
      </aside>

      {/* Main Content */}
      <main className="flex-1">
        <ProductSorter
          value={sortBy}
          onChange={setSortBy}
          resultCount={totalCount}
        />

        <ProductGrid
          products={products}
          loading={loading}
        />
      </main>
    </div>
  )
}
```

---

## Testing

Visit `/test-products` to see all components in action with real data from the API.

**Test features:**
1. Add products to cart (check header cart count)
2. Toggle wishlist (heart should fill/unfill)
3. Change sort options (products should re-order)
4. Apply filters (category, brand, price, color, size)
5. Clear filters (should reset everything)
6. Load more products (pagination)
7. Hover over cards (see zoom effect and buttons)
8. Responsive: resize window to test mobile layout

---

## Design Philosophy

These components follow Aline Mart's **editorial/magazine-style** design:

1. **NOT uniform grids** - Variable heights create visual interest
2. **Generous white space** - Luxury needs breathing room
3. **Subtle animations** - 200-400ms transitions, no bouncing
4. **Image-first** - Large, high-quality product photography
5. **Premium feel** - Burgundy/plum gradient, serif headings

---

## Accessibility

All components include:
- Proper ARIA labels
- Keyboard navigation support
- Focus states
- Screen reader text
- Semantic HTML
- Color contrast compliance (WCAG 2.1 AA)

---

## Performance

- Uses Next.js `<Image>` component for optimization
- Lazy loading for images below fold
- Skeleton screens instead of spinners
- Efficient re-renders with proper state management
- Debounced search inputs (for future implementation)

---

## Future Enhancements

Potential additions for Phase 2 completion:

1. **Quick View Modal** - Implement the `onQuickView` callback
2. **Infinite Scroll** - Alternative to "Load More" button
3. **Filter Persistence** - Save filters to URL params
4. **Filter Counts** - Update counts based on active filters
5. **Color Names on Hover** - Tooltip for color swatches
6. **Size Guide Link** - In size selector
7. **Compare Products** - Checkbox to compare items
8. **View Toggle** - Grid vs List view options

---

## Files

```
components/products/
├── ProductCard.tsx        (264 lines)
├── ProductGrid.tsx        (178 lines)
├── ProductFilters.tsx     (453 lines)
├── ProductSorter.tsx      (131 lines)
├── index.ts               (9 lines)
└── README.md              (this file)
```

**Total:** ~1,035 lines of code

---

**Phase 2.2 Complete!** ✅

Ready for Phase 2.3: Product Listing Page (PLP) implementation.
