-- =====================================================
--  AI Emply — PostgreSQL Migration
--  Run this in psql or any PostgreSQL client.
--
--  psql -U postgres -d ai_emply -f 001_create_ai_emply_sessions.sql
-- =====================================================

-- 1. Sessions Table
CREATE TABLE IF NOT EXISTS ai_emply_sessions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            TEXT UNIQUE NOT NULL,
  business_type         TEXT,
  selected_needs        JSONB,
  recommended_agent     TEXT,
  recommendation_source TEXT CHECK (recommendation_source IN ('automatic', 'manual')),
  demo_completed        BOOLEAN NOT NULL DEFAULT FALSE,
  full_name             TEXT,
  business_name         TEXT,
  email                 TEXT,
  phone                 TEXT,
  workflow_details      TEXT,
  current_step          INTEGER NOT NULL DEFAULT 1,
  status                TEXT NOT NULL DEFAULT 'in_progress'
                        CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Demo Chat Messages Table
CREATE TABLE IF NOT EXISTS demo_chat_messages (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            TEXT NOT NULL,
  agent_id              TEXT,
  role                  TEXT NOT NULL CHECK (role IN ('user', 'ai', 'system')),
  content               TEXT NOT NULL,
  intent                TEXT,
  metadata              JSONB,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Demo Leads Table
CREATE TABLE IF NOT EXISTS demo_leads (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            TEXT NOT NULL,
  agent_id              TEXT NOT NULL,
  business_type         TEXT NOT NULL,
  name                  TEXT,
  phone                 TEXT,
  email                 TEXT,
  interest              TEXT,
  conversation_summary  TEXT,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Customer Enquiries Table (Step 5)
CREATE TABLE IF NOT EXISTS customer_enquiries (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id            TEXT NOT NULL,
  full_name             TEXT NOT NULL,
  business_name         TEXT NOT NULL,
  email                 TEXT NOT NULL,
  phone                 TEXT NOT NULL,
  business_type         TEXT,
  selected_needs        JSONB,
  recommended_agent     TEXT,
  additional_details    TEXT,
  demo_completed        BOOLEAN NOT NULL DEFAULT TRUE,
  status                TEXT NOT NULL DEFAULT 'new',
  source                TEXT NOT NULL DEFAULT 'ai_emply_website',
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-update updated_at on every row change in ai_emply_sessions
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ai_emply_sessions_updated_at ON ai_emply_sessions;

CREATE TRIGGER ai_emply_sessions_updated_at
  BEFORE UPDATE ON ai_emply_sessions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Auto-update updated_at on every row change in customer_enquiries
DROP TRIGGER IF EXISTS customer_enquiries_updated_at ON customer_enquiries;

CREATE TRIGGER customer_enquiries_updated_at
  BEFORE UPDATE ON customer_enquiries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Indexes for fast lookup
CREATE INDEX IF NOT EXISTS idx_ai_emply_sessions_session_id
  ON ai_emply_sessions (session_id);

CREATE INDEX IF NOT EXISTS idx_demo_chat_messages_session_id
  ON demo_chat_messages (session_id);

CREATE INDEX IF NOT EXISTS idx_demo_leads_session_id
  ON demo_leads (session_id);

CREATE INDEX IF NOT EXISTS idx_customer_enquiries_session_id
  ON customer_enquiries (session_id);

CREATE INDEX IF NOT EXISTS idx_customer_enquiries_created_at
  ON customer_enquiries (created_at DESC);
