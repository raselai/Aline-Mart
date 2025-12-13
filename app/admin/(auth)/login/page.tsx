'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirect = searchParams.get('redirect') || '/admin'
  const expired = searchParams.get('expired') === 'true'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Login failed')
        setLoading(false)
        return
      }

      // Redirect to admin dashboard or specified page
      router.push(redirect)
      router.refresh()
    } catch (err) {
      setError('An error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8" style={{ backgroundColor: '#F5F5F5' }}>
      <div className="w-full" style={{ maxWidth: '600px', minWidth: '320px' }}>
        {/* Logo / Branding */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>
            Aline Mart
          </h1>
          <p className="text-lg" style={{ color: '#6B7280', whiteSpace: 'nowrap' }}>Admin Dashboard</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-serif font-bold mb-6" style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}>
            Sign In
          </h2>

          {expired && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              Your session has expired. Please sign in again.
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-800" style={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-all"
                style={{
                  focusRingColor: '#8e2157',
                  borderColor: '#d1d5db'
                }}
                placeholder="admin@alinemart.com"
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-1"
                style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 transition-all"
                style={{
                  focusRingColor: '#8e2157',
                  borderColor: '#d1d5db'
                }}
                placeholder="Enter your password"
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white py-3 rounded-md font-medium transition-all"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #a02865 0%, #6d0a3c 100%)'
                }
              }}
              onMouseLeave={(e) => {
                if (!loading) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                }
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: '#6B7280' }}>
            <p style={{ whiteSpace: 'nowrap' }}>Admin access only</p>
          </div>
        </div>

        {/* Development Note */}
        {process.env.NODE_ENV === 'development' && (
          <div
            className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800"
            style={{
              minWidth: '280px',
              width: '100%',
              overflow: 'hidden'
            }}
          >
            <p
              className="font-semibold mb-1"
              style={{
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Development Mode
            </p>
            <p
              style={{
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              Default credentials:
            </p>
            <div
              className="font-mono mt-1"
              style={{
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'anywhere',
                wordSpacing: 'normal',
                fontSize: '13px',
                lineHeight: '1.5',
                minWidth: '100%'
              }}
            >
              admin@alinemart.com / Admin123!@#
            </div>
            <p
              className="text-xs mt-2 text-blue-600"
              style={{
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                minWidth: '100%'
              }}
            >
              ⚠️ Change these credentials after first login!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
