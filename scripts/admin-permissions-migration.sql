-- Admin Permissions Table
-- One row per ADMIN user. SUPER_ADMIN has no row and bypasses all permission checks.
-- modules: JSONB array of module keys the admin can access, e.g. ["orders","products"]
-- is_active: soft-deactivate an admin without deleting their account

CREATE TABLE IF NOT EXISTS admin_permissions (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
  user_id TEXT NOT NULL UNIQUE,
  modules JSONB NOT NULL DEFAULT '[]'::JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  created_by TEXT,
  CONSTRAINT admin_permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES "User"(id) ON DELETE CASCADE,
  CONSTRAINT admin_permissions_created_by_fkey FOREIGN KEY (created_by) REFERENCES "User"(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS admin_permissions_user_id_idx ON admin_permissions(user_id);
