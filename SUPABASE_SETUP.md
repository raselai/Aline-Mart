# Supabase Setup Guide for Aline Mart

## Step-by-Step Instructions

### 1. Create Supabase Account & Project (5 minutes)

1. **Go to Supabase:**
   - Visit: https://supabase.com
   - Click "Start your project" or "Sign In"

2. **Sign Up:**
   - Recommended: Sign up with GitHub (faster)
   - Alternative: Use email/password

3. **Create New Project:**
   - Click "New Project" button
   - Fill in details:
     - **Name:** `aline-mart` (or any name you prefer)
     - **Database Password:** Create a STRONG password
       - ⚠️ **IMPORTANT:** Save this password somewhere safe (you'll need it!)
       - Suggestion: Use a password manager or write it down
     - **Region:** Choose closest to your location
       - US East (North Virginia)
       - EU West (Ireland)
       - Asia Southeast (Singapore)
       - etc.
     - **Pricing Plan:** Free
   - Click "Create new project"

4. **Wait for Provisioning:**
   - Takes 2-3 minutes
   - You'll see a progress indicator
   - Dashboard will appear when ready

---

### 2. Get Your Database Connection String

Once your project is ready:

1. **Navigate to Database Settings:**
   - In Supabase dashboard, click the ⚙️ **Settings** icon (bottom left)
   - Click **Database** in the left sidebar

2. **Find Connection String:**
   - Scroll down to **"Connection string"** section
   - You'll see multiple options (Session mode, Transaction mode, etc.)
   - Click on **"URI"** tab (this is what we need)

3. **Copy the Connection String:**
   - You'll see something like:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - Click the **copy** icon
   - **IMPORTANT:** The `[YOUR-PASSWORD]` placeholder needs to be replaced with your actual database password

4. **Replace Password in Connection String:**
   - Replace `[YOUR-PASSWORD]` with the password you created in Step 1
   - Final format should look like:
     ```
     postgresql://postgres.abcdefghijklmnop:MyStr0ngP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

---

### 3. Configure Your `.env` File

1. **Open your `.env` file** in the project root (`E:\Desktop 1\Aline Mart\aline-mart\.env`)

2. **Replace the DATABASE_URL:**
   - Find the line that starts with `DATABASE_URL=`
   - Replace the entire value with your Supabase connection string
   - Make sure it's wrapped in quotes

   **Example:**
   ```env
   DATABASE_URL="postgresql://postgres.abcdefghijklmnop:MyStr0ngP@ssw0rd@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
   ```

3. **Save the file**

---

### 4. Test the Connection

Run these commands in your terminal:

```bash
# Generate Prisma Client with the new connection
npx prisma generate

# Test the connection and create tables
npx prisma migrate dev --name init

# If successful, you should see:
# ✔ Generated Prisma Client
# ✔ Database schema synchronized with migration
```

If you see errors:
- Double-check your DATABASE_URL is correct
- Make sure the password is correct (no typos)
- Ensure there are no extra spaces in the .env file

---

### 5. Verify in Supabase Dashboard

1. **Go back to Supabase Dashboard**
2. **Click "Table Editor"** in the left sidebar
3. **You should see your tables:**
   - User
   - Brand
   - Category
   - Product
   - ProductImage
   - ProductVariant
   - Order
   - OrderItem
   - Address
   - WishlistItem

If you see these tables, **SUCCESS!** 🎉

---

## Quick Reference

### Where to Find Things in Supabase:

| What You Need | Where to Find It |
|---------------|------------------|
| Connection String | Settings → Database → Connection string (URI) |
| View Tables | Table Editor (sidebar) |
| Run SQL Queries | SQL Editor (sidebar) |
| API Keys | Settings → API |
| Database Password | Can't retrieve (must reset if forgotten) |
| Project Settings | Settings icon (gear) bottom left |

### Common Connection String Formats:

**Transaction Mode (Recommended for Prisma):**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres
```

**Session Mode (Alternative):**
```
postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

**Direct Connection (Not recommended for serverless):**
```
postgresql://postgres:[password]@db.[ref].supabase.co:5432/postgres
```

For Next.js with Prisma, use **Transaction Mode** (port 6543) or **Session Mode** (port 5432).

---

## Troubleshooting

### "Can't reach database server"
- Check your internet connection
- Verify the connection string is correct
- Make sure Supabase project is active (not paused)

### "Password authentication failed"
- Double-check the password in your connection string
- Try resetting the database password:
  1. Supabase Dashboard → Settings → Database
  2. Click "Reset Database Password"
  3. Enter new password
  4. Update your .env file

### "SSL connection required"
- Add `?sslmode=require` to the end of your connection string
- Example: `postgresql://...postgres?sslmode=require`

### "Too many connections"
- Free tier has connection limits
- Make sure you're not running multiple instances
- Restart your dev server

### Tables not appearing after migration
- Check the SQL Editor in Supabase to see if tables exist
- Try running migrations again: `npx prisma migrate reset`
- Check for error messages in terminal

---

## Next Steps After Setup

Once your database is connected:

1. ✅ Prisma client is now working
2. ✅ Database tables are created
3. 📝 Next: Create seed script to populate data
4. 📝 Next: Build API routes to fetch data
5. 📝 Next: Update frontend to use real data

---

## Useful Supabase Features for Later

Once you're comfortable with the basics:

- **Row Level Security (RLS):** Add database-level security rules
- **Realtime:** Subscribe to database changes in real-time
- **Storage:** Upload and serve images (alternative to Cloudinary)
- **Auth:** Built-in authentication (alternative to NextAuth)
- **Edge Functions:** Serverless functions (alternative to Next.js API routes)

For now, we'll just use it as a PostgreSQL database, but these features are available when you need them!

---

## Support

- **Supabase Docs:** https://supabase.com/docs
- **Supabase Discord:** https://discord.supabase.com
- **Prisma + Supabase Guide:** https://supabase.com/docs/guides/integrations/prisma

---

**Last Updated:** December 5, 2025
