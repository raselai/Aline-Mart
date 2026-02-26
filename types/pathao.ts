/**
 * Pathao Courier Merchant API Types
 * Strict TypeScript interfaces for all Pathao API request/response shapes
 */

// ── Auth ──

export interface PathaoTokenRequest {
  client_id: string
  client_secret: string
  username: string
  password: string
  grant_type: 'password'
}

export interface PathaoRefreshRequest {
  client_id: string
  client_secret: string
  refresh_token: string
  grant_type: 'refresh_token'
}

export interface PathaoTokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface PathaoStoredToken {
  access_token: string
  refresh_token: string
  expires_at: number // Unix timestamp (ms)
}

// ── Locations ──

export interface PathaoCity {
  city_id: number
  city_name: string
}

export interface PathaoZone {
  zone_id: number
  zone_name: string
}

export interface PathaoArea {
  area_id: number
  area_name: string
  home_delivery_available: boolean
  pickup_available: boolean
}

export interface PathaoCityListResponse {
  message: string
  type: string
  code: number
  data: {
    data: PathaoCity[]
  }
}

export interface PathaoZoneListResponse {
  message: string
  type: string
  code: number
  data: {
    data: PathaoZone[]
  }
}

export interface PathaoAreaListResponse {
  message: string
  type: string
  code: number
  data: {
    data: PathaoArea[]
  }
}

// ── Stores ──

export interface PathaoStore {
  store_id: number
  store_name: string
  store_address: string
  city_id: number
  zone_id: number
  hub_id: number
}

export interface PathaoStoreListResponse {
  message: string
  type: string
  code: number
  data: {
    data: PathaoStore[]
  }
}

// ── Orders ──

export interface PathaoCreateOrderRequest {
  store_id: number
  merchant_order_id: string
  recipient_name: string
  recipient_phone: string
  recipient_address: string
  recipient_city: number
  recipient_zone: number
  recipient_area?: number
  delivery_type: number // 48 = normal, 12 = on-demand
  item_type: number // 1 = document, 2 = parcel
  special_instruction?: string
  item_quantity: number
  item_weight: number // in kg
  amount_to_collect: number // COD amount, 0 for prepaid
  item_description?: string
}

export interface PathaoCreateOrderResponse {
  message: string
  type: string
  code: number
  data: {
    consignment_id: string
    merchant_order_id: string
    order_status: string
    delivery_fee: number
  }
}

export interface PathaoOrderInfoResponse {
  message: string
  type: string
  code: number
  data: {
    consignment_id: string
    merchant_order_id: string
    order_status: string
    order_status_slug: string
    delivery_fee: number
    order_type: string
    order_type_slug: string
    item_type: string
    transfer_status: number
    archived: number
    updated_at: string
  }
}

// ── Price Estimation ──

export interface PathaoPriceEstimateRequest {
  store_id: number
  item_type: number
  delivery_type: number
  item_weight: number
  recipient_city: number
  recipient_zone: number
}

export interface PathaoPriceEstimateResponse {
  message: string
  type: string
  code: number
  data: {
    price: number
    discount: number
    promo_discount: number
    cod_charge: number
    additional_charge: number
  }
}

// ── Status Mapping ──

export type PathaoOrderStatus =
  | 'Pending'
  | 'Picked'
  | 'In Transit'
  | 'Delivered'
  | 'Partial Delivery'
  | 'Return'
  | 'Hold'
  | 'Cancelled'
  | 'Payment_Invoice'
