import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { ProductCard } from "@/components/products";
import HeroCarousel from "./HeroCarousel";

export const dynamic = 'force-dynamic'

interface HeroSettings {
  tagline?: string
  headline?: string
  subheadline?: string
  ctaText?: string
  ctaLink?: string
  stat1Number?: string
  stat1Label?: string
  stat2Number?: string
  stat2Label?: string
  images?: string[]
}

async function getHeroSettings(): Promise<HeroSettings> {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('key, value')
      .like('key', 'hero_%')

    if (error) throw error

    const settings: HeroSettings = {}
    data?.forEach((row: { key: string; value: string }) => {
      switch (row.key) {
        case 'hero_tagline': settings.tagline = row.value; break
        case 'hero_headline': settings.headline = row.value; break
        case 'hero_subheadline': settings.subheadline = row.value; break
        case 'hero_cta_text': settings.ctaText = row.value; break
        case 'hero_cta_link': settings.ctaLink = row.value; break
        case 'hero_stat_1_number': settings.stat1Number = row.value; break
        case 'hero_stat_1_label': settings.stat1Label = row.value; break
        case 'hero_stat_2_number': settings.stat2Number = row.value; break
        case 'hero_stat_2_label': settings.stat2Label = row.value; break
        case 'hero_images':
          try {
            const parsed = JSON.parse(row.value)
            if (Array.isArray(parsed)) settings.images = parsed
          } catch {
            // keep default images
          }
          break
      }
    })
    return settings
  } catch (error) {
    console.error('Error fetching hero settings:', error)
    return {}
  }
}

interface Brand {
  id: string
  name: string
  slug: string
  logo: string | null
}

async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('Brand')
      .select('id, name, slug, logo')
      .order('name', { ascending: true })

    if (error) throw error
    return (data || []) as Brand[]
  } catch (error) {
    console.error('Error fetching brands:', error)
    return []
  }
}

const productSelect = `
  *,
  brand:Brand!Product_brandId_fkey (id, name, slug),
  category:Category!Product_categoryId_fkey (id, name, slug),
  images:ProductImage (id, url, alt, order),
  variants:ProductVariant (id, color, size, stock)
`

async function getHotDeals(): Promise<Product[]> {
  try {
    // Try products with sale prices first
    const { data, error } = await supabase
      .from('Product')
      .select(productSelect)
      .not('salePrice', 'is', null)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('salePrice', { ascending: true })
      .limit(8)

    if (error) throw error
    if (data && data.length > 0) return data as Product[]

    // Fallback: show products sorted by price (lowest first) for deal feel
    const { data: fallback, error: fbError } = await supabase
      .from('Product')
      .select(productSelect)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('price', { ascending: true })
      .limit(8)

    if (fbError) throw fbError
    return (fallback || []) as Product[]
  } catch (error) {
    console.error('Error fetching hot deals:', error)
    return []
  }
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    // Try products marked as new first
    const { data, error } = await supabase
      .from('Product')
      .select(productSelect)
      .eq('isNew', true)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('createdAt', { ascending: false })
      .limit(8)

    if (error) throw error
    if (data && data.length > 0) return data as Product[]

    // Fallback: show most recently added products
    const { data: fallback, error: fbError } = await supabase
      .from('Product')
      .select(productSelect)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('createdAt', { ascending: false })
      .limit(8)

    if (fbError) throw fbError
    return (fallback || []) as Product[]
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return []
  }
}

async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  try {
    // Get the parent category
    const { data: parentCategory } = await supabase
      .from('Category')
      .select('id')
      .eq('slug', categorySlug)
      .single()

    if (!parentCategory) return []

    // Fetch all categories once and collect all descendants in-memory
    const { data: allCategories } = await supabase
      .from('Category')
      .select('id, parentId')

    const childrenByParent = new Map<string, string[]>()
    for (const cat of allCategories || []) {
      if (cat.parentId) {
        const siblings = childrenByParent.get(cat.parentId) || []
        siblings.push(cat.id)
        childrenByParent.set(cat.parentId, siblings)
      }
    }

    const categoryIds: string[] = [parentCategory.id]
    const queue = [parentCategory.id]
    while (queue.length > 0) {
      const current = queue.pop()!
      const children = childrenByParent.get(current) || []
      for (const childId of children) {
        categoryIds.push(childId)
        queue.push(childId)
      }
    }

    const { data, error } = await supabase
      .from('Product')
      .select(productSelect)
      .in('categoryId', categoryIds)
      .eq('inStock', true)
      .or('status.is.null,status.eq.ACTIVE')
      .order('createdAt', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error(`Error fetching ${categorySlug} products:`, error)
    return []
  }
}

export default async function Home() {
  // Fetch data in parallel
  const [hotDeals, newArrivals, brands, heroSettings, menProducts, womenProducts] = await Promise.all([
    getHotDeals(),
    getNewArrivals(),
    getBrands(),
    getHeroSettings(),
    getProductsByCategory('mens'),
    getProductsByCategory('womens'),
  ])

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section with Carousel */}
      <HeroCarousel {...heroSettings} />

      {/* Brands Section - Infinite Scroll */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 mb-8 md:mb-12">
          {/* Section Header */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="h-1 w-12 bg-gradient-to-r from-burgundy to-plum" />
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-3">
              Our Brands
            </h2>
            <p className="text-sm md:text-base text-charcoal/60 whitespace-nowrap">
              Featuring the world's most prestigious luxury brands
            </p>
          </div>
        </div>

        {/* Infinite Scroll Container - Two Rows */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="flex flex-col gap-6">
            {/* Row 1 — scrolls left */}
            <div className="flex gap-8 animate-scroll-brands">
              {[...brands, ...brands].map((brand, index) => (
                <Link
                  key={`row1-${index}-${brand.id}`}
                  href={`/brands/${brand.slug}`}
                  className="group relative flex-shrink-0 w-[180px] h-[120px] bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-burgundy hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-20"
                >
                  <Image
                    src={brand.logo || `/Brands/${(index % brands.length) + 1}.jpg`}
                    alt={brand.name}
                    width={180}
                    height={120}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-burgundy text-white px-3 py-1 rounded text-xs font-medium whitespace-nowrap">
                    {brand.name}
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 — scrolls right (reversed order for variety) */}
            <div className="flex gap-8 animate-scroll-brands-reverse">
              {[...brands].reverse().concat([...brands].reverse()).map((brand, index) => (
                <Link
                  key={`row2-${index}-${brand.id}`}
                  href={`/brands/${brand.slug}`}
                  className="group relative flex-shrink-0 w-[180px] h-[120px] bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-burgundy hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-20"
                >
                  <Image
                    src={brand.logo || `/Brands/${(index % brands.length) + 1}.jpg`}
                    alt={brand.name}
                    width={180}
                    height={120}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-burgundy text-white px-3 py-1 rounded text-xs font-medium whitespace-nowrap">
                    {brand.name}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* View All Brands CTA */}
        <div className="text-center mt-10 md:mt-12">
          <Button
            asChild
            variant="outline"
            className="group border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white font-medium px-8 py-6 rounded-none transition-all duration-500"
          >
            <Link href="/brands" className="flex items-center gap-2">
              Explore All Brands
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Hot Deals Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-br from-burgundy via-plum to-burgundy relative overflow-hidden">
        {/* Decorative overlay */}
        <div className="absolute inset-0 bg-black/10" />

        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 relative z-10">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-gold-accent" />
                <span className="text-xs md:text-sm uppercase tracking-wider text-white/80 font-semibold">Limited Time Only</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-white">
                Hot Deals
              </h2>
            </div>
            <Link
              href="/products"
              className="hidden md:flex items-center gap-2 text-white hover:text-gold-accent transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {hotDeals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {hotDeals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="small"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-white/80 text-lg">No deals available at the moment. Check back soon!</p>
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-white hover:text-gold-accent transition-colors duration-300 font-medium"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-burgundy to-plum" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="hidden md:flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {newArrivals.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {newArrivals.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="small"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-charcoal/60 text-lg">No new arrivals at the moment. Check back soon!</p>
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/products?sort=newest"
              className="inline-flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 font-medium"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Men's Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-burgundy to-plum" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal">
                Men
              </h2>
            </div>
            <Link
              href="/categories/men"
              className="hidden md:flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {menProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {menProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="small"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-charcoal/60 text-lg">No products available at the moment. Check back soon!</p>
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/categories/men"
              className="inline-flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 font-medium"
            >
              <span>View All Men</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Women's Section */}
      <section className="py-12 md:py-16 lg:py-20 bg-white">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-burgundy to-plum" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal">
                Women
              </h2>
            </div>
            <Link
              href="/categories/women"
              className="hidden md:flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          {womenProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {womenProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  variant="small"
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-charcoal/60 text-lg">No products available at the moment. Check back soon!</p>
            </div>
          )}

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/categories/women"
              className="inline-flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 font-medium"
            >
              <span>View All Women</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury CTA Section - Editorial Magazine Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-burgundy via-plum to-burgundy">
        {/* Subtle texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }} />

        <div className="relative z-10 max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-24 lg:py-32">

          {/* Top: Headline & CTA */}
          <div className="text-white text-center mb-16 md:mb-20 lg:mb-24">
            {/* Decorative Element */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="h-[1px] w-16 bg-gradient-to-r from-transparent to-white/40" />
              <span className="text-xs tracking-[0.3em] uppercase font-light opacity-80">Exclusive Access</span>
              <div className="h-[1px] w-16 bg-gradient-to-l from-transparent to-white/40" />
            </div>

            {/* Main Headline - Playfair Display */}
            <h2 className="font-serif font-bold leading-[1.1] tracking-tight mb-8 md:mb-10">
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl">Begin your</span>
              <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl italic bg-gradient-to-r from-white via-white to-gold-accent bg-clip-text text-transparent">journey into luxury</span>
            </h2>

            {/* CTA Button & Stats */}
            <div className="flex flex-col items-center gap-8">
              <Link
                href="/products"
                className="group inline-flex items-center gap-4 bg-white text-burgundy px-10 py-5 font-semibold text-lg transition-all duration-500 hover:bg-gold-accent hover:text-charcoal hover:shadow-2xl hover:shadow-gold-accent/20 hover:-translate-y-1"
              >
                <span>Start Shopping</span>
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-2" />
              </Link>

              {/* Stats */}
              <div className="flex gap-8 md:gap-12 opacity-90">
                <div>
                  <div className="text-3xl md:text-4xl font-serif font-bold mb-1">20+</div>
                  <div className="text-xs md:text-sm uppercase tracking-wider opacity-75">Luxury Brands</div>
                </div>
                <div>
                  <div className="text-3xl md:text-4xl font-serif font-bold mb-1">100+</div>
                  <div className="text-xs md:text-sm uppercase tracking-wider opacity-75">Premium Products</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom: Feature Cards - Horizontal Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Card 1 - Floating */}
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl"
              style={{
                animation: 'float 6s ease-in-out infinite',
                animationDelay: '0s'
              }}
            >
              <div className="text-5xl md:text-6xl font-serif mb-4">✦</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Curated Selection</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Every piece handpicked from the world's most prestigious fashion houses
              </p>
            </div>

            {/* Card 2 - Floating */}
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl"
              style={{
                animation: 'float 6s ease-in-out infinite',
                animationDelay: '2s'
              }}
            >
              <div className="text-5xl md:text-6xl font-serif mb-4">✧</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Fastest Delivery</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Express shipping to your doorstep in record time
              </p>
            </div>

            {/* Card 3 - Floating */}
            <div
              className="bg-white/10 backdrop-blur-md border border-white/20 p-6 md:p-8 shadow-2xl"
              style={{
                animation: 'float 6s ease-in-out infinite',
                animationDelay: '4s'
              }}
            >
              <div className="text-5xl md:text-6xl font-serif mb-4">✺</div>
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Authenticity Guaranteed</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                Every product verified and authenticated by our expert team
              </p>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
