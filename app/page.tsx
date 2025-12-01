'use client'

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero slider images
  const heroImages = [
    '/Hero/hero-1.jpg',
    '/Hero/hero-2.jpg',
    '/Hero/hero-3.jpg',
    '/Hero/hero-4.jpg',
    '/Hero/hero-5.jpg',
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(timer);
  }, [heroImages.length]);

  return (
    <div className="w-full overflow-hidden bg-white">
      {/* Diagonal Split Hero */}
      <section className="relative h-[70vh] min-h-[500px] lg:h-[100vh] lg:min-h-[700px] overflow-hidden bg-[#FAF9F6] mt-[64px] lg:mt-[108px]">
        {/* Noise Texture Overlay - Temporarily disabled for debugging */}
        {/* <div className="absolute inset-0 opacity-[0.015] mix-blend-multiply pointer-events-none z-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`
          }}
        /> */}

        {/* Diagonal Background Split */}
        <div className="absolute inset-0">
          {/* Right section - Light background without images (placeholder) */}
          <div
            className="absolute inset-y-0 right-0 left-0 bg-[#FAF9F6] z-0"
            style={{
              clipPath: 'polygon(45% 0, 100% 0, 100% 100%, 65% 100%)',
              animation: 'slideInRight 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />

          {/* Image slider - positioned only on the right side */}
          <div
            className="absolute inset-y-0 right-0 w-[55%] z-0"
          >
            {/* Sliding Background Images Container */}
            <div className="absolute inset-0 overflow-hidden">
              {heroImages.map((image, index) => (
                <div
                  key={`slide-${index}`}
                  className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
                    index === currentSlide
                      ? 'opacity-100 scale-100 z-10'
                      : 'opacity-0 scale-110 z-0'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Hero slide ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error(`Failed to load image: ${image}`);
                      e.currentTarget.style.display = 'none';
                    }}
                    onLoad={() => console.log(`Loaded image: ${image}`)}
                  />
                </div>
              ))}
            </div>

            {/* Subtle overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5 pointer-events-none z-20" />
          </div>

          {/* Left burgundy section - placed ABOVE the images */}
          <div
            className="absolute inset-y-0 left-0 right-0 bg-gradient-to-br from-burgundy via-plum to-burgundy z-10"
            style={{
              clipPath: 'polygon(0 0, 65% 0, 45% 100%, 0 100%)',
              animation: 'slideInLeft 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          />
        </div>

        {/* Content Container */}
        <div className="relative z-20 h-full max-w-[1600px] mx-auto px-6 lg:px-12 flex items-start lg:items-center pt-8 lg:pt-0">
          <div className="grid lg:grid-cols-2 gap-16 w-full items-start lg:items-center">

            {/* Left Content - Dark Side */}
            <div className="text-white space-y-6 md:space-y-8 max-w-3xl pr-4" style={{ animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}>
              {/* Decorative Accent */}
              <div className="flex items-center gap-2 md:gap-3 opacity-90">
                <div className="h-px w-8 md:w-12 bg-white/40" />
                <span className="text-[9px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] uppercase font-light whitespace-nowrap">Est. 2024</span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif font-bold leading-[1.1] tracking-tight">
                {/* Mobile: 3 lines */}
                <span className="block lg:hidden text-[28px] sm:text-[36px] whitespace-nowrap">World's Finest</span>
                <span className="block lg:hidden text-[28px] sm:text-[36px] whitespace-nowrap">Brands,</span>
                <span className="block lg:hidden text-[28px] sm:text-[36px] italic opacity-90 whitespace-nowrap">One Destination</span>

                {/* Desktop: 2 lines - Slightly reduced size */}
                <span className="hidden lg:block text-[56px] lg:text-[68px] xl:text-[84px] whitespace-nowrap">World's Finest Brands,</span>
                <span className="hidden lg:block text-[56px] lg:text-[68px] xl:text-[84px] italic opacity-90 whitespace-nowrap">One Destination</span>
              </h1>

              {/* Subheadline */}
              <div className="text-[11px] sm:text-[13px] md:text-base lg:text-lg xl:text-xl font-light leading-relaxed text-white/90">
                {/* Mobile: Multiple lines */}
                <p className="block lg:hidden whitespace-nowrap">Discover curated luxury</p>
                <p className="block lg:hidden whitespace-nowrap">from Rolex, Gucci, Prada,</p>
                <p className="block lg:hidden whitespace-nowrap">and the world's most</p>
                <p className="block lg:hidden whitespace-nowrap">prestigious houses</p>

                {/* Desktop: 2 lines */}
                <p className="hidden lg:block whitespace-nowrap">Discover curated luxury from Rolex, Gucci, Prada,</p>
                <p className="hidden lg:block whitespace-nowrap">and the world's most prestigious houses</p>
              </div>

              {/* CTA Button */}
              <div>
                <Button
                  asChild
                  size="lg"
                  className="group bg-white text-burgundy hover:bg-white/95 font-semibold text-xs sm:text-sm md:text-base px-5 py-4 sm:px-6 sm:py-5 md:px-10 md:py-7 rounded-none border-2 border-white shadow-2xl transition-all duration-500 hover:shadow-white/20"
                >
                  <Link href="/products" className="flex items-center gap-2 md:gap-3 whitespace-nowrap">
                    Explore Collection
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Link>
                </Button>
              </div>

              {/* Floating Stats */}
              <div className="flex gap-6 sm:gap-8 md:gap-12 pt-4 md:pt-8" style={{ animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.6s both' }}>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold">20+</div>
                  <div className="text-[10px] sm:text-xs md:text-sm opacity-75 tracking-wider">BRANDS</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-bold">100+</div>
                  <div className="text-[10px] sm:text-xs md:text-sm opacity-75 tracking-wider">PRODUCTS</div>
                </div>
              </div>
            </div>

            {/* Right Content - Empty space for background images */}
            <div className="relative h-full flex justify-end items-end pb-12" style={{ animation: 'fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) 0.5s both' }}>
              {/* Slide Indicators */}
              <div className="flex gap-2 z-10">
                {heroImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentSlide
                        ? 'w-12 bg-charcoal'
                        : 'w-2 bg-charcoal/40 hover:bg-charcoal/60'
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30" style={{ animation: 'fadeIn 1s ease 1.5s both' }}>
          <div className="flex flex-col items-center gap-2 animate-bounce">
            <span className="text-xs tracking-widest text-charcoal/60">SCROLL</span>
            <div className="w-px h-12 bg-gradient-to-b from-burgundy to-transparent" />
          </div>
        </div>
      </section>

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
                  <Link href="/brands" className="flex items-center gap-2">
                    Discover Our Brands
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
              href="/products?filter=deals"
              className="hidden md:flex items-center gap-2 text-white hover:text-gold-accent transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Product Card 1 */}
            <div className="group bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-gradient-to-br from-burgundy to-plum text-white text-xs font-bold px-3 py-1 rounded z-10">
                  -30%
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Gucci</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Leather Crossbody Bag</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-burgundy">$1,499</span>
                  <span className="text-sm text-gray-400 line-through">$2,140</span>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-gradient-to-br from-burgundy to-plum text-white text-xs font-bold px-3 py-1 rounded z-10">
                  -25%
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Rolex</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Oyster Perpetual Watch</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-burgundy">$5,999</span>
                  <span className="text-sm text-gray-400 line-through">$7,999</span>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-gradient-to-br from-burgundy to-plum text-white text-xs font-bold px-3 py-1 rounded z-10">
                  -40%
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Prada</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Saffiano Leather Wallet</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-burgundy">$420</span>
                  <span className="text-sm text-gray-400 line-through">$700</span>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group bg-white rounded-lg overflow-hidden hover:shadow-2xl transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-gradient-to-br from-burgundy to-plum text-white text-xs font-bold px-3 py-1 rounded z-10">
                  -35%
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Burberry</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Classic Trench Coat</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-burgundy">$1,299</span>
                  <span className="text-sm text-gray-400 line-through">$1,999</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/products?filter=deals"
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
              href="/products?filter=new"
              className="hidden md:flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 group"
            >
              <span className="font-medium">View All</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {/* Product Card 1 */}
            <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-burgundy transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded z-10">
                  NEW
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Chanel</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Classic Flap Shoulder Bag</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-charcoal">$8,500</span>
                </div>
              </div>
            </div>

            {/* Product Card 2 */}
            <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-burgundy transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded z-10">
                  NEW
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Louis Vuitton</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Neverfull MM Tote</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-charcoal">$2,150</span>
                </div>
              </div>
            </div>

            {/* Product Card 3 */}
            <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-burgundy transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded z-10">
                  NEW
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Cartier</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Love Bracelet</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-charcoal">$7,300</span>
                </div>
              </div>
            </div>

            {/* Product Card 4 */}
            <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl hover:border-burgundy transition-all duration-500">
              <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                <div className="absolute top-3 left-3 bg-charcoal text-white text-xs font-bold px-3 py-1 rounded z-10">
                  NEW
                </div>
                <img
                  src="/api/placeholder/400/500"
                  alt="Product"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Dior</p>
                <h3 className="text-sm md:text-base font-semibold text-charcoal mb-2 line-clamp-2">Lady Dior Handbag</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-charcoal">$5,500</span>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile View All Link */}
          <div className="mt-6 md:hidden text-center">
            <Link
              href="/products?filter=new"
              className="inline-flex items-center gap-2 text-burgundy hover:text-plum transition-colors duration-300 font-medium"
            >
              <span>View All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
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

      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          25% {
            transform: translateY(-20px) rotate(1deg);
          }
          50% {
            transform: translateY(-10px) rotate(-1deg);
          }
          75% {
            transform: translateY(-15px) rotate(0.5deg);
          }
        }

        @keyframes slideInLeft {
          from {
            transform: translateX(-100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }

        @keyframes fadeInUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
