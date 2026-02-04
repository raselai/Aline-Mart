'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
        router.replace('/')
      }
    })
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-gray">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-burgundy border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-charcoal text-sm">Completing sign in...</p>
      </div>
    </div>
  )
}
