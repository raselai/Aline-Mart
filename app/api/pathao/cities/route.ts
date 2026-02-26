import { NextResponse } from 'next/server'
import { getPathaoCities } from '@/lib/pathao'
import type { PathaoCity } from '@/types/pathao'

// In-memory cache: cities list refreshes every 24 hours
let cachedCities: PathaoCity[] | null = null
let cacheTimestamp = 0
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

export async function GET() {
  try {
    const now = Date.now()
    if (cachedCities && now - cacheTimestamp < CACHE_TTL_MS) {
      return NextResponse.json({ cities: cachedCities })
    }

    const cities = await getPathaoCities()
    cachedCities = cities
    cacheTimestamp = now

    return NextResponse.json({ cities })
  } catch (error) {
    console.error('Error fetching Pathao cities:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cities' },
      { status: 500 }
    )
  }
}
