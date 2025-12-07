export { auth as proxy } from "@/lib/auth"

export const config = {
  matcher: [
    "/checkout/:path*",
    "/account/:path*",
  ],
}
