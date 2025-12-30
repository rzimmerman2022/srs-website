-- Migration: Admin Settings
-- Description: Adds admin_settings table for storing application configuration
-- Date: 2025-12-21
-- Author: SubAgent 2

-- Create admin_settings table
CREATE TABLE IF NOT EXISTS admin_settings (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Setting key (unique identifier)
  setting_key TEXT NOT NULL UNIQUE,

  -- Setting value (JSON for flexibility)
  setting_value JSONB NOT NULL DEFAULT '{}',

  -- Category for grouping settings
  category TEXT NOT NULL,

  -- Description for documentation
  description TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Updated by (admin user identifier)
  updated_by TEXT
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_admin_settings_category
  ON admin_settings(category);

CREATE INDEX IF NOT EXISTS idx_admin_settings_key
  ON admin_settings(setting_key);

-- Enable Row Level Security
ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

-- SECURITY: Admin-only access via service role key
-- No public (anon) access allowed - settings contain sensitive data (SMTP creds, security config)
-- CRITICAL: Only service_role can access
CREATE POLICY "Service role only access to admin_settings"
  ON admin_settings
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No permissions for anon role (security fix: prevent public exposure of SMTP creds)
-- All admin operations must use service role key
REVOKE ALL ON admin_settings FROM anon;

-- Insert default settings
INSERT INTO admin_settings (setting_key, setting_value, category, description)
VALUES
  ('general.company_name', '"Southwest Resumes"'::jsonb, 'general', 'Company name displayed in the admin panel'),
  ('general.admin_email', '"admin@southwestresumes.com"'::jsonb, 'general', 'Primary admin email for notifications'),
  ('questionnaire.default_points_per_question', '10'::jsonb, 'questionnaire', 'Default points awarded per completed question'),
  ('questionnaire.auto_save_interval', '30'::jsonb, 'questionnaire', 'Auto-save interval in seconds'),
  ('questionnaire.session_timeout', '60'::jsonb, 'questionnaire', 'Session timeout in minutes'),
  ('security.session_timeout_duration', '3600'::jsonb, 'security', 'Admin session timeout in seconds'),
  ('security.ip_allowlist', '[]'::jsonb, 'security', 'List of allowed IP addresses (empty array allows all)'),
  ('security.two_factor_enabled', 'false'::jsonb, 'security', 'Whether two-factor authentication is enabled'),
  ('email.smtp_host', '""'::jsonb, 'email', 'SMTP server hostname'),
  ('email.smtp_port', '587'::jsonb, 'email', 'SMTP server port'),
  ('email.smtp_username', '""'::jsonb, 'email', 'SMTP username'),
  ('email.smtp_password', '""'::jsonb, 'email', 'SMTP password (encrypted)'),
  ('email.from_email', '"noreply@southwestresumes.com"'::jsonb, 'email', 'From email address for notifications')
ON CONFLICT (setting_key) DO NOTHING;

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_admin_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
CREATE TRIGGER trigger_admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_admin_settings_updated_at();

-- Comments for documentation
COMMENT ON TABLE admin_settings IS 'Application-wide settings for admin configuration';
COMMENT ON COLUMN admin_settings.setting_key IS 'Unique identifier for the setting (e.g., "general.company_name")';
COMMENT ON COLUMN admin_settings.setting_value IS 'JSON value for the setting (allows strings, numbers, booleans, arrays, objects)';
COMMENT ON COLUMN admin_settings.category IS 'Category for grouping settings (general, questionnaire, security, email)';
COMMENT ON COLUMN admin_settings.updated_by IS 'Admin user who last updated this setting';
