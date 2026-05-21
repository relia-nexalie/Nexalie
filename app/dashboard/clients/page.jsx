import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Clients — Nexalie Admin' };

export default async function ClientsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') redirect('/');

  const { data: clients } = await supabase
    .from('profiles')
    .select('id, full_name, plan, market, country, audit_score, audit_level, created_at, onboarding_completed, secteur, objectif_principal')
    .order('created_at', { ascending: false });

  const planBadge = (plan) => {
    const isPro = plan && !['free', null, ''].includes(plan);
    return (
      <span style={{
        background: isPro ? '#C9A84C22' : '#F0F0F0',
        color: isPro ? '#8B6914' : '#6B7A94',
        padding: '2px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
      }}>{plan || 'free'}</span>
    );
  };

  const scoreColor = (s) => s >= 75 ? '#27AE60' : s >= 50 ? '#3498DB' : s >= 25 ? '#F39C12' : '#E74C3C';

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1628', margin: 0 }}>Clients</h1>
          <p style={{ color: '#6B7A94', fontSize: '0.85rem', marginTop: '4px' }}>{clients?.length || 0} compte(s)</p>
        </div>
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Nom', 'Plan', 'Marché', 'Pays', 'Secteur', 'Score audit', 'Objectif', 'Onboarding', 'Inscrit'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.72rem', color: '#6B7A94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(clients || []).map((c, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F5F5F5', transition: 'background 0.1s' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: '0.85rem' }}>{c.full_name || <span style={{ color: '#D0D0D0' }}>Sans nom</span>}</td>
                <td style={{ padding: '12px 16px' }}>{planBadge(c.plan)}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>{c.market === 'af' ? '🌍 Afrique' : '🇫🇷 France'}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', color: '#6B7A94' }}>{c.country || '—'}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#6B7A94', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.secteur || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  {c.audit_score
                    ? <span style={{ fontWeight: 700, color: scoreColor(c.audit_score) }}>{c.audit_score}/100</span>
                    : <span style={{ color: '#D0D0D0' }}>—</span>}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.82rem', color: '#6B7A94' }}>{c.objectif_principal || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: c.onboarding_completed ? '#27AE60' : '#F39C12' }}>
                    {c.onboarding_completed ? '✓ Fait' : '⏳ En attente'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6B7A94', whiteSpace: 'nowrap' }}>
                  {c.created_at ? new Date(c.created_at).toLocaleDateString('fr-FR') : '—'}
                </td>
              </tr>
            ))}
            {(!clients || clients.length === 0) && (
              <tr><td colSpan={9} style={{ padding: '64px', textAlign: 'center', color: '#6B7A94' }}>Aucun client pour le moment</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
