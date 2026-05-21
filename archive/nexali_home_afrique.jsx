import { useState, useEffect } from "react";

const T = {
  bg: "radial-gradient(ellipse at 20% 15%, #2A1200 0%, #1A0800 60%, #0D0400 100%)",
  nav: "rgba(26,8,0,0.96)",
  card: "rgba(232,140,50,0.05)",
  border: "rgba(232,140,50,0.18)",
  accent: "#E88C32",
  gold: "#F5C842",
  coral: "#C4614A",
  sage: "#6B8F3A",
  text: "#FFF5E8",
  muted: "rgba(255,245,232,0.45)",
  tag: "rgba(232,140,50,0.12)",
  tagText: "#E88C32",
  btn: "#E88C32",
  btnText: "#1A0800",
  divider: "rgba(232,140,50,0.15)",
};

const OFFERS = [
  { emoji: "🌱", name: "Pack Démarrage", price: "400€/mois", level: "Score 0–19", color: "#E88C32" },
  { emoji: "🌿", name: "Pack Transformation", price: "600€/mois", level: "Score 20–39", color: "#F5C842" },
  { emoji: "🌳", name: "Pack Automatisation IA", price: "800€/mois", level: "Score 40–59", color: "#C4614A", badge: "POPULAIRE" },
  { emoji: "🚀", name: "Pack Excellence", price: "1200€/mois", level: "Score 60–79", color: "#6B8F3A" },
];

const SERVICES = [
  { emoji: "🌐", name: "Site Vitrine", price: "600 — 1 000€", color: "#E88C32" },
  { emoji: "📄", name: "One-Page", price: "200 — 350€", color: "#F5C842" },
  { emoji: "🛒", name: "E-Commerce", price: "1 200 — 2 000€", color: "#C4614A" },
  { emoji: "🎨", name: "Identité Visuelle", price: "300 — 600€", color: "#6B8F3A" },
];

function Nav({ activePage, setPage }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: scrolled ? T.nav : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${T.border}` : "none", padding: "0 24px", transition: "all 0.3s" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "60px" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 300, color: T.text }}>Nexalie</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: T.gold }}>CONSULTING</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {[["home","Accueil"],["offers","Offres"],["audit","Audit"],["about","À propos"],["services","Services Web"]].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ background: "none", border: "none", cursor: "pointer", padding: "8px 12px", fontSize: "13px", color: activePage === id ? T.text : T.muted, fontFamily: "'DM Sans', sans-serif", borderBottom: `2px solid ${activePage === id ? T.accent : "transparent"}`, transition: "all 0.2s" }}>
              {label}
            </button>
          ))}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden", marginLeft: "8px" }}>
            <button style={{ padding: "7px 14px", background: "transparent", border: "none", color: T.muted, fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🇫🇷 France</button>
            <button style={{ padding: "7px 14px", background: T.accent, border: "none", color: T.btnText, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>🌍 Afrique</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function HomePage({ setPage }) {
  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: "88vh", display: "flex", alignItems: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
        {/* Decorative pattern */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${T.accent}08 0%, transparent 70%)` }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${T.gold}06 0%, transparent 70%)` }} />
          {/* Kente-inspired geometric pattern */}
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{ position: "absolute", right: `${60 + i * 40}px`, top: "20%", width: "2px", height: "60%", background: `linear-gradient(${T.accent}00, ${T.accent}15, ${T.accent}00)` }} />
          ))}
        </div>

        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", width: "100%", position: "relative" }}>
          <div>
            {/* Tag */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: T.tag, border: `1px solid ${T.accent}30`, borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "14px" }}>🌍</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1.5px", color: T.accent }}>CONGO · CAMEROUN · CÔTE D'IVOIRE · AFRIQUE</span>
            </div>

            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 5vw, 54px)", fontWeight: 200, color: T.text, lineHeight: 1.2, marginBottom: "20px" }}>
              Votre entreprise mérite<br />
              <em style={{ color: T.accent }}>l'excellence</em> digitale
            </h1>

            <p style={{ fontSize: "16px", color: T.muted, lineHeight: 1.8, marginBottom: "16px", maxWidth: "460px", fontFamily: "'DM Sans', sans-serif" }}>
              L'expertise digitale des standards européens, adaptée à la réalité africaine. Sites web, transformation digitale, formation IA — 100% à distance.
            </p>

            {/* Languages */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "28px", flexWrap: "wrap" }}>
              {["🇫🇷 Français", "🇨🇬 Lingala", "Kitouba", "🇬🇧 English"].map(l => (
                <span key={l} style={{ padding: "4px 10px", background: `${T.gold}15`, border: `1px solid ${T.gold}25`, borderRadius: "20px", fontSize: "11px", color: T.gold, fontFamily: "'DM Sans', sans-serif" }}>{l}</span>
              ))}
            </div>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setPage("audit")}
                style={{ padding: "15px 30px", background: T.accent, border: "none", borderRadius: "10px", color: T.btnText, fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", boxShadow: `0 8px 24px ${T.accent}40` }}>
                Audit gratuit →
              </button>
              <button onClick={() => setPage("offers")}
                style={{ padding: "15px 28px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", color: T.text, fontSize: "15px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: 0.8 }}>
                Nos offres
              </button>
            </div>
          </div>

          {/* Right — Score card Afrique style */}
          <div style={{ background: `${T.accent}08`, border: `1px solid ${T.accent}25`, borderRadius: "20px", padding: "28px", backdropFilter: "blur(10px)" }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: T.muted, marginBottom: "20px" }}>MATURITÉ DIGITALE DE VOTRE ENTREPRISE</p>

            {[["◈","Stratégie & Vision","#E88C32"], ["◉","Expérience Client","#F5C842"], ["◐","Opérations","#C4614A"], ["◎","Technologies","#6B8F3A"], ["◑","Culture & Équipes","#E88C32"]].map(([icon, label, color]) => (
              <div key={label} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: T.muted, fontFamily: "'DM Sans', sans-serif" }}><span style={{ color, marginRight: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>{icon}</span>{label}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color }}>?/20</span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,245,232,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "35%", height: "100%", background: `linear-gradient(90deg, ${color}60, ${color})`, borderRadius: "3px" }} />
                </div>
              </div>
            ))}

            <button onClick={() => setPage("audit")} style={{ width: "100%", marginTop: "8px", padding: "12px", background: T.accent, border: "none", borderRadius: "10px", color: T.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "1px" }}>
              DÉMARRER MON AUDIT GRATUIT
            </button>

            <p style={{ textAlign: "center", fontSize: "11px", color: T.muted, marginTop: "8px", fontFamily: "'DM Sans', sans-serif" }}>
              Gratuit · 20 minutes · Résultats immédiats
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop: `1px solid ${T.divider}`, borderBottom: `1px solid ${T.divider}`, padding: "28px 24px", background: "rgba(232,140,50,0.03)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "16px" }}>
          {[["5","Offres d'accompagnement"],["🌍","Congo · Cameroun · France"],["20 min","Pour votre audit gratuit"],["48h","Rapport personnalisé"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", color: T.accent, marginBottom: "4px" }}>{v}</p>
              <p style={{ fontSize: "12px", color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Offres preview */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: T.muted, marginBottom: "10px" }}>NOS OFFRES D'ACCOMPAGNEMENT</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 200, color: T.text, marginBottom: "36px" }}>
            Un accompagnement pour <em style={{ color: T.accent }}>chaque niveau</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "28px" }}>
            {OFFERS.map(o => (
              <div key={o.name} style={{ padding: "22px", background: `${o.color}06`, border: `1px solid ${o.color}22`, borderRadius: "14px", position: "relative", transition: "all 0.3s", cursor: "pointer" }}>
                {o.badge && <div style={{ position: "absolute", top: "-9px", right: "16px", background: o.color, padding: "2px 10px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: T.btnText, fontFamily: "'IBM Plex Mono', monospace" }}>{o.badge}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "22px", marginRight: "8px" }}>{o.emoji}</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: T.text, fontWeight: 400 }}>{o.name}</span>
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: o.color, marginTop: "3px" }}>{o.level}</p>
                  </div>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: o.color }}>{o.price}</p>
                </div>
                <div style={{ marginTop: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                  {[1,2,3].map(i => <div key={i} style={{ height: "4px", background: `${o.color}15`, borderRadius: "2px", width: `${60 + i * 10}%` }} />)}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => {}} style={{ padding: "13px 28px", background: "transparent", border: `1px solid ${T.border}`, borderRadius: "10px", color: T.muted, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
              Voir toutes les offres en détail →
            </button>
          </div>
        </div>
      </div>

      {/* Services Web */}
      <div style={{ padding: "60px 24px", background: "rgba(232,140,50,0.02)", borderTop: `1px solid ${T.divider}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: T.muted, marginBottom: "10px" }}>CRÉATION WEB · TARIFS AFRIQUE</p>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 3vw, 34px)", fontWeight: 200, color: T.text, marginBottom: "28px" }}>
            Votre site web <em style={{ color: T.accent }}>professionnel</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
            {SERVICES.map(s => (
              <div key={s.name} style={{ padding: "18px", background: `${s.color}06`, border: `1px solid ${s.color}20`, borderRadius: "12px" }}>
                <span style={{ fontSize: "22px", display: "block", marginBottom: "8px" }}>{s.emoji}</span>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: T.text, marginBottom: "4px" }}>{s.name}</p>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "15px", color: s.color }}>{s.price}</p>
              </div>
            ))}
          </div>
          <div style={{ padding: "16px 20px", background: `${T.gold}08`, border: `1px solid ${T.gold}20`, borderRadius: "10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "13px", color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>🤖 Générez la maquette de votre futur site en 2 minutes — gratuit</p>
            <button style={{ padding: "9px 18px", background: T.gold, border: "none", borderRadius: "8px", color: T.btnText, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", flexShrink: 0 }}>
              Essayer →
            </button>
          </div>
        </div>
      </div>

      {/* About Relia */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px", alignItems: "center" }}>
          <div>
            <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${T.accent}20 0%, ${T.gold}12 100%)`, borderRadius: "20px", border: `1px solid ${T.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px" }}>
              <span style={{ fontFamily: "'Fraunces', serif", fontSize: "64px", color: `${T.text}30` }}>RE</span>
            </div>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: T.text, marginBottom: "4px" }}>Relia Ebiya</p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: T.accent, letterSpacing: "1px", marginBottom: "10px" }}>FONDATRICE · NEXALIE CONSULTING</p>
            {["📍 Vitry-sur-Seine, France", "🇨🇬 Brazzaville, Congo", "💬 FR · EN · Lingala · Kitouba", "📧 relia.ebiya@gmail.com"].map(t => (
              <p key={t} style={{ fontSize: "12px", color: T.muted, fontFamily: "'DM Sans', sans-serif", marginBottom: "4px" }}>{t}</p>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: T.muted, marginBottom: "12px" }}>LA FONDATRICE</p>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 200, color: T.text, marginBottom: "18px", lineHeight: 1.3 }}>
              Un pont entre <em style={{ color: T.accent }}>deux mondes</em>
            </h2>
            <p style={{ fontSize: "15px", color: T.muted, lineHeight: 1.9, marginBottom: "18px", fontFamily: "'DM Sans', sans-serif" }}>
              Cheffe de projet digital avec 10+ ans d'expérience en France. Formée aux standards européens, ancrée dans la réalité africaine. Je parle votre langue — au sens propre comme au sens figuré.
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {[["🎯","Transformation digitale","Roadmaps & stratégie"],["🤖","IA & Automatisation","Make, Zapier, ChatGPT"],["📊","Data & Analytics","Power BI, KPIs"],["🌍","Franco-Africaine","Paris ↔ Brazzaville"]].map(([e,t,s]) => (
                <div key={t} style={{ padding: "14px", background: `${T.accent}06`, border: `1px solid ${T.accent}15`, borderRadius: "10px" }}>
                  <p style={{ fontSize: "18px", marginBottom: "5px" }}>{e}</p>
                  <p style={{ fontSize: "12px", fontWeight: "600", color: T.text, marginBottom: "2px", fontFamily: "'DM Sans', sans-serif" }}>{t}</p>
                  <p style={{ fontSize: "11px", color: T.muted, fontFamily: "'DM Sans', sans-serif" }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", padding: "48px", background: `${T.accent}08`, border: `1px solid ${T.accent}20`, borderRadius: "24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>🌍</span>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 200, color: T.text, marginBottom: "12px" }}>
            Votre transformation digitale <em style={{ color: T.accent }}>commence aujourd'hui</em>
          </h2>
          <p style={{ fontSize: "15px", color: T.muted, marginBottom: "28px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
            Audit gratuit en 20 minutes. Plan d'action personnalisé. Accompagnement adapté à votre réalité terrain.
          </p>
          <button onClick={() => {}} style={{ padding: "16px 40px", background: T.accent, border: "none", borderRadius: "12px", color: T.btnText, fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", boxShadow: `0 8px 30px ${T.accent}40` }}>
            Je fais mon audit gratuit →
          </button>
          <p style={{ fontSize: "12px", color: T.muted, marginTop: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            📱 WhatsApp : +33 7 86 62 04 09 · nexali.ai
          </p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${T.divider}`, padding: "28px 24px", textAlign: "center" }}>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 200, color: T.text, marginBottom: "4px" }}>
          Nexalie <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: T.gold }}>CONSULTING</span>
        </p>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: T.muted, letterSpacing: "1px" }}>
          nexali.ai · relia.ebiya@gmail.com · © 2026
        </p>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("home");

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;1,9..144,200&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(232,140,50,0.3); border-radius: 2px; }
        button:hover { opacity: 0.9; }
      `}</style>
      <Nav activePage={page} setPage={setPage} />
      <HomePage setPage={setPage} />
    </div>
  );
}
