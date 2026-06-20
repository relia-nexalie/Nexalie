import MotifBackground from '@/components/MotifBackground';

export const metadata = {
  title: 'Institutions & Partenaires — Nexalie',
  description: "Nexalie accompagne les institutions, bailleurs de fonds et réseaux d'appui dans la digitalisation des PME africaines. Données agrégées, outils de diagnostic, impact mesurable.",
};

export default function InstitutionsPage() {
  const navy   = '#1F5F4A';
  const gold   = '#C8A96B';
  const cream  = '#F8F6F1';

  const figures = [
    { value: '90 000',  label: 'PME formelles en République du Congo', note: 'Source : Ministère des PME, 2023' },
    { value: '93,4 %',  label: 'opèrent dans le secteur informel',     note: 'Soit ~840 000 unités économiques non structurées' },
    { value: '95 %',    label: 'de l\'économie réelle portée par les PME', note: 'Emploi, valeur ajoutée locale, maillage territorial' },
    { value: '< 12 %',  label: 'disposent d\'outils numériques actifs', note: 'Estimation Nexalie / enquêtes terrain 2024' },
  ];

  const useCases = [
    {
      title: 'Bailleurs de fonds & agences de développement',
      body: 'Intégrez le diagnostic Nexalie dans vos programmes d\'appui aux PME. Obtenez une cartographie de la maturité numérique de votre portefeuille : en temps réel, sans déploiement technique.',
      icon: '◈',
    },
    {
      title: 'Chambres de commerce & réseaux d\'appui',
      body: 'Proposez à vos membres un outil d\'autodiagnostic en marque blanche. Identifiez les besoins prioritaires, orientez vos formations et mesurer l\'impact de vos interventions.',
      icon: '◉',
    },
    {
      title: 'Ministères & politiques publiques',
      body: 'Accédez à des données agrégées et anonymisées sur l\'état de la digitalisation des PME par secteur et par région. Pilotez vos stratégies numériques sur la base de preuves.',
      icon: '◇',
    },
  ];

  const steps = [
    { n: '01', label: 'Diagnostic standardisé', body: 'Les PME passent un audit de maturité digitale en 5 minutes. Les résultats sont structurés selon 6 dimensions clés (présence en ligne, outillage, automatisation, financement numérique, cybersécurité, data).' },
    { n: '02', label: 'Feuille de route personnalisée', body: 'Chaque PME reçoit un plan d\'action priorisé, adapté à son secteur et à ses ressources. L\'IA recommande des outils accessibles au contexte africain (Wave, CinetPay, Notion, Make…).' },
    { n: '03', label: 'Tableau de bord agrégé', body: 'Vos équipes accèdent à un tableau de bord consolidé : répartition des scores, taux de complétion, secteurs prioritaires, évolution dans le temps, exportable en CSV ou PDF.' },
  ];

  return (
    <main style={{ background: '#fff', fontFamily: 'var(--font-jakarta, sans-serif)' }}>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', background: navy, padding: '80px 24px 72px' }}>
        <MotifBackground name="tukula" opacity={0.06} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '3px', height: '20px', background: gold, borderRadius: '2px' }} />
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, margin: 0 }}>
              Pour les institutions &amp; partenaires
            </p>
          </div>
          <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(34px, 5.5vw, 56px)', fontWeight: 400, color: '#fff', lineHeight: 1.2, marginBottom: '24px', letterSpacing: '-0.02em' }}>
            Vous financez leur développement. Nexalie vous montre où votre impact est le plus fort.
          </h1>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, maxWidth: '600px', marginBottom: '40px' }}>
            Les diagnostics réalisés par les PME alimentent, de façon anonymisée, un tableau de bord agrégé. Ministères, bailleurs et chambres de commerce disposent ainsi d'une vision claire du tissu économique local, pour cibler leurs financements là où l'impact sera le plus fort.
          </p>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <a
              href="mailto:contact@nexalie.com?subject=Partenariat institutionnel"
              style={{ background: gold, color: navy, textDecoration: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: 700, fontSize: '14px', display: 'inline-block' }}
            >
              Nous contacter →
            </a>
            <a
              href="mailto:contact@nexalie.com?subject=Demande de démonstration"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', textDecoration: 'none', padding: '14px 28px', borderRadius: '8px', fontWeight: 500, fontSize: '14px', display: 'inline-block' }}
            >
              Demander une démonstration
            </a>
          </div>
        </div>
      </section>

      {/* ── Chiffres clés ───────────────────────────────────────── */}
      <section style={{ background: cream, padding: '72px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, marginBottom: '16px' }}>
            Contexte
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, color: navy, marginBottom: '48px', letterSpacing: '-0.01em' }}>
            La digitalisation des PME africaines : un enjeu systémique
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            {figures.map((f, i) => (
              <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '36px', fontWeight: 300, color: navy, marginBottom: '8px' }}>{f.value}</p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A', marginBottom: '8px', lineHeight: 1.4 }}>{f.label}</p>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#94A3B8', lineHeight: 1.5 }}>{f.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Cas d'usage ─────────────────────────────────────────── */}
      <section style={{ background: '#fff', padding: '72px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, marginBottom: '16px' }}>
            Qui nous utilise
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, color: navy, marginBottom: '48px', letterSpacing: '-0.01em' }}>
            Une solution pour chaque acteur de l'écosystème
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {useCases.map((u) => (
              <div key={u.title} style={{ border: '1px solid #E2E8F0', borderRadius: '8px', padding: '32px 28px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div style={{ width: '40px', height: '40px', border: '1px solid #E2E8F0', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '18px', color: navy, marginBottom: '20px' }}>
                  {u.icon}
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: navy, marginBottom: '12px', lineHeight: 1.4 }}>{u.title}</p>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.7 }}>{u.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Comment ça marche ────────────────────────────────────── */}
      <section style={{ background: cream, padding: '72px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', color: gold, marginBottom: '16px' }}>
            Fonctionnement
          </p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, color: navy, marginBottom: '48px', letterSpacing: '-0.01em' }}>
            De l'audit individuel aux données agrégées
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {steps.map((s) => (
              <div key={s.n} style={{ display: 'flex', gap: '24px', alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: gold, fontWeight: 700, letterSpacing: '0.1em', minWidth: '28px', paddingTop: '2px' }}>
                  {s.n}
                </div>
                <div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: navy, marginBottom: '8px' }}>{s.label}</p>
                  <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.7 }}>{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ───────────────────────────────────────────── */}
      <section style={{ background: navy, padding: '72px 24px' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px, 4.5vw, 46px)', fontWeight: 400, color: '#fff', marginBottom: '20px', letterSpacing: '-0.01em' }}>
            Travaillons ensemble
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, marginBottom: '36px' }}>
            Que vous soyez une agence de développement, un réseau d'entrepreneurs ou un ministère, nous concevons une intégration adaptée à votre contexte et vos objectifs.
          </p>
          <a
            href="mailto:contact@nexalie.com?subject=Partenariat institutionnel"
            style={{ background: gold, color: navy, textDecoration: 'none', padding: '16px 36px', borderRadius: '8px', fontWeight: 700, fontSize: '15px', display: 'inline-block' }}
          >
            Prendre contact →
          </a>
        </div>
      </section>

    </main>
  );
}
