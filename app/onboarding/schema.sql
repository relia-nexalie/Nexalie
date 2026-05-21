-- Ajouter les champs manquants à profiles si pas déjà présents
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_type TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secteur TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pays TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS objectif_principal TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed_at TIMESTAMPTZ;
