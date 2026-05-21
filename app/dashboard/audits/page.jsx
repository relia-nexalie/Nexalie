import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Audits — Nexalie Admin' };

export default async function AuditsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.email !== 'relia.ebiya@gmail.com') redirect('/');

  const { data: audits } = await supabase
    .from('audits')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  const scoreColor = (s) => s >= 75 ? '#27AE60' : s >= 50 ? '#3498DB' : s >= 25 ? '#F39C12' : '#E74C3C';
  const total = audits?.length || 0;
  const avgScore = total ? Math.round(audits.reduce((s, a) => s + a.score, 0) / total) : null;
  const byMode = { fr: audits?.filter(a => a.mode === 'fr').length || 0, af: audits?.filter(a => a.mode === 'af').length || 0 };
  const byLevel = audits?.reduce((acc, a) => { acc[a.level] = (acc[a.level] || 0) + 1; return acc; }, {}) || {};

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0A1628', marginBottom: '4px' }}>Audits</h1>
      <p style={{ color: '#6B7A94', fontSize: '0.85rem', marginBottom: '28px' }}>{total} audit(s) réalisé(s)</p>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '28px' }}>
        {[
          { label: 'Score moyen', value: avgScore ? `${avgScore}/100` : '—', color: '#3498DB' },
          { label: '🇫🇷 France', value: byMode.fr, color: '#0A1628' },
          { label: '🌍 Afrique', value: byMode.af, color: '#E07B39' },
          { label: 'Leaders (75+)', value: byLevel['leader'] || 0, color: '#27AE60' },
        ].map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: '10px', padding: '18px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)' }}>
            <p style={{ fontSize: '0.72rem', color: '#6B7A94', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{s.label}</p>
            <p style={{ fontSize: '1.6rem', fontWeight: 800, color: s.color, margin: 0 }}>{s.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 4px rgba(0,0,0,0.07)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#FAFAFA' }}>
              {['Date', 'Mode', 'Score', 'Niveau', 'Recommandations (extrait)'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: '0.72rem', color: '#6B7A94', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(audits || []).map((a, i) => (
              <tr key={i} style={{ borderTop: '1px solid #F5F5F5' }}>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6B7A94', whiteSpace: 'nowrap' }}>
                  {new Date(a.created_at).toLocaleDateString('fr-FR')}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem' }}>
                  {a.mode === 'af' ? '🌍 Afrique' : '🇫🇷 France'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: scoreColor(a.score) }}>{a.score}</span>
                  <span style={{ color: '#D0D0D0', fontSize: '0.8rem' }}>/100</span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: '0.85rem', fontWeight: 500 }}>{a.level_label || a.level}</td>
                <td style={{ padding: '12px 16px', fontSize: '0.8rem', color: '#6B7A94', maxWidth: '320px' }}>
                  {a.recommendations ? a.recommendations.substring(0, 120) + (a.recommendations.length > 120 ? '…' : '') : '—'}
                </td>
              </tr>
            ))}
            {total === 0 && (
              <tr><td colSpan={5} style={{ padding: '64px', textAlign: 'center', color: '#6B7A94' }}>Aucun audit pour le moment</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
