'use client';

import { useState } from 'react';
import Link from 'next/link';

const T = {
  pageBg: '#FFFFFF', sectionBg: '#F8FAFC', navyBg: '#0A1628',
  textPrimary: '#0A1628', textSecondary: '#6B7A94', textOnNavy: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)', accent: '#2E9B8B', gold: '#C9A84C',
  border: 'rgba(0,0,0,0.07)',
};

const FAQS = [
  { q: "C'est quoi exactement Nexalie ?", a: "Nexalie est une plateforme de transformation digitale qui combine consulting humain et outils IA. Nous proposons un audit de maturité digitale gratuit, une plateforme SaaS avec 8 outils IA, et des packs d'accompagnement mensuel. Notre spécificité : nous servons aussi bien les PME françaises que les entreprises africaines, avec des prix adaptés à chaque marché." },
  { q: "L'audit digital est vraiment gratuit ?", a: "Oui, totalement gratuit et sans carte bancaire. L'audit de maturité digitale (20 questions, 5 dimensions, score /100 + rapport IA) est accessible sans création de compte. Vous obtenez un rapport personnalisé avec vos forces, faiblesses et priorités d'action." },
  { q: "Quelle est la différence entre le plan Gratuit et Pro ?", a: "Le plan Gratuit donne accès à 1 audit, 3 ressources et Nexalie OS (5 messages/jour). Le plan Pro (129€/mois en France, 85 000 FCFA/mois en Afrique) débloque les audits illimités, le Roadmap Builder IA, toutes les ressources, le suivi de progression, le Badge Digital Ready et le support prioritaire." },
  { q: "Quels sont les modes de paiement acceptés en Afrique ?", a: "Pour les clients africains, nous acceptons Orange Money, Wave, MTN Mobile Money et les virements bancaires FCFA. Le plan Starter est à 39 000 FCFA/mois, Pro à 85 000 FCFA/mois, et Institutions à 320 000 FCFA/mois. L'option annuelle offre 2 mois gratuits." },
  { q: "Les outils IA utilisent quelle technologie ?", a: "Nos outils sont propulsés par Claude (Anthropic), l'un des modèles IA les plus avancés du marché. Nous utilisons la version claude-sonnet-4-6. Toutes les données sont traitées via une API sécurisée — votre clé API n'est jamais exposée côté client. Nous ne stockons pas le contenu de vos générations sans votre accord." },
  { q: "Nexalie peut-il m'aider si je suis débutant en digital ?", a: "C'est précisément pour ça que Nexalie existe. Le score moyen de nos nouveaux clients à l'audit est de 22/100 — c'est normal et c'est exactement le point de départ. L'audit identifie les 3 actions prioritaires adaptées à votre niveau. Le Pack Démarrage (400€/mois) est spécialement conçu pour les entreprises au début de leur transformation." },
  { q: "Puis-je annuler mon abonnement à tout moment ?", a: "Oui. Les abonnements mensuels sont sans engagement. Vous pouvez annuler depuis votre espace client avant le prochain renouvellement. Pour les abonnements annuels, l'annulation prend effet à la fin de la période en cours. Aucun frais d'annulation." },
  { q: "Les rapports sont-ils sauvegardés ?", a: "Oui, tous les rapports générés (audit, business plan, roadmap, etc.) sont sauvegardés dans votre espace client et accessibles à tout moment. Avec le plan Premium, vous pouvez les exporter en PDF. L'historique est conservé pendant toute la durée de votre abonnement + 12 mois après résiliation." },
  { q: "Nexalie propose-t-il un accompagnement humain ou seulement des outils IA ?", a: "Les deux. Les outils SaaS fonctionnent de façon autonome. Mais nos Packs Consulting (400€/mois et plus) incluent des sessions Zoom mensuelles avec Relia, une stratégie personnalisée, un suivi des KPIs et un support WhatsApp direct. L'IA accélère, l'humain guide." },
  { q: "Comment fonctionne l'architecture multi-agents ?", a: "Nexalie V2 (en bêta) déploie 5 agents IA spécialisés : A1 Analyste (scrape votre site et vos concurrents), A2 Stratège (génère roadmap et plan d'action), A3 Exécuteur (publie contenus, configure outils), A4 Contrôleur (surveille vos KPIs chaque semaine), A5 Rapporteur (génère votre rapport PDF mensuel automatiquement). Rejoignez la liste d'attente via le formulaire de contact." },
];

export default function FaqPage() {
  const [open, setOpen] = useState(null);

  return (
    <div style={{ background: T.pageBg, fontFamily: 'sans-serif', minHeight: '100vh' }}>

      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent }}>AI</span>
          </Link>
          <Link href="/" style={{ fontSize: '13px', color: T.textMuted, textDecoration: 'none' }}>← Retour</Link>
        </div>
      </nav>

      {/* Header */}
      <div style={{ background: T.navyBg, padding: '60px 40px' }}>
        <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,${T.gold}40,transparent)`, marginBottom: '36px' }} />
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textMuted, marginBottom: '10px' }}>AIDE & SUPPORT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 200, color: '#fff', marginBottom: '10px' }}>
            Questions <em style={{ color: T.accent, fontStyle: 'normal' }}>fréquentes</em>
          </h1>
          <p style={{ fontSize: '15px', color: T.textMuted }}>10 réponses aux questions que tout le monde se pose sur Nexalie.</p>
        </div>
      </div>

      {/* FAQs */}
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 40px' }}>
        {FAQS.map((faq, i) => (
          <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
            <button
              onClick={() => setOpen(open === i ? null : i)}
              style={{ width: '100%', padding: '20px 0', background: 'none', border: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', textAlign: 'left', gap: '16px' }}
            >
              <span style={{ fontFamily: 'Georgia, serif', fontSize: '16px', fontWeight: 300, color: open === i ? T.accent : T.textPrimary, lineHeight: 1.4 }}>{faq.q}</span>
              <span style={{ fontSize: '18px', color: T.accent, flexShrink: 0, transition: 'transform 0.2s', transform: open === i ? 'rotate(45deg)' : 'none' }}>+</span>
            </button>
            {open === i && (
              <div style={{ paddingBottom: '20px', animation: 'fadeIn 0.25s ease' }}>
                <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.8 }}>{faq.a}</p>
              </div>
            )}
          </div>
        ))}

        {/* CTA contact */}
        <div style={{ marginTop: '48px', padding: '32px', background: T.navyBg, borderRadius: '16px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 200, color: '#fff', marginBottom: '8px' }}>
            Vous n'avez pas trouvé votre réponse ?
          </p>
          <p style={{ fontSize: '14px', color: T.textMuted, marginBottom: '20px' }}>
            Réponse garantie sous 24h par WhatsApp ou email.
          </p>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer"
              style={{ padding: '12px 24px', background: '#25D366', borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
              💬 WhatsApp
            </a>
            <Link href="/contact"
              style={{ padding: '12px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: T.textMuted, fontSize: '14px', textDecoration: 'none' }}>
              Formulaire de contact
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
