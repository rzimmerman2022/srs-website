-- Supabase Schema for Questionnaire Data Persistence
-- Run this in your Supabase SQL Editor to create the required tables

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main table for storing questionnaire responses
CREATE TABLE IF NOT EXISTS questionnaire_responses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  client_id TEXT NOT NULL,
  questionnaire_id TEXT NOT NULL,
  answers JSONB DEFAULT '{}',
  current_question_index INTEGER DEFAULT 0,
  current_module_index INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  combo INTEGER DEFAULT 0,
  shown_milestones INTEGER[] DEFAULT '{}',
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint to ensure one response per client per questionnaire
  UNIQUE(client_id, questionnaire_id)
);

-- History table for tracking all changes (for audit/recovery)
CREATE TABLE IF NOT EXISTS response_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  response_id UUID NOT NULL REFERENCES questionnaire_responses(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Function to auto-update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at on questionnaire_responses
DROP TRIGGER IF EXISTS update_questionnaire_responses_updated_at ON questionnaire_responses;
CREATE TRIGGER update_questionnaire_responses_updated_at
  BEFORE UPDATE ON questionnaire_responses
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Index for fast lookups by client_id
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_client_id
  ON questionnaire_responses(client_id);

-- Index for fast lookups by questionnaire_id
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_questionnaire_id
  ON questionnaire_responses(questionnaire_id);

-- Index for finding incomplete responses
CREATE INDEX IF NOT EXISTS idx_questionnaire_responses_completed
  ON questionnaire_responses(completed) WHERE NOT completed;

-- Index on response_history for fast lookups by response_id
CREATE INDEX IF NOT EXISTS idx_response_history_response_id
  ON response_history(response_id);

-- Row Level Security (RLS) Policies
-- Enable RLS on tables
ALTER TABLE questionnaire_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_history ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all operations for now (can be restricted later with auth)
-- For anonymous access (using anon key)
CREATE POLICY "Allow all operations on questionnaire_responses"
  ON questionnaire_responses
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow all operations on response_history"
  ON response_history
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions to anon role (used by public Supabase client)
GRANT ALL ON questionnaire_responses TO anon;
GRANT ALL ON response_history TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;
