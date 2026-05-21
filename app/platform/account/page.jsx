'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

const NAVY  = '#0A1628';
const TEAL  = '#4EC9B0';
const PLANS = {
  free:         { label: 'Gratuit',      color: '#6B7A94', bg: '#F8FAFC' },
  starter:      { label: 'Starter',      color: '#3B82F6', bg: '#EFF6FF' },
  pro:          { label: 'Pro',          color: '#10B981', bg: '#ECFDF5' },
  institutions: { label: 'Institutions', color: '#7C3AED', bg: '#F5F3FF' },
};

export default function AccountPage() {
  const supabase = createClient();

  const [user,       setUser]       = useState(null);
  const [profile,    setProfile]    = useState(null);
  const [loading,    setLoading]    = useState(true);

  // Formulaire profil
  const [fullName,   setFullName]   = useState('');
  const [org,        setOrg]        = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Formulaire mot de passe
  const [newPassword,    setNewPassword]    = useState('');
  const [confirmPassword,setConfirmPassword]= useState('');
  const [savingPwd,      setSavingPwd]      = useState(false);
  const [pwdMsg,         setPwdMsg]         = useState('');

  // Portail Stripe
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError,   setPortalError]   = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setLoading(false); return; }
      setUser(u);

      const { data: p } = await supabase
        .from('profiles')
        .select('full_name, organisation, plan, plan_active, plan_payment_issue, stripe_customer_id, audit_score, audit_level, market, country, created_at')
        .eq('id', u.id)
        .single();

      setProfile(p);
      setFullName(p?.full_name || '');
      setOrg(p?.organisation || '');
      setLoading(false);
    }
    load();
  }, []);

  async function handleSaveProfile(e) {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName.trim(), organisation: org.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id);
    setSavingProfile(false);
    setProfileMsg(error ? 'Erreur lors de la sauvegarde.' : '✓ Profil mis à jour');
    setTimeout(() => setProfileMsg(''), 3000);
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) { setPwdMsg('Les mots de passe ne correspondent pas.'); return; }
    if (newPassword.length < 8) { setPwdMsg('8 caractères minimum.'); return; }
    setSavingPwd(true);
    setPwdMsg('');
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPwd(false);
    if (error) { setPwdMsg('Erreur : ' + error.message); }
    else { setPwdMsg('✓ Mot de passe modifié'); setNewPassword(''); setConfirmPassword(''); }
    setTimeout(() => setPwdMsg(''), 4000);
  }

  async function handleOpenPortal() {
    setPortalLoading(true);
    setPortalError('');
    try {
      const res = await fetch('/api/stripe/portal', { method: 'POST' });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setPortalError(data.error || 'Impossible d\'ouvrir le portail.'); setPortalLoading(false); }
    } catch { setPortalError('Erreur réseau.'); setPortalLoading(false); }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: `3px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  const plan = PLANS[profile?.plan || 'free'];
  const hasStripe = !!profile?.stripe_customer_id;
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', padding: '32px 20px', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style>{`
        input:focus { border-color: ${TEAL} !important; outline: none; }
        @keyframes spin { to { transform: rotate(360deg); }}
      `}</style>

      <div style={{ maxWidth: 640, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2.5px', color: TEAL, textTransform: 'uppercase', marginBottom: '6px' }}>
            Nexalie Platform
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 300, color: NAVY, margin: 0 }}>
            Mon compte
          </h1>
        </div>

        {/* Plan actuel */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px' }}>Plan actuel</p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ background: plan.bg, color: plan.color, border: `1.5px solid ${plan.color}33`, borderRadius: '8px', padding: '6px 14px', fontWeight: 700, fontSize: '14px' }}>
                {plan.label}
              </span>
              {profile?.plan_payment_issue && (
                <span style={{ background: '#FEF3C7', color: '#92400E', border: '1.5px solid #FDE68A', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: 600 }}>
                  ⚠ Problème de paiement
                </span>
              )}
              {profile?.plan_active && profile?.plan !== 'free' && (
                <span style={{ background: '#ECFDF5', color: '#065F46', fontSize: '12px', fontWeight: 600 }}>
                  ✓ Actif
                </span>
              )}
            </div>

            {/* Bouton portail Stripe */}
            {hasStripe ? (
              <div>
                <button
                  onClick={handleOpenPortal}
                  disabled={portalLoading}
                  style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', cursor: portalLoading ? 'default' : 'pointer', opacity: portalLoading ? 0.7 : 1 }}
                >
                  {portalLoading ? 'Chargement…' : 'Gérer mon abonnement →'}
                </button>
                {portalError && <p style={{ fontSize: '12px', color: '#EF4444', marginTop: '6px' }}>{portalError}</p>}
              </div>
            ) : (
              <a href="/pricing" style={{ background: TEAL, color: '#fff', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '13px', textDecoration: 'none', display: 'inline-block' }}>
                Passer au Pro →
              </a>
            )}
          </div>

          {/* Infos abonnement */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #F3F4F6', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
            {[
              { label: 'Email',   value: user?.email },
              { label: 'Marché',  value: profile?.market === 'af' ? '🌍 Afrique' : '🇫🇷 France' },
              { label: 'Score audit', value: profile?.audit_score != null ? `${profile.audit_score}/100` : '—' },
              { label: 'Membre depuis', value: memberSince || '—' },
            ].map(({ label, value }) => (
              <div key={label}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '3px' }}>{label}</p>
                <p style={{ fontSize: '13px', color: NAVY, fontWeight: 500 }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Note portail si pas de Stripe */}
          {!hasStripe && profile?.plan !== 'free' && (
            <p style={{ fontSize: '12px', color: '#9CA3AF', marginTop: '14px', fontStyle: 'italic' }}>
              Abonnement mobile (CinetPay) — gestion via l'opérateur Mobile Money.
            </p>
          )}
        </div>

        {/* Modifier le profil */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px' }}>Informations personnelles</p>

          <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Nom complet</label>
              <input
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="Votre nom"
                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: NAVY, background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Organisation / Entreprise</label>
              <input
                value={org}
                onChange={e => setOrg(e.target.value)}
                placeholder="Nom de votre entreprise"
                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: NAVY, background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                disabled={savingProfile}
                style={{ background: TEAL, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, fontSize: '13px', cursor: savingProfile ? 'default' : 'pointer', opacity: savingProfile ? 0.7 : 1 }}
              >
                {savingProfile ? 'Sauvegarde…' : 'Sauvegarder'}
              </button>
              {profileMsg && (
                <span style={{ fontSize: '13px', color: profileMsg.startsWith('✓') ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                  {profileMsg}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Changer le mot de passe */}
        <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '24px', marginBottom: '16px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px' }}>Sécurité</p>

          <form onSubmit={handleChangePassword} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Nouveau mot de passe</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="8 caractères minimum"
                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: NAVY, background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>Confirmer le mot de passe</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Répéter le mot de passe"
                style={{ width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '10px 14px', fontSize: '14px', color: NAVY, background: '#fff', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                type="submit"
                disabled={savingPwd || !newPassword}
                style={{ background: NAVY, color: '#fff', border: 'none', borderRadius: '8px', padding: '10px 24px', fontWeight: 700, fontSize: '13px', cursor: (savingPwd || !newPassword) ? 'default' : 'pointer', opacity: (savingPwd || !newPassword) ? 0.5 : 1 }}
              >
                {savingPwd ? 'Modification…' : 'Changer le mot de passe'}
              </button>
              {pwdMsg && (
                <span style={{ fontSize: '13px', color: pwdMsg.startsWith('✓') ? '#10B981' : '#EF4444', fontWeight: 600 }}>
                  {pwdMsg}
                </span>
              )}
            </div>
          </form>
        </div>

        {/* Zone danger */}
        <div style={{ background: '#FFF5F5', border: '1.5px solid #FECACA', borderRadius: '14px', padding: '20px 24px' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', color: '#EF4444', textTransform: 'uppercase', marginBottom: '12px' }}>Zone sensible</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <p style={{ fontSize: '13px', color: '#374151', margin: 0 }}>
              Se déconnecter de toutes les sessions
            </p>
            <button
              onClick={async () => { await supabase.auth.signOut(); window.location.href = '/'; }}
              style={{ background: 'transparent', border: '1.5px solid #EF4444', color: '#EF4444', borderRadius: '8px', padding: '8px 18px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
            >
              Se déconnecter
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
