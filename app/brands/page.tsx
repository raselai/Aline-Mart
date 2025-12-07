import { supabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Luxury Brands | Aline Mart',
  description: 'Shop luxury products from the world\'s most prestigious brands',
  openGraph: {
    title: 'Luxury Brands | Aline Mart',
    description: 'Shop luxury products from the world\'s most prestigious brands',
  },
}

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  productCount?: number
}

async function getBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('Brand')
      .select('id, name, slug, description, logo')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching brands:', error)
      return []
    }

    if (!data || data.length === 0) {
      console.log('No brands found in database')
      return []
    }

    console.log(`Found ${data.length} brands`)

    // Get product count for each brand
    const brandsWithCounts = await Promise.all(
      data.map(async (brand) => {
        const { count } = await supabase
          .from('Product')
          .select('*', { count: 'exact', head: true })
          .eq('brandId', brand.id)
          .eq('inStock', true)

        return {
          ...brand,
          productCount: count || 0
        }
      })
    )

    return brandsWithCounts
  } catch (err) {
    console.error('Exception fetching brands:', err)
    return []
  }
}

export default async function BrandsPage() {
  const brands = await getBrands()

  return (
    <div className="min-h-screen bg-white pt-24 lg:pt-32">
      {/* Page Header */}
      <div className="container mx-auto px-4 lg:px-12 py-12 border-b border-gray-200">
        <div className="text-center">
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mb-6">
            Luxury Brands
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed mx-auto" style={{ maxWidth: '800px' }}>
            Discover our curated collection of the world&apos;s most prestigious luxury brands. Each brand represents decades of craftsmanship, heritage, and timeless style.
          </p>
        </div>
      </div>

      {/* Brands Grid */}
      <div className="container mx-auto px-4 lg:px-12 py-12">
        {brands.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-600 text-lg">No brands available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/brands/${brand.slug}`}
                className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-burgundy hover:shadow-lg transition-all duration-300"
              >
                {/* Brand Logo/Image */}
                <div className="aspect-square bg-light-gray flex items-center justify-center p-8 relative overflow-hidden">
                  {brand.logo ? (
                    <Image
                      src={brand.logo}
                      alt={brand.name}
                      fill
                      className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="text-center">
                      <h3 className="font-serif text-2xl font-bold text-charcoal group-hover:text-burgundy transition-colors">
                        {brand.name}
                      </h3>
                    </div>
                  )}
                </div>

                {/* Brand Info */}
                <div className="p-4 border-t border-gray-100">
                  <h3 className="font-semibold text-charcoal mb-1 group-hover:text-burgundy transition-colors">
                    {brand.name}
                  </h3>
                  {brand.productCount !== undefined && (
                    <p className="text-sm text-gray-500">
                      {brand.productCount} {brand.productCount === 1 ? 'product' : 'products'}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Bottom CTA */}
      <div className="container mx-auto px-4 lg:px-12 py-16 border-t border-gray-200">
        <div className="text-center">
          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-6">
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed mx-auto" style={{ maxWidth: '600px' }}>
            Browse our entire collection of luxury products or use the search bar above
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 gradient-primary text-white rounded font-medium hover:opacity-90 transition-opacity"
          >
            Browse All Products
          </Link>
        </div>
      </div>
    </div>
  )
}
