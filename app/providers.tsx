'use client'

// SessionProvider temporarily disabled until authentication is fully configured
// import { SessionProvider } from "next-auth/react"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  )
}
