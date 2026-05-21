'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const T = {
  pageBg: '#FFFFFF', sectionBg: '#F8FAFC', navyBg: '#0A1628',
  textPrimary: '#0A1628', textSecondary: '#6B7A94', textOnNavy: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)', accent: '#2E9B8B', gold: '#C9A84C',
  border: 'rgba(0,0,0,0.07)',
};

export default function SuccessPage() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setStep(1), 1200);
    const t2 = setTimeout(() => setStep(2), 2800);
    const t3 = setTimeout(() => setStep(3), 4200);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  const steps = [
    { label: 'Compte activé', done: step >= 1, icon: '✓' },
    { label: 'Email de bienvenue envoyé', done: step >= 2, icon: '✉️' },
    { label: 'Audit automatique déclenché', done: step >= 3, icon: '📊' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: T.pageBg, fontFamily: 'sans-serif' }}>

      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', height: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent }}>AI</span>
          </Link>
        </div>
      </nav>

      {/* Hero navy */}
      <div style={{ background: T.navyBg, padding: '72px 40px', textAlign: 'center' }}>
        <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,${T.gold}40,transparent)`, marginBottom: '40px' }} />
        <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(46,155,139,0.15)', border: '2px solid rgba(46,155,139,0.4)', marginBottom: '24px', fontSize: '28px' }}>✓</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,38px)', fontWeight: 200, color: '#fff', marginBottom: '10px' }}>
          Bienvenue dans <em style={{ color: T.accent, fontStyle: 'normal' }}>Nexalie Premium</em>
        </h1>
        <p style={{ fontSize: '15px', color: T.textMuted, maxWidth: '480px', margin: '0 auto', lineHeight: 1.8 }}>
          Votre abonnement est actif. Vos agents IA se mettent en place automatiquement.
        </p>
      </div>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '48px 40px', animation: 'fadeIn 0.5s ease' }}>
        {/* Onboarding progress */}
        <div style={{ padding: '28px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '16px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: T.textSecondary, marginBottom: '20px' }}>ACTIVATION EN COURS</p>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '12px 0', borderBottom: i < steps.length - 1 ? `1px solid ${T.border}` : 'none' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: s.done ? `${T.accent}10` : T.sectionBg, border: `2px solid ${s.done ? T.accent : T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>
                {s.done ? '✓' : <div style={{ width: '14px', height: '14px', border: `2px solid ${T.border}`, borderTop: `2px solid ${T.accent}`, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />}
              </div>
              <span style={{ fontSize: '14px', color: s.done ? T.textPrimary : T.textSecondary }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* What's next */}
        <div style={{ padding: '24px', background: T.sectionBg, border: `1px solid ${T.border}`, borderRadius: '14px', marginBottom: '24px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: T.textSecondary, marginBottom: '14px' }}>PROCHAINES ÉTAPES</p>
          {[['📊', 'Faire votre audit de démarrage', 'Score de référence pour mesurer vos progrès'],
            ['🗺️', 'Générer votre roadmap 12 mois', 'Plan d\'action personnalisé à votre secteur'],
            ['📱', 'Rejoindre le groupe WhatsApp', 'Communauté Nexalie · Conseils exclusifs']].map(([e, t, s]) => (
            <div key={t} style={{ display: 'flex', gap: '12px', marginBottom: '14px' }}>
              <span style={{ fontSize: '20px' }}>{e}</span>
              <div><p style={{ fontSize: '13px', fontWeight: 600, color: T.textPrimary, marginBottom: '2px' }}>{t}</p><p style={{ fontSize: '12px', color: T.textSecondary }}>{s}</p></div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <Link href="/platform" style={{ flex: 1, padding: '14px', background: T.navyBg, borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
            Accéder à la plateforme →
          </Link>
          <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer"
            style={{ padding: '14px 20px', background: '#25D366', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none' }}>
            💬
          </a>
        </div>
      </div>
    </div>
  );
}
