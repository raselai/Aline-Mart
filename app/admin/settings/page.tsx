'use client'

import { useState, useEffect } from 'react'
import { Save, Check, AlertCircle, Globe, Mail, Search } from 'lucide-react'

type TabType = 'general' | 'seo' | 'email'

interface Settings {
  // General
  site_name?: string
  site_logo?: string
  contact_email?: string
  contact_phone?: string
  contact_address?: string

  // SEO
  seo_title?: string
  seo_description?: string
  seo_keywords?: string
  seo_og_image?: string

  // Email
  email_from_name?: string
  email_from_address?: string
  email_smtp_host?: string
  email_smtp_port?: string
  email_smtp_username?: string
  email_smtp_password?: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Success/error messages
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch settings on mount
  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')

      if (!response.ok) {
        throw new Error('Failed to fetch settings')
      }

      const data = await response.json()
      setSettings(data.settings || {})
    } catch (error) {
      console.error('Error fetching settings:', error)
      setErrorMessage('Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (key: keyof Settings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save settings')
      }

      setSuccessMessage(`Settings saved successfully! ${data.updated} setting(s) updated.`)
      setHasChanges(false)

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to save settings')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSaving(false)
    }
  }

  const tabs = [
    { id: 'general' as TabType, label: 'General', icon: Globe },
    { id: 'seo' as TabType, label: 'SEO & Meta', icon: Search },
    { id: 'email' as TabType, label: 'Email', icon: Mail }
  ]

  return (
    <div className="p-8" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <div className="w-full mx-auto" style={{ maxWidth: '1200px', minWidth: '320px' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1
              className="text-3xl font-serif font-bold"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'normal',
                wordBreak: 'normal'
              }}
            >
              Settings & Configuration
            </h1>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="flex items-center gap-2 px-6 py-2 text-white rounded-md font-medium transition-all hover:opacity-90"
              style={{
                background: hasChanges
                  ? 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                  : '#9CA3AF',
                opacity: (saving || !hasChanges) ? 0.7 : 1,
                cursor: (saving || !hasChanges) ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              <Save className="w-5 h-5" />
              {saving ? 'Saving...' : hasChanges ? 'Save Changes' : 'No Changes'}
            </button>
          </div>
          <p
            style={{
              color: '#6B7280',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              display: 'block',
              minWidth: '100%'
            }}
          >
            Configure your site settings, SEO, and integrations
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div
            className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md flex items-start gap-3"
            style={{ minWidth: '280px' }}
          >
            <Check className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p
              style={{
                color: '#065f46',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                flex: 1
              }}
            >
              {successMessage}
            </p>
          </div>
        )}

        {errorMessage && (
          <div
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md flex items-start gap-3"
            style={{ minWidth: '280px' }}
          >
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p
              style={{
                color: '#991b1b',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                flex: 1
              }}
            >
              {errorMessage}
            </p>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {/* Tab Headers */}
          <div
            className="flex border-b"
            style={{ borderColor: '#E5E7EB' }}
          >
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-6 py-4 font-medium transition-colors"
                  style={{
                    color: activeTab === tab.id ? '#8e2157' : '#6B7280',
                    borderBottom: activeTab === tab.id ? '2px solid #8e2157' : '2px solid transparent',
                    backgroundColor: activeTab === tab.id ? '#FEF2F2' : 'transparent',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            {loading ? (
              <div className="py-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
                <p
                  className="mt-4"
                  style={{
                    color: '#6B7280',
                    whiteSpace: 'normal'
                  }}
                >
                  Loading settings...
                </p>
              </div>
            ) : (
              <>
                {/* General Settings Tab */}
                {activeTab === 'general' && (
                  <div className="space-y-6" style={{ maxWidth: '700px' }}>
                    <div>
                      <h3
                        className="text-lg font-serif font-bold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal'
                        }}
                      >
                        General Settings
                      </h3>
                      <p
                        className="text-sm mb-6"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Configure your site&apos;s basic information and contact details
                      </p>
                    </div>

                    {/* Site Name */}
                    <div>
                      <label
                        htmlFor="site_name"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Site Name
                      </label>
                      <input
                        type="text"
                        id="site_name"
                        value={settings.site_name || ''}
                        onChange={(e) => handleChange('site_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Aline Mart"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        The name of your store displayed throughout the site
                      </p>
                    </div>

                    {/* Site Logo */}
                    <div>
                      <label
                        htmlFor="site_logo"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Site Logo URL
                      </label>
                      <input
                        type="url"
                        id="site_logo"
                        value={settings.site_logo || ''}
                        onChange={(e) => handleChange('site_logo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="/logo.png"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Path or URL to your site logo image
                      </p>
                    </div>

                    {/* Contact Email */}
                    <div>
                      <label
                        htmlFor="contact_email"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Contact Email
                      </label>
                      <input
                        type="email"
                        id="contact_email"
                        value={settings.contact_email || ''}
                        onChange={(e) => handleChange('contact_email', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="contact@alinemart.com"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Primary contact email for customer inquiries
                      </p>
                    </div>

                    {/* Contact Phone */}
                    <div>
                      <label
                        htmlFor="contact_phone"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Contact Phone
                      </label>
                      <input
                        type="tel"
                        id="contact_phone"
                        value={settings.contact_phone || ''}
                        onChange={(e) => handleChange('contact_phone', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="+1 (555) 123-4567"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Phone number displayed in the footer
                      </p>
                    </div>

                    {/* Contact Address */}
                    <div>
                      <label
                        htmlFor="contact_address"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Contact Address
                      </label>
                      <textarea
                        id="contact_address"
                        value={settings.contact_address || ''}
                        onChange={(e) => handleChange('contact_address', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="123 Luxury Ave, Suite 100&#10;New York, NY 10001"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Physical address of your business
                      </p>
                    </div>
                  </div>
                )}

                {/* SEO Settings Tab */}
                {activeTab === 'seo' && (
                  <div className="space-y-6" style={{ maxWidth: '700px' }}>
                    <div>
                      <h3
                        className="text-lg font-serif font-bold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal'
                        }}
                      >
                        SEO & Meta Tags
                      </h3>
                      <p
                        className="text-sm mb-6"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Optimize your site for search engines with default meta tags
                      </p>
                    </div>

                    {/* Default Page Title */}
                    <div>
                      <label
                        htmlFor="seo_title"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Default Page Title
                      </label>
                      <input
                        type="text"
                        id="seo_title"
                        value={settings.seo_title || ''}
                        onChange={(e) => handleChange('seo_title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Aline Mart - Luxury Multi-Brand Fashion"
                        maxLength={60}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className="text-xs"
                          style={{
                            color: '#6B7280',
                            whiteSpace: 'normal'
                          }}
                        >
                          Displayed in browser tabs and search results
                        </p>
                        <span
                          className="text-xs"
                          style={{
                            color: (settings.seo_title?.length || 0) > 60 ? '#DC2626' : '#6B7280'
                          }}
                        >
                          {settings.seo_title?.length || 0}/60
                        </span>
                      </div>
                    </div>

                    {/* Meta Description */}
                    <div>
                      <label
                        htmlFor="seo_description"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Meta Description
                      </label>
                      <textarea
                        id="seo_description"
                        value={settings.seo_description || ''}
                        onChange={(e) => handleChange('seo_description', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Discover luxury fashion from the world's top brands. Shop designer clothing, accessories, and more at Aline Mart."
                        maxLength={160}
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p
                          className="text-xs"
                          style={{
                            color: '#6B7280',
                            whiteSpace: 'normal'
                          }}
                        >
                          Brief description shown in search results
                        </p>
                        <span
                          className="text-xs"
                          style={{
                            color: (settings.seo_description?.length || 0) > 160 ? '#DC2626' : '#6B7280'
                          }}
                        >
                          {settings.seo_description?.length || 0}/160
                        </span>
                      </div>
                    </div>

                    {/* Meta Keywords */}
                    <div>
                      <label
                        htmlFor="seo_keywords"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Meta Keywords
                      </label>
                      <input
                        type="text"
                        id="seo_keywords"
                        value={settings.seo_keywords || ''}
                        onChange={(e) => handleChange('seo_keywords', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="luxury fashion, designer brands, premium clothing"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Comma-separated keywords (less important for modern SEO)
                      </p>
                    </div>

                    {/* Open Graph Image */}
                    <div>
                      <label
                        htmlFor="seo_og_image"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Social Share Image (OG Image)
                      </label>
                      <input
                        type="url"
                        id="seo_og_image"
                        value={settings.seo_og_image || ''}
                        onChange={(e) => handleChange('seo_og_image', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="https://alinemart.com/og-image.jpg"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Image displayed when sharing your site on social media (1200x630px recommended)
                      </p>
                    </div>
                  </div>
                )}

                {/* Email Settings Tab */}
                {activeTab === 'email' && (
                  <div className="space-y-6" style={{ maxWidth: '700px' }}>
                    <div>
                      <h3
                        className="text-lg font-serif font-bold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal'
                        }}
                      >
                        Email Configuration
                      </h3>
                      <p
                        className="text-sm mb-6"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Configure email sender information and SMTP settings for transactional emails
                      </p>
                    </div>

                    {/* From Name */}
                    <div>
                      <label
                        htmlFor="email_from_name"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        From Name
                      </label>
                      <input
                        type="text"
                        id="email_from_name"
                        value={settings.email_from_name || ''}
                        onChange={(e) => handleChange('email_from_name', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Aline Mart"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Name shown as the sender in outgoing emails
                      </p>
                    </div>

                    {/* From Email */}
                    <div>
                      <label
                        htmlFor="email_from_address"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        From Email Address
                      </label>
                      <input
                        type="email"
                        id="email_from_address"
                        value={settings.email_from_address || ''}
                        onChange={(e) => handleChange('email_from_address', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="noreply@alinemart.com"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Email address used as the sender
                      </p>
                    </div>

                    {/* Divider */}
                    <div
                      className="border-t pt-6"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <h4
                        className="text-sm font-semibold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal'
                        }}
                      >
                        SMTP Settings (Optional)
                      </h4>
                      <p
                        className="text-sm mb-4"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Configure SMTP server for sending emails. Leave empty to use default email service.
                      </p>
                    </div>

                    {/* SMTP Host */}
                    <div>
                      <label
                        htmlFor="email_smtp_host"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        SMTP Host
                      </label>
                      <input
                        type="text"
                        id="email_smtp_host"
                        value={settings.email_smtp_host || ''}
                        onChange={(e) => handleChange('email_smtp_host', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="smtp.gmail.com"
                      />
                    </div>

                    {/* SMTP Port */}
                    <div>
                      <label
                        htmlFor="email_smtp_port"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        SMTP Port
                      </label>
                      <input
                        type="text"
                        id="email_smtp_port"
                        value={settings.email_smtp_port || ''}
                        onChange={(e) => handleChange('email_smtp_port', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="587"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Common ports: 587 (TLS), 465 (SSL), 25 (unencrypted)
                      </p>
                    </div>

                    {/* SMTP Username */}
                    <div>
                      <label
                        htmlFor="email_smtp_username"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        SMTP Username
                      </label>
                      <input
                        type="text"
                        id="email_smtp_username"
                        value={settings.email_smtp_username || ''}
                        onChange={(e) => handleChange('email_smtp_username', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="your-email@example.com"
                      />
                    </div>

                    {/* SMTP Password */}
                    <div>
                      <label
                        htmlFor="email_smtp_password"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        SMTP Password
                      </label>
                      <input
                        type="password"
                        id="email_smtp_password"
                        value={settings.email_smtp_password || ''}
                        onChange={(e) => handleChange('email_smtp_password', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="••••••••"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Your SMTP password or app-specific password
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Save Reminder */}
        {hasChanges && (
          <div
            className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md flex items-start gap-3"
            style={{ minWidth: '280px' }}
          >
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p
              style={{
                color: '#92400e',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                flex: 1
              }}
            >
              You have unsaved changes. Click the &quot;Save Changes&quot; button at the top to save your settings.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
