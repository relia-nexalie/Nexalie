'use client';

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

const T = {
  pageBg: '#FFFFFF', navyBg: '#0A1628', sectionBg: '#F8FAFC',
  textPrimary: '#0A1628', textSecondary: '#6B7A94',
  accent: '#2E9B8B', gold: '#C9A84C', border: 'rgba(0,0,0,0.07)',
};

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', country: 'fr' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSignup = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return; }
    setLoading(true); setError('');

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.name, country: form.country },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) { setError(error.message); setLoading(false); return; }

    // Si confirmation email non requise (Supabase config), rediriger directement
    if (data.session) { router.push('/platform'); router.refresh(); return; }
    setSuccess(true);
    setLoading(false);
  };

  if (success) return (
    <div style={{ minHeight: '100vh', background: T.pageBg, fontFamily: 'sans-serif', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ maxWidth: '440px', padding: '48px 40px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}>✉️</span>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 200, color: T.textPrimary, marginBottom: '12px' }}>
          Vérifiez votre email
        </h2>
        <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7 }}>
          Un lien de confirmation a été envoyé à <strong>{form.email}</strong>. Cliquez sur le lien pour activer votre compte.
        </p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: T.pageBg, fontFamily: 'sans-serif' }}>

      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent }}>AI</span>
          </a>
        </div>
      </nav>

      <div style={{ maxWidth: '440px', margin: '60px auto', padding: '0 24px', animation: 'fadeIn 0.4s ease' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textSecondary, marginBottom: '10px' }}>CRÉER UN COMPTE</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 200, color: T.textPrimary, marginBottom: '6px' }}>
          Rejoindre <em style={{ color: T.accent, fontStyle: 'normal' }}>Nexalie</em>
        </h1>
        <p style={{ fontSize: '14px', color: T.textSecondary, marginBottom: '28px' }}>
          Déjà un compte ?{' '}
          <a href="/login" style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>Se connecter →</a>
        </p>

        <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['Nom complet', 'name', 'text', 'Votre nom', form.name],
            ['Email', 'email', 'email', 'votre@email.com', form.email],
            ['Mot de passe', 'password', 'password', 'Min. 8 caractères', form.password],
          ].map(([label, key, type, ph, val]) => (
            <div key={key}>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>{label.toUpperCase()}</label>
              <input type={type} value={val} onChange={e => set(key, e.target.value)} placeholder={ph} required
                style={{ width: '100%', padding: '12px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', color: T.textPrimary, fontSize: '14px' }} />
            </div>
          ))}

          <div>
            <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>VOTRE MARCHÉ</label>
            <select value={form.country} onChange={e => set('country', e.target.value)}
              style={{ width: '100%', padding: '12px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', color: T.textPrimary, fontSize: '14px', cursor: 'pointer' }}>
              <option value="fr">🇫🇷 France</option>
              <option value="ci">🇨🇮 Côte d'Ivoire</option>
              <option value="cg">🇨🇬 Congo</option>
              <option value="cm">🇨🇲 Cameroun</option>
              <option value="sn">🇸🇳 Sénégal</option>
              <option value="other">🌍 Autre Afrique</option>
            </select>
          </div>

          {error && (
            <div style={{ padding: '12px 14px', background: 'rgba(192,98,122,0.06)', border: '1px solid rgba(192,98,122,0.2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', color: '#C0627A' }}>{error}</p>
            </div>
          )}

          <button type="submit" disabled={loading}
            style={{ padding: '13px', background: loading ? T.sectionBg : T.navyBg, border: 'none', borderRadius: '10px', color: loading ? T.textSecondary : '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer' }}>
            {loading ? 'Création du compte...' : 'Créer mon compte gratuit →'}
          </button>
        </form>

        <p style={{ fontSize: '11px', color: T.textSecondary, textAlign: 'center', marginTop: '16px', lineHeight: 1.6 }}>
          En créant un compte, vous acceptez les{' '}
          <a href="/legal" style={{ color: T.accent }}>CGV</a> et la{' '}
          <a href="/legal#privacy" style={{ color: T.accent }}>politique de confidentialité</a>.
        </p>
      </div>
    </div>
  );
}
