# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aline Mart** is a luxury multi-brand eCommerce marketplace with an editorial, magazine-style design inspired by Mr Porter. The design uses a distinctive Qatar Airways-inspired gradient (burgundy #8e2157 to plum #5c0931) and prioritizes visual sophistication over typical eCommerce layouts.

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Styling:** Tailwind CSS 4 with custom configuration (CSS-only config)
- **UI Components:** shadcn/ui (heavily customized)
- **State Management:** Zustand (cart & wishlist with localStorage persistence)
- **Database:** PostgreSQL via Supabase (Direct Supabase JS Client - NOT Prisma)
- **Authentication:** NextAuth.js v5 + Google OAuth (planned)
- **Payment:** Stripe (planned)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion + CSS transitions

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# TypeScript checking
npx tsc --noEmit --skipLibCheck

# Database utilities (Node.js scripts in scripts/)
node scripts/check-db.js              # Verify database connection and view data summary
node scripts/create-tables.js         # Create database tables (if needed)
node scripts/test-api.js              # Test API routes
node scripts/test-brands.js           # Test brand data and logos
node scripts/update-brands-with-logos.js  # Update brand logos in database

# Environment setup
# Ensure SUPABASE_URL and SUPABASE_ANON_KEY are set in .env
```

## Architecture Overview

### Tailwind CSS 4 Configuration

This project uses **Tailwind CSS v4** (next-generation with PostCSS plugin):
- Configuration is in `app/globals.css` using `@theme inline` directive
- Custom colors, fonts, and design tokens defined as CSS variables
- Import order matters: `@import "tailwindcss"` must come first
- Uses `tw-animate-css` for additional animation utilities
- No traditional `tailwind.config.js` file - all config in CSS
- Custom variants like `dark` are defined with `@custom-variant`

### Design Philosophy

**This is NOT a typical eCommerce site.** The design is editorial/magazine-style with:
- Asymmetric grids (NOT uniform product grids)
- Generous white space (luxury breathes)
- Image-first approach with large, high-quality photography
- Subtle, professional animations (200-400ms)
- Mobile-first, touch-friendly design

### Brand Color System

The brand uses a **strict color palette** that must be followed exactly:

```css
/* Primary Gradient - Use for CTAs, accents */
--gradient-primary: linear-gradient(135deg, #8e2157 0%, #5c0931 100%);
--gradient-hover: linear-gradient(135deg, #a02865 0%, #6d0a3c 100%);

/* Core Colors */
--burgundy: #8e2157
--plum: #5c0931
--charcoal: #2C2C2C (body text)
--light-gray: #F5F5F5 (subtle backgrounds)
--gold-accent: #D4AF37 (use sparingly for premium touches)
--text-secondary: #6B7280 (secondary text)
```

These colors are defined in `app/globals.css` as both CSS variables and Tailwind theme tokens. Access them in components via:
- CSS variables: `var(--burgundy)`, `var(--gradient-primary)`
- Tailwind classes: `text-burgundy`, `bg-plum`, `bg-light-gray`
- Utility classes: `.gradient-primary`, `.gradient-hover`, `.text-gradient`

### Typography

- **Headings:** Serif fonts (Playfair Display via `--font-serif`) for luxury feel
- **Body:** Sans-serif (Inter via `--font-sans`) for readability
- Font variables are defined in `app/layout.tsx` and referenced in `app/globals.css`
- Typography scales defined in globals.css:
  - Headings: `--font-size-hero` (4.5rem), `--font-size-h1` (3rem), `--font-size-h2` (2.25rem), etc.
  - Body: `--font-size-large` (1.125rem), `--font-size-regular` (1rem), `--font-size-small` (0.875rem)
  - Mobile sizes automatically adjust via media queries (640px breakpoint)
- Line heights: `--line-height-heading` (1.2), `--line-height-body` (1.6)

### Component Organization

```
components/
├── ui/           # shadcn/ui base components (Button, Dialog, Sheet, Input)
├── layout/       # Header, Footer, Navigation
├── home/         # Homepage-specific components (Hero, FeaturedProducts, BrandShowcase)
├── products/     # Product components
│   ├── ProductCard.tsx        # Magazine-style card with hover effects
│   ├── ProductGrid.tsx        # Editorial layout with variable heights
│   ├── ProductFilters.tsx     # Category, brand, price, color, size filters
│   ├── ProductSorter.tsx      # Dropdown sorter with 6 options
│   └── index.ts               # Centralized exports
├── cart/         # Cart and checkout components
├── search/       # Search components (SearchBar, SearchResults)
└── test/         # Test components for development
```

### Data Layer

**IMPORTANT:** This project uses **Supabase JS Client directly** (NOT Prisma):
- **Database:** PostgreSQL hosted on Supabase
- **Client:** Supabase client in `lib/supabase.ts`
- **Schema:** Database tables created via SQL scripts in `scripts/` directory
- **API Routes:** In `app/api/` using Supabase client for all queries
  - `/api/products` - List products with filters, sorting, pagination
  - `/api/products/[slug]` - Single product with related products
  - `/api/brands` - List all brands
  - `/api/categories` - Categories with hierarchy
  - `/api/search` - Search products by query
- **State Management:** Zustand stores in `store/` directory
  - `store/cartStore.ts` - Shopping cart with localStorage
  - `store/wishlistStore.ts` - Wishlist with localStorage
- **Hooks:** Custom hooks in `hooks/` directory
  - `hooks/useCart.ts` - Cart operations with price formatting
  - `hooks/useWishlist.ts` - Wishlist operations with sorting
- **Utilities:** Helper functions in `lib/utils.ts` (includes cn() for Tailwind class merging)

### Key Data Models

The database follows a standard eCommerce pattern:
- **User** → has Orders, Wishlist, Addresses
- **Brand** → has many Products
- **Category** → hierarchical with parent/child relationships
- **Product** → belongs to Brand and Category, has Images and Variants
- **Order** → belongs to User, has OrderItems and shipping Address
- **ProductVariant** → handles colors, sizes, SKUs, stock levels

### State Management Architecture

Zustand stores handle client-side state with localStorage persistence:

**Cart Store (`store/cartStore.ts`):**
- Actions: `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `isInCart`
- State: `items[]`, `itemCount`, `subtotal`
- Features: Stock validation, automatic calculations, localStorage persistence
- Usage: Always use via `hooks/useCart.ts` hook for price formatting and helpers

**Wishlist Store (`store/wishlistStore.ts`):**
- Actions: `addToWishlist`, `removeFromWishlist`, `toggleWishlist`, `clearWishlist`
- State: `items[]`, `itemCount`
- Features: Timestamp tracking, localStorage persistence
- Usage: Always use via `hooks/useWishlist.ts` hook for sorting/filtering

**Important:** When user authentication is implemented:
1. Sync localStorage cart/wishlist to database on login
2. Load user's cart/wishlist from database after auth
3. Merge local and server state appropriately

## Critical Implementation Rules

### 1. Editorial Layout (NOT Grid-Based)

Product listings MUST use magazine-style layouts:
- Variable heights for product cards
- Asymmetric positioning
- Mix of large "hero" products with smaller items
- NO uniform grid systems

### 2. Image Requirements

- Use Next.js `<Image>` component everywhere
- Minimum 1200px width for product images
- Aspect ratios: 3:4 for portrait, 16:9 for landscape
- Lazy loading for images below the fold
- Skeleton screens for loading states (NOT spinners)

### 3. Animation Guidelines

Keep animations **subtle and luxury-appropriate**:
- Hover effects: 200ms ease-out
- Page transitions: 300ms ease
- Modal appearances: 400ms fade + scale
- NO bouncing, excessive motion, or playful effects
- Maximum duration: 600ms

### 4. TypeScript Standards

- Strict mode enabled
- NO `any` types
- Define interfaces for all component props
- Use Zod for runtime validation
- Database types inferred from Supabase queries

**Next.js 16 Important Change:**
- Route params are now async in dynamic routes
- Always await params: `const params = await props.params`
- Example:
  ```typescript
  export default async function ProductPage(props: {
    params: Promise<{ slug: string }>
  }) {
    const params = await props.params
    const { slug } = params
    // ...
  }
  ```

### 5. Naming Conventions

```typescript
// Files: kebab-case
product-card.tsx
use-cart.ts

// Components: PascalCase
export default function ProductCard({ ... }) { }

// Hooks: camelCase with 'use' prefix
export function useCart() { }

// Utils: camelCase
export function formatPrice(price: number) { }

// Types/Interfaces: PascalCase
export interface Product { }
export type OrderStatus = 'pending' | 'processing' | ...
```

### 6. Component Structure

All components should follow this structure:

```typescript
'use client' // Only if client component needed

import { ... } from 'react'
import { ... } from '@/components/...'
import { ... } from '@/lib/...'

interface ComponentNameProps {
  prop1: string
  prop2?: number
}

export default function ComponentName({
  prop1,
  prop2
}: ComponentNameProps) {
  // 1. Hooks
  // 2. State
  // 3. Effects
  // 4. Handlers
  // 5. Render helpers

  return (
    <div>
      {/* JSX */}
    </div>
  )
}
```

## Environment Variables

Currently required variables in `.env`:

```env
# Supabase (REQUIRED - Currently Active)
SUPABASE_URL              # Your Supabase project URL
SUPABASE_ANON_KEY         # Your Supabase anon/public key

# Future integrations (not yet implemented):
NEXTAUTH_URL              # App URL (http://localhost:3000 in dev)
NEXTAUTH_SECRET           # Generate with: openssl rand -base64 32
GOOGLE_CLIENT_ID          # Google OAuth client ID
GOOGLE_CLIENT_SECRET      # Google OAuth client secret
STRIPE_SECRET_KEY         # Stripe secret key (sk_test_...)
STRIPE_PUBLISHABLE_KEY    # Stripe publishable key (pk_test_...)
STRIPE_WEBHOOK_SECRET     # Stripe webhook secret (whsec_...)
RESEND_API_KEY            # Resend email API key
FROM_EMAIL                # Sender email address
```

## Database Workflow

### Current Setup (Supabase)

This project uses **Supabase JS Client** for all database operations:
- Database schema is defined via SQL files in `scripts/` directory
- No ORM or migration tools (direct SQL)
- Schema changes require manual SQL updates in Supabase dashboard or via SQL files

### Database Scripts

Located in `scripts/` directory:

- **create-tables.sql** - SQL script to create all database tables
- **create-tables.js** - Node.js script to execute table creation
- **seed-complete.sql** - Complete seed data (brands, categories, products, images, variants)
- **seed-data.sql** - Minimal seed data
- **check-db.js** - Verify database connection and view data summary (run this often!)
- **test-api.js** - Test all API routes
- **test-brands.js** - Test brand data and logos
- **update-brands-with-logos.js** - Update brand logos in database

### Querying with Supabase

```typescript
import { supabase } from '@/lib/supabase'

// Always include error handling
try {
  const { data: products, error } = await supabase
    .from('Product')
    .select(`
      *,
      brand:Brand!Product_brandId_fkey (
        id,
        name,
        slug
      ),
      images:ProductImage (
        id,
        url,
        alt,
        order
      ),
      variants:ProductVariant (
        id,
        color,
        size,
        stock
      )
    `)
    .eq('inStock', true)
    .order('createdAt', { ascending: false })
    .limit(20)

  if (error) throw error
  return products
} catch (error) {
  console.error('Error fetching products:', error)
  throw new Error('Failed to fetch products')
}
```

### Database Seeding

The database is seeded with:
- **19 luxury brands** with logos (Rolex, Gucci, Prada, Louis Vuitton, Hermès, Chanel, Dior, Balenciaga, Versace, Burberry, Ralph Lauren, Armani, Cartier, Omega, Nike, Adidas, Calvin Klein, Tommy Hilfiger, Hugo Boss)
- Brand logos stored in `/public/Brands/` directory
- **7 categories** (Men, Women, Accessories, Watches, Bags, Shoes, Clothing)
- **28 products** with images and variants
- All seed data is in SQL format in `scripts/seed-complete.sql`

## API Route Patterns

All API routes should follow this structure:

```typescript
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: Request) {
  try {
    // 1. Extract and validate params/query
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')

    // 2. Authenticate if needed (for protected routes)

    // 3. Perform database query with Supabase
    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await supabase
      .from('Product')
      .select('*', { count: 'exact' })
      .range(from, to)

    if (error) throw error

    // 4. Return JSON response
    return NextResponse.json({
      products: data,
      total: count,
      page,
      limit
    })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
```

## Important Tailwind CSS 4 Notes

When working with Tailwind v4:
- **Color classes:** Use color names directly (e.g., `bg-burgundy`, `text-plum`)
- **CSS variables in Tailwind:** Reference via `var(--variable-name)` in arbitrary values
- **Custom gradients:** Use `.gradient-primary` class or inline `bg-[var(--gradient-primary)]`
- **Theme tokens:** Defined in `@theme inline` block in globals.css
- **No config file:** Don't create `tailwind.config.js` - all configuration is CSS-based
- **Adding new utilities:** Define them in globals.css after the theme block

## Common Pitfalls to Avoid

1. **DON'T use uniform product grids** - must be editorial/asymmetric
2. **DON'T overuse animations** - keep subtle and professional
3. **DON'T skimp on white space** - luxury needs breathing room
4. **DON'T use bright colors** - stick to the brand palette strictly
5. **DON'T create small tap targets** - minimum 44x44px on mobile
6. **DON'T use spinners for loading** - use skeleton screens instead
7. **DON'T expose Stripe secret keys** - client only uses publishable key
8. **DON'T skip server-side validation** - never trust client input
9. **DON'T hardcode content** - use database and environment variables
10. **DON'T use `any` types** - TypeScript strict mode is enabled
11. **DON'T create traditional Tailwind config** - this project uses Tailwind v4 with CSS-only config

## Reference Documents

**Critical reference documents:**

- **NextPlan.md** - Development plan and progress tracker (IN THIS REPO)
  - Current phase and overall progress (80% complete as of Phase 5)
  - Detailed task lists for each development phase
  - Daily progress log
  - Completion criteria and next steps
  - **Always check this first** to understand current project status

- **ALINE-MART-PROMPT.md** - Complete project brief with development phases (parent directory)
- **ALINE-MART-SKILL.md** - Detailed design specifications and requirements (parent directory)

These documents contain the full design system specifications, brand guidelines, and implementation details. Refer to them for:
- Complete color palette and usage guidelines
- Typography scale and font specifications
- Component design standards
- Full database schema with relationships
- Feature requirements by development phase
- Performance and SEO requirements
- Accessibility standards (WCAG 2.1 AA)

## Code Quality Standards

- **Components:** Small, reusable, single responsibility principle
- **Imports:** Use absolute imports with `@/` alias
- **Comments:** Only for complex logic; code should be self-documenting
- **Error Handling:** Try-catch blocks with user-friendly messages
- **Validation:** Server-side validation for all inputs using Zod
- **Security:** Sanitize inputs, parameterized queries, HTTPS only

## Performance Targets

- Lighthouse score > 90 (all categories)
- Page load < 2 seconds
- Time to Interactive < 3 seconds
- Optimized images using Next.js Image component
- Code splitting via dynamic imports
- SEO meta tags on all pages

## Key Features

1. **Authentication:** Google OAuth via NextAuth.js v5 (planned)
2. **Product Catalog:** Browse by brand, category, with search and filters
3. **Shopping Cart:** Persistent cart with localStorage (sync to database when auth is implemented)
4. **Wishlist:** Save products for later
5. **Checkout:** Multi-step with Stripe integration (planned)
6. **User Account:** Order history, profile, saved addresses (planned)
7. **Responsive Design:** Mobile-first with touch-friendly UI
8. **Search & Discovery:** Full-text search, brand pages, category pages

## Brand Requirements

The site features **19 luxury brands** with logos:
Rolex, Gucci, Prada, Louis Vuitton, Hermès, Chanel, Dior, Balenciaga, Versace, Burberry, Ralph Lauren, Armani, Cartier, Omega, Nike, Adidas, Calvin Klein, Tommy Hilfiger, Hugo Boss

Products span multiple categories: Clothing, Shoes, Accessories, Watches, Bags

## Mobile Considerations

- Touch targets minimum 44x44px
- Swipe gestures for image carousels
- Sticky "Add to Cart" button on mobile PDP
- Full-screen mobile navigation overlay
- Optimized checkout flow for mobile

## Project Status

**Current Progress: 80% Complete** (as of December 6, 2025 - Phase 5)

### ✅ Completed (Phases 1-5):
- Next.js 16 project initialized with TypeScript
- Tailwind CSS v4 configured with custom design system (CSS-only config)
- Brand colors and typography system implemented
- Database setup via Supabase (PostgreSQL)
- Database seeded with 19 brands, 7 categories, 28 products
- API routes fully functional (products, brands, categories, search)
- State management with Zustand (cart & wishlist with localStorage)
- Product components (ProductCard, ProductGrid, ProductFilters, ProductSorter)
- Homepage with Hero, FeaturedProducts, BrandShowcase
- Product Listing Page (PLP) with filters and sorting
- Product Detail Page (PDP) with image gallery, variants, add to cart
- Shopping Cart Page with cart summary and checkout CTA
- Search functionality with SearchBar and SearchResults
- Brand pages with brand-specific product listings
- Category pages with category-specific product listings
- Header with navigation and cart/wishlist icons
- Footer with links and newsletter signup
- shadcn/ui components installed and customized
- Test pages for development (`/test-store`, `/test-products`)

### ⏳ In Progress (Phase 6):
- Authentication with NextAuth.js v5 + Google OAuth
- User account pages (dashboard, orders, profile, addresses)
- Syncing localStorage cart/wishlist to database on login

### 🔜 Not Yet Started (Phase 7-9):
- Stripe payment integration
- Checkout flow (multi-step with Stripe Elements)
- Email integration (Resend) for order confirmations
- Admin dashboard (product management, order management, analytics)
- Performance optimization and SEO enhancements

## Final Notes

This is a **luxury eCommerce platform** where every design decision should prioritize:
1. Visual sophistication over flashy effects
2. User experience over feature quantity
3. Performance over unnecessary complexity
4. Editorial style over traditional eCommerce layouts

When in doubt, ask: "Does this feel premium and magazine-like?" The goal is to create an experience that feels like browsing a high-end fashion magazine, not a typical online store.

**Before starting new work:**
- Always check `NextPlan.md` for current phase and progress
- Refer to `ALINE-MART-PROMPT.md` and `ALINE-MART-SKILL.md` files in the parent directory for complete specifications
- Run `node scripts/check-db.js` to verify database connection and data
