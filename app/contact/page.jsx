'use client';

import { useState } from 'react';
import Link from 'next/link';

const T = {
  pageBg: '#FFFFFF', sectionBg: '#F8FAFC', navyBg: '#0A1628',
  textPrimary: '#0A1628', textSecondary: '#6B7A94', textOnNavy: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)', accent: '#2E9B8B', gold: '#C9A84C',
  border: 'rgba(0,0,0,0.07)',
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
    window.open(`https://wa.me/33786620409?text=${msg}`, '_blank');
    setSent(true);
    setLoading(false);
  };

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', fontFamily: 'sans-serif' }}>

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
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textMuted, marginBottom: '10px' }}>CONTACT</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 200, color: '#fff', marginBottom: '10px' }}>
            Parlons de <em style={{ color: T.accent, fontStyle: 'normal' }}>votre projet</em>
          </h1>
          <p style={{ fontSize: '15px', color: T.textMuted }}>Réponse garantie sous 24h · WhatsApp disponible</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '60px 40px', animation: 'fadeIn 0.4s ease' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '60px' }}>

          {/* Infos */}
          <div>
            {[['✉️', 'Email', 'relia.ebiya@nexalie.co'],
              ['📱', 'WhatsApp', '+33 7 86 62 04 09'],
              ['🌐', 'Site', 'nexalie.co'],
              ['📍', 'Zones', 'France · Côte d\'Ivoire · Congo']].map(([e, l, v]) => (
              <div key={l} style={{ padding: '14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', marginBottom: '10px' }}>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '4px' }}>{e} {l.toUpperCase()}</p>
                <p style={{ fontSize: '14px', color: T.accent }}>{v}</p>
              </div>
            ))}
            <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer"
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
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 200, color: T.textPrimary, marginBottom: '8px' }}>Message envoyé !</h2>
              <p style={{ fontSize: '14px', color: T.textSecondary, marginBottom: '20px' }}>WhatsApp ouvert avec votre message pré-rempli. Réponse sous 24h.</p>
              <button onClick={() => setSent(false)} style={{ padding: '11px 24px', background: T.navyBg, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
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
