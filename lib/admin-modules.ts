/**
 * Admin Module Definitions
 * Shared constants for module-level permission system
 */

export const ADMIN_MODULE_KEYS = [
  'dashboard',
  'orders',
  'products',
  'inventory',
  'accounts',
  'vendors',
  'brands',
  'categories',
  'banners',
  'reports',
  'settings',
] as const

export type AdminModuleKey = (typeof ADMIN_MODULE_KEYS)[number]

export interface AdminModule {
  key: AdminModuleKey
  label: string
  description: string
}

export const ADMIN_MODULES: AdminModule[] = [
  { key: 'dashboard', label: 'Dashboard', description: 'View dashboard analytics and overview' },
  { key: 'orders', label: 'Orders', description: 'Manage customer orders and fulfillment' },
  { key: 'products', label: 'Products', description: 'Create and manage product listings' },
  { key: 'inventory', label: 'Inventory', description: 'Track stock levels and inventory' },
  { key: 'accounts', label: 'Accounts', description: 'Financial transactions, payouts, and refunds' },
  { key: 'vendors', label: 'Vendors', description: 'Manage vendor accounts and onboarding' },
  { key: 'brands', label: 'Brands', description: 'Manage brand profiles and logos' },
  { key: 'categories', label: 'Categories', description: 'Organize product categories and banners' },
  { key: 'banners', label: 'Banners', description: 'Manage hero banners and promotions' },
  { key: 'reports', label: 'Reports', description: 'View sales reports and analytics' },
  { key: 'settings', label: 'Settings', description: 'Configure store settings' },
]

/** Maps sidebar href prefixes to module keys for filtering nav items */
export const SIDEBAR_MODULE_MAP: Record<string, AdminModuleKey> = {
  '/admin': 'dashboard',           // exact match only
  '/admin/orders': 'orders',
  '/admin/products': 'products',
  '/admin/inventory': 'inventory',
  '/admin/accounts': 'accounts',
  '/admin/vendors': 'vendors',
  '/admin/brands': 'brands',
  '/admin/categories': 'categories',
  '/admin/banners': 'banners',
  '/admin/reports': 'reports',
  '/admin/settings': 'settings',
}

/** Maps API route segments to module keys (reference for requireModuleAccess calls) */
export const API_ROUTE_MODULE_MAP: Record<string, AdminModuleKey> = {
  orders: 'orders',
  products: 'products',
  inventory: 'inventory',
  accounts: 'accounts',
  vendors: 'vendors',
  brands: 'brands',
  categories: 'categories',
  'category-banners': 'categories',
  hero: 'banners',
  reports: 'reports',
  settings: 'settings',
}
