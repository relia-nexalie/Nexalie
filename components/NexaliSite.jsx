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
    btnSecondary: "transparent",
    tag: "🇫🇷 France",
    hero: "PME françaises & entreprises africaines",
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
    btnSecondary: "transparent",
    tag: "🌍 Afrique",
    hero: "Congo · Cameroun · Côte d'Ivoire",
  }
};

const PRICES = {
  fr: { vitrine: "1 200 — 1 800€", onepage: "400 — 600€", ecommerce: "2 500 — 4 000€" },
  af: { vitrine: "600 — 1 000€", onepage: "200 — 350€", ecommerce: "1 200 — 2 000€" }
};

export default function NexaliSite() {
  const { mode } = useMode();
  const t = THEMES[mode];

  const OFFERS = [
    { emoji: "🌱", name: "Pack Démarrage", price: mode === "af" ? "250 000 FCFA" : "400€", period: "/mois", score: "0–19", color: t.teal },
    { emoji: "🌿", name: "Pack Transformation", price: mode === "af" ? "400 000 FCFA" : "600€", period: "/mois", score: "20–39", color: "#2D6A4F" },
    { emoji: "🌳", name: "Pack Automatisation IA", price: mode === "af" ? "550 000 FCFA" : "800€", period: "/mois", score: "40–59", color: t.accent, badge: "POPULAIRE" },
    { emoji: "🚀", name: "Pack Excellence", price: mode === "af" ? "800 000 FCFA" : "1 200€", period: "/mois", score: "60–79", color: "#7B5EA7" },
  ];

  return (
    <div style={{ background: t.bg, color: t.text, fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ background: t.navy, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '5px 14px', marginBottom: '24px' }}>
              <span style={{ fontSize: '12px' }}>{mode === 'af' ? '🌍' : '✨'}</span>
              <span style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '1.5px', color: mode === 'af' ? '#E88C32' : '#4EC9B0' }}>{t.hero}</span>
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(32px,5vw,58px)', fontWeight: 300, color: '#fff', lineHeight: 1.15, marginBottom: '20px' }}>
              Votre entreprise mérite<br />
              <em style={{ color: mode === 'af' ? '#E88C32' : '#4EC9B0', fontStyle: 'italic' }}>l&apos;excellence</em> digitale
            </h1>
            <p style={{ fontSize: '17px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '500px' }}>
              Audit gratuit en 20 minutes, accompagnement mensuel, outils IA — tout pour transformer votre business.
            </p>
            {mode === 'af' && (
              <div style={{ display: 'flex', gap: '6px', marginBottom: '24px', flexWrap: 'wrap' }}>
                {['🇫🇷 Français', '🇨🇬 Lingala', 'Kitouba', '🇬🇧 English'].map(l => (
                  <span key={l} style={{ padding: '4px 10px', background: 'rgba(232,140,50,0.15)', border: '1px solid rgba(232,140,50,0.3)', borderRadius: '20px', fontSize: '11px', color: '#E88C32' }}>{l}</span>
                ))}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link href="/audit" style={{ padding: '15px 30px', background: mode === 'af' ? '#C45E0A' : '#4EC9B0', borderRadius: '10px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: `0 8px 24px ${mode === 'af' ? 'rgba(196,94,10,0.35)' : 'rgba(78,201,176,0.35)'}` }}>
                Audit gratuit →
              </Link>
              <Link href="/pricing" style={{ padding: '15px 28px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
                Nos tarifs
              </Link>
            </div>
          </div>

          {/* Score card */}
          <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '28px', minWidth: '280px' }}>
            <p style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px' }}>MATURITÉ DIGITALE</p>
            {[['Stratégie & Vision', 35], ['Expérience Client', 55], ['Opérations', 25], ['Technologies', 45], ['Culture & Équipes', 30]].map(([label, w]) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)' }}>{label}</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '10px', color: mode === 'af' ? '#E88C32' : '#4EC9B0' }}>?/20</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{ width: `${w}%`, height: '100%', background: mode === 'af' ? '#C45E0A' : '#4EC9B0', borderRadius: '2px' }} />
                </div>
              </div>
            ))}
            <Link href="/audit" style={{ display: 'block', width: '100%', marginTop: '16px', padding: '12px', background: mode === 'af' ? '#C45E0A' : '#4EC9B0', border: 'none', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', fontFamily: 'monospace', letterSpacing: '1px', textAlign: 'center', textDecoration: 'none' }}>
              DÉMARRER MON AUDIT GRATUIT
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid ${t.border}`, padding: '28px 24px', background: t.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '16px' }}>
          {[['5', "Offres d'accompagnement"], ['🌍', 'Congo · Cameroun · France'], ['20 min', 'Audit gratuit'], ['48h', 'Rapport personnalisé']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center', padding: '12px' }}>
              <p style={{ fontFamily: 'Georgia, serif', fontSize: '26px', color: t.accent, marginBottom: '4px' }}>{v}</p>
              <p style={{ fontSize: '12px', color: t.muted }}>{l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── OFFRES ─────────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.sectionAlt }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, marginBottom: '10px' }}>ACCOMPAGNEMENT CONSULTING</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,38px)', fontWeight: 300, color: t.text, marginBottom: '8px' }}>
            Un accompagnement pour <em style={{ color: t.accent }}>chaque niveau</em>
          </h2>
          <p style={{ fontSize: '16px', color: t.muted, marginBottom: '40px', maxWidth: '480px', lineHeight: 1.7 }}>
            Choisissez selon votre score d&apos;audit. Commencez par l&apos;audit gratuit.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '28px' }}>
            {OFFERS.map(o => (
              <div key={o.name} style={{ padding: '24px', background: '#fff', border: `2px solid ${o.color}20`, borderRadius: '16px', position: 'relative', borderTop: `3px solid ${o.color}` }}>
                {o.badge && <div style={{ position: 'absolute', top: '-10px', right: '16px', background: o.color, padding: '2px 12px', borderRadius: '15px', fontSize: '9px', fontWeight: 700, color: '#fff', fontFamily: 'monospace' }}>{o.badge}</div>}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <span style={{ fontSize: '22px', marginRight: '8px' }}>{o.emoji}</span>
                    <span style={{ fontFamily: 'Georgia, serif', fontSize: '18px', color: t.text }}>{o.name}</span>
                    <p style={{ fontFamily: 'monospace', fontSize: '10px', color: o.color, marginTop: '3px' }}>Score {o.score}/100</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontFamily: 'Georgia, serif', fontSize: '20px', color: o.color }}>{o.price}</p>
                    <p style={{ fontSize: '11px', color: t.muted }}>{o.period}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center' }}>
            <Link href="/pricing" style={{ padding: '13px 28px', background: t.btnPrimary, borderRadius: '10px', color: t.btnText, fontSize: '14px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Voir tous les tarifs →
            </Link>
          </div>
        </div>
      </section>

      {/* ── PLATEFORME ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: t.bg }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: t.muted, marginBottom: '10px' }}>PLATEFORME SaaS</p>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 300, color: t.text, marginBottom: '16px' }}>
              8 outils IA pour <em style={{ color: t.accent }}>transformer votre business</em>
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
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: 'rgba(255,255,255,0.4)', marginBottom: '12px' }}>LA FONDATRICE</p>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,3vw,36px)', fontWeight: 300, color: '#fff', marginBottom: '16px', lineHeight: 1.4 }}>
            Un pont entre <em style={{ color: mode === 'af' ? '#E88C32' : '#4EC9B0' }}>deux mondes</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: '28px' }}>
            Rélia Ebiya — née à Brazzaville, formée en France. 10+ ans d&apos;expérience en transformation digitale. Elle parle votre langue, au sens propre comme au sens figuré.
          </p>
          <Link href="/about" style={{ padding: '12px 28px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '14px', textDecoration: 'none', display: 'inline-block' }}>
            Découvrir Rélia →
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
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
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
