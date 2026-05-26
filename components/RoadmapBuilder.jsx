'use client';

import { useState } from 'react';
import { useMode } from '@/lib/mode-context';

// ─────────────────────────────────────────────────────────────
// DATA — Secteurs, budgets, objectifs, contraintes
// ─────────────────────────────────────────────────────────────

const SECTEURS = {
  fr: [
    'Commerce & Retail', 'Industrie & Manufacturing', 'Services B2B', 'Services B2C',
    'Santé', 'Education & Formation', 'Immobilier', 'Finance & Assurance',
    'Restauration & Hôtellerie', 'Tech & Numérique', 'Autre',
  ],
  af: [
    'Commerce & Distribution', 'BTP & Construction', 'Agriculture & Agroalimentaire',
    'Transport & Logistique', 'Services financiers & Mobile Money', 'Santé & Pharmacie',
    'Education & Formation', 'Restauration & Hôtellerie', 'Import-Export',
    'Tech & Numérique', 'Autre',
  ],
};

const BUDGETS = {
  fr: ['< 5 000€', '5 000 – 20 000€', '20 000 – 50 000€', '50 000€+'],
  af: ['< 3 000 000 FCFA', '3 – 13 000 000 FCFA', '13 – 33 000 000 FCFA', '33 000 000 FCFA+'],
};

const OBJECTIFS = {
  fr: [
    { value: 'temps', label: 'Gagner du temps' },
    { value: 'couts', label: 'Réduire les coûts' },
    { value: 'ventes', label: 'Augmenter les ventes' },
    { value: 'communication', label: 'Mieux communiquer' },
    { value: 'conformite', label: 'Se conformer aux règles' },
  ],
  af: [
    { value: 'temps', label: 'Gagner du temps' },
    { value: 'couts', label: 'Réduire mes dépenses' },
    { value: 'ventes', label: 'Vendre plus' },
    { value: 'communication', label: 'Mieux me faire connaître' },
    { value: 'conformite', label: 'Respecter les règles' },
  ],
};

const CONTRAINTES = {
  fr: [
    'Budget limité', 'Équipe peu formée', 'Résistance interne',
    'Connectivité faible', 'Autre',
  ],
  af: [
    'Budget limité', 'Équipe peu numérisée', 'Résistance au changement',
    'Connexion internet instable', 'Coupures de courant fréquentes', 'Autre',
  ],
};

const TAILLES = [
  { value: '1-5', label: '1 – 5 personnes' },
  { value: '6-20', label: '6 – 20 personnes' },
  { value: '21-100', label: '21 – 100 personnes' },
  { value: '100+', label: '100+ personnes' },
];

const DELAIS = [
  { value: '3mois', label: '3 mois' },
  { value: '6mois', label: '6 mois' },
  { value: '1an', label: '1 an' },
];

// ─────────────────────────────────────────────────────────────
// PROMPTS SYSTÈME
// ─────────────────────────────────────────────────────────────

const ROADMAP_SYSTEM = {
  fr: `Tu es Nexalie OS, expert en transformation digitale pour PME françaises.
Génère une roadmap de transformation digitale en JSON strict, SANS texte avant ou après.
Format JSON obligatoire :
{
  "titre": "string",
  "resume": "string (2-3 phrases)",
  "phases": [
    {
      "periode": "string (ex: Mois 1-2)",
      "titre": "string",
      "objectif": "string",
      "actions": [
        {
          "semaine": "string (ex: S1-S2)",
          "action": "string",
          "pourquoi": "string",
          "ressources": "string",
          "budget_estime": "string",
          "kpi": "string",
          "priorite": "haute|moyenne|basse"
        }
      ]
    }
  ],
  "budget_total_estime": "string",
  "risques": ["string"],
  "prochaine_etape_immediate": "string"
}`,
  af: `Tu es Nexalie OS, expert en numérique pour entrepreneurs africains.
Tu comprends : connectivité variable, mobile-first, culture orale, Mobile Money, contraintes terrain.
Génère une roadmap réaliste en JSON strict, SANS texte avant ou après.
Format JSON identique. Adapte les actions aux réalités africaines (outils offline-first, Mobile Money, formation terrain, etc.).
Format JSON obligatoire :
{
  "titre": "string",
  "resume": "string (2-3 phrases)",
  "phases": [
    {
      "periode": "string (ex: Mois 1-2)",
      "titre": "string",
      "objectif": "string",
      "actions": [
        {
          "semaine": "string (ex: S1-S2)",
          "action": "string",
          "pourquoi": "string",
          "ressources": "string",
          "budget_estime": "string",
          "kpi": "string",
          "priorite": "haute|moyenne|basse"
        }
      ]
    }
  ],
  "budget_total_estime": "string",
  "risques": ["string"],
  "prochaine_etape_immediate": "string"
}`,
};

// ─────────────────────────────────────────────────────────────
// APPEL CLAUDE
// ─────────────────────────────────────────────────────────────

async function generateRoadmap(formData, mode) {
  const prompt = `Génère une roadmap de transformation digitale.
Secteur: ${formData.secteur}
Taille équipe: ${formData.taille} personnes
Budget: ${formData.budget}
Objectif principal: ${formData.objectif}
Score audit actuel: ${formData.score_audit}/100
Contraintes: ${formData.contraintes.join(', ') || 'aucune'}
Délai souhaité: ${formData.delai}
Génère une roadmap réaliste, progressive et adaptée à ce contexte.`;

  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: ROADMAP_SYSTEM[mode],
      messages: [{ role: 'user', content: prompt }],
      stream: false,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let errMsg = `Erreur API : ${res.status}`;
    try {
      const errData = JSON.parse(errText);
      if (errData.error) errMsg = errData.error;
    } catch {}
    throw new Error(errMsg);
  }

  // Le proxy /api/claude renvoie le body Anthropic tel quel.
  // En mode non-streaming, on le lit comme JSON.
  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('JSON non trouvé dans la réponse Claude.');
  return JSON.parse(jsonMatch[0]);
}

// ─────────────────────────────────────────────────────────────
// STYLES utilitaires
// ─────────────────────────────────────────────────────────────

const s = {
  page: {
    minHeight: '100vh',
    background: 'var(--nx-bg, #fff)',
    color: 'var(--nx-text-primary, #0A1628)',
    fontFamily: "'Inter', system-ui, sans-serif",
    padding: '32px 16px 80px',
  },
  container: {
    maxWidth: 860,
    margin: '0 auto',
  },
  heading: {
    fontSize: 28,
    fontWeight: 700,
    color: 'var(--nx-navy, #0A1628)',
    marginBottom: 4,
  },
  subheading: {
    fontSize: 15,
    color: 'var(--nx-text-secondary, #6B7A94)',
    marginBottom: 32,
  },
  card: {
    background: '#fff',
    border: '1px solid #E8ECF0',
    borderRadius: 12,
    padding: '24px 28px',
    marginBottom: 20,
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },
  label: {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--nx-navy, #0A1628)',
    marginBottom: 6,
  },
  select: {
    width: '100%',
    padding: '10px 14px',
    fontSize: 14,
    border: '1px solid #D0D7DE',
    borderRadius: 8,
    background: '#fff',
    color: 'var(--nx-text-primary, #0A1628)',
    outline: 'none',
    cursor: 'pointer',
    appearance: 'auto',
  },
  grid2: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 16,
  },
  sliderWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  slider: {
    flex: 1,
    accentColor: 'var(--nx-accent, #4EC9B0)',
  },
  sliderVal: {
    minWidth: 42,
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--nx-accent, #4EC9B0)',
    textAlign: 'right',
  },
  checkList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 4,
  },
  checkChip: (checked) => ({
    padding: '6px 14px',
    fontSize: 13,
    borderRadius: 20,
    border: `1.5px solid ${checked ? 'var(--nx-accent, #4EC9B0)' : '#D0D7DE'}`,
    background: checked ? 'rgba(78,201,176,0.10)' : '#fff',
    color: checked ? 'var(--nx-accent-dark, #1D6B60)' : 'var(--nx-text-secondary, #6B7A94)',
    cursor: 'pointer',
    fontWeight: checked ? 600 : 400,
    transition: 'all .15s',
  }),
  btnPrimary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '12px 28px',
    fontSize: 15,
    fontWeight: 700,
    borderRadius: 10,
    border: 'none',
    background: 'var(--nx-accent, #4EC9B0)',
    color: '#fff',
    cursor: 'pointer',
    transition: 'opacity .15s',
  },
  btnSecondary: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    fontSize: 14,
    fontWeight: 600,
    borderRadius: 10,
    border: '1.5px solid var(--nx-accent, #4EC9B0)',
    background: 'transparent',
    color: 'var(--nx-accent-dark, #1D6B60)',
    cursor: 'pointer',
    transition: 'background .15s',
  },
  error: {
    background: '#FFF0F0',
    border: '1px solid #FFB3B3',
    borderRadius: 8,
    padding: '12px 16px',
    color: '#C0392B',
    fontSize: 14,
    marginBottom: 16,
  },
};

// Badge de priorité
function PrioriteBadge({ p }) {
  const cfg = {
    haute: { bg: '#FFE8E8', color: '#C0392B', label: 'Haute' },
    moyenne: { bg: '#FFF4E0', color: '#A05A00', label: 'Moyenne' },
    basse: { bg: '#E8F5E9', color: '#2E7D32', label: 'Basse' },
  };
  const c = cfg[p] || cfg.basse;
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 10px',
      borderRadius: 12,
      fontSize: 11,
      fontWeight: 700,
      background: c.bg,
      color: c.color,
      textTransform: 'uppercase',
      letterSpacing: '0.04em',
    }}>
      {c.label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// FORMULAIRE
// ─────────────────────────────────────────────────────────────

function FormStep({ formData, setFormData, onSubmit, loading, error, mode }) {
  const secteurs = SECTEURS[mode] || SECTEURS.fr;
  const budgets = BUDGETS[mode] || BUDGETS.fr;
  const objectifs = OBJECTIFS[mode] || OBJECTIFS.fr;
  const contraintes = CONTRAINTES[mode] || CONTRAINTES.fr;

  function toggleContrainte(c) {
    setFormData(prev => {
      const has = prev.contraintes.includes(c);
      return {
        ...prev,
        contraintes: has ? prev.contraintes.filter(x => x !== c) : [...prev.contraintes, c],
      };
    });
  }

  const isValid = formData.secteur && formData.taille && formData.budget &&
    formData.objectif && formData.delai;

  return (
    <form onSubmit={e => { e.preventDefault(); if (isValid) onSubmit(); }}>
      {error && <div style={s.error}>{error}</div>}

      <div style={s.card}>
        <p style={{ fontSize: 13, color: 'var(--nx-text-secondary)', marginBottom: 20, marginTop: 0 }}>
          Renseignez votre contexte pour obtenir une roadmap personnalisée par Nexalie IA.
        </p>

        {/* Secteur */}
        <div style={{ marginBottom: 18 }}>
          <label style={s.label}>Secteur d'activité *</label>
          <select
            style={s.select}
            value={formData.secteur}
            onChange={e => setFormData(p => ({ ...p, secteur: e.target.value }))}
            required
          >
            <option value="">-- Sélectionner --</option>
            {secteurs.map(s_ => <option key={s_} value={s_}>{s_}</option>)}
          </select>
        </div>

        {/* Taille + Délai */}
        <div style={s.grid2}>
          <div>
            <label style={s.label}>Taille de l'équipe *</label>
            <select
              style={s.select}
              value={formData.taille}
              onChange={e => setFormData(p => ({ ...p, taille: e.target.value }))}
              required
            >
              <option value="">-- Sélectionner --</option>
              {TAILLES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label style={s.label}>Délai souhaité *</label>
            <select
              style={s.select}
              value={formData.delai}
              onChange={e => setFormData(p => ({ ...p, delai: e.target.value }))}
              required
            >
              <option value="">-- Sélectionner --</option>
              {DELAIS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div style={s.card}>
        {/* Budget */}
        <div style={{ marginBottom: 18 }}>
          <label style={s.label}>Budget disponible *</label>
          <div style={s.checkList}>
            {budgets.map(b => (
              <button
                key={b}
                type="button"
                style={s.checkChip(formData.budget === b)}
                onClick={() => setFormData(p => ({ ...p, budget: b }))}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        {/* Objectif */}
        <div>
          <label style={s.label}>Objectif principal *</label>
          <div style={s.checkList}>
            {objectifs.map(o => (
              <button
                key={o.value}
                type="button"
                style={s.checkChip(formData.objectif === o.value)}
                onClick={() => setFormData(p => ({ ...p, objectif: o.value }))}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={s.card}>
        {/* Score audit */}
        <div style={{ marginBottom: 22 }}>
          <label style={s.label}>
            Score de maturité digitale actuelle — {formData.score_audit}/100
          </label>
          <div style={s.sliderWrap}>
            <span style={{ fontSize: 12, color: 'var(--nx-text-secondary)' }}>0</span>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={formData.score_audit}
              onChange={e => setFormData(p => ({ ...p, score_audit: Number(e.target.value) }))}
              style={s.slider}
            />
            <span style={{ fontSize: 12, color: 'var(--nx-text-secondary)' }}>100</span>
            <span style={s.sliderVal}>{formData.score_audit}</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--nx-text-secondary)', margin: '4px 0 0' }}>
            {formData.score_audit < 30
              ? 'Débutant — beaucoup de potentiel à exploiter'
              : formData.score_audit < 60
              ? 'En progression — des bases solides à consolider'
              : formData.score_audit < 80
              ? 'Avancé — optimiser et automatiser'
              : 'Mature — innover et piloter par la donnée'}
          </p>
        </div>

        {/* Contraintes */}
        <div>
          <label style={s.label}>Contraintes identifiées (multi-sélection)</label>
          <div style={s.checkList}>
            {contraintes.map(c => (
              <button
                key={c}
                type="button"
                style={s.checkChip(formData.contraintes.includes(c))}
                onClick={() => toggleContrainte(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          type="submit"
          disabled={!isValid || loading}
          style={{ ...s.btnPrimary, opacity: (!isValid || loading) ? 0.5 : 1 }}
        >
          {loading ? 'Génération en cours…' : 'Générer ma roadmap IA →'}
        </button>
      </div>
    </form>
  );
}

// ─────────────────────────────────────────────────────────────
// ÉCRAN LOADING
// ─────────────────────────────────────────────────────────────

function LoadingStep() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 360,
      gap: 20,
    }}>
      <div style={{
        width: 56,
        height: 56,
        border: '4px solid #E8ECF0',
        borderTop: '4px solid var(--nx-accent, #4EC9B0)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <p style={{ fontSize: 16, color: 'var(--nx-text-secondary)', fontWeight: 500 }}>
        Nexalie IA analyse votre contexte et génère votre roadmap…
      </p>
      <p style={{ fontSize: 13, color: 'var(--nx-text-secondary)' }}>
        Cela peut prendre 15 à 30 secondes.
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// AFFICHAGE RÉSULTAT
// ─────────────────────────────────────────────────────────────

function ResultStep({ roadmap, onSave, saving, saved, onReset }) {
  const [activePhase, setActivePhase] = useState(0);

  if (!roadmap) return null;

  return (
    <div>
      {/* Header */}
      <div style={{
        ...s.card,
        background: 'linear-gradient(135deg, var(--nx-navy, #0A1628) 0%, #1B3A5C 100%)',
        color: '#fff',
        border: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: '0 0 10px', color: '#fff' }}>
              {roadmap.titre}
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.82)', margin: 0 }}>
              {roadmap.resume}
            </p>
          </div>
          <div style={{
            background: 'rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '10px 18px',
            textAlign: 'center',
            whiteSpace: 'nowrap',
          }}>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Budget total
            </div>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--nx-gold, #C9A84C)', marginTop: 4 }}>
              {roadmap.budget_total_estime}
            </div>
          </div>
        </div>
      </div>

      {/* Timeline des phases */}
      <div style={{ marginBottom: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--nx-navy)', marginBottom: 14 }}>
          Phases de la roadmap
        </h3>

        {/* Barre timeline */}
        <div style={{
          display: 'flex',
          gap: 0,
          overflowX: 'auto',
          paddingBottom: 4,
          marginBottom: 16,
        }}>
          {(roadmap.phases || []).map((phase, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActivePhase(idx === activePhase ? -1 : idx)}
              style={{
                flex: 1,
                minWidth: 140,
                padding: '12px 14px',
                border: 'none',
                borderBottom: `3px solid ${activePhase === idx ? 'var(--nx-accent, #4EC9B0)' : '#E8ECF0'}`,
                background: activePhase === idx ? 'rgba(78,201,176,0.07)' : '#fff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all .15s',
                position: 'relative',
              }}
            >
              <div style={{ fontSize: 11, color: 'var(--nx-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
                {phase.periode}
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: activePhase === idx ? 'var(--nx-accent-dark, #1D6B60)' : 'var(--nx-navy)' }}>
                {phase.titre}
              </div>
              <div style={{ fontSize: 12, color: 'var(--nx-text-secondary)', marginTop: 4, lineHeight: 1.4 }}>
                {phase.objectif}
              </div>
            </button>
          ))}
        </div>

        {/* Accordion phase active */}
        {activePhase >= 0 && roadmap.phases?.[activePhase] && (
          <div style={s.card}>
            <h4 style={{ fontSize: 15, fontWeight: 700, margin: '0 0 16px', color: 'var(--nx-navy)' }}>
              {roadmap.phases[activePhase].titre} — Actions détaillées
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(roadmap.phases[activePhase].actions || []).map((action, aIdx) => (
                <div
                  key={aIdx}
                  style={{
                    border: '1px solid #E8ECF0',
                    borderRadius: 10,
                    padding: '14px 18px',
                    background: '#FAFBFC',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                    <PrioriteBadge p={action.priorite} />
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: 'var(--nx-text-secondary)',
                      background: '#EEF2F7',
                      padding: '2px 10px',
                      borderRadius: 12,
                    }}>
                      {action.semaine}
                    </span>
                  </div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--nx-navy)', margin: '0 0 6px' }}>
                    {action.action}
                  </p>
                  <p style={{ fontSize: 13, color: 'var(--nx-text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>
                    {action.pourquoi}
                  </p>
                  <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--nx-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Ressources</span>
                      <p style={{ fontSize: 12, margin: '2px 0 0', color: 'var(--nx-text-primary)' }}>{action.ressources}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--nx-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>Budget estimé</span>
                      <p style={{ fontSize: 12, margin: '2px 0 0', color: 'var(--nx-text-primary)' }}>{action.budget_estime}</p>
                    </div>
                    <div>
                      <span style={{ fontSize: 11, color: 'var(--nx-text-secondary)', fontWeight: 600, textTransform: 'uppercase' }}>KPI</span>
                      <p style={{ fontSize: 12, margin: '2px 0 0', color: 'var(--nx-text-primary)' }}>{action.kpi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Risques */}
      {roadmap.risques?.length > 0 && (
        <div style={{ ...s.card, borderLeft: '4px solid #FFB347' }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: '#A05A00', marginTop: 0, marginBottom: 12 }}>
            Risques à anticiper
          </h3>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6 }}>
            {roadmap.risques.map((r, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--nx-text-primary)', lineHeight: 1.5 }}>{r}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Prochaine étape */}
      {roadmap.prochaine_etape_immediate && (
        <div style={{
          ...s.card,
          background: 'linear-gradient(135deg, rgba(78,201,176,0.12) 0%, rgba(78,201,176,0.04) 100%)',
          border: '1.5px solid var(--nx-accent, #4EC9B0)',
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--nx-accent-dark, #1D6B60)', marginBottom: 8 }}>
            Prochaine étape immédiate
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--nx-navy)', margin: 0, lineHeight: 1.6 }}>
            {roadmap.prochaine_etape_immediate}
          </p>
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: 8 }}>
        <button type="button" style={s.btnSecondary} onClick={onReset}>
          ← Nouvelle roadmap
        </button>
        <button
          type="button"
          style={s.btnSecondary}
          onClick={() => window.print()}
        >
          Imprimer / PDF
        </button>
        <button
          type="button"
          style={{
            ...s.btnPrimary,
            opacity: saving ? 0.6 : 1,
            background: saved ? 'var(--nx-green, #2E9B8B)' : 'var(--nx-accent, #4EC9B0)',
          }}
          onClick={onSave}
          disabled={saving || saved}
        >
          {saved ? '✓ Roadmap sauvegardée' : saving ? 'Sauvegarde…' : 'Sauvegarder ma roadmap'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────────────────────

const INITIAL_FORM = {
  secteur: '',
  taille: '',
  budget: '',
  objectif: '',
  score_audit: 50,
  contraintes: [],
  delai: '',
};

export default function RoadmapBuilder() {
  const { mode } = useMode();

  const [step, setStep] = useState('form'); // 'form' | 'loading' | 'result'
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [roadmap, setRoadmap] = useState(null);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleGenerate() {
    setError(null);
    setStep('loading');
    try {
      const result = await generateRoadmap(formData, mode);
      setRoadmap(result);
      setSaved(false);
      setStep('result');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la génération.');
      setStep('form');
    }
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/roadmap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roadmap_json: roadmap,
          mode,
          context: {
            secteur: formData.secteur,
            taille: formData.taille,
            budget: formData.budget,
            objectif: formData.objectif,
            score_audit: formData.score_audit,
            contraintes: formData.contraintes,
            delai: formData.delai,
          },
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erreur de sauvegarde');
      setSaved(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  function handleReset() {
    setStep('form');
    setRoadmap(null);
    setError(null);
    setSaved(false);
    setFormData(INITIAL_FORM);
  }

  const labels = {
    fr: { title: 'Roadmap Builder IA', subtitle: 'Générez votre plan de transformation digitale personnalisé en quelques secondes.' },
    af: { title: 'Roadmap Builder IA', subtitle: 'Obtenez un plan d\'action digital adapté aux réalités de votre marché.' },
  };
  const lbl = labels[mode] || labels.fr;

  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={s.heading}>{lbl.title}</h1>
          <p style={s.subheading}>{lbl.subtitle}</p>
        </div>

        {step === 'form' && (
          <FormStep
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleGenerate}
            loading={false}
            error={error}
            mode={mode}
          />
        )}

        {step === 'loading' && <LoadingStep />}

        {step === 'result' && (
          <ResultStep
            roadmap={roadmap}
            onSave={handleSave}
            saving={saving}
            saved={saved}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}
