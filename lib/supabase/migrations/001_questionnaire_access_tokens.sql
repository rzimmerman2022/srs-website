-- Migration: Questionnaire Access Tokens
-- Description: Adds secure token-based authentication for questionnaire access
-- Date: 2025-12-21
-- Author: Agent 2

-- Create questionnaire_access_tokens table
CREATE TABLE IF NOT EXISTS questionnaire_access_tokens (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Client and questionnaire identifiers
  client_id TEXT NOT NULL,
  questionnaire_id TEXT NOT NULL,

  -- Secure token (32 characters)
  token TEXT NOT NULL UNIQUE,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  accessed_at TIMESTAMPTZ,

  -- Access tracking
  access_count INTEGER DEFAULT 0 NOT NULL,

  -- Revocation flag
  revoked BOOLEAN DEFAULT FALSE NOT NULL,

  -- Metadata (optional, for future extensions)
  metadata JSONB DEFAULT '{}'
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_questionnaire_access_tokens_token
  ON questionnaire_access_tokens(token);

CREATE INDEX IF NOT EXISTS idx_questionnaire_access_tokens_client_id
  ON questionnaire_access_tokens(client_id);

CREATE INDEX IF NOT EXISTS idx_questionnaire_access_tokens_questionnaire_id
  ON questionnaire_access_tokens(questionnaire_id);

-- Index for finding active (non-revoked, non-expired) tokens
CREATE INDEX IF NOT EXISTS idx_questionnaire_access_tokens_active
  ON questionnaire_access_tokens(token)
  WHERE NOT revoked AND expires_at > NOW();

-- Composite index for client + questionnaire lookups
CREATE INDEX IF NOT EXISTS idx_questionnaire_access_tokens_client_questionnaire
  ON questionnaire_access_tokens(client_id, questionnaire_id);

-- Enable Row Level Security
ALTER TABLE questionnaire_access_tokens ENABLE ROW LEVEL SECURITY;

-- SECURITY: Service role has full admin access
-- No anon access - token validation must be done via API endpoints
-- that use the service role key to prevent token enumeration attacks
CREATE POLICY "Service role full access to tokens"
  ON questionnaire_access_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- NOTE: No permissions granted to anon role (security fix: prevent public token exposure)
-- All token operations must use service role key via API endpoints

-- Comments for documentation
COMMENT ON TABLE questionnaire_access_tokens IS 'Secure token-based authentication for questionnaire access. Tokens are 32-character cryptographically random strings that expire after 30 days.';
COMMENT ON COLUMN questionnaire_access_tokens.token IS 'Cryptographically secure 32-character token for questionnaire access';
COMMENT ON COLUMN questionnaire_access_tokens.access_count IS 'Number of times this token has been used to access the questionnaire';
COMMENT ON COLUMN questionnaire_access_tokens.revoked IS 'Whether this token has been manually revoked';
COMMENT ON COLUMN questionnaire_access_tokens.expires_at IS 'Expiration timestamp (typically 30 days from creation)';
COMMENT ON COLUMN questionnaire_access_tokens.accessed_at IS 'Last access timestamp';
