'use client'

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

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

  // Swipe gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;

    const distance = touchStartX.current - touchEndX.current;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }

    if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);
    }

    // Reset
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  return (
    <section
      className="relative h-[70vh] min-h-[500px] lg:h-[100vh] lg:min-h-[700px] overflow-hidden bg-[#FAF9F6] mt-[64px] lg:mt-[108px]"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
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
        <div className="absolute inset-y-0 right-0 w-[55%] z-0">
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

      <style jsx>{`
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
    </section>
  );
}
