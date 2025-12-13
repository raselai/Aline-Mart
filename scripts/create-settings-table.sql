-- Create settings table for admin configuration
-- This table stores site-wide settings as key-value pairs

CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index on key for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Insert default settings if they don't exist
INSERT INTO settings (key, value, created_at, updated_at)
VALUES
  ('site_name', '"Aline Mart"', NOW(), NOW()),
  ('site_logo', '"/logo.png"', NOW(), NOW()),
  ('contact_email', '"contact@alinemart.com"', NOW(), NOW()),
  ('contact_phone', '"+1 (555) 123-4567"', NOW(), NOW()),
  ('contact_address', '"123 Luxury Ave, Suite 100\nNew York, NY 10001"', NOW(), NOW()),
  ('seo_title', '"Aline Mart - Luxury Multi-Brand Fashion Marketplace"', NOW(), NOW()),
  ('seo_description', '"Discover luxury fashion from the world''s top brands. Shop designer clothing, accessories, watches, and more at Aline Mart."', NOW(), NOW()),
  ('seo_keywords', '"luxury fashion, designer brands, premium clothing, luxury accessories"', NOW(), NOW()),
  ('seo_og_image', '""', NOW(), NOW()),
  ('email_from_name', '"Aline Mart"', NOW(), NOW()),
  ('email_from_address', '"noreply@alinemart.com"', NOW(), NOW()),
  ('email_smtp_host', '""', NOW(), NOW()),
  ('email_smtp_port', '""', NOW(), NOW()),
  ('email_smtp_username', '""', NOW(), NOW()),
  ('email_smtp_password', '""', NOW(), NOW())
ON CONFLICT (key) DO NOTHING;
