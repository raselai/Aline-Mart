import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'
import { getApiUrl } from '@/lib/api-url'

// Force dynamic rendering for product pages
export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

async function fetchProduct(slug: string) {
  try {
    const apiUrl = getApiUrl(`/api/products/${slug}`)
    console.log('[fetchProduct] Fetching from:', apiUrl)

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      if (res.status === 404) return null
      throw new Error('Failed to fetch product')
    }

    const response = await res.json()
    // API returns { success: true, data: { product, relatedProducts } }
    return response.data?.product || null
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

async function fetchProductWithRelated(slug: string) {
  try {
    const apiUrl = getApiUrl(`/api/products/${slug}`)
    console.log('[fetchProductWithRelated] Fetching from:', apiUrl)

    const res = await fetch(apiUrl, {
      cache: 'no-store',
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      if (res.status === 404) return { product: null, relatedProducts: [] }
      throw new Error('Failed to fetch product')
    }

    const response = await res.json()
    // API returns { success: true, data: { product, relatedProducts } }
    return {
      product: response.data?.product || null,
      relatedProducts: response.data?.relatedProducts || []
    }
  } catch (error) {
    console.error('Error fetching product:', error)
    return { product: null, relatedProducts: [] }
  }
}

export async function generateMetadata(props: ProductPageProps): Promise<Metadata> {
  const params = await props.params
  const product = await fetchProduct(params.slug)

  if (!product) {
    return {
      title: 'Product Not Found | Aline Mart',
      description: 'The product you are looking for could not be found.',
    }
  }

  const imageUrl = product.images?.[0]?.url || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=630&fit=crop'
  const price = product.salePrice || product.price

  return {
    title: `${product.name} - ${product.brand?.name} | Aline Mart`,
    description: product.description || `Shop ${product.name} from ${product.brand?.name}. Premium luxury products with fast shipping.`,
    openGraph: {
      title: `${product.name} - ${product.brand?.name}`,
      description: product.description || `Shop ${product.name} from ${product.brand?.name}`,
      type: 'website',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} - ${product.brand?.name}`,
      description: product.description || `Shop ${product.name} from ${product.brand?.name}`,
      images: [imageUrl],
    },
  }
}

export default async function ProductPage(props: ProductPageProps) {
  const params = await props.params
  const { product, relatedProducts } = await fetchProductWithRelated(params.slug)

  if (!product) {
    notFound()
  }

  // Generate JSON-LD structured data for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images?.map((img: any) => img.url) || [],
    brand: {
      '@type': 'Brand',
      name: product.brand?.name,
    },
    offers: {
      '@type': 'Offer',
      price: product.salePrice || product.price,
      priceCurrency: 'USD',
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/products/${product.slug}`,
    },
    aggregateRating: product.rating
      ? {
          '@type': 'AggregateRating',
          ratingValue: product.rating,
          reviewCount: product.reviewCount || 0,
        }
      : undefined,
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-secondary">
            <a href="/" className="hover:text-charcoal transition-colors">
              Home
            </a>
            <span>/</span>
            <a href="/products" className="hover:text-charcoal transition-colors">
              Products
            </a>
            {product.category && (
              <>
                <span>/</span>
                <a
                  href={`/products?category=${product.category.slug}`}
                  className="hover:text-charcoal transition-colors"
                >
                  {product.category.name}
                </a>
              </>
            )}
            <span>/</span>
            <span className="text-charcoal font-medium">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Detail */}
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </>
  )
}
