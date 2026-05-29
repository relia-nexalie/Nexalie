'use client';

/**
 * DiagnosticLoading — Écran de transition "L'Effet Magicien"
 * Affiché pendant que l'API Nexalie génère le rapport complet.
 * Design : Anti-Startup-IA / Souverain & Industriel.
 */

import { useEffect, useState } from 'react';

const MESSAGES = [
  'Analyse de vos indicateurs de performance et de votre maturité numérique\u00a0...',
  'Sourcing des meilleures solutions technologiques et passerelles locales\u00a0...',
  'Structuration de votre feuille de route personnalisée sur 90\u00a0jours\u00a0...',
];

const INTERVAL_MS = 3500;

export default function DiagnosticLoading({ structureName = '' }) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setMsgIdx(i => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, 300);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-cream px-6">

      {/* Grain de texture subtil */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        aria-hidden="true"
      />

      {/* Contenu centré */}
      <div className="relative flex w-full max-w-xl flex-col items-center gap-12 text-center">

        {/* Spinner minimaliste */}
        <div className="relative h-14 w-14">
          {/* Anneau extérieur statique */}
          <svg className="absolute inset-0" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="24" stroke="#0F172A" strokeWidth="1.5" strokeOpacity="0.08" />
          </svg>
          {/* Arc animé */}
          <svg className="absolute inset-0 animate-spin" viewBox="0 0 56 56" fill="none" style={{ animationDuration: '2s' }}>
            <circle
              cx="28" cy="28" r="24"
              stroke="#0F172A" strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="40 110"
              strokeDashoffset="0"
            />
          </svg>
        </div>

        {/* Texte principal */}
        <div className="flex flex-col items-center gap-4">
          {structureName && (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
              Nexalie &mdash; {structureName}
            </p>
          )}

          {/* Message animé */}
          <p
            className="font-serif text-2xl font-light leading-relaxed tracking-tight text-[#0F172A] transition-all duration-300"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateY(0)' : 'translateY(6px)',
            }}
          >
            {MESSAGES[msgIdx]}
          </p>

          {/* Indicateurs de progression */}
          <div className="flex gap-2 pt-1">
            {MESSAGES.map((_, i) => (
              <div
                key={i}
                className="h-[2px] rounded-full transition-all duration-500"
                style={{
                  width: i === msgIdx ? '28px' : '8px',
                  background: i === msgIdx ? '#0F172A' : '#CBD5E1',
                }}
              />
            ))}
          </div>
        </div>

        {/* Barre de progression globale */}
        <div className="w-full max-w-xs">
          <div className="h-[2px] w-full overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full rounded-full bg-navy"
              style={{
                width: '100%',
                animation: 'progress 10.5s linear forwards',
              }}
            />
          </div>
          <p className="mt-3 font-mono text-[10px] tracking-widest text-ink-muted">
            ANALYSE EN COURS
          </p>
        </div>

      </div>

      {/* Signature bas de page */}
      <p className="absolute bottom-8 font-mono text-[10px] tracking-widest text-slate-300">
        NEXALIE &mdash; MOTEUR D&rsquo;ANALYSE STRATÉGIQUE
      </p>
    </div>
  );
}
