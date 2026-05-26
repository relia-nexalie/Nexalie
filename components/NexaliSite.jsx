'use client';

import { useState } from "react";
import Link from "next/link";
import { useMode } from "@/lib/mode-context";

// ═══════════════════════════════════════════
// DESIGN TOKENS — fond blanc, FR/AF
// ═══════════════════════════════════════════

const THEMES = {
  fr: {
    bg: "#FFFFFF",
    sectionAlt: "#F8F9FA",
    text: "#1C1C1C",
    muted: "#6B7A94",
    navy: "#0A1628",
    accent: "#0A1628",
    teal: "#4EC9B0",
    border: "rgba(0,0,0,0.08)",
    btnPrimary: "#0A1628",
    btnText: "#FFFFFF",
  },
  af: {
    bg: "#FFFFFF",
    sectionAlt: "#FFF8F3",
    text: "#1C1C1C",
    muted: "#6B7A94",
    navy: "#1A0800",
    accent: "#C45E0A",
    teal: "#E88C32",
    border: "rgba(0,0,0,0.08)",
    btnPrimary: "#C45E0A",
    btnText: "#FFFFFF",
  }
};

export default function NexaliSite() {
  const { mode } = useMode();
  const t = THEMES[mode];
  const isAf = mode === 'af';

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          .nx-hero-grid       { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-score-card      { min-width: unset !important; width: 100% !important; }
          .nx-platform-grid   { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-compare-grid    { grid-template-columns: 1fr !important; }
          .nx-steps-grid      { grid-template-columns: 1fr !important; }
          .nx-cta-buttons     { flex-direction: column !important; align-items: stretch !important; }
          .nx-cta-buttons a   { text-align: center !important; }
          .nx-hero-buttons    { flex-direction: column !important; align-items: stretch !important; }
          .nx-hero-buttons a  { text-align: center !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: t.navy, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <div className="nx-hero-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
          <div>
            {/* Badge unifié */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
              <span style={{ fontFamily: 'monospace', fontSize: '11px', letterSpacing: '1px', color: isAf ? '#E88C32' : '#4EC9B0' }}>
                🇫🇷 France · 🌍 Afrique · Audit gratuit
              </span>
            </div>

            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
              Votre copilote IA<br />
              de <em style={{ color: isAf ? '#E88C32' : '#4EC9B0', fontStyle: 'italic' }}>transformation digitale</em>
            </h1>

            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '520px' }}>
              En 20 minutes, Nexalie analyse votre entreprise et vous donne un plan d&apos;action concret — adapté à votre secteur, votre pays, votre réalité.{' '}
              <strong style={{ color: '#fff' }}>Gratuit. Sans consultant.</strong>
            </p>

            <div className="nx-hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/audit" style={{ padding: '15px 30px', background: isAf ? '#C45E0A' : '#4EC9B0', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: `0 8px 24px ${isAf ? 'rgba(196,94,10,0.35)' : 'rgba(78,201,176,0.35)'}` }}>
                Audit gratuit →
              </Link>
              <Link href="/pricing" style={{ padding: '15px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
                Nos tarifs
              </Link>
            </div>
            <a
              href="https://wa.me/33786620409"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginTop: '16px', fontSize: '13px', color: 'rgba(255,255,255,0.55)', textDecoration: 'none' }}
            >
              <span style={{ fontSize: '16px' }}>💬</span>
              Une question ? WhatsApp direct → <strong style={{ color: 'rgba(255,255,255,0.85)' }}>+33 7 86 62 04 09</strong>
            </a>
          </div>

          {/* Score card */}
          <div className="nx-score-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px', minWidth: '280px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>MATURITÉ DIGITALE</p>
            {[['Stratégie & Vision', 35], ['Expérience Client', 55], ['Opérations', 25], ['Technologies', 45], ['Culture & Équipes', 30]].map(([label, w]) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: isAf ? '#E88C32' : '#4EC9B0' }}>?/20</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{ width: `${w}%`, height: '100%', background: isAf ? '#C45E0A' : '#4EC9B0', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
            <Link href="/audit" style={{ display: 'block', width: '100%', marginTop: '16px', padding: '12px', background: isAf ? '#C45E0A' : '#4EC9B0', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '1px', textAlign: 'center', textDecoration: 'none' }}>
              DÉMARRER MON AUDIT GRATUIT
            </Link>
          </div>
        </div>
      </section>

      {/* ── BENCHMARK CONCURRENTS ──────────────────────────────────── */}
      <section style={{ background: t.sectionAlt, padding: '56px 24px', borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Pourquoi Nexalie</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 300, color: t.text, textAlign: 'center', marginBottom: '36px' }}>
            Ce que Bpifrance facture 7 500€, Nexalie le fait en 20 minutes — gratuitement.
          </h2>
          <div className="nx-compare-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {/* Cabinet */}
            <div style={{ padding: '28px 24px', background: '#fff', border: `1.5px solid ${t.border}`, borderRadius: '16px', opacity: 0.85 }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏦</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text, marginBottom: '6px' }}>Cabinet de conseil</h3>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#9CA3AF', fontWeight: 700, marginBottom: '12px' }}>5 000 — 15 000€</p>
              <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.7 }}>Mission de 3 mois minimum. Déconnecté de votre réalité terrain.</p>
            </div>

            {/* Nexalie — mis en avant */}
            <div style={{ padding: '28px 24px', background: t.navy, border: `2px solid ${isAf ? '#C45E0A' : '#4EC9B0'}`, borderRadius: '16px', position: 'relative', boxShadow: `0 8px 32px ${isAf ? 'rgba(196,94,10,0.2)' : 'rgba(78,201,176,0.2)'}` }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: isAf ? '#C45E0A' : '#4EC9B0', color: '#fff', fontSize: '10px', fontWeight: 700, padding: '4px 16px', borderRadius: '20px', whiteSpace: 'nowrap', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                RECOMMANDÉ
              </div>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚡</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>Nexalie</h3>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: isAf ? '#E88C32' : '#4EC9B0', fontWeight: 700, marginBottom: '12px' }}>Gratuit — 129€/mois</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.7 }}>20 minutes. Score immédiat. Plan d&apos;action IA personnalisé. Adapté France ET Afrique.</p>
            </div>

            {/* Bpifrance */}
            <div style={{ padding: '28px 24px', background: '#fff', border: `1.5px solid ${t.border}`, borderRadius: '16px', opacity: 0.85 }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🏛️</div>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.text, marginBottom: '6px' }}>Bpifrance Diag IA</h3>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '22px', color: '#9CA3AF', fontWeight: 700, marginBottom: '12px' }}>7 500€ reste à charge</p>
              <p style={{ fontSize: '13px', color: t.muted, lineHeight: 1.7 }}>8 jours d&apos;attente. Réservé aux PME +10 salariés et +1M€ CA.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${t.border}`, padding: '28px 24px', background: t.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
          {[['20', "Questions par audit"], ['8', 'Secteurs couverts'], ['0€', 'Pour commencer'], ['20 min', 'Pour un bilan complet']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '12px' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: t.accent, marginBottom: '4px' }}>{v}</p>
              <p style={{ fontSize: '12px', color: t.muted }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.sectionAlt }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' }}>Processus</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: t.text, textAlign: 'center', marginBottom: '6px' }}>
            Comment ça fonctionne
          </h2>
          <p style={{ fontSize: '16px', color: t.muted, textAlign: 'center', marginBottom: '48px' }}>Simple. Concret. Immédiat.</p>

          <div className="nx-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                num: '01',
                title: 'Tu réponds à 20 questions',
                text: 'Secteur, pays, niveau d\'équipement, processus, clients — Nexalie évalue ta maturité digitale sur 5 axes.',
                color: isAf ? '#C45E0A' : '#4EC9B0',
              },
              {
                num: '02',
                title: 'L\'IA génère ton plan d\'action',
                text: 'Score sur 100, recommandations avec outils précis (nom, coût, durée), roadmap 90 jours personnalisée.',
                color: isAf ? '#E88C32' : '#2D6A4F',
              },
              {
                num: '03',
                title: 'Tu avances, semaine après semaine',
                text: 'Chaque lundi à 8h, Nexalie t\'envoie ta prochaine action prioritaire. Ton score progresse. Tu le vois.',
                color: '#7B5EA7',
              },
            ].map(step => (
              <div key={step.num} style={{ padding: '32px 24px', background: '#fff', border: `1px solid ${t.border}`, borderRadius: '16px', borderTop: `4px solid ${step.color}` }}>
                <p style={{ fontFamily: 'monospace', fontSize: '36px', fontWeight: 700, color: step.color, marginBottom: '14px', lineHeight: 1 }}>{step.num}</p>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: t.text, marginBottom: '12px', lineHeight: 1.4 }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: t.muted, lineHeight: 1.75 }}>{step.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '36px' }}>
            <Link href="/audit" style={{ padding: '14px 32px', background: t.btnPrimary, borderRadius: '10px', color: t.btnText, fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Démarrer maintenant — c&apos;est gratuit →
            </Link>
          </div>
        </div>
      </section>

      {/* ── VIDÉO PLACEHOLDER ──────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.bg, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, marginBottom: '8px', textTransform: 'uppercase' }}>Démonstration</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,32px)', fontWeight: 300, color: t.text, marginBottom: '6px' }}>
            Nexalie en 60 secondes
          </h2>
          <p style={{ fontSize: '15px', color: t.muted, marginBottom: '32px' }}>Regardez comment ça marche</p>

          {/* Bloc vidéo 16:9 */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingTop: '56.25%', /* 16:9 */
            background: t.navy,
            borderRadius: '16px',
            border: `2px solid ${isAf ? '#C45E0A' : '#4EC9B0'}`,
            overflow: 'hidden',
            boxShadow: `0 16px 48px ${isAf ? 'rgba(196,94,10,0.15)' : 'rgba(78,201,176,0.12)'}`,
          }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: '16px',
            }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: isAf ? 'rgba(196,94,10,0.25)' : 'rgba(78,201,176,0.2)',
                border: `2px solid ${isAf ? '#C45E0A' : '#4EC9B0'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '28px',
              }}>
                ▶
              </div>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', letterSpacing: '1px' }}>
                Vidéo disponible prochainement
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── PLATEFORME ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.sectionAlt }}>
        <div className="nx-platform-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, marginBottom: '10px', textTransform: 'uppercase' }}>Plateforme SaaS</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 300, color: t.text, marginBottom: '16px', lineHeight: 1.3 }}>
              Les outils qui remplacent votre <em style={{ color: t.accent }}>chef de projet digital</em>
            </h2>
            <p style={{ fontSize: '15px', color: t.muted, lineHeight: 1.8, marginBottom: '20px' }}>
              Business plan, roadmap, veille concurrentielle, cahier des charges — générez en 2 minutes ce qui prend des jours.
            </p>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <span style={{ padding: '4px 12px', background: `${t.teal}15`, color: t.teal === '#4EC9B0' ? '#1D6B60' : '#A85520', border: `1px solid ${t.teal}30`, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>Gratuit</span>
              <span style={{ padding: '4px 12px', background: `${t.accent}10`, color: t.accent, border: `1px solid ${t.accent}25`, borderRadius: '20px', fontSize: '12px', fontWeight: 600 }}>129€/mois Premium</span>
            </div>
            <Link href="/platform" style={{ padding: '12px 24px', background: t.btnPrimary, borderRadius: '10px', color: t.btnText, fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Découvrir la plateforme →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {[['📊','Audit Digital','Gratuit'],['💰','Calculateur ROI','Gratuit'],['📋','Business Plan IA','Premium'],['🗺️','Roadmap 12 mois','Premium'],['🔍','Veille Concurrentielle','Premium'],['📄','Cahier des Charges','Premium']].map(([e,n,p]) => (
              <div key={n} style={{ padding: '16px', background: t.sectionAlt, border: `1px solid ${t.border}`, borderRadius: '12px' }}>
                <span style={{ fontSize: '20px', display: 'block', marginBottom: '6px' }}>{e}</span>
                <p style={{ fontSize: '12px', fontWeight: 600, color: t.text, marginBottom: '3px' }}>{n}</p>
                <p style={{ fontSize: '10px', color: p === 'Gratuit' ? '#2D6A4F' : t.accent, fontFamily: 'monospace', fontWeight: 600 }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS TEASER ────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.navy }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px', textTransform: 'uppercase' }}>La fondatrice</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 300, color: '#fff', marginBottom: '20px', lineHeight: 1.4 }}>
            Un pont entre <em style={{ color: isAf ? '#E88C32' : '#4EC9B0' }}>deux mondes</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: '28px', maxWidth: '600px', margin: '0 auto 28px' }}>
            <strong style={{ color: '#fff' }}>Rélia Ebiya.</strong> Franco-congolaise. 10 ans chez Safran et Alcatel Optronics. Elle a piloté la transformation digitale pour 17 000 collaborateurs. Elle a construit Nexalie pour que les PME africaines et françaises aient accès au même niveau d&apos;expertise — sans payer 50 000€ de consulting.
          </p>
          <Link href="/about" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            Découvrir Rélia →
          </Link>
        </div>
      </section>

      {/* ── BETA TESTEURS ──────────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: t.bg, borderBottom: `1px solid ${t.border}` }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontSize: '40px', marginBottom: '16px' }}>🧪</div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3vw,30px)', fontWeight: 300, color: t.text, marginBottom: '14px', lineHeight: 1.4 }}>
            Les premiers retours de nos beta testeurs arrivent.
          </h2>
          <p style={{ fontSize: '15px', color: t.muted, lineHeight: 1.8, marginBottom: '28px', maxWidth: '500px', margin: '0 auto 28px' }}>
            Rejoignez le programme beta et soyez parmi les premiers à tester Nexalie — avant tout le monde.
          </p>
          <Link
            href="/beta"
            style={{ padding: '14px 36px', background: isAf ? '#C45E0A' : '#0A1628', borderRadius: '10px', color: '#fff', fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}
          >
            Rejoindre le programme beta →
          </Link>
        </div>
      </section>

      {/* ── CTA FINAL ──────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: t.sectionAlt }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <span style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}>🚀</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 300, color: t.text, marginBottom: '12px', lineHeight: 1.3 }}>
            Votre transformation digitale <em style={{ color: t.accent }}>commence aujourd&apos;hui</em>
          </h2>
          <p style={{ fontSize: '15px', color: t.muted, marginBottom: '32px', lineHeight: 1.7 }}>
            Audit gratuit en 20 minutes. Plan d&apos;action personnalisé. Aucun engagement.
          </p>
          <div className="nx-cta-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" style={{ padding: '16px 40px', background: t.btnPrimary, borderRadius: '12px', color: t.btnText, fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Je fais mon audit gratuit →
            </Link>
            <Link href="/contact" style={{ padding: '16px 24px', background: 'transparent', border: `2px solid ${t.border}`, borderRadius: '12px', color: t.muted, fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
              Nous contacter
            </Link>
          </div>
          <p style={{ fontSize: '12px', color: t.muted, marginTop: '16px' }}>
            📱 WhatsApp : +33 7 86 62 04 09
          </p>
        </div>
      </section>

    </div>
  );
}
