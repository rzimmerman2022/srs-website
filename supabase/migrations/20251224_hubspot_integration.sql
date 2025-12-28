-- ============================================================================
-- HubSpot Integration Schema
--
-- SUBAGENT-3: claude-opus-4-5/SUBAGENT-3/hubspot-integration/2025-12-23T-webhooks
-- Fortune 50 / World-Class Client Onboarding System
--
-- Run this migration in Supabase SQL Editor to enable HubSpot sync.
-- ============================================================================

-- ============================================================================
-- ADD HUBSPOT COLUMNS TO CLIENTS TABLE
-- ============================================================================

-- Add HubSpot integration columns to clients table
ALTER TABLE clients
  ADD COLUMN IF NOT EXISTS hubspot_contact_id TEXT,
  ADD COLUMN IF NOT EXISTS hubspot_deal_id TEXT,
  ADD COLUMN IF NOT EXISTS hubspot_synced_at TIMESTAMPTZ;

-- Index for efficient HubSpot ID lookups
CREATE INDEX IF NOT EXISTS idx_clients_hubspot_contact_id
  ON clients(hubspot_contact_id)
  WHERE hubspot_contact_id IS NOT NULL;

-- ============================================================================
-- HUBSPOT SYNC STATE TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS hubspot_sync_state (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Foreign keys
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,

  -- HubSpot identifiers
  hubspot_contact_id TEXT,
  hubspot_deal_id TEXT,

  -- Sync metadata
  last_synced_at TIMESTAMPTZ,
  sync_status TEXT DEFAULT 'pending' CHECK (sync_status IN ('pending', 'syncing', 'synced', 'error')),
  sync_direction TEXT CHECK (sync_direction IN ('supabase_to_hubspot', 'hubspot_to_supabase')),
  error_message TEXT,
  retry_count INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,

  -- Ensure one sync state per client
  CONSTRAINT unique_client_sync_state UNIQUE (client_id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_state_client_id
  ON hubspot_sync_state(client_id);
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_state_contact_id
  ON hubspot_sync_state(hubspot_contact_id)
  WHERE hubspot_contact_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_hubspot_sync_state_status
  ON hubspot_sync_state(sync_status);

-- ============================================================================
-- SYNC QUEUE TABLE (for async processing)
-- ============================================================================

CREATE TABLE IF NOT EXISTS sync_queue (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  entity_type TEXT NOT NULL CHECK (entity_type IN ('client', 'response')),
  entity_id UUID NOT NULL,
  operation TEXT NOT NULL CHECK (operation IN ('INSERT', 'UPDATE', 'DELETE')),
  payload JSONB,

  -- Processing status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  attempts INTEGER DEFAULT 0,
  max_attempts INTEGER DEFAULT 3,

  -- Scheduling
  scheduled_for TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  processed_at TIMESTAMPTZ,

  -- Error tracking
  error_message TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for queue processing
CREATE INDEX IF NOT EXISTS idx_sync_queue_status_scheduled
  ON sync_queue(status, scheduled_for)
  WHERE status = 'pending';
CREATE INDEX IF NOT EXISTS idx_sync_queue_entity
  ON sync_queue(entity_type, entity_id);

-- ============================================================================
-- WEBHOOK EVENT LOG TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS hubspot_webhook_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- HubSpot event data
  event_id TEXT UNIQUE NOT NULL,
  subscription_id TEXT,
  object_type TEXT,
  object_id TEXT,
  property_name TEXT,
  property_value TEXT,

  -- Processing
  processed BOOLEAN DEFAULT false,
  processed_at TIMESTAMPTZ,
  error_message TEXT,

  -- Full payload
  raw_payload JSONB,

  -- Timestamps
  occurred_at TIMESTAMPTZ,
  received_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Indexes for webhook processing
CREATE INDEX IF NOT EXISTS idx_webhook_events_event_id
  ON hubspot_webhook_events(event_id);
CREATE INDEX IF NOT EXISTS idx_webhook_events_processed
  ON hubspot_webhook_events(processed)
  WHERE processed = false;
CREATE INDEX IF NOT EXISTS idx_webhook_events_occurred_at
  ON hubspot_webhook_events(occurred_at DESC);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-update trigger for sync state
CREATE OR REPLACE FUNCTION update_hubspot_sync_state_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_hubspot_sync_state ON hubspot_sync_state;
CREATE TRIGGER trigger_update_hubspot_sync_state
  BEFORE UPDATE ON hubspot_sync_state
  FOR EACH ROW
  EXECUTE FUNCTION update_hubspot_sync_state_updated_at();

-- ============================================================================
-- RLS POLICIES (Service Role Only)
-- ============================================================================

-- Enable RLS
ALTER TABLE hubspot_sync_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE sync_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE hubspot_webhook_events ENABLE ROW LEVEL SECURITY;

-- Only service role can access these tables (internal use only)
CREATE POLICY "Service role access for hubspot_sync_state"
  ON hubspot_sync_state
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role access for sync_queue"
  ON sync_queue
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role access for hubspot_webhook_events"
  ON hubspot_webhook_events
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE hubspot_sync_state IS 'Tracks HubSpot sync status for each client';
COMMENT ON TABLE sync_queue IS 'Queue for async sync operations';
COMMENT ON TABLE hubspot_webhook_events IS 'Log of incoming HubSpot webhook events';

COMMENT ON COLUMN clients.hubspot_contact_id IS 'HubSpot CRM Contact ID';
COMMENT ON COLUMN clients.hubspot_deal_id IS 'HubSpot CRM Deal ID';
COMMENT ON COLUMN clients.hubspot_synced_at IS 'Last successful sync timestamp';
