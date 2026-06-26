'use client';

import { useState } from 'react';
import Link from 'next/link';

const T = {
  pageBg:       'var(--nx-section-bg)',
  sectionBg:    '#fff',
  navyBg:       'var(--nx-bg)',
  textPrimary:  'var(--nx-section-text)',
  textSecondary: '#4B5563',
  textOnNavy:   'var(--nx-text)',
  textMuted:    'rgba(245,240,232,.55)',
  accent:       'var(--nx-accent)',
  gold:         'var(--nx-accent)',
  border:       'rgba(0,0,0,0.07)',
};

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '', market: 'fr' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Remplissez tous les champs obligatoires.'); return; }
    setLoading(true);
    // Ouvre WhatsApp avec le message pré-rempli
    const msg = encodeURIComponent(`Bonjour Relia,\n\nNom: ${form.name}\nEmail: ${form.email}\nSujet: ${form.subject}\nMarché: ${form.market === 'fr' ? 'France' : 'Afrique'}\n\n${form.message}`);
    window.open(`https://wa.me/33632407737?text=${msg}`, '_blank');
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', fontFamily: 'var(--font-jakarta, sans-serif)' }}>

      {/* Header */}
      <div style={{ background: T.navyBg, padding: 'clamp(48px,7vw,80px) 24px' }}>
        <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,var(--nx-accent)30,transparent)`, marginBottom: '36px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '3px', color: 'rgba(201,162,75,.6)', marginBottom: '12px', textTransform: 'uppercase' }}>Contact</p>
          <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(28px,4.5vw,44px)', fontWeight: 300, color: T.textOnNavy, marginBottom: '12px', lineHeight: 1.2 }}>
            Parlons de <em style={{ color: T.accent, fontStyle: 'italic' }}>votre entreprise</em>
          </h1>
          <p style={{ fontSize: '15px', color: T.textMuted, lineHeight: 1.7 }}>Réponse personnelle sous 24h · WhatsApp prioritaire</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: 'clamp(40px,5vw,64px) 24px', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '60px' }}>

          {/* Infos */}
          <div>
            {[
              ['✉️', 'Email', 'relia@rebiyadigital.com', 'mailto:relia@rebiyadigital.com'],
              ['📱', 'WhatsApp', '+33 6 32 40 77 37', 'https://wa.me/33632407737'],
              ['🌐', 'Site', 'nexalie.co', 'https://nexalie.co'],
              ['📍', 'Zones', 'France · Côte d\'Ivoire · Congo', null],
            ].map(([e, l, v, href]) => (
              <div key={l} style={{ padding: '14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', marginBottom: '10px' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '4px' }}>{e} {l.toUpperCase()}</p>
                {href ? (
                  <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'noreferrer' : undefined} style={{ fontSize: '14px', color: T.accent, textDecoration: 'none' }}>{v}</a>
                ) : (
                  <p style={{ fontSize: '14px', color: T.accent }}>{v}</p>
                )}
              </div>
            ))}
            <a href="https://wa.me/33632407737" target="_blank" rel="noreferrer"
              style={{ display: 'block', marginTop: '8px', padding: '13px', background: '#25D366', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>
              💬 WhatsApp Business direct
            </a>

            {/* Délais */}
            <div style={{ marginTop: '20px', padding: '16px', background: T.sectionBg, border: `1px solid ${T.border}`, borderRadius: '10px' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', color: T.textSecondary, marginBottom: '10px' }}>DÉLAIS DE RÉPONSE</p>
              {[['WhatsApp', 'Quelques heures'], ['Email', '< 24h'], ['Devis', '< 48h']].map(([ch, d]) => (
                <div key={ch} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', color: T.textSecondary }}>{ch}</span>
                  <span style={{ fontSize: '12px', color: T.accent, fontWeight: 600 }}>{d}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          {sent ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', padding: '60px 40px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '16px', textAlign: 'center' }}>
              <span style={{ fontSize: '48px', marginBottom: '20px' }}>✅</span>
              <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '22px', fontWeight: 200, color: T.textPrimary, marginBottom: '8px' }}>Message envoyé !</h2>
              <p style={{ fontSize: '14px', color: T.textSecondary, marginBottom: '20px' }}>WhatsApp ouvert avec votre message pré-rempli. Réponse sous 24h.</p>
              <button onClick={() => setSent(false)} style={{ padding: '11px 24px', background: T.navyBg, border: 'none', borderRadius: '8px', color: T.textOnNavy, fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                Envoyer un autre message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {[['Nom complet *', 'name', 'text', 'Votre nom'],
                  ['Email *', 'email', 'email', 'votre@email.com']].map(([label, key, type, ph]) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>{label.toUpperCase()}</label>
                    <input type={type} value={form[key]} onChange={e => set(key, e.target.value)} placeholder={ph}
                      style={{ width: '100%', padding: '11px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textPrimary, fontSize: '13px' }} />
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>SUJET</label>
                  <input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Votre demande en quelques mots"
                    style={{ width: '100%', padding: '11px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textPrimary, fontSize: '13px' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>VOTRE MARCHÉ</label>
                  <select value={form.market} onChange={e => set('market', e.target.value)}
                    style={{ width: '100%', padding: '11px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textPrimary, fontSize: '13px', cursor: 'pointer' }}>
                    <option value="fr">🇫🇷 France</option>
                    <option value="af">🌍 Afrique</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>MESSAGE *</label>
                <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={5} placeholder="Décrivez votre projet, vos besoins, vos questions..."
                  style={{ width: '100%', padding: '11px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '8px', color: T.textPrimary, fontSize: '13px', resize: 'vertical' }} />
              </div>

              {error && <p style={{ fontSize: '13px', color: '#C0627A' }}>⚠️ {error}</p>}

              <button type="submit" disabled={loading}
                style={{ padding: '13px', background: T.navyBg, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>
                {loading ? 'Envoi...' : 'Envoyer le message →'}
              </button>
              <p style={{ fontSize: '11px', color: T.textSecondary }}>Votre message s'ouvrira dans WhatsApp avec le contenu pré-rempli.</p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
