'use client'

import { useState, useEffect, useRef } from 'react'
import { Save, Check, AlertCircle, Globe, Mail, Search, Truck, ImageIcon, Upload, X, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'

type TabType = 'general' | 'seo' | 'email' | 'shipping' | 'hero'

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

  // Shipping
  shipping_base_fee?: string
  shipping_rate_per_kg?: string

  // Hero
  hero_tagline?: string
  hero_headline?: string
  hero_subheadline?: string
  hero_cta_text?: string
  hero_cta_link?: string
  hero_stat_1_number?: string
  hero_stat_1_label?: string
  hero_stat_2_number?: string
  hero_stat_2_label?: string
  hero_images?: string
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('general')
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const [uploading, setUploading] = useState(false)
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null)
  const [imageDimensions, setImageDimensions] = useState<Record<string, { w: number; h: number }>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)
  const replaceFileInputRef = useRef<HTMLInputElement>(null)

  const MAX_WIDTH = 1920
  const MAX_HEIGHT = 1080

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

  // Hero image helpers
  const getHeroImages = (): string[] => {
    try {
      const parsed = JSON.parse(settings.hero_images || '[]')
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }

  const setHeroImages = (images: string[]) => {
    handleChange('hero_images', JSON.stringify(images))
  }

  // Client-side image resize using Canvas API
  const resizeImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new window.Image()
      const url = URL.createObjectURL(file)
      img.onload = () => {
        URL.revokeObjectURL(url)
        let { width, height } = img

        // Only downscale, never upscale
        if (width <= MAX_WIDTH && height <= MAX_HEIGHT) {
          resolve(file)
          return
        }

        const ratio = Math.min(MAX_WIDTH / width, MAX_HEIGHT / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }

        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            const resized = new File([blob], file.name, { type: file.type })
            resolve(resized)
          },
          file.type,
          0.9
        )
      }
      img.onerror = () => {
        URL.revokeObjectURL(url)
        reject(new Error('Failed to load image for resizing'))
      }
      img.src = url
    })
  }

  // Upload a file (shared by add + replace)
  const uploadHeroFile = async (file: File): Promise<string> => {
    const resized = await resizeImage(file)
    const formData = new FormData()
    formData.append('image', resized)

    const response = await fetch('/api/admin/hero/upload', {
      method: 'POST',
      body: formData
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Upload failed')
    }

    return data.url as string
  }

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      const url = await uploadHeroFile(file)
      const current = getHeroImages()
      setHeroImages([...current, url])
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to upload image'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleReplaceImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || replaceIndex === null) return

    try {
      setUploading(true)
      const url = await uploadHeroFile(file)
      const current = getHeroImages()
      const updated = [...current]
      updated[replaceIndex] = url
      setHeroImages(updated)
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to replace image'
      setErrorMessage(message)
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setUploading(false)
      setReplaceIndex(null)
      if (replaceFileInputRef.current) replaceFileInputRef.current.value = ''
    }
  }

  const removeHeroImage = (index: number) => {
    const current = getHeroImages()
    setHeroImages(current.filter((_, i) => i !== index))
  }

  const moveHeroImage = (index: number, direction: 'up' | 'down') => {
    const current = getHeroImages()
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= current.length) return
    const updated = [...current]
    ;[updated[index], updated[newIndex]] = [updated[newIndex], updated[index]]
    setHeroImages(updated)
  }

  // Track image dimensions when hero images change
  useEffect(() => {
    const images = getHeroImages()
    images.forEach((url) => {
      if (imageDimensions[url]) return
      const img = new window.Image()
      img.onload = () => {
        setImageDimensions((prev) => ({
          ...prev,
          [url]: { w: img.naturalWidth, h: img.naturalHeight }
        }))
      }
      img.src = url
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.hero_images])

  const tabs = [
    { id: 'general' as TabType, label: 'General', icon: Globe },
    { id: 'seo' as TabType, label: 'SEO & Meta', icon: Search },
    { id: 'email' as TabType, label: 'Email', icon: Mail },
    { id: 'shipping' as TabType, label: 'Shipping', icon: Truck },
    { id: 'hero' as TabType, label: 'Hero', icon: ImageIcon }
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

                {/* Shipping Settings Tab */}
                {activeTab === 'shipping' && (
                  <div className="space-y-6" style={{ maxWidth: '700px' }}>
                    <div>
                      <h3
                        className="text-lg font-serif font-bold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal'
                        }}
                      >
                        Shipping Configuration
                      </h3>
                      <p
                        className="text-sm mb-6"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Configure weight-based shipping rates. Formula: <strong>Shipping = Base Fee + (Total Weight &times; Rate per Kg)</strong>
                      </p>
                    </div>

                    {/* Base Shipping Fee */}
                    <div>
                      <label
                        htmlFor="shipping_base_fee"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Base Shipping Fee (BDT)
                      </label>
                      <input
                        type="number"
                        id="shipping_base_fee"
                        value={settings.shipping_base_fee || ''}
                        onChange={(e) => handleChange('shipping_base_fee', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="60"
                        min="0"
                        step="1"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Fixed base fee applied to every order regardless of weight
                      </p>
                    </div>

                    {/* Rate per Kg */}
                    <div>
                      <label
                        htmlFor="shipping_rate_per_kg"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Rate per Kg (BDT)
                      </label>
                      <input
                        type="number"
                        id="shipping_rate_per_kg"
                        value={settings.shipping_rate_per_kg || ''}
                        onChange={(e) => handleChange('shipping_rate_per_kg', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="20"
                        min="0"
                        step="1"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Additional cost per kilogram of total order weight
                      </p>
                    </div>

                    {/* Example Calculation */}
                    <div
                      className="border-t pt-6"
                      style={{ borderColor: '#E5E7EB' }}
                    >
                      <h4
                        className="text-sm font-semibold mb-3"
                        style={{ color: '#2C2C2C' }}
                      >
                        Example Calculation
                      </h4>
                      <div
                        className="p-4 rounded-md"
                        style={{ backgroundColor: '#FAFAF8', border: '1px solid #E8E6E3' }}
                      >
                        <p className="text-sm" style={{ color: '#2C2C2C' }}>
                          For a 2kg order:
                        </p>
                        <p className="text-sm font-medium mt-1" style={{ color: '#8e2157' }}>
                          ৳{parseFloat(settings.shipping_base_fee || '60')} + (2 &times; ৳{parseFloat(settings.shipping_rate_per_kg || '20')}) = ৳{Math.round(parseFloat(settings.shipping_base_fee || '60') + 2 * parseFloat(settings.shipping_rate_per_kg || '20'))}
                        </p>
                        <p className="text-xs mt-2" style={{ color: '#6B7280' }}>
                          Products without a weight value are treated as 0kg (only the base fee applies).
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hero Settings Tab */}
                {activeTab === 'hero' && (
                  <div className="space-y-6" style={{ maxWidth: '700px', minWidth: '320px' }}>
                    <div>
                      <h3
                        className="text-lg font-serif font-bold mb-4"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Hero Carousel
                      </h3>
                      <p
                        className="text-sm mb-6"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          display: 'block',
                          minWidth: '100%'
                        }}
                      >
                        Configure the homepage hero section text, CTA, stats, and carousel images
                      </p>
                    </div>

                    {/* Tagline */}
                    <div>
                      <label
                        htmlFor="hero_tagline"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Tagline
                      </label>
                      <input
                        type="text"
                        id="hero_tagline"
                        value={settings.hero_tagline || ''}
                        onChange={(e) => handleChange('hero_tagline', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Est. 2024"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Small text above the headline (e.g. &quot;Est. 2024&quot;)
                      </p>
                    </div>

                    {/* Headline */}
                    <div>
                      <label
                        htmlFor="hero_headline"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Headline
                      </label>
                      <input
                        type="text"
                        id="hero_headline"
                        value={settings.hero_headline || ''}
                        onChange={(e) => handleChange('hero_headline', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="World's Finest Brands, One Destination"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Main hero heading. Text after the first comma appears on a second line in italic
                      </p>
                    </div>

                    {/* Subheadline */}
                    <div>
                      <label
                        htmlFor="hero_subheadline"
                        className="block text-sm font-medium mb-2"
                        style={{
                          color: '#2C2C2C',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        Subheadline
                      </label>
                      <textarea
                        id="hero_subheadline"
                        value={settings.hero_subheadline || ''}
                        onChange={(e) => handleChange('hero_subheadline', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="Discover curated luxury from Rolex, Gucci, Prada, and the world's most prestigious houses"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        Supporting text below the headline
                      </p>
                    </div>

                    {/* CTA */}
                    <div
                      className="grid grid-cols-2 gap-4"
                      style={{ minWidth: '280px' }}
                    >
                      <div>
                        <label
                          htmlFor="hero_cta_text"
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: '#2C2C2C',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          CTA Button Text
                        </label>
                        <input
                          type="text"
                          id="hero_cta_text"
                          value={settings.hero_cta_text || ''}
                          onChange={(e) => handleChange('hero_cta_text', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          style={{
                            fontSize: '14px',
                            color: '#2C2C2C'
                          }}
                          placeholder="Explore Collection"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="hero_cta_link"
                          className="block text-sm font-medium mb-2"
                          style={{
                            color: '#2C2C2C',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          CTA Link
                        </label>
                        <input
                          type="text"
                          id="hero_cta_link"
                          value={settings.hero_cta_link || ''}
                          onChange={(e) => handleChange('hero_cta_link', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          style={{
                            fontSize: '14px',
                            color: '#2C2C2C'
                          }}
                          placeholder="/products"
                        />
                      </div>
                    </div>

                    {/* Stats */}
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
                        Stats
                      </h4>
                      <div
                        className="grid grid-cols-2 gap-4"
                        style={{ minWidth: '280px' }}
                      >
                        <div>
                          <label
                            htmlFor="hero_stat_1_number"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: '#2C2C2C',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Stat 1 Number
                          </label>
                          <input
                            type="text"
                            id="hero_stat_1_number"
                            value={settings.hero_stat_1_number || ''}
                            onChange={(e) => handleChange('hero_stat_1_number', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            style={{
                              fontSize: '14px',
                              color: '#2C2C2C'
                            }}
                            placeholder="20+"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hero_stat_1_label"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: '#2C2C2C',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Stat 1 Label
                          </label>
                          <input
                            type="text"
                            id="hero_stat_1_label"
                            value={settings.hero_stat_1_label || ''}
                            onChange={(e) => handleChange('hero_stat_1_label', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            style={{
                              fontSize: '14px',
                              color: '#2C2C2C'
                            }}
                            placeholder="BRANDS"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hero_stat_2_number"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: '#2C2C2C',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Stat 2 Number
                          </label>
                          <input
                            type="text"
                            id="hero_stat_2_number"
                            value={settings.hero_stat_2_number || ''}
                            onChange={(e) => handleChange('hero_stat_2_number', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            style={{
                              fontSize: '14px',
                              color: '#2C2C2C'
                            }}
                            placeholder="100+"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="hero_stat_2_label"
                            className="block text-sm font-medium mb-2"
                            style={{
                              color: '#2C2C2C',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Stat 2 Label
                          </label>
                          <input
                            type="text"
                            id="hero_stat_2_label"
                            value={settings.hero_stat_2_label || ''}
                            onChange={(e) => handleChange('hero_stat_2_label', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            style={{
                              fontSize: '14px',
                              color: '#2C2C2C'
                            }}
                            placeholder="PRODUCTS"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Images */}
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
                        Carousel Images
                      </h4>
                      <p
                        className="text-sm mb-4"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal',
                          display: 'block',
                          minWidth: '100%'
                        }}
                      >
                        Images rotate in the hero carousel. Recommended: landscape orientation, at least 1920px wide.
                      </p>

                      {/* Current Images Grid */}
                      {getHeroImages().length > 0 && (
                        <div
                          className="grid grid-cols-2 gap-4 mb-4"
                          style={{ minWidth: '280px' }}
                        >
                          {getHeroImages().map((url, index) => {
                            const dims = imageDimensions[url]
                            const heroImages = getHeroImages()
                            return (
                              <div
                                key={`${index}-${url}`}
                                className="relative group overflow-hidden"
                                style={{
                                  borderRadius: '8px',
                                  border: '1px solid #E5E7EB',
                                  backgroundColor: '#F9FAFB'
                                }}
                              >
                                {/* Image Preview */}
                                <div style={{ aspectRatio: '16/9', position: 'relative' }}>
                                  <img
                                    src={url}
                                    alt={`Hero ${index + 1}`}
                                    style={{
                                      width: '100%',
                                      height: '100%',
                                      objectFit: 'cover',
                                      display: 'block',
                                      borderRadius: '8px 8px 0 0'
                                    }}
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                      if (e.currentTarget.parentElement) {
                                        e.currentTarget.parentElement.style.background = '#F3F4F6'
                                      }
                                    }}
                                  />
                                  {/* Image Number Badge */}
                                  <div
                                    className="absolute top-2 left-2 px-2 py-0.5 rounded text-xs font-bold"
                                    style={{
                                      backgroundColor: 'rgba(0,0,0,0.6)',
                                      color: '#FFFFFF'
                                    }}
                                  >
                                    #{index + 1}
                                  </div>
                                </div>

                                {/* Image Info & Actions Bar */}
                                <div className="p-2" style={{ borderTop: '1px solid #E5E7EB' }}>
                                  {/* Dimensions */}
                                  <p className="text-xs mb-2 truncate" style={{ color: '#6B7280' }}>
                                    {dims ? `${dims.w} × ${dims.h}px` : 'Loading...'}
                                    {dims && (dims.w > MAX_WIDTH || dims.h > MAX_HEIGHT) && (
                                      <span style={{ color: '#F59E0B' }}> (oversized)</span>
                                    )}
                                  </p>

                                  {/* Action Buttons */}
                                  <div className="flex items-center gap-1">
                                    {/* Move Up */}
                                    <button
                                      onClick={() => moveHeroImage(index, 'up')}
                                      disabled={index === 0}
                                      className="p-1.5 rounded transition-colors"
                                      style={{
                                        backgroundColor: index === 0 ? '#F3F4F6' : '#E5E7EB',
                                        color: index === 0 ? '#D1D5DB' : '#374151',
                                        cursor: index === 0 ? 'not-allowed' : 'pointer'
                                      }}
                                      title="Move up"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Move Down */}
                                    <button
                                      onClick={() => moveHeroImage(index, 'down')}
                                      disabled={index === heroImages.length - 1}
                                      className="p-1.5 rounded transition-colors"
                                      style={{
                                        backgroundColor: index === heroImages.length - 1 ? '#F3F4F6' : '#E5E7EB',
                                        color: index === heroImages.length - 1 ? '#D1D5DB' : '#374151',
                                        cursor: index === heroImages.length - 1 ? 'not-allowed' : 'pointer'
                                      }}
                                      title="Move down"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Replace */}
                                    <button
                                      onClick={() => {
                                        setReplaceIndex(index)
                                        replaceFileInputRef.current?.click()
                                      }}
                                      disabled={uploading}
                                      className="p-1.5 rounded transition-colors"
                                      style={{
                                        backgroundColor: '#E0E7FF',
                                        color: '#4338CA',
                                        cursor: uploading ? 'not-allowed' : 'pointer',
                                        opacity: uploading ? 0.5 : 1
                                      }}
                                      title="Replace image"
                                    >
                                      <RefreshCw className="w-3.5 h-3.5" />
                                    </button>

                                    {/* Spacer */}
                                    <div style={{ flex: 1 }} />

                                    {/* Delete */}
                                    <button
                                      onClick={() => removeHeroImage(index)}
                                      className="p-1.5 rounded transition-colors"
                                      style={{
                                        backgroundColor: '#FEE2E2',
                                        color: '#DC2626',
                                        cursor: 'pointer'
                                      }}
                                      title="Delete image"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Hidden file inputs */}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleHeroImageUpload}
                      />
                      <input
                        ref={replaceFileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleReplaceImage}
                      />

                      {/* Upload Button */}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all"
                        style={{
                          color: '#6B7280',
                          border: '2px dashed #D1D5DB',
                          cursor: uploading ? 'not-allowed' : 'pointer',
                          opacity: uploading ? 0.6 : 1,
                          backgroundColor: 'transparent',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        <Upload className="w-4 h-4" />
                        {uploading ? 'Uploading...' : 'Upload Image'}
                      </button>
                      <p
                        className="mt-2 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal',
                          wordBreak: 'normal'
                        }}
                      >
                        JPEG, PNG, or WebP. Max 5MB. Images larger than {MAX_WIDTH}×{MAX_HEIGHT}px are auto-resized.
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
