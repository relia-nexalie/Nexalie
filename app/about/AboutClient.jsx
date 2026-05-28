'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMode } from '@/lib/mode-context';

export default function AboutClient() {
  const { isAfrica } = useMode();

  const navy        = isAfrica ? '#1A0800' : '#0A1628';
  const accent      = isAfrica ? '#C45E0A' : '#4EC9B0';
  const accentText  = isAfrica ? '#C45E0A' : '#1D6B60';

  return (
    <div style={{ fontFamily: 'var(--font-jakarta, system-ui, sans-serif)', background: '#fff', color: '#1C1C1C' }}>

      {/* ── HERO — asymétrique ──────────────────────────────────────── */}
      <section style={{ background: navy, padding: 'clamp(56px,7vw,96px) 24px' }}>
        <div style={{
          maxWidth: '1100px', margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr auto',
          gap: 'clamp(32px,5vw,72px)', alignItems: 'center'
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: '#C45E0A', textTransform: 'uppercase', marginBottom: '20px' }}>La fondatrice</p>
            <blockquote style={{
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 'clamp(20px,2.8vw,30px)',
              fontWeight: 300, color: '#fff', lineHeight: 1.5,
              borderLeft: `3px solid ${accent}`, paddingLeft: '24px',
              marginBottom: '32px', fontStyle: 'italic'
            }}>
              &ldquo;Je suis née à Brazzaville. J&apos;ai grandi en France. Et entre ces deux mondes, j&apos;ai vu une faille stratégique que Nexalie va combler.&rdquo;
            </blockquote>
            <h1 style={{
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 'clamp(22px,2.5vw,30px)', fontWeight: 300,
              color: '#fff', marginBottom: '6px'
            }}>
              Rélia Ebiya
            </h1>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textTransform: 'uppercase' }}>
              Fondatrice &amp; CEO · Nexalie
            </p>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['Paris', 'Brazzaville', 'FR · EN · Lingala'].map(t => (
                <span key={t} style={{ padding: '4px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontFamily: 'var(--font-mono, monospace)' }}>{t}</span>
              ))}
            </div>
          </div>
          <div style={{ width: '260px', height: '260px', borderRadius: '50%', overflow: 'hidden', border: `4px solid ${accent}`, flexShrink: 0, background: `${accent}15`, position: 'relative', boxShadow: `0 8px 40px rgba(0,0,0,0.3), 0 0 0 8px ${accent}18` }}>
            <Image src="/relia.png" alt="Rélia Ebiya — Fondatrice Nexalie" fill style={{ objectFit: 'cover', objectPosition: 'center top' }} sizes="260px" priority />
          </div>
        </div>
      </section>

      {/* ── MANIFESTE — 2 colonnes asymétriques ────────────────────── */}
      <section style={{ padding: 'clamp(64px,8vw,112px) 24px', background: '#F8F9FA' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '5fr 4fr', gap: 'clamp(40px,6vw,88px)', alignItems: 'start' }}>

          {/* GAUCHE — Le Manifeste */}
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: accentText, marginBottom: '24px', textTransform: 'uppercase' }}>Le Manifeste</p>
            <h2 style={{
              fontFamily: 'var(--font-fraunces, Georgia, serif)',
              fontSize: 'clamp(28px,4vw,46px)',
              fontWeight: 300, color: '#0A1628',
              lineHeight: 1.25, marginBottom: '36px'
            }}>
              Des PME qui méritent la même rigueur que les grands groupes. Sans le prix du consultant.
            </h2>
            <div style={{ fontSize: '16px', color: '#374151', lineHeight: 2, borderLeft: `2px solid ${accent}30`, paddingLeft: '24px' }}>
              <p style={{ marginBottom: '20px' }}>
                Pendant des années, j&apos;ai travaillé dans de grandes entreprises — Safran, Alcatel Optronics. J&apos;ai vu ce que les budgets de transformation digitale permettent d&apos;accomplir quand les outils, les méthodes et l&apos;expertise sont alignés.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Puis j&apos;ai regardé de l&apos;autre côté. Les PME françaises qui n&apos;ont pas 15 000€ pour un cabinet. Les entrepreneurs africains qui n&apos;ont accès ni aux outils ni aux méthodologies adaptées à leur réalité.
              </p>
              <p style={{ marginBottom: '20px' }}>
                Chez Nexalie, on part d&apos;une conviction simple : la clarté stratégique et la rigueur opérationnelle ne devraient pas être des privilèges réservés aux grandes organisations.
              </p>
              <p style={{ fontWeight: 600, color: '#0A1628' }}>
                Nexalie, c&apos;est cette expertise — accessible en 20 minutes, à un prix que toute PME peut justifier.
              </p>
            </div>
          </div>

          {/* DROITE — La Légitimité */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: '#9CA3AF', marginBottom: '28px', textTransform: 'uppercase' }}>La légitimité</p>

            {[
              {
                label: 'ANCRAGE INDUSTRIEL',
                color: accentText,
                body: '10 ans de gestion de projet et supply chain dans des environnements industriels complexes. Safran Electronics & Defense (17 000 collaborateurs), Alcatel Optronics (3SP Technologies). Chaque outil, chaque méthode chez Nexalie vient d\'un vrai terrain — pas d\'une théorie.',
              },
              {
                label: 'DOUBLE CULTURE',
                color: isAfrica ? '#E88C32' : '#4EC9B0',
                body: 'Paris et Brazzaville. Les deux mondes coexistent dans ma façon de penser. Je comprends le Mobile Money, les coupures de courant, la culture orale — et je comprends le RGPD, les appels d\'offres européens, les reporting trimestriels. Nexalie est construite pour les deux.',
              },
              {
                label: "L'AMBITION NEXALIE",
                color: '#7B5EA7',
                body: "Bâtir l'infrastructure de confiance numérique de l'espace francophone. D'ici 2030, chaque PME en Afrique et en France devrait avoir accès à un plan de transformation digitale concret — au même niveau de qualité qu'un grand cabinet, sans en payer le prix.",
              },
            ].map(({ label, color, body }, i) => (
              <div key={label} style={{
                padding: '28px 0',
                borderBottom: i < 2 ? '1px solid rgba(0,0,0,0.07)' : 'none',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono, monospace)',
                  fontSize: '9px', letterSpacing: '3px',
                  color, marginBottom: '12px', textTransform: 'uppercase'
                }}>{label}</p>
                <p style={{ fontSize: '14px', color: '#374151', lineHeight: 1.85 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PARCOURS — ligne du temps épurée ───────────────────────── */}
      <section style={{ background: navy, padding: 'clamp(56px,7vw,88px) 24px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: accent, marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Expérience</p>
          <h2 style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 300, color: '#fff', marginBottom: '48px', textAlign: 'center' }}>
            Ce qui rend Nexalie crédible
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '56px' }}>
            {[
              { stat: '−20%', label: 'Délais de fabrication', sub: '3SP Technologies', color: accent },
              { stat: '17 000+', label: 'Collaborateurs', sub: 'Safran Electronics', color: '#E88C32' },
              { stat: 'Master 2', label: 'Projet Digital', sub: 'ECEMA Lyon · 2024', color: '#2D6A4F' },
            ].map(card => (
              <div key={card.stat} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '28px 20px', textAlign: 'center' }}>
                <p style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: '34px', fontWeight: 300, color: card.color, marginBottom: '8px', lineHeight: 1 }}>{card.stat}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{card.label}</p>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: 'rgba(255,255,255,0.35)', letterSpacing: '1px' }}>{card.sub}</p>
              </div>
            ))}
          </div>

          <div style={{ maxWidth: '480px', margin: '0 auto' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', marginBottom: '20px', textAlign: 'center' }}>PARCOURS</p>
            {[
              ['2026 → Présent',          'Fondatrice &amp; CEO · Nexalie',                                              isAfrica ? '#C45E0A' : '#4EC9B0'],
              ['Mars 2024 → Janv. 2026',  'Coordinatrice Innovation Participative · Safran Electronics &amp; Defense',   '#E88C32'],
              ['Août 2021 → Janv. 2024',  'Cheffe de Projet MES · 3SP Technologies (ex Alcatel Optronics)',              '#2D6A4F'],
              ['2021 → 2023',             'Co-fondatrice &amp; CEO · WEAREEYWA',                                         '#7B5EA7'],
            ].map(([period, role, color]) => (
              <div key={period} style={{ display: 'flex', gap: '16px', marginBottom: '14px', alignItems: 'flex-start' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, flexShrink: 0, marginTop: '5px' }} />
                <div>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color, marginBottom: '2px' }}>{period}</p>
                  <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }} dangerouslySetInnerHTML={{ __html: role }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VISION ──────────────────────────────────────────────────── */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px', background: isAfrica ? '#FFF8F3' : '#F8F9FA' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '3px', color: accentText, marginBottom: '12px', textTransform: 'uppercase' }}>Vision 2030</p>
          <h2 style={{ fontFamily: 'var(--font-fraunces, Georgia, serif)', fontSize: 'clamp(24px,3.5vw,38px)', fontWeight: 300, color: '#1C1C1C', marginBottom: '24px', lineHeight: 1.4 }}>
            Une ambition pour l&apos;espace francophone
          </h2>
          <p style={{ fontSize: '17px', color: '#374151', lineHeight: 1.95, marginBottom: '40px' }}>
            D&apos;ici 2030, chaque PME en Afrique francophone et en France aura accès à un plan de transformation digitale concret — sans consultant hors de prix, sans jargon inutile.
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
