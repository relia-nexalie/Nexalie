'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

const TEAL = '#4EC9B0';
const NAVY = '#0A1628';

export default function BugReportModal({ onClose }) {
  const pathname = usePathname();
  const [description, setDescription] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  // Fermer sur Escape
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!description.trim()) return;
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/bug-reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname, description }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Erreur serveur');
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(10,22,40,0.7)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '32px',
        width: '100%', maxWidth: '480px', boxShadow: '0 24px 80px rgba(0,0,0,0.25)',
        position: 'relative',
      }}>
        {/* Bouton fermer */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: '16px', right: '16px',
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#9CA3AF', fontSize: '20px', lineHeight: 1, padding: '4px',
          }}
          aria-label="Fermer"
        >
          ✕
        </button>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <div style={{ fontSize: '40px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ fontSize: '18px', fontWeight: 700, color: NAVY, marginBottom: '8px' }}>
              Signalement envoyé
            </h2>
            <p style={{ fontSize: '14px', color: '#6B7A94', marginBottom: '24px' }}>
              Merci ! Nous avons bien reçu votre signalement et nous allons y remédier rapidement.
            </p>
            <button
              onClick={onClose}
              style={{
                background: TEAL, color: '#fff', border: 'none',
                borderRadius: '8px', padding: '10px 28px',
                fontWeight: 700, fontSize: '14px', cursor: 'pointer',
              }}
            >
              Fermer
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: TEAL, textTransform: 'uppercase', marginBottom: '6px' }}>
                SAV · Support
              </p>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: NAVY, margin: 0 }}>
                Signaler un problème
              </h2>
              <p style={{ fontSize: '13px', color: '#6B7A94', marginTop: '6px' }}>
                Décrivez ce qui ne fonctionne pas — nous le corrigerons dès que possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Page détectée */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Page concernée
                </label>
                <input
                  readOnly
                  value={pathname}
                  style={{
                    width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px',
                    padding: '9px 14px', fontSize: '13px', color: '#9CA3AF',
                    background: '#F9FAFB', boxSizing: 'border-box',
                    fontFamily: 'monospace',
                  }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '5px' }}>
                  Description du problème <span style={{ color: '#EF4444' }}>*</span>
                </label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ex : Le bouton 'Valider' ne répond pas, la page se fige lors du chargement..."
                  rows={4}
                  style={{
                    width: '100%', border: '1.5px solid #E5E7EB', borderRadius: '8px',
                    padding: '10px 14px', fontSize: '14px', color: NAVY,
                    background: '#fff', boxSizing: 'border-box',
                    resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = TEAL}
                  onBlur={e => e.target.style.borderColor = '#E5E7EB'}
                  required
                />
              </div>

              {error && (
                <p style={{ fontSize: '13px', color: '#EF4444', margin: 0 }}>
                  ⚠ {error}
                </p>
              )}

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    background: 'none', border: '1.5px solid #E5E7EB',
                    borderRadius: '8px', padding: '10px 20px',
                    fontSize: '13px', color: '#6B7A94', cursor: 'pointer',
                  }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={sending || !description.trim()}
                  style={{
                    background: NAVY, color: '#fff', border: 'none',
                    borderRadius: '8px', padding: '10px 24px',
                    fontWeight: 700, fontSize: '13px',
                    cursor: (sending || !description.trim()) ? 'default' : 'pointer',
                    opacity: (sending || !description.trim()) ? 0.6 : 1,
                    transition: 'opacity 0.15s',
                  }}
                >
                  {sending ? 'Envoi…' : 'Envoyer le signalement'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
