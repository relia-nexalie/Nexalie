CREATE TABLE IF NOT EXISTS knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie TEXT NOT NULL,
  contenu TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'both', -- 'fr' | 'af' | 'both'
  priorite INTEGER NOT NULL DEFAULT 5,
  actif BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;

-- Lecture publique (pour que l'API puisse lire)
CREATE POLICY "Knowledge readable by service role" ON knowledge FOR SELECT USING (true);

-- Écriture uniquement via service role (admin dashboard)
CREATE POLICY "Knowledge writable by admin" ON knowledge FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');
