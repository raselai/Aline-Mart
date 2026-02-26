# Google OAuth Setup Guide for Aline Mart

This guide will help you set up Google OAuth authentication for your Aline Mart eCommerce platform.

---

## Prerequisites

- Google account
- Aline Mart project running locally

---

## Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**
   Visit: https://console.cloud.google.com/

2. **Create a New Project**
   - Click "Select a project" dropdown at the top
   - Click "NEW PROJECT"
   - Project name: `Aline Mart` (or your preferred name)
   - Click "CREATE"

3. **Wait for Project Creation**
   - It may take a few seconds
   - You'll see a notification when it's ready

---

## Step 2: Enable Google+ API

1. **Navigate to APIs & Services**
   - From the left menu, click "APIs & Services" → "Library"

2. **Search for Google+ API**
   - In the search bar, type "Google+ API"
   - Click on "Google+ API"
   - Click "ENABLE"

---

## Step 3: Configure OAuth Consent Screen

1. **Go to OAuth Consent Screen**
   - Left menu: "APIs & Services" → "OAuth consent screen"

2. **Choose User Type**
   - Select "External" (for testing with any Google account)
   - Click "CREATE"

3. **Fill in App Information**
   - **App name:** `Aline Mart`
   - **User support email:** Your email address
   - **App logo:** (Optional - can skip for now)
   - **App domain:** (Skip for local development)
   - **Authorized domains:** (Skip for local development)
   - **Developer contact email:** Your email address
   - Click "SAVE AND CONTINUE"

4. **Scopes** (Step 2)
   - Click "ADD OR REMOVE SCOPES"
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
     - `openid`
   - Click "UPDATE"
   - Click "SAVE AND CONTINUE"

5. **Test Users** (Step 3)
   - Click "ADD USERS"
   - Add your Google email address
   - Add any other test email addresses
   - Click "ADD"
   - Click "SAVE AND CONTINUE"

6. **Summary** (Step 4)
   - Review your settings
   - Click "BACK TO DASHBOARD"

---

## Step 4: Create OAuth 2.0 Credentials

1. **Go to Credentials**
   - Left menu: "APIs & Services" → "Credentials"

2. **Create OAuth Client ID**
   - Click "CREATE CREDENTIALS" → "OAuth client ID"

3. **Configure OAuth Client**
   - **Application type:** Web application
   - **Name:** `Aline Mart Web Client`

4. **Add Authorized JavaScript Origins**
   - Click "ADD URI" under "Authorized JavaScript origins"
   - Add: `http://localhost:3000`
   - Click "ADD URI" again
   - Add: `http://localhost:3001` (in case port changes)

5. **Add Authorized Redirect URIs**
   - Click "ADD URI" under "Authorized redirect URIs"
   - Add: `http://localhost:3000/api/auth/callback/google`
   - Click "ADD URI" again
   - Add: `http://localhost:3001/api/auth/callback/google`

6. **Create Credentials**
   - Click "CREATE"

7. **Save Your Credentials**
   - A modal will appear with your **Client ID** and **Client Secret**
   - **IMPORTANT:** Copy these values immediately!
   - Click "OK"

---

## Step 5: Add Environment Variables

1. **Open Your `.env` File**
   - Located at: `E:\Desktop 1\Aline Mart\aline-mart\.env`

2. **Add the Following Variables**

```env
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-here-change-this-to-something-random

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Supabase Service Role Key (for NextAuth adapter)
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
```

3. **Replace the Values:**

   **NEXTAUTH_SECRET:**
   - Generate a random secret key
   - On Windows, open PowerShell and run:
     ```powershell
     -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
     ```
   - OR use any random 32+ character string

   **GOOGLE_CLIENT_ID:**
   - Paste the Client ID from Step 4

   **GOOGLE_CLIENT_SECRET:**
   - Paste the Client Secret from Step 4

   **SUPABASE_SERVICE_ROLE_KEY:**
   - Go to your Supabase project: https://supabase.com/dashboard
   - Select your project
   - Go to "Settings" → "API"
   - Copy the "service_role" key (NOT the anon key!)
   - **WARNING:** This key bypasses Row Level Security - keep it secret!

4. **Save the `.env` File**

---

## Step 6: Verify Setup

1. **Check Your `.env` File**
   - Make sure all 5 variables are set
   - No quotes around values
   - No spaces around `=` signs

Example:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=abc123xyz789randomstringhere
GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abc123xyz
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

2. **Restart Your Development Server**
   - Stop the server (Ctrl+C)
   - Start it again: `npm run dev`

3. **Test Sign In**
   - Go to: http://localhost:3000
   - Click "Sign in with Google"
   - You should see the Google OAuth consent screen
   - Sign in with your Google account
   - You should be redirected back to the homepage, now logged in!

---

## Troubleshooting

### Error: "redirect_uri_mismatch"
**Solution:**
- Check that your redirect URI in Google Console exactly matches:
  `http://localhost:3000/api/auth/callback/google`
- Check the port number (3000 vs 3001)

### Error: "Access blocked: Aline Mart has not completed the Google verification process"
**Solution:**
- This is normal for apps in development
- Make sure you added yourself as a "Test User" in Step 3
- Use the email address you added as a test user

### Error: "Invalid client_id"
**Solution:**
- Double-check your `GOOGLE_CLIENT_ID` in `.env`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env`

### Error: "NEXTAUTH_SECRET is not set"
**Solution:**
- Make sure `NEXTAUTH_SECRET` is set in your `.env` file
- Restart your dev server

### Session Not Persisting
**Solution:**
- Check browser console for errors
- Clear cookies and try again
- Make sure `NEXTAUTH_URL` matches your current URL

---

## Production Setup (When Ready to Deploy)

When you're ready to deploy to production (Railway):

1. **Add Production URLs to Google Console**
   - Authorized JavaScript origins: `https://your-domain.com`
   - Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`

2. **Update Environment Variables in Railway**
   - Go to Railway dashboard → Your project → Variables tab
   - Add all the same variables
   - Change `NEXTAUTH_URL` to your production URL

3. **Publish OAuth App**
   - In Google Console, go to "OAuth consent screen"
   - Click "PUBLISH APP"
   - Fill out the verification form (required for public apps)

---

## Security Notes

⚠️ **NEVER commit your `.env` file to Git!**
- `.env` should already be in `.gitignore`
- If you accidentally commit secrets, regenerate them immediately

⚠️ **Keep your `SUPABASE_SERVICE_ROLE_KEY` secret!**
- This key bypasses all security rules
- Only use it server-side (never expose to client)

⚠️ **Regenerate secrets if exposed**
- If you accidentally expose any secrets, regenerate them:
  - Google: Create new OAuth credentials
  - Supabase: Rotate service role key in Supabase dashboard

---

## Next Steps

Once authentication is working:
1. ✅ Users can sign in with Google
2. ✅ User info appears in header
3. → Proceed to Phase 4: Checkout & Payments (Stripe integration)

---

**Need Help?**
- Google Cloud Console: https://console.cloud.google.com/
- NextAuth.js Docs: https://authjs.dev/
- Supabase Docs: https://supabase.com/docs

Happy coding! 🚀
