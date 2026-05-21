'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMode } from '@/lib/mode-context';
import { createClient } from '@/lib/supabase/client';

export default function GlobalHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const { mode, setMode } = useMode();
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setAuthed(!!data?.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session?.user);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isAfrica = mode === 'af';
  const navy   = '#0A1628';
  const accent = isAfrica ? '#C45E0A' : '#4EC9B0';

  const links = [
    { href: '/',        label: 'Accueil' },
    { href: '/audit',   label: 'Audit' },
    { href: '/pricing', label: 'Tarifs' },
    { href: '/about',   label: 'À propos' },
    { href: '/blog',    label: 'Blog' },
  ];

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      background: 'rgba(10,22,40,0.97)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
      }}>
        {/* Logo */}
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>
            Nexalie
          </span>
          <span style={{ fontSize: '10px', background: accent, color: '#fff', padding: '2px 7px', borderRadius: '20px', fontWeight: 700, letterSpacing: '0.5px' }}>
            BETA
          </span>
        </Link>

        {/* Nav desktop */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }} className="global-nav-desktop">
          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                color: isActive(l.href) ? '#fff' : 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: isActive(l.href) ? 600 : 400,
                padding: '6px 12px',
                borderRadius: '8px',
                background: isActive(l.href) ? 'rgba(255,255,255,0.08)' : 'transparent',
                transition: 'all 0.15s',
                whiteSpace: 'nowrap',
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Droite : toggle + auth */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }} className="global-nav-desktop">
          {/* Toggle FR / AF */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', overflow: 'hidden' }}>
            {[['fr', '🇫🇷'], ['af', '🌍']].map(([m, flag]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  padding: '5px 10px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  background: mode === m ? accent : 'transparent',
                  color: '#fff',
                  transition: 'all 0.2s',
                  fontWeight: mode === m ? 700 : 400,
                }}
              >
                {flag}
              </button>
            ))}
          </div>

          {authed ? (
            <>
              <Link href="/platform" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13px', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                Ma plateforme
              </Link>
              <Link
                href="/platform/account"
                style={{ background: accent, color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}
              >
                Mon compte
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" style={{ color: 'rgba(255,255,255,0.65)', textDecoration: 'none', fontSize: '13px', padding: '6px 10px', whiteSpace: 'nowrap' }}>
                Se connecter
              </Link>
              <Link
                href="/signup"
                style={{ background: accent, color: '#fff', textDecoration: 'none', fontSize: '13px', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', whiteSpace: 'nowrap' }}
              >
                Créer un compte
              </Link>
            </>
          )}
        </div>

        {/* Burger mobile */}
        <button
          onClick={() => setOpen(o => !o)}
          className="global-nav-mobile"
          style={{ background: 'none', border: 'none', color: '#fff', fontSize: '22px', cursor: 'pointer', padding: '4px' }}
          aria-label="Menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Menu mobile */}
      {open && (
        <div
          className="global-nav-mobile"
          style={{ background: navy, borderTop: '1px solid rgba(255,255,255,0.06)', padding: '16px 24px 24px' }}
        >
          <div style={{ display: 'flex', marginBottom: '16px', background: 'rgba(255,255,255,0.06)', borderRadius: '8px', overflow: 'hidden' }}>
            {[['fr', '🇫🇷 France'], ['af', '🌍 Afrique']].map(([m, label]) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                style={{
                  flex: 1,
                  padding: '9px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: mode === m ? 700 : 400,
                  background: mode === m ? accent : 'transparent',
                  color: '#fff',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {links.map(l => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{ display: 'block', color: 'rgba(255,255,255,0.8)', textDecoration: 'none', padding: '12px 0', fontSize: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
            >
              {l.label}
            </Link>
          ))}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <Link href="/login" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px' }}>
              Se connecter
            </Link>
            <Link href="/signup" onClick={() => setOpen(false)} style={{ flex: 1, textAlign: 'center', padding: '11px', background: accent, borderRadius: '8px', color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: 700 }}>
              Créer un compte
            </Link>
          </div>
        </div>
      )}

      <style suppressHydrationWarning>{`
        @media (max-width: 900px) {
          .global-nav-desktop { display: none !important; }
          .global-nav-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .global-nav-mobile { display: none !important; }
        }
      `}</style>
    </header>
  );
}
