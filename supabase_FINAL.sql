-- ═══════════════════════════════════════════════════════════════════
-- NEXALI — SUPABASE SCHEMA FINAL
-- Exécuter dans cet ordre exact dans l'éditeur SQL Supabase
-- Dernière mise à jour : 2026-05-19
-- ═══════════════════════════════════════════════════════════════════

-- ─────────────────────────────────────────────
-- 1. Extension UUID
-- ─────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────────
-- 2. Table profiles
-- Supabase Auth crée auth.users automatiquement.
-- On étend le profil public via cette table.
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  company_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Colonnes additionnelles (idempotent si table déjà existante)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS mode TEXT DEFAULT 'fr';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS market TEXT DEFAULT 'fr';
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS organisation TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS secteur TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS pays TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS objectif TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'inactive';

-- Trigger : met à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS profiles_updated_at ON profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Trigger : crée un profil vide à la création d'un user Supabase Auth
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─────────────────────────────────────────────
-- 3. Table audits
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT,
  mode TEXT NOT NULL DEFAULT 'fr',
  market TEXT DEFAULT 'fr',
  reponses JSONB NOT NULL DEFAULT '{}',
  score INTEGER NOT NULL DEFAULT 0,
  niveau TEXT NOT NULL DEFAULT 'debutant',
  rapport_pdf_url TEXT,
  recommandations JSONB DEFAULT '[]',
  secteur TEXT,
  taille_entreprise TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS audits_user_id_idx ON audits(user_id);
CREATE INDEX IF NOT EXISTS audits_created_at_idx ON audits(created_at DESC);

-- ─────────────────────────────────────────────
-- 4. Table roadmaps
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mode TEXT NOT NULL DEFAULT 'fr',
  market TEXT DEFAULT 'fr',
  titre TEXT,
  contexte_entreprise JSONB DEFAULT '{}',
  score_audit INTEGER,
  roadmap_90j JSONB DEFAULT '[]',
  roadmap_6m JSONB DEFAULT '[]',
  roadmap_12m JSONB DEFAULT '[]',
  statut TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS roadmaps_user_id_idx ON roadmaps(user_id);

-- ─────────────────────────────────────────────
-- 5. Table knowledge (mémoire IA Nexali OS)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS knowledge (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categorie TEXT NOT NULL,
  mode TEXT DEFAULT 'both',
  market TEXT,
  secteur TEXT,
  titre TEXT NOT NULL,
  contenu TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  actif BOOLEAN DEFAULT true,
  priorite INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

DROP TRIGGER IF EXISTS knowledge_updated_at ON knowledge;
CREATE TRIGGER knowledge_updated_at
  BEFORE UPDATE ON knowledge
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 6. Table benchmarks sectoriels
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS benchmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secteur TEXT NOT NULL,
  market TEXT NOT NULL,
  score_moyen INTEGER NOT NULL,
  score_top25 INTEGER,
  score_top10 INTEGER,
  nb_entreprises INTEGER DEFAULT 0,
  source TEXT DEFAULT 'estimation',
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS benchmarks_secteur_market_idx ON benchmarks(secteur, market);

-- ─────────────────────────────────────────────
-- 7. Table certifications
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS certifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  score INTEGER NOT NULL,
  issued_at TIMESTAMPTZ DEFAULT now(),
  valid_until TIMESTAMPTZ,
  certificate_url TEXT,
  public_code TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS certifications_user_id_idx ON certifications(user_id);
CREATE INDEX IF NOT EXISTS certifications_public_code_idx ON certifications(public_code);

-- ─────────────────────────────────────────────
-- 8. Table email_sequences
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS email_sequences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  sequence TEXT NOT NULL,
  step INTEGER NOT NULL,
  scheduled_at TIMESTAMPTZ NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 9. Table clients (dashboard Rélia)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nom TEXT,
  entreprise TEXT,
  pays TEXT,
  secteur TEXT,
  pack TEXT,
  mode TEXT,
  score_audit INTEGER,
  status TEXT DEFAULT 'prospect',
  mensuel INTEGER,
  devise TEXT DEFAULT 'EUR',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ─────────────────────────────────────────────
-- 10. Table os_messages (comptage messages Nexali OS)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS os_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS os_messages_user_date_idx ON os_messages(user_id, created_at DESC);

-- ─────────────────────────────────────────────
-- 11. RLS — Row Level Security
-- ─────────────────────────────────────────────
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge ENABLE ROW LEVEL SECURITY;
ALTER TABLE benchmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE os_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

-- Policies : profiles
DROP POLICY IF EXISTS "Users read own profile" ON profiles;
DROP POLICY IF EXISTS "Users update own profile" ON profiles;
DROP POLICY IF EXISTS "Admin all profiles" ON profiles;
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admin all profiles" ON profiles FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : audits
DROP POLICY IF EXISTS "Users own audits" ON audits;
DROP POLICY IF EXISTS "Admin all audits" ON audits;
CREATE POLICY "Users own audits" ON audits FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin all audits" ON audits FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : roadmaps
DROP POLICY IF EXISTS "Users own roadmaps" ON roadmaps;
DROP POLICY IF EXISTS "Admin all roadmaps" ON roadmaps;
CREATE POLICY "Users own roadmaps" ON roadmaps FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin all roadmaps" ON roadmaps FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : knowledge
DROP POLICY IF EXISTS "Read active knowledge" ON knowledge;
DROP POLICY IF EXISTS "Admin manages knowledge" ON knowledge;
CREATE POLICY "Read active knowledge" ON knowledge FOR SELECT USING (actif = true);
CREATE POLICY "Admin manages knowledge" ON knowledge FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : benchmarks (lecture publique)
DROP POLICY IF EXISTS "Anyone reads benchmarks" ON benchmarks;
DROP POLICY IF EXISTS "Admin manages benchmarks" ON benchmarks;
CREATE POLICY "Anyone reads benchmarks" ON benchmarks FOR SELECT USING (true);
CREATE POLICY "Admin manages benchmarks" ON benchmarks FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : certifications
DROP POLICY IF EXISTS "Users own certifications" ON certifications;
DROP POLICY IF EXISTS "Public reads certifications" ON certifications;
CREATE POLICY "Users own certifications" ON certifications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Public reads certifications" ON certifications FOR SELECT USING (true);

-- Policies : clients (admin only)
DROP POLICY IF EXISTS "Admin manages clients" ON clients;
CREATE POLICY "Admin manages clients" ON clients FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : os_messages
DROP POLICY IF EXISTS "Users own os_messages" ON os_messages;
DROP POLICY IF EXISTS "Admin all os_messages" ON os_messages;
CREATE POLICY "Users own os_messages" ON os_messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin all os_messages" ON os_messages FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- Policies : email_sequences
DROP POLICY IF EXISTS "Users own email_sequences" ON email_sequences;
CREATE POLICY "Users own email_sequences" ON email_sequences FOR SELECT USING (auth.uid() = user_id);

-- ─────────────────────────────────────────────
-- 12. DONNÉES INITIALES — Benchmarks sectoriels
-- ─────────────────────────────────────────────
INSERT INTO benchmarks (secteur, market, score_moyen, score_top25, score_top10, nb_entreprises) VALUES
  ('commerce',        'cg', 28, 45, 62, 0),
  ('sante',           'cg', 22, 38, 55, 0),
  ('administration',  'cg', 18, 32, 48, 0),
  ('telecom',         'cg', 45, 65, 78, 0),
  ('btp',             'cg', 25, 40, 58, 0),
  ('agriculture',     'cg', 15, 28, 42, 0),
  ('commerce',        'ci', 35, 52, 68, 0),
  ('administration',  'ci', 25, 40, 58, 0),
  ('telecom',         'ci', 48, 67, 80, 0),
  ('commerce',        'cm', 30, 48, 65, 0),
  ('commerce',        'sn', 38, 55, 72, 0),
  ('commerce',        'fr', 52, 68, 82, 0),
  ('industrie',       'fr', 48, 65, 79, 0),
  ('sante',           'fr', 55, 72, 85, 0)
ON CONFLICT (secteur, market) DO NOTHING;

-- ─────────────────────────────────────────────
-- 13. DONNÉES INITIALES — Mémoire IA Nexali OS
-- ─────────────────────────────────────────────
INSERT INTO knowledge (categorie, mode, market, titre, contenu, priorite) VALUES

('methode', 'both', null,
 'Méthode Rélia — Observer',
 'Toujours commencer par comprendre comment l''organisation travaille réellement aujourd''hui. Pas les processus théoriques. Poser la question : comment vous faites concrètement aujourd''hui ?', 1),

('methode', 'both', null,
 'Méthode Rélia — Questionner',
 'Identifier les vrais besoins derrière les besoins exprimés. Les gens disent je veux un site web mais veulent plus de clients. Creuser avec : et si vous aviez ça qu''est-ce que ça changerait pour vous ?', 1),

('methode', 'both', null,
 'Méthode Rélia — Co-construire',
 'Construire les solutions avec les équipes pas pour elles. Le changement dure quand les gens l''ont construit eux-mêmes. Impliquer, faire tester, ajuster ensemble.', 1),

('marche', 'af', 'cg',
 'Contexte Congo-Brazzaville 2026',
 'Le Congo déploie le PATN avec 39,3M USD en 2026. Priorités : digitalisation état civil, portail services publics, connectivité rurale, formation jeunes. Ministre Frédéric Nzé nommé avril 2026 profil entrepreneur tech ENSAE Paris. Indice e-gouvernement ONU : 166e mondial.', 2),

('marche', 'af', 'ci',
 'Contexte Côte d''Ivoire 2026',
 'Première économie UEMOA. Marché digital en forte expansion. Mobile Money très développé. Priorité gouvernement : e-services et digitalisation des PME.', 2),

('culture', 'af', null,
 'Codes culturels Afrique francophone',
 'En Afrique : saluer avant tout, prendre le temps de la relation avant le business, ne jamais brusquer une décision, respecter la hiérarchie, valoriser la communauté. Le numérique doit servir les gens pas les remplacer.', 3),

('marche', 'af', null,
 'Contraintes terrain Afrique',
 'Connectivité variable, coupures de courant fréquentes, équipes peu digitalisées, culture orale forte, décisions collectives, importance des relations humaines avant les outils. Toujours proposer solutions légères et mobile-first.', 2),

('outil', 'both', null,
 'Expérience MES industriel',
 'Déploiement MES chez 3SP Technologies ex Alcatel Optronics. Résultat -20% délais de fabrication. Clé du succès : 80% conduite du changement humain, 20% technique.', 4),

('outil', 'both', null,
 'Innovation participative Safran',
 'Pilotage Safran Innovation Awards 10000+ collaborateurs. Les meilleures idées viennent du terrain pas du comité de direction. Créer les conditions pour que les idées remontent et soient vraiment entendues.', 4),

('cas_usage', 'af', null,
 'Digitalisation administration publique africaine',
 '3 questions clés : 1. Les équipes sont-elles prêtes humainement ? 2. L''infrastructure réseau est-elle suffisante ? 3. Y a-t-il un champion interne qui portera le projet après le consultant ?', 3)

ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────
-- 11b. Table blog
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  extrait TEXT,
  contenu TEXT NOT NULL,
  image_url TEXT,
  marche TEXT DEFAULT 'les-deux' CHECK (marche IN ('fr', 'af', 'les-deux')),
  publie BOOLEAN DEFAULT false,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS blog_slug_idx ON blog(slug);
CREATE INDEX IF NOT EXISTS blog_publie_marche_idx ON blog(publie, marche);

DROP TRIGGER IF EXISTS blog_updated_at ON blog;
CREATE TRIGGER blog_updated_at
  BEFORE UPDATE ON blog
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 11c. Table pays_config
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS pays_config (
  code TEXT PRIMARY KEY,
  nom TEXT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'XOF',
  mobile_money_providers TEXT[] DEFAULT '{}',
  market TEXT DEFAULT 'af',
  actif BOOLEAN DEFAULT true
);

-- ─────────────────────────────────────────────
-- 11d. Table payment_intents (CinetPay + Stripe)
-- ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payment_intents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('stripe', 'cinetpay')),
  provider_transaction_id TEXT UNIQUE,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  plan TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS payment_intents_user_id_idx ON payment_intents(user_id);
CREATE INDEX IF NOT EXISTS payment_intents_provider_txid_idx ON payment_intents(provider_transaction_id);

DROP TRIGGER IF EXISTS payment_intents_updated_at ON payment_intents;
CREATE TRIGGER payment_intents_updated_at
  BEFORE UPDATE ON payment_intents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─────────────────────────────────────────────
-- 11e. Colonnes manquantes dans profiles
-- ─────────────────────────────────────────────
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS audit_score INTEGER;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS audit_level TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS cinetpay_customer_id TEXT;

-- ─────────────────────────────────────────────
-- 12b. RLS — Tables supplémentaires
-- ─────────────────────────────────────────────
ALTER TABLE blog ENABLE ROW LEVEL SECURITY;
ALTER TABLE pays_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_intents ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public reads published blog" ON blog;
DROP POLICY IF EXISTS "Admin manages blog" ON blog;
CREATE POLICY "Public reads published blog" ON blog FOR SELECT USING (publie = true);
CREATE POLICY "Admin manages blog" ON blog FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

DROP POLICY IF EXISTS "Public reads pays_config" ON pays_config;
DROP POLICY IF EXISTS "Admin manages pays_config" ON pays_config;
CREATE POLICY "Public reads pays_config" ON pays_config FOR SELECT USING (true);
CREATE POLICY "Admin manages pays_config" ON pays_config FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

DROP POLICY IF EXISTS "Users own payment_intents" ON payment_intents;
DROP POLICY IF EXISTS "Admin all payment_intents" ON payment_intents;
CREATE POLICY "Users own payment_intents" ON payment_intents FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Admin all payment_intents" ON payment_intents FOR ALL USING (auth.jwt() ->> 'email' = 'relia.ebiya@gmail.com');

-- ─────────────────────────────────────────────
-- 13b. DONNÉES INITIALES — pays_config
-- ─────────────────────────────────────────────
INSERT INTO pays_config (code, nom, currency, mobile_money_providers, market) VALUES
  ('cg', 'Congo-Brazzaville', 'XAF', ARRAY['Orange Money', 'MTN MoMo', 'Airtel Money'], 'af'),
  ('ci', 'Côte d''Ivoire',    'XOF', ARRAY['Orange Money', 'MTN MoMo', 'Wave', 'Moov Money'], 'af'),
  ('cm', 'Cameroun',          'XAF', ARRAY['Orange Money', 'MTN MoMo'], 'af'),
  ('sn', 'Sénégal',           'XOF', ARRAY['Orange Money', 'Wave', 'Free Money'], 'af'),
  ('ml', 'Mali',              'XOF', ARRAY['Orange Money', 'Moov Money'], 'af'),
  ('bf', 'Burkina Faso',      'XOF', ARRAY['Orange Money', 'Moov Money', 'Coris Money'], 'af'),
  ('fr', 'France',            'EUR', ARRAY[]::TEXT[], 'fr')
ON CONFLICT (code) DO NOTHING;

-- ─────────────────────────────────────────────
-- 13c. DONNÉES INITIALES — 5 articles blog
-- ─────────────────────────────────────────────
INSERT INTO blog (titre, slug, extrait, contenu, marche, publie, tags) VALUES

('Comment évaluer la maturité digitale de votre PME en 5 étapes',
 'evaluer-maturite-digitale-pme-5-etapes',
 'Vous voulez savoir où en est votre PME dans sa transformation digitale ? Une méthode en 5 étapes pour faire votre diagnostic, même sans expert.',
 E'## Pourquoi évaluer votre maturité digitale ?\n\nLa transformation digitale ne commence pas par l''achat d''un logiciel. Elle commence par une question honnête : où en sommes-nous vraiment ?\n\n## Étape 1 : Cartographier vos outils actuels\n\nListez tous les outils numériques utilisés aujourd''hui : comptabilité, CRM, communication interne, e-commerce, réseaux sociaux. Ces outils communiquent-ils entre eux ?\n\n## Étape 2 : Évaluer le niveau de vos équipes\n\nUn outil vaut ce que les équipes en font. Interrogez vos collaborateurs : utilisent-ils vraiment les fonctionnalités disponibles ? Ont-ils été formés ?\n\n## Étape 3 : Analyser vos processus clés\n\nIdentifiez vos 5 processus les plus consommateurs de temps : facturation, prospection, gestion des stocks, SAV, reporting. Combien d''étapes manuelles comportent-ils ?\n\n## Étape 4 : Mesurer votre présence digitale externe\n\nAvez-vous un site web fonctionnel sur mobile ? Votre entreprise est-elle visible sur Google ? Vos clients peuvent-ils acheter en ligne ?\n\n## Étape 5 : Faire votre audit structuré\n\nL''audit Nexali évalue 6 dimensions en 3 minutes et vous donne 5 recommandations personnalisées. Score sur 100, comparaison sectorielle, plan d''action concret.',
 'fr', true,
 ARRAY['transformation digitale', 'audit digital', 'PME', 'diagnostic']),

('Mobile Money pour les entreprises africaines : guide complet 2026',
 'mobile-money-entreprises-africaines-guide-2026',
 'Orange Money, MTN MoMo, Wave... Comment intégrer le Mobile Money dans votre activité pour augmenter vos ventes et fluidifier vos paiements.',
 E'## Le Mobile Money, levier incontournable pour les PME africaines\n\nEn 2026, plus de 40% des transactions commerciales en Afrique subsaharienne transitent par le Mobile Money. Ne pas l''accepter, c''est se couper d''une large partie de ses clients.\n\n## Les principaux opérateurs par pays\n\n**Côte d''Ivoire** : Orange Money, MTN MoMo, Wave, Moov Money\n**Congo-Brazzaville** : Orange Money, MTN MoMo, Airtel Money\n**Cameroun** : Orange Money, MTN MoMo\n**Sénégal** : Orange Money, Wave, Free Money\n\n## Comment intégrer le Mobile Money ?\n\n### Solution 1 : QR Code marchand\nLa plus simple. Créez un QR code marchand auprès de votre opérateur. Vos clients scannent et paient. Zéro intégration technique.\n\n### Solution 2 : API de paiement\nDes agrégateurs comme CinetPay permettent d''accepter tous les opérateurs avec une seule intégration. Idéal pour les e-commerçants.\n\n### Solution 3 : Lien de paiement\nVous envoyez un lien par WhatsApp ou email. Le client choisit son opérateur et paie. Simple pour le B2B.\n\n## Les erreurs à éviter\n\n1. Ne pas réconcilier vos paiements avec votre comptabilité\n2. Dépendre d''un seul opérateur (diversifiez !)\n3. Ne pas informer vos clients des opérateurs acceptés',
 'af', true,
 ARRAY['Mobile Money', 'paiement digital', 'Afrique', 'Orange Money', 'MTN MoMo', 'Wave']),

('RGPD pour les PME françaises : les 10 points essentiels',
 'rgpd-pme-francaises-10-points-essentiels',
 'Le RGPD s''applique à toutes les entreprises qui traitent des données de citoyens européens. Les 10 points que toute PME française doit connaître.',
 E'## Le RGPD, une obligation pour toutes les PME\n\nDepuis 2018, le RGPD s''applique à toute organisation traitant des données personnelles de résidents européens. Les contrôles CNIL se sont intensifiés avec des amendes pouvant atteindre 4% du CA mondial.\n\n## Les 10 points essentiels\n\n1. **Registre des traitements** : listez toutes vos activités de traitement, leur finalité et durée de conservation.\n2. **Base légale** : consentement, contrat, obligation légale, intérêt légitime — chaque traitement doit en avoir une.\n3. **Information des personnes** : politique de confidentialité claire, mention légale sur les formulaires.\n4. **Droits des personnes** : accès, rectification, effacement, portabilité — répondez dans les 30 jours.\n5. **Durées de conservation** : fixez une durée maximale par catégorie de données et supprimez au-delà.\n6. **Sécurité** : chiffrement, accès restreints, sauvegardes, formation des équipes.\n7. **Sous-traitants** : DPA signé avec chaque prestataire traitant vos données.\n8. **Transferts hors UE** : Google Workspace, Salesforce, etc. nécessitent des garanties spécifiques.\n9. **Violations de données** : 72h pour notifier la CNIL en cas de fuite présentant un risque.\n10. **DPO** : obligatoire pour certains traitements, recommandé pour toutes les PME.\n\n## Par où commencer ?\n\nUtilisez notre checklist RGPD (47 points) disponible dans votre bibliothèque Nexali.',
 'fr', true,
 ARRAY['RGPD', 'conformité', 'données personnelles', 'CNIL', 'PME']),

('Transformation digitale au Congo-Brazzaville : état des lieux 2026',
 'transformation-digitale-congo-brazzaville-2026',
 'Le Congo engage 39,3 millions USD dans son Plan National de Transformation Numérique. Où en est la digitalisation des entreprises congolaises ?',
 E'## Un contexte en pleine évolution\n\nDébut 2026, le Congo-Brazzaville a nommé Frédéric Nzé Ministre du Numérique — entrepreneur formé à l''ENSAE Paris. Le Plan d''Accélération de la Transformation Numérique (PATN) mobilise 39,3 millions USD sur 3 ans.\n\n## Les priorités du gouvernement\n\n1. Digitalisation de l''état civil\n2. Portail services publics (e-gouvernement)\n3. Connectivité rurale (fibre + 4G)\n4. Formation numérique des jeunes\n\n## La réalité des PME congolaises en 2026\n\nSelon les données Nexali :\n- Score de maturité moyen : **28/100** (contre 52/100 en France)\n- Présence web : moins de 30% des PME ont un site web fonctionnel\n- Paiement digital : Mobile Money bien implanté (Orange Money, MTN)\n- Gestion interne : majoritairement papier ou Excel\n\n## Les secteurs les plus avancés\n\n- Télécommunications : 45/100\n- Commerce : 28/100\n- Santé : 22/100\n- Administration : 18/100\n\n## Les obstacles\n\n**Infrastructure** : coupures de courant, connectivité intermittente. Privilégier les solutions légères, offline-capable.\n**Compétences** : le déficit de compétences numériques est réel. L''accompagnement humain est aussi important que les outils.\n**Confiance** : culture de l''oral forte, décisions collectives, temps de validation long.\n\n## Les opportunités\n\nJeunesse de la population (âge médian 19 ans), forte pénétration mobile, volonté politique affirmée. La transformation est en marche — avec les bonnes approches.',
 'af', true,
 ARRAY['Congo-Brazzaville', 'transformation digitale', 'PATN', 'Afrique', 'numérique']),

('Choisir son prestataire digital : les questions à poser avant de signer',
 'choisir-prestataire-digital-questions-avant-signer',
 'Agence web, développeur freelance, éditeur SaaS... Comment choisir le bon partenaire pour votre projet digital ? Les 8 questions indispensables.',
 E'## Pourquoi le choix du prestataire est crucial\n\nUn mauvais choix peut coûter cher : projet livré en retard, budget dépassé, résultat décevant, dépendance à une technologie propriétaire.\n\n## Les 8 questions à poser avant de signer\n\n1. **Pouvez-vous me montrer des réalisations similaires ?** Pas des références générales — des projets proches du vôtre.\n2. **Qui sera mon interlocuteur et qui réalisera le travail ?** Certaines agences vendent avec un senior et livrent avec un junior.\n3. **Quelle est votre méthode de travail ?** Étapes, livrables intermédiaires, fréquence des points, processus de validation.\n4. **Que se passe-t-il si je ne suis pas satisfait ?** Nombre de retours inclus, conditions si dépassement budgétaire.\n5. **Serai-je propriétaire du code et des contenus ?** Vérifiez que les droits vous sont cédés, que vous avez accès au serveur et au domaine.\n6. **Comment gérez-vous la maintenance ?** Mises à jour de sécurité, évolutions futures, qui peut modifier le projet ?\n7. **Avez-vous une référence client que je peux appeler ?** Un bon prestataire n''a pas peur de vous y connecter.\n8. **Quelles sont les conditions de résiliation ?** Préavis, indemnités, récupération des données.\n\n## Les signaux d''alarme\n\n- Devis très bas sans explication\n- Pas de contrat formel\n- Aucune référence vérifiable\n- Promesses irréalistes sur les délais\n- Pression pour signer rapidement\n\n## En résumé\n\nComparez 3 prestataires minimum. Le moins cher n''est pas forcément le bon choix. Cherchez méthode + références + transparence.',
 'les-deux', true,
 ARRAY['prestataire digital', 'agence web', 'développeur', 'contrat', 'conseils'])

ON CONFLICT (slug) DO NOTHING;

-- ─────────────────────────────────────────────
-- FIN DU SCHEMA NEXALI
-- ─────────────────────────────────────────────
