import { supabase } from '@/lib/supabase'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductGrid } from '@/components/products'

interface Category {
  id: string
  name: string
  slug: string
  parentId: string | null
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

interface CategoryBanner {
  id: string
  imageUrl: string
  title: string | null
  subtitle: string | null
  linkUrl: string | null
}

async function getCategoryBanner(categoryId: string): Promise<CategoryBanner | null> {
  const { data, error } = await supabase
    .from('CategoryBanner')
    .select('id, imageUrl, title, subtitle, linkUrl')
    .eq('categoryId', categoryId)
    .eq('isActive', true)
    .single()

  if (error || !data) return null
  return data
}

async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const { data, error } = await supabase
    .from('Category')
    .select('id, name, slug, parentId')
    .eq('slug', slug)
    .single()

  if (error || !data) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
}

async function getSubcategories(categoryId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('Category')
    .select('id, name, slug, parentId')
    .eq('parentId', categoryId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching subcategories:', error)
    return []
  }

  return data || []
}

async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  // Get all subcategories for this category
  const { data: subcategories } = await supabase
    .from('Category')
    .select('id')
    .eq('parentId', categoryId)

  // Build category IDs array (include current category + all subcategories)
  const categoryIds = [categoryId]
  if (subcategories && subcategories.length > 0) {
    categoryIds.push(...subcategories.map(sub => sub.id))
  }

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
    .in('categoryId', categoryIds)
    .eq('inStock', true)
    .or('status.is.null,status.eq.ACTIVE')
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
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    return {
      title: 'Category Not Found | Aline Mart',
    }
  }

  return {
    title: `${category.name} | Luxury Products | Aline Mart`,
    description: `Shop luxury ${category.name.toLowerCase()} products from the world's most prestigious brands`,
    openGraph: {
      title: `${category.name} | Aline Mart`,
      description: `Shop luxury ${category.name.toLowerCase()} products from the world's most prestigious brands`,
    },
  }
}

export default async function CategoryPage(
  props: { params: Promise<{ slug: string }> }
) {
  const params = await props.params
  const category = await getCategoryBySlug(params.slug)

  if (!category) {
    notFound()
  }

  const [products, subcategories, banner] = await Promise.all([
    getProductsByCategory(category.id),
    getSubcategories(category.id),
    getCategoryBanner(category.id)
  ])

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
            <Link href="/products" className="hover:text-burgundy transition-colors">
              Products
            </Link>
            <span>/</span>
            <span className="text-charcoal font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Banner */}
      {banner && (() => {
        const bannerContent = (
          <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/1' }}>
            <img
              src={banner.imageUrl}
              alt={banner.title || `${category.name} banner`}
              className="w-full h-full object-cover"
            />
            {(banner.title || banner.subtitle) && (
              <div className="absolute inset-0 flex flex-col justify-end p-6 lg:p-12"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)' }}
              >
                {banner.title && (
                  <h2 className="font-serif text-2xl lg:text-4xl font-bold text-white mb-2">
                    {banner.title}
                  </h2>
                )}
                {banner.subtitle && (
                  <p className="text-white/90 text-sm lg:text-lg max-w-2xl">
                    {banner.subtitle}
                  </p>
                )}
              </div>
            )}
          </div>
        )

        return banner.linkUrl ? (
          <Link href={banner.linkUrl} className="block hover:opacity-95 transition-opacity">
            {bannerContent}
          </Link>
        ) : bannerContent
      })()}

      {/* Subcategories (if any) */}
      {subcategories.length > 0 && (
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 lg:px-12 py-8">
            <h2 className="font-semibold text-charcoal mb-4">Shop by Category</h2>
            <div className="flex flex-wrap gap-3">
              {subcategories.map((subcategory) => (
                <Link
                  key={subcategory.id}
                  href={`/categories/${subcategory.slug}`}
                  className="px-4 py-2 bg-light-gray border border-gray-300 rounded-full hover:border-burgundy hover:text-burgundy transition-colors text-sm font-medium"
                >
                  {subcategory.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Section */}
      <div className="container mx-auto px-4 lg:px-12 py-12">
        {products.length === 0 ? (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-600 text-lg mb-4">
              No products available in {category.name} at the moment.
            </p>
            <Link
              href="/products"
              className="inline-block px-6 py-3 gradient-primary text-white rounded font-medium hover:opacity-90 transition-opacity"
            >
              Browse All Products
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-charcoal">
                {category.name} Products
              </h2>
            </div>
            <ProductGrid products={products} />
          </>
        )}
      </div>
    </div>
  )
}
