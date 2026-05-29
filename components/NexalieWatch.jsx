'use client';

/**
 * NexalieWatch — Teaser "Pilotez votre exécution en temps réel"
 * Bloc de présentation pour l'extension Nexalie Watch (bientôt disponible).
 * Design : institutionnel, sobre, vidéo placeholder industriel.
 */

import { useState } from 'react';

// ─── Données fictives du tableau de bord simulé ───────────────────────
const MOCK_METRICS = [
  { label: 'Score maturité',  value: '68',   unit: '/ 100', delta: '+12 pts', up: true  },
  { label: 'Actions en cours',value: '4',    unit: 'tâches',delta: '2 en retard', up: false },
  { label: 'Outils actifs',   value: '7',    unit: 'intégrations',delta: '+3 ce mois', up: true  },
  { label: 'Gain temps / sem',value: '6.5',  unit: 'h',     delta: 'vs avant', up: true  },
];

const MOCK_ACTIONS = [
  { label: 'Configurer HubSpot CRM',      done: true,  date: '12 mai' },
  { label: 'Automatiser devis via Make',   done: true,  date: '18 mai' },
  { label: 'Activer Wave pour paiements',  done: false, date: '1 juin' },
  { label: 'Former l\'équipe sur Notion',  done: false, date: '8 juin' },
];

// ─── Sous-composant : Tableau de bord simulé ─────────────────────────

function MockDashboard() {
  return (
    <div className="w-full overflow-hidden rounded-md border border-slate-200 bg-white shadow-card">
      {/* Barre de titre fenêtre */}
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          {['bg-red-300', 'bg-yellow-300', 'bg-green-300'].map((c, i) => (
            <div key={i} className={`h-2.5 w-2.5 rounded-full ${c}`} />
          ))}
        </div>
        <span className="ml-2 font-mono text-[10px] tracking-widest text-slate-400">NEXALIE WATCH — v0.1 preview</span>
      </div>

      <div className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPIs */}
        {MOCK_METRICS.map((m, i) => (
          <div key={i} className="flex flex-col gap-1 bg-white px-5 py-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">{m.label}</p>
            <div className="flex items-baseline gap-1.5">
              <span className="font-mono text-2xl font-light text-navy">{m.value}</span>
              <span className="font-mono text-[10px] text-slate-400">{m.unit}</span>
            </div>
            <span className={`font-mono text-[10px] ${m.up ? 'text-emerald-600' : 'text-amber-600'}`}>
              {m.up ? '↑' : '⚠'} {m.delta}
            </span>
          </div>
        ))}
      </div>

      <div className="grid gap-px bg-slate-100 sm:grid-cols-2">
        {/* Timeline feuille de route */}
        <div className="bg-white px-5 py-5">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">Feuille de route</p>
          <div className="space-y-3">
            {MOCK_ACTIONS.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${a.done ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300'}`}>
                  {a.done && (
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path d="M1.5 4l2 2L6.5 2" stroke="#059669" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
                <div className="flex flex-1 items-center justify-between">
                  <span className={`text-xs ${a.done ? 'text-slate-400 line-through' : 'text-ink'}`}>{a.label}</span>
                  <span className="font-mono text-[9px] text-slate-400">{a.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graphique sparkline simulé */}
        <div className="bg-white px-5 py-5">
          <p className="mb-4 font-mono text-[9px] uppercase tracking-[0.18em] text-slate-400">Progression score</p>
          <div className="flex h-20 items-end gap-1.5">
            {[28, 34, 34, 41, 48, 48, 55, 61, 68].map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-sm bg-navy/10 transition-all"
                  style={{ height: `${(v / 100) * 80}px` }}
                >
                  {i === 8 && (
                    <div className="h-full w-full rounded-sm bg-navy" />
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 flex justify-between">
            <span className="font-mono text-[9px] text-slate-400">Jan</span>
            <span className="font-mono text-[9px] text-navy font-semibold">68 pts aujourd'hui</span>
          </div>
        </div>
      </div>

      {/* Footer barre statut */}
      <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50 px-5 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse-slow" />
          <span className="font-mono text-[9px] tracking-widest text-slate-400">SYNCHRONISATION EN TEMPS RÉEL</span>
        </div>
        <span className="font-mono text-[9px] text-slate-300">nexalie.watch · bêta fermée</span>
      </div>
    </div>
  );
}

// ─── Composant principal ───────────────────────────────────────────────

export default function NexalieWatch() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!email || sent) return;
    setLoading(true);
    // Simulation — remplacer par l'appel API waitlist réel
    await new Promise(r => setTimeout(r, 900));
    setSent(true);
    setLoading(false);
  }

  return (
    <section className="bg-cream px-6 py-20 sm:px-12">
      <div className="mx-auto max-w-3xl">

        {/* En-tête */}
        <div className="mb-12 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="h-5 w-[3px] rounded-full bg-terra" />
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-terra">Bientôt disponible</p>
          </div>

          <h2 className="font-serif text-3xl font-light leading-tight text-navy sm:text-4xl">
            Nexalie Watch&nbsp;: Pilotez votre exécution en temps réel
          </h2>

          <p className="max-w-xl text-[15px] leading-relaxed text-ink-muted">
            Ne restez pas seul face à votre feuille de route. Suivez vos indicateurs, automatisez vos processus et connectez vos outils sur un tableau de bord unique — conçu pour les dirigeants, pas pour les développeurs.
          </p>
        </div>

        {/* Bloc vidéo / tableau de bord simulé */}
        <div className="group relative mb-10">
          {/* Badge "Preview" */}
          <div className="absolute -top-3 right-4 z-10 flex items-center gap-1.5 rounded-sm border border-slate-200 bg-white px-3 py-1 shadow-soft">
            <div className="h-1.5 w-1.5 rounded-full bg-terra animate-pulse-slow" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-ink-muted">Aperçu prototype</span>
          </div>

          {/*
            En production : remplacer <MockDashboard /> par :
            <video
              src="/nexalie-watch-demo.mp4"
              autoPlay muted loop playsInline
              className="w-full rounded-md shadow-card"
              poster="/nexalie-watch-poster.jpg"
            />
          */}
          <MockDashboard />
        </div>

        {/* Points forts */}
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { icon: '⟳', label: 'Suivi en direct', desc: 'Vos KPIs clés mis à jour automatiquement depuis vos outils (HubSpot, Notion, Make…).' },
            { icon: '⚡', label: 'Alertes intelligentes', desc: 'Notifications quand une action de votre feuille de route prend du retard ou dépasse le budget.' },
            { icon: '⊞', label: 'Connexions natives', desc: 'Intégrations Wave, CinetPay, Stripe, WhatsApp Business, Brevo en un clic.' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="rounded-sm border border-slate-200 bg-white p-5 shadow-soft">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-sm border border-slate-200 font-mono text-base text-navy">
                {icon}
              </div>
              <p className="mb-1.5 font-sans text-[13px] font-semibold text-navy">{label}</p>
              <p className="text-[12px] leading-relaxed text-ink-muted">{desc}</p>
            </div>
          ))}
        </div>

        {/* CTA Waitlist */}
        <div className="rounded-sm border border-slate-200 bg-white p-8 shadow-soft">
          {sent ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center animate-fade-up">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-emerald-200 bg-emerald-50">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M3 9l4 4L15 5" stroke="#059669" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p className="font-serif text-lg font-light text-navy">Vous êtes sur la liste.</p>
              <p className="text-sm text-ink-muted">Nous vous contacterons en priorité lors de l&rsquo;ouverture de la bêta.</p>
            </div>
          ) : (
            <>
              <p className="mb-1 font-serif text-lg font-light text-navy">Rejoindre la liste d&rsquo;attente Nexalie Watch</p>
              <p className="mb-6 text-[13px] text-ink-muted">Accès prioritaire à la bêta fermée. Aucun spam — une notification à l&rsquo;ouverture.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="votre@email.com"
                  required
                  className="flex-1 rounded-sm border border-slate-200 bg-slate-50 px-4 py-3 font-sans text-sm text-ink placeholder-slate-400 focus:border-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy/20 transition-colors"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-sm bg-navy px-7 py-3 font-sans text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {loading ? 'Inscription…' : 'Rejoindre la liste d\'attente →'}
                </button>
              </form>
            </>
          )}
        </div>

      </div>
    </section>
  );
}
