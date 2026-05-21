'use client';

import { useMode } from '@/lib/mode-context';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const NIVEAU_COLORS = {
  debutant: '#F59E0B',
  intermediaire: '#3B82F6',
  avance: '#10B981',
  expert: '#7C3AED',
};

function ScoreBar({ value, max = 100, color = '#4EC9B0', label }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && <p style={{ fontSize: '12px', color: '#6B7A94', marginBottom: '4px' }}>{label}</p>}
      <div style={{ background: 'rgba(0,0,0,0.06)', borderRadius: '6px', height: '10px', overflow: 'hidden' }}>
        <div style={{ width: `${(value / max) * 100}%`, height: '100%', background: color, borderRadius: '6px', transition: 'width 0.8s ease' }} />
      </div>
      <p style={{ fontSize: '12px', color, fontWeight: 700, marginTop: '3px' }}>{value}/{max}</p>
    </div>
  );
}

// Tooltip personnalisé Recharts
function CustomTooltip({ active, payload, label, accent }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.08)', borderRadius: '10px', padding: '12px 16px', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }}>
      <p style={{ fontSize: '12px', color: '#6B7A94', marginBottom: '4px' }}>{label}</p>
      <p style={{ fontSize: '18px', fontWeight: 800, color: accent }}>{payload[0].value}<span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 400 }}>/100</span></p>
    </div>
  );
}

export default function ProgressClient({ audits, benchmarks, userMode, userSecteur }) {
  const { isAfrica } = useMode();
  const accent = isAfrica ? '#E88C32' : '#4EC9B0';
  const navy = isAfrica ? '#1A0800' : '#0A1628';
  const auditLabel = isAfrica ? 'Bilan Numérique' : 'Audit de Maturité';

  const lastAudit = audits[audits.length - 1];
  const firstAudit = audits[0];
  const progression = audits.length >= 2 ? lastAudit.score - firstAudit.score : 0;
  const avgScore = audits.length > 0 ? Math.round(audits.reduce((s, a) => s + a.score, 0) / audits.length) : 0;

  // Données formatées pour Recharts
  const chartData = audits.map((a) => ({
    date: new Date(a.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    score: a.score,
    niveau: a.niveau,
  }));

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: navy, padding: '48px 24px 40px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '10px' }}>
            Progression
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,42px)', fontWeight: 300, marginBottom: '10px' }}>
            Votre évolution dans le temps
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
            {audits.length} {auditLabel}{audits.length > 1 ? 's' : ''} réalisé{audits.length > 1 ? 's' : ''}
            {userSecteur ? ` · ${userSecteur}` : ''}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {audits.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '2px dashed rgba(0,0,0,0.08)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '24px', fontWeight: 300, color: navy, marginBottom: '12px' }}>
              Pas encore d'audit
            </h2>
            <p style={{ fontSize: '15px', color: '#6B7A94', marginBottom: '28px' }}>
              Réalisez votre premier {auditLabel} pour commencer à suivre votre progression.
            </p>
            <a href="/audit" style={{ display: 'inline-block', padding: '14px 36px', background: accent, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
              Faire mon {auditLabel} →
            </a>
          </div>
        ) : (
          <>
            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px,1fr))', gap: '16px', marginBottom: '28px' }}>
              {[
                { label: 'Score actuel', value: `${lastAudit.score}/100`, color: accent },
                { label: 'Score moyen', value: `${avgScore}/100`, color: '#6B7A94' },
                { label: 'Progression', value: progression > 0 ? `+${progression} pts` : progression === 0 ? '—' : `${progression} pts`, color: progression > 0 ? '#10B981' : '#F59E0B' },
                { label: 'Niveau', value: lastAudit.niveau, color: NIVEAU_COLORS[lastAudit.niveau] || accent },
              ].map(k => (
                <div key={k.label} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '20px 22px' }}>
                  <p style={{ fontSize: '12px', color: '#6B7A94', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{k.label}</p>
                  <p style={{ fontSize: '26px', fontWeight: 800, color: k.color, textTransform: 'capitalize' }}>{k.value}</p>
                </div>
              ))}
            </div>

            {/* Graphique Recharts */}
            <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: navy, marginBottom: '24px' }}>
                Évolution du score
              </h2>

              {audits.length === 1 ? (
                // Un seul point — graphique non pertinent
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <p style={{ fontSize: '48px', fontWeight: 800, color: accent }}>{lastAudit.score}<span style={{ fontSize: '20px', color: '#9CA3AF', fontWeight: 400 }}>/100</span></p>
                  <p style={{ fontSize: '13px', color: '#9CA3AF', marginTop: '8px' }}>Premier audit réalisé — faites-en un second pour voir votre courbe d'évolution.</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={accent} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={accent} stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                    <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip accent={accent} />} />

                    {/* Ligne de référence benchmark */}
                    {benchmarks?.score_moyen && (
                      <ReferenceLine
                        y={benchmarks.score_moyen}
                        stroke="#9CA3AF"
                        strokeDasharray="4 4"
                        label={{ value: `Moy. secteur (${benchmarks.score_moyen})`, position: 'insideTopRight', fontSize: 10, fill: '#9CA3AF' }}
                      />
                    )}
                    {benchmarks?.score_top25 && (
                      <ReferenceLine
                        y={benchmarks.score_top25}
                        stroke="#3B82F6"
                        strokeDasharray="4 4"
                        label={{ value: `Top 25% (${benchmarks.score_top25})`, position: 'insideTopRight', fontSize: 10, fill: '#3B82F6' }}
                      />
                    )}

                    <Area
                      type="monotone"
                      dataKey="score"
                      stroke={accent}
                      strokeWidth={2.5}
                      fill="url(#scoreGradient)"
                      dot={{ fill: accent, strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: accent, stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Benchmark sectoriel */}
            {benchmarks && (
              <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
                <h2 style={{ fontSize: '17px', fontWeight: 700, color: navy, marginBottom: '6px' }}>
                  Benchmark — {userSecteur}
                </h2>
                <p style={{ fontSize: '13px', color: '#6B7A94', marginBottom: '24px' }}>
                  Positionnement par rapport aux entreprises du même secteur.
                </p>
                <ScoreBar value={lastAudit.score} label="Votre score" color={accent} />
                <ScoreBar value={benchmarks.score_moyen} label="Moyenne du secteur" color="#6B7A94" />
                {benchmarks.score_top25 && <ScoreBar value={benchmarks.score_top25} label="Top 25%" color="#3B82F6" />}
                {benchmarks.score_top10 && <ScoreBar value={benchmarks.score_top10} label="Top 10%" color="#7C3AED" />}

                {lastAudit.score >= (benchmarks.score_top25 || 999) && (
                  <div style={{ marginTop: '16px', background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '12px 16px', fontSize: '13px', color: '#166534', fontWeight: 600 }}>
                    🏆 Vous êtes dans le top 25% de votre secteur !
                  </div>
                )}
              </div>
            )}

            <div style={{ textAlign: 'center' }}>
              <a href="/audit" style={{ display: 'inline-block', padding: '14px 36px', background: accent, color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px' }}>
                Faire un nouvel audit →
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
