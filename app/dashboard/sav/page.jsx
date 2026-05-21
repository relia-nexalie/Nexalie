'use client';

import { useState, useEffect, useCallback } from 'react';

const NAVY  = '#0A1628';
const TEAL  = '#4EC9B0';

const STATUS_CONFIG = {
  nouveau:     { label: 'Nouveau',      bg: '#EFF6FF', color: '#3B82F6', border: '#BFDBFE' },
  en_cours:    { label: 'En cours',     bg: '#FEF3C7', color: '#92400E', border: '#FDE68A' },
  resolu:      { label: 'Résolu',       bg: '#ECFDF5', color: '#065F46', border: '#6EE7B7' },
  ignore:      { label: 'Ignoré',       bg: '#F3F4F6', color: '#6B7280', border: '#D1D5DB' },
};

const STATUS_TRANSITIONS = ['nouveau', 'en_cours', 'resolu', 'ignore'];

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.nouveau;
  return (
    <span style={{
      background: cfg.bg, color: cfg.color,
      border: `1.5px solid ${cfg.border}`,
      borderRadius: '20px', padding: '3px 10px',
      fontSize: '11px', fontWeight: 700,
      whiteSpace: 'nowrap',
    }}>
      {cfg.label}
    </span>
  );
}

export default function SAVPage() {
  const [reports, setReports]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState('');
  const [filter,  setFilter]    = useState('all');
  const [updating, setUpdating] = useState(null); // id en cours

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/bug-reports');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setReports(data.reports || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateStatus(id, status) {
    setUpdating(id);
    try {
      const res = await fetch('/api/bug-reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) throw new Error();
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch {
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdating(null);
    }
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter);
  const counts = reports.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <div style={{ padding: '32px', maxWidth: '960px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>

      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2.5px', color: TEAL, textTransform: 'uppercase', marginBottom: '6px' }}>
          Dashboard Admin
        </p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '26px', fontWeight: 300, color: NAVY, margin: 0 }}>
          SAV — Signalements
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
        {[
          { key: 'all',     label: 'Tous',      count: reports.length, color: NAVY },
          { key: 'nouveau', label: 'Nouveaux',  count: counts.nouveau || 0, color: '#3B82F6' },
          { key: 'en_cours',label: 'En cours',  count: counts.en_cours || 0, color: '#D97706' },
          { key: 'resolu',  label: 'Résolus',   count: counts.resolu || 0, color: '#10B981' },
        ].map(s => (
          <button
            key={s.key}
            onClick={() => setFilter(s.key)}
            style={{
              background: filter === s.key ? s.color : '#fff',
              color: filter === s.key ? '#fff' : '#374151',
              border: `1.5px solid ${filter === s.key ? s.color : '#E5E7EB'}`,
              borderRadius: '8px', padding: '8px 16px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.15s',
            }}
          >
            {s.label}
            <span style={{
              background: filter === s.key ? 'rgba(255,255,255,0.25)' : '#F3F4F6',
              color: filter === s.key ? '#fff' : '#6B7280',
              borderRadius: '20px', padding: '1px 7px', fontSize: '11px', fontWeight: 700,
            }}>
              {s.count}
            </span>
          </button>
        ))}

        <button
          onClick={load}
          style={{ marginLeft: 'auto', background: 'none', border: '1.5px solid #E5E7EB', borderRadius: '8px', padding: '8px 14px', fontSize: '12px', color: '#6B7A94', cursor: 'pointer' }}
        >
          ↻ Actualiser
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
          <div style={{ width: 32, height: 32, border: `3px solid ${TEAL}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        </div>
      ) : error ? (
        <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', borderRadius: '12px', padding: '20px', color: '#DC2626', fontSize: '14px' }}>
          ⚠ {error}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '12px', padding: '48px', textAlign: 'center' }}>
          <p style={{ fontSize: '32px', marginBottom: '12px' }}>🎉</p>
          <p style={{ fontSize: '15px', color: '#374151', fontWeight: 600, marginBottom: '6px' }}>
            {filter === 'all' ? 'Aucun signalement' : `Aucun signalement "${STATUS_CONFIG[filter]?.label || filter}"`}
          </p>
          <p style={{ fontSize: '13px', color: '#9CA3AF' }}>
            {filter === 'all' ? 'Tout va bien !' : 'Essayez un autre filtre.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {filtered.map(report => (
            <ReportCard
              key={report.id}
              report={report}
              updating={updating === report.id}
              onUpdateStatus={updateStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportCard({ report, updating, onUpdateStatus }) {
  const [expanded, setExpanded] = useState(false);
  const date = new Date(report.created_at).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div style={{
      background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '12px',
      overflow: 'hidden', transition: 'box-shadow 0.15s',
    }}>
      {/* Header card */}
      <div
        onClick={() => setExpanded(e => !e)}
        style={{
          padding: '16px 20px', cursor: 'pointer',
          display: 'flex', alignItems: 'flex-start', gap: '16px',
          background: report.status === 'resolu' ? '#FAFFFE' : '#fff',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
            <StatusBadge status={report.status} />
            <span style={{ fontSize: '11px', fontFamily: 'monospace', color: '#9CA3AF' }}>
              {report.page || '/'}
            </span>
            <span style={{ fontSize: '11px', color: '#9CA3AF', marginLeft: 'auto' }}>
              {date}
            </span>
          </div>
          <p style={{
            fontSize: '14px', color: '#374151', lineHeight: 1.5,
            margin: 0, overflow: 'hidden',
            display: '-webkit-box', WebkitLineClamp: expanded ? 'none' : 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {report.description}
          </p>
          {report.user_id && (
            <p style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '6px', margin: '6px 0 0' }}>
              Utilisateur connecté · ID: {report.user_id.slice(0, 8)}…
            </p>
          )}
        </div>
        <span style={{ color: '#9CA3AF', fontSize: '12px', flexShrink: 0, paddingTop: '2px' }}>
          {expanded ? '▲' : '▼'}
        </span>
      </div>

      {/* Actions (toujours visibles) */}
      <div style={{
        borderTop: '1px solid #F3F4F6', padding: '12px 20px',
        display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap',
        background: '#FAFAFA',
      }}>
        <span style={{ fontSize: '11px', color: '#9CA3AF', marginRight: '4px', fontWeight: 600 }}>
          Statut :
        </span>
        {STATUS_TRANSITIONS.map(s => (
          <button
            key={s}
            onClick={() => onUpdateStatus(report.id, s)}
            disabled={updating || report.status === s}
            style={{
              background: report.status === s ? STATUS_CONFIG[s].color : 'transparent',
              color: report.status === s ? '#fff' : STATUS_CONFIG[s].color,
              border: `1.5px solid ${STATUS_CONFIG[s].color}`,
              borderRadius: '6px', padding: '4px 12px',
              fontSize: '11px', fontWeight: 700, cursor: report.status === s ? 'default' : 'pointer',
              opacity: updating ? 0.5 : 1, transition: 'all 0.15s',
            }}
          >
            {updating && report.status !== s ? '…' : STATUS_CONFIG[s].label}
          </button>
        ))}

        {report.screenshot_url && (
          <a
            href={report.screenshot_url}
            target="_blank"
            rel="noopener noreferrer"
            style={{ marginLeft: 'auto', fontSize: '11px', color: TEAL, textDecoration: 'none', fontWeight: 600 }}
          >
            📎 Capture d'écran
          </a>
        )}
      </div>
    </div>
  );
}
