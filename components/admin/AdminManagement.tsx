'use client'

import { useState, useEffect, useCallback } from 'react'
import { ADMIN_MODULES } from '@/lib/admin-modules'
import {
  Plus,
  Shield,
  ShieldCheck,
  Edit2,
  Trash2,
  KeyRound,
  X,
  Check,
  AlertTriangle,
  Eye,
  EyeOff,
} from 'lucide-react'

interface AdminData {
  id: string
  email: string
  name: string | null
  role: string
  createdAt: string
  modules: string[]
  isActive: boolean
}

// ─── Confirmation Dialog ─────────────────────────────────────────────

function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  destructive,
}: {
  title: string
  message: string
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
  destructive?: boolean
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl p-6 w-full"
        style={{ maxWidth: '480px', minWidth: '320px' }}
      >
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle
            className="w-6 h-6 flex-shrink-0 mt-0.5"
            style={{ color: destructive ? '#DC2626' : '#F59E0B' }}
          />
          <div style={{ minWidth: 0, flex: 1 }}>
            <h3
              className="text-lg font-semibold"
              style={{ color: '#1F2937', whiteSpace: 'normal', wordBreak: 'normal' }}
            >
              {title}
            </h3>
            <p
              className="text-sm mt-1"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'anywhere',
              }}
            >
              {message}
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium rounded-md"
            style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: '#FFFFFF' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium rounded-md text-white"
            style={{ backgroundColor: destructive ? '#DC2626' : '#8e2157' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Module Checkboxes ───────────────────────────────────────────────

function ModuleCheckboxes({
  selected,
  onChange,
}: {
  selected: string[]
  onChange: (modules: string[]) => void
}) {
  const allSelected = ADMIN_MODULES.every((m) => selected.includes(m.key))

  const toggleAll = () => {
    if (allSelected) {
      onChange([])
    } else {
      onChange(ADMIN_MODULES.map((m) => m.key))
    }
  }

  const toggle = (key: string) => {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key))
    } else {
      onChange([...selected, key])
    }
  }

  return (
    <div style={{ width: '100%', minWidth: '100%' }}>
      <label className="flex items-center gap-2 mb-3 cursor-pointer">
        <input
          type="checkbox"
          checked={allSelected}
          onChange={toggleAll}
          className="w-4 h-4 rounded"
          style={{ accentColor: '#8e2157', flexShrink: 0 }}
        />
        <span
          className="text-sm font-semibold"
          style={{ color: '#374151', whiteSpace: 'nowrap' }}
        >
          Select All Modules
        </span>
      </label>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '8px',
          width: '100%',
        }}
      >
        {ADMIN_MODULES.map((mod) => (
          <label
            key={mod.key}
            className="flex items-start gap-2 cursor-pointer p-2 rounded"
            style={{ backgroundColor: selected.includes(mod.key) ? '#FDF2F8' : 'transparent' }}
            onMouseEnter={(e) => {
              if (!selected.includes(mod.key))
                e.currentTarget.style.backgroundColor = '#F9FAFB'
            }}
            onMouseLeave={(e) => {
              if (!selected.includes(mod.key))
                e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <input
              type="checkbox"
              checked={selected.includes(mod.key)}
              onChange={() => toggle(mod.key)}
              className="w-4 h-4 rounded mt-0.5"
              style={{ accentColor: '#8e2157', flexShrink: 0 }}
            />
            <div style={{ minWidth: 0 }}>
              <span
                className="text-sm font-medium"
                style={{
                  color: '#374151',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                }}
              >
                {mod.label}
              </span>
              <p
                className="text-xs"
                style={{
                  color: '#9CA3AF',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  marginTop: '2px',
                }}
              >
                {mod.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}

// ─── Add Admin Modal ─────────────────────────────────────────────────

function AddAdminModal({
  onClose,
  onCreated,
}: {
  onClose: () => void
  onCreated: () => void
}) {
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [modules, setModules] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: name || null, password, modules }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create admin')
        return
      }

      onCreated()
      onClose()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full"
        style={{
          maxWidth: '600px',
          minWidth: '320px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: '#1F2937', whiteSpace: 'nowrap' }}
          >
            Add New Admin
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded"
            style={{ minWidth: '36px', minHeight: '36px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6" style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                  width: '100%',
                }}
              >
                {error}
              </div>
            )}

            {/* Email */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}
              >
                Email *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box',
                }}
                placeholder="admin@example.com"
              />
            </div>

            {/* Name */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box',
                }}
                placeholder="Admin Name"
              />
            </div>

            {/* Password */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}
              >
                Password *
              </label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-3 py-2 rounded-md text-sm"
                  style={{
                    border: '1px solid #D1D5DB',
                    color: '#1F2937',
                    backgroundColor: '#FFFFFF',
                    paddingRight: '40px',
                    width: '100%',
                    minWidth: '100%',
                    boxSizing: 'border-box',
                  }}
                  placeholder="Minimum 8 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    padding: '4px',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    minWidth: '28px',
                    minHeight: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  tabIndex={-1}
                >
                  {showPassword
                    ? <EyeOff className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                    : <Eye className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                  }
                </button>
              </div>
            </div>

            {/* Module Permissions */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '8px', whiteSpace: 'nowrap' }}
              >
                Module Permissions
              </label>
              <ModuleCheckboxes selected={modules} onChange={setModules} />
            </div>

            {/* Footer Buttons */}
            <div
              className="flex justify-end gap-3"
              style={{ paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md"
                style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: '#FFFFFF' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded-md text-white"
                style={{
                  backgroundColor: '#8e2157',
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Edit Permissions Modal ──────────────────────────────────────────

function EditPermissionsModal({
  admin,
  onClose,
  onUpdated,
}: {
  admin: AdminData
  onClose: () => void
  onUpdated: () => void
}) {
  const [modules, setModules] = useState<string[]>(admin.modules)
  const [isActive, setIsActive] = useState(admin.isActive)
  const [name, setName] = useState(admin.name || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ modules, isActive, name: name || null }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to update admin')
        return
      }

      onUpdated()
      onClose()
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full"
        style={{
          maxWidth: '600px',
          minWidth: '320px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        >
          <div style={{ minWidth: 0, flex: 1, marginRight: '12px' }}>
            <h2
              className="text-lg font-semibold"
              style={{
                color: '#1F2937',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'anywhere',
              }}
            >
              Edit Admin
            </h2>
            <p
              className="text-xs"
              style={{
                color: '#6B7280',
                marginTop: '2px',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'anywhere',
              }}
            >
              {admin.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded"
            style={{ minWidth: '36px', minHeight: '36px', flexShrink: 0 }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6" style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                  width: '100%',
                }}
              >
                {error}
              </div>
            )}

            {/* Name */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}
              >
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm"
                style={{
                  border: '1px solid #D1D5DB',
                  color: '#1F2937',
                  backgroundColor: '#FFFFFF',
                  width: '100%',
                  minWidth: '100%',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center gap-3">
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', whiteSpace: 'nowrap' }}
              >
                Account Status
              </label>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: isActive ? '#ECFDF5' : '#FEF2F2',
                  color: isActive ? '#059669' : '#DC2626',
                  border: 'none',
                  cursor: 'pointer',
                  minHeight: '32px',
                }}
              >
                {isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                {isActive ? 'Active' : 'Deactivated'}
              </button>
            </div>

            {/* Module Permissions */}
            <div style={{ width: '100%' }}>
              <label
                className="text-sm font-medium"
                style={{ color: '#374151', display: 'block', marginBottom: '8px', whiteSpace: 'nowrap' }}
              >
                Module Permissions
              </label>
              <ModuleCheckboxes selected={modules} onChange={setModules} />
            </div>

            {/* Footer Buttons */}
            <div
              className="flex justify-end gap-3"
              style={{ paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}
            >
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium rounded-md"
                style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: '#FFFFFF' }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium rounded-md text-white"
                style={{
                  backgroundColor: '#8e2157',
                  opacity: loading ? 0.5 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Reset Password Modal ────────────────────────────────────────────

function ResetPasswordModal({
  admin,
  onClose,
}: {
  admin: AdminData
  onClose: () => void
}) {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch(`/api/admin/admins/${admin.id}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to reset password')
        return
      }

      setSuccess(true)
      setTimeout(onClose, 1500)
    } catch {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full"
        style={{ maxWidth: '480px', minWidth: '320px' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-6"
          style={{ borderBottom: '1px solid #E5E7EB' }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: '#1F2937', whiteSpace: 'nowrap' }}
          >
            Reset Password
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded"
            style={{ minWidth: '36px', minHeight: '36px' }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6" style={{ width: '100%' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
            <p
              className="text-sm"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'anywhere',
                width: '100%',
              }}
            >
              Reset password for <strong style={{ color: '#374151' }}>{admin.email}</strong>
            </p>

            {/* Error */}
            {error && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                  width: '100%',
                }}
              >
                {error}
              </div>
            )}

            {/* Success */}
            {success && (
              <div
                className="p-3 rounded-md text-sm"
                style={{
                  backgroundColor: '#ECFDF5',
                  color: '#059669',
                  display: 'block',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  width: '100%',
                }}
              >
                Password reset successfully.
              </div>
            )}

            {!success && (
              <>
                {/* Password Input */}
                <div style={{ width: '100%' }}>
                  <label
                    className="text-sm font-medium"
                    style={{ color: '#374151', display: 'block', marginBottom: '4px', whiteSpace: 'nowrap' }}
                  >
                    New Password
                  </label>
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-3 py-2 rounded-md text-sm"
                      style={{
                        border: '1px solid #D1D5DB',
                        color: '#1F2937',
                        backgroundColor: '#FFFFFF',
                        paddingRight: '40px',
                        width: '100%',
                        minWidth: '100%',
                        boxSizing: 'border-box',
                      }}
                      placeholder="Minimum 8 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '8px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        padding: '4px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        minWidth: '28px',
                        minHeight: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      tabIndex={-1}
                    >
                      {showPassword
                        ? <EyeOff className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                        : <Eye className="w-4 h-4" style={{ color: '#9CA3AF' }} />
                      }
                    </button>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3" style={{ paddingTop: '8px' }}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-sm font-medium rounded-md"
                    style={{ border: '1px solid #D1D5DB', color: '#374151', backgroundColor: '#FFFFFF' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium rounded-md text-white"
                    style={{
                      backgroundColor: '#8e2157',
                      opacity: loading ? 0.5 : 1,
                      cursor: loading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {loading ? 'Resetting...' : 'Reset Password'}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

export default function AdminManagement() {
  const [admins, setAdmins] = useState<AdminData[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editAdmin, setEditAdmin] = useState<AdminData | null>(null)
  const [resetAdmin, setResetAdmin] = useState<AdminData | null>(null)
  const [confirmAction, setConfirmAction] = useState<{
    title: string
    message: string
    confirmLabel: string
    destructive?: boolean
    onConfirm: () => void
  } | null>(null)

  const fetchAdmins = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/admins')
      const data = await res.json()
      if (res.ok) {
        setAdmins(data.admins || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  const handleDeactivate = (admin: AdminData) => {
    const newStatus = !admin.isActive
    setConfirmAction({
      title: newStatus ? 'Reactivate Admin' : 'Deactivate Admin',
      message: newStatus
        ? `Reactivate ${admin.email}? They will regain access to their assigned modules.`
        : `Deactivate ${admin.email}? They will be immediately locked out of all admin features.`,
      confirmLabel: newStatus ? 'Reactivate' : 'Deactivate',
      destructive: !newStatus,
      onConfirm: async () => {
        await fetch(`/api/admin/admins/${admin.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: newStatus }),
        })
        setConfirmAction(null)
        fetchAdmins()
      },
    })
  }

  const handleRemove = (admin: AdminData) => {
    setConfirmAction({
      title: 'Remove Admin',
      message: `Remove ${admin.email} from admin role? They will be demoted to a regular customer account. This action cannot be easily undone.`,
      confirmLabel: 'Remove Admin',
      destructive: true,
      onConfirm: async () => {
        await fetch(`/api/admin/admins/${admin.id}`, { method: 'DELETE' })
        setConfirmAction(null)
        fetchAdmins()
      },
    })
  }

  return (
    <div style={{ width: '100%', minWidth: '320px' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div style={{ minWidth: 0, flex: 1 }}>
          <h1
            className="text-2xl font-serif font-bold"
            style={{ color: '#1F2937', whiteSpace: 'normal', wordBreak: 'normal' }}
          >
            Admin Management
          </h1>
          <p
            className="text-sm mt-1"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            Manage admin accounts and module-level permissions
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium text-white"
          style={{
            backgroundColor: '#8e2157',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            marginLeft: '16px',
            minHeight: '44px',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Admin
        </button>
      </div>

      {/* Admin Table */}
      <div
        className="bg-white rounded-lg overflow-hidden"
        style={{ border: '1px solid #E5E7EB', width: '100%' }}
      >
        {loading ? (
          <div className="p-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-4 py-4"
                style={{ borderBottom: '1px solid #F3F4F6' }}
              >
                <div className="h-4 rounded" style={{ width: '192px', backgroundColor: '#E5E7EB' }} />
                <div className="h-4 rounded" style={{ width: '128px', backgroundColor: '#E5E7EB' }} />
                <div className="h-4 rounded" style={{ width: '96px', backgroundColor: '#E5E7EB' }} />
                <div className="flex-1" />
                <div className="h-4 rounded" style={{ width: '80px', backgroundColor: '#E5E7EB' }} />
              </div>
            ))}
          </div>
        ) : admins.length === 0 ? (
          <div className="p-12 text-center">
            <Shield className="w-12 h-12 mx-auto mb-3" style={{ color: '#D1D5DB' }} />
            <p
              className="text-sm"
              style={{
                color: '#6B7280',
                display: 'block',
                whiteSpace: 'normal',
                wordBreak: 'normal',
              }}
            >
              No admin accounts found
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '700px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAFB' }}>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    Admin
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    Role
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    Status
                  </th>
                  <th
                    className="text-left px-6 py-3 text-xs font-semibold uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    Modules
                  </th>
                  <th
                    className="text-right px-6 py-3 text-xs font-semibold uppercase"
                    style={{ color: '#6B7280', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {admins.map((admin) => (
                  <tr key={admin.id} style={{ borderTop: '1px solid #F3F4F6' }}>
                    <td className="px-6 py-4">
                      <div
                        className="text-sm font-medium"
                        style={{ color: '#1F2937', whiteSpace: 'nowrap' }}
                      >
                        {admin.name || '(No name)'}
                      </div>
                      <div
                        className="text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          overflowWrap: 'anywhere',
                        }}
                      >
                        {admin.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: admin.role === 'SUPER_ADMIN' ? '#FDF2F8' : '#F3F4F6',
                          color: admin.role === 'SUPER_ADMIN' ? '#8e2157' : '#374151',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {admin.role === 'SUPER_ADMIN'
                          ? <ShieldCheck className="w-3 h-3" />
                          : <Shield className="w-3 h-3" />
                        }
                        {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {admin.role === 'SUPER_ADMIN' ? (
                        <span
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{ backgroundColor: '#ECFDF5', color: '#059669', whiteSpace: 'nowrap' }}
                        >
                          Active
                        </span>
                      ) : (
                        <button
                          onClick={() => handleDeactivate(admin)}
                          className="text-xs font-medium px-2 py-1 rounded-full"
                          style={{
                            backgroundColor: admin.isActive ? '#ECFDF5' : '#FEF2F2',
                            color: admin.isActive ? '#059669' : '#DC2626',
                            border: 'none',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {admin.isActive ? 'Active' : 'Deactivated'}
                        </button>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {admin.role === 'SUPER_ADMIN' ? (
                        <span
                          className="text-xs"
                          style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                        >
                          All modules (bypass)
                        </span>
                      ) : admin.modules.length === 0 ? (
                        <span
                          className="text-xs"
                          style={{ color: '#9CA3AF', whiteSpace: 'nowrap' }}
                        >
                          None
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1" style={{ maxWidth: '240px' }}>
                          {admin.modules.slice(0, 4).map((mod) => (
                            <span
                              key={mod}
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: '#F3F4F6',
                                color: '#374151',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {mod}
                            </span>
                          ))}
                          {admin.modules.length > 4 && (
                            <span
                              className="text-xs px-1.5 py-0.5 rounded"
                              style={{
                                backgroundColor: '#F3F4F6',
                                color: '#6B7280',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              +{admin.modules.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {admin.role !== 'SUPER_ADMIN' && (
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setEditAdmin(admin)}
                            className="p-2 rounded"
                            title="Edit permissions"
                            style={{ minWidth: '36px', minHeight: '36px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <Edit2 className="w-4 h-4" style={{ color: '#6B7280' }} />
                          </button>
                          <button
                            onClick={() => setResetAdmin(admin)}
                            className="p-2 rounded"
                            title="Reset password"
                            style={{ minWidth: '36px', minHeight: '36px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F3F4F6' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <KeyRound className="w-4 h-4" style={{ color: '#6B7280' }} />
                          </button>
                          <button
                            onClick={() => handleRemove(admin)}
                            className="p-2 rounded"
                            title="Remove admin"
                            style={{ minWidth: '36px', minHeight: '36px' }}
                            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2' }}
                            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
                          >
                            <Trash2 className="w-4 h-4" style={{ color: '#DC2626' }} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddAdminModal
          onClose={() => setShowAddModal(false)}
          onCreated={fetchAdmins}
        />
      )}

      {editAdmin && (
        <EditPermissionsModal
          admin={editAdmin}
          onClose={() => setEditAdmin(null)}
          onUpdated={fetchAdmins}
        />
      )}

      {resetAdmin && (
        <ResetPasswordModal
          admin={resetAdmin}
          onClose={() => setResetAdmin(null)}
        />
      )}

      {confirmAction && (
        <ConfirmDialog
          title={confirmAction.title}
          message={confirmAction.message}
          confirmLabel={confirmAction.confirmLabel}
          destructive={confirmAction.destructive}
          onConfirm={confirmAction.onConfirm}
          onCancel={() => setConfirmAction(null)}
        />
      )}
    </div>
  )
}
