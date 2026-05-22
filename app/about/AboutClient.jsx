'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMode } from '@/lib/mode-context';

export default function AboutClient() {
  const { isAfrica } = useMode();

  const navy   = isAfrica ? '#1A0800' : '#0A1628';
  const accent = isAfrica ? '#C45E0A' : '#4EC9B0';
  const accentText = isAfrica ? '#C45E0A' : '#1D6B60';
  const green  = '#2D6A4F';

  return (
    <div style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', background: '#fff', color: '#1C1C1C' }}>

      {/* ── SECTION 1 : HERO ─────────────────────────────────────── */}
      <section style={{ background: navy, padding: 'clamp(56px,7vw,96px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: 'clamp(32px,5vw,72px)', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: '#C45E0A', textTransform: 'uppercase', marginBottom: '20px' }}>La fondatrice</p>
            <blockquote style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(17px,2.5vw,24px)', fontWeight: 300, color: '#fff', lineHeight: 1.6, borderLeft: `3px solid ${accent}`, paddingLeft: '24px', marginBottom: '32px', fontStyle: 'italic' }}>
              &ldquo;Je suis née à Brazzaville. J&apos;ai grandi en France. Et entre ces deux mondes, j&apos;ai toujours su que quelque chose manquait.&rdquo;
            </blockquote>
            <h1 style={{ fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 800, color: '#fff', marginBottom: '6px', letterSpacing: '-0.3px' }}>
              Rélia Ebiya
            </h1>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
              Consultante · Fondatrice de Nexalie
            </p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
              {['📍 Paris', '🇨🇬 Brazzaville', '💬 FR · EN · Lingala'].map(t => (
                <span key={t} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${accent}`, flexShrink: 0, background: `${accent}15`, position: 'relative', boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 0 8px ${accent}18` }}>
            <Image src="/relia.png" alt="Rélia Ebiya — Fondatrice Nexalie" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="280px" priority />
          </div>
        </div>
      </section>

      {/* ── SECTION 2 : POURQUOI NEXALIE ─────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: accentText, marginBottom: '12px', textTransform: 'uppercase' }}>La genèse</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 300, color: '#1C1C1C', marginBottom: '36px', lineHeight: 1.3 }}>
            Pourquoi Nexalie
          </h2>
          <div style={{ fontSize: '16px', color: '#374151', lineHeight: 1.95 }}>
            <p style={{ marginBottom: '20px' }}>
              Pendant des années, j&apos;ai observé deux mondes qui s&apos;ignoraient.
            </p>
            <p style={{ marginBottom: '20px' }}>
              D&apos;un côté, des entreprises africaines talentueuses — mais sans les outils pour structurer leur croissance digitale.
            </p>
            <p style={{ marginBottom: '20px' }}>
              De l&apos;autre, des solutions puissantes — mais pensées pour des grandes entreprises occidentales, hors de prix, déconnectées des réalités africaines.
            </p>
            <p style={{ marginBottom: '20px', fontWeight: 600, color: '#1C1C1C' }}>
              Nexalie est le pont entre ces deux mondes.
            </p>
            <p style={{ color: accentText, fontStyle: 'italic', fontFamily: 'Georgia, serif', fontSize: '17px', borderLeft: `3px solid ${accent}`, paddingLeft: '20px' }}>
              Nexalie — de <em>Nexus</em>, le lien. Et <em>Ali</em>, l&apos;Afrique que je porte en moi.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 3 : MÉTHODE ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: '#fff' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: accentText, marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Méthode</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 300, color: '#1C1C1C', marginBottom: '48px', textAlign: 'center' }}>
            Comment je travaille
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { num: '01', title: 'OBSERVER', text: 'Comprendre comment l\'organisation fonctionne vraiment.', color: accent },
              { num: '02', title: 'QUESTIONNER', text: 'Identifier les vrais besoins derrière les besoins exprimés.', color: green },
              { num: '03', title: 'CO-CONSTRUIRE', text: 'Bâtir les solutions avec les équipes, pas pour elles.', color: '#7B5EA7' },
            ].map(step => (
              <div key={step.num} style={{ padding: '32px 24px', background: '#F8F9FA', borderRadius: '16px', borderTop: `4px solid ${step.color}` }}>
                <p style={{ fontFamily: 'monospace', fontSize: '32px', fontWeight: 700, color: step.color, marginBottom: '12px', lineHeight: 1 }}>{step.num}</p>
                <h3 style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '2px', fontWeight: 700, color: '#1C1C1C', marginBottom: '12px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7 }}>{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 4 : CHIFFRES ─────────────────────────────────── */}
      <section style={{ background: navy, padding: '72px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: accent, marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Expérience</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 300, color: '#fff', marginBottom: '48px', textAlign: 'center' }}>
            Ce qui me distingue
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '48px' }}>
            {[
              { stat: '-20%', label: 'Délais de fabrication', sub: '3SP Technologies', color: accent },
              { stat: '17 000+', label: 'Collaborateurs', sub: 'Safran Electronics & Defense', color: '#E88C32' },
              { stat: 'Master 2', label: 'Projet Digital', sub: 'ECEMA Lyon · 2024', color: green },
            ].map(card => (
              <div key={card.stat} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '28px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: '36px', color: card.color, marginBottom: '8px', lineHeight: 1 }}>{card.stat}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{card.label}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}>{card.sub}</p>
              </div>
            ))}
          </div>
          {/* Parcours */}
          <div style={{ maxWidth: '540px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textAlign: 'center' }}>PARCOURS</p>
            {[
              ['2026 → Présent',         'Fondatrice & CEO · Nexalie',                                              isAfrica ? '#C45E0A' : '#4EC9B0'],
              ['Sept. 2021 → Sept. 2024','Coordinatrice Innovation Participative · Safran Electronics & Defense · Massy', '#E88C32'],
              ['2019 → 2020',            'Cheffe de Projet MES · 3SP Technologies (ex Alcatel Optronics)',           green],
              ['2021 → 2023',            'Co-fondatrice & CEO · WEAREEYWA',                                         '#7B5EA7'],
            ].map(([period, role, color]) => (
              <div key={period} style={{ display: 'flex', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '4px' }} />
                <div>
                  <p style={{ fontSize: '11px', color, fontFamily: 'monospace', marginBottom: '2px' }}>{period}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.8)' }}>{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 5 : VISION ──────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: isAfrica ? '#FFF8F3' : '#F8F9FA' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: accentText, marginBottom: '12px', textTransform: 'uppercase' }}>Vision 2030</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 300, color: '#1C1C1C', marginBottom: '24px', lineHeight: 1.4 }}>
            Une ambition pour l&apos;Afrique francophone
          </h2>
          <p style={{ fontSize: '17px', color: '#374151', lineHeight: 1.9, marginBottom: '40px' }}>
            D&apos;ici 2030, chaque PME en Afrique francophone aura accès à un plan de transformation digitale concret — sans consultant hors de prix.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" style={{ padding: '15px 32px', background: isAfrica ? '#C45E0A' : '#0A1628', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Faire mon bilan gratuit →
            </Link>
            <Link href="/contact" style={{ padding: '15px 24px', background: 'transparent', border: '2px solid rgba(0,0,0,0.12)', borderRadius: '10px', color: '#6B7A94', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
              Me contacter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
