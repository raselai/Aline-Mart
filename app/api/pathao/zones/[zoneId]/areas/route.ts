import { NextResponse } from 'next/server'
import { getPathaoAreas } from '@/lib/pathao'
import type { PathaoArea } from '@/types/pathao'

// In-memory cache: areas per zone, refreshes every 24 hours
const areaCache = new Map<number, { data: PathaoArea[]; timestamp: number }>()
const CACHE_TTL_MS = 24 * 60 * 60 * 1000

interface RouteParams {
  params: Promise<{ zoneId: string }>
}

export async function GET(_request: Request, props: RouteParams) {
  try {
    const { zoneId: zoneIdStr } = await props.params
    const zoneId = parseInt(zoneIdStr, 10)

    if (isNaN(zoneId) || zoneId <= 0) {
      return NextResponse.json({ error: 'Invalid zone ID' }, { status: 400 })
    }

    const now = Date.now()
    const cached = areaCache.get(zoneId)
    if (cached && now - cached.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({ areas: cached.data })
    }

    const areas = await getPathaoAreas(zoneId)
    areaCache.set(zoneId, { data: areas, timestamp: now })

    return NextResponse.json({ areas })
  } catch (error) {
    console.error('Error fetching Pathao areas:', error)
    return NextResponse.json(
      { error: 'Failed to fetch areas' },
      { status: 500 }
    )
  }
}
