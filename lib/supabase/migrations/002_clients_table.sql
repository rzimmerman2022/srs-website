-- Migration: Clients Table
-- Description: Proper client management with automated onboarding
-- Date: 2025-12-23
-- Purpose: Fortune 500-level client management system

-- Enable UUID extension (required for uuid generation)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CLIENTS TABLE
-- ============================================================================
-- Core client information for CRM-style management

CREATE TABLE IF NOT EXISTS clients (
  -- Primary key
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Client identifiers
  client_id TEXT NOT NULL UNIQUE,  -- Short ID for URLs (e.g., "jdeleon")

  -- Personal information
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,

  -- Service information
  package_type TEXT NOT NULL DEFAULT 'discovery',  -- discovery, elite, executive
  status TEXT NOT NULL DEFAULT 'pending',  -- pending, active, completed, archived

  -- Questionnaire assignment
  questionnaire_id TEXT NOT NULL,  -- Which questionnaire template to use

  -- Auto-generated access
  access_token_id UUID,  -- FK to questionnaire_access_tokens (auto-created)

  -- Notes and metadata
  notes TEXT,
  metadata JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  onboarded_at TIMESTAMPTZ,  -- When welcome email was sent
  completed_at TIMESTAMPTZ   -- When questionnaire was completed
);

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at DESC);

-- ============================================================================
-- AUTO-UPDATE TRIGGER
-- ============================================================================

DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

-- SECURITY: Admin-only access via service role key
-- No public (anon) access allowed - all PII is protected
-- CRITICAL: Only service_role can access, NOT even authenticated users
CREATE POLICY "Service role only access to clients"
  ON clients
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- No permissions for anon role (security fix: prevent public PII exposure)
-- All admin operations must use service role key
REVOKE ALL ON clients FROM anon;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE clients IS 'Client management table with automated onboarding support';
COMMENT ON COLUMN clients.client_id IS 'Short URL-safe identifier for the client';
COMMENT ON COLUMN clients.package_type IS 'Service package: discovery, elite, executive';
COMMENT ON COLUMN clients.status IS 'Client status: pending (not sent), active (in progress), completed, archived';
COMMENT ON COLUMN clients.access_token_id IS 'Auto-generated access token for questionnaire';
COMMENT ON COLUMN clients.onboarded_at IS 'Timestamp when welcome email/link was sent';
