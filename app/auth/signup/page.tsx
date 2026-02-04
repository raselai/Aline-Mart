'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Mail, Lock, UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { z } from 'zod'

const signUpSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

type FieldErrors = Partial<Record<'name' | 'email' | 'password' | 'confirmPassword', string>>

export default function SignUpPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const router = useRouter()
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setSuccessMessage('')

    const validation = signUpSchema.safeParse({ name, email, password, confirmPassword })

    if (!validation.success) {
      const errors: FieldErrors = {}
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof FieldErrors
        if (!errors[field]) {
          errors[field] = issue.message
        }
      })
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)

    const result = await signUp(email, password, name)

    if (result.error) {
      setError(result.error)
      setIsSubmitting(false)
      return
    }

    if (result.session) {
      router.push('/')
    } else {
      setSuccessMessage(
        'Account created! Please check your email to confirm your account, then sign in.'
      )
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const result = await signInWithGoogle()
    if (result.error) {
      setError(result.error)
    }
  }

  const inputStyle = {
    border: '1px solid #D1D5DB',
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    outline: 'none',
  }

  const inputErrorStyle = {
    border: '1px solid #F87171',
    color: '#2C2C2C',
    backgroundColor: '#FFFFFF',
    outline: 'none',
  }

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = '#8e2157'
    e.currentTarget.style.boxShadow = '0 0 0 1px #8e2157'
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>, hasError: boolean) => {
    e.currentTarget.style.borderColor = hasError ? '#F87171' : '#D1D5DB'
    e.currentTarget.style.boxShadow = 'none'
  }

  if (successMessage) {
    return (
      <div
        className="w-full"
        style={{ maxWidth: '600px', minWidth: '320px' }}
      >
        <div
          className="bg-white rounded-lg shadow-lg text-center"
          style={{ padding: '32px', overflow: 'hidden' }}
        >
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: '#DCFCE7' }}
          >
            <Mail className="w-6 h-6" style={{ color: '#16A34A' }} />
          </div>
          <h1
            className="text-2xl font-serif font-bold mb-3"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Check Your Email
          </h1>
          <p
            className="text-sm mb-6"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%',
            }}
          >
            {successMessage}
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-2.5 text-sm font-semibold rounded-md transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
            }}
          >
            Go to Sign In
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      className="w-full"
      style={{ maxWidth: '600px', minWidth: '320px' }}
    >
      <div
        className="bg-white rounded-lg shadow-lg"
        style={{ padding: '32px', overflow: 'hidden' }}
      >
        {/* Heading */}
        <div className="text-center mb-8">
          <h1
            className="text-2xl sm:text-3xl font-serif font-bold mb-2"
            style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
          >
            Create Account
          </h1>
          <p
            className="text-sm"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%',
            }}
          >
            Join Aline Mart for a luxury shopping experience
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="mb-6 p-3 rounded text-sm"
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'anywhere',
              minWidth: '100%',
            }}
          >
            {error}
          </div>
        )}

        {/* Google Sign Up */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-200"
          style={{
            border: '1px solid #D1D5DB',
            color: '#2C2C2C',
            backgroundColor: '#FFFFFF',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#F9FAFB' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF' }}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            />
          </svg>
          <span style={{ whiteSpace: 'nowrap' }}>Continue with Google</span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div style={{ flex: 1, borderTop: '1px solid #E5E7EB' }} />
          <span
            className="px-4 text-xs uppercase tracking-wider"
            style={{ color: '#6B7280', whiteSpace: 'nowrap' }}
          >
            or
          </span>
          <div style={{ flex: 1, borderTop: '1px solid #E5E7EB' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="mb-5">
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Full Name
            </label>
            <div className="relative">
              <UserIcon
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#9CA3AF' }}
              />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm transition-colors"
                style={fieldErrors.name ? inputErrorStyle : inputStyle}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, !!fieldErrors.name)}
              />
            </div>
            {fieldErrors.name && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: '#DC2626',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {fieldErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-5">
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#9CA3AF' }}
              />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm transition-colors"
                style={fieldErrors.email ? inputErrorStyle : inputStyle}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, !!fieldErrors.email)}
              />
            </div>
            {fieldErrors.email && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: '#DC2626',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'anywhere',
                }}
              >
                {fieldErrors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#9CA3AF' }}
              />
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full pl-10 pr-10 py-2.5 rounded-md text-sm transition-colors"
                style={fieldErrors.password ? inputErrorStyle : inputStyle}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, !!fieldErrors.password)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                style={{ color: '#9CA3AF' }}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: '#DC2626',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {fieldErrors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium mb-1.5"
              style={{ color: '#2C2C2C', whiteSpace: 'nowrap' }}
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: '#9CA3AF' }}
              />
              <input
                id="confirmPassword"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat your password"
                className="w-full pl-10 pr-4 py-2.5 rounded-md text-sm transition-colors"
                style={fieldErrors.confirmPassword ? inputErrorStyle : inputStyle}
                onFocus={handleFocus}
                onBlur={(e) => handleBlur(e, !!fieldErrors.confirmPassword)}
              />
            </div>
            {fieldErrors.confirmPassword && (
              <p
                className="mt-1 text-xs"
                style={{
                  color: '#DC2626',
                  whiteSpace: 'normal',
                  wordBreak: 'normal',
                  overflowWrap: 'normal',
                }}
              >
                {fieldErrors.confirmPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 text-sm font-semibold rounded-md transition-all duration-200"
            style={{
              background: isSubmitting
                ? '#9CA3AF'
                : 'linear-gradient(135deg, #8e2157 0%, #5c0931 100%)',
              color: '#FFFFFF',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              opacity: isSubmitting ? 0.7 : 1,
              border: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p
            className="text-sm"
            style={{
              color: '#6B7280',
              display: 'block',
              whiteSpace: 'normal',
              wordBreak: 'normal',
              overflowWrap: 'normal',
              minWidth: '100%',
            }}
          >
            Already have an account?{' '}
            <Link
              href="/auth/login"
              className="font-medium transition-colors"
              style={{ color: '#8e2157' }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
