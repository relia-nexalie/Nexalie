import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS — identiques à nexali_v4.jsx
// ═══════════════════════════════════════════════════════
const T = {
  pageBg: "#FFFFFF", sectionBg: "#F8FAFC", navyBg: "#0A1628",
  textPrimary: "#0A1628", textSecondary: "#6B7A94",
  textOnNavy: "#FFFFFF", textMuted: "rgba(255,255,255,0.5)",
  accent: "#2E9B8B", gold: "#C9A84C",
  border: "rgba(0,0,0,0.07)",
  btnPrimary: "#0A1628", btnPrimaryText: "#FFFFFF",
  btnAccent: "#2E9B8B", btnAccentText: "#FFFFFF",
};

function Layout({ children, backLabel = "← Retour", onBack }) {
  return (
    <div style={{ background: T.pageBg, minHeight: "100vh", fontFamily: "sans-serif" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
        .fade { animation: fadeIn 0.4s ease; }
      `}</style>
      {/* Mini nav */}
      <div style={{ background: T.navyBg, padding: "14px 40px",
        borderBottom: `1px solid ${T.gold}15`,
        display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "18px",
            fontWeight: 300, color: "#fff" }}>Nexalie</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px",
            letterSpacing: "2px", color: T.accent }}>AI</span>
        </div>
        {onBack && (
          <button onClick={onBack} style={{ background: "none", border: "none",
            color: T.textMuted, fontSize: "13px", cursor: "pointer" }}>
            {backLabel}
          </button>
        )}
      </div>
      <div className="fade">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// 1. PAGE SUCCESS — /app/success
// ═══════════════════════════════════════════════════════
export function SuccessPage({ onGoToDashboard, onGoHome }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Simule le déclenchement de l'onboarding automatique
    const t = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2800);
    const t3 = setTimeout(() => setStep(3), 4200);
    return () => { clearTimeout(t); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const steps = [
    { label: "Compte activé", done: step >= 1 },
    { label: "Email de bienvenue envoyé", done: step >= 2 },
    { label: "Audit automatique déclenché", done: step >= 3 },
  ];

  return (
    <Layout>
      {/* Hero navy */}
      <div style={{ background: T.navyBg, padding: "72px 40px", textAlign: "center" }}>
        <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${T.gold}40,transparent)`,
          marginBottom: "40px" }} />
        <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "80px", height: "80px", borderRadius: "50%",
          background: "rgba(46,155,139,0.15)", border: "2px solid rgba(46,155,139,0.4)",
          marginBottom: "24px", fontSize: "32px" }}>
          ✓
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)",
          fontWeight: 200, color: "#fff", marginBottom: "10px" }}>
          Bienvenue dans <em style={{ color: T.accent, fontStyle: "normal" }}>Nexalie Premium</em>
        </h1>
        <p style={{ fontSize: "15px", color: T.textMuted, maxWidth: "480px",
          margin: "0 auto", lineHeight: 1.8 }}>
          Votre abonnement est actif. Vos agents IA se mettent en place automatiquement.
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 40px" }}>

        {/* Onboarding progress */}
        <div style={{ padding: "28px", background: "#fff",
          border: `1px solid ${T.border}`, borderRadius: "16px", marginBottom: "24px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px",
            color: T.textSecondary, marginBottom: "20px" }}>
            ONBOARDING EN COURS — AUTOMATIQUE
          </p>
          {steps.map((s, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px",
              padding: "12px 0", borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : "none" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                background: s.done ? T.accent : T.sectionBg,
                border: `1px solid ${s.done ? T.accent : T.border}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.4s" }}>
                {s.done
                  ? <span style={{ color: "#fff", fontSize: "13px" }}>✓</span>
                  : <div style={{ width: "14px", height: "14px",
                      border: "2px solid rgba(0,0,0,0.1)",
                      borderTop: `2px solid ${T.accent}`,
                      borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
                }
              </div>
              <span style={{ fontSize: "14px",
                color: s.done ? T.textPrimary : T.textSecondary,
                fontWeight: s.done ? 600 : 400 }}>{s.label}</span>
              {s.done && <span style={{ marginLeft: "auto", fontSize: "11px",
                color: T.accent, fontFamily: "monospace" }}>FAIT</span>}
            </div>
          ))}
        </div>

        {/* 3 next steps */}
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px",
          fontWeight: 200, color: T.textPrimary, marginBottom: "16px" }}>
          Vos 3 premières étapes
        </h2>
        {[["1", "Complétez votre profil",
            "Renseignez votre secteur, votre site web et vos réseaux sociaux pour que vos agents puissent travailler.", T.accent],
          ["2", "Lancez votre premier audit",
            "L'audit complet de maturité digitale déclenche automatiquement vos agents Analyste et Stratège.", "#1A5FA8"],
          ["3", "Choisissez votre mode pilote",
            "Manuel pour valider chaque action, Automatique pour laisser vos agents travailler seuls.", "#6B3FA0"]
        ].map(([n, title, desc, color]) => (
          <div key={n} style={{ padding: "20px", background: "#fff",
            border: `1px solid ${T.border}`, borderRadius: "14px",
            marginBottom: "12px", display: "flex", gap: "16px",
            borderLeft: `3px solid ${color}` }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%",
              background: `${color}12`, flexShrink: 0,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color }}>{n}</span>
            </div>
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600,
                color: T.textPrimary, marginBottom: "4px" }}>{title}</p>
              <p style={{ fontSize: "13px", color: T.textSecondary, lineHeight: 1.6 }}>{desc}</p>
            </div>
          </div>
        ))}

        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
          <button onClick={onGoToDashboard}
            style={{ flex: 1, padding: "14px", background: T.btnPrimary,
              border: "none", borderRadius: "10px", color: T.btnPrimaryText,
              fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            Accéder à mon dashboard →
          </button>
          <button onClick={onGoHome}
            style={{ padding: "14px 20px", background: "transparent",
              border: `1px solid ${T.border}`, borderRadius: "10px",
              color: T.textSecondary, fontSize: "14px", cursor: "pointer" }}>
            Retour à l'accueil
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "12px", color: T.textSecondary,
          marginTop: "16px" }}>
          Un email de confirmation a été envoyé à votre adresse. Vérifiez vos spams si besoin.
        </p>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════
// 2. PAGE CANCEL — /app/cancel
// ═══════════════════════════════════════════════════════
export function CancelPage({ onRetry, onGoHome }) {
  return (
    <Layout>
      <div style={{ maxWidth: "600px", margin: "0 auto",
        padding: "80px 40px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%",
          background: "rgba(192,98,122,0.08)", border: "1px solid rgba(192,98,122,0.2)",
          margin: "0 auto 24px", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "28px" }}>
          ×
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px",
          fontWeight: 200, color: T.textPrimary, marginBottom: "10px" }}>
          Paiement annulé
        </h1>
        <p style={{ fontSize: "15px", color: T.textSecondary,
          lineHeight: 1.8, marginBottom: "32px" }}>
          Aucun montant n'a été débité. Vous pouvez réessayer quand vous voulez
          — votre panier est toujours disponible.
        </p>

        {/* Reassurance */}
        <div style={{ padding: "24px", background: T.sectionBg,
          borderRadius: "14px", marginBottom: "28px", textAlign: "left" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px",
            color: T.textSecondary, marginBottom: "14px", letterSpacing: "1px" }}>
            RAPPEL — CE QUE VOUS OBTENEZ AVEC PREMIUM
          </p>
          {["Tous les outils illimités — Business Plan, Roadmap, Veille, CDC, Budget",
            "Export PDF de tous vos documents",
            "Support WhatsApp direct",
            "Accès aux 5 agents IA (Analyste, Stratège, Exécuteur, Contrôleur, Rapporteur)",
            "Rapport mensuel automatique"
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: "#2E7D52", fontSize: "13px" }}>✓</span>
              <span style={{ fontSize: "13px", color: T.textSecondary }}>{item}</span>
            </div>
          ))}
          <p style={{ fontFamily: "Georgia, serif", fontSize: "20px",
            color: T.textPrimary, marginTop: "14px" }}>
            29€/mois <span style={{ fontSize: "13px", color: T.textSecondary,
              fontFamily: "sans-serif" }}>— annulable à tout moment</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button onClick={onRetry}
            style={{ flex: 1, padding: "14px", background: T.btnAccent,
              border: "none", borderRadius: "10px", color: "#fff",
              fontSize: "15px", fontWeight: 700, cursor: "pointer" }}>
            Réessayer →
          </button>
          <button onClick={onGoHome}
            style={{ padding: "14px 20px", background: "transparent",
              border: `1px solid ${T.border}`, borderRadius: "10px",
              color: T.textSecondary, fontSize: "14px", cursor: "pointer" }}>
            Retour à l'accueil
          </button>
        </div>
        <p style={{ fontSize: "12px", color: T.textSecondary, marginTop: "16px" }}>
          Une question ? <a href="https://wa.me/33786620409"
            style={{ color: T.accent, textDecoration: "none" }}>
            Contactez-nous sur WhatsApp
          </a>
        </p>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════
// 3. PAGE 404 — /app/not-found.tsx
// ═══════════════════════════════════════════════════════
export function NotFoundPage({ onGoHome }) {
  return (
    <Layout>
      <div style={{ background: T.navyBg, minHeight: "calc(100vh - 48px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "40px", textAlign: "center" }}>
        <div>
          <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${T.gold}40,transparent)`,
            marginBottom: "48px" }} />
          <p style={{ fontFamily: "Georgia, serif", fontSize: "96px",
            fontWeight: 200, color: "rgba(255,255,255,0.06)",
            lineHeight: 1, marginBottom: "-24px" }}>404</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px,4vw,38px)",
            fontWeight: 200, color: "#fff", marginBottom: "12px" }}>
            Cette page n'existe pas
          </h1>
          <p style={{ fontSize: "15px", color: T.textMuted,
            marginBottom: "32px", lineHeight: 1.8, maxWidth: "420px" }}>
            Elle a peut-être été déplacée ou supprimée.
            Pas d'inquiétude — tout le reste fonctionne parfaitement.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={onGoHome}
              style={{ padding: "13px 28px", background: T.btnAccent,
                border: "none", borderRadius: "10px", color: "#fff",
                fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
              ← Retour à l'accueil
            </button>
            <a href="https://wa.me/33786620409"
              style={{ padding: "13px 24px", background: "transparent",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px",
                color: "rgba(255,255,255,0.6)", fontSize: "14px",
                textDecoration: "none", display: "inline-block" }}>
              Contacter le support
            </a>
          </div>
          <p style={{ fontSize: "11px", color: T.textMuted,
            marginTop: "48px", fontFamily: "monospace" }}>
            nexali.ai · 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════
// 4. PAGES LÉGALES — Mentions légales / CGV / Confidentialité
// ═══════════════════════════════════════════════════════
const LEGAL_CONTENT = {
  mentions: {
    title: "Mentions légales",
    sections: [
      { title: "Éditeur du site", content: `Le site nexali.ai est édité par :

Nexalie Studio — Entreprise individuelle
Fondatrice : Relia Ebiya
Adresse : Vitry-sur-Seine, Île-de-France, France
Email : relia.ebiya@gmail.com
Téléphone : +33 7 86 62 04 09
SIRET : [à compléter lors de l'immatriculation]
Numéro TVA intracommunautaire : [à compléter]` },
      { title: "Hébergement", content: `Le site est hébergé par :

Vercel Inc.
340 Pine Street, Suite 701
San Francisco, CA 94104, États-Unis
https://vercel.com` },
      { title: "Directeur de la publication", content: "Relia Ebiya, en qualité de fondatrice de Nexalie Studio." },
      { title: "Propriété intellectuelle", content: `L'ensemble du contenu du site nexali.ai (textes, images, logos, code, outils IA) est protégé par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable et écrite de Relia Ebiya.

La plateforme Nexalie et ses outils IA sont des créations originales appartenant exclusivement à Relia Ebiya. Tout usage non autorisé fera l'objet de poursuites.` },
      { title: "Limitation de responsabilité", content: `Nexalie Studio s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées sur ce site. Cependant, elle ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.

Les contenus générés par l'intelligence artificielle (rapports, business plans, roadmaps) sont fournis à titre indicatif. Ils ne constituent pas un conseil professionnel et ne sauraient engager la responsabilité de Nexalie Studio.` },
      { title: "Droit applicable", content: "Le présent site est soumis au droit français. Tout litige relatif à l'utilisation du site sera soumis à la compétence exclusive des tribunaux français." },
    ]
  },
  cgv: {
    title: "Conditions Générales de Vente",
    sections: [
      { title: "1. Objet", content: `Les présentes Conditions Générales de Vente (CGV) régissent les relations contractuelles entre Nexalie Studio (ci-après "Nexalie"), représentée par Relia Ebiya, et toute personne physique ou morale (ci-après "le Client") souscrivant à ses services.` },
      { title: "2. Services proposés", content: `Nexalie propose les services suivants :

• Abonnement Premium à la plateforme nexali.ai (29€/mois ou 249€/an)
• Packs de consulting en transformation digitale (Démarrage, Transformation, Automatisation IA, Excellence)
• Création de sites web et d'identités visuelles
• Formation en intelligence artificielle et outils digitaux

Les caractéristiques essentielles de chaque offre sont présentées sur le site nexali.ai.` },
      { title: "3. Prix et paiement", content: `Tous les prix sont indiqués en euros (€) toutes taxes comprises (TTC).

Les paiements s'effectuent via Stripe, prestataire de paiement sécurisé. Nexalie ne stocke aucune donnée bancaire.

Pour les abonnements : le paiement est prélevé mensuellement ou annuellement à la date de souscription. L'abonnement se renouvelle automatiquement jusqu'à résiliation.

Pour les prestations de consulting : un acompte de 30% est requis à la commande, le solde à la livraison.` },
      { title: "4. Droit de rétractation", content: `Conformément à l'article L221-18 du Code de la consommation, le Client dispose d'un délai de 14 jours à compter de la souscription pour exercer son droit de rétractation, sans avoir à justifier de motifs.

Exception : le droit de rétractation ne s'applique pas aux services pleinement exécutés avant la fin du délai de rétractation avec l'accord préalable du Client.

Pour exercer ce droit, contactez : relia.ebiya@gmail.com` },
      { title: "5. Abonnement Premium — résiliation", content: `L'abonnement Premium peut être résilié à tout moment depuis le tableau de bord client ou en contactant relia.ebiya@gmail.com.

La résiliation prend effet à la fin de la période en cours. Aucun remboursement partiel n'est effectué pour la période entamée.` },
      { title: "6. Propriété intellectuelle", content: `Les livrables produits dans le cadre des prestations de consulting (rapports, business plans, sites web, identités visuelles) sont cédés au Client à la réception du paiement intégral.

Les outils IA de la plateforme Nexalie restent la propriété exclusive de Relia Ebiya. Le Client bénéficie d'une licence d'utilisation personnelle et non cessible pendant la durée de son abonnement.` },
      { title: "7. Responsabilité", content: `Nexalie s'engage à mettre en œuvre tous les moyens nécessaires pour assurer la qualité de ses services. Cependant, Nexalie ne peut garantir des résultats spécifiques en termes de chiffre d'affaires ou de croissance.

Les contenus générés par l'IA sont fournis à titre d'aide à la décision et ne remplacent pas un conseil professionnel (juridique, comptable, financier).` },
      { title: "8. Droit applicable et litiges", content: `Les présentes CGV sont soumises au droit français. En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux compétents du ressort de Paris seront saisis.

Le Client peut également recourir à la médiation de la consommation via la plateforme européenne : https://ec.europa.eu/consumers/odr` },
    ]
  },
  confidentialite: {
    title: "Politique de confidentialité",
    sections: [
      { title: "1. Responsable du traitement", content: `Nexalie Studio, représentée par Relia Ebiya
Email : relia.ebiya@gmail.com
Téléphone : +33 7 86 62 04 09
Site : nexali.ai` },
      { title: "2. Données collectées", content: `Nous collectons les données suivantes :

• Données d'identification : nom, prénom, email, téléphone
• Données professionnelles : nom d'entreprise, secteur, pays, chiffre d'affaires (optionnel)
• Données de navigation : adresse IP, pages visitées, durée de session (via Google Analytics)
• Données de paiement : traitées exclusivement par Stripe — nous n'y avons pas accès
• Données des audits et outils IA : réponses aux questionnaires, rapports générés` },
      { title: "3. Finalités du traitement", content: `Vos données sont utilisées pour :

• Fournir et améliorer nos services (base légale : exécution du contrat)
• Personnaliser vos rapports et recommandations IA (base légale : exécution du contrat)
• Vous envoyer des communications liées à votre compte (base légale : exécution du contrat)
• Envoyer notre newsletter (base légale : consentement)
• Analyser l'utilisation du site et améliorer nos services (base légale : intérêt légitime)` },
      { title: "4. Durée de conservation", content: `• Données de compte : durée de l'abonnement + 3 ans
• Données de facturation : 10 ans (obligation légale)
• Données analytics : 26 mois (paramétrage Google Analytics)
• Candidatures non retenues : 2 ans maximum` },
      { title: "5. Partage des données", content: `Vos données ne sont jamais vendues. Elles peuvent être partagées avec :

• Stripe : traitement des paiements
• Supabase : hébergement de la base de données
• Resend : envoi d'emails transactionnels
• Google Analytics : analyse du trafic (données anonymisées)
• Vercel : hébergement du site

Tous ces partenaires sont conformes au RGPD.` },
      { title: "6. Vos droits", content: `Conformément au RGPD, vous disposez des droits suivants :

• Droit d'accès à vos données
• Droit de rectification
• Droit à l'effacement ("droit à l'oubli")
• Droit à la portabilité
• Droit d'opposition au traitement
• Droit de retirer votre consentement

Pour exercer ces droits : relia.ebiya@gmail.com
Réponse garantie sous 30 jours.

Vous pouvez également adresser une réclamation à la CNIL : https://www.cnil.fr` },
      { title: "7. Cookies", content: `Le site utilise des cookies pour :

• Assurer le bon fonctionnement du site (cookies techniques — essentiels)
• Mesurer l'audience (Google Analytics — soumis à votre consentement)
• Mémoriser vos préférences (mode France/Afrique)

Vous pouvez gérer vos préférences cookies via la bannière de consentement affichée lors de votre première visite.` },
      { title: "8. Sécurité", content: `Nexalie met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : connexions HTTPS, accès restreint aux données, authentification sécurisée via Supabase Auth.` },
    ]
  }
};

export function LegalPage({ type = "mentions", onBack }) {
  const content = LEGAL_CONTENT[type];
  if (!content) return null;

  return (
    <Layout onBack={onBack}>
      {/* Header navy */}
      <div style={{ background: T.navyBg, padding: "48px 40px" }}>
        <div style={{ height: "1px",
          background: `linear-gradient(90deg,${T.gold}40,transparent)`,
          marginBottom: "24px" }} />
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px",
            letterSpacing: "3px", color: T.textMuted, marginBottom: "8px" }}>
            INFORMATIONS LÉGALES
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px",
            fontWeight: 200, color: "#fff" }}>{content.title}</h1>
          <p style={{ fontSize: "12px", color: T.textMuted, marginTop: "8px",
            fontFamily: "monospace" }}>
            Nexalie Studio · Mise à jour : Mars 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 40px" }}>
        {content.sections.map((section, i) => (
          <div key={i} style={{ marginBottom: "32px",
            paddingBottom: "32px",
            borderBottom: i < content.sections.length - 1 ? `1px solid ${T.border}` : "none" }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "18px",
              fontWeight: 300, color: T.textPrimary, marginBottom: "12px",
              borderLeft: `3px solid ${T.accent}`, paddingLeft: "14px" }}>
              {section.title}
            </h2>
            {section.content.split("\n\n").map((para, j) => (
              <p key={j} style={{ fontSize: "14px", color: T.textSecondary,
                lineHeight: 1.85, marginBottom: "10px", whiteSpace: "pre-line" }}>
                {para}
              </p>
            ))}
          </div>
        ))}

        {/* Contact box */}
        <div style={{ padding: "24px", background: T.navyBg,
          borderRadius: "14px", marginTop: "16px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px",
            color: T.textMuted, marginBottom: "8px" }}>CONTACT</p>
          <p style={{ fontSize: "14px", color: T.textOnNavy, marginBottom: "4px" }}>
            Pour toute question : relia.ebiya@gmail.com
          </p>
          <p style={{ fontSize: "13px", color: T.textMuted }}>
            Nexalie Studio · nexali.ai · +33 7 86 62 04 09
          </p>
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════
// 5. NDA — Accord de Non-Divulgation
// ═══════════════════════════════════════════════════════
export function NDADocument({ devName = "[Nom du développeur]", devAddress = "[Adresse]" }) {
  const [signed, setSigned] = useState(false);
  const [devNameInput, setDevNameInput] = useState(devName);
  const [date] = useState(new Date().toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  }));

  return (
    <Layout>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 40px" }}>

        {/* Header doc */}
        <div style={{ textAlign: "center", marginBottom: "40px",
          paddingBottom: "32px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "28px",
            fontWeight: 200, color: T.textPrimary, marginBottom: "4px" }}>
            Nexalie <em style={{ color: T.accent, fontStyle: "normal" }}>Studio</em>
          </div>
          <div style={{ height: "1px", background: `linear-gradient(90deg,transparent,${T.gold}60,transparent)`,
            margin: "12px 0" }} />
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "22px",
            fontWeight: 300, color: T.textPrimary, marginBottom: "6px" }}>
            Accord de Non-Divulgation
          </h1>
          <p style={{ fontSize: "13px", color: T.textSecondary,
            fontFamily: "monospace" }}>NDA — Contrat de confidentialité</p>
        </div>

        {/* Parties */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: "16px", marginBottom: "32px" }}>
          {[["PARTIE DIVULGATRICE",
              "Relia Ebiya\nFondatrice — Nexalie Studio\nVitry-sur-Seine, France\nrelia.ebiya@gmail.com",
              T.accent],
            ["PARTIE RÉCEPTRICE",
              `${devNameInput}\nDéveloppeur Next.js\n${devAddress}\n[Email du développeur]`,
              "#1A5FA8"]
          ].map(([title, content, color]) => (
            <div key={title} style={{ padding: "20px", background: T.sectionBg,
              border: `1px solid ${T.border}`, borderRadius: "12px",
              borderTop: `3px solid ${color}` }}>
              <p style={{ fontFamily: "monospace", fontSize: "9px",
                color: T.textSecondary, letterSpacing: "1.5px",
                marginBottom: "8px" }}>{title}</p>
              <p style={{ fontSize: "13px", color: T.textPrimary,
                lineHeight: 1.7, whiteSpace: "pre-line" }}>{content}</p>
            </div>
          ))}
        </div>

        {/* Articles */}
        {[
          ["Article 1 — Objet",
           `Dans le cadre du développement de la plateforme Nexalie (nexali.ai), la Partie Divulgatrice est amenée à partager avec la Partie Réceptrice des informations confidentielles incluant notamment : le code source de la plateforme, l'architecture technique, les données clients, les stratégies commerciales, les outils IA propriétaires, les clés d'accès aux services tiers (Supabase, Stripe, Anthropic), et tout autre document ou fichier transmis dans le cadre de cette collaboration.

Le présent accord a pour objet de définir les conditions dans lesquelles ces informations peuvent être utilisées.`],
          ["Article 2 — Obligations de confidentialité",
           `La Partie Réceptrice s'engage à :

• Garder strictement confidentielles toutes les informations reçues
• Ne pas divulguer ces informations à des tiers sans accord écrit préalable
• Ne pas utiliser ces informations à des fins autres que celles prévues par le contrat de développement
• Prendre toutes les mesures nécessaires pour protéger la confidentialité des informations
• Informer immédiatement la Partie Divulgatrice en cas de divulgation accidentelle`],
          ["Article 3 — Propriété intellectuelle",
           `Le code source de Nexalie, les outils IA, les designs, les contenus et toute création réalisée dans le cadre de cette collaboration restent la propriété exclusive de Relia Ebiya / Nexalie Studio, sauf accord écrit contraire.

La Partie Réceptrice ne peut prétendre à aucun droit de propriété sur les éléments qui lui sont confiés ou qu'elle développe dans le cadre de cette mission.`],
          ["Article 4 — Durée",
           `Le présent accord prend effet à la date de signature et reste valable :

• Pendant toute la durée de la collaboration
• Et pour une période de 3 (trois) ans après la fin de la collaboration

Les obligations de confidentialité survivent à la résiliation ou à l'expiration de tout contrat entre les parties.`],
          ["Article 5 — Restitution des informations",
           `À la demande de la Partie Divulgatrice, ou à la fin de la collaboration, la Partie Réceptrice s'engage à restituer ou détruire toutes les informations confidentielles reçues (codes d'accès, fichiers, documents) dans un délai de 48 heures.`],
          ["Article 6 — Sanctions",
           `Tout manquement aux obligations du présent accord expose la Partie Réceptrice à des poursuites civiles et/ou pénales, ainsi qu'à une demande de dommages et intérêts correspondant au préjudice subi par Nexalie Studio.`],
          ["Article 7 — Droit applicable",
           `Le présent accord est soumis au droit français. En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents du ressort de Paris seront saisis.`],
        ].map(([title, content]) => (
          <div key={title} style={{ marginBottom: "28px",
            paddingBottom: "28px", borderBottom: `1px solid ${T.border}` }}>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "17px",
              fontWeight: 300, color: T.textPrimary, marginBottom: "10px",
              borderLeft: `3px solid ${T.accent}`, paddingLeft: "12px" }}>
              {title}
            </h2>
            <p style={{ fontSize: "14px", color: T.textSecondary,
              lineHeight: 1.85, whiteSpace: "pre-line" }}>{content}</p>
          </div>
        ))}

        {/* Signatures */}
        <div style={{ marginTop: "16px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "17px",
            fontWeight: 300, color: T.textPrimary, marginBottom: "20px",
            borderLeft: `3px solid ${T.accent}`, paddingLeft: "12px" }}>
            Signatures
          </h2>
          <p style={{ fontSize: "13px", color: T.textSecondary,
            marginBottom: "20px" }}>
            Fait à _____________, le {date}
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
            {[["Partie Divulgatrice", "Relia Ebiya", "Nexalie Studio"],
              ["Partie Réceptrice", devNameInput, "Développeur"]
            ].map(([role, name, title]) => (
              <div key={role} style={{ padding: "20px", background: T.sectionBg,
                border: `1px solid ${T.border}`, borderRadius: "12px" }}>
                <p style={{ fontFamily: "monospace", fontSize: "9px",
                  color: T.textSecondary, marginBottom: "12px",
                  letterSpacing: "1px" }}>{role.toUpperCase()}</p>
                <div style={{ height: "48px", borderBottom: `1px dashed ${T.border}`,
                  marginBottom: "8px" }} />
                <p style={{ fontSize: "13px", fontWeight: 600,
                  color: T.textPrimary }}>{name}</p>
                <p style={{ fontSize: "12px", color: T.textSecondary }}>{title}</p>
              </div>
            ))}
          </div>

          {/* Nom dev editable */}
          {!signed && (
            <div style={{ marginTop: "24px", padding: "20px",
              background: "#FFF8E8", borderRadius: "12px",
              border: "1px solid rgba(201,168,76,0.2)" }}>
              <p style={{ fontSize: "13px", color: T.textSecondary, marginBottom: "12px" }}>
                Personnalisez le NDA avant impression :
              </p>
              <div style={{ display: "flex", gap: "10px" }}>
                <input value={devNameInput}
                  onChange={e => setDevNameInput(e.target.value)}
                  placeholder="Nom complet du développeur"
                  style={{ flex: 1, padding: "10px 14px",
                    background: "#fff", border: `1px solid ${T.border}`,
                    borderRadius: "8px", fontSize: "14px",
                    color: T.textPrimary, outline: "none" }} />
                <button onClick={() => { setSigned(true); window.print(); }}
                  style={{ padding: "10px 20px", background: T.btnPrimary,
                    border: "none", borderRadius: "8px",
                    color: "#fff", fontSize: "13px",
                    fontWeight: 700, cursor: "pointer" }}>
                  Imprimer / PDF →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// ═══════════════════════════════════════════════════════
// APP PREVIEW — pour tester toutes les pages
// ═══════════════════════════════════════════════════════
export default function App() {
  const [view, setView] = useState("success");
  const [legalType, setLegalType] = useState("mentions");

  const pages = [
    ["success","✅ Succès paiement"],
    ["cancel","❌ Paiement annulé"],
    ["404","🔍 Page 404"],
    ["mentions","📋 Mentions légales"],
    ["cgv","📜 CGV"],
    ["confidentialite","🔒 Confidentialité"],
    ["nda","🤝 NDA Dev"],
  ];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <style>{`* { box-sizing:border-box; margin:0; padding:0; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
      {/* Preview nav */}
      <div style={{ background: "#060E1C", padding: "10px 20px",
        display: "flex", gap: "6px", flexWrap: "wrap",
        borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)",
          alignSelf: "center", marginRight: "6px" }}>APERÇU :</span>
        {pages.map(([v, l]) => (
          <button key={v} onClick={() => { setView(v); if (["mentions","cgv","confidentialite"].includes(v)) setLegalType(v); }}
            style={{ padding: "5px 12px",
              background: view === v ? "#2E9B8B" : "transparent",
              border: `1px solid ${view === v ? "#2E9B8B" : "rgba(255,255,255,0.12)"}`,
              borderRadius: "6px",
              color: view === v ? "#fff" : "rgba(255,255,255,0.45)",
              fontSize: "11px", cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      <div key={view} style={{ animation: "fadeIn 0.3s ease" }}>
        {view === "success"        && <SuccessPage onGoToDashboard={() => {}} onGoHome={() => {}} />}
        {view === "cancel"         && <CancelPage onRetry={() => {}} onGoHome={() => {}} />}
        {view === "404"            && <NotFoundPage onGoHome={() => {}} />}
        {["mentions","cgv","confidentialite"].includes(view) && <LegalPage type={legalType} onBack={() => {}} />}
        {view === "nda"            && <NDADocument />}
      </div>
    </div>
  );
}
