'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Facebook, Twitter, Youtube, Mail, MapPin, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

const footerLinks = {
  shop: [
    { name: 'New Arrivals', href: '/products?filter=new' },
    { name: 'Brands', href: '/brands' },
    { name: 'Sale', href: '/products?filter=sale' },
    { name: 'Gift Cards', href: '/gift-cards' },
  ],
  help: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Shipping & Returns', href: '/shipping-returns' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'Contact Us', href: '/contact' },
  ],
  company: [
    { name: 'About Aline Mart', href: '/about' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Careers', href: '/careers' },
  ],
}

const socialLinks = [
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com' },
  { name: 'Facebook', icon: Facebook, href: 'https://facebook.com' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // TODO: Implement newsletter signup
    await new Promise(resolve => setTimeout(resolve, 1000))

    setEmail('')
    setIsSubmitting(false)
  }

  return (
    <footer className="bg-white border-t border-gray-200">
      {/* Newsletter Section - Premium Band */}
      <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 via-white to-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left: Newsletter Heading */}
            <div>
              <div className="inline-block mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-burgundy to-plum mb-4" />
              </div>
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-charcoal mb-3">
                Stay in the loop
              </h3>
              <p className="text-gray-600 text-sm md:text-base">
                Subscribe for exclusive access to new arrivals, private sales, and insider updates from the world of luxury
              </p>
            </div>

            {/* Right: Newsletter Form */}
            <div>
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-300 text-charcoal placeholder:text-gray-400 focus:outline-none focus:border-burgundy transition-colors text-sm md:text-base"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="group bg-gradient-to-r from-burgundy to-plum text-white hover:opacity-90 transition-all duration-300 px-8 py-4 font-semibold whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  <ArrowRight className="w-4 h-4 ml-2 inline-block group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-3">
                By subscribing, you agree to our Privacy Policy. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12">
          {/* Brand Column */}
          <div className="col-span-2">
            <Link href="/" className="inline-block mb-6">
              <Image
                src="/Logo.png"
                alt="Aline Mart"
                width={220}
                height={78}
                className="h-16 md:h-20 w-auto"
              />
            </Link>
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-600">
                <MapPin className="w-5 h-5 text-burgundy flex-shrink-0 mt-0.5" />
                <span>123 Luxury Avenue, Fashion District, NY 10001</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Phone className="w-5 h-5 text-burgundy flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Mail className="w-5 h-5 text-burgundy flex-shrink-0" />
                <span>hello@alinemart.com</span>
              </div>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h4 className="text-charcoal font-serif font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-burgundy after:to-plum">
              Shop
            </h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-burgundy transition-colors duration-300 text-sm group inline-flex items-center"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h4 className="text-charcoal font-serif font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-burgundy after:to-plum">
              Help
            </h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-burgundy transition-colors duration-300 text-sm group inline-flex items-center"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-charcoal font-serif font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-burgundy after:to-plum">
              Company
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-600 hover:text-burgundy transition-colors duration-300 text-sm group inline-flex items-center"
                  >
                    <span className="group-hover:translate-x-1 transition-transform inline-block">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links Column */}
          <div>
            <h4 className="text-charcoal font-serif font-bold text-lg mb-5 relative inline-block after:content-[''] after:absolute after:left-0 after:bottom-0 after:w-8 after:h-0.5 after:bg-gradient-to-r after:from-burgundy after:to-plum">
              Follow Us
            </h4>
            <div className="flex flex-wrap gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="w-10 h-10 border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-burgundy hover:text-burgundy hover:bg-burgundy/5 transition-all duration-300"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-gray-50">
        <div className="max-w-[1600px] mx-auto px-6 lg:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            {/* Copyright */}
            <p className="text-gray-600">
              © {new Date().getFullYear()} Aline Mart. All rights reserved.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="text-gray-600 font-medium">Secure Payment:</span>
              <div className="flex items-center gap-2">
                <div className="bg-white border-2 border-gray-300 px-3 py-1.5 text-xs font-bold text-charcoal">
                  VISA
                </div>
                <div className="bg-white border-2 border-gray-300 px-3 py-1.5 text-xs font-bold text-charcoal">
                  MASTERCARD
                </div>
                <div className="bg-white border-2 border-gray-300 px-3 py-1.5 text-xs font-bold text-charcoal">
                  AMEX
                </div>
                <div className="bg-white border-2 border-gray-300 px-3 py-1.5 text-xs font-bold text-charcoal">
                  PAYPAL
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
