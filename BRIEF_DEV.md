# Nexalie — Brief Développeur

**Client :** Rélia Ebiya — Fondatrice Nexalie  
**Contact :** relia.ebiya@gmail.com  
**Domaine :** nexali.ai  
**Date :** Mai 2026

---

## Mission

Déployer Nexalie en production sur nexali.ai.  
**Tout le code est écrit et prêt.** Votre rôle : installer les dépendances, configurer les variables d'environnement, et déployer sur Vercel.

**Délai cible :** à valider avec Rélia.

---

## Ce qui est prêt (ne pas toucher)

Le projet Next.js 14 App Router est **complet**. Ne rien réécrire.

- Auth Supabase ✅
- Paiement Stripe (France) ✅
- Paiement CinetPay Mobile Money (Afrique) ✅ — `app/api/cinetpay/`
- Génération PDF rapports `@react-pdf/renderer` ✅ — `app/api/pdf/` + `lib/pdf/`
- QR codes réels `qrcode.react` ✅ — certification + page `/verify/[code]`
- Graphique progression `recharts` ✅ — `ProgressClient.jsx`
- Séquences email Resend ✅ — 6 templates dans `app/api/email/route.js`
- SEO : metadata, sitemap, robots ✅
- Toggle fr/af ✅
- Toutes les pages app/ ✅

Lire `README_DEV.md` pour la structure complète.

---

## Tâches à réaliser (uniquement)

### 1. Installer les dépendances
```bash
npm install
```
Les nouvelles dépendances sont déjà dans `package.json` :
- `@react-pdf/renderer` — génération PDF
- `qrcode.react` — QR codes
- `recharts` — graphiques

### 2. Base de données Supabase
Exécuter `supabase_FINAL.sql` dans l'éditeur SQL du projet Supabase de production.  
Ce fichier est idempotent (safe à re-exécuter).

### 2. Paiement Mobile Money — PRIORITAIRE

Intégrer **CinetPay** pour les clients du mode Afrique.

```
Provider : CinetPay (https://cinetpay.com)
Devises : XOF (FCFA), XAF (FCFA Congo/Cameroun)
Méthodes : Orange Money, MTN MoMo, Wave, Moov Money
```

- Créer `app/api/cinetpay/checkout/route.js`
- Créer `app/api/cinetpay/webhook/route.js`
- Sur la page `/pricing` : afficher le bouton CinetPay si `mode === 'af'`, Stripe si `mode === 'fr'`
- Mettre à jour `profiles.plan` et `profiles.subscription_status` après paiement validé

Variables d'env à ajouter :
```env
CINETPAY_API_KEY=...
CINETPAY_SITE_ID=...
```

### 3. Génération PDF — Rapports d'audit

Installer `@react-pdf/renderer` :
```bash
npm install @react-pdf/renderer
```

Implémenter dans `app/api/reports/route.js` :
- Reçoit l'ID d'un audit en paramètre
- Génère un PDF avec : score, niveau, recommandations, branding Nexalie
- Upload dans Supabase Storage (`bucket: reports`)
- Met à jour `audits.rapport_pdf_url`
- Retourne l'URL signée (valide 24h)

### 4. QR Code certifications

Installer `qrcode.react` :
```bash
npm install qrcode.react
```

Dans `app/platform/certification/CertificationClient.jsx` :
- Remplacer le QR code CSS simulé par un vrai QR code
- URL : `https://nexali.ai/verify/[public_code]`

Créer `app/verify/[code]/page.jsx` :
- Page publique (pas d'auth requise)
- Affiche le certificat si le code est valide
- Message d'erreur si expiré ou invalide

### 5. Graphique de progression

Installer `recharts` :
```bash
npm install recharts
```

Dans `app/platform/progress/ProgressClient.jsx` :
- Remplacer le graphique en barres CSS par un `LineChart` Recharts
- Axe X : dates des audits
- Axe Y : score (0–100)
- Ligne de référence : benchmark sectoriel moyen

### 6. Séquences email (Resend)

Dans `app/api/email/route.js`, implémenter 3 séquences :

**Séquence onboarding** (déclenchée après `/api/onboarding` avec `completed: true`) :
- J+0 : Email de bienvenue
- J+3 : "Avez-vous fait votre audit ?"
- J+7 : "Découvrez le Roadmap Builder"

**Séquence post-audit** (déclenchée après un audit) :
- J+0 : Email avec rapport PDF en pièce jointe
- J+14 : "Suivez votre progression"

**Séquence upgrade** (pour les plans gratuits > 7 jours sans upgrade) :
- Email avec comparatif plans + CTA Pro

Utiliser les templates Resend avec le branding Nexalie (fond #0A1628, accent #4EC9B0).

### 7. Page de vérification de certificat

Créer `app/verify/[code]/page.jsx` :
```
Route : /verify/NX-XXXXXXX-XXXX
Public (pas d'auth)
Affiche : organisation, score, date, validité
```

### 8. SEO & Performance

**Metadata** : ajouter `export const metadata = { ... }` dans toutes les pages avec title/description adaptés.

**Sitemap** : créer `app/sitemap.js` avec toutes les routes publiques.

**Performance** :
- Images : utiliser `next/image` partout
- Fonts : précharger DM Sans + Georgia
- Bundle : analyser avec `@next/bundle-analyzer`
- **Score Lighthouse > 90 obligatoire** (Performance, Accessibilité, SEO)

---

## Déploiement Vercel

1. Connecter le repo GitHub à Vercel
2. Ajouter toutes les variables d'env (voir `README_DEV.md`)
3. Configurer le domaine `nexali.ai` dans Vercel
4. Activer l'edge middleware (le `middleware.js` est déjà en place)
5. Configurer les webhooks Stripe et CinetPay avec l'URL de production

---

## Critères de validation avant livraison

- [ ] Signup → Onboarding → Audit → Roadmap : flow complet sans erreur
- [ ] Paiement Stripe FR : checkout → webhook → upgrade plan → accès Pro
- [ ] Paiement CinetPay AF : checkout → webhook → upgrade plan → accès Pro
- [ ] PDF généré après audit et reçu par email
- [ ] QR code certification scannable et vérifiable sur nexali.ai/verify/[code]
- [ ] Toggle fr/af : couleurs, textes et prix changent correctement
- [ ] Dashboard admin Rélia accessible uniquement avec relia.ebiya@gmail.com
- [ ] Score Lighthouse > 90 sur les pages Homepage, Pricing, Audit
- [ ] 0 erreur console en production
- [ ] Variables d'env : aucun secret en dur dans le code

---

## Contacts & accès

| Ressource | Détail |
|---|---|
| Supabase | Rélia partage l'accès projet |
| Stripe | Rélia partage les clés live |
| Resend | Compte à créer sur resend.com avec nexali.ai |
| CinetPay | Compte à créer sur cinetpay.com |
| Vercel | Rélia crée le projet, partage l'accès |
| Anthropic | Rélia partage la clé API |
