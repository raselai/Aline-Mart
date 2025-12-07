'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Heart, User, ShoppingBag, Menu, MapPin, LogOut, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
// Temporarily disabled until authentication is fully configured
// import { useSession, signIn, signOut } from 'next-auth/react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Men', href: '/categories/men' },
  { name: 'Women', href: '/categories/women' },
  { name: 'Kids', href: '/categories/kids' },
  { name: 'Homeware', href: '/categories/homeware' },
  { name: 'Beauty', href: '/categories/beauty' },
  { name: 'Brands', href: '/brands' },
  { name: 'Outlet', href: '/categories/outlet' },
  { name: 'Sports & Fitness', href: '/categories/sports' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  // Get cart and wishlist counts
  const { itemCount: cartItemCount } = useCart()
  const { itemCount: wishlistItemCount } = useWishlist()

  // Get session - temporarily disabled
  // const { data: session, status } = useSession()
  const session: any = null
  const status = 'unauthenticated' as 'loading' | 'authenticated' | 'unauthenticated'

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle search submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery('') // Clear search after submit
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'shadow-sm' : ''
      }`}
    >
      {/* Top Tier - Primary Header Bar */}
      <div className="bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-between py-1 lg:py-1">
            {/* Left: Logo */}
            <div className="flex-shrink-0 lg:w-[180px]">
              <Link href="/" className="flex items-center">
                <Image
                  src="/Logo.png"
                  alt="Aline Mart"
                  width={240}
                  height={72}
                  className="h-14 lg:h-20 w-auto"
                  priority
                />
              </Link>
            </div>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-[600px] mx-6">
              <form onSubmit={handleSearch} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-gray-400" strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search product or brand"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 border border-gray-300 rounded text-[14px] text-charcoal placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:border-gray-400 transition-colors"
                />
              </form>
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

              {/* Desktop: User Account / Sign In */}
              {status === 'loading' ? (
                <div className="hidden lg:block w-[22px] h-[22px]" />
              ) : session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      aria-label="Account"
                      className="hidden lg:flex items-center gap-2 hover:opacity-70 transition-opacity duration-200"
                    >
                      {session.user?.image ? (
                        <Image
                          src={session.user.image}
                          alt={session.user.name || 'User'}
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <User className="w-[22px] h-[22px] text-charcoal" strokeWidth={1.5} />
                      )}
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{session.user?.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {session.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders" className="flex items-center cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        <span>My Orders</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {/* signOut() - disabled */}}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  onClick={() => {/* signIn('google') - disabled */}}
                  variant="ghost"
                  size="sm"
                  className="hidden lg:inline-flex text-xs font-medium px-3 py-1 h-auto"
                >
                  Sign In
                </Button>
              )}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="hidden sm:block hover:opacity-70 transition-opacity duration-200 relative"
              >
                <Heart className="w-5 h-5 lg:w-[22px] lg:h-[22px] text-charcoal" strokeWidth={1.5} />
                {wishlistItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistItemCount}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                aria-label="Shopping Cart"
                className="hover:opacity-70 transition-opacity duration-200 relative"
              >
                <ShoppingBag className="w-5 h-5 lg:w-[22px] lg:h-[22px] text-charcoal" strokeWidth={1.5} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-burgundy text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
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
                          src="/Logo.png"
                          alt="Aline Mart"
                          width={160}
                          height={57}
                          className="h-14 w-auto"
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
                      {session ? (
                        <>
                          <div className="flex items-center space-x-3 py-2">
                            {session.user?.image && (
                              <Image
                                src={session.user.image}
                                alt={session.user.name || 'User'}
                                width={32}
                                height={32}
                                className="rounded-full"
                              />
                            )}
                            <div>
                              <p className="font-medium text-charcoal">{session.user?.name}</p>
                              <p className="text-xs text-gray-500">{session.user?.email}</p>
                            </div>
                          </div>
                          <Link
                            href="/account/orders"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                          >
                            <Package className="w-5 h-5" />
                            <span className="font-medium">My Orders</span>
                          </Link>
                          <button
                            onClick={() => {
                              // signOut() - disabled
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center space-x-3 text-red-600 hover:text-red-700 transition-colors py-2"
                          >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Sign Out</span>
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => {
                            // signIn('google') - disabled
                            setIsMobileMenuOpen(false)
                          }}
                          className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                        >
                          <User className="w-5 h-5" />
                          <span className="font-medium">Sign In with Google</span>
                        </button>
                      )}
                      <Link
                        href="/wishlist"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                      >
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">Wishlist ({wishlistItemCount})</span>
                      </Link>
                      <Link
                        href="/cart"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-charcoal hover:text-burgundy transition-colors py-2"
                      >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-medium">Cart ({cartItemCount})</span>
                      </Link>
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
