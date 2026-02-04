import { supabase } from '@/lib/supabase'
import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export interface AuthResult {
  user: User | null
  session: Session | null
  error: string | null
}

export async function signUpWithEmail(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name },
    },
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { user: null, session: null, error: error.message }
  }

  return { user: data.user, session: data.session, error: null }
}

export async function signInWithGoogle(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signOut(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut()

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function getCurrentUser(): Promise<{
  user: User | null
  session: Session | null
}> {
  const { data: { session } } = await supabase.auth.getSession()

  return {
    user: session?.user ?? null,
    session,
  }
}

export async function updateUserProfile(
  name: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.updateUser({
    data: { full_name: name },
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export function onAuthStateChange(
  callback: (event: AuthChangeEvent, session: Session | null) => void
) {
  const { data: { subscription } } = supabase.auth.onAuthStateChange(callback)
  return subscription
}
