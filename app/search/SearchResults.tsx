'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Search, ArrowRight } from 'lucide-react'
import { ProductGrid } from '@/components/products'

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
}

interface SearchResponse {
  products: Product[]
  total: number
  page: number
  limit: number
  query: string
}

export default function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [results, setResults] = useState<SearchResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults(null)
        setLoading(false)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
        if (!response.ok) throw new Error('Failed to search')

        const data: SearchResponse = await response.json()
        setResults(data)
      } catch (err) {
        setError('Failed to load search results. Please try again.')
        console.error('Search error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchResults()
  }, [query])

  // No query state
  if (!query.trim()) {
    return (
      <div className="container mx-auto px-4 lg:px-12 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <Search className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-serif text-3xl font-bold text-charcoal mb-4">
            Search Aline Mart
          </h1>
          <p className="text-gray-600 mb-8">
            Enter a product name, brand, or category to find what you're looking for
          </p>
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <Link
              href="/products"
              className="px-6 py-3 bg-white border border-gray-300 rounded hover:border-gray-400 transition-colors text-charcoal font-medium"
            >
              Browse All Products
            </Link>
            <Link
              href="/brands"
              className="px-6 py-3 gradient-primary text-white rounded hover:opacity-90 transition-opacity font-medium"
            >
              Explore Brands
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 lg:px-12 py-8">
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal">
            Searching for "{query}"...
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-lg overflow-hidden animate-pulse">
              <div className="aspect-[3/4] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 lg:px-12 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-serif text-2xl font-bold text-charcoal mb-4">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 gradient-primary text-white rounded hover:opacity-90 transition-opacity font-medium"
          >
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // No results state
  if (results && results.total === 0) {
    return (
      <div className="container mx-auto px-4 lg:px-12 py-12">
        <div className="mb-8">
          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-2">
            No results for "{query}"
          </h1>
          <p className="text-gray-600">
            We couldn't find any products matching your search
          </p>
        </div>

        <div className="max-w-2xl">
          <h2 className="font-semibold text-lg text-charcoal mb-4">Try these instead:</h2>
          <ul className="space-y-2 mb-8">
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
              Check your spelling
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
              Try more general keywords
            </li>
            <li className="flex items-center gap-2 text-gray-700">
              <span className="w-1.5 h-1.5 bg-burgundy rounded-full" />
              Browse by category or brand instead
            </li>
          </ul>

          <div className="flex gap-4">
            <Link
              href="/products"
              className="px-6 py-3 bg-white border border-gray-300 rounded hover:border-gray-400 transition-colors text-charcoal font-medium"
            >
              Browse All Products
            </Link>
            <Link
              href="/brands"
              className="px-6 py-3 gradient-primary text-white rounded hover:opacity-90 transition-opacity font-medium"
            >
              Explore Brands
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Results found
  return (
    <div className="container mx-auto px-4 lg:px-12 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <h1 className="font-serif text-2xl lg:text-3xl font-bold text-charcoal mb-2">
          Search Results
        </h1>
        <p className="text-gray-600">
          {results?.total || 0} {results?.total === 1 ? 'result' : 'results'} for "{query}"
        </p>
      </div>

      {/* Product Grid */}
      {results && results.products.length > 0 && (
        <ProductGrid products={results.products} />
      )}
    </div>
  )
}
