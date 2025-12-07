import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { ProductGrid } from '@/components/products'

interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
}

interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  salePrice?: number
  inStock: boolean
  isNew: boolean
  brand: {
    id: string
    name: string
    slug: string
  }
  category: {
    id: string
    name: string
    slug: string
  }
  images: Array<{
    url: string
    alt?: string
  }>
  variants?: Array<{
    id: string
    color?: string
    size?: string
    sku: string
    stock: number
  }>
}

async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const { data, error } = await supabase
    .from('Brand')
    .select('id, name, slug, description, logo')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching brand:', error)
    return null
  }

  return data
}

async function getProductsByBrand(brandId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Product')
    .select(`
      id,
      name,
      slug,
      description,
      price,
      salePrice,
      inStock,
      isNew,
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
      )
    `)
    .eq('brandId', brandId)
    .eq('inStock', true)
    .order('isNew', { ascending: false })
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  // Sort images by order and transform brand/category from arrays to objects
  return (data || []).map((product: any) => ({
    ...product,
    brand: Array.isArray(product.brand) ? product.brand[0] : product.brand,
    category: Array.isArray(product.category) ? product.category[0] : product.category,
    salePrice: product.salePrice || undefined,
    images: (product.images || [])
      .sort((a: any, b: any) => a.order - b.order)
      .map((img: any) => ({
        url: img.url,
        alt: img.alt || undefined
      }))
  })) as Product[]
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const params = await props.params
  const brand = await getBrandBySlug(params.slug)

  if (!brand) {
    return {
      title: 'Brand Not Found | Aline Mart',
    }
  }

  return {
    title: `${brand.name} | Luxury Brand | Aline Mart`,
    description: brand.description || `Shop luxury products from ${brand.name}`,
    openGraph: {
      title: `${brand.name} | Aline Mart`,
      description: brand.description || `Shop luxury products from ${brand.name}`,
    },
  }
}

export default async function BrandPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const brand = await getBrandBySlug(params.slug)

  if (!brand) {
    notFound()
  }

  const products = await getProductsByBrand(brand.id)

  return (
    <div className="min-h-screen bg-light-gray pt-24 lg:pt-32">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 lg:px-12 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-burgundy transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/brands" className="hover:text-burgundy transition-colors">
              Brands
            </Link>
            <span>/</span>
            <span className="text-charcoal font-medium">{brand.name}</span>
          </nav>
        </div>
      </div>

      {/* Brand Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 lg:px-12 py-12">
          <Link
            href="/brands"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-burgundy transition-colors mb-6 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to all brands</span>
          </Link>

          <div className="max-w-4xl mx-auto text-center">
            <h1 className="font-serif text-4xl lg:text-5xl font-bold text-charcoal mb-4">
              {brand.name}
            </h1>
            {brand.description && (
              <p className="text-lg text-gray-600 leading-relaxed line-clamp-2 mx-auto max-w-3xl">
                {brand.description}
              </p>
            )}
            <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-600">
              <span>{products.length} {products.length === 1 ? 'product' : 'products'} available</span>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 lg:px-12 py-12">
        {products.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No products available from {brand.name} at the moment.
            </p>
            <Link
              href="/brands"
              className="inline-block px-6 py-3 gradient-primary text-white rounded font-medium hover:opacity-90 transition-opacity"
            >
              Browse Other Brands
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                {brand.name} Products
              </h2>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  )
}
