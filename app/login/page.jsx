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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect.'
        : error.message);
      setLoading(false);
    } else {
      router.push('/platform');
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: T.pageBg, fontFamily: 'sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent, fontWeight: 600 }}>AI</span>
          </a>
        </div>
      </nav>

      {/* Form */}
      <div style={{ maxWidth: '440px', margin: '80px auto', padding: '0 24px', animation: 'fadeIn 0.4s ease' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textSecondary, marginBottom: '10px' }}>
          ESPACE CLIENT
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '28px', fontWeight: 200, color: T.textPrimary, marginBottom: '6px' }}>
          Connexion à <em style={{ color: T.accent, fontStyle: 'normal' }}>Nexalie</em>
        </h1>
        <p style={{ fontSize: '14px', color: T.textSecondary, marginBottom: '32px' }}>
          Pas encore de compte ?{' '}
          <a href="/signup" style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>Créer un compte →</a>
        </p>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {[['Email', 'email', 'email', 'votre@email.com', email, setEmail],
            ['Mot de passe', 'password', 'password', '••••••••', password, setPassword]
          ].map(([label, key, type, ph, val, setter]) => (
            <div key={key}>
              <label style={{ display: 'block', fontFamily: 'monospace', fontSize: '10px', color: T.textSecondary, marginBottom: '6px' }}>
                {label.toUpperCase()}
              </label>
              <input
                type={type}
                value={val}
                onChange={e => setter(e.target.value)}
                placeholder={ph}
                required
                style={{ width: '100%', padding: '12px 14px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '10px', color: T.textPrimary, fontSize: '14px' }}
              />
            </div>
          ))}

          {error && (
            <div style={{ padding: '12px 14px', background: 'rgba(192,98,122,0.06)', border: '1px solid rgba(192,98,122,0.2)', borderRadius: '8px' }}>
              <p style={{ fontSize: '13px', color: '#C0627A' }}>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !email || !password}
            style={{ padding: '13px', background: loading ? T.sectionBg : T.navyBg, border: 'none', borderRadius: '10px', color: loading ? T.textSecondary : '#fff', fontSize: '14px', fontWeight: 700, cursor: loading ? 'default' : 'pointer', transition: 'all 0.2s' }}
          >
            {loading ? 'Connexion...' : 'Se connecter →'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '13px', color: T.textSecondary }}>
          <a href="/signup" style={{ color: T.textSecondary }}>Mot de passe oublié ?</a>
        </p>

        <div style={{ marginTop: '32px', padding: '16px', background: T.sectionBg, borderRadius: '12px', border: `1px solid ${T.border}`, textAlign: 'center' }}>
          <p style={{ fontSize: '12px', color: T.textSecondary }}>
            Pas encore d'audit ?{' '}
            <a href="/?page=audit" style={{ color: T.accent, fontWeight: 600, textDecoration: 'none' }}>
              Commencer gratuitement →
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
