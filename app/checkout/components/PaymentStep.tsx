'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { paymentStepSchema, type PaymentStepData } from '@/types/checkout'
import { Button } from '@/components/ui/button'
import { CheckCircle2, Edit2, CreditCard, Banknote, Loader2 } from 'lucide-react'

interface PaymentStepProps {
  isActive: boolean
  isComplete: boolean
  disabled: boolean
  isProcessing: boolean
  data?: PaymentStepData
  onComplete: (data: PaymentStepData) => void
  onEdit: () => void
}

export default function PaymentStep({
  isActive,
  isComplete,
  disabled,
  isProcessing,
  data,
  onComplete,
  onEdit,
}: PaymentStepProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PaymentStepData>({
    resolver: zodResolver(paymentStepSchema),
    defaultValues: data,
  })

  const selectedPaymentMethod = watch('paymentMethod')

  const onSubmit = (formData: PaymentStepData) => {
    onComplete(formData)
  }

  if (isComplete && !isActive) {
    return (
      <div className="border border-gray-200 rounded-lg p-6 bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
            <h3 className="text-lg font-semibold">Payment Method</h3>
          </div>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
        <div className="text-sm text-gray-600">
          <p className="font-medium">
            {data?.paymentMethod === 'PAYSTATION'
              ? 'PayStation (bKash / Nagad / Cards)'
              : 'Cash on Delivery (COD)'}
          </p>
          {data?.paymentMethod === 'COD' && (
            <p className="text-xs text-gray-500 mt-1">Shipping: ৳50</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={`border rounded-lg p-6 ${isActive ? 'border-burgundy bg-white' : disabled ? 'border-gray-200 bg-gray-50 opacity-60' : 'border-gray-200 bg-gray-50'}`}>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${isActive ? 'bg-burgundy' : 'bg-gray-400'}`}>
          3
        </div>
        <h3 className="text-lg font-semibold">Payment Method</h3>
      </div>

      {isActive && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* PayStation Option */}
          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-burgundy ${
              selectedPaymentMethod === 'PAYSTATION'
                ? 'border-burgundy bg-burgundy bg-opacity-5'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              value="PAYSTATION"
              {...register('paymentMethod')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <CreditCard className="h-5 w-5 text-burgundy" />
                <span className="font-semibold">PayStation</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-medium">
                  FREE Shipping
                </span>
              </div>
              <p className="text-sm text-gray-600">
                Pay securely with bKash, Nagad, or Credit/Debit Cards
              </p>
              <div className="flex gap-2 mt-2">
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">bKash</div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Nagad</div>
                <div className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">Cards</div>
              </div>
            </div>
          </label>

          {/* Cash on Delivery Option */}
          <label
            className={`flex items-start gap-4 p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-burgundy ${
              selectedPaymentMethod === 'COD'
                ? 'border-burgundy bg-burgundy bg-opacity-5'
                : 'border-gray-200'
            }`}
          >
            <input
              type="radio"
              value="COD"
              {...register('paymentMethod')}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Banknote className="h-5 w-5 text-burgundy" />
                <span className="font-semibold">Cash on Delivery</span>
              </div>
              <p className="text-sm text-gray-600">
                Pay with cash when your order is delivered
              </p>
              <p className="text-xs text-orange-600 font-medium mt-1">
                + ৳50 shipping charge
              </p>
            </div>
          </label>

          {errors.paymentMethod && (
            <p className="text-sm text-red-600">{errors.paymentMethod.message}</p>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-blue-900 mb-1">Secure Checkout</p>
            <p className="text-blue-700">
              {selectedPaymentMethod === 'PAYSTATION'
                ? 'You will be redirected to PayStation\'s secure payment gateway to complete your purchase.'
                : 'You will receive an order confirmation. Pay in cash when your order arrives.'}
            </p>
          </div>

          <Button
            type="submit"
            className="w-full gradient-primary text-white"
            disabled={isProcessing}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              selectedPaymentMethod === 'PAYSTATION'
                ? 'Proceed to Payment'
                : 'Place Order'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
