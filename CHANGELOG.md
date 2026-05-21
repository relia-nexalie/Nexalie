# CHANGELOG — Nexalie

## v2.1.0 — Avril 2026

### Authentification & Sécurité
- **Supabase Auth complet** : inscription (`/signup`), connexion (`/login`), déconnexion, callback OAuth (`/auth/callback`)
- **Middleware Next.js** (`middleware.js`) : `/platform` protégée — redirection vers `/login` si non connecté
- **Redirection inverse** : utilisateurs connectés redirigés vers `/platform` depuis `/login` et `/signup`
- **localStorage** : choix France/Afrique persisté entre les sessions
- **Supabase SQL schema** (`supabase_schema.sql`) : tables `profiles`, `reports`, `mobile_money_payments` avec RLS + trigger auto-création profil

### Pages créées
- `/about` — Présentation Relia Ebiya, vision, valeurs, timeline parcours
- `/contact` — Formulaire + WhatsApp Business pré-rempli + délais de réponse
- `/faq` — 10 questions/réponses accordion (auth, prix, IA, Mobile Money, etc.)
- `/blog` — Liste articles + vue article individuel (adapté de `nexali_dashboard_blog.jsx`)
- `/legal` — CGV + Mentions légales + Politique confidentialité + Cookies
- `/success` — Page de confirmation post-paiement avec onboarding progressif animé
- `/login` — Page connexion design Nexalie
- `/signup` — Page inscription avec sélection marché (FR/CI/CG/CM/SN/Autre)

### Pricing Afrique (FCFA)
- **Starter** : 9 900 FCFA/mois (7 920 FCFA/mois annuel)
- **Business** : 19 900 FCFA/mois (15 920 FCFA/mois annuel)
- **Enterprise** : 39 900 FCFA/mois
- Grille pricing passe de 3 à 4 colonnes en mode Afrique
- Affichage sous-titre avec économie annuelle sur chaque plan

### Sections marketing (NexaliSite.jsx)
- **Social proof banner** : "+ 120 entreprises auditées", "2 marchés", "4.9/5", "20 min"
- **"Comment ça marche"** : section 3 étapes avec numéros (Audit → Plan → Nexalie)
- **Témoignages clients** : 3 témoignages (Abidjan, Paris, Brazzaville) avec étoiles 5/5

### Expérience utilisateur
- **Mode France/Afrique** sauvegardé dans `localStorage` (`nexali-mode`)
- **Bouton WhatsApp flottant** (`WhatsAppButton.jsx`) : apparaît après 2s, tooltip au survol, présent sur toutes les pages
- **Pop-up de sortie** (`ExitPopup.jsx`) : détecte la sortie de souris, propose l'audit gratuit, max 1 fois par session

### Paiement
- **Stripe Checkout** (`/api/stripe/checkout`) : sessions mensuelles et annuelles FR (€) et AF (FCFA/XOF)
- **Stripe Webhook** (`/api/stripe/webhook`) : mise à jour plan utilisateur dans Supabase à la confirmation paiement + désactivation à la résiliation
- **Mobile Money** : schema SQL prêt, intégration CinetPay documentée dans `supabase_schema.sql`

### Emails transactionnels (Resend)
- **`/api/email`** : deux types — `welcome` (bienvenue à l'inscription) et `report_generated` (notification après chaque rapport)
- Templates HTML responsives aux couleurs Nexalie

### API Routes
- **`/api/reports` GET** : récupérer l'historique des rapports d'un utilisateur
- **`/api/reports` POST** : sauvegarder un rapport + déclencher email notification

### Analytics
- **Google Analytics 4** : script `gtag` injecté via `next/script` (strategy: afterInteractive), conditionnel à `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Meta Pixel** : script injecté (strategy: afterInteractive), conditionnel à `NEXT_PUBLIC_META_PIXEL_ID`

### Infrastructure
- **Packages installés** : `@supabase/supabase-js`, `@supabase/ssr`, `resend`, `stripe`, `@stripe/stripe-js`
- **`components/ClientProviders.jsx`** : enveloppe client pour WhatsApp + ExitPopup (compatible Server Components layout)
- **`app/layout.jsx`** mis à jour : ClientProviders, GA4, Meta Pixel, dark mode CSS system preference
- **`.env.local.example`** mis à jour : 10 variables documentées
- **`lib/supabase/client.js`** et **`lib/supabase/server.js`** : clients Supabase séparés browser/serveur

---

## v2.0.0 — Avril 2026 (lancement projet Next.js)

### Migration
- Conversion du dossier JSX standalone en projet Next.js 14.2.35
- `nexali_v4.jsx` → `components/NexaliSite.jsx` (`'use client'`)
- `nexali_platform.jsx` → `components/NexaliPlatform.jsx` (`'use client'`)
- Route `/` → site vitrine
- Route `/platform` → SaaS platform

### Proxy API sécurisé
- **`/api/claude`** : proxy server-side pour l'API Anthropic — clé API jamais exposée côté client
- Modèle mis à jour : `claude-sonnet-4-20250514` → `claude-sonnet-4-6`

### Configuration
- `package.json`, `next.config.mjs`, `jsconfig.json` (alias `@/`)
- `.gitignore` complet (node_modules, .next, .env.local)
- Google Fonts chargées dans `app/layout.jsx` (DM Sans, Fraunces, IBM Plex Mono)

---

## Prochaines étapes suggérées

- [ ] Intégrer CinetPay pour les paiements Mobile Money (Orange Money CI, Wave)
- [ ] Onboarding guidé 5 étapes après inscription (composant à créer)
- [ ] Dashboard client avec historique des rapports (utiliser `/api/reports`)
- [ ] Déploiement Vercel + configuration domaine nexali.ai
- [ ] Exécuter `supabase_schema.sql` dans le Dashboard Supabase
- [ ] Configurer le webhook Stripe dans le Dashboard Stripe
