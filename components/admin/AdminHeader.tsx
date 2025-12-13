'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LogOut, User, ChevronDown } from 'lucide-react'
import type { AdminUser } from '@/lib/admin-auth'

interface AdminHeaderProps {
  user: AdminUser
}

export default function AdminHeader({ user }: AdminHeaderProps) {
  const router = useRouter()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setLoggingOut(true)
    try {
      await fetch('/api/admin/logout', { method: 'POST' })
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout error:', error)
      setLoggingOut(false)
    }
  }

  return (
    <header
      className="bg-white border-b"
      style={{
        borderColor: '#e5e7eb',
        height: '80px'
      }}
    >
      <div className="h-full px-8 flex items-center justify-between">
        {/* Page Title / Breadcrumb will go here in future */}
        <div>
          <h2
            className="text-xl font-semibold"
            style={{
              color: '#2C2C2C',
              whiteSpace: 'nowrap'
            }}
          >
            Dashboard
          </h2>
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 px-4 py-2 rounded-md transition-colors"
            style={{
              backgroundColor: dropdownOpen ? '#f9fafb' : 'transparent'
            }}
            onMouseEnter={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.backgroundColor = '#f9fafb'
              }
            }}
            onMouseLeave={(e) => {
              if (!dropdownOpen) {
                e.currentTarget.style.backgroundColor = 'transparent'
              }
            }}
          >
            {/* User Avatar */}
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                color: '#FFFFFF'
              }}
            >
              {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
            </div>

            {/* User Info */}
            <div className="flex flex-col items-start">
              <span
                className="text-sm font-medium"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.name || 'Admin User'}
              </span>
              <span
                className="text-xs"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'nowrap'
                }}
              >
                {user.role}
              </span>
            </div>

            <ChevronDown
              className="w-4 h-4 transition-transform"
              style={{
                color: '#6B7280',
                transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border z-50"
              style={{
                borderColor: '#e5e7eb',
                minWidth: '224px'
              }}
            >
              {/* User Email */}
              <div
                className="px-4 py-3 border-b"
                style={{
                  borderColor: '#e5e7eb'
                }}
              >
                <p
                  className="text-xs font-medium"
                  style={{
                    color: '#6B7280',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    display: 'block'
                  }}
                >
                  Signed in as
                </p>
                <p
                  className="text-sm font-medium mt-1"
                  style={{
                    color: '#2C2C2C',
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    display: 'block'
                  }}
                >
                  {user.email}
                </p>
              </div>

              {/* Menu Items */}
              <div className="py-1">
                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full flex items-center px-4 py-2 text-sm transition-colors"
                  style={{
                    color: loggingOut ? '#9CA3AF' : '#EF4444',
                    cursor: loggingOut ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!loggingOut) {
                      e.currentTarget.style.backgroundColor = '#fef2f2'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span style={{ whiteSpace: 'nowrap' }}>
                    {loggingOut ? 'Logging out...' : 'Logout'}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
