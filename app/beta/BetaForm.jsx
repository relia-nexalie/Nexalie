'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const TEAL = '#4EC9B0';
const NAVY = '#0A1628';

export default function BetaForm({ remaining }) {
  const [form, setForm] = useState({ nom: '', email: '', entreprise: '', pays: '', secteur: '', taille: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError('');

    try {
      const supabase = createClient();

      // Sauvegarder dans la table clients
      const { error: dbError } = await supabase.from('clients').insert({
        nom: form.nom,
        entreprise: form.entreprise,
        pays: form.pays,
        secteur: form.secteur,
        pack: 'beta',
        mode: ['fr', 'france'].includes(form.pays?.toLowerCase()) ? 'fr' : 'af',
        status: 'prospect',
        notes: `Taille: ${form.taille}. Message: ${form.message}`,
      });

      if (dbError) throw new Error(dbError.message);

      // Email de confirmation bêta-testeur + notification Rélia
      fetch('/api/email/beta-confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nom: form.nom, email: form.email, entreprise: form.entreprise, remaining }),
      }).catch(() => {});

      setSubmitted(true);
    } catch (err) {
      setError('Une erreur est survenue. Envoyez directement un email à relia.ebiya@gmail.com');
    } finally {
      setSending(false);
    }
  }

  if (submitted) {
    return (
      <div style={{ background: '#fff', border: `2px solid ${TEAL}`, borderRadius: '16px', padding: '48px 32px', textAlign: 'center' }}>
        <div style={{ fontSize: '52px', marginBottom: '16px' }}>🎉</div>
        <h3 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, marginBottom: '10px' }}>
          {remaining > 0 ? 'Place réservée !' : 'Inscrit sur liste d\'attente !'}
        </h3>
        <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7, marginBottom: '8px' }}>
          {remaining > 0
            ? 'Vous recevrez un email de confirmation dans les prochaines minutes. Rélia vous contactera sous 24h pour planifier votre session d\'onboarding.'
            : 'Nous vous contacterons en priorité dès qu\'une place se libère.'}
        </p>
        <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Vérifiez vos spams si vous ne voyez pas l'email.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {[
          { field: 'nom',       label: 'Nom complet *',   type: 'text',  placeholder: 'Prénom Nom',      full: false },
          { field: 'email',     label: 'Email *',         type: 'email', placeholder: 'vous@email.com',   full: false },
          { field: 'entreprise',label: 'Entreprise *',    type: 'text',  placeholder: 'Nom de votre entreprise', full: false },
          { field: 'pays',      label: 'Pays *',          type: 'text',  placeholder: 'France, Côte d\'Ivoire...', full: false },
        ].map(({ field, label, type, placeholder }) => (
          <div key={field}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>{label}</label>
            <input
              type={type}
              placeholder={placeholder}
              required={label.includes('*')}
              value={form[field]}
              onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
              style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>Secteur</label>
          <select
            value={form.secteur}
            onChange={e => setForm(f => ({ ...f, secteur: e.target.value }))}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">— Sélectionner —</option>
            {['Commerce', 'Santé', 'Finance & Banque', 'Administration', 'BTP', 'Agriculture', 'Télécommunications', 'Conseil & Services', 'Industrie', 'Éducation', 'Autre'].map(s => (
              <option key={s} value={s.toLowerCase()}>{s}</option>
            ))}
          </select>
        </div>
        <div>
          <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>Taille</label>
          <select
            value={form.taille}
            onChange={e => setForm(f => ({ ...f, taille: e.target.value }))}
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', background: '#fff', boxSizing: 'border-box' }}
          >
            <option value="">— Sélectionner —</option>
            {['1–5 salariés', '6–20 salariés', '21–50 salariés', '51–200 salariés', '200+ salariés'].map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label style={{ fontSize: '13px', fontWeight: 600, color: NAVY, display: 'block', marginBottom: '6px' }}>Pourquoi rejoindre le programme beta ? (optionnel)</label>
        <textarea
          placeholder="Votre projet digital, vos enjeux actuels, ce que vous attendez de Nexalie..."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          rows={3}
          style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid rgba(0,0,0,0.12)', fontSize: '13px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
        />
      </div>

      {error && (
        <p style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: '#991B1B', borderRadius: '8px', padding: '12px', fontSize: '13px' }}>{error}</p>
      )}

      <button
        type="submit"
        disabled={sending}
        style={{ background: TEAL, color: '#fff', border: 'none', padding: '14px', borderRadius: '10px', fontWeight: 700, fontSize: '15px', cursor: sending ? 'default' : 'pointer', opacity: sending ? 0.7 : 1, transition: 'opacity 0.2s' }}
      >
        {sending ? 'Envoi en cours...' : remaining > 0 ? 'Réserver ma place →' : 'Rejoindre la liste d\'attente →'}
      </button>

      <p style={{ fontSize: '12px', color: '#9CA3AF', textAlign: 'center' }}>
        Données confidentielles · Pas de spam · Réponse sous 24h
      </p>
    </form>
  );
}
