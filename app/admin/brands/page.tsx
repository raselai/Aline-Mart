'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Plus, Search, Edit, Trash2, X, Check, AlertCircle } from 'lucide-react'

interface Brand {
  id: number
  name: string
  slug: string
  description: string | null
  logo: string | null
  featured: boolean
  displayOrder: number
  productCount?: number
  createdAt: string
}

interface BrandFormData {
  name: string
  slug: string
  description: string
  logo: string
  featured: boolean
  displayOrder: number
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([])
  const [filteredBrands, setFilteredBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null)

  // Form state
  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    description: '',
    logo: '',
    featured: false,
    displayOrder: 0
  })
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Logo upload states
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string>('')
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [useUrlInput, setUseUrlInput] = useState(false)

  // Success/error messages
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch brands
  useEffect(() => {
    fetchBrands()
  }, [sortBy])

  const fetchBrands = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/brands?sort=${sortBy}&limit=100`)

      if (!response.ok) {
        throw new Error('Failed to fetch brands')
      }

      const data = await response.json()
      setBrands(data.brands || [])
      setFilteredBrands(data.brands || [])
    } catch (error) {
      console.error('Error fetching brands:', error)
      setErrorMessage('Failed to load brands')
    } finally {
      setLoading(false)
    }
  }

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredBrands(brands)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = brands.filter(brand =>
      brand.name.toLowerCase().includes(query) ||
      brand.slug.toLowerCase().includes(query) ||
      (brand.description && brand.description.toLowerCase().includes(query))
    )
    setFilteredBrands(filtered)
  }, [searchQuery, brands])

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }))
  }

  // Handle logo file selection
  const handleLogoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Upload logo to server
  const handleUploadLogo = async (): Promise<string | null> => {
    if (!logoFile) return null

    try {
      setUploadingLogo(true)
      const formData = new FormData()
      formData.append('logo', logoFile)

      const response = await fetch('/api/admin/brands/upload-logo', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload logo')
      }

      return data.url
    } catch (error: any) {
      console.error('Logo upload error:', error)
      setErrorMessage(error.message || 'Failed to upload logo')
      setTimeout(() => setErrorMessage(''), 5000)
      return null
    } finally {
      setUploadingLogo(false)
    }
  }

  // Clear logo file
  const clearLogoFile = () => {
    setLogoFile(null)
    setLogoPreview('')
  }

  // Open create modal
  const handleCreateClick = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo: '',
      featured: false,
      displayOrder: 0
    })
    setFormErrors([])
    setLogoFile(null)
    setLogoPreview('')
    setUseUrlInput(false)
    setShowCreateModal(true)
  }

  // Open edit modal
  const handleEditClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setFormData({
      name: brand.name,
      slug: brand.slug,
      description: brand.description || '',
      logo: brand.logo || '',
      featured: brand.featured,
      displayOrder: brand.displayOrder
    })
    setFormErrors([])
    setLogoFile(null)
    setLogoPreview('')
    setUseUrlInput(false)
    setShowEditModal(true)
  }

  // Open delete modal
  const handleDeleteClick = (brand: Brand) => {
    setSelectedBrand(brand)
    setShowDeleteModal(true)
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push('Brand name is required')
    }
    if (!formData.slug.trim()) {
      errors.push('Slug is required')
    }
    if (formData.displayOrder < 0) {
      errors.push('Display order must be 0 or greater')
    }

    setFormErrors(errors)
    return errors.length === 0
  }

  // Create brand
  const handleCreate = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)

      // Upload logo if file is selected
      let logoUrl = formData.logo
      if (logoFile) {
        const uploadedUrl = await handleUploadLogo()
        if (!uploadedUrl) {
          setSubmitting(false)
          return // Upload failed, don't proceed
        }
        logoUrl = uploadedUrl
      }

      const response = await fetch('/api/admin/brands', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo: logoUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create brand')
      }

      setSuccessMessage(`Brand "${formData.name}" created successfully!`)
      setShowCreateModal(false)
      fetchBrands()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create brand')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Update brand
  const handleUpdate = async () => {
    if (!selectedBrand || !validateForm()) return

    try {
      setSubmitting(true)

      // Upload logo if file is selected
      let logoUrl = formData.logo
      if (logoFile) {
        const uploadedUrl = await handleUploadLogo()
        if (!uploadedUrl) {
          setSubmitting(false)
          return // Upload failed, don't proceed
        }
        logoUrl = uploadedUrl
      }

      const response = await fetch(`/api/admin/brands/${selectedBrand.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          logo: logoUrl
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update brand')
      }

      setSuccessMessage(`Brand "${formData.name}" updated successfully!`)
      setShowEditModal(false)
      fetchBrands()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update brand')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Delete brand
  const handleDelete = async () => {
    if (!selectedBrand) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/brands/${selectedBrand.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete brand')
      }

      setSuccessMessage(data.message)
      setShowDeleteModal(false)
      fetchBrands()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete brand')
      setTimeout(() => setErrorMessage(''), 5000)
      setShowDeleteModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-8" style={{ backgroundColor: '#F5F5F5', minHeight: '100vh' }}>
      <div className="w-full mx-auto" style={{ maxWidth: '1400px', minWidth: '320px' }}>
        {/* Header */}
        <div className="mb-8">
          <h1
            className="text-3xl font-serif font-bold mb-2"
            style={{
              color: '#2C2C2C',
              whiteSpace: 'normal',
              wordBreak: 'normal'
            }}
          >
            Brand Management
          </h1>
          <p
            style={{
              color: '#6B7280',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              display: 'block',
              minWidth: '100%'
            }}
          >
            Manage your luxury brands, logos, and brand information
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

        {/* Toolbar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                style={{ width: '20px', height: '20px' }}
              />
              <input
                type="text"
                placeholder="Search brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                style={{
                  fontSize: '14px',
                  color: '#2C2C2C'
                }}
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md"
                style={{
                  fontSize: '14px',
                  color: '#2C2C2C',
                  minWidth: '150px'
                }}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="displayOrder-asc">Display Order (Low-High)</option>
                <option value="displayOrder-desc">Display Order (High-Low)</option>
                <option value="created-desc">Newest First</option>
                <option value="created-asc">Oldest First</option>
              </select>

              {/* Create Button */}
              <button
                onClick={handleCreateClick}
                className="flex items-center gap-2 px-6 py-2 text-white rounded-md font-medium transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                  whiteSpace: 'nowrap'
                }}
              >
                <Plus className="w-5 h-5" />
                Create Brand
              </button>
            </div>
          </div>
        </div>

        {/* Brands Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy"></div>
              <p
                className="mt-4"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal'
                }}
              >
                Loading brands...
              </p>
            </div>
          ) : filteredBrands.length === 0 ? (
            <div className="p-12 text-center">
              <p
                className="text-lg mb-2"
                style={{
                  color: '#2C2C2C',
                  fontWeight: 'bold',
                  whiteSpace: 'normal'
                }}
              >
                {searchQuery ? 'No brands found' : 'No brands yet'}
              </p>
              <p
                className="mb-6"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal'
                }}
              >
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by creating your first brand'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleCreateClick}
                  className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-md font-medium"
                  style={{
                    background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                  }}
                >
                  <Plus className="w-5 h-5" />
                  Create First Brand
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Logo
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Name
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Slug
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Products
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Featured
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Display Order
                    </th>
                    <th
                      className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider"
                      style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBrands.map((brand) => (
                    <tr
                      key={brand.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {/* Logo */}
                      <td className="px-6 py-4">
                        {brand.logo ? (
                          <Image
                            src={brand.logo}
                            alt={brand.name}
                            width={60}
                            height={40}
                            className="object-contain"
                            style={{ maxHeight: '40px' }}
                          />
                        ) : (
                          <div
                            className="flex items-center justify-center bg-gray-100 rounded"
                            style={{
                              width: '60px',
                              height: '40px',
                              color: '#9CA3AF',
                              fontSize: '12px'
                            }}
                          >
                            No logo
                          </div>
                        )}
                      </td>

                      {/* Name */}
                      <td className="px-6 py-4">
                        <div
                          className="font-medium"
                          style={{
                            color: '#2C2C2C',
                            whiteSpace: 'normal',
                            wordBreak: 'normal',
                            maxWidth: '200px'
                          }}
                        >
                          {brand.name}
                        </div>
                        {brand.description && (
                          <div
                            className="text-sm mt-1"
                            style={{
                              color: '#6B7280',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              maxWidth: '200px'
                            }}
                          >
                            {brand.description}
                          </div>
                        )}
                      </td>

                      {/* Slug */}
                      <td className="px-6 py-4">
                        <code
                          className="text-sm px-2 py-1 bg-gray-100 rounded"
                          style={{
                            color: '#2C2C2C',
                            fontFamily: 'monospace'
                          }}
                        >
                          {brand.slug}
                        </code>
                      </td>

                      {/* Product Count */}
                      <td className="px-6 py-4">
                        <span
                          style={{
                            color: '#2C2C2C',
                            fontSize: '14px'
                          }}
                        >
                          {brand.productCount || 0}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-4">
                        {brand.featured ? (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: '#D1FAE5',
                              color: '#065F46'
                            }}
                          >
                            Yes
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              backgroundColor: '#F3F4F6',
                              color: '#6B7280'
                            }}
                          >
                            No
                          </span>
                        )}
                      </td>

                      {/* Display Order */}
                      <td className="px-6 py-4">
                        <span
                          style={{
                            color: '#2C2C2C',
                            fontSize: '14px'
                          }}
                        >
                          {brand.displayOrder}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(brand)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit brand"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(brand)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete brand"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Brand count */}
        {!loading && filteredBrands.length > 0 && (
          <div
            className="mt-4 text-sm"
            style={{
              color: '#6B7280',
              whiteSpace: 'normal'
            }}
          >
            Showing {filteredBrands.length} of {brands.length} brands
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => {
            setShowCreateModal(false)
            setShowEditModal(false)
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full overflow-hidden"
            style={{ maxWidth: '600px', minWidth: '320px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: '#E5E7EB' }}
            >
              <h2
                className="text-xl font-serif font-bold"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap'
                }}
              >
                {showCreateModal ? 'Create New Brand' : 'Edit Brand'}
              </h2>
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 max-h-[70vh] overflow-y-auto">
              {/* Error Messages */}
              {formErrors.length > 0 && (
                <div
                  className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md"
                  style={{ minWidth: '280px' }}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p
                        className="font-medium mb-1"
                        style={{
                          color: '#991b1b',
                          whiteSpace: 'normal'
                        }}
                      >
                        Please fix the following errors:
                      </p>
                      <ul className="list-disc list-inside space-y-1">
                        {formErrors.map((error, index) => (
                          <li
                            key={index}
                            style={{
                              color: '#991b1b',
                              fontSize: '14px',
                              whiteSpace: 'normal',
                              wordBreak: 'normal'
                            }}
                          >
                            {error}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Brand Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    style={{
                      fontSize: '14px',
                      color: '#2C2C2C'
                    }}
                    placeholder="e.g., Gucci"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label
                    htmlFor="slug"
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Slug *
                  </label>
                  <input
                    type="text"
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md font-mono"
                    style={{
                      fontSize: '14px',
                      color: '#2C2C2C'
                    }}
                    placeholder="e.g., gucci"
                  />
                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: '#6B7280',
                      whiteSpace: 'normal'
                    }}
                  >
                    URL-friendly version (auto-generated from name)
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md resize-none"
                    style={{
                      fontSize: '14px',
                      color: '#2C2C2C'
                    }}
                    placeholder="Brief description of the brand..."
                  />
                </div>

                {/* Logo Upload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      className="block text-sm font-medium"
                      style={{
                        color: '#2C2C2C',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Brand Logo
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(!useUrlInput)}
                      className="text-xs px-2 py-1 rounded"
                      style={{
                        color: '#8e2157',
                        textDecoration: 'underline',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {useUrlInput ? 'Use File Upload' : 'Use URL Instead'}
                    </button>
                  </div>

                  {!useUrlInput ? (
                    // File Upload
                    <div className="space-y-3">
                      {/* Show current logo if editing and no new file selected */}
                      {showEditModal && formData.logo && !logoPreview && (
                        <div className="p-3 border border-gray-200 rounded-md bg-gray-50">
                          <p
                            className="text-xs mb-2"
                            style={{
                              color: '#6B7280',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Current Logo:
                          </p>
                          <div className="flex items-center gap-3">
                            <Image
                              src={formData.logo}
                              alt="Current logo"
                              width={80}
                              height={60}
                              className="object-contain bg-white p-2 rounded border"
                            />
                            <p
                              className="text-xs flex-1"
                              style={{
                                color: '#6B7280',
                                wordBreak: 'break-all'
                              }}
                            >
                              {formData.logo}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* File input */}
                      {!logoPreview && (
                        <div>
                          <input
                            type="file"
                            id="logo-file"
                            accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml"
                            onChange={handleLogoFileChange}
                            className="hidden"
                          />
                          <label
                            htmlFor="logo-file"
                            className="flex flex-col items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-gray-400 transition-colors"
                            style={{ minHeight: '120px' }}
                          >
                            <svg
                              className="w-10 h-10 mb-3"
                              style={{ color: '#9CA3AF' }}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                              />
                            </svg>
                            <p
                              className="text-sm font-medium mb-1"
                              style={{
                                color: '#2C2C2C',
                                whiteSpace: 'normal',
                                textAlign: 'center'
                              }}
                            >
                              Click to upload logo
                            </p>
                            <p
                              className="text-xs"
                              style={{
                                color: '#6B7280',
                                whiteSpace: 'normal',
                                textAlign: 'center'
                              }}
                            >
                              PNG, JPG, WebP or SVG (max 2MB)
                            </p>
                          </label>
                        </div>
                      )}

                      {/* Preview and remove button */}
                      {logoPreview && (
                        <div className="p-4 border border-gray-200 rounded-md bg-gray-50">
                          <div className="flex items-start gap-4">
                            <Image
                              src={logoPreview}
                              alt="Logo preview"
                              width={100}
                              height={80}
                              className="object-contain bg-white p-2 rounded border"
                            />
                            <div className="flex-1">
                              <p
                                className="text-sm font-medium mb-1"
                                style={{
                                  color: '#2C2C2C',
                                  whiteSpace: 'normal'
                                }}
                              >
                                {logoFile?.name}
                              </p>
                              <p
                                className="text-xs mb-2"
                                style={{
                                  color: '#6B7280',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {logoFile && (logoFile.size / 1024).toFixed(1)} KB
                              </p>
                              <button
                                type="button"
                                onClick={clearLogoFile}
                                className="text-xs px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                          {uploadingLogo && (
                            <div className="mt-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="h-2 rounded-full transition-all duration-300"
                                  style={{
                                    width: '100%',
                                    background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)'
                                  }}
                                />
                              </div>
                              <p
                                className="text-xs mt-1 text-center"
                                style={{
                                  color: '#6B7280',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                Uploading...
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ) : (
                    // URL Input
                    <div>
                      <input
                        type="url"
                        id="logo-url"
                        value={formData.logo}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        style={{
                          fontSize: '14px',
                          color: '#2C2C2C'
                        }}
                        placeholder="https://example.com/logo.png or /Brands/logo.png"
                      />
                      <p
                        className="mt-1 text-xs"
                        style={{
                          color: '#6B7280',
                          whiteSpace: 'normal'
                        }}
                      >
                        Enter full URL or path to brand logo image
                      </p>
                    </div>
                  )}
                </div>

                {/* Display Order */}
                <div>
                  <label
                    htmlFor="displayOrder"
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    value={formData.displayOrder}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    style={{
                      fontSize: '14px',
                      color: '#2C2C2C'
                    }}
                  />
                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: '#6B7280',
                      whiteSpace: 'normal'
                    }}
                  >
                    Lower numbers appear first (0 = highest priority)
                  </p>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300"
                    style={{ accentColor: '#8e2157' }}
                  />
                  <label
                    htmlFor="featured"
                    className="text-sm font-medium"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'normal'
                    }}
                  >
                    Feature this brand on homepage
                  </label>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: '#E5E7EB' }}
            >
              <button
                onClick={() => {
                  setShowCreateModal(false)
                  setShowEditModal(false)
                }}
                className="px-6 py-2 border border-gray-300 rounded-md font-medium transition-colors hover:bg-gray-50"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap'
                }}
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreate : handleUpdate}
                disabled={submitting}
                className="px-6 py-2 text-white rounded-md font-medium transition-all hover:opacity-90"
                style={{
                  background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {submitting
                  ? (showCreateModal ? 'Creating...' : 'Updating...')
                  : (showCreateModal ? 'Create Brand' : 'Update Brand')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedBrand && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full"
            style={{ maxWidth: '500px', minWidth: '320px' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div
              className="flex items-center justify-between p-6 border-b"
              style={{ borderColor: '#E5E7EB' }}
            >
              <h2
                className="text-xl font-serif font-bold"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap'
                }}
              >
                Delete Brand
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p
                    className="font-medium mb-2"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'normal',
                      wordBreak: 'normal'
                    }}
                  >
                    Are you sure you want to delete "{selectedBrand.name}"?
                  </p>
                  <p
                    className="text-sm"
                    style={{
                      color: '#6B7280',
                      whiteSpace: 'normal',
                      wordBreak: 'normal'
                    }}
                  >
                    This action cannot be undone.
                    {selectedBrand.productCount && selectedBrand.productCount > 0 && (
                      <span
                        className="block mt-2 font-medium"
                        style={{ color: '#991b1b' }}
                      >
                        Warning: This brand has {selectedBrand.productCount} product(s).
                        You must reassign or delete the products first.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              className="flex items-center justify-end gap-3 p-6 border-t"
              style={{ borderColor: '#E5E7EB' }}
            >
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-2 border border-gray-300 rounded-md font-medium transition-colors hover:bg-gray-50"
                style={{
                  color: '#2C2C2C',
                  whiteSpace: 'nowrap'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={submitting || Boolean(selectedBrand.productCount && selectedBrand.productCount > 0)}
                className="px-6 py-2 text-white rounded-md font-medium transition-all"
                style={{
                  backgroundColor: '#DC2626',
                  opacity: (submitting || Boolean(selectedBrand.productCount && selectedBrand.productCount > 0)) ? 0.5 : 1,
                  cursor: (submitting || Boolean(selectedBrand.productCount && selectedBrand.productCount > 0)) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {submitting ? 'Deleting...' : 'Delete Brand'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
