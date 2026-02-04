import { useCallback } from 'react'
import { useAuthStore } from '@/store/authStore'
import {
  signInWithEmail as authSignIn,
  signUpWithEmail as authSignUp,
  signInWithGoogle as authSignInGoogle,
  signOut as authSignOut,
} from '@/lib/supabase-auth'

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const session = useAuthStore((s) => s.session)
  const isLoading = useAuthStore((s) => s.isLoading)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await authSignIn(email, password)
    return result
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const result = await authSignUp(email, password, name)
    return result
  }, [])

  const signInWithGoogle = useCallback(async () => {
    const result = await authSignInGoogle()
    return result
  }, [])

  const signOut = useCallback(async () => {
    const result = await authSignOut()
    return result
  }, [])

  const userName = user?.user_metadata?.full_name as string | undefined
  const userEmail = user?.email
  const userAvatar = user?.user_metadata?.avatar_url as string | undefined

  return {
    user,
    session,
    isLoading,
    isAuthenticated,
    userName,
    userEmail,
    userAvatar,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }
}
