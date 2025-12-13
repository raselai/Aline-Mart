/**
 * Auth Layout for Admin Login
 * This layout does NOT check for authentication
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
