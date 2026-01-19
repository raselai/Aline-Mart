'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Search, Heart, User, ShoppingBag, Menu, MapPin, LogOut, Package, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet'
import { useCart } from '@/hooks/useCart'
import { useWishlist } from '@/hooks/useWishlist'
import type { Category } from '@/types'
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
  { name: 'Men', href: '/categories/men', categorySlug: 'men' },
  { name: 'Women', href: '/categories/women', categorySlug: 'women' },
  { name: 'Kids', href: '/categories/kids', categorySlug: 'kids' },
  { name: 'Homeware', href: '/categories/homeware', categorySlug: 'homeware' },
  { name: 'Beauty', href: '/categories/beauty', categorySlug: 'beauty' },
  { name: 'Brands', href: '/brands' },
  { name: 'Outlet', href: '/categories/outlet', categorySlug: 'outlet' },
  { name: 'Sports & Fitness', href: '/categories/sports', categorySlug: 'sports' },
]

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categories, setCategories] = useState<Category[]>([])
  const [openMobileMenus, setOpenMobileMenus] = useState<Record<string, boolean>>({})
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

  useEffect(() => {
    let isActive = true

    const loadCategories = async () => {
      try {
        const response = await fetch('/api/categories', { cache: 'no-store' })
        if (!response.ok) {
          throw new Error('Failed to fetch categories')
        }
        const result = await response.json()
        if (isActive) {
          setCategories(result.data?.all || [])
        }
      } catch (error) {
        console.error('Error loading categories:', error)
      }
    }

    loadCategories()

    return () => {
      isActive = false
    }
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) {
      setOpenMobileMenus({})
    }
  }, [isMobileMenuOpen])

  const categoriesBySlug = new Map(categories.map((category) => [category.slug, category]))
  const childrenByParentId = new Map<string, Category[]>()

  categories.forEach((category) => {
    if (!category.parentId) return
    const existing = childrenByParentId.get(category.parentId) || []
    existing.push(category)
    childrenByParentId.set(category.parentId, existing)
  })

  childrenByParentId.forEach((items, parentId) => {
    const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name))
    childrenByParentId.set(parentId, sorted)
  })

  const navItems = navigation.map((item) => {
    if (!item.categorySlug) {
      return { ...item, children: [] as Category[] }
    }

    const category = categoriesBySlug.get(item.categorySlug)
    const children = category ? childrenByParentId.get(category.id) || [] : []

    return { ...item, children }
  })

  const toggleMobileMenu = (name: string) => {
    setOpenMobileMenus((prev) => ({
      ...prev,
      [name]: !prev[name],
    }))
  }

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
      {/* Utility Bar - Top Links */}
      <div className="w-full bg-gradient-to-r from-burgundy to-plum">
        <div className="w-full px-4 sm:px-6 lg:px-12">
          <div className="flex items-center justify-end gap-4 sm:gap-6 lg:gap-8 py-2">
            <Link
              href="/about"
              className="text-white text-xs sm:text-sm font-medium hover:text-white/80 transition-colors duration-200"
            >
              About us
            </Link>
            <Link
              href="/account"
              className="text-white text-xs sm:text-sm font-medium hover:text-white/80 transition-colors duration-200"
            >
              My account
            </Link>
            <Link
              href="/wishlist"
              className="text-white text-xs sm:text-sm font-medium hover:text-white/80 transition-colors duration-200 flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4" strokeWidth={1.5} />
              <span>Wishlist</span>
              {wishlistItemCount > 0 && (
                <span className="ml-1 bg-white/20 text-white text-[10px] sm:text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                  {wishlistItemCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

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
                      {navItems.map((item) => {
                        const hasChildren = item.children.length > 0
                        const isOpen = Boolean(openMobileMenus[item.name])

                        return (
                          <div key={item.name} className="border-b-2 border-gray-200">
                            <div className="flex items-center justify-between py-4 px-2">
                              <Link
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="text-lg font-medium text-charcoal hover:text-burgundy transition-colors"
                              >
                                {item.name}
                              </Link>
                              {hasChildren && (
                                <button
                                  type="button"
                                  onClick={() => toggleMobileMenu(item.name)}
                                  aria-expanded={isOpen}
                                  aria-label={`${item.name} sub menu`}
                                  className="p-1 text-charcoal hover:text-burgundy transition-colors"
                                >
                                  <ChevronDown
                                    className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                  />
                                </button>
                              )}
                            </div>
                            {hasChildren && isOpen && (
                              <div className="pb-4 pl-4">
                                {item.children.map((child) => (
                                  <Link
                                    key={child.id}
                                    href={`/categories/${child.slug}`}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="block py-2 text-sm text-charcoal/80 hover:text-burgundy transition-colors"
                                  >
                                    {child.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        )
                      })}
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
            {navItems.map((item) => {
              const hasChildren = item.children.length > 0

              if (!hasChildren) {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-4 py-3 text-white text-[11.5px] uppercase tracking-[0.08em] font-semibold hover:text-white/80 transition-colors duration-300 group whitespace-nowrap"
                  >
                    {item.name}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                  </Link>
                )
              }

              return (
                <div key={item.name} className="relative group">
                  <Link
                    href={item.href}
                    className="relative flex items-center gap-1 px-4 py-3 text-white text-[11.5px] uppercase tracking-[0.08em] font-semibold hover:text-white/80 transition-colors duration-300 whitespace-nowrap"
                  >
                    {item.name}
                    <ChevronDown className="w-3.5 h-3.5" />
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300" />
                  </Link>
                  <div className="absolute left-0 top-full pt-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200">
                    <div className="bg-white border border-gray-200 shadow-xl min-w-[220px] py-3">
                      {item.children.map((child) => (
                        <Link
                          key={child.id}
                          href={`/categories/${child.slug}`}
                          className="block px-4 py-2 text-sm text-charcoal hover:text-burgundy hover:bg-gray-50 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}
          </nav>
        </div>
      </div>
    </header>
  )
}
