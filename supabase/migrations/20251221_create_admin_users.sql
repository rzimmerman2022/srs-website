-- ============================================================================
-- ADMIN USERS TABLE MIGRATION
-- ============================================================================
-- This migration creates the admin_users table for managing admin authentication
-- and authorization within the Southwest Resume Services admin panel.
--
-- Security Features:
-- - Linked to Supabase auth.users for authentication
-- - Role-based access control (super_admin, admin, viewer)
-- - Active status for enabling/disabling accounts
-- - Last login tracking for security monitoring
--
-- Created: 2025-12-21
-- ============================================================================

-- Create admin_users table
CREATE TABLE IF NOT EXISTS admin_users (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Foreign key to auth.users (Supabase authentication)
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- User information
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,

  -- Role-based access control
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('super_admin', 'admin', 'viewer')),

  -- Account status
  active BOOLEAN NOT NULL DEFAULT true,

  -- Security tracking
  last_login_at TIMESTAMPTZ,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Index for faster lookups by user_id (most common query)
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);

-- Index for faster lookups by email
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Index for active users (for filtering)
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(active);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy: Allow admin users to read all admin user records
CREATE POLICY "Admin users can view all admin users"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND active = true
    )
  );

-- Policy: Only super_admin can insert new admin users
CREATE POLICY "Only super_admin can create admin users"
  ON admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND active = true
    )
  );

-- Policy: Only super_admin can update admin users
CREATE POLICY "Only super_admin can update admin users"
  ON admin_users
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND active = true
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND active = true
    )
  );

-- Policy: Only super_admin can delete admin users
CREATE POLICY "Only super_admin can delete admin users"
  ON admin_users
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM admin_users
      WHERE user_id = auth.uid()
      AND role = 'super_admin'
      AND active = true
    )
  );

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_users_updated_at();

-- ============================================================================
-- INITIAL DATA (OPTIONAL)
-- ============================================================================
-- Uncomment and modify to create initial admin user
-- Note: You must first create the user in Supabase Auth, then add them here
--
-- INSERT INTO admin_users (user_id, email, full_name, role, active)
-- VALUES (
--   'YOUR_USER_ID_FROM_AUTH_USERS', -- Replace with actual UUID from auth.users
--   'admin@example.com',
--   'Admin User',
--   'super_admin',
--   true
-- );

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE admin_users IS 'Admin users with role-based access control for the admin panel';
COMMENT ON COLUMN admin_users.id IS 'Primary key';
COMMENT ON COLUMN admin_users.user_id IS 'Foreign key to auth.users for Supabase authentication';
COMMENT ON COLUMN admin_users.email IS 'Admin user email address (must match auth.users.email)';
COMMENT ON COLUMN admin_users.full_name IS 'Full name of the admin user';
COMMENT ON COLUMN admin_users.role IS 'Role: super_admin (full access), admin (limited access), viewer (read-only)';
COMMENT ON COLUMN admin_users.active IS 'Whether the admin account is active and can login';
COMMENT ON COLUMN admin_users.last_login_at IS 'Timestamp of last successful login';
COMMENT ON COLUMN admin_users.created_at IS 'Timestamp when the admin user was created';
COMMENT ON COLUMN admin_users.updated_at IS 'Timestamp when the admin user was last updated';
