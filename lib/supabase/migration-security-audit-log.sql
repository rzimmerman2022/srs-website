-- Security Audit Log Migration
-- Run this in your Supabase SQL Editor to create the security_audit_log table

-- ============================================================================
-- Security Audit Log Table
-- ============================================================================
-- This table stores all security-related events for compliance and monitoring
CREATE TABLE IF NOT EXISTS security_audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,

  -- Event information
  event_type TEXT NOT NULL,
  action TEXT NOT NULL,
  success BOOLEAN NOT NULL DEFAULT true,
  error_message TEXT,

  -- User information
  user_id TEXT,
  user_type TEXT NOT NULL, -- 'admin', 'client', 'anonymous'

  -- Request metadata
  ip_address TEXT NOT NULL,
  user_agent TEXT,

  -- Resource information (what was accessed/modified)
  resource_type TEXT, -- 'questionnaire', 'response', 'client', 'export', etc.
  resource_id TEXT,

  -- Additional metadata (JSONB for flexibility)
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================================
-- Indexes for Performance
-- ============================================================================
-- Index on event_type for filtering by event type
CREATE INDEX IF NOT EXISTS idx_security_audit_log_event_type
  ON security_audit_log(event_type);

-- Index on user_id for user-specific queries
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id
  ON security_audit_log(user_id);

-- Index on created_at for time-based queries (most common)
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at
  ON security_audit_log(created_at DESC);

-- Index on ip_address for IP-based analysis
CREATE INDEX IF NOT EXISTS idx_security_audit_log_ip_address
  ON security_audit_log(ip_address);

-- Composite index for failed events (security incidents)
CREATE INDEX IF NOT EXISTS idx_security_audit_log_failed_events
  ON security_audit_log(success, event_type, created_at DESC)
  WHERE success = false;

-- Composite index for user activity analysis
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_activity
  ON security_audit_log(user_id, created_at DESC)
  WHERE user_id IS NOT NULL;

-- ============================================================================
-- Row Level Security (RLS)
-- ============================================================================
-- Enable RLS on the security_audit_log table
ALTER TABLE security_audit_log ENABLE ROW LEVEL SECURITY;

-- Policy: Allow insert for all (logging should never be blocked)
-- Note: In production, you might want to restrict this to service role only
CREATE POLICY "Allow insert for audit logging"
  ON security_audit_log
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow read only for authenticated admin users
-- For now, we allow all reads (can be restricted later with auth)
CREATE POLICY "Allow read for audit review"
  ON security_audit_log
  FOR SELECT
  USING (true);

-- Grant permissions to anon role for logging
GRANT INSERT ON security_audit_log TO anon;
GRANT SELECT ON security_audit_log TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- ============================================================================
-- Comments for Documentation
-- ============================================================================
COMMENT ON TABLE security_audit_log IS 'Comprehensive security audit log for all security-related events';
COMMENT ON COLUMN security_audit_log.event_type IS 'Type of security event (login_success, login_failure, access_denied, etc.)';
COMMENT ON COLUMN security_audit_log.action IS 'Specific action taken (login, logout, view, export, delete, etc.)';
COMMENT ON COLUMN security_audit_log.success IS 'Whether the action was successful';
COMMENT ON COLUMN security_audit_log.user_type IS 'Type of user (admin, client, anonymous)';
COMMENT ON COLUMN security_audit_log.resource_type IS 'Type of resource accessed (questionnaire, response, client, etc.)';
COMMENT ON COLUMN security_audit_log.metadata IS 'Additional flexible metadata for the event';

-- ============================================================================
-- Maintenance
-- ============================================================================
-- Optional: Create a function to automatically clean old audit logs (e.g., after 1 year)
-- Uncomment and modify retention period as needed:
--
-- CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
-- RETURNS void AS $$
-- BEGIN
--   DELETE FROM security_audit_log
--   WHERE created_at < NOW() - INTERVAL '1 year';
-- END;
-- $$ LANGUAGE plpgsql;
--
-- -- Create a scheduled job to run cleanup monthly (requires pg_cron extension)
-- -- SELECT cron.schedule('cleanup-audit-logs', '0 0 1 * *', 'SELECT cleanup_old_audit_logs();');
