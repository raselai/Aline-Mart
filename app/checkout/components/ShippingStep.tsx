'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { shippingStepSchema, type ShippingStepData, type SavedAddress } from '@/types/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Edit2 } from 'lucide-react'

interface ShippingStepProps {
  isActive: boolean
  isComplete: boolean
  disabled: boolean
  data?: ShippingStepData
  onComplete: (
    data: ShippingStepData,
    options?: { saveAddress?: boolean; selectedAddressId?: string | null }
  ) => void
  onEdit: () => void
  savedAddresses?: SavedAddress[]
  isAuthenticated?: boolean
}

export default function ShippingStep({
  isActive,
  isComplete,
  disabled,
  data,
  onComplete,
  onEdit,
  savedAddresses,
  isAuthenticated,
}: ShippingStepProps) {
  const [selectedId, setSelectedId] = useState<string | 'new'>(() => {
    // Pre-select the default address if available
    const defaultAddr = savedAddresses?.find((a) => a.isDefault)
    return defaultAddr ? defaultAddr.id : 'new'
  })
  const [wantSave, setWantSave] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShippingStepData>({
    resolver: zodResolver(shippingStepSchema),
    defaultValues: data || getDefaultsFromAddress(savedAddresses?.find((a) => a.isDefault)) || { country: 'Bangladesh' },
  })

  function getDefaultsFromAddress(addr?: SavedAddress): ShippingStepData | undefined {
    if (!addr) return undefined
    return {
      fullName: addr.fullName,
      addressLine1: addr.addressLine1,
      addressLine2: addr.addressLine2 || '',
      city: addr.city,
      state: addr.state,
      zipCode: addr.zipCode,
      country: 'Bangladesh',
    }
  }

  const handleAddressSelect = (id: string) => {
    setSelectedId(id)
    if (id === 'new') {
      reset({ country: 'Bangladesh', fullName: '', addressLine1: '', addressLine2: '', city: '', state: '', zipCode: '' })
      setWantSave(false)
    } else {
      const addr = savedAddresses?.find((a) => a.id === id)
      if (addr) {
        reset({
          fullName: addr.fullName,
          addressLine1: addr.addressLine1,
          addressLine2: addr.addressLine2 || '',
          city: addr.city,
          state: addr.state,
          zipCode: addr.zipCode,
          country: 'Bangladesh',
        })
      }
    }
  }

  const onSubmit = (formData: ShippingStepData) => {
    onComplete(formData, {
      saveAddress: selectedId === 'new' ? wantSave : false,
      selectedAddressId: selectedId !== 'new' ? selectedId : null,
    })
  }

  if (isComplete && !isActive) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Shipping Address</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p className="font-medium">{data?.fullName}</p>
          <p>{data?.addressLine1}</p>
          {data?.addressLine2 && <p>{data.addressLine2}</p>}
          <p>{data?.city}, {data?.state} {data?.zipCode}</p>
          <p>{data?.country}</p>
        </div>
      </div>
    )
  }

  const hasAddresses = savedAddresses && savedAddresses.length > 0

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-burgundy bg-white' : disabled ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${isActive ? 'bg-burgundy' : 'bg-gray-400'}`}>
          2
        </div>
        <h3 className="text-lg font-semibold">Shipping Address</h3>
      </div>

      {isActive && (
        <>
          {/* Saved Address Picker */}
          {hasAddresses && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select a saved address
              </label>
              <div className="space-y-2">
                {savedAddresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedId === addr.id
                        ? 'border-burgundy bg-pink-50/30'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="savedAddress"
                      value={addr.id}
                      checked={selectedId === addr.id}
                      onChange={() => handleAddressSelect(addr.id)}
                      className="mt-1 accent-[#8e2157]"
                    />
                    <div className="text-sm">
                      <span className="font-medium">{addr.fullName}</span>
                      {addr.isDefault && (
                        <span className="ml-2 text-xs bg-burgundy text-white px-1.5 py-0.5 rounded">Default</span>
                      )}
                      <p className="text-gray-500 mt-0.5">
                        {addr.addressLine1}, {addr.city}, {addr.state} {addr.zipCode}
                      </p>
                    </div>
                  </label>
                ))}
                <label
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedId === 'new'
                      ? 'border-burgundy bg-pink-50/30'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value="new"
                    checked={selectedId === 'new'}
                    onChange={() => handleAddressSelect('new')}
                    className="accent-[#8e2157]"
                  />
                  <span className="text-sm font-medium">Use a new address</span>
                </label>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="John Doe"
                className={errors.fullName ? 'border-red-500' : ''}
              />
              {errors.fullName && (
                <p className="text-sm text-red-600 mt-1">{errors.fullName.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine1" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 1 *
              </label>
              <Input
                id="addressLine1"
                {...register('addressLine1')}
                placeholder="Street address, P.O. box"
                className={errors.addressLine1 ? 'border-red-500' : ''}
              />
              {errors.addressLine1 && (
                <p className="text-sm text-red-600 mt-1">{errors.addressLine1.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700 mb-1">
                Address Line 2 (Optional)
              </label>
              <Input
                id="addressLine2"
                {...register('addressLine2')}
                placeholder="Apartment, suite, unit, building, floor, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <Input
                  id="city"
                  {...register('city')}
                  placeholder="Dhaka"
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  Division/State *
                </label>
                <Input
                  id="state"
                  {...register('state')}
                  placeholder="Dhaka"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                  Zip Code *
                </label>
                <Input
                  id="zipCode"
                  {...register('zipCode')}
                  placeholder="1234"
                  className={errors.zipCode ? 'border-red-500' : ''}
                  maxLength={4}
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-600 mt-1">{errors.zipCode.message}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">4-digit postal code</p>
              </div>

              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                  Country *
                </label>
                <Input
                  id="country"
                  {...register('country')}
                  value="Bangladesh"
                  disabled
                  className="bg-gray-100"
                />
              </div>
            </div>

            {/* Save address checkbox (only for new addresses from authenticated users) */}
            {isAuthenticated && selectedId === 'new' && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={wantSave}
                  onChange={(e) => setWantSave(e.target.checked)}
                  className="w-4 h-4 accent-[#8e2157]"
                />
                <span className="text-sm text-gray-700">Save this address for future orders</span>
              </label>
            )}

            <Button type="submit" className="w-full gradient-primary text-white">
              Continue to Payment
            </Button>
          </form>
        </>
      )}
    </div>
  )
}
