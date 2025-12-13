# Supabase Storage Setup Guide

This guide explains how to set up **Supabase Storage** for uploading product images in the admin dashboard.

---

## Why Supabase Storage?

Currently, the product form only accepts image URLs. With Supabase Storage configured, admins can:
- ✅ Upload images directly from their computer
- ✅ Automatically get public URLs for uploaded images
- ✅ Store images securely in Supabase cloud storage
- ✅ Preview images before saving the product

---

## Step-by-Step Setup

### **Step 1: Create Storage Bucket**

1. Go to your **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project (the one with the database we're using)
3. Click **Storage** in the left sidebar
4. Click **New Bucket** button
5. Fill in the following:
   - **Name:** `product-images`
   - **Public bucket:** ✅ **Check this** (so images can be accessed publicly)
   - **File size limit:** 5 MB (or your preference)
   - **Allowed MIME types:** Leave empty or add `image/*`
6. Click **Create Bucket**

**Important:** The bucket name MUST be exactly `product-images` because the code expects this name.

---

### **Step 2: Set Bucket Permissions (Public Access)**

By default, buckets are private. We need to make uploaded images publicly accessible:

1. In **Storage**, click on the `product-images` bucket
2. Click **Policies** tab at the top
3. Click **New Policy** button
4. Choose **"For full customization"** template
5. Create the following policies:

#### **Policy 1: Allow Public Read Access** (So customers can see images)

```sql
-- Policy Name: Public read access
-- Allowed operation: SELECT
-- Target roles: public

CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');
```

#### **Policy 2: Allow Authenticated Upload** (So admins can upload)

```sql
-- Policy Name: Authenticated users can upload
-- Allowed operation: INSERT
-- Target roles: authenticated

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');
```

#### **Policy 3: Allow Authenticated Update** (So admins can replace images)

```sql
-- Policy Name: Authenticated users can update
-- Allowed operation: UPDATE
-- Target roles: authenticated

CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images');
```

#### **Policy 4: Allow Authenticated Delete** (So admins can delete images)

```sql
-- Policy Name: Authenticated users can delete
-- Allowed operation: DELETE
-- Target roles: authenticated

CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images');
```

---

### **Step 3: Verify Setup**

1. Go to **Admin Dashboard** → **Products** → **Add New Product**
2. Click **"Add Image"** button
3. Click **"Upload Image"** button
4. Select an image from your computer
5. You should see:
   - Upload progress bar
   - Image preview appears
   - Public URL is automatically filled in

If you get an error saying `"Storage bucket 'product-images' not found"`, go back to Step 1 and verify the bucket name.

---

## How It Works

1. **Admin uploads image** → File is sent to Supabase Storage
2. **Supabase saves file** → Stored in `products/` folder inside `product-images` bucket
3. **Unique filename generated** → Prevents naming conflicts (e.g., `1702345678-abc123.jpg`)
4. **Public URL returned** → Automatically filled into the image URL field
5. **Product saved** → URL is stored in database like any other image URL

---

## Troubleshooting

### Error: "Storage bucket 'product-images' not found"
**Solution:** Create the bucket in Supabase Dashboard (see Step 1). Make sure the name is exactly `product-images`.

### Error: "Permission denied"
**Solution:** Check bucket policies (Step 2). Make sure public read access is enabled.

### Image uploads but doesn't appear
**Solution:**
- Check if bucket is marked as **Public**
- Verify the public URL by visiting it in a browser
- Check browser console for CORS errors

### Upload progress stuck at 0%
**Solution:**
- Check internet connection
- Verify Supabase project is active (not paused)
- Check browser console for errors

---

## File Structure

Uploaded images are stored in this structure:

```
product-images/                    ← Bucket name
└── products/                      ← Folder for product images
    ├── 1702345678-abc123.jpg     ← Unique filename (timestamp + random ID)
    ├── 1702345679-def456.png
    └── 1702345680-ghi789.webp
```

---

## Optional: Enable Image Transformations

Supabase Storage supports automatic image transformations (resize, crop, compress):

1. Go to **Storage** → **Settings**
2. Enable **Image Transformations**
3. You can then request images at different sizes:
   - Original: `https://your-project.supabase.co/storage/v1/object/public/product-images/products/image.jpg`
   - Thumbnail: `https://your-project.supabase.co/storage/v1/object/public/product-images/products/image.jpg?width=200&height=200`

---

## Security Notes

- ✅ Only **authenticated users** can upload images (admins only)
- ✅ **Public read access** allows anyone to view images (needed for customer-facing site)
- ✅ **File size limits** prevent abuse (5MB recommended)
- ✅ **Unique filenames** prevent overwriting existing images
- ⚠️ Consider adding **file type validation** in production (only allow .jpg, .png, .webp)

---

## Alternative: Continue Using URLs

If you prefer **NOT** to use Supabase Storage, you can still use image URLs from:
- **Unsplash** (https://unsplash.com)
- **Imgur** (https://imgur.com)
- **Cloudinary** (https://cloudinary.com)
- **Your own CDN**

The form supports both upload AND URL input, so admins can choose either method.

---

## Next Steps

Once storage is set up:
1. ✅ Test uploading product images
2. ✅ Verify images appear on product detail pages
3. ✅ Check image load speed on customer-facing pages
4. Consider implementing image optimization for better performance

---

**Questions?** Check the Supabase Storage documentation: https://supabase.com/docs/guides/storage
