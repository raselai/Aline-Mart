import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product } from "@/types";
import { ProductCard } from "@/components/products";
import HeroCarousel from "./HeroCarousel";

export const revalidate = 300 // Revalidate every 5 minutes

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

async function getHotDeals(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        brand:Brand!Product_brandId_fkey (
          id,
          name,
          slug
        ),
        category:Category!Product_categoryId_fkey (
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
      .not('salePrice', 'is', null)
      .eq('inStock', true)
      .order('salePrice', { ascending: true })
      .limit(8)

    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Error fetching hot deals:', error)
    return []
  }
}

async function getNewArrivals(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('Product')
      .select(`
        *,
        brand:Brand!Product_brandId_fkey (
          id,
          name,
          slug
        ),
        category:Category!Product_categoryId_fkey (
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
      .eq('isNew', true)
      .eq('inStock', true)
      .order('createdAt', { ascending: false })
      .limit(8)

    if (error) throw error
    return (data || []) as Product[]
  } catch (error) {
    console.error('Error fetching new arrivals:', error)
    return []
  }
}

export default async function Home() {
  // Fetch data in parallel
  const [hotDeals, newArrivals, brands] = await Promise.all([
    getHotDeals(),
    getNewArrivals(),
    getBrands()
  ])

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Hero Section with Carousel */}
      <HeroCarousel />

      {/* Brand Philosophy Section */}
      <section className="py-8 md:py-20 lg:py-24 bg-white relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute top-20 right-0 w-96 h-96 bg-burgundy/5 rounded-full blur-3xl" />

        <div className="max-w-[1200px] mx-auto px-6 lg:px-12 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
            {/* Left: Large Statement */}
            <div className="space-y-4 md:space-y-6 lg:space-y-8">
              <div className="inline-block">
                <div className="h-1 w-12 md:w-16 bg-gradient-to-r from-burgundy to-plum mb-3 md:mb-4 lg:mb-6" />
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-tight text-charcoal">
                Curated luxury,
                <span className="block italic text-burgundy">delivered worldwide</span>
              </h2>
            </div>

            {/* Right: Body Copy */}
            <div className="space-y-3 md:space-y-4 lg:space-y-6">
              <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-charcoal/80">
                Aline Mart brings together the world's most prestigious brands in one exceptional destination.
                From Rolex timepieces to Gucci fashion, every piece is carefully selected to embody timeless elegance.
              </p>
              <p className="text-sm sm:text-base md:text-lg leading-relaxed text-charcoal/60">
                Our commitment extends beyond products—we deliver an experience of refinement, authenticity, and unparalleled service.
              </p>
              <div className="pt-2 md:pt-3 lg:pt-4">
                <Button
                  asChild
                  variant="outline"
                  className="group border-2 border-burgundy text-burgundy hover:bg-burgundy hover:text-white font-medium px-6 py-4 md:px-8 md:py-6 rounded-none transition-all duration-500 text-sm md:text-base"
                >
                  <Link href="/products" className="flex items-center gap-2">
                    Discover Our Collection
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
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

        {/* Infinite Scroll Container */}
        <div className="relative">
          {/* Gradient Overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          {/* Scrolling Brands Track */}
          <div className="flex gap-8 animate-scroll-brands">
            {/* First set of brands */}
            {brands.map((brand, index) => (
              <Link
                key={`brand-1-${brand.id}`}
                href={`/brands/${brand.slug}`}
                className="group relative flex-shrink-0 w-[180px] h-[120px] bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-burgundy hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-20"
              >
                <Image
                  src={brand.logo || `/Brands/${index + 1}.jpg`}
                  alt={brand.name}
                  width={180}
                  height={120}
                  className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                {/* Hover Effect Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Brand Name Tooltip */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-burgundy text-white px-3 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {brand.name}
                </div>
              </Link>
            ))}

            {/* Duplicate set for seamless loop */}
            {brands.map((brand, index) => (
              <Link
                key={`brand-2-${brand.id}`}
                href={`/brands/${brand.slug}`}
                className="group relative flex-shrink-0 w-[180px] h-[120px] bg-white border-2 border-gray-200 rounded-lg overflow-hidden hover:border-burgundy hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:z-20"
              >
                <Image
                  src={brand.logo || `/Brands/${index + 1}.jpg`}
                  alt={brand.name}
                  width={180}
                  height={120}
                  className="w-full h-full object-contain p-4 grayscale group-hover:grayscale-0 transition-all duration-300"
                />
                {/* Hover Effect Glow */}
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {/* Brand Name Tooltip */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-burgundy text-white px-3 py-1 rounded text-xs font-medium whitespace-nowrap">
                  {brand.name}
                </div>
              </Link>
            ))}
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

      {/* Features Grid - Asymmetric Editorial Layout */}
      <section className="py-24 bg-[#FAF9F6]">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-burgundy/10">

            {/* Feature 1 */}
            <div className="bg-white p-12 group hover:bg-burgundy transition-all duration-700 cursor-default">
              <div className="space-y-4">
                <div className="text-6xl font-serif font-bold text-burgundy group-hover:text-white transition-colors">01</div>
                <h3 className="text-xl font-semibold text-charcoal group-hover:text-white transition-colors">Authenticated Excellence</h3>
                <p className="text-sm text-charcoal/60 group-hover:text-white/80 leading-relaxed transition-colors">
                  Every product verified for authenticity and quality
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-12 group hover:bg-burgundy transition-all duration-700 cursor-default">
              <div className="space-y-4">
                <div className="text-6xl font-serif font-bold text-burgundy group-hover:text-white transition-colors">02</div>
                <h3 className="text-xl font-semibold text-charcoal group-hover:text-white transition-colors">Global Delivery</h3>
                <p className="text-sm text-charcoal/60 group-hover:text-white/80 leading-relaxed transition-colors">
                  Secure shipping to destinations worldwide
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-12 group hover:bg-burgundy transition-all duration-700 cursor-default">
              <div className="space-y-4">
                <div className="text-6xl font-serif font-bold text-burgundy group-hover:text-white transition-colors">03</div>
                <h3 className="text-xl font-semibold text-charcoal group-hover:text-white transition-colors">Concierge Service</h3>
                <p className="text-sm text-charcoal/60 group-hover:text-white/80 leading-relaxed transition-colors">
                  Personalized assistance every step of the way
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-12 group hover:bg-burgundy transition-all duration-700 cursor-default">
              <div className="space-y-4">
                <div className="text-6xl font-serif font-bold text-burgundy group-hover:text-white transition-colors">04</div>
                <h3 className="text-xl font-semibold text-charcoal group-hover:text-white transition-colors">Effortless Returns</h3>
                <p className="text-sm text-charcoal/60 group-hover:text-white/80 leading-relaxed transition-colors">
                  30-day return policy for complete peace of mind
                </p>
              </div>
            </div>
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
              <h3 className="text-lg md:text-xl font-semibold text-white mb-3">Global Delivery</h3>
              <p className="text-sm text-white/70 leading-relaxed">
                White-glove shipping to your doorstep, anywhere in the world
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
