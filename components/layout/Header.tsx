'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Heart, User, ShoppingBag, Menu, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'

const navigation = [
  { name: 'Men', href: '/products?category=men' },
  { name: 'Women', href: '/products?category=women' },
  { name: 'Kids', href: '/products?category=kids' },
  { name: 'Homeware', href: '/products?category=homeware' },
  { name: 'Beauty', href: '/products?category=beauty' },
  { name: 'Brands', href: '/brands' },
  { name: 'Outlet', href: '/products?filter=outlet' },
  { name: 'Sports & Fitness', href: '/products?category=sports' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Top Tier - Primary Header Bar */}
      <div className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between py-3 lg:py-4">
            {/* Left: Logo */}
            <div className="flex-shrink-0 lg:w-[180px]">
              <Link href="/" className="flex items-center">
                <Image
                  src="/12.jpg"
                  alt="Aline Mart"
                  width={200}
                  height={60}
                  className="h-10 lg:h-14 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-[600px] mx-6">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search product or brand"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded text-[14px] text-charcoal placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
              </div>
            </div>

            {/* Right: Utility Icons */}
            <div className="flex items-center justify-end lg:w-[180px] gap-3 sm:gap-4 lg:gap-5">
              {/* Mobile: Search Icon */}
              <button
                aria-label="Search"
                className="lg:hidden hover:opacity-70 transition-opacity duration-200"
              >
                <Search className="w-5 h-5 text-charcoal" strokeWidth={1.5} />
              </button>

              {/* Desktop Icons */}
              <button
                aria-label="Location"
                className="hidden lg:block hover:opacity-70 transition-opacity duration-200"
              >
                <MapPin className="w-[22px] h-[22px] text-charcoal" strokeWidth={1.5} />
              </button>
              <Link
                href="/account"
                aria-label="Account"
                className="hidden lg:block hover:opacity-70 transition-opacity duration-200"
              >
                <User className="w-[22px] h-[22px] text-charcoal" strokeWidth={1.5} />
              </Link>
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden sm:block hover:opacity-70 transition-opacity duration-200"
              >
                <Heart className="w-5 h-5 lg:w-[22px] lg:h-[22px] text-charcoal" strokeWidth={1.5} />
              </Link>
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="hover:opacity-70 transition-opacity duration-200 relative"
              >
                <ShoppingBag className="w-5 h-5 lg:w-[22px] lg:h-[22px] text-charcoal" strokeWidth={1.5} />
              </Link>

              {/* Mobile Menu Toggle */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" aria-label="Menu" className="p-0 h-auto hover:bg-transparent">
                    <Menu className="w-6 h-6 text-charcoal" strokeWidth={1.5} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:w-[400px]">
                  <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                  <div className="flex flex-col h-full">
                    {/* Mobile Logo */}
                    <div className="flex items-center justify-between mb-8">
                      <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Image
                          src="/12.jpg"
                          alt="Aline Mart"
                          width={120}
                          height={43}
                          className="h-10 w-auto"
                        />
                      </Link>
                    </div>

                    {/* Mobile Search */}
                    <div className="mb-6">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search..."
                          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    </div>

                    {/* Mobile Navigation */}
                    <nav className="flex flex-col mb-8">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-lg font-medium text-charcoal hover:text-burgundy transition-colors py-4 px-2 border-b-2 border-gray-200"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    {/* Mobile Icons */}
                    <div className="flex flex-col space-y-4 pt-4 border-t border-light-gray">
                      <Link
                        href="/account"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                      >
                        <User className="w-5 h-5" />
                        <span className="font-medium">Account</span>
                      </Link>
                      <Link
                        href="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Wishlist</span>
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Cart (0)</span>
                      </Link>
                    </div>

                    {/* Mobile CTA */}
                    <div className="mt-auto pt-6 border-t border-light-gray">
                      <Button className="w-full gradient-primary text-white hover:opacity-90 transition-opacity">
                        Sign In
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Tier - Navigation Menu Bar */}
      <div className="hidden lg:block bg-burgundy">
        <div className="w-full">
          <nav className="flex items-center justify-center">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="relative px-4 py-3 text-white text-[11.5px] uppercase tracking-[0.08em] font-semibold hover:text-white/80 transition-colors duration-300 group whitespace-nowrap"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
