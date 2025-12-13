'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, X, Check, AlertCircle, ChevronRight, ChevronDown } from 'lucide-react'

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  parentId: number | null
  featured: boolean
  displayOrder: number
  productCount?: number
  childrenCount?: number
  parentName?: string | null
  createdAt: string
  children?: Category[]
}

interface CategoryFormData {
  name: string
  slug: string
  description: string
  parentId: number | null
  featured: boolean
  displayOrder: number
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [hierarchy, setHierarchy] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [viewMode, setViewMode] = useState<'tree' | 'list'>('tree')
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set())

  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  // Form state
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    description: '',
    parentId: null,
    featured: false,
    displayOrder: 0
  })
  const [formErrors, setFormErrors] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  // Success/error messages
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // Fetch categories
  useEffect(() => {
    fetchCategories()
  }, [sortBy])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/categories?sort=${sortBy}&hierarchy=true&limit=100`)

      if (!response.ok) {
        throw new Error('Failed to fetch categories')
      }

      const data = await response.json()
      setCategories(data.categories || [])
      setFilteredCategories(data.categories || [])
      setHierarchy(data.hierarchy || [])
    } catch (error) {
      console.error('Error fetching categories:', error)
      setErrorMessage('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  // Search filter
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = categories.filter(category =>
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query) ||
      (category.description && category.description.toLowerCase().includes(query)) ||
      (category.parentName && category.parentName.toLowerCase().includes(query))
    )
    setFilteredCategories(filtered)
  }, [searchQuery, categories])

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

  // Toggle category expansion in tree view
  const toggleExpand = (categoryId: number) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // Expand all categories
  const expandAll = () => {
    const allIds = new Set(categories.map(c => c.id))
    setExpandedCategories(allIds)
  }

  // Collapse all categories
  const collapseAll = () => {
    setExpandedCategories(new Set())
  }

  // Open create modal
  const handleCreateClick = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parentId: null,
      featured: false,
      displayOrder: 0
    })
    setFormErrors([])
    setShowCreateModal(true)
  }

  // Open edit modal
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category)
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentId: category.parentId,
      featured: category.featured,
      displayOrder: category.displayOrder
    })
    setFormErrors([])
    setShowEditModal(true)
  }

  // Open delete modal
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category)
    setShowDeleteModal(true)
  }

  // Validate form
  const validateForm = (): boolean => {
    const errors: string[] = []

    if (!formData.name.trim()) {
      errors.push('Category name is required')
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

  // Create category
  const handleCreate = async () => {
    if (!validateForm()) return

    try {
      setSubmitting(true)
      const response = await fetch('/api/admin/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create category')
      }

      setSuccessMessage(`Category "${formData.name}" created successfully!`)
      setShowCreateModal(false)
      fetchCategories()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to create category')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Update category
  const handleUpdate = async () => {
    if (!selectedCategory || !validateForm()) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update category')
      }

      setSuccessMessage(`Category "${formData.name}" updated successfully!`)
      setShowEditModal(false)
      fetchCategories()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to update category')
      setTimeout(() => setErrorMessage(''), 5000)
    } finally {
      setSubmitting(false)
    }
  }

  // Delete category
  const handleDelete = async () => {
    if (!selectedCategory) return

    try {
      setSubmitting(true)
      const response = await fetch(`/api/admin/categories/${selectedCategory.id}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete category')
      }

      setSuccessMessage(data.message)
      setShowDeleteModal(false)
      fetchCategories()

      setTimeout(() => setSuccessMessage(''), 5000)
    } catch (error: any) {
      setErrorMessage(error.message || 'Failed to delete category')
      setTimeout(() => setErrorMessage(''), 5000)
      setShowDeleteModal(false)
    } finally {
      setSubmitting(false)
    }
  }

  // Render category tree recursively
  const renderCategoryTree = (categories: Category[], level: number = 0) => {
    return categories.map((category) => (
      <div key={category.id}>
        {/* Category Row */}
        <div
          className="flex items-center hover:bg-gray-50 transition-colors"
          style={{
            paddingLeft: `${level * 32 + 16}px`,
            paddingRight: '16px',
            paddingTop: '12px',
            paddingBottom: '12px',
            borderBottom: '1px solid #E5E7EB'
          }}
        >
          {/* Expand/Collapse Button */}
          <div style={{ width: '24px', marginRight: '8px' }}>
            {category.children && category.children.length > 0 && (
              <button
                onClick={() => toggleExpand(category.id)}
                className="p-1 hover:bg-gray-200 rounded transition-colors"
              >
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4" style={{ color: '#6B7280' }} />
                ) : (
                  <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
                )}
              </button>
            )}
          </div>

          {/* Category Name */}
          <div className="flex-1 min-w-0" style={{ maxWidth: '300px' }}>
            <div
              className="font-medium"
              style={{
                color: '#2C2C2C',
                whiteSpace: 'normal',
                wordBreak: 'normal',
                fontSize: '14px'
              }}
            >
              {category.name}
            </div>
            {category.description && (
              <div
                className="text-xs mt-1"
                style={{
                  color: '#6B7280',
                  whiteSpace: 'normal',
                  wordBreak: 'normal'
                }}
              >
                {category.description}
              </div>
            )}
          </div>

          {/* Slug */}
          <div style={{ width: '150px', marginLeft: '16px' }}>
            <code
              className="text-xs px-2 py-1 bg-gray-100 rounded"
              style={{
                color: '#2C2C2C',
                fontFamily: 'monospace',
                fontSize: '12px'
              }}
            >
              {category.slug}
            </code>
          </div>

          {/* Product Count */}
          <div style={{ width: '80px', marginLeft: '16px', textAlign: 'center' }}>
            <span
              style={{
                color: '#2C2C2C',
                fontSize: '14px'
              }}
            >
              {category.productCount || 0}
            </span>
          </div>

          {/* Subcategories Count */}
          <div style={{ width: '100px', marginLeft: '16px', textAlign: 'center' }}>
            <span
              style={{
                color: '#6B7280',
                fontSize: '14px'
              }}
            >
              {category.children?.length || 0}
            </span>
          </div>

          {/* Featured */}
          <div style={{ width: '80px', marginLeft: '16px' }}>
            {category.featured ? (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#D1FAE5',
                  color: '#065F46'
                }}
              >
                Yes
              </span>
            ) : (
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: '#F3F4F6',
                  color: '#6B7280'
                }}
              >
                No
              </span>
            )}
          </div>

          {/* Display Order */}
          <div style={{ width: '80px', marginLeft: '16px', textAlign: 'center' }}>
            <span
              style={{
                color: '#2C2C2C',
                fontSize: '14px'
              }}
            >
              {category.displayOrder}
            </span>
          </div>

          {/* Actions */}
          <div style={{ width: '100px', marginLeft: '16px' }}>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => handleEditClick(category)}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                title="Edit category"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDeleteClick(category)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Render Children */}
        {category.children && category.children.length > 0 && expandedCategories.has(category.id) && (
          renderCategoryTree(category.children, level + 1)
        )}
      </div>
    ))
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
            Category Management
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
            Manage product categories and subcategories in a hierarchical structure
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
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                style={{
                  fontSize: '14px',
                  color: '#2C2C2C'
                }}
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-4 flex-wrap">
              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setViewMode('tree')}
                  className="px-3 py-1 rounded transition-colors"
                  style={{
                    backgroundColor: viewMode === 'tree' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'tree' ? '#2C2C2C' : '#6B7280',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    boxShadow: viewMode === 'tree' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  Tree View
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="px-3 py-1 rounded transition-colors"
                  style={{
                    backgroundColor: viewMode === 'list' ? '#FFFFFF' : 'transparent',
                    color: viewMode === 'list' ? '#2C2C2C' : '#6B7280',
                    fontSize: '14px',
                    whiteSpace: 'nowrap',
                    boxShadow: viewMode === 'list' ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                  }}
                >
                  List View
                </button>
              </div>

              {/* Tree Controls */}
              {viewMode === 'tree' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={expandAll}
                    className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Expand All
                  </button>
                  <button
                    onClick={collapseAll}
                    className="text-xs px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition-colors"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Collapse All
                  </button>
                </div>
              )}

              {/* Sort */}
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
                Create Category
              </button>
            </div>
          </div>
        </div>

        {/* Categories Display */}
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
                Loading categories...
              </p>
            </div>
          ) : (searchQuery ? filteredCategories : categories).length === 0 ? (
            <div className="p-12 text-center">
              <p
                className="text-lg mb-2"
                style={{
                  color: '#2C2C2C',
                  fontWeight: 'bold',
                  whiteSpace: 'normal'
                }}
              >
                {searchQuery ? 'No categories found' : 'No categories yet'}
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
                  : 'Get started by creating your first category'}
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
                  Create First Category
                </button>
              )}
            </div>
          ) : viewMode === 'tree' && !searchQuery ? (
            // Tree View
            <div>
              {/* Tree Header */}
              <div
                className="flex items-center px-4 py-3"
                style={{
                  backgroundColor: '#F9FAFB',
                  borderBottom: '1px solid #E5E7EB'
                }}
              >
                <div style={{ width: '32px' }}></div>
                <div
                  className="flex-1 text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#6B7280', maxWidth: '300px' }}
                >
                  Name
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#6B7280', width: '150px', marginLeft: '16px' }}
                >
                  Slug
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider text-center"
                  style={{ color: '#6B7280', width: '80px', marginLeft: '16px' }}
                >
                  Products
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider text-center"
                  style={{ color: '#6B7280', width: '100px', marginLeft: '16px' }}
                >
                  Subcategories
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider"
                  style={{ color: '#6B7280', width: '80px', marginLeft: '16px' }}
                >
                  Featured
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider text-center"
                  style={{ color: '#6B7280', width: '80px', marginLeft: '16px' }}
                >
                  Order
                </div>
                <div
                  className="text-xs font-medium uppercase tracking-wider text-right"
                  style={{ color: '#6B7280', width: '100px', marginLeft: '16px' }}
                >
                  Actions
                </div>
              </div>

              {/* Tree Body */}
              <div>{renderCategoryTree(hierarchy)}</div>
            </div>
          ) : (
            // List View (Table)
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#F9FAFB' }}>
                  <tr>
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
                      Parent
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
                  {(searchQuery ? filteredCategories : categories).map((category) => (
                    <tr
                      key={category.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                          {category.name}
                        </div>
                        {category.description && (
                          <div
                            className="text-sm mt-1"
                            style={{
                              color: '#6B7280',
                              whiteSpace: 'normal',
                              wordBreak: 'normal',
                              maxWidth: '200px'
                            }}
                          >
                            {category.description}
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
                          {category.slug}
                        </code>
                      </td>

                      {/* Parent */}
                      <td className="px-6 py-4">
                        {category.parentName ? (
                          <span
                            className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded"
                            style={{ fontSize: '13px' }}
                          >
                            {category.parentName}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: '#9CA3AF',
                              fontSize: '13px'
                            }}
                          >
                            Root
                          </span>
                        )}
                      </td>

                      {/* Product Count */}
                      <td className="px-6 py-4">
                        <span
                          style={{
                            color: '#2C2C2C',
                            fontSize: '14px'
                          }}
                        >
                          {category.productCount || 0}
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="px-6 py-4">
                        {category.featured ? (
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
                          {category.displayOrder}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditClick(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            title="Edit category"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(category)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                            title="Delete category"
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

        {/* Category count */}
        {!loading && (searchQuery ? filteredCategories : categories).length > 0 && (
          <div
            className="mt-4 text-sm"
            style={{
              color: '#6B7280',
              whiteSpace: 'normal'
            }}
          >
            Showing {searchQuery ? filteredCategories.length : categories.length} categor{searchQuery ? (filteredCategories.length === 1 ? 'y' : 'ies') : (categories.length === 1 ? 'y' : 'ies')}
            {searchQuery && ` matching "${searchQuery}"`}
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
                {showCreateModal ? 'Create New Category' : 'Edit Category'}
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
                    Category Name *
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
                    placeholder="e.g., Men's Clothing"
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
                    placeholder="e.g., mens-clothing"
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
                    placeholder="Brief description of the category..."
                  />
                </div>

                {/* Parent Category */}
                <div>
                  <label
                    htmlFor="parentId"
                    className="block text-sm font-medium mb-1"
                    style={{
                      color: '#2C2C2C',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Parent Category
                  </label>
                  <select
                    id="parentId"
                    value={formData.parentId || ''}
                    onChange={(e) => setFormData({ ...formData, parentId: e.target.value ? parseInt(e.target.value) : null })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                    style={{
                      fontSize: '14px',
                      color: '#2C2C2C'
                    }}
                  >
                    <option value="">None (Root Category)</option>
                    {categories
                      .filter(cat => !selectedCategory || cat.id !== selectedCategory.id)
                      .map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.parentName ? `${category.parentName} > ${category.name}` : category.name}
                        </option>
                      ))}
                  </select>
                  <p
                    className="mt-1 text-xs"
                    style={{
                      color: '#6B7280',
                      whiteSpace: 'normal'
                    }}
                  >
                    Leave empty for root category, or select a parent to create a subcategory
                  </p>
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
                    Feature this category on homepage
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
                  : (showCreateModal ? 'Create Category' : 'Update Category')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedCategory && (
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
                Delete Category
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
                    Are you sure you want to delete "{selectedCategory.name}"?
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
                    {selectedCategory.productCount && selectedCategory.productCount > 0 && (
                      <span
                        className="block mt-2 font-medium"
                        style={{ color: '#991b1b' }}
                      >
                        Warning: This category has {selectedCategory.productCount} product(s).
                        You must reassign or delete the products first.
                      </span>
                    )}
                    {selectedCategory.childrenCount && selectedCategory.childrenCount > 0 && (
                      <span
                        className="block mt-2 font-medium"
                        style={{ color: '#991b1b' }}
                      >
                        Warning: This category has {selectedCategory.childrenCount} subcategory(ies).
                        You must delete or reassign the subcategories first.
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
                disabled={submitting || Boolean((selectedCategory.productCount && selectedCategory.productCount > 0) || (selectedCategory.childrenCount && selectedCategory.childrenCount > 0))}
                className="px-6 py-2 text-white rounded-md font-medium transition-all"
                style={{
                  backgroundColor: '#DC2626',
                  opacity: (submitting || Boolean((selectedCategory.productCount && selectedCategory.productCount > 0) || (selectedCategory.childrenCount && selectedCategory.childrenCount > 0))) ? 0.5 : 1,
                  cursor: (submitting || Boolean((selectedCategory.productCount && selectedCategory.productCount > 0) || (selectedCategory.childrenCount && selectedCategory.childrenCount > 0))) ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {submitting ? 'Deleting...' : 'Delete Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
