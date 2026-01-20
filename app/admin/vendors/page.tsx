'use client'

import { useState, useEffect } from 'react'
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Store,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'
import type { Vendor, VendorFormData, VendorStatus, BusinessType } from '@/types/vendor'

function StatusBadge({ status }: { status: VendorStatus }) {
  const isActive = status === 'ACTIVE'
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
      style={{
        backgroundColor: isActive ? '#D1FAE5' : '#FEE2E2',
        color: isActive ? '#065F46' : '#991B1B'
      }}
    >
      {isActive ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {status}
    </span>
  )
}

function BusinessTypeBadge({ type }: { type: BusinessType }) {
  const isCompany = type === 'COMPANY'
  return (
    <span
      className="px-2 py-1 rounded text-xs font-medium"
      style={{
        backgroundColor: isCompany ? '#DBEAFE' : '#FEF3C7',
        color: isCompany ? '#1E40AF' : '#92400E'
      }}
    >
      {type}
    </span>
  )
}

interface VendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: VendorFormData) => Promise<void>
  vendor?: Vendor | null
  saving: boolean
}

function VendorModal({ isOpen, onClose, onSave, vendor, saving }: VendorModalProps) {
  const [formData, setFormData] = useState<VendorFormData>({
    shopName: '',
    ownerName: '',
    mobile: '',
    email: '',
    businessType: 'INDIVIDUAL',
    nationalId: '',
    tinNumber: '',
    pickupAddress: '',
    returnAddress: '',
    status: 'ACTIVE',
    onboardingDate: new Date().toISOString().split('T')[0],
    bankName: '',
    bankBranch: '',
    accountHolderName: '',
    accountNumber: '',
    routingNumber: '',
    bkash: '',
    nagad: '',
    rocket: '',
    notes: ''
  })

  useEffect(() => {
    if (vendor) {
      setFormData({
        shopName: vendor.shopName,
        ownerName: vendor.ownerName,
        mobile: vendor.mobile,
        email: vendor.email,
        businessType: vendor.businessType,
        nationalId: vendor.nationalId || '',
        tinNumber: vendor.tinNumber || '',
        pickupAddress: vendor.pickupAddress,
        returnAddress: vendor.returnAddress || '',
        status: vendor.status,
        onboardingDate: vendor.onboardingDate ? vendor.onboardingDate.split('T')[0] : '',
        bankName: vendor.bankName || '',
        bankBranch: vendor.bankBranch || '',
        accountHolderName: vendor.accountHolderName || '',
        accountNumber: vendor.accountNumber || '',
        routingNumber: vendor.routingNumber || '',
        bkash: vendor.mobileBanking?.bkash || '',
        nagad: vendor.mobileBanking?.nagad || '',
        rocket: vendor.mobileBanking?.rocket || '',
        notes: vendor.notes || ''
      })
    } else {
      setFormData({
        shopName: '',
        ownerName: '',
        mobile: '',
        email: '',
        businessType: 'INDIVIDUAL',
        nationalId: '',
        tinNumber: '',
        pickupAddress: '',
        returnAddress: '',
        status: 'ACTIVE',
        onboardingDate: new Date().toISOString().split('T')[0],
        bankName: '',
        bankBranch: '',
        accountHolderName: '',
        accountNumber: '',
        routingNumber: '',
        bkash: '',
        nagad: '',
        rocket: '',
        notes: ''
      })
    }
  }, [vendor, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div
        className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: '#e5e7eb' }}>
          <h2 className="text-xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            {vendor ? 'Edit Vendor' : 'Add New Vendor'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <Store className="w-5 h-5" style={{ color: '#8e2157' }} />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Shop / Vendor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.shopName}
                  onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Owner / Contact Person <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  placeholder="+880 1XXX-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Business Type
                </label>
                <select
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value as BusinessType })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <option value="INDIVIDUAL">Individual</option>
                  <option value="COMPANY">Company</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as VendorStatus })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Identity & Documents */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <Building className="w-5 h-5" style={{ color: '#8e2157' }} />
              Identity & Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  National ID / Passport
                </label>
                <input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  TIN / BIN / VAT Number
                </label>
                <input
                  type="text"
                  value={formData.tinNumber}
                  onChange={(e) => setFormData({ ...formData, tinNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Onboarding Date
                </label>
                <input
                  type="date"
                  value={formData.onboardingDate}
                  onChange={(e) => setFormData({ ...formData, onboardingDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <MapPin className="w-5 h-5" style={{ color: '#8e2157' }} />
              Addresses
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Pickup Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Return Address
                </label>
                <textarea
                  rows={3}
                  value={formData.returnAddress}
                  onChange={(e) => setFormData({ ...formData, returnAddress: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  placeholder="Leave empty if same as pickup address"
                />
              </div>
            </div>
          </div>

          {/* Bank Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <CreditCard className="w-5 h-5" style={{ color: '#8e2157' }} />
              Bank Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Bank Name
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Bank Branch
                </label>
                <input
                  type="text"
                  value={formData.bankBranch}
                  onChange={(e) => setFormData({ ...formData, bankBranch: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={formData.accountHolderName}
                  onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Account Number
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Routing Number
                </label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                />
              </div>
            </div>
          </div>

          {/* Mobile Banking */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2" style={{ color: '#2C2C2C' }}>
              <Phone className="w-5 h-5" style={{ color: '#8e2157' }} />
              Mobile Banking
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  bKash Number
                </label>
                <input
                  type="text"
                  value={formData.bkash}
                  onChange={(e) => setFormData({ ...formData, bkash: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  placeholder="01XXX-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Nagad Number
                </label>
                <input
                  type="text"
                  value={formData.nagad}
                  onChange={(e) => setFormData({ ...formData, nagad: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  placeholder="01XXX-XXXXXX"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
                  Rocket Number
                </label>
                <input
                  type="text"
                  value={formData.rocket}
                  onChange={(e) => setFormData({ ...formData, rocket: e.target.value })}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  placeholder="01XXX-XXXXXX"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium mb-1" style={{ color: '#2C2C2C' }}>
              Notes
            </label>
            <textarea
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              placeholder="Additional notes about this vendor..."
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border rounded-md font-medium transition-colors hover:bg-gray-50"
              style={{ borderColor: '#d1d5db', color: '#6B7280' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2 rounded-md font-medium text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: '#8e2157' }}
            >
              {saving ? 'Saving...' : vendor ? 'Update Vendor' : 'Add Vendor'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null)
  const [saving, setSaving] = useState(false)

  // Delete confirmation
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchVendors()
  }, [searchQuery, filterStatus, filterType, page])

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        search: searchQuery,
        status: filterStatus,
        businessType: filterType,
        page: page.toString(),
        limit: '20'
      })

      const response = await fetch(`/api/admin/vendors?${params}`)
      if (!response.ok) throw new Error('Failed to fetch vendors')

      const data = await response.json()
      setVendors(data.vendors || [])
      setTotalPages(data.totalPages || 1)
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error fetching vendors:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (formData: VendorFormData) => {
    setSaving(true)
    try {
      const url = editingVendor
        ? `/api/admin/vendors/${editingVendor.id}`
        : '/api/admin/vendors'

      const response = await fetch(url, {
        method: editingVendor ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to save vendor')
      }

      alert(data.message)
      setModalOpen(false)
      setEditingVendor(null)
      fetchVendors()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save vendor')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return

    setDeleting(true)
    try {
      const response = await fetch(`/api/admin/vendors/${deleteId}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete vendor')
      }

      alert(data.message)
      setDeleteId(null)
      fetchVendors()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to delete vendor')
    } finally {
      setDeleting(false)
    }
  }

  const openEditModal = (vendor: Vendor) => {
    setEditingVendor(vendor)
    setModalOpen(true)
  }

  const openAddModal = () => {
    setEditingVendor(null)
    setModalOpen(true)
  }

  return (
    <div style={{ minWidth: '320px', width: '100%' }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-serif font-bold" style={{ color: '#2C2C2C' }}>
            Vendors
          </h1>
          <p className="mt-2" style={{ color: '#6B7280' }}>
            Manage vendor and supplier information
          </p>
        </div>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white transition-colors"
          style={{ backgroundColor: '#8e2157' }}
        >
          <Plus className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                placeholder="Search by name, email, mobile..."
                className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => { setFilterStatus(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Statuses</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Business Type Filter */}
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#2C2C2C' }}>
              Business Type
            </label>
            <select
              value={filterType}
              onChange={(e) => { setFilterType(e.target.value); setPage(1) }}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="">All Types</option>
              <option value="INDIVIDUAL">Individual</option>
              <option value="COMPANY">Company</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: '#8e2157' }}></div>
            <p className="mt-4" style={{ color: '#6B7280' }}>Loading vendors...</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="p-12 text-center">
            <Store className="w-16 h-16 mx-auto mb-4" style={{ color: '#9CA3AF' }} />
            <p className="text-lg mb-2" style={{ color: '#6B7280' }}>No vendors found</p>
            <p className="text-sm mb-4" style={{ color: '#9CA3AF' }}>
              {searchQuery || filterStatus || filterType
                ? 'Try adjusting your filters'
                : 'Get started by adding your first vendor'}
            </p>
            {!searchQuery && !filterStatus && !filterType && (
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white"
                style={{ backgroundColor: '#8e2157' }}
              >
                <Plus className="w-5 h-5" />
                Add Vendor
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full" style={{ minWidth: '1000px' }}>
              <thead style={{ backgroundColor: '#F5F5F5' }}>
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Vendor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Contact</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Type</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Onboarded</th>
                  <th className="text-center px-6 py-4 text-sm font-medium" style={{ color: '#2C2C2C' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-t hover:bg-gray-50 transition-colors"
                    style={{ borderColor: '#E5E7EB' }}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium" style={{ color: '#8e2157' }}>{vendor.shopName}</p>
                      <p className="text-sm" style={{ color: '#6B7280' }}>{vendor.ownerName}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm flex items-center gap-1" style={{ color: '#2C2C2C' }}>
                        <Phone className="w-3 h-3" /> {vendor.mobile}
                      </p>
                      <p className="text-sm flex items-center gap-1" style={{ color: '#6B7280' }}>
                        <Mail className="w-3 h-3" /> {vendor.email}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <BusinessTypeBadge type={vendor.businessType} />
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={vendor.status} />
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm" style={{ color: '#2C2C2C' }}>
                        {new Date(vendor.onboardingDate).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => openEditModal(vendor)}
                          className="p-2 rounded hover:bg-gray-100 transition-colors"
                          title="Edit vendor"
                        >
                          <Edit2 className="w-4 h-4" style={{ color: '#6B7280' }} />
                        </button>
                        <button
                          onClick={() => setDeleteId(vendor.id)}
                          className="p-2 rounded hover:bg-red-50 transition-colors"
                          title="Delete vendor"
                        >
                          <Trash2 className="w-4 h-4" style={{ color: '#EF4444' }} />
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

      {/* Pagination */}
      {!loading && vendors.length > 0 && (
        <div className="mt-4 flex items-center justify-between">
          <p style={{ color: '#6B7280' }}>
            Showing {vendors.length} of {total} vendors
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronLeft size={20} style={{ color: '#6B7280' }} />
            </button>
            <span className="px-4 py-2" style={{ color: '#2C2C2C' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded border hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              style={{ borderColor: '#e5e7eb' }}
            >
              <ChevronRight size={20} style={{ color: '#6B7280' }} />
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <VendorModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingVendor(null) }}
        onSave={handleSave}
        vendor={editingVendor}
        saving={saving}
      />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteId(null)} />
          <div className="relative bg-white rounded-lg shadow-xl p-6 m-4 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-2" style={{ color: '#2C2C2C' }}>
              Delete Vendor?
            </h3>
            <p className="mb-6" style={{ color: '#6B7280' }}>
              Are you sure you want to delete this vendor? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border rounded-md font-medium transition-colors hover:bg-gray-50"
                style={{ borderColor: '#d1d5db', color: '#6B7280' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 rounded-md font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: '#EF4444' }}
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
