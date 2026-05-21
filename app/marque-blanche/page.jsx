'use client';

import { useState } from 'react';

const NAVY = '#0A1628';
const TEAL = '#4EC9B0';
const TERRA = '#E88C32';

const USE_CASES = [
  {
    icon: '🏦',
    who: 'Banques & Institutions Financières',
    title: 'Offrez l\'audit digital à vos PME clientes',
    desc: 'Intégrez la plateforme Nexalie sous votre marque pour accompagner vos clients entreprises dans leur transformation digitale. Générez des leads qualifiés et renforcez votre offre conseil.',
    examples: ['Audit digital offert avec l\'ouverture de compte pro', 'Tableau de bord banquier pour suivre la progression des clients', 'Rapport PDF à votre logo envoyé automatiquement'],
    color: '#3B82F6',
  },
  {
    icon: '🏛️',
    who: 'Chambres de Commerce & Fédérations',
    title: 'Mesurez le niveau digital de vos membres',
    desc: 'Déployez l\'audit de maturité à l\'échelle de votre réseau. Produisez des baromètres sectoriels, identifiez les entreprises à accompagner en priorité, valorisez votre offre de formation.',
    examples: ['Baromètre digital annuel de votre territoire', 'Segmentation des membres par niveau de maturité', 'Programme d\'accompagnement ciblé sur les plus faibles'],
    color: '#8B5CF6',
  },
  {
    icon: '🏛️',
    who: 'Ministères & Agences Gouvernementales',
    title: 'Pilotez la digitalisation des PME de votre pays',
    desc: 'Une plateforme nationale de diagnostic digital pour les PME. Données agrégées par secteur et région, tableau de bord ministériel, export des indicateurs pour les rapports officiels.',
    examples: ['Portail national de diagnostic digital PME', 'Indicateurs agrégés par région et secteur d\'activité', 'Rapports officiels prêts à l\'emploi pour les bailleurs de fonds'],
    color: '#10B981',
  },
];

const LICENSES = [
  {
    name: 'Essentiel',
    price_fr: '3 500',
    price_af: '2 300 000',
    currency_fr: '€/mois',
    currency_af: 'FCFA/mois',
    users: 'Jusqu\'à 500 utilisateurs/mois',
    features: ['Votre logo + couleurs', 'Audit personnalisé (5 dimensions)', 'Rapports PDF à votre marque', 'Dashboard administrateur', 'Support email 48h'],
    highlight: false,
  },
  {
    name: 'Professionnel',
    price_fr: '7 500',
    price_af: '4 900 000',
    currency_fr: '€/mois',
    currency_af: 'FCFA/mois',
    users: 'Jusqu\'à 2 000 utilisateurs/mois',
    features: ['Tout Essentiel +', 'Domaine personnalisé (votreplateforme.com)', 'API d\'intégration complète', 'Benchmarks sectoriels personnalisés', 'Séquences email à votre marque', 'Support prioritaire 24h', 'Formation équipe incluse'],
    highlight: true,
  },
  {
    name: 'Entreprise',
    price_fr: 'Sur devis',
    price_af: 'Sur devis',
    currency_fr: '',
    currency_af: '',
    users: 'Utilisateurs illimités',
    features: ['Tout Professionnel +', 'Hébergement dédié (cloud souverain possible)', 'Développements spécifiques', 'Intégration SI existant', 'SLA garanti 99,9%', 'Account manager dédié', 'Contrat pluriannuel'],
    highlight: false,
  },
];

const PROCESS = [
  { num: '01', title: 'Appel de découverte', desc: 'Nous échangeons sur votre contexte, vos utilisateurs cibles et vos objectifs. 30 minutes suffisent pour valider la pertinence.' },
  { num: '02', title: 'Personnalisation & Test', desc: 'Nous intégrons votre charte graphique et configurons les modules dont vous avez besoin. Vous testez pendant 2 semaines.' },
  { num: '03', title: 'Déploiement & Formation', desc: 'Mise en production sur votre domaine. Formation de votre équipe administrateur. Support au lancement inclus.' },
];

export default function MarqueBlanchePage() {
  const [form, setForm] = useState({ nom: '', organisation: '', email: '', pays: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [market, setMarket] = useState('fr');
  const isAf = market === 'af';
  const accent = isAf ? TERRA : TEAL;

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, source: 'marque-blanche' }),
      });
      if (!res.ok) throw new Error('Erreur serveur');
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSending(false);
    }
  }

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: NAVY }}>

      {/* HERO */}
      <section style={{ background: NAVY, padding: 'clamp(60px,8vw,100px) 24px', textAlign: 'center', color: '#fff' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '16px' }}>
            Solution B2B · Marque Blanche
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 300, lineHeight: 1.2, marginBottom: '20px' }}>
            Déployez Nexalie<br />sous votre marque
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '17px', lineHeight: 1.7, marginBottom: '36px' }}>
            Votre logo, vos couleurs, votre domaine. La puissance de la plateforme Nexalie déployée pour vos clients, membres ou agents.
          </p>

          {/* Toggle marché */}
          <div style={{ display: 'inline-flex', background: 'rgba(255,255,255,0.08)', borderRadius: '12px', padding: '4px', marginBottom: '28px' }}>
            {[['fr', '🇫🇷 France'], ['af', '🌍 Afrique']].map(([m, label]) => (
              <button key={m} onClick={() => setMarket(m)} style={{
                padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
                background: market === m ? accent : 'transparent',
                color: market === m ? '#fff' : 'rgba(255,255,255,0.5)',
                transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#contact" style={{ background: accent, color: '#fff', padding: '14px 32px', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Demander une démo →
            </a>
            <a href="#tarifs" style={{ border: '1.5px solid rgba(255,255,255,0.25)', color: '#fff', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px' }}>
              Voir les tarifs
            </a>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGE FICTIF */}
      <section style={{ background: '#F8FAFC', padding: '48px 24px' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '18px', fontStyle: 'italic', color: NAVY, lineHeight: 1.7, marginBottom: '16px' }}>
            "Nous avons déployé la plateforme Nexalie pour accompagner nos PME clientes dans leur digitalisation. En 3 mois, 240 audits réalisés, et un NPS en hausse de 18 points sur notre offre conseil."
          </p>
          <p style={{ fontSize: '13px', color: '#6B7A94' }}>
            <strong>Directeur Digital</strong> · Banque régionale Afrique de l'Ouest (témoignage illustratif)
          </p>
        </div>
      </section>

      {/* CAS D'USAGE */}
      <section style={{ padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>Cas d'usage</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '48px' }}>
            Pour qui ?
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px,1fr))', gap: '24px' }}>
            {USE_CASES.map((uc) => (
              <div key={uc.who} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <span style={{ fontSize: '36px' }}>{uc.icon}</span>
                <p style={{ fontSize: '11px', fontWeight: 700, color: uc.color, textTransform: 'uppercase', letterSpacing: '1px' }}>{uc.who}</p>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: NAVY, lineHeight: 1.3 }}>{uc.title}</h3>
                <p style={{ fontSize: '13px', color: '#6B7A94', lineHeight: 1.7 }}>{uc.desc}</p>
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {uc.examples.map((ex) => (
                    <li key={ex} style={{ fontSize: '12px', color: NAVY, display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                      <span style={{ color: accent, flexShrink: 0 }}>✓</span> {ex}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESSUS */}
      <section style={{ background: '#F8FAFC', padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '48px' }}>
            3 étapes pour démarrer
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
            {PROCESS.map((step) => (
              <div key={step.num} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '36px', fontWeight: 800, color: accent, lineHeight: 1, flexShrink: 0, width: '50px' }}>{step.num}</span>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: NAVY, marginBottom: '6px' }}>{step.title}</h3>
                  <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TARIFS */}
      <section id="tarifs" style={{ padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>Licences</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '48px' }}>
            Tarifs transparents
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px,1fr))', gap: '20px' }}>
            {LICENSES.map((lic) => (
              <div key={lic.name} style={{
                background: lic.highlight ? NAVY : '#fff',
                border: lic.highlight ? 'none' : '1.5px solid rgba(0,0,0,0.07)',
                borderRadius: '16px', padding: '28px',
                display: 'flex', flexDirection: 'column', gap: '16px',
                position: 'relative',
              }}>
                {lic.highlight && (
                  <span style={{ position: 'absolute', top: '16px', right: '16px', background: accent, color: '#fff', fontSize: '10px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px' }}>
                    RECOMMANDÉ
                  </span>
                )}
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: lic.highlight ? 'rgba(255,255,255,0.5)' : '#6B7A94', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{lic.name}</p>
                  <p style={{ fontSize: '32px', fontWeight: 800, color: lic.highlight ? '#fff' : NAVY, lineHeight: 1 }}>
                    {isAf ? lic.price_af : lic.price_fr}
                    <span style={{ fontSize: '14px', fontWeight: 400, color: lic.highlight ? 'rgba(255,255,255,0.5)' : '#6B7A94', marginLeft: '4px' }}>
                      {isAf ? lic.currency_af : lic.currency_fr}
                    </span>
                  </p>
                  <p style={{ fontSize: '12px', color: lic.highlight ? 'rgba(255,255,255,0.5)' : '#6B7A94', marginTop: '4px' }}>{lic.users}</p>
                </div>
                <ul style={{ paddingLeft: 0, listStyle: 'none', margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lic.features.map((f) => (
                    <li key={f} style={{ fontSize: '13px', color: lic.highlight ? 'rgba(255,255,255,0.8)' : NAVY, display: 'flex', gap: '8px' }}>
                      <span style={{ color: accent }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <a href="#contact" style={{
                  marginTop: 'auto', display: 'block', textAlign: 'center', padding: '12px', borderRadius: '10px',
                  background: lic.highlight ? accent : 'transparent',
                  border: lic.highlight ? 'none' : `1.5px solid ${accent}`,
                  color: lic.highlight ? '#fff' : accent,
                  fontWeight: 700, fontSize: '13px', textDecoration: 'none',
                }}>
                  Demander un devis →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULAIRE CONTACT */}
      <section id="contact" style={{ background: '#F8FAFC', padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', textAlign: 'center', marginBottom: '12px' }}>Contact</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,36px)', fontWeight: 300, textAlign: 'center', marginBottom: '32px' }}>
            Parlons de votre projet
          </h2>

          {submitted ? (
            <div style={{ background: '#fff', border: `2px solid ${accent}`, borderRadius: '16px', padding: '40px', textAlign: 'center' }}>
              <span style={{ fontSize: '48px' }}>✓</span>
              <p style={{ fontSize: '18px', fontWeight: 700, color: NAVY, margin: '16px 0 8px' }}>Message envoyé !</p>
              <p style={{ fontSize: '14px', color: '#6B7A94' }}>Rélia vous répondra sous 24h ouvrées.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { field: 'nom', label: 'Votre nom *', type: 'text', placeholder: 'Prénom Nom' },
                { field: 'organisation', label: 'Organisation *', type: 'text', placeholder: 'Banque XYZ / Ministère du Commerce...' },
                { field: 'email', label: 'Email professionnel *', type: 'email', placeholder: 'vous@organisation.com' },
                { field: 'pays', label: 'Pays / Région', type: 'text', placeholder: 'Congo, Côte d\'Ivoire, France...' },
              ].map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    required={label.includes('*')}
                    value={form[field]}
                    onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                    style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>Votre projet (optionnel)</label>
                <textarea
                  placeholder="Décrivez rapidement votre contexte et vos objectifs..."
                  value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  rows={4}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '14px', outline: 'none', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                style={{ background: accent, color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: sending ? 'default' : 'pointer', opacity: sending ? 0.7 : 1 }}
              >
                {sending ? 'Envoi...' : 'Envoyer ma demande →'}
              </button>
              <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
                Réponse sous 24h · relia.ebiya@gmail.com
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
