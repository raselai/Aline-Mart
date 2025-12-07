'use client'

import { useEffect, useState } from 'react'

export default function TestAPIPage() {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function testAPIs() {
      setLoading(true)
      const tests: any = {}

      // Test brands
      try {
        const res = await fetch('/api/brands')
        tests.brands = await res.json()
      } catch (e: any) {
        tests.brands = { error: e.message }
      }

      // Test categories
      try {
        const res = await fetch('/api/categories')
        tests.categories = await res.json()
      } catch (e: any) {
        tests.categories = { error: e.message }
      }

      // Test products
      try {
        const res = await fetch('/api/products?limit=5')
        tests.products = await res.json()
      } catch (e: any) {
        tests.products = { error: e.message }
      }

      // Test single product
      try {
        const res = await fetch('/api/products/rolex-submariner-date')
        tests.singleProduct = await res.json()
      } catch (e: any) {
        tests.singleProduct = { error: e.message }
      }

      setResults(tests)
      setLoading(false)
    }

    testAPIs()
  }, [])

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Testing API Routes...</h1>
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">🧪 API Test Results</h1>

      {/* Brands Test */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          1. Brands API {results.brands?.success ? '✅' : '❌'}
        </h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(results.brands, null, 2)}
        </pre>
      </div>

      {/* Categories Test */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          2. Categories API {results.categories?.success ? '✅' : '❌'}
        </h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
          {JSON.stringify(results.categories, null, 2)}
        </pre>
      </div>

      {/* Products Test */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          3. Products API {results.products?.success ? '✅' : '❌'}
        </h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-96">
          {JSON.stringify(results.products, null, 2)}
        </pre>
      </div>

      {/* Single Product Test */}
      <div className="mb-8 p-6 border rounded-lg">
        <h2 className="text-xl font-bold mb-4">
          4. Single Product API {results.singleProduct?.success ? '✅' : '❌'}
        </h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm max-h-96">
          {JSON.stringify(results.singleProduct, null, 2)}
        </pre>
      </div>
    </div>
  )
}
