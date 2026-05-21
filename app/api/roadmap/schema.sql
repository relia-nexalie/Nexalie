-- Roadmap Builder IA — Table Supabase
-- À exécuter dans le SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'fr',
  roadmap_json JSONB NOT NULL,
  context JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own roadmaps"
  ON roadmaps FOR ALL
  USING (auth.uid() = user_id);
