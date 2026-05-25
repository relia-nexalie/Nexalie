import Link from 'next/link';

export const metadata = {
  title: 'Comment ça marche — Nexalie',
  description: 'En 3 étapes simples : répondez à 20 questions, obtenez votre score et plan d\'action IA, puis avancez action par action chaque lundi.',
  alternates: { canonical: 'https://nexalie-ecqc.vercel.app/comment-ca-marche' },
};

const STEPS = [
  {
    num: '01',
    emoji: '💬',
    title: 'Tu réponds',
    sub: '20 questions · 15-20 minutes',
    color: '#4EC9B0',
    points: [
      'Secteur d\'activité, taille d\'équipe, pays',
      'Outils déjà en place, processus existants',
      'Relation client, présence digitale',
      'Aucun jargon technique — questions claires',
    ],
    cta: null,
  },
  {
    num: '02',
    emoji: '⚡',
    title: 'L\'IA analyse',
    sub: 'Score sur 100 · Plan d\'action · Rapport PDF',
    color: '#C9A84C',
    points: [
      'Score de maturité digitale sur 100',
      '5 axes évalués : Stratégie, Outils, Équipes, Client, Processus',
      '5 actions prioritaires avec outils précis (nom, coût, délai)',
      'Rapport PDF téléchargeable immédiatement',
    ],
    cta: null,
  },
  {
    num: '03',
    emoji: '🚀',
    title: 'Tu avances',
    sub: 'Une action par lundi · Progression visible',
    color: '#7B5EA7',
    points: [
      'Chaque lundi à 8h : ta prochaine priorité par email',
      'Tableau de bord pour suivre ta progression',
      'Roadmap 12 mois générée par l\'IA',
      'Score qui évolue audit après audit',
    ],
    cta: null,
  },
];

export default function CommentCaMarchePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* Nav */}
      <nav style={{ background: '#0A1628', padding: '0 32px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: '#4EC9B0' }}>AI</span>
          </Link>
          <Link href="/audit" style={{ padding: '8px 20px', background: '#4EC9B0', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>
            Démarrer →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0A1628', padding: 'clamp(56px,8vw,96px) 24px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px', textTransform: 'uppercase' }}>
          Processus
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(28px,5vw,52px)', fontWeight: 300, color: '#fff', marginBottom: '16px', lineHeight: 1.2 }}>
          Comment ça marche
        </h1>
        <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.55)', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          En 3 étapes, Nexalie transforme 20 minutes de réponses en un plan d&apos;action digital concret — adapté à votre entreprise.
        </p>
        <Link href="/audit" style={{ padding: '14px 36px', background: '#4EC9B0', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(78,201,176,0.35)' }}>
          Essayer maintenant — c&apos;est gratuit →
        </Link>
      </section>

      {/* 3 étapes */}
      <section style={{ padding: 'clamp(48px,6vw,80px) 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '48px' }}>
          {STEPS.map((step, idx) => (
            <div key={step.num} style={{ display: 'grid', gridTemplateColumns: idx % 2 === 0 ? '1fr 2fr' : '2fr 1fr', gap: '40px', alignItems: 'center' }}>

              {/* Numéro + emoji — côté variable selon step */}
              {idx % 2 !== 0 && (
                <div style={{ textAlign: 'center', padding: '32px', background: `${step.color}10`, border: `2px solid ${step.color}30`, borderRadius: '20px' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '64px', fontWeight: 700, color: step.color, lineHeight: 1, marginBottom: '8px' }}>{step.num}</p>
                  <p style={{ fontSize: '48px' }}>{step.emoji}</p>
                </div>
              )}

              {/* Contenu */}
              <div>
                <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: step.color, marginBottom: '8px', textTransform: 'uppercase' }}>Étape {step.num}</p>
                <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 300, color: '#0A1628', marginBottom: '6px' }}>
                  {step.title}
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7A94', fontFamily: 'monospace', marginBottom: '20px', letterSpacing: '0.5px' }}>{step.sub}</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {step.points.map((p, i) => (
                    <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ color: step.color, fontSize: '16px', lineHeight: '1.5', flexShrink: 0 }}>✓</span>
                      <p style={{ fontSize: '15px', color: '#3D4E6B', lineHeight: 1.6 }}>{p}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Numéro + emoji — gauche si step pair */}
              {idx % 2 === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', background: `${step.color}10`, border: `2px solid ${step.color}30`, borderRadius: '20px' }}>
                  <p style={{ fontFamily: 'monospace', fontSize: '64px', fontWeight: 700, color: step.color, lineHeight: 1, marginBottom: '8px' }}>{step.num}</p>
                  <p style={{ fontSize: '48px' }}>{step.emoji}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* FAQ rapide */}
      <section style={{ padding: '64px 24px', background: '#fff', borderTop: '1px solid rgba(0,0,0,0.06)', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, color: '#0A1628', textAlign: 'center', marginBottom: '36px' }}>
            Questions fréquentes
          </h2>
          {[
            ['Faut-il créer un compte ?', 'Non. L\'audit est 100% gratuit et sans inscription. Vous pouvez créer un compte à la fin pour sauvegarder vos résultats.'],
            ['Combien de temps ça prend ?', 'Entre 15 et 20 minutes. Chaque question est simple et directe — pas de jargon technique.'],
            ['Mes données sont-elles confidentielles ?', 'Oui. Vos réponses restent strictement privées. Nexalie ne partage aucune information avec des tiers.'],
            ['Qui peut faire cet audit ?', 'Tout dirigeant ou responsable d\'une TPE, PME, ou organisation en France ou en Afrique francophone.'],
          ].map(([q, a]) => (
            <div key={q} style={{ marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <p style={{ fontSize: '16px', fontWeight: 700, color: '#0A1628', marginBottom: '8px' }}>{q}</p>
              <p style={{ fontSize: '14px', color: '#6B7A94', lineHeight: 1.7 }}>{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '72px 24px', background: '#0A1628', textAlign: 'center' }}>
        <p style={{ fontSize: '40px', marginBottom: '16px' }}>🚀</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,36px)', fontWeight: 300, color: '#fff', marginBottom: '12px' }}>
          Prêt à découvrir votre score ?
        </h2>
        <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px' }}>
          Gratuit. 20 minutes. Résultats immédiats.
        </p>
        <Link href="/audit" style={{ padding: '15px 40px', background: '#4EC9B0', borderRadius: '10px', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
          Commencer mon audit →
        </Link>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)', marginTop: '16px' }}>
          Sans carte bancaire · Sans engagement · Sans inscription obligatoire
        </p>
      </section>

    </div>
  );
}
