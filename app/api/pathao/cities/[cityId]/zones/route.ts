import { NextResponse } from 'next/server'
import { getPathaoZones } from '@/lib/pathao'
import type { PathaoZone } from '@/types/pathao'

// In-memory cache: zones per city, refreshes every 24 hours
const zoneCache = new Map<number, { data: PathaoZone[]; timestamp: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface RouteParams {
  params: Promise<{ cityId: string }>
}

export async function GET(_request: Request, props: RouteParams) {
  try {
    const { cityId: cityIdStr } = await props.params
    const cityId = parseInt(cityIdStr, 10)

    if (isNaN(cityId) || cityId <= 0) {
      return NextResponse.json({ error: 'Invalid city ID' }, { status: 400 })
    }

    const now = Date.now()
    const cached = zoneCache.get(cityId)
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ zones: cached.data })
    }

    const zones = await getPathaoZones(cityId)
    zoneCache.set(cityId, { data: zones, timestamp: now })

    return NextResponse.json({ zones })
  } catch (error) {
    console.error('Error fetching Pathao zones:', error)
    return NextResponse.json(
      { error: 'Failed to fetch zones' },
      { status: 500 }
    )
  }
}
