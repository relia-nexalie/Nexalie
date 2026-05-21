'use client';

import { useState, useEffect } from 'react';
import { useMode } from '@/lib/mode-context';
import { createClient } from '@/lib/supabase/client';

const FREE_LIMIT = 3;
const PLANS_FULL = ['pro', 'institutions', 'starter'];

// ─── Ressources statiques ───────────────────────────────────────────
const RESOURCES = {
  fr: [
    { id: 'rgpd-checklist', icon: '🔒', category: 'Conformité', title: 'Checklist RGPD pour PME', desc: '47 points de contrôle pour être conforme en 2024.', type: 'PDF', free: true },
    { id: 'cdc-digital', icon: '📋', category: 'Templates', title: 'CDC Projet Digital', desc: 'Cahier des charges type pour votre prochain site web ou app.', type: 'DOCX', free: true },
    { id: 'audit-grille', icon: '📊', category: 'Outils', title: "Grille d'auto-évaluation digitale", desc: 'Évaluez 8 dimensions de votre maturité numérique.', type: 'XLS', free: true },
    { id: 'contrat-web', icon: '⚖️', category: 'Juridique', title: 'Contrat prestataire web (FR)', desc: 'Modèle de contrat de développement web conforme au droit français.', type: 'DOCX', free: false },
    { id: 'cgv-saas', icon: '📝', category: 'Juridique', title: 'CGV SaaS B2B', desc: 'Conditions générales de vente pour produit SaaS, droit français.', type: 'DOCX', free: false },
    { id: 'roi-digital', icon: '💹', category: 'Finance', title: 'Calculateur ROI Transformation', desc: 'Modèle Excel pour calculer le retour sur investissement de vos projets digitaux.', type: 'XLS', free: false },
    { id: 'presentation-conseil', icon: '🎯', category: 'Templates', title: 'Présentation Conseil de Direction', desc: 'Template PowerPoint pour présenter votre stratégie digitale au comité.', type: 'PPT', free: false },
    { id: 'kpi-digital', icon: '📈', category: 'Outils', title: 'Tableau de bord KPI Digital', desc: '32 indicateurs clés à suivre pour piloter votre transformation.', type: 'XLS', free: false },
    { id: 'benchmark-fr', icon: '🏆', category: 'Études', title: 'Benchmark Sectoriel France 2024', desc: 'Comparez-vous aux leaders de votre secteur sur 6 dimensions.', type: 'PDF', free: false },
  ],
  af: [
    { id: 'ohada-digital', icon: '⚖️', category: 'Juridique', title: 'Contrat OHADA Digital', desc: 'Modèle de contrat numérique conforme au droit OHADA.', type: 'DOCX', free: true },
    { id: 'mobile-money-guide', icon: '📱', category: 'Finance', title: 'Guide Mobile Money Business', desc: 'Intégrez Orange Money, MTN MoMo et Wave dans votre activité.', type: 'PDF', free: true },
    { id: 'audit-pme-af', icon: '📊', category: 'Outils', title: 'Grille Bilan Numérique PME Afrique', desc: "Évaluation adaptée aux réalités terrain d'Afrique francophone.", type: 'XLS', free: true },
    { id: 'cdc-web-af', icon: '📋', category: 'Templates', title: 'CDC Site Web Afrique', desc: 'Cahier des charges adapté aux contraintes réseau et mobile-first.', type: 'DOCX', free: false },
    { id: 'guide-donnees-cg', icon: '🇨🇬', category: 'Réglementation', title: 'Guide Protection Données Congo', desc: 'Obligations légales et bonnes pratiques pour les données personnelles au Congo.', type: 'PDF', free: false },
    { id: 'contrat-logiciel-ohada', icon: '📝', category: 'Juridique', title: 'Contrat Logiciel OHADA', desc: "Licence d'utilisation logicielle conforme au droit OHADA.", type: 'DOCX', free: false },
    { id: 'roi-af', icon: '💹', category: 'Finance', title: 'Calculateur ROI (FCFA)', desc: 'Calcul de rentabilité de vos investissements digitaux en FCFA.', type: 'XLS', free: false },
    { id: 'benchmark-ci', icon: '🏆', category: 'Études', title: "Benchmark Côte d'Ivoire 2024", desc: 'Positionnement sectoriel digital des PME ivoiriennes.', type: 'PDF', free: false },
    { id: 'kpi-af', icon: '📈', category: 'Outils', title: 'KPI Transformation Afrique', desc: 'Indicateurs adaptés aux contextes à connectivité variable.', type: 'XLS', free: false },
  ],
};

const TYPE_COLORS = {
  PDF: { bg: '#FEF2F2', color: '#991B1B' },
  DOCX: { bg: '#EFF6FF', color: '#1D4ED8' },
  XLS: { bg: '#F0FDF4', color: '#166534' },
  PPT: { bg: '#FFF7ED', color: '#9A3412' },
};

export default function ResourcesPage() {
  const { mode, isAfrica } = useMode();
  const [userPlan, setUserPlan] = useState('free');
  const [filter, setFilter] = useState('Tous');
  const [loading, setLoading] = useState(true);

  const accent = isAfrica ? '#E88C32' : '#4EC9B0';
  const navy = isAfrica ? '#1A0800' : '#0A1628';

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return; }
      supabase.from('profiles').select('plan').eq('id', user.id).single()
        .then(({ data }) => { setUserPlan(data?.plan || 'free'); setLoading(false); });
    });
  }, []);

  const resources = RESOURCES[mode] || RESOURCES.fr;
  const hasFullAccess = PLANS_FULL.includes(userPlan);
  const categories = ['Tous', ...new Set(resources.map(r => r.category))];
  const filtered = filter === 'Tous' ? resources : resources.filter(r => r.category === filter);

  // Plan gratuit : 3 ressources gratuites seulement
  const visibleResources = hasFullAccess
    ? filtered
    : filtered.filter(r => r.free).slice(0, FREE_LIMIT);
  const lockedCount = filtered.length - visibleResources.length;

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: '32px', height: '32px', border: `3px solid ${accent}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ background: navy, padding: '48px 24px 40px', color: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontSize: '11px', letterSpacing: '3px', color: accent, textTransform: 'uppercase', marginBottom: '10px' }}>Bibliothèque</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,42px)', fontWeight: 300, marginBottom: '10px' }}>
            {isAfrica ? 'Ressources terrain Afrique' : 'Ressources & Templates'}
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '15px' }}>
            {isAfrica
              ? 'Guides OHADA, Mobile Money, templates adaptés aux réalités africaines.'
              : 'Templates RGPD, CDC, contrats web, outils de pilotage.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Filtre catégories */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '28px' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              style={{
                padding: '8px 16px', borderRadius: '20px', border: '1.5px solid',
                borderColor: filter === cat ? accent : 'rgba(0,0,0,0.12)',
                background: filter === cat ? `${accent}15` : '#fff',
                color: filter === cat ? accent : '#6B7A94',
                fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Bannière plan gratuit */}
        {!hasFullAccess && (
          <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', borderRadius: '12px', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
            <p style={{ fontSize: '13px', color: '#92400E', margin: 0 }}>
              <strong>{FREE_LIMIT} ressources gratuites</strong> disponibles. Passez Pro pour tout débloquer.
            </p>
            <a href="/pricing" style={{ background: accent, color: '#fff', padding: '8px 18px', borderRadius: '8px', textDecoration: 'none', fontWeight: 700, fontSize: '13px', whiteSpace: 'nowrap' }}>
              Voir les plans →
            </a>
          </div>
        )}

        {/* Grille ressources */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px,1fr))', gap: '16px' }}>
          {visibleResources.map(r => {
            const tc = TYPE_COLORS[r.type] || { bg: '#F3F4F6', color: '#374151' };
            return (
              <div key={r.id} style={{ background: '#fff', border: '1.5px solid rgba(0,0,0,0.07)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '28px' }}>{r.icon}</span>
                  <span style={{ background: tc.bg, color: tc.color, fontSize: '11px', fontWeight: 700, padding: '3px 9px', borderRadius: '6px' }}>{r.type}</span>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{r.category}</p>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, color: navy, marginBottom: '6px', lineHeight: 1.3 }}>{r.title}</h3>
                  <p style={{ fontSize: '13px', color: '#6B7A94', lineHeight: 1.6 }}>{r.desc}</p>
                </div>
                <button
                  style={{
                    marginTop: 'auto', padding: '10px 16px', borderRadius: '8px', border: `1.5px solid ${accent}`,
                    background: 'transparent', color: accent, fontWeight: 700, fontSize: '13px',
                    cursor: 'pointer', transition: 'all 0.15s',
                  }}
                  onClick={() => {
                    const url = `/api/resources/download?id=${r.id}`;
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `nexali-${r.id}.txt`;
                    a.click();
                  }}
                >
                  Télécharger →
                </button>
              </div>
            );
          })}

          {/* Cartes verrouillées */}
          {!hasFullAccess && lockedCount > 0 && Array.from({ length: Math.min(lockedCount, 3) }).map((_, i) => (
            <div key={`locked-${i}`} style={{ background: '#F9FAFB', border: '1.5px dashed rgba(0,0,0,0.12)', borderRadius: '14px', padding: '22px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: '10px', minHeight: '180px' }}>
              <span style={{ fontSize: '28px', filter: 'grayscale(1)', opacity: 0.4 }}>🔒</span>
              <p style={{ fontSize: '13px', color: '#9CA3AF' }}>Disponible à partir du plan <strong>Starter</strong></p>
              <a href="/pricing" style={{ fontSize: '12px', color: accent, fontWeight: 600, textDecoration: 'none' }}>Débloquer →</a>
            </div>
          ))}
        </div>

        {!hasFullAccess && lockedCount > 3 && (
          <p style={{ textAlign: 'center', color: '#6B7A94', fontSize: '13px', marginTop: '20px' }}>
            + {lockedCount - 3} ressources supplémentaires disponibles avec un plan payant.
          </p>
        )}
      </div>
    </div>
  );
}
