import Link from 'next/link';

const AXES = [
  { label: 'Présence en ligne', pct: 82 },
  { label: 'Paiement & vente',  pct: 70 },
  { label: 'Gestion interne',   pct: 38 },
  { label: 'Relation client',   pct: 55 },
];

const STEPS = [
  {
    n: '01',
    title: 'Vous répondez',
    body: "Un questionnaire simple sur votre activité, vos outils, vos habitudes. 15 minutes depuis votre téléphone.",
  },
  {
    n: '02',
    title: 'On analyse',
    body: "Nexalie évalue votre maturité sur les axes qui comptent vraiment pour une PME comme la vôtre.",
  },
  {
    n: '03',
    title: 'Vous agissez',
    body: "Votre score, vos 3 priorités et un plan d'action daté. Vous savez exactement par où commencer.",
  },
];

export default function NexaliSite() {
  return (
    <div style={{ background: '#0f172a', color: '#f8fafc', fontFamily: 'var(--font-jakarta, "Plus Jakarta Sans", sans-serif)', minHeight: '100vh' }}>

      {/* ── NAV ────────────────────────────────────────────────────── */}
      <nav className="lp-nav" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '24px 48px',
        borderBottom: '1px solid rgba(148,163,184,.15)',
        position: 'sticky',
        top: 0,
        background: 'rgba(15,23,42,.92)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        zIndex: 100,
      }}>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.5px' }}>
          Nexalie<span style={{ color: '#f59e0b' }}>.</span>
        </div>

        <div className="lp-nav-links" style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <Link href="/audit"             style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', textDecoration: 'none' }}>Le diagnostic</Link>
          <Link href="#comment-ca-marche" style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', textDecoration: 'none' }}>Comment ça marche</Link>
          <Link href="/pricing"           style={{ fontSize: 14, fontWeight: 500, color: '#94a3b8', textDecoration: 'none' }}>Tarif</Link>
          <Link href="/audit" style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 700, fontSize: 14, padding: '10px 20px', borderRadius: 8, textDecoration: 'none' }}>
            Commencer
          </Link>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="lp-hero" style={{
        maxWidth: 1200,
        margin: '0 auto',
        padding: '80px 48px 60px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center',
      }}>
        {/* Colonne texte */}
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#f59e0b', marginBottom: 24 }}>
            <span style={{ width: 20, height: 2, background: '#f59e0b', display: 'block', flexShrink: 0 }} />
            Le copilote numérique des PME africaines
          </div>

          <h1 className="lp-h1" style={{ fontSize: 52, fontWeight: 800, lineHeight: 1.05, letterSpacing: '-1.5px', marginBottom: 20, color: '#f8fafc' }}>
            Savoir{' '}
            <span style={{ color: '#f59e0b' }}>exactement</span>
            {' '}où en est votre entreprise.
          </h1>

          <p style={{ fontSize: 17, color: '#94a3b8', marginBottom: 36, maxWidth: 440, lineHeight: 1.7 }}>
            En 15 minutes, Nexalie évalue votre maturité numérique et vous donne
            un plan d&apos;action clair. Pas de jargon. Juste les bonnes priorités.
          </p>

          <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16 }}>
            <Link href="/audit" style={{ background: '#f59e0b', color: '#0f172a', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 10, textDecoration: 'none' }}>
              Faire mon diagnostic
            </Link>
            <Link href="/audit" style={{ color: '#94a3b8', fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              Voir un exemple →
            </Link>
          </div>

          <p style={{ fontSize: 13, color: '#94a3b8' }}>
            Paiement unique <strong style={{ color: '#f8fafc' }}>50 000 FCFA</strong> · Mobile Money accepté
          </p>
        </div>

        {/* Score card */}
        <div style={{
          background: '#1e293b',
          border: '1px solid rgba(148,163,184,.15)',
          borderRadius: 20,
          padding: 32,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div aria-hidden="true" style={{
            position: 'absolute', top: -80, right: -80,
            width: 220, height: 220,
            background: 'radial-gradient(circle, rgba(245,158,11,.12), transparent 70%)',
            pointerEvents: 'none',
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#94a3b8', marginBottom: 24 }}>
            <span>Votre rapport Nexalie</span>
            <span style={{ color: '#f59e0b', fontSize: 12, letterSpacing: 0, textTransform: 'none', fontWeight: 500 }}>● En direct</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
            <span className="lp-score-num" style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, letterSpacing: '-4px', color: '#f8fafc' }}>64</span>
            <span style={{ fontSize: 32, fontWeight: 300, color: '#94a3b8' }}>/ 100</span>
          </div>

          <div style={{ fontSize: 14, color: '#f59e0b', fontWeight: 600, marginBottom: 28 }}>
            Bien partie · 3 priorités identifiées
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {AXES.map(({ label, pct }) => (
              <div key={label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: '#94a3b8', marginBottom: 6 }}>
                  <span>{label}</span>
                  <span style={{ color: '#f8fafc', fontWeight: 600 }}>{pct}%</span>
                </div>
                <div style={{ height: 5, background: 'rgba(255,255,255,.08)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 4, background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ height: 1, background: 'rgba(148,163,184,.15)', margin: '24px 0' }} />
          <p style={{ fontSize: 13, color: '#94a3b8', fontStyle: 'italic' }}>
            Votre plan d&apos;action complet vous attend dans le rapport.
          </p>
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────────────────── */}
      <div id="comment-ca-marche" style={{ maxWidth: 1200, margin: '0 auto' }}>
        <section className="lp-how" style={{ borderTop: '1px solid rgba(148,163,184,.15)', padding: '72px 48px' }}>
          <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: 2, textTransform: 'uppercase', color: '#f59e0b', marginBottom: 16 }}>
            Comment ça marche
          </p>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 10, color: '#f8fafc' }}>
            Trois étapes, un cap clair.
          </h2>
          <p style={{ fontSize: 16, color: '#94a3b8', marginBottom: 48, maxWidth: 500, lineHeight: 1.7 }}>
            Nexalie ne vous laisse pas avec un simple score. Vous repartez avec un plan
            d&apos;action que vous pouvez appliquer dès demain.
          </p>

          <div className="lp-steps" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 2,
            background: 'rgba(148,163,184,.15)',
            borderRadius: 16,
            overflow: 'hidden',
          }}>
            {STEPS.map(({ n, title, body }) => (
              <div key={n} style={{ background: '#0f172a', padding: '32px 28px' }}>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#f59e0b', marginBottom: 16, textTransform: 'uppercase' }}>
                  Étape {n}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, color: '#f8fafc' }}>{title}</h3>
                <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.65 }}>{body}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── BAND CTA ────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div className="lp-band" style={{
          margin: '0 48px 80px',
          background: '#1e293b',
          border: '1px solid rgba(148,163,184,.15)',
          borderRadius: 20,
          padding: '56px 48px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 40,
        }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 10, color: '#f8fafc' }}>
              Votre plan d&apos;action vous attend.
            </h2>
            <p style={{ fontSize: 16, color: '#94a3b8' }}>
              Quinze minutes aujourd&apos;hui. Une longueur d&apos;avance pour demain.
            </p>
          </div>
          <Link href="/audit" style={{
            background: '#f59e0b',
            color: '#0f172a',
            fontWeight: 700,
            fontSize: 16,
            padding: '16px 32px',
            borderRadius: 10,
            textDecoration: 'none',
            display: 'inline-block',
            whiteSpace: 'nowrap',
          }}>
            Faire mon diagnostic — 50 000 FCFA
          </Link>
        </div>
      </div>

    </div>
  );
}
