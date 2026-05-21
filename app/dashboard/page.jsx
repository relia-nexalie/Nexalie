import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Vue globale — Nexalie Admin' };

function StatCard({ label, value, icon, color = '#0A1628', sub }) {
  return (
    <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <p style={{ fontSize: '0.75rem', color: '#6B7A94', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>{label}</p>
          <p style={{ fontSize: '2rem', fontWeight: 800, color, margin: 0 }}>{value}</p>
          {sub && <p style={{ fontSize: '0.75rem', color: '#6B7A94', marginTop: '4px' }}>{sub}</p>}
        </div>
        <span style={{ fontSize: '1.6rem', opacity: 0.8 }}>{icon}</span>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') redirect('/');

  const [
    { count: totalUsers },
    { count: totalAudits },
    { count: totalRoadmaps },
    { data: profiles },
    { data: clientsActifs },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('audits').select('*', { count: 'exact', head: true }),
    supabase.from('roadmaps').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('plan, market, created_at, audit_score, full_name, pays').order('created_at', { ascending: false }).limit(200),
    supabase.from('clients').select('mensuel').eq('status', 'actif'),
  ]);

  const proUsers = profiles?.filter(p => p.plan && !['free', null, ''].includes(p.plan)).length || 0;
  const afUsers  = profiles?.filter(p => p.market === 'af').length || 0;
  const audited  = profiles?.filter(p => p.audit_score).length || 0;
  const avgScore = audited
    ? Math.round(profiles.filter(p => p.audit_score).reduce((s, p) => s + p.audit_score, 0) / audited)
    : null;
  const mrr = clientsActifs?.reduce((sum, c) => sum + (c.mensuel || 0), 0) || 0;

  const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ padding: '32px', maxWidth: '1100px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1628', marginBottom: '4px' }}>Vue globale</h1>
      <p style={{ color: '#6B7A94', marginBottom: '32px', fontSize: '0.88rem' }}>{today}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '40px' }}>
        <StatCard label="Utilisateurs" value={totalUsers ?? '—'} icon="👥" color="#0A1628" />
        <StatCard label="Comptes Pro+" value={proUsers} icon="⭐" color="#C9A84C" sub={totalUsers ? `${Math.round(proUsers / totalUsers * 100)}% de conversion` : ''} />
        <StatCard label="MRR (clients actifs)" value={mrr > 0 ? `${mrr.toLocaleString('fr-FR')} €` : '—'} icon="💰" color="#059669" sub={`${clientsActifs?.length || 0} client(s) actif(s)`} />
        <StatCard label="Audits réalisés" value={totalAudits ?? '—'} icon="📋" color="#2E9B8B" />
        <StatCard label="Mode Afrique" value={afUsers} icon="🌍" color="#E07B39" sub={totalUsers ? `${Math.round(afUsers / totalUsers * 100)}% des users` : ''} />
        <StatCard label="Score moyen" value={avgScore ? `${avgScore}/100` : '—'} icon="📈" color="#3498DB" sub={audited ? `${audited} audits complétés` : 'Aucun audit'} />
        <StatCard label="Roadmaps générées" value={totalRoadmaps ?? '—'} icon="🗺️" color="#8E44AD" />
      </div>

      {/* Dernières inscriptions */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontSize: '1rem', fontWeight: 700, color: '#0A1628', margin: 0 }}>Dernières inscriptions</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Nom', 'Plan', 'Marché', 'Pays', 'Score', 'Date'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '10px 16px', fontSize: '0.72rem', color: '#6B7A94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(profiles || []).slice(0, 15).map((p, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F5F5F5' }}>
                <td style={{ padding: '11px 16px', fontSize: '0.85rem', fontWeight: 500 }}>{p.full_name || '—'}</td>
                <td style={{ padding: '11px 16px' }}>
                  <span style={{
                    background: p.plan && !['free', null, ''].includes(p.plan) ? '#C9A84C22' : '#F0F0F0',
                    color: p.plan && !['free', null, ''].includes(p.plan) ? '#8B6914' : '#6B7A94',
                    padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                  }}>{p.plan || 'free'}</span>
                </td>
                <td style={{ padding: '11px 16px', fontSize: '0.85rem' }}>{p.market === 'af' ? '🌍 Afrique' : '🇫🇷 France'}</td>
                <td style={{ padding: '11px 16px', fontSize: '0.85rem', color: '#6B7A94' }}>{p.pays || '—'}</td>
                <td style={{ padding: '11px 16px' }}>
                  {p.audit_score
                    ? <span style={{ fontWeight: 700, color: p.audit_score >= 75 ? '#27AE60' : p.audit_score >= 50 ? '#3498DB' : p.audit_score >= 25 ? '#F39C12' : '#E74C3C' }}>{p.audit_score}/100</span>
                    : <span style={{ color: '#D0D0D0' }}>—</span>}
                </td>
                <td style={{ padding: '11px 16px', fontSize: '0.8rem', color: '#6B7A94' }}>
                  {p.created_at ? new Date(p.created_at).toLocaleDateString('fr-FR') : '—'}
                </td>
              </tr>
            ))}
            {(!profiles || profiles.length === 0) && (
              <tr><td colSpan={6} style={{ padding: '48px', textAlign: 'center', color: '#6B7A94' }}>Aucun utilisateur</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
