/**
 * Pathao Courier Merchant API Client
 * Server-side only — handles OAuth2 token management and all API interactions.
 */

import { supabase } from './supabase'
import type {
  PathaoStoredToken,
  PathaoTokenResponse,
  PathaoCityListResponse,
  PathaoZoneListResponse,
  PathaoAreaListResponse,
  PathaoStoreListResponse,
  PathaoCreateOrderRequest,
  PathaoCreateOrderResponse,
  PathaoOrderInfoResponse,
  PathaoPriceEstimateRequest,
  PathaoPriceEstimateResponse,
  PathaoCity,
  PathaoZone,
  PathaoArea,
  PathaoOrderStatus,
} from '@/types/pathao'
import type { ShippingStatus } from '@/types/order'

const SETTINGS_KEY = 'pathao_token'
const TOKEN_EXPIRY_BUFFER_MS = 5 * 60 * 1000 // 5 minutes

function getBaseUrl(): string {
  return process.env.PATHAO_BASE_URL || 'https://courier-api-sandbox.pathao.com'
}

function getCredentials() {
  const clientId = process.env.PATHAO_CLIENT_ID
  const clientSecret = process.env.PATHAO_CLIENT_SECRET
  const username = process.env.PATHAO_USERNAME
  const password = process.env.PATHAO_PASSWORD

  if (!clientId || !clientSecret || !username || !password) {
    throw new Error('Pathao API credentials are not configured. Set PATHAO_CLIENT_ID, PATHAO_CLIENT_SECRET, PATHAO_USERNAME, PATHAO_PASSWORD.')
  }

  return { clientId, clientSecret, username, password }
}

// ── Token Management ──

async function getStoredToken(): Promise<PathaoStoredToken | null> {
  const { data } = await supabase
    .from('settings')
    .select('value')
    .eq('key', SETTINGS_KEY)
    .maybeSingle()

  if (!data?.value) return null

  try {
    const parsed = typeof data.value === 'string' ? JSON.parse(data.value) : data.value
    return parsed as PathaoStoredToken
  } catch {
    return null
  }
}

async function saveToken(token: PathaoStoredToken): Promise<void> {
  const value = JSON.stringify(token)

  // Upsert: update if exists, insert if not
  const { data: existing } = await supabase
    .from('settings')
    .select('key')
    .eq('key', SETTINGS_KEY)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('settings')
      .update({ value })
      .eq('key', SETTINGS_KEY)
  } else {
    await supabase
      .from('settings')
      .insert({ key: SETTINGS_KEY, value })
  }
}

async function authenticateFresh(): Promise<PathaoStoredToken> {
  const { clientId, clientSecret, username, password } = getCredentials()
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      username,
      password,
      grant_type: 'password',
    }),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pathao auth failed (${res.status}): ${text}`)
  }

  const data: PathaoTokenResponse = await res.json()

  const stored: PathaoStoredToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  await saveToken(stored)
  return stored
}

async function refreshToken(currentToken: PathaoStoredToken): Promise<PathaoStoredToken> {
  const { clientId, clientSecret } = getCredentials()
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}/aladdin/api/v1/issue-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: currentToken.refresh_token,
      grant_type: 'refresh_token',
    }),
  })

  if (!res.ok) {
    // Refresh failed — do a fresh auth
    return authenticateFresh()
  }

  const data: PathaoTokenResponse = await res.json()

  const stored: PathaoStoredToken = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + data.expires_in * 1000,
  }

  await saveToken(stored)
  return stored
}

async function getValidToken(): Promise<string> {
  let token = await getStoredToken()

  if (!token) {
    token = await authenticateFresh()
    return token.access_token
  }

  // Check if token is expired or about to expire
  if (Date.now() >= token.expires_at - TOKEN_EXPIRY_BUFFER_MS) {
    token = await refreshToken(token)
  }

  return token.access_token
}

// ── Generic Fetch Wrapper ──

async function pathaoFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const accessToken = await getValidToken()
  const baseUrl = getBaseUrl()

  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${accessToken}`,
      ...options?.headers,
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Pathao API error (${res.status}) on ${path}: ${text}`)
  }

  return res.json() as Promise<T>
}

// ── Location APIs ──

export async function getPathaoCities(): Promise<PathaoCity[]> {
  const response = await pathaoFetch<PathaoCityListResponse>('/aladdin/api/v1/city-list')
  return response.data.data
}

export async function getPathaoZones(cityId: number): Promise<PathaoZone[]> {
  const response = await pathaoFetch<PathaoZoneListResponse>(
    `/aladdin/api/v1/cities/${cityId}/zone-list`
  )
  return response.data.data
}

export async function getPathaoAreas(zoneId: number): Promise<PathaoArea[]> {
  const response = await pathaoFetch<PathaoAreaListResponse>(
    `/aladdin/api/v1/zones/${zoneId}/area-list`
  )
  return response.data.data
}

// ── Store APIs ──

export async function getPathaoStores() {
  const response = await pathaoFetch<PathaoStoreListResponse>('/aladdin/api/v1/stores')
  return response.data.data
}

// ── Order APIs ──

export async function createPathaoOrder(params: PathaoCreateOrderRequest) {
  const response = await pathaoFetch<PathaoCreateOrderResponse>('/aladdin/api/v1/orders', {
    method: 'POST',
    body: JSON.stringify(params),
  })
  return response.data
}

export async function getPathaoOrderInfo(consignmentId: string) {
  const response = await pathaoFetch<PathaoOrderInfoResponse>(
    `/aladdin/api/v1/orders/${consignmentId}/info`
  )
  return response.data
}

// ── Price Estimation ──

export async function getPathaoPriceEstimate(params: PathaoPriceEstimateRequest) {
  const response = await pathaoFetch<PathaoPriceEstimateResponse>(
    '/aladdin/api/v1/merchant/price-plan',
    {
      method: 'POST',
      body: JSON.stringify(params),
    }
  )
  return response.data
}

// ── Status Mapping ──

const PATHAO_STATUS_MAP: Record<string, ShippingStatus> = {
  Pending: 'PROCESSING',
  Picked: 'READY_TO_DISPATCH',
  'In Transit': 'ON_THE_WAY',
  Delivered: 'DELIVERED',
  'Partial Delivery': 'DELIVERED',
  Return: 'RETURN',
  Hold: 'IN_DESTINATION',
  Cancelled: 'CANCEL',
  Payment_Invoice: 'DELIVERED',
}

export function mapPathaoStatusToShippingStatus(
  pathaoStatus: PathaoOrderStatus | string
): ShippingStatus {
  return PATHAO_STATUS_MAP[pathaoStatus] || 'PROCESSING'
}
