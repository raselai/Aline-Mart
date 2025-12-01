# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Aline Mart** is a luxury multi-brand eCommerce marketplace with an editorial, magazine-style design inspired by Mr Porter. The design uses a distinctive Qatar Airways-inspired gradient (burgundy #8e2157 to plum #5c0931) and prioritizes visual sophistication over typical eCommerce layouts.

## Tech Stack

- **Framework:** Next.js 14+ (App Router, TypeScript)
- **Styling:** Tailwind CSS 4 with custom configuration
- **UI Components:** shadcn/ui (heavily customized)
- **State Management:** Zustand
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js v5 (email/password only)
- **Payment:** Stripe (Checkout & Payment Intents)
- **Forms:** React Hook Form + Zod validation
- **Animations:** Framer Motion (subtle, luxury-appropriate)

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

# Database commands
npx prisma generate      # Generate Prisma client
npx prisma migrate dev   # Run migrations in development
npx prisma db push       # Push schema changes without migration
npx prisma db seed       # Seed database (if seed file exists)
npx prisma studio        # Open Prisma Studio GUI
```

## Architecture Overview

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
```

These colors are defined in `app/globals.css` and should be referenced via Tailwind classes or CSS variables.

### Typography

- **Headings:** Serif fonts (Playfair Display) for luxury feel
- **Body:** Sans-serif (Inter) for readability
- All typography scales are defined in the design system
- Follow the scales strictly to maintain visual consistency

### Component Organization

```
components/
├── ui/           # shadcn/ui base components (customized)
├── layout/       # Header, Footer, Navigation
├── home/         # Homepage-specific components
├── products/     # Product cards, grids, filters, galleries
├── cart/         # Cart items, summaries
└── common/       # Shared components (Button, Modal, Loading)
```

### Data Layer

- **Prisma Schema:** Located in `prisma/schema.prisma`
- **Database Client:** Singleton pattern in `lib/prisma.ts`
- **State Management:** Zustand stores in `store/` directory (currently minimal)
- **API Routes:** In `app/api/` following Next.js App Router conventions

### Key Data Models

The database follows a standard eCommerce pattern:
- **User** → has Orders, Wishlist, Addresses
- **Brand** → has many Products
- **Category** → hierarchical with parent/child relationships
- **Product** → belongs to Brand and Category, has Images and Variants
- **Order** → belongs to User, has OrderItems and shipping Address
- **ProductVariant** → handles colors, sizes, SKUs, stock levels

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
- Prisma types for database entities

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

Required variables in `.env` (see `.env.example`):

```env
DATABASE_URL              # PostgreSQL connection string
NEXTAUTH_URL              # App URL (http://localhost:3000 in dev)
NEXTAUTH_SECRET           # Generate with: openssl rand -base64 32
STRIPE_SECRET_KEY         # Stripe secret key (sk_test_...)
STRIPE_PUBLISHABLE_KEY    # Stripe publishable key (pk_test_...)
STRIPE_WEBHOOK_SECRET     # Stripe webhook secret (whsec_...)
CLOUDINARY_CLOUD_NAME     # Cloudinary cloud name
CLOUDINARY_API_KEY        # Cloudinary API key
CLOUDINARY_API_SECRET     # Cloudinary API secret
RESEND_API_KEY            # Resend email API key
FROM_EMAIL                # Sender email address
```

## Database Workflow

### Making Schema Changes

1. Edit `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name description_of_change`
3. Prisma Client auto-generates updated types
4. Use new types in code

### Querying Best Practices

```typescript
// Always include error handling
try {
  const products = await prisma.product.findMany({
    where: { /* filters */ },
    include: {
      brand: true,      // Include related brand
      images: true,     // Include product images
      variants: true    // Include size/color variants
    },
    orderBy: { createdAt: 'desc' },
    take: 20,           // Limit results
  })
  return products
} catch (error) {
  console.error('Error fetching products:', error)
  throw new Error('Failed to fetch products')
}
```

## API Route Patterns

All API routes should follow this structure:

```typescript
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  try {
    // 1. Extract and validate params/query
    // 2. Authenticate if needed
    // 3. Perform database query
    // 4. Return JSON response

    return NextResponse.json({ data: results })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: 'Error message for user' },
      { status: 500 }
    )
  }
}
```

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

## Reference Documents

The repository includes two critical reference documents in the parent directory:

- **ALINE-MART-PROMPT.md** - Complete project brief with development phases
- **ALINE-MART-SKILL.md** - Detailed design specifications and requirements

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

## Testing Approach

While automated tests may be limited, manual testing checklist includes:
- User registration and authentication flow
- Cart operations (add, update quantity, remove)
- Wishlist functionality
- Product search and filtering
- Complete checkout with Stripe test mode
- Order confirmation emails
- Mobile responsiveness on iOS/Android
- Cross-browser compatibility (Chrome, Safari, Firefox)

## Performance Targets

- Lighthouse score > 90 (all categories)
- Page load < 2 seconds
- Time to Interactive < 3 seconds
- Optimized images using Next.js Image component
- Code splitting via dynamic imports
- SEO meta tags on all pages

## Key Features

1. **Authentication:** Email/password via NextAuth.js v5
2. **Product Catalog:** Browse by brand, category, with search and filters
3. **Shopping Cart:** Persistent cart (tied to user account when logged in)
4. **Wishlist:** Save products for later
5. **Checkout:** Multi-step with Stripe integration
6. **User Account:** Order history, profile, saved addresses
7. **Responsive Design:** Mobile-first with touch-friendly UI

## Brand Requirements

The site features **20+ luxury brands** including:
Rolex, Adidas, Nike, Zara, Calvin Klein, Gucci, Prada, Louis Vuitton, Hermès, Chanel, Dior, Balenciaga, Versace, Burberry, Ralph Lauren, Tommy Hilfiger, Hugo Boss, Armani, Cartier, Omega

Products should span multiple categories: Clothing, Shoes, Accessories, Watches, Bags

## Mobile Considerations

- Touch targets minimum 44x44px
- Swipe gestures for image carousels
- Sticky "Add to Cart" button on mobile PDP
- Full-screen mobile navigation overlay
- Optimized checkout flow for mobile

## Final Notes

This is a **luxury eCommerce platform** where every design decision should prioritize:
1. Visual sophistication over flashy effects
2. User experience over feature quantity
3. Performance over unnecessary complexity
4. Editorial style over traditional eCommerce layouts

When in doubt, ask: "Does this feel premium and magazine-like?" The goal is to create an experience that feels like browsing a high-end fashion magazine, not a typical online store.
