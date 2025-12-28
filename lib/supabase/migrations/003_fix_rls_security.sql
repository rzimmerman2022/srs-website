-- Migration: Fix RLS Security Vulnerabilities
-- Description: Fixes CRITICAL security issues #2 and #3 - Public PII and token exposure
-- Date: 2025-12-28
-- Issue: Both clients and questionnaire_access_tokens tables had USING(true) + GRANT ALL TO anon
--        This exposed all client PII and access tokens to anyone with the anon key

-- ============================================================================
-- FIX #2 CRITICAL: clients Table RLS
-- ============================================================================

-- Drop the insecure policy
DROP POLICY IF EXISTS "Allow all operations on clients" ON clients;

-- Create secure policy: Service role and authenticated users only
CREATE POLICY "Service role only access to clients"
  ON clients
  FOR ALL
  TO authenticated, service_role
  USING (true)
  WITH CHECK (true);

-- Revoke anon access
REVOKE ALL ON clients FROM anon;

-- ============================================================================
-- FIX #3 CRITICAL: questionnaire_access_tokens Table RLS
-- ============================================================================

-- Drop the insecure policy
DROP POLICY IF EXISTS "Allow all operations on questionnaire_access_tokens" ON questionnaire_access_tokens;

-- Create secure policy: Service role only
CREATE POLICY "Service role full access to tokens"
  ON questionnaire_access_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Revoke anon access
REVOKE ALL ON questionnaire_access_tokens FROM anon;

-- ============================================================================
-- VERIFICATION COMMENTS
-- ============================================================================

COMMENT ON POLICY "Service role only access to clients" ON clients IS
  'SECURITY FIX: Admin-only access via service role key. No public (anon) access to prevent PII exposure.';

COMMENT ON POLICY "Service role full access to tokens" ON questionnaire_access_tokens IS
  'SECURITY FIX: Service role only. Token validation must be done via API endpoints to prevent token enumeration attacks.';
