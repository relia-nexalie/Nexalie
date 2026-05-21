// ARCHIVE — Version standalone mise à jour (prix 2026)
// La version App Router est dans app/pricing/page.jsx
// Ce fichier est conservé comme référence de design standalone.

'use client';
import { useState } from 'react';

const PLANS_FR = [
  { id: 'free', name: 'Gratuit', monthly: 0, annual: 0, highlight: false,
    features: ['1 audit de maturité', '3 ressources', 'Nexalie OS 5 msgs/jour', 'Rapport PDF basique'],
    limitations: ['Pas de Roadmap Builder', 'Pas de certification'], cta: 'Commencer', ctaHref: '/signup' },
  { id: 'starter', name: 'Starter', monthly: 59, annual: 590, highlight: false,
    features: ['3 audits/mois', 'Rapport PDF complet', 'Nexalie OS illimité', '10 ressources', 'Email suivi'],
    limitations: ['Roadmap non inclus', 'Certification non incluse'], cta: 'Démarrer', ctaHref: '/signup?plan=starter' },
  { id: 'pro', name: 'Pro', monthly: 129, annual: 1290, highlight: true,
    features: ['Audits illimités', 'Roadmap Builder IA', 'Nexalie OS illimité', 'Toutes ressources', 'Progression + benchmarks', 'Badge Digital Ready', 'Rapport premium', 'Support prioritaire'],
    limitations: [], cta: 'Passer Pro', ctaHref: '/signup?plan=pro' },
  { id: 'institutions', name: 'Institutions', monthly: 490, annual: 4900, highlight: false,
    features: ['Tout le plan Pro', 'Multi-utilisateurs x5', 'Dashboard consolidé', 'Formation incluse', 'Rapport institutionnel', 'SLA garanti'],
    limitations: [], cta: 'Contacter', ctaHref: '/contact?plan=institutions' },
];

const PLANS_AF = [
  { id: 'free', name: 'Gratuit', monthly: 0, annual: 0, highlight: false,
    features: ['1 Bilan Numérique', '3 ressources', 'Nexalie OS 5 msgs/jour', 'Rapport PDF basique'],
    limitations: ["Pas de Plan d'Action", 'Pas de certification'], cta: 'Commencer', ctaHref: '/signup' },
  { id: 'starter', name: 'Starter', monthly: 39000, annual: 390000, highlight: false,
    features: ['3 bilans/mois', 'Rapport PDF complet', 'Nexalie OS illimité', '10 ressources', 'Guides OHADA'],
    limitations: ["Plan d'Action non inclus", 'Certification non incluse'], cta: 'Démarrer', ctaHref: '/signup?plan=starter' },
  { id: 'pro', name: 'Pro', monthly: 85000, annual: 850000, highlight: true,
    features: ['Bilans illimités', "Plan d'Action Digital IA", 'Nexalie OS illimité', 'Toutes ressources', 'Mobile Money + OHADA', 'Suivi progression', 'Badge Digital Ready', 'Support WhatsApp'],
    limitations: [], cta: 'Passer Pro', ctaHref: '/signup?plan=pro' },
  { id: 'institutions', name: 'Institutions', monthly: 320000, annual: 3200000, highlight: false,
    features: ['Tout le plan Pro', 'Multi-utilisateurs x5', 'Dashboard consolidé', 'Formation incluse', 'Rapport institutionnel', 'Mobile Money accepté'],
    limitations: [], cta: 'Contacter', ctaHref: '/contact?plan=institutions' },
];

const WB_FR = [
  { name: 'Starter', monthly: 3500, desc: "Jusqu'a 20 clients, votre logo, domaine perso" },
  { name: 'Business', monthly: 7500, desc: "Jusqu'a 100 clients, API complete, support dedie" },
  { name: 'Enterprise', monthly: 15000, desc: 'Illimite, SLA 99,9%, sur-mesure' },
];

const WB_AF = [
  { name: 'Starter', monthly: 2300000, desc: "Jusqu'a 20 clients, votre logo, domaine perso" },
  { name: 'Business', monthly: 4900000, desc: "Jusqu'a 100 clients, API complete, support dedie" },
  { name: 'Enterprise', monthly: 9800000, desc: 'Illimite, SLA 99,9%, sur-mesure' },
];

const CONCURRENTS = [
  { name: 'McKinsey Digital', prix: '50 000€+', probleme: 'Grandes entreprises uniquement' },
  { name: 'Consultant freelance', prix: '800-1 200€/jour', probleme: 'Trop cher, pas scalable' },
  { name: 'Gartner', prix: '20 000€/an', probleme: 'Anglophone, pas adapte' },
  { name: 'Nexalie Pro', prix: '129€/mois', probleme: 'Meme valeur, 100x moins cher', isNexali: true },
];

function fmt(n, cur) {
  if (n === 0) return 'Gratuit';
  if (cur === 'FCFA') return `${n.toLocaleString('fr-FR')} FCFA`;
  return `${n.toLocaleString('fr-FR')} EUR`;
}

export default function NexaliPricing({ mode = 'fr' }) {
  const [billing, setBilling] = useState('monthly');
  const isAf = mode === 'af';
  const plans = isAf ? PLANS_AF : PLANS_FR;
  const wb = isAf ? WB_AF : WB_FR;
  const cur = isAf ? 'FCFA' : 'EUR';
  const accent = isAf ? '#E88C32' : '#4EC9B0';
  const navy = isAf ? '#1A0800' : '#0A1628';
  const gold = isAf ? '#F5C842' : '#C9A84C';

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#fff' }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; }`}</style>

      {/* Hero */}
      <section style={{ background: navy, color: '#fff', padding: '80px 24px 60px', textAlign: 'center' }}>
        <p style={{ fontSize: '12px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '16px' }}>Tarifs</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,56px)', fontWeight: 300, marginBottom: '16px' }}>
          {isAf ? 'Des prix adaptes a l Afrique' : 'Une tarification transparente'}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.7 }}>
          {isAf ? 'Mobile Money accepte. En FCFA. Concu pour vos realites.' : 'Pas de frais caches. Annulez a tout moment.'}
        </p>

        <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', gap: '4px' }}>
          {['monthly', 'annual'].map(b => (
            <button key={b} onClick={() => setBilling(b)} style={{
              padding: '10px 24px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '14px', fontWeight: 600,
              background: billing === b ? '#fff' : 'transparent',
              color: billing === b ? navy : 'rgba(255,255,255,0.65)',
            }}>
              {b === 'monthly' ? 'Mensuel' : 'Annuel'}
              {b === 'annual' && <span style={{ marginLeft: '8px', fontSize: '11px', background: gold, color: navy, padding: '2px 7px', borderRadius: '20px', fontWeight: 700 }}> 2 mois offerts</span>}
            </button>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px,1fr))', gap: '20px' }}>
          {plans.map(plan => {
            const perMonth = billing === 'annual' && plan.annual > 0 ? Math.round(plan.annual / 12) : plan.monthly;
            return (
              <div key={plan.id} style={{ border: `2px solid ${plan.highlight ? accent : 'rgba(0,0,0,0.08)'}`, borderRadius: '16px', padding: '28px 24px', position: 'relative', background: plan.highlight ? `${accent}08` : '#fff' }}>
                {plan.highlight && (
                  <div style={{ position: 'absolute', top: '-13px', left: '50%', transform: 'translateX(-50%)', background: accent, color: '#fff', fontSize: '11px', fontWeight: 700, padding: '4px 16px', borderRadius: '20px', textTransform: 'uppercase' }}>
                    Le plus populaire
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: navy, marginBottom: '4px' }}>{plan.name}</h3>
                <div style={{ fontSize: '36px', fontWeight: 800, color: navy, margin: '16px 0' }}>
                  {plan.monthly === 0 ? 'Gratuit' : <>{fmt(perMonth, cur)}<span style={{ fontSize: '14px', color: '#6B7A94', fontWeight: 400 }}>/mois</span></>}
                </div>
                {billing === 'annual' && plan.annual > 0 && (
                  <p style={{ fontSize: '12px', color: accent, marginBottom: '16px' }}>Facture {fmt(plan.annual, cur)}/an</p>
                )}
                <a href={plan.ctaHref} style={{ display: 'block', padding: '12px', borderRadius: '10px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '14px', background: plan.highlight ? accent : 'transparent', color: plan.highlight ? '#fff' : navy, border: plan.highlight ? 'none' : `2px solid ${navy}`, marginBottom: '24px' }}>
                  {plan.cta}
                </a>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', gap: '8px', marginBottom: '7px', fontSize: '13px', color: '#374151' }}>
                    <span style={{ color: accent, fontWeight: 700 }}>V</span>{f}
                  </div>
                ))}
                {plan.limitations.map(l => (
                  <div key={l} style={{ display: 'flex', gap: '8px', marginBottom: '7px', fontSize: '13px', color: '#9CA3AF' }}>
                    <span>X</span>{l}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </section>

      {/* Marque Blanche */}
      <section style={{ background: navy, padding: '60px 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '10px' }}>Marque Blanche</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 300, color: '#fff', marginBottom: '40px' }}>
            Revendez Nexalie sous votre marque
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '16px', marginBottom: '32px' }}>
            {wb.map((t, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '24px' }}>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#fff', marginBottom: '8px' }}>{t.name}</h3>
                <div style={{ fontSize: '26px', fontWeight: 800, color: gold, marginBottom: '8px' }}>{fmt(t.monthly, cur)}<span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mois</span></div>
                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>{t.desc}</p>
              </div>
            ))}
          </div>
          <a href="/contact?plan=whitelabel" style={{ display: 'inline-block', padding: '14px 36px', background: accent, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700 }}>
            Discuter de la marque blanche
          </a>
        </div>
      </section>

      {/* Benchmark concurrents */}
      <section style={{ maxWidth: '780px', margin: '0 auto', padding: '60px 24px' }}>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,36px)', fontWeight: 300, color: navy, textAlign: 'center', marginBottom: '36px' }}>
          Nexalie vs. les alternatives
        </h2>
        <div style={{ borderRadius: '14px', overflow: 'hidden', border: '1.5px solid rgba(0,0,0,0.08)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Solution', 'Prix', 'Limite'].map(h => (
                  <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontWeight: 700, color: navy, borderBottom: '1.5px solid rgba(0,0,0,0.07)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CONCURRENTS.map((c, i) => (
                <tr key={i} style={{ background: c.isNexali ? `${accent}0A` : i % 2 === 0 ? '#fff' : '#FAFAFA' }}>
                  <td style={{ padding: '14px 20px', fontWeight: c.isNexali ? 800 : 500, color: c.isNexali ? accent : navy, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{c.name}</td>
                  <td style={{ padding: '14px 20px', color: c.isNexali ? accent : '#374151', fontWeight: c.isNexali ? 700 : 400, borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{c.prix}</td>
                  <td style={{ padding: '14px 20px', color: c.isNexali ? '#059669' : '#6B7A94', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>{c.probleme}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
