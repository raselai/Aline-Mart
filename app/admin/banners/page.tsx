'use client'

import { useState, useEffect, useRef } from 'react'
import { ImageIcon, Plus, Pencil, Trash2, Upload, X, Eye, EyeOff } from 'lucide-react'

interface CategoryBanner {
  id: string
  categoryId: string
  imageUrl: string
  title: string | null
  subtitle: string | null
  linkUrl: string | null
  isActive: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
}

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<CategoryBanner[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBanner, setEditingBanner] = useState<CategoryBanner | null>(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formCategoryId, setFormCategoryId] = useState('')
  const [formImageUrl, setFormImageUrl] = useState('')
  const [formTitle, setFormTitle] = useState('')
  const [formSubtitle, setFormSubtitle] = useState('')
  const [formLinkUrl, setFormLinkUrl] = useState('')
  const [formIsActive, setFormIsActive] = useState(true)

  useEffect(() => {
    fetchBanners()
    fetchCategories()
  }, [])

  const fetchBanners = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/category-banners')
      if (!res.ok) throw new Error('Failed to fetch banners')
      const data = await res.json()
      setBanners(data.banners || [])
    } catch (err) {
      console.error('Error fetching banners:', err)
      setError('Failed to load banners')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (!res.ok) throw new Error('Failed to fetch categories')
      const data = await res.json()
      setCategories(data.data?.all || [])
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const resetForm = () => {
    setFormCategoryId('')
    setFormImageUrl('')
    setFormTitle('')
    setFormSubtitle('')
    setFormLinkUrl('')
    setFormIsActive(true)
    setEditingBanner(null)
  }

  const openAddModal = () => {
    resetForm()
    setShowModal(true)
  }

  const openEditModal = (banner: CategoryBanner) => {
    setEditingBanner(banner)
    setFormCategoryId(banner.categoryId)
    setFormImageUrl(banner.imageUrl)
    setFormTitle(banner.title || '')
    setFormSubtitle(banner.subtitle || '')
    setFormLinkUrl(banner.linkUrl || '')
    setFormIsActive(banner.isActive)
    setShowModal(true)
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      setError('')
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch('/api/admin/category-banners/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Upload failed')
      }

      const data = await res.json()
      setFormImageUrl(data.url)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed'
      setError(message)
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    if (!formCategoryId || !formImageUrl) {
      setError('Category and image are required')
      return
    }

    try {
      setSaving(true)
      setError('')

      if (editingBanner) {
        // Update existing
        const res = await fetch(`/api/admin/category-banners/${editingBanner.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: formImageUrl,
            title: formTitle,
            subtitle: formSubtitle,
            linkUrl: formLinkUrl,
            isActive: formIsActive,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to update')
        }
      } else {
        // Create/upsert
        const res = await fetch('/api/admin/category-banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            categoryId: formCategoryId,
            imageUrl: formImageUrl,
            title: formTitle,
            subtitle: formSubtitle,
            linkUrl: formLinkUrl,
            isActive: formIsActive,
          }),
        })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || 'Failed to create')
        }
      }

      setShowModal(false)
      resetForm()
      setSuccess(editingBanner ? 'Banner updated successfully' : 'Banner created successfully')
      setTimeout(() => setSuccess(''), 3000)
      fetchBanners()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to save banner'
      setError(message)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (banner: CategoryBanner) => {
    if (!confirm(`Delete banner for "${banner.category?.name || 'Unknown'}"?`)) return

    try {
      const res = await fetch(`/api/admin/category-banners/${banner.id}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')

      setSuccess('Banner deleted')
      setTimeout(() => setSuccess(''), 3000)
      fetchBanners()
    } catch (err) {
      console.error('Error deleting banner:', err)
      setError('Failed to delete banner')
    }
  }

  const handleToggleActive = async (banner: CategoryBanner) => {
    try {
      const res = await fetch(`/api/admin/category-banners/${banner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !banner.isActive }),
      })
      if (!res.ok) throw new Error('Failed to update')
      fetchBanners()
    } catch (err) {
      console.error('Error toggling banner:', err)
      setError('Failed to update banner')
    }
  }

  // Categories that don't already have a banner (for add modal dropdown)
  const availableCategories = categories.filter(
    (cat) => !banners.some((b) => b.categoryId === cat.id)
  )

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>Category Banners</h1>
          <p style={{ color: '#6b7280', marginTop: '4px' }}>
            Manage promotional banners displayed on category pages
          </p>
        </div>
        <button
          onClick={openAddModal}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            background: 'linear-gradient(135deg, #8e2157, #5c0931)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '14px',
          }}
        >
          <Plus className="w-4 h-4" />
          Add Banner
        </button>
      </div>

      {/* Success/Error messages */}
      {success && (
        <div style={{ padding: '12px 16px', background: '#dcfce7', color: '#166534', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#991b1b', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {error}
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#991b1b' }}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Banners List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#6b7280' }}>Loading banners...</div>
      ) : banners.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          background: 'white',
          borderRadius: '12px',
          border: '1px solid #e5e7eb',
        }}>
          <ImageIcon style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 16px' }} />
          <p style={{ color: '#6b7280', marginBottom: '8px' }}>No category banners yet</p>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Add a banner to display promotional content on category pages
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {banners.map((banner) => (
            <div
              key={banner.id}
              style={{
                background: 'white',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                overflow: 'hidden',
                display: 'flex',
                opacity: banner.isActive ? 1 : 0.6,
              }}
            >
              {/* Thumbnail */}
              <div style={{ width: '200px', minHeight: '100px', flexShrink: 0, position: 'relative' }}>
                <img
                  src={banner.imageUrl}
                  alt={banner.title || 'Banner'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                {!banner.isActive && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '8px',
                    background: '#ef4444',
                    color: 'white',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}>
                    Inactive
                  </div>
                )}
              </div>

              {/* Info */}
              <div style={{ flex: 1, padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontWeight: 600, color: '#1f2937', marginBottom: '4px' }}>
                    {banner.category?.name || 'Unknown Category'}
                  </h3>
                  {banner.title && (
                    <p style={{ color: '#6b7280', fontSize: '14px' }}>{banner.title}</p>
                  )}
                  {banner.subtitle && (
                    <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px' }}>{banner.subtitle}</p>
                  )}
                  {banner.linkUrl && (
                    <p style={{ color: '#8e2157', fontSize: '12px', marginTop: '4px' }}>
                      Link: {banner.linkUrl}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                  <button
                    onClick={() => handleToggleActive(banner)}
                    title={banner.isActive ? 'Deactivate' : 'Activate'}
                    style={{
                      padding: '8px',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: banner.isActive ? '#16a34a' : '#9ca3af',
                    }}
                  >
                    {banner.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => openEditModal(banner)}
                    title="Edit"
                    style={{
                      padding: '8px',
                      background: '#f3f4f6',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#6b7280',
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner)}
                    title="Delete"
                    style={{
                      padding: '8px',
                      background: '#fef2f2',
                      border: '1px solid #fecaca',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      color: '#ef4444',
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false)
              resetForm()
            }
          }}
        >
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              width: '100%',
              maxWidth: '520px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#1f2937' }}>
                {editingBanner ? 'Edit Banner' : 'Add Banner'}
              </h2>
              <button
                onClick={() => { setShowModal(false); resetForm() }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Category *
              </label>
              {editingBanner ? (
                <div style={{ padding: '10px 12px', background: '#f3f4f6', borderRadius: '8px', color: '#6b7280', fontSize: '14px' }}>
                  {editingBanner.category?.name || 'Unknown'}
                </div>
              ) : (
                <select
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    color: '#374151',
                    background: 'white',
                  }}
                >
                  <option value="">Select a category</option>
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Image Upload */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Banner Image *
              </label>
              {formImageUrl ? (
                <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', marginBottom: '8px' }}>
                  <img
                    src={formImageUrl}
                    alt="Banner preview"
                    style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                  />
                  <button
                    onClick={() => setFormImageUrl('')}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.6)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '50%',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    width: '100%',
                    padding: '24px',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    color: '#6b7280',
                    fontSize: '14px',
                  }}
                >
                  <Upload className="w-6 h-6" />
                  {uploading ? 'Uploading...' : 'Click to upload image'}
                  <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                    JPEG, PNG, or WebP. Max 5MB. Recommended: 1200x400px
                  </span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpload}
                style={{ display: 'none' }}
              />
            </div>

            {/* Title */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Title (optional)
              </label>
              <input
                type="text"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g. Summer Collection"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Subtitle */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Subtitle (optional)
              </label>
              <input
                type="text"
                value={formSubtitle}
                onChange={(e) => setFormSubtitle(e.target.value)}
                placeholder="e.g. Up to 40% off selected items"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Link URL */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '14px', color: '#374151', marginBottom: '6px' }}>
                Link URL (optional)
              </label>
              <input
                type="text"
                value={formLinkUrl}
                onChange={(e) => setFormLinkUrl(e.target.value)}
                placeholder="e.g. /products?sale=true"
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Active Toggle */}
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setFormIsActive(!formIsActive)}
                style={{
                  width: '44px',
                  height: '24px',
                  borderRadius: '12px',
                  border: 'none',
                  background: formIsActive ? '#8e2157' : '#d1d5db',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'background 200ms',
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'white',
                    position: 'absolute',
                    top: '2px',
                    left: formIsActive ? '22px' : '2px',
                    transition: 'left 200ms',
                  }}
                />
              </button>
              <span style={{ fontSize: '14px', color: '#374151' }}>
                {formIsActive ? 'Active — visible on category page' : 'Inactive — hidden from category page'}
              </span>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => { setShowModal(false); resetForm() }}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  background: 'white',
                  cursor: 'pointer',
                  fontSize: '14px',
                  color: '#374151',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formCategoryId || !formImageUrl}
                style={{
                  padding: '10px 20px',
                  background: saving || !formCategoryId || !formImageUrl
                    ? '#d1d5db'
                    : 'linear-gradient(135deg, #8e2157, #5c0931)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: saving || !formCategoryId || !formImageUrl ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: '14px',
                }}
              >
                {saving ? 'Saving...' : editingBanner ? 'Update Banner' : 'Create Banner'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
