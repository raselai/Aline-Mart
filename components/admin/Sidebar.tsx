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
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'

interface NavItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
  { name: 'Products', href: '/admin/products', icon: Package },
  { name: 'Brands', href: '/admin/brands', icon: Tag },
  { name: 'Categories', href: '/admin/categories', icon: Layers },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

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
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center px-4 py-3 rounded-md transition-all"
                  style={{
                    backgroundColor: isActive ? '#fdf2f8' : 'transparent',
                    color: isActive ? '#8e2157' : '#6B7280',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = '#f9fafb'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent'
                    }
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && (
                    <span
                      className="ml-3 font-medium"
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {item.name}
                    </span>
                  )}
                </Link>
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
