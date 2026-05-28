'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMode } from '@/lib/mode-context';
import { CheckCircle2, XCircle } from 'lucide-react';

const PLANS = {
  fr: [
    {
      id: 'free',
      name: 'Gratuit',
      emoji: '🌱',
      monthly: 0,
      annual: 0,
      currency: '€',
      desc: 'Pour découvrir Nexalie et évaluer votre maturité digitale.',
      cta: 'Commencer gratuitement',
      ctaHref: '/signup',
      highlight: false,
      features: ['Audit de maturité digitale', 'Calculateur ROI digital', 'Générateur de maquette IA (3/mois)', 'Accès aux articles du blog'],
      limits: ['Pas de Business Plan IA', 'Pas de Roadmap digitale', 'Pas de Cahier des charges'],
    },
    {
      id: 'starter',
      name: 'Starter',
      emoji: '⚡',
      monthly: 59,
      annual: 590,
      currency: '€',
      desc: 'Pour les indépendants et TPE qui veulent passer à l\'action rapidement.',
      cta: 'Commencer Starter',
      ctaHref: '/signup?plan=starter',
      highlight: false,
      features: ['Tout le plan Gratuit', '3 audits complets/mois', 'Rapport PDF basique', 'Nexalie OS limité', 'Support email'],
      limits: ['Pas de Business Plan IA', 'Pas de Roadmap digitale', 'Pas de Cahier des charges'],
    },
    {
      id: 'pro',
      name: 'Pro',
      emoji: '🚀',
      monthly: 129,
      annual: 1290,
      currency: '€',
      desc: 'Accès complet à tous les outils IA pour transformer votre entreprise.',
      cta: 'Passer Pro',
      ctaHref: '/signup?plan=pro',
      highlight: true,
      features: ['Tout le plan Starter', 'Business Plan IA illimité', 'Roadmap digitale 12 mois', 'Cahier des charges', 'Veille concurrentielle', 'Simulateur de budget', 'Support prioritaire'],
      limits: [],
    },
    {
      id: 'institutions',
      name: 'Institutions',
      emoji: '🏛️',
      monthly: null,
      annual: null,
      currency: '€',
      desc: 'Pour les collectivités, ministères et organismes publics.',
      cta: 'Nous contacter',
      ctaHref: '/contact?plan=institutions',
      highlight: false,
      features: ['Tout le plan Pro', 'Multi-utilisateurs (5+ comptes)', 'Dashboard consolidé', 'Formation équipe incluse', 'Rapport institutionnel sur-mesure', 'Facturation mensuelle', 'SLA garanti'],
      limits: [],
    },
  ],
  af: [
    {
      id: 'free',
      name: 'Gratuit',
      emoji: '🌱',
      monthly: 0,
      annual: 0,
      currency: 'FCFA',
      desc: 'Pour découvrir Nexalie et évaluer votre maturité digitale.',
      cta: 'Commencer gratuitement',
      ctaHref: '/signup',
      highlight: false,
      features: ['Bilan numérique gratuit', 'Calculateur ROI digital', 'Générateur de maquette IA (3/mois)', 'Accès aux articles du blog'],
      limits: ['Pas de Plan d\'Action Digital IA', 'Pas de Roadmap digitale', 'Pas de Cahier des charges'],
    },
    {
      id: 'starter',
      name: 'Starter',
      emoji: '⚡',
      monthly: 39000,
      annual: 390000,
      currency: 'FCFA',
      desc: 'Pour les indépendants et TPE qui veulent passer à l\'action rapidement.',
      cta: 'Commencer Starter',
      ctaHref: '/signup?plan=starter',
      highlight: false,
      features: ['Tout le plan Gratuit', '3 audits complets/mois', 'Rapport PDF basique', 'Nexalie OS limité', 'Support WhatsApp'],
      limits: ['Pas de Plan d\'Action Digital IA', 'Pas de Roadmap digitale', 'Pas de Cahier des charges'],
    },
    {
      id: 'pro',
      name: 'Pro',
      emoji: '🚀',
      monthly: 85000,
      annual: 850000,
      currency: 'FCFA',
      desc: 'Accès complet à tous les outils IA pour transformer votre entreprise.',
      cta: 'Passer Pro',
      ctaHref: '/signup?plan=pro',
      highlight: true,
      features: ['Tout le plan Starter', 'Plan d\'Action Digital IA', 'Roadmap digitale 12 mois', 'Cahier des charges', 'Veille concurrentielle', 'Simulateur de budget', 'Export PDF', 'Support WhatsApp prioritaire'],
      limits: [],
    },
    {
      id: 'institutions',
      name: 'Institutions',
      emoji: '🏛️',
      monthly: null,
      annual: null,
      currency: 'FCFA',
      desc: 'Mairies, ministères, organismes publics africains.',
      cta: 'Nous contacter',
      ctaHref: '/contact?plan=institutions',
      highlight: false,
      features: ['Tout le plan Pro', 'Multi-utilisateurs (5+ comptes)', 'Dashboard consolidé', 'Formation équipe incluse', 'Rapport institutionnel sur-mesure', 'Paiement Mobile Money accepté', 'Facturation mensuelle'],
      limits: [],
    },
  ],
};

const CONSULTING = {
  fr: [
    { emoji: '🌱', name: 'Pack Démarrage', score: '0–19', price: '400€', period: '/mois', color: '#4EC9B0' },
    { emoji: '🌿', name: 'Pack Transformation', score: '20–39', price: '600€', period: '/mois', color: '#2D6A4F' },
    { emoji: '🌳', name: 'Pack Automatisation IA', score: '40–59', price: '800€', period: '/mois', color: '#C45E0A', badge: 'POPULAIRE' },
    { emoji: '🚀', name: 'Pack Excellence', score: '60–79', price: '1 200€', period: '/mois', color: '#7B5EA7' },
  ],
  af: [
    { emoji: '🌱', name: 'Pack Démarrage', score: '0–19', price: '250 000 FCFA', period: '/mois', color: '#4EC9B0' },
    { emoji: '🌿', name: 'Pack Transformation', score: '20–39', price: '400 000 FCFA', period: '/mois', color: '#2D6A4F' },
    { emoji: '🌳', name: 'Pack Automatisation IA', score: '40–59', price: '550 000 FCFA', period: '/mois', color: '#C45E0A', badge: 'POPULAIRE' },
    { emoji: '🚀', name: 'Pack Excellence', score: '60–79', price: '800 000 FCFA', period: '/mois', color: '#7B5EA7' },
  ],
};

function fmt(amount, currency) {
  if (amount === 0) return 'Gratuit';
  if (currency === 'FCFA') return `${amount.toLocaleString('fr-FR')} FCFA`;
  return `${amount.toLocaleString('fr-FR')} €`;
}

// Conversion reference for FR users wanting FCFA preview
const FR_TO_FCFA = { 59: 39000, 590: 390000, 129: 85000, 1290: 850000 };

function fmtDisplay(amount, currency, displayCurrency, mode) {
  if (amount === 0) return 'Gratuit';
  if (currency === 'FCFA' || mode === 'af') {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
  if (displayCurrency === 'fcfa') {
    const fcfa = FR_TO_FCFA[amount];
    return fcfa ? `${fcfa.toLocaleString('fr-FR')} F CFA` : `${amount.toLocaleString('fr-FR')} €`;
  }
  return `${amount.toLocaleString('fr-FR')} €`;
}

export default function PricingPage() {
  const { mode, isAfrica } = useMode();
  const [billing, setBilling] = useState('monthly');
  const [displayCurrency, setDisplayCurrency] = useState('eur');
  const [checkoutLoading, setCheckoutLoading] = useState('');
  const [checkoutError, setCheckoutError] = useState('');
  const router = useRouter();
  const plans = PLANS[mode];
  const packs = CONSULTING[mode];

  async function handleCheckout(planId) {
    setCheckoutLoading(planId);
    setCheckoutError('');
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey: `${planId}_${billing}` }),
      });
      const data = await res.json();
      if (data.redirect) { router.push(data.redirect + '?next=/pricing'); return; }
      if (data.url) { window.location.href = data.url; return; }
      setCheckoutError(data.error || 'Erreur inattendue. Réessayez.');
    } catch {
      setCheckoutError('Erreur réseau. Vérifiez votre connexion.');
    }
    setCheckoutLoading('');
  }

  const navy   = isAfrica ? '#1A0800' : '#0A1628';
  const accent = isAfrica ? '#C45E0A' : '#4EC9B0';
  const accentText = isAfrica ? '#C45E0A' : '#1D6B60';

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#fff', color: '#1C1C1C', minHeight: '100vh' }}>

      {/* Hero */}
      <section style={{ background: navy, padding: '72px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '14px', fontFamily: 'monospace' }}>Tarifs</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(30px,5vw,52px)', fontWeight: 300, color: '#fff', marginBottom: '14px', lineHeight: 1.2 }}>
          {isAfrica ? 'Des prix adaptés à l\'Afrique' : 'Une tarification transparente'}
        </h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.6)', maxWidth: '480px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          {isAfrica
            ? 'Mobile Money accepté. Paiement en FCFA. Conçu pour vos réalités terrain.'
            : 'Pas de frais cachés. Annulez à tout moment. Commencez gratuitement.'}
        </p>
        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          {[['monthly', 'Mensuel'], ['annual', 'Annuel — 2 mois offerts']].map(([b, label]) => (
            <button key={b} onClick={() => setBilling(b)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, background: billing === b ? '#fff' : 'transparent', color: billing === b ? navy : 'rgba(255,255,255,0.65)', transition: 'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {/* Sélecteur de devise — FR uniquement */}
        {!isAfrica && (
          <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>Devise</span>
            <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
              {[['eur', 'Euros (€)'], ['fcfa', 'F CFA']].map(([c, label]) => (
                <button key={c} onClick={() => setDisplayCurrency(c)} style={{ padding: '6px 14px', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', fontWeight: displayCurrency === c ? 700 : 400, background: displayCurrency === c ? 'rgba(255,255,255,0.12)' : 'transparent', color: displayCurrency === c ? '#fff' : 'rgba(255,255,255,0.4)', transition: 'all 0.15s' }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* Plans SaaS */}
      <section style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {plans.map((plan, i) => {
            const price = billing === 'annual' && plan.monthly ? Math.round(plan.annual / 12) : plan.monthly;
            const priceAnnual = plan.annual;
            return (
              <div key={plan.id} style={{ border: plan.highlight ? `2px solid ${accent}` : '2px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '28px 24px', position: 'relative', background: plan.highlight ? `${accentText}06` : '#fff' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 16px', borderRadius: '20px', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap' }}>
                    Le plus populaire
                  </div>
                )}
                <div style={{ marginBottom: '8px', height: '28px', display: 'flex', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', letterSpacing: '2px', color: plan.highlight ? accentText : '#9CA3AF', textTransform: 'uppercase' }}>{plan.name}</span>
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: navy, marginBottom: '6px' }}>{plan.name}</h3>
                <p style={{ fontSize: '13px', color: '#6B7A94', marginBottom: '20px', lineHeight: 1.5 }}>{plan.desc}</p>

                {plan.monthly === null ? (
                  <div style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: '24px', fontWeight: 300, color: navy, marginBottom: '24px' }}>Sur devis</div>
                ) : plan.monthly === 0 ? (
                  <div style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: '36px', fontWeight: 300, color: navy, marginBottom: '24px' }}>Gratuit</div>
                ) : (
                  <div style={{ marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: '34px', fontWeight: 300, color: navy }}>{fmtDisplay(price, plan.currency, displayCurrency, mode)}</span>
                      <span style={{ fontSize: '13px', color: '#6B7A94' }}>/mois</span>
                    </div>
                    {billing === 'annual' && (
                      <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: accentText, marginTop: '4px' }}>Facturé {fmtDisplay(priceAnnual, plan.currency, displayCurrency, mode)}/an</p>
                    )}
                  </div>
                )}

                {plan.id === 'pro' || plan.id === 'starter' ? (
                  <button
                    onClick={() => handleCheckout(plan.id)}
                    disabled={!!checkoutLoading}
                    style={{ display: 'block', width: '100%', padding: '12px', borderRadius: '10px', textAlign: 'center', fontWeight: 700, fontSize: '14px', background: plan.highlight ? accent : 'transparent', color: plan.highlight ? '#fff' : navy, border: plan.highlight ? 'none' : `2px solid ${navy}`, marginBottom: '24px', cursor: checkoutLoading ? 'default' : 'pointer', opacity: checkoutLoading === plan.id ? 0.7 : 1, transition: 'opacity 0.2s' }}
                  >
                    {checkoutLoading === plan.id ? 'Redirection...' : plan.cta}
                  </button>
                ) : (
                  <Link href={plan.ctaHref} style={{ display: 'block', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '14px', background: plan.highlight ? accent : 'transparent', color: plan.highlight ? '#fff' : navy, border: plan.highlight ? 'none' : `2px solid ${navy}`, marginBottom: '24px', transition: 'opacity 0.2s' }}>
                    {plan.cta}
                  </Link>
                )}

                <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '20px' }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#2D6A4F', fontWeight: 700, flexShrink: 0 }}>✓</span>
                      <span style={{ fontSize: '13px', color: '#374151' }}>{f}</span>
                    </div>
                  ))}
                  {plan.limits.map(l => (
                    <div key={l} style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: '#D1D5DB', flexShrink: 0 }}>✗</span>
                      <span style={{ fontSize: '13px', color: '#9CA3AF' }}>{l}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {checkoutError && (
          <p style={{ textAlign: 'center', color: '#EF4444', fontSize: '14px', marginTop: '16px', padding: '12px', background: '#FEF2F2', borderRadius: '8px', border: '1px solid #FECACA' }}>
            {checkoutError}
          </p>
        )}
      </section>

      {/* Comparaison */}
      <section style={{ background: '#F8F9FA', padding: '64px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: '#9CA3AF', textTransform: 'uppercase', textAlign: 'center', marginBottom: '8px' }}>Pourquoi Nexalie</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 300, color: navy, textAlign: 'center', marginBottom: '36px' }}>
            Nexalie Pro vs. les alternatives
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: navy }}>
                  <th style={{ padding: '14px 20px', textAlign: 'left', color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 600, letterSpacing: '1px' }}></th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: accent, fontSize: '13px', fontWeight: 700 }}>Nexalie Pro</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600 }}>Cabinet conseil</th>
                  <th style={{ padding: '14px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.6)', fontSize: '13px', fontWeight: 600 }}>Bpifrance Diag IA</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Prix',             '129€/mois',   '5 000€+/mission', '7 500€'],
                  ['Délai résultats',  '20 minutes',  '3 mois',          '8 jours'],
                  ['Adapté Afrique',   '✅',          '❌',              '❌'],
                  ['Suivi hebdo',      '✅',          '❌',              '❌'],
                  ['Sans engagement',  '✅',          '❌',              '❌'],
                ].map(([label, nexalie, cabinet, bpi], i) => (
                  <tr key={label} style={{ background: i % 2 === 0 ? '#fff' : '#F8F9FA', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 600, color: '#374151' }}>{label}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', fontWeight: 700, color: accentText, background: `${accent}06` }}>
                      {nexalie === '✅' ? <CheckCircle2 size={18} color="#2D6A4F" style={{ margin: '0 auto' }} /> : nexalie === '❌' ? <XCircle size={18} color="#9CA3AF" style={{ margin: '0 auto' }} /> : nexalie}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                      {cabinet === '✅' ? <CheckCircle2 size={18} color="#2D6A4F" style={{ margin: '0 auto' }} /> : cabinet === '❌' ? <XCircle size={18} color="#9CA3AF" style={{ margin: '0 auto' }} /> : cabinet}
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: '#9CA3AF' }}>
                      {bpi === '✅' ? <CheckCircle2 size={18} color="#2D6A4F" style={{ margin: '0 auto' }} /> : bpi === '❌' ? <XCircle size={18} color="#9CA3AF" style={{ margin: '0 auto' }} /> : bpi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: '#F8F9FA', padding: '60px 24px' }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 300, color: navy, marginBottom: '32px' }}>Questions fréquentes</h2>
          {[
            { q: 'Puis-je annuler à tout moment ?', r: "Oui, sans engagement. Votre accès reste actif jusqu'à la fin de la période." },
            { q: isAfrica ? 'Quels modes de paiement ?' : 'Quels moyens de paiement ?', r: isAfrica ? 'Mobile Money (Orange Money, MTN MoMo, Wave), carte bancaire, virement.' : 'Carte bancaire (Visa, Mastercard), virement SEPA.' },
            { q: 'Y a-t-il un engagement minimum ?', r: 'Aucun sur les plans mensuels. Plans annuels : 12 mois, résiliable avec 30 jours de préavis.' },
          ].map(({ q, r }) => (
            <div key={q} style={{ marginBottom: '16px', textAlign: 'left', background: '#fff', borderRadius: '12px', padding: '20px 24px', border: '1px solid rgba(0,0,0,0.07)' }}>
              <p style={{ fontWeight: 700, color: navy, marginBottom: '8px', fontSize: '15px' }}>{q}</p>
              <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7 }}>{r}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── RGPD & Sécurité ───────────────────────────────────────── */}
      <section style={{ background: '#F8F9FA', padding: '64px 24px', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: '#9CA3AF', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Sécurité &amp; Souveraineté</p>
          <h2 style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 'clamp(20px,2.5vw,28px)', fontWeight: 300, color: navy, textAlign: 'center', marginBottom: '40px' }}>
            Vos données restent les vôtres. Point.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              {
                label: 'HÉBERGEMENT UE',
                title: 'Infrastructure souveraine',
                body: 'Toutes les données de vos entreprises clientes sont hébergées en Union Européenne. Aucun transfert hors UE. Conforme au règlement RGPD (Règlement 2016/679).',
                color: '#2D6A4F',
              },
              {
                label: 'DONNÉES PROTÉGÉES',
                title: 'Zéro revente, zéro partage',
                body: "Chez Nexalie, vos informations stratégiques d'entreprise — audit, roadmap, documents — ne sont jamais vendues, partagées ni utilisées à des fins publicitaires.",
                color: isAfrica ? '#C45E0A' : '#4EC9B0',
              },
              {
                label: 'CONFORMITÉ RGPD',
                title: 'Droit à l\'effacement garanti',
                body: 'Suppression de compte complète sur simple demande. Export de toutes vos données à tout moment. Responsable de traitement identifié et joignable sous 72h.',
                color: '#7B5EA7',
              },
            ].map(({ label, title, body, color }) => (
              <div key={label} style={{ padding: '28px', background: '#fff', borderRadius: '14px', border: '1px solid rgba(0,0,0,0.06)', borderLeft: `3px solid ${color}`, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', letterSpacing: '2px', color, marginBottom: '10px', textTransform: 'uppercase' }}>{label}</p>
                <p style={{ fontSize: '14px', fontWeight: 700, color: navy, marginBottom: '10px' }}>{title}</p>
                <p style={{ fontSize: '13px', color: '#6B7A94', lineHeight: 1.75 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '60px 24px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 300, color: navy, marginBottom: '12px' }}>
          Commencez votre transformation avec Nexalie
        </h2>
        <p style={{ fontSize: '16px', color: '#6B7A94', marginBottom: '28px' }}>Audit gratuit en 20 minutes — pas de carte requise.</p>
        <Link href="/signup" style={{ display: 'inline-block', padding: '16px 48px', background: accent, color: '#fff', borderRadius: '12px', textDecoration: 'none', fontWeight: 700, fontSize: '16px' }}>
          Créer mon compte gratuit
        </Link>
      </section>

    </div>
  );
}
