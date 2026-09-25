-- ==============================================================================
-- PRIVORA — The AI Firewall
-- Supabase PostgreSQL Database Schema
-- Run this script in your Supabase Project -> SQL Editor to initialize tables.
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Trust Passports Table
CREATE TABLE IF NOT EXISTS public.trust_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_id VARCHAR(100) UNIQUE NOT NULL,
    scan_id VARCHAR(50) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    client_origin VARCHAR(150) DEFAULT 'Privora Secure Client Gateway',
    model_evaluated VARCHAR(100) NOT NULL,
    privacy_score INTEGER NOT NULL CHECK (privacy_score >= 0 AND privacy_score <= 100),
    security_score INTEGER NOT NULL CHECK (security_score >= 0 AND security_score <= 100),
    reliability_score INTEGER NOT NULL CHECK (reliability_score >= 0 AND reliability_score <= 100),
    overall_trust_score INTEGER NOT NULL CHECK (overall_trust_score >= 0 AND overall_trust_score <= 100),
    threat_level VARCHAR(20) NOT NULL,
    prompt_status VARCHAR(50) NOT NULL,
    privacy_events_protected INTEGER DEFAULT 0,
    threats_blocked INTEGER DEFAULT 0,
    recommendation_text TEXT NOT NULL,
    cryptographic_signature VARCHAR(120) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Index for fast lookup by scan_id and created_at
CREATE INDEX IF NOT EXISTS idx_trust_passports_scan_id ON public.trust_passports(scan_id);
CREATE INDEX IF NOT EXISTS idx_trust_passports_created_at ON public.trust_passports(created_at DESC);

-- 3. Security Incidents & Threat Telemetry Table
CREATE TABLE IF NOT EXISTS public.security_incidents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    incident_type VARCHAR(80) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    trigger_phrase TEXT,
    reason TEXT NOT NULL,
    action_taken TEXT NOT NULL,
    scan_id VARCHAR(50)
);

CREATE INDEX IF NOT EXISTS idx_security_incidents_created_at ON public.security_incidents(created_at DESC);

-- 4. Inbound Firewall Prompt Audit Log (Minimal Ephemeral Metadata Only)
-- Note: Raw user prompt text is NEVER permanently stored by default to uphold Privacy by Design.
CREATE TABLE IF NOT EXISTS public.prompt_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    scan_id VARCHAR(50) UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    prompt_length INTEGER NOT NULL,
    token_estimate INTEGER NOT NULL,
    pii_count INTEGER DEFAULT 0,
    threats_count INTEGER DEFAULT 0,
    sanitized_prompt_generated BOOLEAN DEFAULT FALSE,
    inference_completed BOOLEAN DEFAULT FALSE
);

-- 5. Row Level Security (RLS) Policies
ALTER TABLE public.trust_passports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prompt_audit_logs ENABLE ROW LEVEL SECURITY;

-- Allow public read of verified trust passports (for verification checking)
CREATE POLICY "Allow public read access to passports" 
ON public.trust_passports FOR SELECT USING (true);

-- Allow authenticated/anon insertions via backend API service
CREATE POLICY "Allow API insert access to passports" 
ON public.trust_passports FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow API insert access to security incidents" 
ON public.security_incidents FOR ALL USING (true);

CREATE POLICY "Allow API insert access to prompt audit logs" 
ON public.prompt_audit_logs FOR ALL USING (true);

-- Output verification message
SELECT 'Privora database schema deployed successfully! Tables ready: trust_passports, security_incidents, prompt_audit_logs' AS status;
