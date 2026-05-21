import Link from 'next/link';

export const metadata = {
  title: 'Nexalie — Ton chef de projet digital, 24h/24',
  description: 'Nexalie analyse ton entreprise, crée ton plan d\'action et te guide semaine après semaine. Fait pour les entrepreneurs africains.',
  robots: { index: false, follow: false },
};

const NAVY      = '#0A1628';
const TERRA     = '#C25C2A';
const TERRA_LIGHT = '#FBF0EB';
const GOLD      = '#C9A84C';
const GOLD_LIGHT = '#FDF8EE';

export default function DemoPage() {
  return (
    <div style={{ background: '#fff', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', color: NAVY, overflowX: 'hidden' }}>

      {/* ── LOGO ──────────────────────────────────────────────────── */}
      <div style={{ textAlign: 'center', padding: '24px 20px 0' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <span style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, color: NAVY }}>Nexalie</span>
          <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: TERRA, marginLeft: '5px' }}>AI</span>
        </Link>
      </div>

      {/* ── SECTION 1 — ACCROCHE ──────────────────────────────────── */}
      <section style={{ padding: '40px 24px 48px', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>

        {/* Badge animé */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: TERRA_LIGHT, border: `1.5px solid ${TERRA}`,
          borderRadius: '99px', padding: '6px 16px',
          fontSize: '13px', fontWeight: 700, color: TERRA,
          marginBottom: '28px',
          animation: 'pulse 2.5s ease-in-out infinite',
        }}>
          🇨🇬 Fait pour l&apos;Afrique
        </div>

        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: 'clamp(28px, 7vw, 42px)',
          fontWeight: 400, lineHeight: 1.2,
          color: NAVY, marginBottom: '20px',
        }}>
          Ton chef de projet digital.<br />
          <span style={{ color: TERRA }}>24h/24. Sans salaire.</span>
        </h1>

        <p style={{ fontSize: '17px', color: '#4B5563', lineHeight: 1.65, marginBottom: '36px' }}>
          Nexalie analyse ton entreprise,<br />
          crée ton plan d&apos;action et te guide<br />
          semaine après semaine.
        </p>

        <Link href="/audit" style={{
          display: 'inline-block',
          background: TERRA, color: '#fff',
          padding: '18px 32px', borderRadius: '12px',
          textDecoration: 'none', fontWeight: 700,
          fontSize: '16px', lineHeight: 1.3,
          boxShadow: `0 6px 24px ${TERRA}44`,
          width: '100%', maxWidth: '360px',
          textAlign: 'center',
        }}>
          Faire mon bilan gratuit — 20 min →
        </Link>

        <p style={{ marginTop: '12px', fontSize: '13px', color: '#9CA3AF' }}>Gratuit · Sans inscription · En français</p>
      </section>

      {/* ── SECTION 2 — TÉMOIGNAGES ───────────────────────────────── */}
      <section style={{ background: '#F9FAFB', padding: '48px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '28px' }}>
            Ils l&apos;ont testé
          </p>

          {[
            {
              quote: "Avant Nexalie je ne savais pas par où commencer. En 20 minutes j'avais mon plan.",
              name: 'Marie',
              role: 'Commerce · Brazzaville',
            },
            {
              quote: "Le rapport m'a montré exactement ce qui bloquait mes ventes.",
              name: 'Patrick',
              role: 'BTP · Pointe-Noire',
            },
            {
              quote: "J'ai montré le rapport à ma banque. Ils ont accepté mon prêt.",
              name: 'Sylvie',
              role: 'Restauration · Douala',
            },
          ].map((t, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '14px',
              border: '1.5px solid rgba(0,0,0,0.07)',
              padding: '20px 22px', marginBottom: '14px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
            }}>
              <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.6, marginBottom: '12px', fontStyle: 'italic' }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: NAVY, margin: 0 }}>— {t.name}</p>
              <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '2px 0 0' }}>{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SECTION 3 — COMMENT ÇA MARCHE ────────────────────────── */}
      <section style={{ padding: '48px 24px', maxWidth: '480px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '28px' }}>
          Comment ça marche
        </p>

        {[
          { num: '1', emoji: '✏️', title: 'Tu réponds à 20 questions', sub: '20 minutes · Sur ton téléphone' },
          { num: '2', emoji: '⚡', title: 'Nexalie analyse et génère ton plan', sub: 'Score, points forts, axes d\'amélioration' },
          { num: '3', emoji: '📄', title: 'Tu reçois ton rapport PDF par email', sub: 'Plan d\'action priorisé · À montrer à ta banque' },
        ].map((step, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '28px' }}>
            <div style={{
              width: '44px', height: '44px', flexShrink: 0,
              background: TERRA_LIGHT, border: `2px solid ${TERRA}`,
              borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 700, color: TERRA,
            }}>
              {step.num}
            </div>
            <div style={{ paddingTop: '4px' }}>
              <p style={{ fontWeight: 700, fontSize: '16px', color: NAVY, margin: '0 0 4px' }}>
                {step.emoji} {step.title}
              </p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>{step.sub}</p>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '8px' }}>
          <Link href="/audit" style={{
            display: 'inline-block',
            background: TERRA, color: '#fff',
            padding: '16px 32px', borderRadius: '12px',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            width: '100%', maxWidth: '360px', textAlign: 'center',
          }}>
            Commencer maintenant →
          </Link>
        </div>
      </section>

      {/* ── SECTION 4 — OFFRE OSIANE ──────────────────────────────── */}
      <section style={{ padding: '0 20px 56px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{
          background: `linear-gradient(135deg, ${TERRA} 0%, #A0421E 100%)`,
          border: `2.5px solid ${GOLD}`,
          borderRadius: '18px', padding: '32px 24px',
          textAlign: 'center', position: 'relative',
          boxShadow: `0 12px 40px ${TERRA}33`,
        }}>
          {/* Coin or décoratif */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', width: '28px', height: '28px', border: `1.5px solid ${GOLD}`, borderRight: 'none', borderBottom: 'none', opacity: 0.6 }} />
          <div style={{ position: 'absolute', top: '14px', right: '14px', width: '28px', height: '28px', border: `1.5px solid ${GOLD}`, borderLeft: 'none', borderBottom: 'none', opacity: 0.6 }} />

          <p style={{ fontSize: '26px', marginBottom: '8px' }}>🎁</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 400, color: '#fff', marginBottom: '16px', lineHeight: 1.3 }}>
            Offre spéciale OSIANE 2026
          </h2>

          <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '16px 20px', marginBottom: '20px' }}>
            <p style={{ color: '#fff', fontSize: '20px', fontWeight: 700, margin: '0 0 8px' }}>3 mois Pro gratuits</p>
            <div style={{ background: GOLD_LIGHT, borderRadius: '8px', padding: '8px 16px', display: 'inline-block' }}>
              <p style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: TERRA, letterSpacing: '2px', margin: 0 }}>OSIANE2026</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '13px', marginBottom: '20px' }}>
            Valable jusqu&apos;au 5 juin uniquement
          </p>

          <Link href="/beta" style={{
            display: 'inline-block',
            background: GOLD, color: NAVY,
            padding: '16px 36px', borderRadius: '10px',
            textDecoration: 'none', fontWeight: 700, fontSize: '15px',
            width: '100%', maxWidth: '280px', textAlign: 'center',
            boxShadow: `0 4px 16px ${GOLD}55`,
          }}>
            Je prends l&apos;offre →
          </Link>
        </div>
      </section>

      {/* ── SECTION 5 — NEXALIE GOV ───────────────────────────────── */}
      <section style={{ background: '#F9FAFB', padding: '48px 20px' }}>
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '16px', textAlign: 'center' }}>
            Institutions &amp; Gouvernements
          </p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 400, color: NAVY, textAlign: 'center', marginBottom: '24px' }}>
            Pour les institutions et ministères
          </h2>

          {/* Dashboard simulé */}
          <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: NAVY, margin: 0 }}>Score moyen national · Congo</p>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: TERRA, fontWeight: 400, margin: 0 }}>31<span style={{ fontSize: '14px', color: '#9CA3AF' }}>/100</span></p>
            </div>

            <p style={{ fontSize: '11px', color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: 700 }}>Secteurs les plus en retard</p>
            {[
              { label: 'Agriculture & Agro-alimentaire', score: 18, pct: 18 },
              { label: 'Commerce & Distribution',       score: 24, pct: 24 },
              { label: 'BTP & Construction',            score: 27, pct: 27 },
            ].map((s, i) => (
              <div key={i} style={{ marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: '#374151' }}>{s.label}</span>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: TERRA }}>{s.score}/100</span>
                </div>
                <div style={{ height: '5px', background: '#F3F4F6', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.pct}%`, background: TERRA, borderRadius: '99px' }} />
                </div>
              </div>
            ))}
          </div>

          <p style={{ fontSize: '15px', color: '#4B5563', lineHeight: 1.65, textAlign: 'center', marginBottom: '24px' }}>
            Nexalie permet aux gouvernements de piloter la transformation digitale de leur économie en temps réel.
          </p>

          <div style={{ textAlign: 'center' }}>
            <Link href="/marque-blanche" style={{
              display: 'inline-block',
              border: `2px solid ${NAVY}`, color: NAVY,
              padding: '14px 28px', borderRadius: '10px',
              textDecoration: 'none', fontWeight: 700, fontSize: '14px',
              background: 'transparent',
            }}>
              En savoir plus →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 6 — QR CODE ───────────────────────────────────── */}
      <section style={{ padding: '56px 20px', textAlign: 'center' }}>
        <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#9CA3AF', textTransform: 'uppercase', marginBottom: '24px' }}>
          Accès rapide
        </p>
        <div style={{ display: 'inline-block', background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '16px', padding: '20px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://nexalie.co/demo&bgcolor=ffffff&color=0A1628&margin=8"
            alt="QR Code Nexalie Demo"
            width={180}
            height={180}
            style={{ display: 'block', margin: '0 auto 14px' }}
          />
          <p style={{ fontWeight: 700, fontSize: '14px', color: NAVY, margin: '0 0 4px' }}>Scanne pour accéder à Nexalie</p>
          <p style={{ fontFamily: 'monospace', fontSize: '12px', color: '#9CA3AF', margin: 0 }}>nexalie.co/demo</p>
        </div>
      </section>

      {/* ── FOOTER MINIMAL ────────────────────────────────────────── */}
      <footer style={{ background: NAVY, padding: '36px 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff', marginBottom: '4px' }}>
          Nexalie
          <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', color: TERRA, marginLeft: '4px' }}>AI</span>
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', margin: '0 0 16px', lineHeight: 1.6 }}>
          Par Rélia Ebiya · Franco-congolaise · Fondatrice Nexalie
        </p>
        <a href="mailto:relia.ebiya@gmail.com" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none', display: 'block', marginBottom: '4px' }}>
          relia.ebiya@gmail.com
        </a>
        <a href="tel:+33786620409" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px', textDecoration: 'none' }}>
          +33 7 86 62 04 09
        </a>
      </footer>

      {/* Keyframe pulse pour le badge */}
      <style>{`
        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(194, 92, 42, 0.25); }
          50%       { box-shadow: 0 0 0 8px rgba(194, 92, 42, 0); }
        }
      `}</style>
    </div>
  );
}
