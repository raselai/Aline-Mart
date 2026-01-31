'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Tag,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Store,
  Warehouse,
  DollarSign,
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  children?: { name: string; href: string }[]
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
  {
    name: 'Accounts',
    href: '/admin/accounts',
    icon: DollarSign,
    children: [
      { name: 'Dashboard', href: '/admin/accounts' },
      { name: 'Transactions', href: '/admin/accounts/transactions' },
      { name: 'COD Collections', href: '/admin/accounts/cod-collections' },
      { name: 'Refunds', href: '/admin/accounts/refunds' },
      { name: 'Vendor Payouts', href: '/admin/accounts/vendor-payouts' },
      { name: 'Reports', href: '/admin/accounts/reports' },
      { name: 'Settings', href: '/admin/accounts/settings' },
    ],
  },
  { name: 'Vendors', href: '/admin/vendors', icon: Store },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Sales Report', href: '/admin/reports/sales', icon: BarChart3 },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(() => {
    // Auto-expand if current path matches
    const initial: Record<string, boolean> = {}
    for (const item of navItems) {
      if (item.children && typeof window !== 'undefined') {
        // Will be set in effect
      }
    }
    return initial
  })

  // Auto-expand parent menu if child is active
  const isChildActive = (item: NavItem) =>
    item.children?.some((child) =>
      child.href === '/admin/accounts'
        ? pathname === '/admin/accounts'
        : pathname.startsWith(child.href)
    )

  const toggleMenu = (href: string) => {
    setExpandedMenus((prev) => ({ ...prev, [href]: !prev[href] }))
  }

  return (
    <aside
      className="bg-white border-r transition-all duration-300"
      style={{
        width: collapsed ? '80px' : '256px',
        minWidth: collapsed ? '80px' : '256px',
        height: '100vh',
        position: 'sticky',
        top: 0,
        borderColor: '#e5e7eb'
      }}
    >
      {/* Logo Section */}
      <div
        className="flex items-center justify-between p-6 border-b"
        style={{
          borderColor: '#e5e7eb',
          minHeight: '80px'
        }}
      >
        {!collapsed && (
          <Link href="/admin">
            <h1
              className="text-2xl font-serif font-bold"
              style={{
                color: '#8e2157',
                whiteSpace: 'nowrap'
              }}
            >
              Aline Mart
            </h1>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-md hover:bg-gray-100 transition-colors"
          style={{
            color: '#6B7280'
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const hasChildren = !!item.children
            const childActive = hasChildren && isChildActive(item)
            const isActive = hasChildren
              ? childActive
              : item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href)
            const isExpanded = expandedMenus[item.href] || childActive

            return (
              <li key={item.href}>
                {hasChildren ? (
                  <>
                    <button
                      onClick={() => {
                        if (collapsed) return
                        toggleMenu(item.href)
                      }}
                      className="w-full flex items-center px-4 py-3 rounded-md transition-all"
                      style={{
                        backgroundColor: isActive ? '#fdf2f8' : 'transparent',
                        color: isActive ? '#8e2157' : '#6B7280',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb'
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <>
                          <span
                            className="ml-3 font-medium flex-1 text-left"
                            style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                          >
                            {item.name}
                          </span>
                          <ChevronDown
                            className="w-4 h-4 transition-transform"
                            style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
                          />
                        </>
                      )}
                    </button>
                    {!collapsed && isExpanded && item.children && (
                      <ul className="ml-8 mt-1 space-y-1">
                        {item.children.map((child) => {
                          const isSubActive = child.href === '/admin/accounts'
                            ? pathname === '/admin/accounts'
                            : pathname.startsWith(child.href)
                          return (
                            <li key={child.href}>
                              <Link
                                href={child.href}
                                className="block px-4 py-2 rounded-md text-sm transition-all"
                                style={{
                                  backgroundColor: isSubActive ? '#fdf2f8' : 'transparent',
                                  color: isSubActive ? '#8e2157' : '#6B7280',
                                }}
                                onMouseEnter={(e) => {
                                  if (!isSubActive) e.currentTarget.style.backgroundColor = '#f9fafb'
                                }}
                                onMouseLeave={(e) => {
                                  if (!isSubActive) e.currentTarget.style.backgroundColor = 'transparent'
                                }}
                              >
                                {child.name}
                              </Link>
                            </li>
                          )
                        })}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center px-4 py-3 rounded-md transition-all"
                    style={{
                      backgroundColor: isActive ? '#fdf2f8' : 'transparent',
                      color: isActive ? '#8e2157' : '#6B7280',
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = '#f9fafb'
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                    }}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!collapsed && (
                      <span
                        className="ml-3 font-medium"
                        style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                      >
                        {item.name}
                      </span>
                    )}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Admin Badge (Bottom) */}
      {!collapsed && (
        <div
          className="absolute bottom-0 left-0 right-0 p-4 border-t"
          style={{
            borderColor: '#e5e7eb'
          }}
        >
          <div
            className="px-3 py-2 rounded-md text-xs font-medium text-center"
            style={{
              backgroundColor: '#fdf2f8',
              color: '#8e2157',
              whiteSpace: 'nowrap'
            }}
          >
            Admin Panel
          </div>
        </div>
      )}
    </aside>
  )
}
