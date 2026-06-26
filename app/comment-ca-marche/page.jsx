import Link from 'next/link';

export const metadata = {
  title: 'Comment ça marche · Nexalie',
  description: 'Trois étapes simples : 20 questions depuis votre téléphone, un score clair, un plan d\'action daté. Une action par semaine. Vous savez exactement quoi faire lundi matin.',
  alternates: { canonical: 'https://nexalie.co/comment-ca-marche' },
};

const BG      = 'var(--nx-bg)';
const BG2     = 'var(--nx-bg2)';
const ACCENT  = 'var(--nx-accent)';
const ACTION  = 'var(--nx-accent-action)';
const TEXT    = 'var(--nx-text)';
const MUTED   = 'rgba(245,240,232,.55)';
const CREAM   = 'var(--nx-section-bg)';
const DARK    = 'var(--nx-section-text)';
const BORDER  = 'var(--nx-border)';

const STEPS = [
  {
    num: '01',
    title: 'Vous répondez',
    sub: '20 questions · 15 minutes · sur mobile',
    points: [
      'Vingt questions simples sur votre activité, vos outils, vos habitudes.',
      'Quinze minutes, sur votre téléphone, même avec une connexion lente.',
      'Pas de jargon technique : tout le monde comprend.',
      'Vos réponses sont sauvegardées au fur et à mesure. Si la connexion coupe, vous reprenez là où vous étiez.',
    ],
  },
  {
    num: '02',
    title: 'On regarde ensemble',
    sub: 'Score · Forces · Priorités · Votre réalité',
    points: [
      'Nexalie évalue ce qui compte vraiment pour une entreprise comme la vôtre, pas pour une multinationale.',
      'Score de maturité sur 100 et 6 dimensions analysées.',
      'Vos 3 priorités, classées dans le bon ordre.',
      'Un plan daté, avec des outils accessibles depuis votre pays.',
    ],
  },
  {
    num: '03',
    title: 'Vous avancez',
    sub: 'Une action par semaine · Suivi humain inclus',
    points: [
      'Votre note, vos 3 priorités, et un plan daté.',
      'Une action par semaine. Vous savez exactement quoi faire lundi matin.',
      'Votre rapport arrive sur WhatsApp : téléchargeable en PDF, lisible hors connexion.',
      'On reste joignables si vous avez une question.',
    ],
  },
];

export default function CommentCaMarchePage() {
  return (
    <div style={{ minHeight: '100vh', background: CREAM, fontFamily: 'var(--font-jakarta, -apple-system, sans-serif)' }}>

      {/* Hero */}
      <section style={{ background: BG, padding: 'clamp(56px,8vw,96px) 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '3px', color: 'rgba(201,162,75,.6)', marginBottom: '16px', textTransform: 'uppercase' }}>
          Processus
        </p>
        <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,5vw,52px)', fontWeight: 300, color: TEXT, marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          Trois étapes, un cap clair.
        </h1>
        <p style={{ fontSize: '17px', color: MUTED, maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.8 }}>
          Nexalie ne vous laisse pas seul avec un score. Vous repartez avec un plan que vous pouvez appliquer dès la semaine prochaine.
        </p>
        <Link href="/audit" style={{ padding: '15px 36px', background: ACTION, borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(212,144,12,.35)' }}>
          Je fais mon diagnostic gratuit
        </Link>
        <p style={{ marginTop: '12px', fontSize: '12px', color: 'rgba(245,240,232,.35)', fontFamily: 'var(--font-mono, monospace)' }}>
          Gratuit pendant la bêta · accompagnement humain inclus
        </p>
      </section>

      {/* 3 étapes */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px' }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '64px' }}>
          {STEPS.map((step, idx) => (
            <div key={step.num} style={{ display: 'grid', gridTemplateColumns: idx % 2 === 0 ? 'auto 1fr' : '1fr auto', gap: '48px', alignItems: 'center' }}>

              {idx % 2 !== 0 && (
                <div style={{ textAlign: 'center', padding: '40px 32px', background: BG, border: `1px solid ${BORDER}`, borderRadius: '20px' }}>
                  <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '72px', fontWeight: 300, color: TEXT, lineHeight: 1, marginBottom: '4px', letterSpacing: '-3px' }}>{step.num}</p>
                  <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Étape</p>
                </div>
              )}

              <div>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '2.5px', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' }}>
                  Étape {step.num}
                </p>
                <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 400, color: DARK, marginBottom: '8px', letterSpacing: '-0.01em' }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: '13px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '24px', letterSpacing: '0.05em' }}>{step.sub}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {step.points.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                      <span style={{ color: ACCENT, fontSize: '15px', lineHeight: '1.7', flexShrink: 0, marginTop: '1px' }}>✓</span>
                      <p style={{ fontSize: '15px', color: '#374151', lineHeight: 1.75 }}>{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {idx % 2 === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 32px', background: BG, border: `1px solid ${BORDER}`, borderRadius: '20px' }}>
                  <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '72px', fontWeight: 300, color: TEXT, lineHeight: 1, marginBottom: '4px', letterSpacing: '-3px' }}>{step.num}</p>
                  <p style={{ fontSize: '11px', fontFamily: 'var(--font-mono, monospace)', color: ACCENT, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Étape</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ rapide */}
      <section style={{ padding: 'clamp(48px,6vw,72px) 24px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 400, color: DARK, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.01em' }}>
            Questions fréquentes
          </h2>
          {[
            ['Faut-il créer un compte ?', 'Non. Le diagnostic est 100 % gratuit et sans inscription. Vous pouvez créer un compte à la fin pour sauvegarder vos résultats et suivre votre progression.'],
            ['Combien de temps ça prend ?', 'Entre 15 et 20 minutes. Chaque question est simple et directe. Si vous devez vous interrompre, vos réponses sont sauvegardées automatiquement.'],
            ['Mes données sont-elles confidentielles ?', 'Oui. Vos réponses restent strictement privées. Si des données agrégées et anonymisées sont partagées avec des partenaires institutionnels, c\'est toujours sans aucune information permettant de vous identifier.'],
            ['Qui peut faire ce diagnostic ?', 'Tout dirigeant ou responsable d\'une TPE ou PME en Afrique francophone. Commerce, BTP, services, agri-business, médias... peu importe votre secteur.'],
          ].map(([q, a]) => (
            <div key={q} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: DARK, marginBottom: '8px' }}>{q}</p>
              <p style={{ fontSize: '14px', color: '#4B5563', lineHeight: 1.8 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: 'clamp(56px,7vw,88px) 24px', background: BG, textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,4vw,42px)', fontWeight: 300, color: TEXT, marginBottom: '14px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
          Prêt à savoir où en est vraiment votre entreprise ?
        </h2>
        <p style={{ fontSize: '15px', color: MUTED, marginBottom: '32px', lineHeight: 1.7 }}>
          Gratuit · 15 minutes · depuis votre téléphone · résultats immédiats
        </p>
        <Link href="/audit" style={{ padding: '16px 40px', background: ACTION, borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(212,144,12,.35)' }}>
          Je fais mon diagnostic gratuit
        </Link>
        <p style={{ fontSize: '12px', color: 'rgba(245,240,232,.3)', marginTop: '16px', fontFamily: 'var(--font-mono, monospace)' }}>
          Gratuit pendant la bêta · places limitées · accompagnement humain inclus
        </p>
      </section>

    </div>
  );
}
