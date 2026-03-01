# Brevo Email Setup Guide

## Overview

Aline Mart uses **Brevo** (formerly Sendinblue) for all email delivery:
- **Transactional emails** (order confirmation, shipping, OTP) — via nodemailer in `lib/email.ts`
- **Supabase Auth emails** (signup confirmation, password reset) — via Supabase Custom SMTP

**Free tier:** 300 emails/day (9,000/month)

---

## Step 1: Create Brevo Account

1. Go to [brevo.com](https://www.brevo.com) and sign up (free)
2. Confirm your email address

## Step 2: Get SMTP Credentials

1. Log in to Brevo Dashboard
2. Go to **Settings** (gear icon) → **SMTP & API** → **SMTP** tab
3. Note down:
   - **SMTP Server:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Login:** your Brevo account email
4. Click **"Generate a new SMTP key"** → copy the key

## Step 3: Verify Domain in Brevo

1. Go to **Settings** → **Senders, Domains & Dedicated IPs** → **Domains** tab
2. Click **"Add a domain"** → enter `alinemart.com`
3. Brevo will show DNS records to add (DKIM, SPF)
4. Go to your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.) and add those DNS records
5. Come back to Brevo and click **"Verify"**
6. Wait for verification (usually minutes, up to 48 hours)

## Step 4: Add Sender Address

1. In Brevo, go to **Settings** → **Senders, Domains & Dedicated IPs** → **Senders** tab
2. Click **"Add a sender"**
3. Enter:
   - **Name:** `Aline Mart`
   - **Email:** `support@alinemart.com`
4. Save (this works once your domain is verified)

## Step 5: Update Environment Variables

### Local (.env file)

The `.env` file already has placeholder values. Replace them with your real credentials:

```env
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your-brevo-login-email@example.com
SMTP_PASS=your-brevo-smtp-key-here
FROM_EMAIL=support@alinemart.com
FROM_NAME=Aline Mart
```

### Railway (Production)

1. Go to your Railway project dashboard
2. Click on the Aline Mart service → **Variables**
3. Add the same 6 environment variables with your real values

## Step 6: Configure Supabase Auth Emails

This makes signup confirmation, password reset, and magic link emails come from `support@alinemart.com` with branded templates.

### A. Enable Custom SMTP

1. Go to **Supabase Dashboard** → your project → **Authentication** → **SMTP Settings**
2. Toggle **"Enable Custom SMTP"** ON
3. Fill in:
   - **Sender email:** `support@alinemart.com`
   - **Sender name:** `Aline Mart`
   - **Host:** `smtp-relay.brevo.com`
   - **Port:** `587`
   - **Username:** your Brevo login email
   - **Password:** your Brevo SMTP key
4. Click **Save**
5. Send a test email to verify it works

### B. Customize Email Templates

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Edit the **"Confirm signup"** template
3. Replace the default content with this branded HTML:

```html
<div style="max-width: 520px; margin: 0 auto; font-family: 'Inter', Arial, sans-serif; background: #ffffff; border: 1px solid #E8E6E3;">
  <div style="height: 4px; background: linear-gradient(135deg, #8e2157 0%, #5c0931 100%);"></div>
  <div style="padding: 40px 32px; text-align: center;">
    <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 28px; color: #2C2C2C; margin-bottom: 8px;">
      Aline Mart
    </h1>
    <p style="font-size: 13px; color: #9CA3AF; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 32px;">
      Luxury Multi-Brand Marketplace
    </p>
    <h2 style="font-size: 22px; color: #2C2C2C; font-weight: 400; margin-bottom: 16px;">
      Welcome to Aline Mart
    </h2>
    <p style="font-size: 15px; color: #6B7280; line-height: 1.6; margin-bottom: 32px;">
      Thank you for creating your account. Please confirm your email address to get started.
    </p>
    <a href="{{ .ConfirmationURL }}"
       style="display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, #8e2157 0%, #5c0931 100%); color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase;">
      Confirm Email
    </a>
    <p style="font-size: 13px; color: #9CA3AF; margin-top: 32px; line-height: 1.5;">
      If you didn't create an account, you can safely ignore this email.
    </p>
  </div>
  <div style="padding: 20px 32px; border-top: 1px solid #E8E6E3; text-align: center;">
    <p style="font-size: 12px; color: #9CA3AF;">&copy; 2026 Aline Mart. All rights reserved.</p>
  </div>
</div>
```

> **Important:** `{{ .ConfirmationURL }}` is a Supabase template variable that auto-generates the confirmation link. Do not modify it.

---

## Verification Checklist

After completing all steps, test the following:

- [ ] Create a new account on alinemart.com — confirmation email arrives from `support@alinemart.com` with branded template
- [ ] Place a test order — order confirmation email arrives from `support@alinemart.com`
- [ ] Request password reset — reset email arrives from `support@alinemart.com`

---

## Upgrading (When Needed)

If you exceed 300 emails/day:

| Plan | Price | Emails/Month | Daily Limit |
|------|-------|-------------|-------------|
| Free | $0 | 9,000 | 300/day |
| Starter | $9/mo | 20,000 | No daily limit |
| Business | $18/mo | 20,000 | No daily limit |
