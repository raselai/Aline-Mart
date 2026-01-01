'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { contactStepSchema, type ContactStepData } from '@/types/checkout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle2, Edit2 } from 'lucide-react'

interface ContactStepProps {
  isActive: boolean
  isComplete: boolean
  data?: ContactStepData
  onComplete: (data: ContactStepData) => void
  onEdit: () => void
}

export default function ContactStep({
  isActive,
  isComplete,
  data,
  onComplete,
  onEdit,
}: ContactStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactStepData>({
    resolver: zodResolver(contactStepSchema),
    defaultValues: data,
  })

  const onSubmit = (formData: ContactStepData) => {
    onComplete(formData)
  }

  if (isComplete && !isActive) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Contact Information</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          <p>{data?.email}</p>
          <p>{data?.phone}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-burgundy bg-white' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${isActive ? 'bg-burgundy' : 'bg-gray-400'}`}>
          1
        </div>
        <h3 className="text-lg font-semibold">Contact Information</h3>
      </div>

      {isActive && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="you@example.com"
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register('phone')}
              placeholder="01712345678"
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Bangladesh phone number format (e.g., 01712345678)
            </p>
          </div>

          <Button type="submit" className="w-full gradient-primary text-white">
            Continue to Shipping
          </Button>
        </form>
      )}
    </div>
  )
}
