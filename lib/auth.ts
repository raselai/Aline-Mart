import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    })
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/", // Redirect to homepage for sign in
    error: "/", // Redirect to homepage on error
  },

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.email = token.email!
        session.user.name = token.name
        session.user.image = token.picture
      }
      return session
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },

  debug: process.env.NODE_ENV === "development",
})
