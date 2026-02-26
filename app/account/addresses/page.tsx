'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuth } from '@/hooks/useAuth'
import { addressFormSchema, type AddressFormData, type SavedAddress } from '@/types/checkout'
import type { PathaoCity, PathaoZone, PathaoArea } from '@/types/pathao'

export default function AddressesPage() {
  const { userEmail, isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const [addresses, setAddresses] = useState<SavedAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Pathao location state
  const [cities, setCities] = useState<PathaoCity[]>([])
  const [zones, setZones] = useState<PathaoZone[]>([])
  const [areas, setAreas] = useState<PathaoArea[]>([])
  const [citiesLoading, setCitiesLoading] = useState(false)
  const [zonesLoading, setZonesLoading] = useState(false)
  const [areasLoading, setAreasLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: { country: 'Bangladesh' },
  })

  const selectedCityId = watch('pathaoCityId')
  const selectedZoneId = watch('pathaoZoneId')

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace('/auth/login')
    }
  }, [authLoading, isAuthenticated, router])

  // Fetch cities on mount
  useEffect(() => {
    setCitiesLoading(true)
    fetch('/api/pathao/cities')
      .then((r) => r.json())
      .then((d) => setCities(d.cities || []))
      .catch(() => setCities([]))
      .finally(() => setCitiesLoading(false))
  }, [])

  // Fetch zones when city changes
  const fetchZones = useCallback(async (cityId: number) => {
    setZonesLoading(true)
    setZones([])
    setAreas([])
    try {
      const res = await fetch(`/api/pathao/cities/${cityId}/zones`)
      const d = await res.json()
      setZones(d.zones || [])
    } catch {
      setZones([])
    } finally {
      setZonesLoading(false)
    }
  }, [])

  const fetchAreas = useCallback(async (zoneId: number) => {
    setAreasLoading(true)
    setAreas([])
    try {
      const res = await fetch(`/api/pathao/zones/${zoneId}/areas`)
      const d = await res.json()
      setAreas(d.areas || [])
    } catch {
      setAreas([])
    } finally {
      setAreasLoading(false)
    }
  }, [])

  useEffect(() => {
    if (selectedCityId && selectedCityId > 0) {
      fetchZones(selectedCityId)
    } else {
      setZones([])
      setAreas([])
    }
  }, [selectedCityId, fetchZones])

  useEffect(() => {
    if (selectedZoneId && selectedZoneId > 0) {
      fetchAreas(selectedZoneId)
    } else {
      setAreas([])
    }
  }, [selectedZoneId, fetchAreas])

  const fetchAddresses = useCallback(async () => {
    if (!userEmail) return
    try {
      const res = await fetch(`/api/addresses?email=${encodeURIComponent(userEmail)}`)
      if (res.ok) {
        const data = await res.json()
        setAddresses(data.addresses || [])
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false)
    }
  }, [userEmail])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  const openAddForm = () => {
    setEditingId(null)
    reset({ country: 'Bangladesh', isDefault: false })
    setZones([])
    setAreas([])
    setShowForm(true)
  }

  const openEditForm = (address: SavedAddress) => {
    setEditingId(address.id)
    reset({
      fullName: address.fullName,
      phone: address.phone,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2 || '',
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: 'Bangladesh',
      isDefault: address.isDefault,
      pathaoCityId: address.pathaoCityId ?? undefined,
      pathaoZoneId: address.pathaoZoneId ?? undefined,
      pathaoAreaId: address.pathaoAreaId ?? undefined,
    })
    // Load dependent dropdowns
    if (address.pathaoCityId) {
      fetchZones(address.pathaoCityId).then(() => {
        if (address.pathaoZoneId) {
          fetchAreas(address.pathaoZoneId)
        }
      })
    }
    setShowForm(true)
  }

  const closeForm = () => {
    setShowForm(false)
    setEditingId(null)
    reset({ country: 'Bangladesh' })
    setZones([])
    setAreas([])
  }

  const onSubmit = async (data: AddressFormData) => {
    if (!userEmail) return
    setSaving(true)
    try {
      const url = editingId ? `/api/addresses/${editingId}` : '/api/addresses'
      const method = editingId ? 'PUT' : 'POST'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail, ...data }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Failed to save address')
      }

      closeForm()
      await fetchAddresses()
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to save address')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!userEmail) return
    if (!window.confirm('Are you sure you want to delete this address?')) return

    try {
      const res = await fetch(`/api/addresses/${id}?email=${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
      })
      if (!res.ok) throw new Error('Failed to delete')
      await fetchAddresses()
    } catch {
      alert('Failed to delete address')
    }
  }

  const handleSetDefault = async (id: string) => {
    if (!userEmail) return
    try {
      const res = await fetch(`/api/addresses/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail }),
      })
      if (!res.ok) throw new Error('Failed to set default')
      await fetchAddresses()
    } catch {
      alert('Failed to set default address')
    }
  }

  if (authLoading || (!isAuthenticated && !authLoading)) {
    return null
  }

  const selectInputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '10px 12px',
    border: hasError ? '1px solid #ef4444' : '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    boxSizing: 'border-box',
    backgroundColor: '#fff',
    appearance: 'none' as const,
    backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center',
    paddingRight: '32px',
  })

  return (
    <div
      style={{
        maxWidth: '960px',
        minWidth: '320px',
        margin: '0 auto',
        padding: '120px 16px 80px',
        paddingTop: 'clamp(120px, 15vw, 200px)',
      }}
    >
      {/* Back Link */}
      <Link
        href="/account"
        style={{
          fontSize: '0.875rem',
          color: '#8e2157',
          textDecoration: 'none',
          fontWeight: 500,
          display: 'inline-block',
          marginBottom: '24px',
        }}
      >
        &larr; Back to Account
      </Link>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#2C2C2C',
            margin: 0,
          }}
        >
          My Addresses
        </h1>
        {!showForm && (
          <button
            onClick={openAddForm}
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Add New Address
          </button>
        )}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.25rem',
              fontWeight: 600,
              color: '#2C2C2C',
              margin: '0 0 20px',
            }}
          >
            {editingId ? 'Edit Address' : 'Add New Address'}
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Full Name */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Full Name *
                </label>
                <input
                  {...register('fullName')}
                  placeholder="John Doe"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.fullName ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.fullName && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>{errors.fullName.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Phone *
                </label>
                <input
                  {...register('phone')}
                  placeholder="01712345678"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.phone ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.phone && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>{errors.phone.message}</p>
                )}
              </div>

              {/* Address Line 1 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Address Line 1 *
                </label>
                <input
                  {...register('addressLine1')}
                  placeholder="Street address, P.O. box"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: errors.addressLine1 ? '1px solid #ef4444' : '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                {errors.addressLine1 && (
                  <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>{errors.addressLine1.message}</p>
                )}
              </div>

              {/* Address Line 2 */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Address Line 2 (Optional)
                </label>
                <input
                  {...register('addressLine2')}
                  placeholder="Apartment, suite, unit, etc."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* City + Zone row (Pathao cascading) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                    City *
                  </label>
                  <Controller
                    name="pathaoCityId"
                    control={control}
                    render={({ field }) => (
                      <select
                        style={selectInputStyle(!!errors.city)}
                        value={field.value || ''}
                        onChange={(e) => {
                          const cityId = e.target.value ? parseInt(e.target.value, 10) : undefined
                          field.onChange(cityId)
                          const city = cities.find((c) => c.city_id === cityId)
                          setValue('city', city?.city_name || '')
                          setValue('state', city?.city_name || '')
                          setValue('pathaoZoneId', undefined)
                          setValue('pathaoAreaId', undefined)
                        }}
                        disabled={citiesLoading}
                      >
                        <option value="">
                          {citiesLoading ? 'Loading cities...' : 'Select City'}
                        </option>
                        {cities.map((c) => (
                          <option key={c.city_id} value={c.city_id}>
                            {c.city_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                  <input type="hidden" {...register('city')} />
                  <input type="hidden" {...register('state')} />
                  {errors.city && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>{errors.city.message}</p>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                    Zone *
                  </label>
                  <Controller
                    name="pathaoZoneId"
                    control={control}
                    render={({ field }) => (
                      <select
                        style={selectInputStyle()}
                        value={field.value || ''}
                        onChange={(e) => {
                          const zoneId = e.target.value ? parseInt(e.target.value, 10) : undefined
                          field.onChange(zoneId)
                          setValue('pathaoAreaId', undefined)
                        }}
                        disabled={zonesLoading || !selectedCityId}
                      >
                        <option value="">
                          {zonesLoading ? 'Loading...' : !selectedCityId ? 'Select a city first' : 'Select Zone'}
                        </option>
                        {zones.map((z) => (
                          <option key={z.zone_id} value={z.zone_id}>
                            {z.zone_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
              </div>

              {/* Area + Zip row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                    Area (Optional)
                  </label>
                  <Controller
                    name="pathaoAreaId"
                    control={control}
                    render={({ field }) => (
                      <select
                        style={selectInputStyle()}
                        value={field.value || ''}
                        onChange={(e) => {
                          const areaId = e.target.value ? parseInt(e.target.value, 10) : undefined
                          field.onChange(areaId)
                        }}
                        disabled={areasLoading || !selectedZoneId}
                      >
                        <option value="">
                          {areasLoading ? 'Loading...' : !selectedZoneId ? 'Select a zone first' : 'Select Area'}
                        </option>
                        {areas.map((a) => (
                          <option key={a.area_id} value={a.area_id}>
                            {a.area_name}
                          </option>
                        ))}
                      </select>
                    )}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                    Zip Code *
                  </label>
                  <input
                    {...register('zipCode')}
                    placeholder="1234"
                    maxLength={4}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: errors.zipCode ? '1px solid #ef4444' : '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                  {errors.zipCode && (
                    <p style={{ fontSize: '0.75rem', color: '#ef4444', marginTop: '4px' }}>{errors.zipCode.message}</p>
                  )}
                </div>
              </div>

              {/* Country (read-only) */}
              <div>
                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#374151', marginBottom: '4px' }}>
                  Country
                </label>
                <input
                  {...register('country')}
                  value="Bangladesh"
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    backgroundColor: '#f3f4f6',
                    color: '#6B7280',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              {/* Default checkbox */}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  {...register('isDefault')}
                  style={{ width: '16px', height: '16px', accentColor: '#8e2157' }}
                />
                <span style={{ fontSize: '0.875rem', color: '#374151' }}>Set as default address</span>
              </label>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.7 : 1,
                  }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Address' : 'Save Address'}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  style={{
                    backgroundColor: '#FFFFFF',
                    color: '#374151',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Address List */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[1, 2].map((i) => (
            <div
              key={i}
              style={{
                backgroundColor: '#f9fafb',
                borderRadius: '12px',
                height: '160px',
              }}
            />
          ))}
        </div>
      ) : addresses.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#FFFFFF',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: '#6B7280',
              margin: '0 0 16px',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
            }}
          >
            No addresses saved yet.
          </p>
          {!showForm && (
            <button
              onClick={openAddForm}
              style={{
                background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 24px',
                fontSize: '0.875rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add Your First Address
            </button>
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '16px',
          }}
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                border: address.isDefault ? '2px solid #8e2157' : '1px solid #e5e7eb',
                position: 'relative',
              }}
            >
              {/* Default Badge */}
              {address.isDefault && (
                <span
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#8e2157',
                    color: '#FFFFFF',
                    fontSize: '0.625rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Default
                </span>
              )}

              {/* Address Content */}
              <p
                style={{
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  color: '#2C2C2C',
                  margin: '0 0 4px',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                  paddingRight: address.isDefault ? '70px' : '0',
                }}
              >
                {address.fullName}
              </p>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: '#6B7280',
                  margin: '0 0 8px',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {address.phone}
              </p>
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: '#374151',
                  margin: 0,
                  lineHeight: 1.5,
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {address.addressLine1}
                {address.addressLine2 && <><br />{address.addressLine2}</>}
                <br />
                {address.city}, {address.state} {address.zipCode}
                <br />
                {address.country}
              </p>

              {/* Actions */}
              <div
                style={{
                  display: 'flex',
                  gap: '12px',
                  marginTop: '16px',
                  flexWrap: 'wrap',
                }}
              >
                <button
                  onClick={() => openEditForm(address)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#8e2157',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.8125rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Delete
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#6B7280',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    Set as Default
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
