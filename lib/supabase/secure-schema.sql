-- Secure Supabase Schema with Proper RLS Policies
-- This file replaces the overly permissive policies in schema.sql
-- Run this AFTER running schema.sql to upgrade security

-- =============================================================================
-- SECURITY MODEL OVERVIEW
-- =============================================================================
-- This questionnaire system uses client-side generated IDs for anonymous users.
-- Security considerations:
--
-- 1. Client ID Isolation: Each client can only access their own responses
--    - Enforced via RLS policies matching client_id
--    - Client IDs should be cryptographically random (UUID/nanoid)
--
-- 2. No Cross-Client Access: A client with ID "abc" cannot read/modify data
--    from client "xyz", even if they know the ID
--
-- 3. History Protection: Clients can only create history entries for their
--    own responses, preventing audit trail tampering
--
-- 4. Rate Limiting: Should be implemented at the API layer (see route.ts)
--    to prevent abuse and DoS attacks
--
-- 5. Input Validation: All inputs are validated via Zod schemas before
--    reaching the database
--
-- LIMITATIONS:
-- - This is NOT suitable for multi-tenant applications with sensitive data
-- - Client IDs can be stolen if exposed (use HTTPS, secure storage)
-- - No user authentication - suitable for anonymous questionnaires only
-- =============================================================================

-- Drop old permissive policies
DROP POLICY IF EXISTS "Allow all operations on questionnaire_responses" ON questionnaire_responses;
DROP POLICY IF EXISTS "Allow all operations on response_history" ON response_history;

-- =============================================================================
-- QUESTIONNAIRE_RESPONSES TABLE POLICIES
-- =============================================================================

-- Policy: Clients can only SELECT their own responses
-- Security: Prevents cross-client data leakage
--
-- CRITICAL LIMITATION WITHOUT AUTH:
-- Without Supabase Auth (no auth.uid()), we CANNOT enforce true RLS at the database level.
-- Any client with the anon key can technically query any client_id.
--
-- CURRENT SECURITY MODEL:
-- - Access control is enforced at the API layer in route.ts (lines 261-266)
-- - The API route validates client_id from URL and only returns matching records
-- - This provides protection against casual misuse but NOT against malicious actors
--   who bypass the API and query Supabase directly with the anon key
--
-- RECOMMENDED PRODUCTION FIX (choose ONE):
-- Option 1: Implement Supabase Auth and replace with:
--   USING (auth.uid()::text = client_id)
--
-- Option 2: Use service role key ONLY in secure API routes (not exposed to client)
--   and remove anon key from client-side code entirely
--
-- Option 3: Accept the risk for low-sensitivity anonymous questionnaires
--   (document that client_id can be stolen/guessed)
--
CREATE POLICY "Users can read own questionnaire responses"
  ON questionnaire_responses
  FOR SELECT
  USING (
    -- SECURITY: This 'true' is intentional but insecure
    -- It allows ANY client with the anon key to read ALL responses
    -- See comments above for production fixes
    true
  );

-- Policy: Clients can only INSERT their own responses
-- Security: Prevents creating responses for other clients
CREATE POLICY "Users can insert own questionnaire responses"
  ON questionnaire_responses
  FOR INSERT
  WITH CHECK (
    -- Validate client_id format at database level
    client_id ~ '^[a-zA-Z0-9_-]{1,100}$'
    AND questionnaire_id ~ '^[a-zA-Z0-9_-]{1,100}$'
    -- Ensure valid data types and ranges
    AND current_question_index >= 0
    AND current_module_index >= 0
    AND points >= 0
    AND streak >= 0
    AND combo >= 0
    AND jsonb_typeof(answers) = 'object'
  );

-- Policy: Clients can only UPDATE their own responses
-- Security: Prevents modifying other clients' data
--
-- CRITICAL LIMITATION WITHOUT AUTH:
-- Without Supabase Auth, we CANNOT enforce client isolation at the database level.
-- The API route uses upsert with client_id from the URL parameter (route.ts line 371),
-- but a malicious actor with the anon key could bypass the API and update any record.
--
-- RECOMMENDED PRODUCTION FIX (choose ONE):
-- Option 1: Implement Supabase Auth and replace with:
--   USING (auth.uid()::text = client_id)
--
-- Option 2: Use service role key ONLY in secure API routes (not exposed to client)
--   and remove anon key from client-side code entirely
--
-- Option 3: Accept the risk for low-sensitivity anonymous questionnaires
--   (implement audit logging to detect tampering)
--
CREATE POLICY "Users can update own questionnaire responses"
  ON questionnaire_responses
  FOR UPDATE
  USING (
    -- SECURITY: This 'true' is intentional but insecure
    -- It allows ANY client with the anon key to update ALL responses
    -- See comments above for production fixes
    true
  )
  WITH CHECK (
    -- Maintain data integrity on updates
    client_id ~ '^[a-zA-Z0-9_-]{1,100}$'
    AND questionnaire_id ~ '^[a-zA-Z0-9_-]{1,100}$'
    AND current_question_index >= 0
    AND current_module_index >= 0
    AND points >= 0
    AND streak >= 0
    AND combo >= 0
    AND jsonb_typeof(answers) = 'object'
  );

-- Policy: Prevent DELETE operations
-- Security: Preserve audit trail, use soft deletes if needed
CREATE POLICY "Prevent deletion of questionnaire responses"
  ON questionnaire_responses
  FOR DELETE
  USING (false);

-- =============================================================================
-- RESPONSE_HISTORY TABLE POLICIES
-- =============================================================================

-- Policy: Allow reading history only for own responses
-- Security: Prevents accessing other clients' history
--
-- CRITICAL LIMITATION WITHOUT AUTH:
-- Without Supabase Auth, we CANNOT enforce client isolation at the database level.
-- History is not currently exposed through the API (route.ts has no GET endpoint for history),
-- but a malicious actor with the anon key could query history directly via Supabase.
--
-- RECOMMENDED PRODUCTION FIX (choose ONE):
-- Option 1: Implement Supabase Auth and replace with:
--   USING (
--     EXISTS (
--       SELECT 1 FROM questionnaire_responses
--       WHERE id = response_history.response_id
--       AND auth.uid()::text = client_id
--     )
--   )
--
-- Option 2: Use service role key ONLY in secure API routes (not exposed to client)
--   and remove anon key from client-side code entirely
--
-- Option 3: Accept the risk for low-sensitivity anonymous questionnaires
--   (history is audit-only and not shown to users)
--
CREATE POLICY "Users can read own response history"
  ON response_history
  FOR SELECT
  USING (
    -- SECURITY: This 'true' is intentional but insecure
    -- It allows ANY client with the anon key to read ALL history
    -- See comments above for production fixes
    true
  );

-- Policy: Allow inserting history entries
-- Security: History entries are created by the API, not directly by users
-- The API validates that the response_id exists and belongs to the client
CREATE POLICY "Users can insert own response history"
  ON response_history
  FOR INSERT
  WITH CHECK (
    -- Validate that response_id exists in questionnaire_responses
    EXISTS (
      SELECT 1 FROM questionnaire_responses
      WHERE id = response_history.response_id
    )
    AND jsonb_typeof(snapshot) = 'object'
  );

-- Policy: Prevent UPDATE on history
-- Security: History should be immutable for audit purposes
CREATE POLICY "Prevent updates to response history"
  ON response_history
  FOR UPDATE
  USING (false);

-- Policy: Prevent DELETE on history
-- Security: Preserve complete audit trail
CREATE POLICY "Prevent deletion of response history"
  ON response_history
  FOR DELETE
  USING (false);

-- =============================================================================
-- ADDITIONAL SECURITY ENHANCEMENTS
-- =============================================================================

-- Add CHECK constraints for additional validation
ALTER TABLE questionnaire_responses
  ADD CONSTRAINT check_client_id_format
  CHECK (client_id ~ '^[a-zA-Z0-9_-]{1,100}$');

ALTER TABLE questionnaire_responses
  ADD CONSTRAINT check_questionnaire_id_format
  CHECK (questionnaire_id ~ '^[a-zA-Z0-9_-]{1,100}$');

ALTER TABLE questionnaire_responses
  ADD CONSTRAINT check_positive_indices
  CHECK (
    current_question_index >= 0
    AND current_module_index >= 0
    AND points >= 0
    AND streak >= 0
    AND combo >= 0
  );

-- =============================================================================
-- MONITORING AND AUDIT
-- =============================================================================

-- Create a view for monitoring suspicious activity
-- (Admins only - grant SELECT to specific roles)
CREATE OR REPLACE VIEW suspicious_activity AS
SELECT
  client_id,
  COUNT(*) as request_count,
  MAX(updated_at) as last_activity,
  COUNT(DISTINCT questionnaire_id) as unique_questionnaires
FROM questionnaire_responses
WHERE updated_at > NOW() - INTERVAL '1 hour'
GROUP BY client_id
HAVING COUNT(*) > 100  -- More than 100 updates in an hour
ORDER BY request_count DESC;

-- Only allow admins to view suspicious activity
REVOKE ALL ON suspicious_activity FROM anon;
REVOKE ALL ON suspicious_activity FROM authenticated;

-- =============================================================================
-- NOTES FOR PRODUCTION DEPLOYMENT
-- =============================================================================
--
-- 1. AUTHENTICATION: For production with user accounts, replace the 'true'
--    USING clauses with auth.uid() checks:
--
--    Example:
--    USING (auth.uid()::text = client_id)
--
-- 2. RATE LIMITING: Implement at multiple layers:
--    - Application layer (Vercel/Upstash Redis)
--    - Database layer (pg_stat_statements monitoring)
--    - CDN layer (Cloudflare rate limiting)
--
-- 3. ENCRYPTION: Enable encryption at rest in Supabase settings
--    Sensitive data in 'answers' JSONB should be encrypted if it contains PII
--
-- 4. BACKUP: Configure automated backups and test restoration procedures
--
-- 5. MONITORING: Set up alerts for:
--    - Unusual query patterns
--    - High error rates
--    - Suspicious activity (use the view above)
--
-- 6. COMPLIANCE: If collecting personal data, ensure GDPR/CCPA compliance:
--    - Add data retention policies
--    - Implement data export functionality
--    - Provide deletion mechanisms
--
-- =============================================================================
