CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  mode TEXT NOT NULL DEFAULT 'fr', -- 'fr' ou 'af'
  score INTEGER NOT NULL,
  level TEXT NOT NULL,
  level_label TEXT NOT NULL,
  answers JSONB NOT NULL,
  recommendations TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own audits" ON audits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own audits" ON audits FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Anon can insert" ON audits FOR INSERT WITH CHECK (user_id IS NULL);
