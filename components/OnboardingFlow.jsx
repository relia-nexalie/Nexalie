'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMode } from '@/lib/mode-context';

// ─── Secteurs par mode ──────────────────────────────────────────────
const SECTEURS = {
  fr: [
    'Retail & Commerce',
    'Industrie & Manufacturing',
    'Services B2B',
    'Services B2C',
    'BTP & Construction',
    'Santé & Médical',
    'Éducation & Formation',
    'Finance & Assurance',
    'Immobilier',
    'Tourisme & Hôtellerie',
    'Agriculture & Agroalimentaire',
    'Technologie & SaaS',
    'Autre',
  ],
  af: [
    'Commerce & Distribution',
    'Services & Conseil',
    'BTP & Construction',
    'Agroalimentaire & Agriculture',
    'Santé & Pharmacie',
    'Éducation & Formation',
    'Finance & Mobile Money',
    'Transport & Logistique',
    'Tourisme & Hôtellerie',
    'Technologie & Digital',
    'Artisanat & Création',
    'Autre',
  ],
};

const PAYS_AF = ['Congo', "Côte d'Ivoire", 'Cameroun', 'Sénégal', 'Mali', 'Burkina Faso', 'Bénin', 'Togo', 'Gabon', 'Autre'];

const OBJECTIFS = {
  fr: [
    { id: 'temps', icon: '⏱️', label: 'Gagner du temps' },
    { id: 'couts', icon: '💰', label: 'Réduire mes coûts' },
    { id: 'ventes', icon: '📈', label: 'Augmenter mes ventes' },
    { id: 'communication', icon: '📣', label: 'Mieux communiquer' },
    { id: 'conformite', icon: '✅', label: 'Me conformer aux règles' },
  ],
  af: [
    { id: 'temps', icon: '⏱️', label: 'Gagner du temps' },
    { id: 'couts', icon: '💰', label: 'Réduire mes coûts' },
    { id: 'ventes', icon: '📈', label: 'Augmenter mes ventes' },
    { id: 'communication', icon: '📣', label: 'Mieux communiquer' },
    { id: 'conformite', icon: '✅', label: 'Me conformer aux règles' },
  ],
};

// ─── Styles constants ───────────────────────────────────────────────
const S = {
  btn: {
    display: 'block',
    width: '100%',
    padding: '14px 20px',
    borderRadius: '10px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: 700,
    textAlign: 'center',
    transition: 'opacity 0.2s',
  },
  btnPrimary: {
    background: 'var(--nx-accent)',
    color: '#fff',
  },
  btnSecondary: {
    background: 'transparent',
    color: 'var(--nx-text-secondary)',
    textDecoration: 'underline',
    fontWeight: 400,
    fontSize: '14px',
  },
  card: {
    border: '2px solid rgba(0,0,0,0.08)',
    borderRadius: '12px',
    padding: '16px',
    cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s',
    background: '#fff',
  },
  cardSelected: {
    borderColor: 'var(--nx-accent)',
    background: 'rgba(78,201,176,0.06)',
  },
  label: {
    display: 'block',
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--nx-text-secondary)',
    marginBottom: '6px',
    letterSpacing: '0.5px',
    textTransform: 'uppercase',
  },
  select: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1.5px solid rgba(0,0,0,0.12)',
    fontSize: '14px',
    color: 'var(--nx-text-primary)',
    background: '#fff',
    appearance: 'none',
    cursor: 'pointer',
  },
};

// ─── Step 1 — Qui es-tu ? ───────────────────────────────────────────
function Step1({ mode, data, onChange }) {
  const types = [
    { id: 'entreprise', icon: '🏢', label: 'Entreprise' },
    { id: 'independant', icon: '👤', label: 'Indépendant' },
    { id: 'institution', icon: '🏛️', label: 'Institution publique' },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 300, color: 'var(--nx-text-primary)', marginBottom: '8px' }}>
        Qui es-tu ?
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--nx-text-secondary)', marginBottom: '32px', lineHeight: 1.6 }}>
        Ces informations personnalisent ton espace Nexalie.
      </p>

      {/* Type structure */}
      <p style={S.label}>Type de structure</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '24px' }}>
        {types.map(t => (
          <div
            key={t.id}
            onClick={() => onChange({ company_type: t.id })}
            style={{
              ...S.card,
              ...(data.company_type === t.id ? S.cardSelected : {}),
              textAlign: 'center',
              padding: '20px 12px',
            }}
          >
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>{t.icon}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--nx-text-primary)' }}>{t.label}</div>
          </div>
        ))}
      </div>

      {/* Secteur */}
      <div style={{ marginBottom: '20px' }}>
        <label style={S.label}>Secteur d'activité</label>
        <div style={{ position: 'relative' }}>
          <select
            value={data.secteur || ''}
            onChange={e => onChange({ secteur: e.target.value })}
            style={S.select}
          >
            <option value="">Sélectionne ton secteur…</option>
            {SECTEURS[mode].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--nx-text-secondary)' }}>▾</span>
        </div>
      </div>

      {/* Pays — mode af uniquement */}
      {mode === 'af' && (
        <div style={{ marginBottom: '20px' }}>
          <label style={S.label}>Ton pays</label>
          <div style={{ position: 'relative' }}>
            <select
              value={data.pays || ''}
              onChange={e => onChange({ pays: e.target.value })}
              style={S.select}
            >
              <option value="">Sélectionne ton pays…</option>
              {PAYS_AF.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--nx-text-secondary)' }}>▾</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Step 2 — Niveau digital ────────────────────────────────────────
function Step2({ mode, onGoAudit, onSkip }) {
  const auditLabel = mode === 'af' ? 'Bilan Numérique' : 'Audit de Maturité Digitale';

  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '20px' }}>📊</div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 300, color: 'var(--nx-text-primary)', marginBottom: '12px' }}>
        Connais-tu ton niveau numérique ?
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--nx-text-secondary)', marginBottom: '36px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 36px' }}>
        Le {auditLabel} prend <strong>3 min</strong> et personnalise ton espace avec des recommandations sur-mesure.
      </p>

      <button
        onClick={onGoAudit}
        style={{ ...S.btn, ...S.btnPrimary, marginBottom: '16px' }}
      >
        Faire mon {auditLabel} maintenant
      </button>

      <button
        onClick={onSkip}
        style={{ ...S.btn, ...S.btnSecondary, width: 'auto', display: 'block', margin: '0 auto' }}
      >
        Je le ferai plus tard →
      </button>
    </div>
  );
}

// ─── Step 3 — Objectif principal ───────────────────────────────────
function Step3({ mode, data, onChange }) {
  const objectifs = OBJECTIFS[mode];

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,32px)', fontWeight: 300, color: 'var(--nx-text-primary)', marginBottom: '8px' }}>
        Quel est ton objectif principal ?
      </h2>
      <p style={{ fontSize: '15px', color: 'var(--nx-text-secondary)', marginBottom: '28px', lineHeight: 1.6 }}>
        Nexalie adapte ses recommandations à ta priorité.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {objectifs.map(o => (
          <div
            key={o.id}
            onClick={() => onChange({ objectif_principal: o.id })}
            style={{
              ...S.card,
              ...(data.objectif_principal === o.id ? S.cardSelected : {}),
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <span style={{ fontSize: '26px', flexShrink: 0 }}>{o.icon}</span>
            <span style={{ fontSize: '15px', fontWeight: 600, color: 'var(--nx-text-primary)' }}>{o.label}</span>
            {data.objectif_principal === o.id && (
              <span style={{ marginLeft: 'auto', color: 'var(--nx-accent)', fontSize: '18px', fontWeight: 700 }}>✓</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4 — Découvrir les outils ─────────────────────────────────
function Step4({ mode, userName, onFinish, finishing }) {
  const [activeFeature, setActiveFeature] = useState(0);

  const auditLabel = mode === 'af' ? 'Bilan Numérique' : 'Audit de Maturité Digitale';
  const roadmapLabel = mode === 'af' ? "Plan d'Action Digital" : 'Roadmap Builder';

  const features = [
    {
      icon: '📊',
      title: auditLabel,
      description: 'Évalue ton niveau, obtiens 5 recommandations personnalisées issues de ton diagnostic.',
      link: '/audit',
    },
    {
      icon: '🗺️',
      title: roadmapLabel,
      description: "L'IA génère ta feuille de route sur-mesure : priorités, délais, budget estimé.",
      link: '/platform/roadmap',
    },
    {
      icon: '🤖',
      title: 'Nexalie OS',
      description: 'Ton assistant IA disponible 24/7 pour toutes tes questions business et digital.',
      link: '/platform',
    },
  ];

  return (
    <div>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(20px,3vw,28px)', fontWeight: 300, color: 'var(--nx-text-primary)', marginBottom: '6px' }}>
        Découvre tes outils en 60 sec
      </h2>
      <p style={{ fontSize: '14px', color: 'var(--nx-text-secondary)', marginBottom: '28px' }}>
        Clique sur chaque outil pour en savoir plus.
      </p>

      {/* Feature tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
        {features.map((f, i) => (
          <button
            key={i}
            onClick={() => setActiveFeature(i)}
            style={{
              flex: 1,
              padding: '10px 6px',
              borderRadius: '8px',
              border: '2px solid',
              borderColor: activeFeature === i ? 'var(--nx-accent)' : 'rgba(0,0,0,0.08)',
              background: activeFeature === i ? 'rgba(78,201,176,0.08)' : '#fff',
              cursor: 'pointer',
              fontSize: '11px',
              fontWeight: 600,
              color: activeFeature === i ? 'var(--nx-accent)' : 'var(--nx-text-secondary)',
              textAlign: 'center',
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: '22px', marginBottom: '4px' }}>{f.icon}</div>
            {f.title}
          </button>
        ))}
      </div>

      {/* Feature detail */}
      <div
        key={activeFeature}
        style={{
          padding: '24px',
          background: 'var(--nx-section-bg)',
          borderRadius: '12px',
          marginBottom: '28px',
          animation: 'fadeInUp 0.3s ease',
        }}
      >
        <div style={{ fontSize: '36px', marginBottom: '12px' }}>{features[activeFeature].icon}</div>
        <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--nx-text-primary)', marginBottom: '8px' }}>
          {features[activeFeature].title}
        </h3>
        <p style={{ fontSize: '14px', color: 'var(--nx-text-secondary)', lineHeight: 1.7, marginBottom: '0' }}>
          {features[activeFeature].description}
        </p>
      </div>

      {/* CTA plan gratuit (optionnel — toujours visible comme suggestion) */}
      <div style={{ padding: '14px 16px', background: 'rgba(201,168,76,0.08)', border: '1.5px solid rgba(201,168,76,0.3)', borderRadius: '10px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <p style={{ fontSize: '13px', color: 'var(--nx-text-primary)', margin: 0 }}>
          <strong>Plan Pro</strong> — Accède à tous les outils sans limite
        </p>
        <a
          href="/pricing"
          style={{ fontSize: '12px', fontWeight: 700, color: 'var(--nx-gold, #C9A84C)', textDecoration: 'none', whiteSpace: 'nowrap' }}
        >
          Voir les plans →
        </a>
      </div>

      <button
        onClick={onFinish}
        disabled={finishing}
        style={{ ...S.btn, ...S.btnPrimary, opacity: finishing ? 0.7 : 1 }}
      >
        {finishing ? 'Chargement…' : 'Accéder à ma plateforme →'}
      </button>
    </div>
  );
}

// ─── Composant principal ────────────────────────────────────────────
export default function OnboardingFlow({ userName, initialMode }) {
  const { mode: contextMode } = useMode();
  // Utilise le mode du profil s'il est défini, sinon celui du contexte
  const mode = initialMode || contextMode;

  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    company_type: '',
    secteur: '',
    pays: '',
    objectif_principal: '',
  });
  const [finishing, setFinishing] = useState(false);
  const router = useRouter();

  const saveStep = async (updates) => {
    try {
      await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });
    } catch (_) {
      // fail silently — ne bloque pas le flow
    }
  };

  const handleChange = (updates) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  const goNext = async () => {
    if (step === 1) {
      await saveStep({
        company_type: data.company_type || undefined,
        secteur: data.secteur || undefined,
        pays: data.pays || undefined,
      });
    } else if (step === 3) {
      await saveStep({ objectif_principal: data.objectif_principal || undefined });
    }
    setStep(s => s + 1);
  };

  const handleGoAudit = async () => {
    await saveStep({
      company_type: data.company_type || undefined,
      secteur: data.secteur || undefined,
      pays: data.pays || undefined,
    });
    router.push('/audit');
  };

  const handleSkipAudit = () => {
    setStep(3);
  };

  const handleFinish = async () => {
    setFinishing(true);
    await saveStep({ completed: true });
    router.push('/platform');
  };

  // Step 1 validation — au moins le type de structure
  const canProceedStep1 = !!data.company_type;
  // Step 3 validation
  const canProceedStep3 = !!data.objectif_principal;

  const stepBg = step % 2 === 0 ? 'var(--nx-section-bg)' : '#fff';

  return (
    <div style={{
      minHeight: '100vh',
      background: stepBg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      transition: 'background 0.4s',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    }}>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ width: '100%', maxWidth: '500px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'baseline', gap: '6px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 300, color: 'var(--nx-text-primary)' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: 'var(--nx-accent)' }}>AI</span>
          </a>
        </div>

        {/* Greeting */}
        {userName && (
          <p style={{ textAlign: 'center', fontSize: '13px', color: 'var(--nx-text-secondary)', marginBottom: '24px' }}>
            Bonjour {userName.split('@')[0]} — bienvenue sur Nexalie !
          </p>
        )}

        {/* Progress bar */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{ display: 'flex', gap: '8px' }}>
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                style={{
                  flex: 1,
                  height: '4px',
                  borderRadius: '2px',
                  background: s <= step ? 'var(--nx-accent)' : 'rgba(0,0,0,0.1)',
                  transition: 'background 0.3s',
                }}
              />
            ))}
          </div>
          <p style={{ color: 'var(--nx-text-secondary)', fontSize: '0.8rem', marginTop: '8px' }}>
            Étape {step} sur 4
          </p>
        </div>

        {/* Content */}
        <div style={{ animation: 'fadeInUp 0.35s ease' }} key={step}>
          {step === 1 && (
            <>
              <Step1 mode={mode} data={data} onChange={handleChange} />
              <div style={{ marginTop: '32px' }}>
                <button
                  onClick={goNext}
                  disabled={!canProceedStep1}
                  style={{
                    ...S.btn,
                    ...S.btnPrimary,
                    opacity: canProceedStep1 ? 1 : 0.45,
                    cursor: canProceedStep1 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Continuer →
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <Step2
              mode={mode}
              onGoAudit={handleGoAudit}
              onSkip={handleSkipAudit}
            />
          )}

          {step === 3 && (
            <>
              <Step3 mode={mode} data={data} onChange={handleChange} />
              <div style={{ marginTop: '32px' }}>
                <button
                  onClick={goNext}
                  disabled={!canProceedStep3}
                  style={{
                    ...S.btn,
                    ...S.btnPrimary,
                    opacity: canProceedStep3 ? 1 : 0.45,
                    cursor: canProceedStep3 ? 'pointer' : 'not-allowed',
                  }}
                >
                  Continuer →
                </button>
              </div>
            </>
          )}

          {step === 4 && (
            <Step4
              mode={mode}
              userName={userName}
              onFinish={handleFinish}
              finishing={finishing}
            />
          )}
        </div>

        {/* Back link — pas sur step 1 */}
        {step > 1 && step < 4 && (
          <button
            onClick={() => setStep(s => s - 1)}
            style={{
              ...S.btn,
              ...S.btnSecondary,
              marginTop: '20px',
              width: 'auto',
              display: 'block',
              margin: '20px auto 0',
            }}
          >
            ← Retour
          </button>
        )}
      </div>
    </div>
  );
}
