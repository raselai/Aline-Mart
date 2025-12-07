import { Suspense } from 'react'
import type { Metadata } from 'next'
import SearchResults from './SearchResults'

export const metadata: Metadata = {
  title: 'Search Results | Aline Mart',
  description: 'Find luxury products from top brands',
}

export default function SearchPage() {
  return (
    <div className="min-h-screen bg-light-gray pt-24 lg:pt-32">
      <Suspense fallback={<div className="container mx-auto px-4 py-8">Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  )
}
