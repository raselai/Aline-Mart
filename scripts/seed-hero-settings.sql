-- Seed default hero carousel settings
-- Run this in the Supabase SQL Editor

INSERT INTO settings (key, value)
VALUES
  ('hero_tagline', '"Est. 2024"'),
  ('hero_headline', '"World''s Finest Brands, One Destination"'),
  ('hero_subheadline', '"Discover curated luxury from Rolex, Gucci, Prada, and the world''s most prestigious houses"'),
  ('hero_cta_text', '"Explore Collection"'),
  ('hero_cta_link', '"/products"'),
  ('hero_stat_1_number', '"20+"'),
  ('hero_stat_1_label', '"BRANDS"'),
  ('hero_stat_2_number', '"100+"'),
  ('hero_stat_2_label', '"PRODUCTS"'),
  ('hero_images', '["/Hero/hero-1.jpg", "/Hero/hero-2.jpg", "/Hero/hero-3.jpg", "/Hero/hero-4.jpg", "/Hero/hero-5.jpg"]')
ON CONFLICT (key) DO NOTHING;
