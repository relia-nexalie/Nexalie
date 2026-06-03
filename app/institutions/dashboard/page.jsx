import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

// Protection simple par token d'accès passé en query param : ?token=XXX
// Configurer INSTITUTIONS_DASHBOARD_TOKEN dans les variables d'environnement.
// Exemple d'accès : /institutions/dashboard?token=votre-token-secret

export const dynamic = 'force-dynamic';

async function getStats() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: leads, error } = await supabase
    .from('leads')
    .select('score, source, created_at')
    .order('created_at', { ascending: false });

  if (error || !leads) return null;

  const total = leads.length;
  const withScore = leads.filter(l => l.score !== null);
  const avgScore = withScore.length
    ? Math.round(withScore.reduce((s, l) => s + l.score, 0) / withScore.length)
    : null;

  const bySource = leads.reduce((acc, l) => {
    acc[l.source] = (acc[l.source] || 0) + 1;
    return acc;
  }, {});

  // Distribution des scores par tranche de 10
  const distribution = Array.from({ length: 10 }, (_, i) => ({
    label: `${i * 10}–${i * 10 + 9}`,
    count: withScore.filter(l => l.score >= i * 10 && l.score <= i * 10 + 9).length,
  }));

  // Derniers 30 jours
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);
  const last30 = leads.filter(l => new Date(l.created_at) >= cutoff).length;

  return { total, withScore: withScore.length, avgScore, bySource, distribution, last30, recent: leads.slice(0, 20) };
}

export default async function InstitutionsDashboardPage({ searchParams }) {
  const token = searchParams?.token;
  const expectedToken = process.env.INSTITUTIONS_DASHBOARD_TOKEN;

  if (!expectedToken || token !== expectedToken) {
    redirect('/institutions');
  }

  const stats = await getStats();

  if (!stats) {
    return (
      <main style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '13px', color: '#64748B' }}>
        Erreur de chargement des données.
      </main>
    );
  }

  const navy  = '#0F2A4A';
  const gold  = '#C9A84C';
  const cream = '#F5F3EE';

  const maxDist = Math.max(...stats.distribution.map(d => d.count), 1);

  return (
    <main style={{ background: cream, minHeight: '100vh', padding: '48px 24px', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, marginBottom: '8px' }}>
            Tableau de bord · Accès restreint
          </p>
          <h1 style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: '28px', fontWeight: 300, color: navy, margin: 0 }}>
            Données agrégées : Leads Nexalie
          </h1>
        </div>

        {/* KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px' }}>
          {[
            { label: 'Total leads',       value: stats.total,                          unit: '' },
            { label: 'Avec score',        value: stats.withScore,                      unit: `/ ${stats.total}` },
            { label: 'Score moyen',       value: stats.avgScore ?? '—',               unit: '/ 100' },
            { label: '30 derniers jours', value: stats.last30,                         unit: 'leads' },
          ].map((k, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '24px 20px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: '8px' }}>{k.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                <span style={{ fontFamily: 'var(--font-fraunces, serif)', fontSize: '32px', fontWeight: 300, color: navy }}>{k.value}</span>
                <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: '#94A3B8' }}>{k.unit}</span>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>

          {/* Distribution des scores */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: '20px' }}>Distribution des scores</p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '80px' }}>
              {stats.distribution.map((d, i) => (
                <div key={i} title={`${d.label} pts : ${d.count}`} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', height: '100%', justifyContent: 'flex-end' }}>
                  <div style={{ width: '100%', background: i >= 7 ? navy : (i >= 4 ? gold : '#CBD5E1'), borderRadius: '3px 3px 0 0', height: `${Math.max((d.count / maxDist) * 100, d.count > 0 ? 8 : 0)}%`, transition: 'height 0.3s' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', color: '#94A3B8' }}>0</span>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', color: '#94A3B8' }}>100</span>
            </div>
          </div>

          {/* Par source */}
          <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: '20px' }}>Par source</p>
            {Object.entries(stats.bySource).map(([src, count]) => (
              <div key={src} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                <span style={{ color: '#475569', fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}>{src}</span>
                <span style={{ fontWeight: 700, color: navy }}>{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Derniers leads */}
        <div style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '28px 24px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#94A3B8', marginBottom: '20px' }}>20 derniers leads</p>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                  {['Date', 'Source', 'Score'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#94A3B8', fontWeight: 400 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {stats.recent.map((l, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #F8FAFC' }}>
                    <td style={{ padding: '10px 12px', color: '#475569', fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}>
                      {new Date(l.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={{ padding: '10px 12px', color: '#475569', fontFamily: 'var(--font-mono, monospace)', fontSize: '11px' }}>{l.source}</td>
                    <td style={{ padding: '10px 12px', fontWeight: 700, color: l.score >= 70 ? '#059669' : (l.score >= 40 ? '#D97706' : (l.score !== null ? '#DC2626' : '#CBD5E1')) }}>
                      {l.score !== null ? `${l.score} / 100` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </main>
  );
}
