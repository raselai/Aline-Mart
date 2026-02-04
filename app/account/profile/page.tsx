'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { updateUserProfile } from '@/lib/supabase-auth'
import { useAuthStore } from '@/store/authStore'
import { supabase } from '@/lib/supabase'

export default function ProfilePage() {
  const { userName, userEmail } = useAuth()
  const setSession = useAuthStore((s) => s.setSession)

  const [name, setName] = useState(userName || '')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = name.trim()
    if (!trimmed) {
      setMessage({ type: 'error', text: 'Name cannot be empty.' })
      return
    }

    setSaving(true)
    setMessage(null)

    const { error } = await updateUserProfile(trimmed)

    if (error) {
      setMessage({ type: 'error', text: error })
    } else {
      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      // Refresh the session to pick up the new metadata
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        setSession(session)
      }
    }

    setSaving(false)
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        minWidth: '320px',
        margin: '0 auto',
        padding: '120px 16px 80px',
        paddingTop: 'clamp(120px, 15vw, 200px)',
      }}
    >
      {/* Back link */}
      <Link
        href="/account"
        style={{
          fontSize: '0.875rem',
          color: '#6B7280',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
          marginBottom: '24px',
          whiteSpace: 'nowrap',
        }}
      >
        &larr; Back to Account
      </Link>

      <h1
        style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#2C2C2C',
          margin: '0 0 32px',
          whiteSpace: 'nowrap',
        }}
      >
        Profile Settings
      </h1>

      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          padding: '32px 24px',
        }}
      >
        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div style={{ marginBottom: '24px' }}>
            <label
              htmlFor="name"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              Display Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.95rem',
                color: '#2C2C2C',
                backgroundColor: '#F5F5F5',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
          </div>

          {/* Email Field (read-only) */}
          <div style={{ marginBottom: '28px' }}>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: '#6B7280',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                marginBottom: '8px',
                whiteSpace: 'nowrap',
              }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={userEmail || ''}
              readOnly
              style={{
                width: '100%',
                padding: '10px 14px',
                fontSize: '0.95rem',
                color: '#6B7280',
                backgroundColor: '#F9FAFB',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                outline: 'none',
                boxSizing: 'border-box',
                cursor: 'not-allowed',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            />
            <p
              style={{
                fontSize: '0.75rem',
                color: '#9CA3AF',
                marginTop: '4px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              Email cannot be changed.
            </p>
          </div>

          {/* Message */}
          {message && (
            <div
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                marginBottom: '20px',
                fontSize: '0.875rem',
                backgroundColor: message.type === 'success' ? '#D1FAE5' : '#FEE2E2',
                color: message.type === 'success' ? '#065F46' : '#991B1B',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
              }}
            >
              {message.text}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={saving}
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 32px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: saving ? 'not-allowed' : 'pointer',
              opacity: saving ? 0.7 : 1,
              transition: 'opacity 200ms ease',
              whiteSpace: 'nowrap',
            }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  )
}
