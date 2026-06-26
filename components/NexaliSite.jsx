'use client';

import { useEffect } from "react";
import Link from "next/link";
import { BarChart2, DollarSign, ClipboardList, Map, Search, FileText } from "lucide-react";
import MotifBackground from "@/components/MotifBackground";

// ═══════════════════════════════════════════════
// TOKENS — branchés sur globals.css (--nx-*)
// ═══════════════════════════════════════════════
const BG      = 'var(--nx-bg)';           // vert forêt profond
const BG2     = 'var(--nx-bg2)';          // vert intermédiaire
const ACCENT  = 'var(--nx-accent)';       // or identité
const ACTION  = 'var(--nx-accent-action)';// or ambre CTAs
const TEXT    = 'var(--nx-text)';         // crème
const MUTED   = 'var(--nx-text-muted)';   // crème atténué
const CREAM   = 'var(--nx-section-bg)';   // fond crème sections claires
const DARK    = 'var(--nx-section-text)'; // vert profond sur fond crème
const BORDER  = 'var(--nx-border)';       // bordure or subtile

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function NexaliSite() {
  useReveal();
  return (
    <div style={{ background: CREAM, color: DARK, fontFamily: 'var(--font-jakarta, -apple-system, sans-serif)' }}>
      <style suppressHydrationWarning>{`
        @media (max-width: 768px) {
          .nx-hero-grid     { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-score-card    { min-width: unset !important; width: 100% !important; }
          .nx-platform-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .nx-steps-grid    { grid-template-columns: 1fr !important; }
          .nx-cta-buttons   { flex-direction: column !important; align-items: stretch !important; }
          .nx-cta-buttons a { text-align: center !important; }
          .nx-hero-buttons  { flex-direction: column !important; align-items: stretch !important; }
          .nx-hero-buttons a{ text-align: center !important; }
          .nx-context-grid  { grid-template-columns: 1fr 1fr !important; }
          .nx-tools-grid    { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 480px) {
          .nx-context-grid  { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', background: BG, padding: 'clamp(64px,8vw,100px) 24px' }}>
        <MotifBackground name="diantu" opacity={0.20} />
        <div className="nx-hero-grid" style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr auto', gap: '60px', alignItems: 'center' }}>
          <div>
            {/* Tag */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(201,162,75,.12)', border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '5px 14px', marginBottom: '28px' }}>
              <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', letterSpacing: '1px', color: ACCENT }}>
                La boussole numérique des entrepreneurs africains
              </span>
            </div>

            <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(32px,5vw,54px)', fontWeight: 300, color: TEXT, lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-0.02em' }}>
              Vous savez où vous voulez aller.<br />
              <em style={{ color: ACCENT, fontStyle: 'italic' }}>On vous montre par où commencer.</em>
            </h1>

            <p style={{ fontSize: '17px', color: 'rgba(245,240,232,.7)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '520px' }}>
              En 15 minutes, depuis votre téléphone, Nexalie regarde où en est votre entreprise et vous donne un plan clair. Pas de grands mots. Juste les bonnes priorités, dans le bon ordre.
            </p>

            <div className="nx-hero-buttons" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
              <Link href="/audit" style={{ padding: '15px 30px', background: ACTION, borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(212,144,12,.35)' }}>
                Je fais mon diagnostic gratuit
              </Link>
              <Link href="/audit" style={{ padding: '15px 28px', background: 'rgba(245,240,232,.08)', border: '1px solid rgba(245,240,232,.2)', borderRadius: '8px', color: TEXT, fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
                Voir un exemple de rapport →
              </Link>
            </div>

            <p style={{ fontSize: '13px', color: 'rgba(245,240,232,.45)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.05em' }}>
              Gratuit pendant la bêta · accompagnement humain inclus
            </p>
          </div>

          {/* Score card — mis en valeur */}
          <div className="nx-score-card" style={{ background: BG2, border: `1px solid ${BORDER}`, borderRadius: '20px', padding: '32px 28px', minWidth: '300px', boxShadow: '0 24px 64px rgba(0,0,0,.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '2px', color: 'rgba(245,240,232,.4)', textTransform: 'uppercase' }}>Exemple de rapport</p>
              <span style={{ fontSize: '10px', background: 'rgba(201,162,75,.15)', color: ACCENT, padding: '3px 8px', borderRadius: '12px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>En direct</span>
            </div>

            {/* Score central */}
            <div style={{ textAlign: 'center', padding: '20px 0 16px' }}>
              <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '72px', fontWeight: 300, color: TEXT, lineHeight: 1, letterSpacing: '-3px', marginBottom: '4px' }}>
                64<span style={{ fontSize: '28px', color: MUTED, fontWeight: 300 }}>/100</span>
              </p>
              <p style={{ fontSize: '13px', color: ACCENT, fontWeight: 600 }}>Bien lancée · 3 priorités identifiées</p>
            </div>

            {[
              ['Présence en ligne',   82],
              ['Paiement & vente',    70],
              ['Gestion interne',     38],
              ['Relation client',     55],
            ].map(([label, w]) => (
              <div key={label} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontSize: '12px', color: 'rgba(245,240,232,.6)' }}>{label}</span>
                  <span style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', color: ACCENT, fontWeight: 600 }}>{w}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(245,240,232,.08)', borderRadius: '2px' }}>
                  <div style={{ width: `${w}%`, height: '100%', background: `linear-gradient(90deg, ${ACCENT}, #d4900c)`, borderRadius: '2px' }} />
                </div>
              </div>
            ))}

            <Link href="/audit" style={{ display: 'block', width: '100%', marginTop: '20px', padding: '13px', background: ACTION, border: 'none', borderRadius: '10px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.5px', textAlign: 'center', textDecoration: 'none' }}>
              VOIR MON VRAI SCORE →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CHIFFRES CLÉS ─────────────────────────────────────────── */}
      <section style={{ background: CREAM, padding: '56px 24px', borderBottom: `1px solid var(--nx-border-light)` }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Contexte</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 400, color: DARK, textAlign: 'center', marginBottom: '40px', letterSpacing: '-0.01em' }}>
            Les PME africaines portent 95 % de l&apos;économie réelle, mais manquent d&apos;outils pensés pour elles
          </h2>
          <div className="nx-context-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
            {[
              { value: '90 000',  label: 'PME formelles au Congo',                 note: 'Ministère des PME, 2023' },
              { value: '93,4 %',  label: 'opèrent dans le secteur informel',       note: '~840 000 unités non structurées' },
              { value: '95 %',    label: 'de l\'économie portée par les PME',       note: 'Emploi, valeur ajoutée locale' },
              { value: '< 12 %',  label: 'disposent d\'outils numériques actifs',  note: 'Estimation Nexalie, 2024' },
            ].map((s, i) => (
              <div key={i} className="card-hover reveal" style={{ padding: '24px 20px', background: '#fff', border: `1px solid var(--nx-border-light)`, borderRadius: '8px', transitionDelay: `${i * 80}ms` }}>
                <p style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '32px', fontWeight: 300, color: DARK, marginBottom: '6px' }}>{s.value}</p>
                <p style={{ fontSize: '13px', fontWeight: 600, color: DARK, marginBottom: '6px', lineHeight: 1.4 }}>{s.label}</p>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '9px', color: '#94A3B8', lineHeight: 1.5 }}>{s.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TICKER ────────────────────────────────────────────────── */}
      <section style={{ borderBottom: `1px solid var(--nx-border-light)`, padding: '18px 24px', background: '#fff' }}>
        <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '0.15em', color: 'rgba(15,46,36,.4)', margin: 0 }}>
          20 questions · 6 dimensions · résultats immédiats · 100 % gratuit pendant la bêta
        </p>
      </section>

      {/* ── COMMENT ÇA MARCHE ──────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: BG, overflow: 'hidden' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: 'rgba(201,162,75,.7)', textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' }}>Processus</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,5vw,46px)', fontWeight: 400, color: TEXT, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Trois étapes, un cap clair.
          </h2>
          <p style={{ fontSize: '16px', color: 'rgba(245,240,232,.55)', textAlign: 'center', marginBottom: '48px', maxWidth: '480px', margin: '0 auto 48px' }}>
            Pas de consultant. Pas de grand cabinet. Juste un outil pensé pour votre réalité terrain.
          </p>

          <div className="nx-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              {
                num: '01',
                title: 'Vous répondez',
                text: 'Vingt questions simples sur votre activité, vos outils, vos habitudes. Quinze minutes, sur votre téléphone, même avec une connexion lente.',
              },
              {
                num: '02',
                title: 'On regarde ensemble',
                text: 'Nexalie évalue ce qui compte vraiment pour une entreprise comme la vôtre, pas pour une multinationale. Score, forces, points à travailler.',
              },
              {
                num: '03',
                title: 'Vous avancez',
                text: 'Votre note, vos 3 priorités, et un plan daté. Une action par semaine. Vous savez exactement quoi faire lundi matin. Et on reste joignables si vous avez une question.',
              },
            ].map(step => (
              <div key={step.num} style={{ position: 'relative', padding: '32px 24px', background: 'rgba(245,240,232,.05)', border: `1px solid ${BORDER}`, borderRadius: '8px', overflow: 'hidden' }}>
                <span style={{ position: 'absolute', top: '-10px', right: '12px', fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '120px', fontWeight: 300, color: 'rgba(245,240,232,.04)', lineHeight: 1, pointerEvents: 'none', userSelect: 'none' }}>{step.num}</span>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '11px', fontWeight: 700, color: ACCENT, marginBottom: '14px', letterSpacing: '0.1em' }}>{step.num}</p>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: TEXT, marginBottom: '12px', lineHeight: 1.4, position: 'relative' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: 'rgba(245,240,232,.6)', lineHeight: 1.75, position: 'relative' }}>{step.text}</p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link href="/audit" style={{ padding: '14px 32px', background: ACTION, borderRadius: '8px', color: '#fff', fontSize: '15px', fontWeight: 700, textDecoration: 'none', display: 'inline-block' }}>
              Je fais mon diagnostic gratuit
            </Link>
          </div>
        </div>
      </section>

      {/* ── ON NE VOUS LAISSE PAS SEUL ────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: CREAM, borderTop: `1px solid var(--nx-border-light)` }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, textAlign: 'center', marginBottom: '10px', textTransform: 'uppercase' }}>Suivi humain</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 400, color: DARK, textAlign: 'center', marginBottom: '12px', letterSpacing: '-0.01em' }}>
            On ne vous laisse pas seul avec votre score.
          </h2>
          <p style={{ fontSize: '16px', color: '#4B5563', textAlign: 'center', marginBottom: '48px', maxWidth: '560px', margin: '0 auto 48px', lineHeight: 1.75 }}>
            Après votre diagnostic, vous recevez votre rapport sur WhatsApp. Une action par semaine, une relance bienveillante, et une vraie personne joignable si vous avez une question.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: '📱', titre: 'Rapport sur WhatsApp', corps: 'Votre plan d\'action arrive directement sur votre téléphone, lisible même hors connexion.' },
              { icon: '📅', titre: 'Une action par semaine', corps: 'Chaque lundi, une priorité claire. Pas de liste interminable : juste la prochaine étape.' },
              { icon: '💬', titre: 'Une vraie personne derrière', corps: 'Relia et son équipe répondent sous 24h. En français. Pas un bot, pas une FAQ.' },
            ].map(({ icon, titre, corps }) => (
              <div key={titre} className="card-hover reveal" style={{ padding: '28px', background: '#fff', border: `1px solid var(--nx-border-light)`, borderLeft: `3px solid ${ACCENT}`, borderRadius: '8px' }}>
                <p style={{ fontSize: '28px', marginBottom: '14px' }}>{icon}</p>
                <p style={{ fontSize: '15px', fontWeight: 700, color: DARK, marginBottom: '8px' }}>{titre}</p>
                <p style={{ fontSize: '13px', color: '#4B5563', lineHeight: 1.75 }}>{corps}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PLATEFORME ─────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: BG }}>
        <div className="nx-platform-grid" style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div>
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, marginBottom: '10px', textTransform: 'uppercase' }}>Plateforme</p>
            <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(28px,4vw,42px)', fontWeight: 400, color: TEXT, marginBottom: '16px', lineHeight: 1.2, letterSpacing: '-0.01em' }}>
              Des outils conçus pour votre réalité, pas pour celle d&apos;une multinationale.
            </h2>
            <p style={{ fontSize: '15px', color: 'rgba(245,240,232,.6)', lineHeight: 1.8, marginBottom: '28px' }}>
              Score de maturité, feuille de route, calculateur ROI : chaque outil est pensé pour fonctionner sur mobile, avec une connexion lente, dans le contexte africain.
            </p>
            <Link href="/platform" style={{ padding: '12px 24px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Découvrir la plateforme →
            </Link>
          </div>
          <div className="nx-tools-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {[
              { Icon: BarChart2,     name: 'Diagnostic digital',      wide: true  },
              { Icon: DollarSign,    name: 'Calculateur ROI',         wide: false },
              { Icon: ClipboardList, name: 'Plan d\'action IA',       wide: false },
              { Icon: Map,           name: 'Roadmap 12 mois',         wide: false },
              { Icon: Search,        name: 'Veille concurrentielle',  wide: false },
              { Icon: FileText,      name: 'Cahier des charges',      wide: false },
            ].map(({ Icon, name, wide }) => (
              <div key={name} className="card-hover" style={{ gridColumn: wide ? '1 / -1' : undefined, padding: '20px', background: BG2, border: `1px solid ${BORDER}`, borderLeft: `3px solid ${ACCENT}`, borderRadius: '8px' }}>
                <Icon size={18} color={ACCENT} style={{ marginBottom: '10px' }} />
                <p style={{ fontSize: '13px', fontWeight: 700, color: TEXT, marginBottom: '4px' }}>{name}</p>
                <p style={{ fontSize: '11px', color: ACCENT, fontFamily: 'var(--font-mono, monospace)', fontWeight: 600, letterSpacing: '0.05em' }}>Gratuit en bêta</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAS D'USAGE ────────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: CREAM, borderTop: `1px solid var(--nx-border-light)` }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Terrain</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(26px,3.5vw,38px)', fontWeight: 400, color: DARK, textAlign: 'center', marginBottom: '8px', letterSpacing: '-0.01em' }}>
            Ce que ça change, concrètement.
          </h2>
          <p style={{ textAlign: 'center', fontSize: '12px', color: '#94A3B8', fontFamily: 'var(--font-mono, monospace)', marginBottom: '40px', letterSpacing: '0.05em' }}>
            Cas d&apos;usage illustratifs
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
            {[
              { sector: 'Commerce', text: 'Un grossiste à Abidjan suit ses ventes sur mobile malgré les coupures courant. Son stock est toujours à jour, même sans connexion.' },
              { sector: 'Services',  text: 'Une agence à Brazzaville passe de WhatsApp à un outil simple : elle perd deux fois moins de clients, sans aucun budget tech.' },
              { sector: 'BTP',       text: 'Un entrepreneur camerounais gère ses chantiers à distance depuis son téléphone. Sa coordination a changé du tout au tout.' },
            ].map((c) => (
              <div key={c.sector} className="card-hover reveal" style={{ padding: '32px 28px', background: '#fff', border: `1px solid var(--nx-border-light)`, borderLeft: `3px solid ${ACCENT}`, borderRadius: '8px' }}>
                <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: ACCENT, marginBottom: '16px' }}>{c.sector}</p>
                <p style={{ fontSize: '15px', color: DARK, lineHeight: 1.75 }}>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── À PROPOS TEASER ─────────────────────────────────────────── */}
      <section style={{ padding: '72px 24px', background: CREAM, borderTop: `1px solid var(--nx-border-light)` }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, marginBottom: '12px', textTransform: 'uppercase' }}>Notre raison d&apos;être</p>
          <blockquote style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(18px,2.5vw,26px)', fontWeight: 300, color: DARK, lineHeight: 1.6, borderLeft: `3px solid ${ACCENT}`, paddingLeft: '24px', textAlign: 'left', marginBottom: '28px', fontStyle: 'italic' }}>
            &ldquo;Je suis née à Brazzaville, j&apos;ai grandi en France. Entre ces deux mondes, j&apos;ai vu une évidence : les PME africaines ont le talent et l&apos;énergie, mais pas les outils pensés pour leur réalité. Nexalie existe pour ça.&rdquo;
          </blockquote>
          <p style={{ fontSize: '14px', color: '#4B5563', marginBottom: '24px', lineHeight: 1.8 }}>
            J&apos;ai piloté la transformation numérique de grands groupes industriels. Je sais ce que ces outils coûtent, et je sais qu&apos;une PME de Brazzaville n&apos;en a pas besoin de la moitié. Nexalie, c&apos;est ce que j&apos;aurais voulu donner à mon oncle commerçant.
          </p>
          <Link href="/about" style={{ padding: '12px 28px', border: `1.5px solid var(--nx-border-light)`, borderRadius: '8px', color: DARK, fontSize: '14px', textDecoration: 'none', display: 'inline-block', fontWeight: 500 }}>
            Notre histoire →
          </Link>
        </div>
      </section>

      {/* ── INSTITUTIONS TEASER ─────────────────────────────────────── */}
      <section style={{ padding: '64px 24px', background: BG, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ maxWidth: '860px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '12px', letterSpacing: '2.5px', color: ACCENT, marginBottom: '12px', textTransform: 'uppercase', textAlign: 'center' }}>Pour les institutions</p>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(24px,3.5vw,36px)', fontWeight: 400, color: TEXT, marginBottom: '16px', lineHeight: 1.25, letterSpacing: '-0.01em', textAlign: 'center' }}>
            Vous financez leur développement. Nexalie vous montre où votre impact est le plus fort.
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(245,240,232,.6)', lineHeight: 1.8, marginBottom: '32px', maxWidth: '640px', margin: '0 auto 32px', textAlign: 'center' }}>
            Derrière chaque diagnostic, il y a un dirigeant qui veut avancer. Mis bout à bout, anonymisés, ces diagnostics vous donnent une carte vivante du tissu économique local : où sont les blocages, où votre franc investi change vraiment quelque chose.
          </p>
          <div style={{ textAlign: 'center' }}>
            <Link href="/institutions" style={{ padding: '12px 28px', background: BG2, border: `1px solid ${BORDER}`, borderRadius: '8px', color: TEXT, fontSize: '14px', fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
              Espace institutions →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Séparateur KINSHASA ─────────────────────────────────────── */}
      <div aria-hidden="true" style={{ position: 'relative', height: 24, overflow: 'hidden', background: BG }}>
        <MotifBackground name="kinshasa" size="48px 24px" opacity={0.25} />
      </div>

      {/* ── CTA FINAL ───────────────────────────────────────────────── */}
      <section style={{ padding: '80px 24px', background: BG }}>
        <div style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(30px,5vw,48px)', fontWeight: 400, color: TEXT, marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.01em' }}>
            Prenez 15 minutes pour savoir<br />
            <em style={{ color: ACCENT, fontStyle: 'italic' }}>où en est vraiment votre entreprise.</em>
          </h2>
          <p style={{ fontSize: '15px', color: 'rgba(245,240,232,.55)', marginBottom: '36px', lineHeight: 1.7 }}>
            Diagnostic gratuit · Plan d&apos;action concret · Suivi humain inclus · Aucun engagement
          </p>
          <div className="nx-cta-buttons" style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/audit" style={{ padding: '16px 40px', background: ACTION, borderRadius: '8px', color: '#fff', fontSize: '16px', fontWeight: 700, textDecoration: 'none', display: 'inline-block', boxShadow: '0 8px 24px rgba(212,144,12,.35)' }}>
              Je fais mon diagnostic gratuit
            </Link>
            <Link href="/contact" style={{ padding: '16px 24px', background: 'transparent', border: `1.5px solid ${BORDER}`, borderRadius: '8px', color: 'rgba(245,240,232,.75)', fontSize: '15px', textDecoration: 'none', display: 'inline-block' }}>
              Nous contacter
            </Link>
          </div>
          <p style={{ marginTop: '20px', fontSize: '12px', color: 'rgba(245,240,232,.3)', fontFamily: 'var(--font-mono, monospace)' }}>
            Gratuit pendant la bêta · places limitées
          </p>
        </div>
      </section>

    </div>
  );
}
