'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useMode } from '@/lib/mode-context';
import BugReportModal from '@/components/BugReportModal';

export default function GlobalFooter() {
  const { isAfrica } = useMode();
  const [showBugModal, setShowBugModal] = useState(false);

  const navy   = isAfrica ? '#1A0800' : '#0A1628';
  const accent = isAfrica ? '#C45E0A' : '#4EC9B0';
  const tagline = isAfrica
    ? 'Votre transformation numérique commence ici'
    : 'Votre transformation digitale commence ici';

  const year = new Date().getFullYear();

  const cols = [
    {
      title: 'Produit',
      links: [
        { href: '/audit',          label: 'Audit gratuit' },
        { href: '/pricing',        label: 'Tarifs' },
        { href: '/marque-blanche', label: 'Marque Blanche' },
        { href: '/beta',           label: 'Programme Beta' },
      ],
    },
    {
      title: 'Ressources',
      links: [
        { href: '/blog',    label: 'Blog' },
        { href: '/about',   label: 'À propos' },
        { href: '/contact', label: 'Contact' },
        { href: '/faq',     label: 'FAQ' },
      ],
    },
    {
      title: 'Légal',
      links: [
        { href: '/legal',               label: 'Mentions légales' },
        { href: '/legal',               label: 'CGV' },
        { href: '/legal',               label: 'Politique confidentialité' },
      ],
    },
  ];

  return (
    <footer style={{ background: navy, color: '#fff', padding: '56px 24px 32px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr repeat(3, 1fr)', gap: '40px', marginBottom: '48px' }}>

          {/* Col 1 — Nexalie */}
          <div>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span style={{ fontSize: '22px', fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>Nexalie</span>
            </Link>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.7, marginTop: '12px', maxWidth: '240px' }}>
              {tagline}
            </p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.25)', marginTop: '20px' }}>
              © {year} Nexalie
            </p>
          </div>

          {/* Cols 2-4 */}
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: accent, textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '16px' }}>
                {col.title}
              </p>
              {col.links.map((l, i) => (
                <Link
                  key={`${l.href}-${i}`}
                  href={l.href}
                  style={{ display: 'block', color: 'rgba(255,255,255,0.55)', textDecoration: 'none', fontSize: '13px', marginBottom: '10px', transition: 'color 0.15s' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '24px', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>
            Fait avec ♥ par Rélia Ebiya · Paris & Brazzaville
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button
              onClick={() => setShowBugModal(true)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '12px', color: 'rgba(255,255,255,0.3)',
                padding: 0, textDecoration: 'underline', textUnderlineOffset: '3px',
              }}
            >
              Signaler un problème
            </button>
            <Link href="/audit" style={{ fontSize: '12px', color: accent, textDecoration: 'none', fontWeight: 600 }}>
              Faire mon audit gratuit →
            </Link>
          </div>
        </div>

        {showBugModal && <BugReportModal onClose={() => setShowBugModal(false)} />}
      </div>

      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 480px) {
          footer > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </footer>
  );
}
