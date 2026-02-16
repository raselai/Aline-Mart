-- Create CategoryBanner table for admin-managed promotional banners on category pages
-- Run this in Supabase SQL Editor
-- Also create a "category-banners" storage bucket (public) in Supabase Dashboard

CREATE TABLE "CategoryBanner" (
  id TEXT PRIMARY KEY,
  "categoryId" TEXT NOT NULL UNIQUE,
  "imageUrl" TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  "linkUrl" TEXT,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CategoryBanner_categoryId_fkey"
    FOREIGN KEY ("categoryId") REFERENCES "Category"(id) ON DELETE CASCADE
);

-- Index for quick lookup by categoryId
CREATE INDEX "CategoryBanner_categoryId_idx" ON "CategoryBanner"("categoryId");
