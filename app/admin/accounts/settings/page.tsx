'use client'

import { useState, useEffect } from 'react'
import { Save, Settings } from 'lucide-react'

export default function AccountsSettingsPage() {
  const [commissionRate, setCommissionRate] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/accounts/settings')
        if (response.ok) {
          const data = await response.json()
          setCommissionRate(String(data.settings.defaultCommissionRate))
        }
      } catch (error) {
        console.error('Error fetching settings:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSettings()
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const response = await fetch('/api/admin/accounts/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defaultCommissionRate: Number(commissionRate),
        }),
      })
      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save')
      }
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      alert(error instanceof Error ? error.message : 'Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }} />
        <p
          className="mt-4"
          style={{
            color: '#6B7280',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            display: 'block',
            minWidth: '100%',
          }}
        >
          Loading settings...
        </p>
      </div>
    )
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Header */}
      <div className="mb-8">
        <h1
          className="text-3xl font-serif font-bold"
          style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
        >
          Accounts Settings
        </h1>
        <p
          className="mt-2"
          style={{
            color: '#6B7280',
            whiteSpace: 'normal',
            wordBreak: 'normal',
            overflowWrap: 'normal',
            display: 'block',
            minWidth: '100%',
          }}
        >
          Configure commission rates and financial settings
        </p>
      </div>

      <div
        className="bg-white rounded-lg shadow-sm p-8"
        style={{ maxWidth: '600px', minWidth: '320px', width: '100%' }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-full" style={{ backgroundColor: '#F3F4F6' }}>
            <Settings className="w-5 h-5" style={{ color: '#6B7280' }} />
          </div>
          <h2
            className="text-lg font-medium"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Commission Settings
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-1"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Default Commission Rate (%)
            </label>
            <p
              className="text-xs mb-2"
              style={{
                color: '#6B7280',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                overflowWrap: 'normal',
                display: 'block',
                minWidth: '100%',
              }}
            >
              This rate will be applied to all vendors. Individual vendor rates can be set in vendor management.
            </p>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={commissionRate}
              onChange={(e) => setCommissionRate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              required
            />
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 rounded-md text-white transition-colors"
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                cursor: saving ? 'not-allowed' : 'pointer',
                opacity: saving ? 0.5 : 1,
                whiteSpace: 'nowrap',
              }}
            >
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Settings'}
            </button>
            {saved && (
              <span
                className="text-sm"
                style={{
                  color: '#059669',
                  whiteSpace: 'nowrap',
                }}
              >
                Settings saved successfully
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
