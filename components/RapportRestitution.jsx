'use client';

/**
 * RapportRestitution — Design de restitution du rapport Nexalie
 * Épuré, institutionnel, "Livre Blanc / Document Officiel".
 *
 * Props :
 *   - score         : number (0-100)
 *   - level         : { label: string, color: string }
 *   - structureName : string
 *   - rawMarkdown   : string  — texte brut du rapport IA (format ### / * / **)
 *   - mode          : 'fr' | 'af'
 *   - onRestart     : function
 *   - onDownload    : function
 */

import { useEffect, useRef, useState } from 'react';
import NexalieWatch from './NexalieWatch';

// ─── Palette niveau ──────────────────────────────────────────────────
const LEVEL_CONFIG = {
  debutant:     { label: 'Débutant',       band: 'bg-slate-400',  text: 'text-slate-600',  border: 'border-slate-300' },
  initie:       { label: 'Initié',         band: 'bg-amber-500',  text: 'text-amber-700',  border: 'border-amber-200' },
  intermediaire:{ label: 'Intermédiaire',  band: 'bg-blue-500',   text: 'text-blue-700',   border: 'border-blue-200'  },
  avance:       { label: 'Avancé',         band: 'bg-emerald-600',text: 'text-emerald-700',border: 'border-emerald-200'},
  expert:       { label: 'Expert',         band: 'bg-navy',       text: 'text-navy',       border: 'border-slate-300' },
};

function getLevelKey(score) {
  if (score < 20) return 'debutant';
  if (score < 40) return 'initie';
  if (score < 60) return 'intermediaire';
  if (score < 80) return 'avance';
  return 'expert';
}

// ─── Parser markdown structuré ────────────────────────────────────────
function parseRapport(md) {
  if (!md) return { maturite: null, roadmap: [], souverainete: '' };

  const sections = {};
  let current = null;
  const lines = md.split('\n');

  for (const line of lines) {
    if (line.startsWith('###')) {
      const title = line.replace(/^###\s*/, '').trim();
      if (/maturit/i.test(title))       current = 'maturite';
      else if (/roadmap|feuille/i.test(title)) current = 'roadmap';
      else if (/souverain|donn/i.test(title))  current = 'souverainete';
      else current = null;
      if (current && !sections[current]) sections[current] = [];
      continue;
    }
    if (current) {
      (sections[current] = sections[current] || []).push(line);
    }
  }

  // Analyse de maturité
  const maturiteLines = (sections.maturite || []).join('\n');
  const scoreMatch = maturiteLines.match(/\b(\d{1,3})\s*(?:\/\s*100|sur\s*100)/i);
  const extractedScore = scoreMatch ? parseInt(scoreMatch[1]) : null;
  const maturiteText = maturiteLines.replace(/\*\*/g, '').trim();

  // Roadmap — extraire actions avec Quoi/Pourquoi/Comment
  const roadmapText = (sections.roadmap || []).join('\n');
  const actions = [];
  const actionBlocks = roadmapText.split(/(?=^\*\s+\*\*Quoi)/m).filter(Boolean);

  for (const block of actionBlocks) {
    const quoi    = block.match(/\*\*Quoi\s*:\*\*\s*(.+)/)?.[1]?.trim() || '';
    const pourquoi= block.match(/\*\*Pourquoi\s*:\*\*\s*(.+)/)?.[1]?.trim() || '';
    const comment = block.match(/\*\*Comment\s*:\*\*\s*([\s\S]+?)(?=\*\s+\*\*|$)/)?.[1]?.trim() || '';

    // Extraire les outils mentionnés entre parenthèses ou avant "–" ou ":"
    const toolMatches = comment.match(/\b(HubSpot|Notion|Brevo|Make|Zapier|Wave|CinetPay|Stripe|Lydia|WhatsApp\s*Business|Airtable|Pennylane|Google\s*My\s*Business|Canva|Mailchimp|MTN\s*MoMo|Orange\s*Money|Shopify)\b/gi) || [];
    const tools = [...new Set(toolMatches)].slice(0, 3);

    if (quoi) actions.push({ quoi, pourquoi, comment, tools, month: actions.length + 1 });
  }

  // Fallback : diviser en 3 blocs si le parsing fin échoue
  if (actions.length === 0 && roadmapText.length > 50) {
    const bullets = roadmapText.split(/\n/).filter(l => l.trim().startsWith('*') || l.trim().startsWith('-'));
    const chunked = [bullets.slice(0, 3), bullets.slice(3, 6), bullets.slice(6, 9)];
    chunked.forEach((chunk, i) => {
      if (chunk.length > 0) actions.push({ quoi: `Action prioritaire ${i + 1}`, pourquoi: '', comment: chunk.map(l => l.replace(/^[*-]\s*/, '')).join(' · '), tools: [], month: i + 1 });
    });
  }

  const souverainete = (sections.souverainete || []).join('\n').replace(/\*\*/g, '').trim();

  return { maturite: { text: maturiteText, score: extractedScore }, roadmap: actions.slice(0, 3), souverainete };
}

// ─── Sous-composants ──────────────────────────────────────────────────

function ScoreGauge({ score, levelKey }) {
  const cfg = LEVEL_CONFIG[levelKey] || LEVEL_CONFIG.debutant;
  const [displayed, setDisplayed] = useState(0);
  const rafRef = useRef(null);

  useEffect(() => {
    const start = performance.now();
    const duration = 1400;
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(eased * score));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [score]);

  return (
    <div className="flex flex-col items-center gap-5 animate-fade-up">
      {/* Cercle score */}
      <div className="relative flex h-32 w-32 items-center justify-center rounded-md border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-0.5">
          <span className="font-mono text-5xl font-light tracking-tight text-navy">{displayed}</span>
          <span className="font-mono text-xs tracking-widest text-ink-muted">/100</span>
        </div>
        {/* Barre niveau en bas */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-sm ${cfg.band}`} />
      </div>

      {/* Badge niveau */}
      <div className={`inline-flex items-center gap-2 rounded-sm border px-4 py-1.5 ${cfg.border}`}>
        <div className={`h-1.5 w-1.5 rounded-full ${cfg.band}`} />
        <span className={`font-mono text-xs font-semibold uppercase tracking-widest ${cfg.text}`}>
          Niveau {cfg.label}
        </span>
      </div>

      {/* Barre de progression fine */}
      <div className="w-full max-w-xs">
        <div className="h-[3px] w-full rounded-full bg-slate-100">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${cfg.band}`}
            style={{ width: `${score}%` }}
          />
        </div>
        <div className="mt-1.5 flex justify-between">
          <span className="font-mono text-[9px] tracking-widest text-slate-400">DÉBUTANT</span>
          <span className="font-mono text-[9px] tracking-widest text-slate-400">EXPERT</span>
        </div>
      </div>
    </div>
  );
}

function MaturiteSection({ data }) {
  if (!data?.text) return null;
  const paragraphs = data.text.split('\n').filter(l => l.trim());

  return (
    <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm animate-fade-up">
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-[3px] rounded-full bg-navy" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Photo à l'instant T</p>
      </div>
      <div className="space-y-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="text-[15px] leading-relaxed text-ink">{p}</p>
        ))}
      </div>
    </div>
  );
}

const MONTH_LABELS = ['Mois 1', 'Mois 2', 'Mois 3'];
const MONTH_ACCENT = ['border-t-navy', 'border-t-terra', 'border-t-slate-400'];

function RoadmapCards({ actions, mode }) {
  if (!actions || actions.length === 0) return null;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="h-5 w-[3px] rounded-full bg-terra" />
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">
          Feuille de route — 90 jours
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {actions.map((action, i) => (
          <div
            key={i}
            className={`group flex flex-col gap-4 rounded-md border border-t-2 border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-200 hover:shadow-md ${MONTH_ACCENT[i] || 'border-t-slate-300'}`}
          >
            {/* En-tête mois */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                {MONTH_LABELS[i]}
              </span>
              <span className="font-mono text-[9px] font-bold tracking-widest text-navy">
                0{i + 1}
              </span>
            </div>

            {/* Quoi */}
            <h3 className="font-serif text-base font-normal leading-snug text-navy">
              {action.quoi}
            </h3>

            {/* Pourquoi */}
            {action.pourquoi && (
              <div className="rounded-sm bg-slate-50 px-3 py-2">
                <p className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">Bénéfice</p>
                <p className="mt-1 text-[13px] leading-relaxed text-ink">{action.pourquoi}</p>
              </div>
            )}

            {/* Comment */}
            {action.comment && (
              <p className="text-[13px] leading-relaxed text-ink-muted">{action.comment.slice(0, 160)}{action.comment.length > 160 ? '…' : ''}</p>
            )}

            {/* Badges outils */}
            {action.tools.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {action.tools.map(tool => (
                  <span
                    key={tool}
                    className="rounded-sm border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-widest text-ink-muted"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SouveraineteSection({ text }) {
  const body = text || "Vos données stratégiques — audit, feuille de route, documents — restent votre propriété exclusive. Elles sont hébergées en Union Européenne, ne sont jamais revendues ni transmises à des tiers. Vous pouvez les exporter ou les supprimer à tout moment, sur simple demande.";

  return (
    <div className="flex gap-5 rounded-md border border-slate-200 bg-white p-8 shadow-sm animate-fade-up">
      {/* Icône — cadenas stylisé */}
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-slate-200">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <rect x="3" y="7" width="10" height="8" rx="1" stroke="#0F172A" strokeWidth="1.2" />
          <path d="M5 7V5a3 3 0 016 0v2" stroke="#0F172A" strokeWidth="1.2" strokeLinecap="round" />
          <circle cx="8" cy="11" r="1" fill="#0F172A" />
        </svg>
      </div>
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-muted">Souveraineté & Données</p>
        <p className="text-[14px] leading-relaxed text-ink">{body}</p>
        <div className="mt-1 flex flex-wrap gap-3">
          {['Hébergement UE', 'Zéro revente', 'RGPD conforme', 'Export sur demande'].map(tag => (
            <span key={tag} className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">
              ✓ {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────

export default function RapportRestitution({
  score = 0,
  structureName = '',
  rawMarkdown = '',
  mode = 'fr',
  onRestart,
  onDownload,
}) {
  const parsed   = parseRapport(rawMarkdown);
  const finalScore = parsed.maturite?.score ?? score;
  const levelKey = getLevelKey(finalScore);
  const cfg      = LEVEL_CONFIG[levelKey];

  return (
    <div className="min-h-screen bg-cream font-sans">
      <style suppressHydrationWarning>{`
        @keyframes progress {
          from { width: 4%; }
          to   { width: 95%; }
        }
      `}</style>

      {/* ─── HEADER PREMIUM ──────────────────────────────────────────── */}
      <header className="border-b border-slate-200 bg-navy px-6 py-16 sm:px-12 md:py-24">
        <div className="mx-auto max-w-5xl">
          {/* Fil d'Ariane */}
          <p className="mb-8 font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
            Nexalie &mdash; Diagnostic Stratégique {mode === 'af' ? '(Afrique)' : '(France)'}
          </p>

          {/* Titre */}
          <h1 className="mb-2 font-serif text-3xl font-light leading-tight tracking-tight text-white sm:text-4xl">
            Rapport de Maturité Digitale
          </h1>
          {structureName && (
            <p className="font-serif text-xl font-light italic text-white/60">{structureName}</p>
          )}

          {/* Séparateur */}
          <div className="my-8 h-px bg-white/10" />

          {/* Score */}
          <ScoreGauge score={finalScore} levelKey={levelKey} />
        </div>
      </header>

      {/* ─── BODY ────────────────────────────────────────────────────── */}
      <main className="mx-auto max-w-5xl space-y-12 px-6 py-16 sm:px-12 md:py-20">

        {/* Analyse de maturité */}
        <MaturiteSection data={parsed.maturite} />

        {/* Feuille de route 90 jours */}
        {parsed.roadmap.length > 0 && <RoadmapCards actions={parsed.roadmap} mode={mode} />}

        {/* Souveraineté */}
        <SouveraineteSection text={parsed.souverainete} />

        {/* Actions */}
        <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-8 no-print">
          {onDownload && (
            <button
              onClick={onDownload}
              className="inline-flex items-center gap-2 rounded-md bg-[#0F172A] px-8 py-4 font-sans text-sm font-medium text-white transition-colors hover:bg-slate-800"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M7 1v8M4 6l3 3 3-3M2 11h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Télécharger le rapport PDF
            </button>
          )}
          {onRestart && (
            <button
              onClick={onRestart}
              className="inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-8 py-4 font-sans text-sm font-medium text-ink transition-colors hover:bg-slate-50"
            >
              Refaire le diagnostic
            </button>
          )}
        </div>

      </main>

      {/* ─── NEXALIE WATCH TEASER ─────────────────────────────────────── */}
      <div className="border-t border-slate-200">
        <NexalieWatch />
      </div>
    </div>
  );
}
