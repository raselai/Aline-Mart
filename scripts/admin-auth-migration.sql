-- Admin Authentication Migration
-- Run this in Supabase SQL Editor to add admin functionality

-- Step 1: Add role field to User table
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'CUSTOMER';
-- Values: 'CUSTOMER', 'ADMIN', 'SUPER_ADMIN'

-- Step 2: Create admin_activity_log table for audit logging
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  admin_id TEXT NOT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id TEXT,
  details JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT admin_activity_log_admin_id_fkey FOREIGN KEY (admin_id) REFERENCES "User"(id) ON DELETE CASCADE
);

-- Step 3: Create index for faster queries
CREATE INDEX IF NOT EXISTS admin_activity_log_admin_id_idx ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS admin_activity_log_created_at_idx ON admin_activity_log(created_at);
CREATE INDEX IF NOT EXISTS user_role_idx ON "User"(role);

-- Step 4: Create settings table for site configuration
CREATE TABLE IF NOT EXISTS settings (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Step 5: Create a default admin user (CHANGE THE EMAIL AND PASSWORD!)
-- Password is hashed with bcrypt - you should change this!
-- Default: admin@alinemart.com / Admin123!@#
INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid()::TEXT,
  'admin@alinemart.com',
  'Admin User',
  '$2a$10$xQJ5YKXJQqHvF1qZqEqL8O5YK3xF5KZJqQqQqQqQqQqQqQqQqQqQq',  -- Change this!
  'ADMIN',
  NOW(),
  NOW()
)
ON CONFLICT (email) DO NOTHING;

-- Success message
SELECT 'Admin authentication tables created successfully!' as message;
SELECT 'IMPORTANT: Change the default admin password immediately!' as warning;
