'use client';

import { useState, useEffect, useCallback } from 'react';

const T = {
  navyBg: '#0A1628', accent: '#2E9B8B', gold: '#C9A84C',
  textPrimary: '#0A1628', textSecondary: '#6B7A94',
  border: 'rgba(0,0,0,0.07)',
};

export default function ExitPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const handleMouseLeave = useCallback((e) => {
    if (e.clientY <= 0 && !dismissed) {
      setShow(true);
    }
  }, [dismissed]);

  useEffect(() => {
    // Ne pas montrer si déjà vu (session)
    if (sessionStorage.getItem('nexali-exit-popup-seen')) return;
    // Délai minimum de 10 secondes sur la page
    const timer = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 10000);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const dismiss = () => {
    setShow(false);
    setDismissed(true);
    sessionStorage.setItem('nexali-exit-popup-seen', '1');
  };

  if (!show) return null;

  return (
    <>
      <div onClick={dismiss} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 9998, backdropFilter: 'blur(3px)' }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9999, width: '480px', maxWidth: 'calc(100vw - 48px)', background: '#fff', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', animation: 'popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
        <style>{`@keyframes popIn{from{opacity:0;transform:translate(-50%,-50%) scale(0.85)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}`}</style>

        {/* Header navy */}
        <div style={{ background: T.navyBg, padding: '28px 32px', position: 'relative' }}>
          <div style={{ height: '1px', background: `linear-gradient(90deg,transparent,${T.gold}50,transparent)`, marginBottom: '20px' }} />
          <button onClick={dismiss} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
          <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '8px' }}>AVANT DE PARTIR</p>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 200, color: '#fff', lineHeight: 1.3 }}>
            Votre score digital gratuit<br />
            <em style={{ color: T.accent, fontStyle: 'normal' }}>en 20 minutes</em>
          </h3>
        </div>

        {/* Body */}
        <div style={{ padding: '28px 32px' }}>
          <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7, marginBottom: '20px' }}>
            Découvrez où vous en êtes sur 5 dimensions digitales. Rapport personnalisé par IA. Gratuit, sans engagement.
          </p>
          {['📊 Score /100 sur 5 dimensions', '🎯 3 priorités d\'action immédiates', '🤖 Rapport IA personnalisé'].map(item => (
            <div key={item} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: T.textSecondary }}>{item}</span>
            </div>
          ))}
          <a href="/" onClick={dismiss}
            style={{ display: 'block', marginTop: '20px', padding: '14px', background: T.navyBg, borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>
            Faire mon audit gratuit →
          </a>
          <button onClick={dismiss} style={{ display: 'block', width: '100%', marginTop: '10px', padding: '10px', background: 'none', border: 'none', color: T.textSecondary, fontSize: '13px', cursor: 'pointer' }}>
            Non merci, je reviendrai plus tard
          </button>
        </div>
      </div>
    </>
  );
}
