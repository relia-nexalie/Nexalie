# Nexalie — README Développeur

## Stack technique

| Couche | Technologie |
|---|---|
| Framework | Next.js 14 (App Router) |
| Base de données | Supabase (PostgreSQL + Auth + Storage) |
| Auth | Supabase Auth (magic link + OAuth) |
| Paiement | Stripe (checkout + webhooks) |
| Email | Resend |
| IA | Anthropic API (Claude) |
| Déploiement | Vercel |
| Domaine | nexali.ai |

---

## Lancer le projet en local

```bash
# 1. Cloner
git clone <repo>
cd nexali

# 2. Installer les dépendances
npm install

# 3. Variables d'environnement (voir section ci-dessous)
cp .env.example .env.local
# Remplir .env.local avec les vraies valeurs

# 4. Lancer
npm run dev
# → http://localhost:3000
```

---

## Variables d'environnement requises

Créer un fichier `.env.local` à la racine avec :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Stripe Price IDs (créer dans le dashboard Stripe)
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_STARTER_ANNUAL=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_PRO_ANNUAL=price_...
STRIPE_PRICE_INSTITUTIONS_MONTHLY=price_...
STRIPE_PRICE_INSTITUTIONS_ANNUAL=price_...

# Anthropic
ANTHROPIC_API_KEY=sk-ant-...

# Resend
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=noreply@nexali.ai

# App
NEXT_PUBLIC_APP_URL=https://nexali.ai
```

---

## Structure des dossiers

```
/
├── app/                    ← Next.js App Router (pages)
│   ├── page.jsx            ← Homepage
│   ├── pricing/            ← Page tarifs (NOUVELLE)
│   ├── audit/              ← Audit de maturité
│   ├── onboarding/         ← Flow onboarding post-signup
│   ├── platform/           ← Zone connectée
│   │   ├── page.jsx        ← Hub plateforme
│   │   ├── audit/          ← Audit dans la plateforme
│   │   ├── roadmap/        ← Roadmap Builder (Pro+)
│   │   ├── os/             ← Nexalie OS — Chat IA
│   │   ├── resources/      ← Bibliothèque ressources
│   │   ├── progress/       ← Suivi progression (Pro+)
│   │   └── certification/  ← Badge Digital Ready (Pro+)
│   ├── dashboard/          ← Admin Rélia (relia.ebiya@gmail.com)
│   ├── api/                ← Routes API
│   │   ├── audit/          ← Traitement audit + IA
│   │   ├── claude/         ← Nexalie OS (chat IA)
│   │   ├── onboarding/     ← Sauvegarde onboarding
│   │   ├── roadmap/        ← Génération roadmap IA
│   │   ├── reports/        ← Génération PDF
│   │   ├── email/          ← Envoi emails (Resend)
│   │   ├── knowledge/      ← Base de connaissance IA
│   │   └── stripe/         ← Checkout + Webhooks
│   ├── login/              ← Connexion
│   ├── signup/             ← Inscription
│   ├── about/
│   ├── blog/
│   ├── contact/
│   ├── faq/
│   ├── legal/
│   └── success/            ← Page post-paiement Stripe
│
├── components/             ← Composants réutilisables
│   ├── NexaliPlatform.jsx  ← Interface Nexalie OS (chat IA)
│   ├── NexaliSite.jsx      ← Composant site vitrine
│   ├── OnboardingFlow.jsx  ← Flow onboarding 4 étapes
│   ├── AuditModule.jsx     ← Module d'audit interactif
│   ├── RoadmapBuilder.jsx  ← Générateur de roadmap IA
│   ├── KnowledgeManager.jsx← Gestion base de connaissance
│   ├── ClientProviders.jsx ← Providers React (ModeProvider...)
│   ├── ExitPopup.jsx       ← Popup sortie de page
│   ├── ModeToggle.tsx      ← Toggle France/Afrique
│   └── WhatsAppButton.jsx  ← Bouton WhatsApp flottant
│
├── lib/
│   ├── mode-context.tsx    ← Contexte Mode (fr/af) + CSS vars
│   ├── content.ts          ← Contenu statique par mode
│   └── supabase/           ← Clients Supabase (server + client)
│
├── middleware.js            ← Protection routes (auth + admin)
├── supabase_FINAL.sql       ← Schema complet à exécuter
├── next.config.mjs
└── package.json
```

---

## Ce qui fonctionne déjà

- [x] Auth Supabase (signup, login, magic link, session)
- [x] Middleware de protection des routes
- [x] Flow onboarding 4 étapes avec sauvegarde Supabase
- [x] Audit de maturité digitale + scoring
- [x] Nexalie OS (chat IA via Anthropic API)
- [x] Dashboard admin Rélia (clients, audits, mémoire IA)
- [x] Intégration Stripe (checkout, webhooks)
- [x] Toggle France/Afrique avec CSS variables dynamiques
- [x] Schema Supabase complet (supabase_FINAL.sql)
- [x] Page pricing avec tous les tarifs + marque blanche
- [x] Pages platform : roadmap, OS, resources, progress, certification

---

## Ce qui reste à faire

- [ ] **Paiement Mobile Money** : intégrer CinetPay (voir BRIEF_DEV.md)
- [ ] **Génération PDF** : rapports audit avec `@react-pdf/renderer`
- [ ] **Envoi emails** : séquences onboarding via Resend (route `/api/email` à connecter)
- [ ] **QR Code certification** : librairie `qrcode.react` pour les vrais QR codes
- [ ] **Graphique progression** : remplacer le graphique en barres CSS par `recharts`
- [ ] **Vérification certificat** : page publique `/verify/[code]`
- [ ] **SEO** : metadata dynamiques, sitemap, robots.txt
- [ ] **Tests** : score Lighthouse > 90 obligatoire avant livraison
- [ ] **Déploiement** : Vercel + domaine nexali.ai + variables d'env production
