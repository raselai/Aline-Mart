'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/store/authStore'
import { getCurrentUser, onAuthStateChange } from '@/lib/supabase-auth'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const setSession = useAuthStore((s) => s.setSession)
  const setLoading = useAuthStore((s) => s.setLoading)

  useEffect(() => {
    getCurrentUser().then(({ session }) => {
      setSession(session)
      setLoading(false)
    })

    const subscription = onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [setSession, setLoading])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
