'use client';

import { useEffect } from "react";
import Link from "next/link";
import { BarChart2, DollarSign, ClipboardList, Map, Search, FileText } from "lucide-react";

// ═══════════════════════════════════════════
// DESIGN TOKENS — branchés sur globals.css
// ═══════════════════════════════════════════

const BRAND  = 'var(--color-brand)';   // vert-profond : sections sombres, CTA
const NIGHT  = 'var(--color-night)';   // bleu-nuit    : texte foncé
const GOLD   = 'var(--color-gold)';    // or-doux      : accents
const IVORY  = 'var(--color-ivory)';   // ivoire       : fonds clairs
const MUTED  = 'var(--color-muted)';   // gris-ardoise : texte secondaire

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function NexaliSite() {
  useReveal();
  return (
    <div style={{ background: '#fff', color: NIGHT, fontFamily: 'var(--font-jakarta, -apple-system, sans-serif)' }}>
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          .nx-hero-grid       { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-score-card      { min-width: unset !important; width: 100% !important; }
          .nx-platform-grid   { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-steps-grid      { grid-template-columns: 1fr !important; }
          .nx-cta-buttons     { flex-direction: column !important; align-items: stretch !important; }
          .nx-cta-buttons a   { text-align: center !important; }
          .nx-hero-buttons    { flex-direction: column !important; align-items: stretch !important; }
          .nx-hero-buttons a  { text-align: center !important; }
          .nx-context-grid    { grid-template-columns: 1fr 1fr !important; }
          .nx-tools-grid      { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .nx-context-grid    { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="kongo-texture" style={{ background: BRAND, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <div className="nx-hero-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '1px', color: GOLD }}>
                Plateforme numérique · PME africaines
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              La boussole numérique<br />
              des <em style={{ color: GOLD, fontStyle: 'italic' }}>PME africaines</em>
            </h1>

            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '520px' }}>
              Évaluez gratuitement la maturité numérique de votre entreprise en moins de 20 minutes. Recevez une feuille de route concrète, adaptée à votre réalité : Mobile Money, cadre OHADA, marchés locaux.{' '}
              <strong style={{ color: '#fff' }}>C&apos;est gratuit. Pensé pour vous.</strong>
            </p>

            <div className="nx-hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/audit" className="btn-gold" style={{ padding: '15px 30px', background: GOLD, borderRadius: '8px', color: NIGHT, fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(201,168,76,0.35)' }}>
                Faire mon audit gratuit →
              </Link>
              <Link href="/institutions" style={{ padding: '15px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
                Pour les institutions
              </Link>
            </div>
          </div>

          {/* Score card */}
          <div className="nx-score-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '16px', padding: '28px', minWidth: '280px' }}>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '1.5px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', textTransform: 'uppercase' }}>Maturité digitale</p>
            {[
              ['Présence en ligne', 35],
              ['Outillage numérique', 55],
              ['Automatisation', 25],
              ['Financement digital', 45],
              ['Cybersécurité', 30],
            ].map(([label, w]) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', color: GOLD }}>?/20</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{ width: `${w}%`, height: '100%', background: GOLD, borderRadius: '2px' }} />
                </div>
              </div>
            ))}
            <Link href="/audit" style={{ display: 'block', width: '100%', marginTop: '16px', padding: '12px', background: GOLD, border: 'none', borderRadius: '8px', color: NIGHT, fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '1px', textAlign: 'center', textDecoration: 'none' }}>
              DÉMARRER MON AUDIT GRATUIT
            </Link>
          </div>
        </div>
      </section>

      {/* ── CONTEXTE ─────────────────────────────────────────────── */}
      <section style={{ background: IVORY, padding: '56px 24px', borderBottom: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: GOLD, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Contexte</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 400, color: NIGHT, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.01em' }}>
            Les PME africaines portent 95 % de l&apos;économie réelle, mais manquent d&apos;outils numériques adaptés
          </h2>
          <div className="nx-context-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { value: '90 000', label: 'PME formelles au Congo', note: 'Ministère des PME, 2023' },
              { value: '93,4 %', label: 'opèrent dans l\'informel', note: '~840 000 unités non structurées' },
              { value: '95 %',   label: 'de l\'économie portée par les PME', note: 'Emploi, VA, maillage territorial' },
              { value: '< 12 %', label: 'ont des outils numériques actifs', note: 'Estimation Nexalie, 2024' },
            ].map((s, i) => (
              <div key={i} className="card-hover reveal" style={{ padding: '24px 20px', background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.04)', transitionDelay: `${i * 80}ms` }}>
                <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '32px', fontWeight: 300, color: NIGHT, marginBottom: '6px' }}>{s.value}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: NIGHT, marginBottom: '6px', lineHeight: 1.4 }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', color: '#94A3B8', lineHeight: 1.5 }}>{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STAT TICKER ──────────────────────────────────────────── */}
      <section style={{ borderBottom: '1px solid #E2E8F0', padding: '20px 24px', background: '#fff' }}>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(0,0,0,0.4)', margin: 0 }}>
          20 questions · 6 dimensions · résultats en 5 minutes · gratuit
        </p>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────────────────── */}
      <section className="kongo-texture" style={{ padding: '72px 24px', background: BRAND, overflow: 'hidden' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: 'rgba(201,168,76,0.7)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' }}>Processus</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(34px,5vw,50px)', fontWeight: 400, color: '#fff', textAlign: 'center', marginBottom: '6px', letterSpacing: '-0.01em' }}>
            Comment ça fonctionne
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.55)', textAlign: 'center', marginBottom: '48px' }}>20 questions. Un score. Trois actions. Sans consultant.</p>

          <div className="nx-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                num: '01',
                title: 'Vous répondez à 20 questions',
                text: 'Les questions sont calibrées pour votre réalité : connexion instable, équipe peu digitalisée, paiements mobiles, coupures de courant. Pas de jargon, pas de prérequis technique.',
              },
              {
                num: '02',
                title: 'L\'IA génère votre feuille de route',
                text: 'Score sur 100, recommandations avec outils adaptés au contexte africain (Wave, CinetPay, Notion, Make…), plan d\'action 90 jours.',
              },
              {
                num: '03',
                title: 'Vous avancez, étape par étape',
                text: 'Chaque action est sélectionnée pour fonctionner dans votre contexte : outils légers, accessibles sur mobile, compatibles avec vos habitudes de terrain.',
              },
            ].map(step => (
              <div key={step.num} style={{ position: 'relative', padding: '32px 24px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{
                  position: 'absolute', top: '-10px', right: '12px',
                  fontFamily: 'var(--font-display, system-ui, sans-serif)',
                  fontSize: '120px', fontWeight: 300,
                  color: 'rgba(255,255,255,0.05)', lineHeight: 1,
                  pointerEvents: 'none', userSelect: 'none',
                }}>{step.num}</span>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', fontWeight: 700, color: GOLD, marginBottom: '14px', letterSpacing: '0.1em' }}>{step.num}</p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.4, position: 'relative' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, position: 'relative' }}>{step.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/audit" style={{ padding: '14px 32px', background: GOLD, borderRadius: '8px', color: NIGHT, fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Démarrer maintenant, c&apos;est gratuit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATEFORME ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: IVORY }}>
        <div className="nx-platform-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: GOLD, marginBottom: '10px', textTransform: 'uppercase' }}>Plateforme</p>
            <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,4vw,44px)', fontWeight: 400, color: NIGHT, marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Les outils adaptés à la réalité des PME africaines
            </h2>
            <p style={{ fontSize: '15px', color: MUTED, lineHeight: 1.8, marginBottom: '28px' }}>
              Un score de maturité en 5 minutes. Une feuille de route sur mesure. Des recommandations qui fonctionnent dans votre réalité, sans consultant ni budget importé.
            </p>
            <Link href="/platform" style={{ padding: '12px 24px', background: BRAND, borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Découvrir la plateforme →
            </Link>
          </div>
          <div className="nx-tools-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { Icon: BarChart2,    name: 'Audit Digital',          wide: true  },
              { Icon: DollarSign,   name: 'Calculateur ROI',        wide: false },
              { Icon: ClipboardList,name: 'Business Plan IA',       wide: false },
              { Icon: Map,          name: 'Roadmap 12 mois',        wide: false },
              { Icon: Search,       name: 'Veille Concurrentielle', wide: false },
              { Icon: FileText,     name: 'Cahier des Charges',     wide: false },
            ].map(({ Icon, name, wide }) => (
              <div key={name} className="card-hover" style={{
                gridColumn: wide ? '1 / -1' : undefined,
                padding: '24px',
                background: '#fff',
                border: '1px solid #E2E8F0',
                borderLeft: `3px solid ${GOLD}`,
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}>
                <Icon size={18} color={GOLD} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '13px', fontWeight: 700, color: NIGHT, marginBottom: '4px' }}>{name}</p>
                <p style={{ fontSize: '11px', color: '#2D6A4F', fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, letterSpacing: '0.05em' }}>Gratuit</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAS D'USAGE ────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: GOLD, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Terrain</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 400, color: NIGHT, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Ce que ça change, concrètement
          </h2>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '40px', letterSpacing: '0.05em' }}>
            Exemples de cas d&apos;usage illustratifs
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { sector: 'Commerce & Distribution', text: "Un grossiste d'Abidjan suit ses ventes sur mobile malgré les coupures courant : stock toujours à jour." },
              { sector: 'Services & Conseil',      text: 'Une agence à Brazzaville passe de WhatsApp à un CRM simple : 50 % de clients perdus en moins.' },
              { sector: 'BTP & Construction',      text: 'Un entrepreneur camerounais gère ses chantiers à distance depuis son téléphone : coordination multipliée par 3.' },
            ].map((c) => (
              <div key={c.sector} className="card-hover reveal" style={{ padding: '32px 28px', background: IVORY, border: '1px solid #E2E8F0', borderLeft: `3px solid ${GOLD}`, borderRadius: '8px' }}>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, marginBottom: '16px' }}>{c.sector}</p>
                <p style={{ fontSize: '15px', color: NIGHT, lineHeight: 1.75 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS TEASER ────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: '#fff', borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: GOLD, marginBottom: '12px', textTransform: 'uppercase' }}>Notre raison d&apos;être</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,4vw,44px)', fontWeight: 400, color: NIGHT, marginBottom: '20px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
            Née ici. Pensée pour ici.
          </h2>
          <p style={{ fontSize: '15px', color: MUTED, lineHeight: 1.9, marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            Nexalie est née d&apos;un constat simple : les PME africaines ont accès aux mêmes outils numériques que les grandes entreprises, mais personne ne les aide à les choisir, les déployer, ni à les intégrer dans leur réalité quotidienne. <strong style={{ color: NIGHT }}>Nexalie est née pour changer ça.</strong>
          </p>
          <Link href="/about" style={{ padding: '12px 28px', border: `1.5px solid #E2E8F0`, borderRadius: '8px', color: NIGHT, fontSize: '14px', textDecoration: 'none', display: 'inline-block', fontWeight: 500 }}>
            Notre histoire →
          </Link>
        </div>
      </section>

      {/* ── INSTITUTIONS TEASER ────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: IVORY, borderTop: '1px solid #E2E8F0' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: GOLD, marginBottom: '10px', textTransform: 'uppercase' }}>Pour les institutions</p>
              <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 400, color: NIGHT, marginBottom: '14px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                Vous financez leur développement. Nexalie vous montre où votre impact est le plus fort.
              </h2>
              <p style={{ fontSize: '14px', color: MUTED, lineHeight: 1.7, marginBottom: '24px' }}>
                Les diagnostics réalisés par les PME alimentent, de façon anonymisée, un tableau de bord agrégé. Ministères, bailleurs et chambres de commerce disposent ainsi d&apos;une vision claire du tissu économique local, pour cibler leurs actions là où le besoin est réel.
              </p>
              <Link href="/institutions" style={{ padding: '12px 24px', background: BRAND, borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
                Espace institutions →
              </Link>
            </div>
            <div style={{ flexShrink: 0, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', minWidth: '200px' }}>
              {[
                { v: '90K',   l: 'PME ciblées' },
                { v: '95 %',  l: 'de l\'économie' },
                { v: '6',     l: 'dimensions auditées' },
                { v: '5 min', l: 'par diagnostic' },
              ].map((s) => (
                <div key={s.l} style={{ background: '#fff', border: '1px solid #E2E8F0', borderRadius: '8px', padding: '16px 14px', textAlign: 'center' }}>
                  <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '24px', fontWeight: 300, color: NIGHT, marginBottom: '4px' }}>{s.v}</p>
                  <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', color: MUTED, letterSpacing: '0.05em', lineHeight: 1.4 }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────── */}
      <section className="kongo-texture" style={{ padding: '80px 24px', background: BRAND }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(34px,5vw,52px)', fontWeight: 400, color: '#fff', marginBottom: '12px', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            Faites le point sur votre numérique.<br />
            <em style={{ color: GOLD, fontStyle: 'italic' }}>En 20 minutes, gratuitement.</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.55)', marginBottom: '32px', lineHeight: 1.7 }}>
            Diagnostic gratuit en 5 minutes. Feuille de route personnalisée. Outils concrets. Aucun engagement.
          </p>
          <div className="nx-cta-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" className="btn-gold" style={{ padding: '16px 40px', background: GOLD, borderRadius: '8px', color: NIGHT, fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Je fais mon audit gratuit →
            </Link>
            <Link href="/contact" style={{ padding: '16px 24px', background: 'transparent', border: '1.5px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: 'rgba(255,255,255,0.75)', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
              Nous contacter
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
