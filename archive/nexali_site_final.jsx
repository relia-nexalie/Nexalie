import { useState, useEffect, createContext, useContext } from "react";

// ═══════════════════════════════════════════
// THEME CONTEXT — Toggle France / Afrique
// ═══════════════════════════════════════════

const ModeContext = createContext();

const THEMES = {
  fr: {
    bg: "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)",
    nav: "rgba(7,14,28,0.96)",
    card: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.08)",
    accent: "#4EC9B0",
    gold: "#C9A84C",
    text: "#FFFFFF",
    muted: "rgba(255,255,255,0.45)",
    btn: "#4EC9B0",
    btnText: "#070e1c",
    divider: "rgba(78,201,176,0.15)",
    tag: "🇫🇷 France",
    tagOther: "🌍 Afrique",
    hero: "PME françaises & entreprises africaines",
    priceSuffix: "fr",
  },
  af: {
    bg: "radial-gradient(ellipse at 20% 15%, #2A1200 0%, #1A0800 60%, #0D0400 100%)",
    nav: "rgba(26,8,0,0.96)",
    card: "rgba(232,140,50,0.05)",
    border: "rgba(232,140,50,0.15)",
    accent: "#E88C32",
    gold: "#F5C842",
    text: "#FFF5E8",
    muted: "rgba(255,245,232,0.45)",
    btn: "#E88C32",
    btnText: "#1A0800",
    divider: "rgba(232,140,50,0.15)",
    tag: "🌍 Afrique",
    tagOther: "🇫🇷 France",
    hero: "Congo · Cameroun · Côte d'Ivoire · Afrique",
    priceSuffix: "af",
  }
};

const PRICES = {
  fr: { vitrine: "1 200 — 1 800€", onepage: "400 — 600€", ecommerce: "2 500 — 4 000€", logo: "600 — 1 200€", identite: "1 200 — 2 500€", maintenance: "80 — 150€/mois" },
  af: { vitrine: "390 000 — 650 000 FCFA", onepage: "130 000 — 230 000 FCFA", ecommerce: "790 000 — 1 310 000 FCFA", logo: "200 000 — 390 000 FCFA", identite: "390 000 — 790 000 FCFA", maintenance: "33 000 — 52 000 FCFA/mois" }
};

// ═══════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════

function Nav({ page, setPage }) {
  const { mode, setMode, t } = useContext(ModeContext);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = [
    ["home", "Accueil"],
    ["offers", "Offres"],
    ["services", "Services Web"],
    ["platform", "Plateforme"],
    ["about", "À propos"],
  ];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: scrolled ? t.nav : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${t.divider}` : "none", padding: "0 24px", transition: "all 0.3s" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px" }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 300, color: t.text, transition: "color 0.3s" }}>Nexalie</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.gold, transition: "color 0.3s" }}>CONSULTING</span>
        </button>

        {/* Nav items */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }}>
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: page === id ? t.text : t.muted, fontFamily: "sans-serif", borderBottom: `2px solid ${page === id ? t.accent : "transparent"}`, transition: "all 0.2s", fontWeight: page === id ? "600" : "400" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Mode toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            <button onClick={() => setMode("fr")}
              style={{ padding: "7px 14px", background: mode === "fr" ? t.accent : "transparent", border: "none", color: mode === "fr" ? t.btnText : t.muted, fontSize: "12px", fontWeight: mode === "fr" ? "700" : "400", cursor: "pointer", transition: "all 0.3s", fontFamily: "sans-serif" }}>
              🇫🇷 France
            </button>
            <button onClick={() => setMode("af")}
              style={{ padding: "7px 14px", background: mode === "af" ? t.accent : "transparent", border: "none", color: mode === "af" ? t.btnText : t.muted, fontSize: "12px", fontWeight: mode === "af" ? "700" : "400", cursor: "pointer", transition: "all 0.3s", fontFamily: "sans-serif" }}>
              🌍 Afrique
            </button>
          </div>
          <button onClick={() => setPage("pricing")}
            style={{ padding: "9px 20px", background: t.btn, border: "none", borderRadius: "8px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.3s" }}>
            Démarrer →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════

const Tag = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", background: `${color}15`, color, fontSize: "10px", borderRadius: "6px", fontFamily: "monospace", marginRight: "5px", marginBottom: "4px" }}>{children}</span>
);

const StatCard = ({ value, label, color }) => {
  const { t } = useContext(ModeContext);
  return (
    <div style={{ textAlign: "center", padding: "16px" }}>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color, marginBottom: "4px" }}>{value}</p>
      <p style={{ fontSize: "12px", color: t.muted, fontFamily: "sans-serif" }}>{label}</p>
    </div>
  );
};

// ═══════════════════════════════════════════
// PAGE: HOME
// ═══════════════════════════════════════════

function HomePage({ setPage }) {
  const { mode, t } = useContext(ModeContext);

  const OFFERS = [
    { emoji: "🌱", name: "Pack Démarrage", price: mode === "af" ? "250 000 FCFA/mois" : "400€/mois", level: "Score 0–19", color: t.accent },
    { emoji: "🌿", name: "Pack Transformation", price: mode === "af" ? "400 000 FCFA/mois" : "600€/mois", level: "Score 20–39", color: t.gold },
    { emoji: "🌳", name: "Pack Auto. IA", price: mode === "af" ? "550 000 FCFA/mois" : "800€/mois", level: "Score 40–59", color: "#7B5EA7", badge: "POPULAIRE" },
    { emoji: "🚀", name: "Pack Excellence", price: mode === "af" ? "800 000 FCFA/mois" : "1 200€/mois", level: "Score 60–79", color: "#C0627A" },
  ];

  return (
    <div>
      {/* Hero */}
      <div style={{ minHeight: "88vh", display: "flex", alignItems: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}08, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: "-80px", left: "-80px", width: "400px", height: "400px", borderRadius: "50%", background: `radial-gradient(circle, ${t.gold}06, transparent 70%)`, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", width: "100%", position: "relative" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${t.accent}12`, border: `1px solid ${t.accent}30`, borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "12px" }}>✨</span>
              <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "1.5px", color: t.accent }}>{t.hero}</span>
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px, 5vw, 54px)", fontWeight: 200, color: t.text, lineHeight: 1.2, marginBottom: "20px" }}>
              Votre entreprise mérite<br /><em style={{ color: t.accent }}>l'excellence</em> digitale
            </h1>
            <p style={{ fontSize: "16px", color: t.muted, lineHeight: 1.8, marginBottom: "28px", maxWidth: "460px", fontFamily: "sans-serif" }}>
              Audit gratuit, accompagnement mensuel, outils IA — tout pour transformer votre business digitalement.
            </p>
            {mode === "af" && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["🇫🇷 Français", "🇨🇬 Lingala", "Kitouba", "🇬🇧 English"].map(l => (
                  <span key={l} style={{ padding: "4px 10px", background: `${t.gold}15`, border: `1px solid ${t.gold}25`, borderRadius: "20px", fontSize: "11px", color: t.gold, fontFamily: "sans-serif" }}>{l}</span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setPage("audit")} style={{ padding: "15px 30px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", boxShadow: `0 8px 24px ${t.accent}30` }}>
                Audit gratuit →
              </button>
              <button onClick={() => setPage("offers")} style={{ padding: "15px 28px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "15px", cursor: "pointer", fontFamily: "sans-serif", opacity: 0.8 }}>
                Nos offres
              </button>
            </div>
          </div>

          {/* Score card */}
          <div style={{ background: t.card, border: `1px solid ${t.accent}25`, borderRadius: "20px", padding: "28px" }}>
            <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: t.muted, marginBottom: "20px" }}>MATURITÉ DIGITALE DE VOTRE ENTREPRISE</p>
            {[["◈","Stratégie & Vision",t.accent],["◉","Expérience Client",t.gold],["◐","Opérations","#7B5EA7"],["◎","Technologies","#C0627A"],["◑","Culture & Équipes",t.accent]].map(([icon, label, color]) => (
              <div key={label} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                  <span style={{ fontSize: "12px", color: t.muted, fontFamily: "sans-serif" }}><span style={{ color, marginRight: "6px" }}>{icon}</span>{label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color }}>?/20</span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: "35%", height: "100%", background: color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
            <button onClick={() => setPage("audit")} style={{ width: "100%", marginTop: "8px", padding: "12px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", letterSpacing: "1px" }}>
              DÉMARRER MON AUDIT GRATUIT
            </button>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div style={{ borderTop: `1px solid ${t.divider}`, borderBottom: `1px solid ${t.divider}`, padding: "28px 24px", background: `${t.accent}04` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", justifyContent: "space-around", flexWrap: "wrap", gap: "16px" }}>
          {[["5","Offres d'accompagnement"],["🌍","Congo · Cameroun · France"],["20 min","Audit gratuit"],["48h","Rapport personnalisé"]].map(([v,l]) => (
            <StatCard key={l} value={v} label={l} color={t.accent} />
          ))}
        </div>
      </div>

      {/* Offers preview */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>NOS OFFRES</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 200, color: t.text, marginBottom: "36px" }}>
            Un accompagnement pour <em style={{ color: t.accent }}>chaque niveau</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "24px" }}>
            {OFFERS.map(o => (
              <div key={o.name} style={{ padding: "22px", background: `${o.color}06`, border: `1px solid ${o.color}22`, borderRadius: "14px", position: "relative", cursor: "pointer" }}
                onClick={() => setPage("offers")}>
                {o.badge && <div style={{ position: "absolute", top: "-9px", right: "16px", background: o.color, padding: "2px 10px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: "#fff", fontFamily: "monospace" }}>{o.badge}</div>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <span style={{ fontSize: "22px", marginRight: "8px" }}>{o.emoji}</span>
                    <span style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: t.text }}>{o.name}</span>
                    <p style={{ fontFamily: "monospace", fontSize: "10px", color: o.color, marginTop: "3px" }}>{o.level}</p>
                  </div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: o.color }}>{o.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center" }}>
            <button onClick={() => setPage("offers")} style={{ padding: "12px 28px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.muted, fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif" }}>
              Voir toutes les offres en détail →
            </button>
          </div>
        </div>
      </div>

      {/* Platform teaser */}
      <div style={{ padding: "60px 24px", background: `${t.accent}03`, borderTop: `1px solid ${t.divider}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME SaaS</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 200, color: t.text, marginBottom: "16px" }}>
              6 outils IA pour <em style={{ color: t.accent }}>transformer votre business</em>
            </h2>
            <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.8, marginBottom: "20px", fontFamily: "sans-serif" }}>
              Business plan, roadmap, veille concurrentielle, cahier des charges… Générez en 2 minutes ce qui prend des jours.
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <Tag color={t.accent}>Gratuit</Tag>
              <Tag color={t.gold}>29€/mois Premium</Tag>
            </div>
            <button onClick={() => setPage("platform")} style={{ padding: "12px 24px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
              Découvrir la plateforme →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[["📊","Audit Digital","Gratuit",t.accent],["💰","Calculateur ROI","Gratuit",t.accent],["📋","Business Plan IA","Premium",t.gold],["🗺️","Roadmap 12 mois","Premium",t.gold],["🔍","Veille Concurrentielle","Premium",t.gold],["📄","Cahier des Charges","Premium",t.gold]].map(([e,n,p,c]) => (
              <div key={n} style={{ padding: "14px", background: `${c}06`, border: `1px solid ${c}18`, borderRadius: "10px" }}>
                <span style={{ fontSize: "18px", display: "block", marginBottom: "5px" }}>{e}</span>
                <p style={{ fontSize: "12px", fontWeight: "600", color: t.text, marginBottom: "2px", fontFamily: "sans-serif" }}>{n}</p>
                <p style={{ fontSize: "10px", color: c, fontFamily: "monospace" }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Services web teaser */}
      <div style={{ padding: "60px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>CRÉATION WEB</p>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 200, color: t.text, marginBottom: "28px" }}>
            Votre site web <em style={{ color: t.accent }}>professionnel</em>
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
            {[["🌐","Site Vitrine",t.accent],["📄","One-Page",t.gold],["🛒","E-Commerce","#7B5EA7"],["🎨","Identité Visuelle","#4A7C59"]].map(([e,n,c]) => (
              <div key={n} style={{ padding: "18px", background: `${c}06`, border: `1px solid ${c}20`, borderRadius: "12px", cursor: "pointer" }} onClick={() => setPage("services")}>
                <span style={{ fontSize: "22px", display: "block", marginBottom: "8px" }}>{e}</span>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: t.text, marginBottom: "4px" }}>{n}</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "14px", color: c }}>
                  {PRICES[mode][n === "Site Vitrine" ? "vitrine" : n === "One-Page" ? "onepage" : n === "E-Commerce" ? "ecommerce" : "logo"]}
                </p>
              </div>
            ))}
          </div>
          <button onClick={() => setPage("maquette")} style={{ padding: "12px 24px", background: `${t.accent}12`, border: `1px solid ${t.accent}30`, borderRadius: "10px", color: t.accent, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
            🤖 Générer ma maquette gratuite →
          </button>
        </div>
      </div>

      {/* About teaser */}
      <div style={{ padding: "60px 24px", background: `${t.accent}03`, borderTop: `1px solid ${t.divider}` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 34px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
            Un pont entre <em style={{ color: t.accent }}>deux mondes</em>
          </h2>
          <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.8, marginBottom: "20px", fontFamily: "sans-serif" }}>
            Relia Ebiya — Chef de Projet Digital avec 10+ ans d'expérience en France. Double culture, double expertise. Elle parle votre langue au sens propre comme au sens figuré.
          </p>
          <button onClick={() => setPage("about")} style={{ padding: "12px 24px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.muted, fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif" }}>
            Découvrir Relia →
          </button>
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", padding: "48px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: "24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>🚀</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
            Votre transformation digitale <em style={{ color: t.accent }}>commence aujourd'hui</em>
          </h2>
          <p style={{ fontSize: "15px", color: t.muted, marginBottom: "28px", lineHeight: 1.7, fontFamily: "sans-serif" }}>
            Audit gratuit en 20 minutes. Plan d'action personnalisé. Accompagnement adapté.
          </p>
          <button onClick={() => setPage("audit")} style={{ padding: "16px 40px", background: t.btn, border: "none", borderRadius: "12px", color: t.btnText, fontSize: "16px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", boxShadow: `0 8px 30px ${t.accent}30` }}>
            Je fais mon audit gratuit →
          </button>
          <p style={{ fontSize: "12px", color: t.muted, marginTop: "12px", fontFamily: "sans-serif" }}>
            📱 WhatsApp : +33 7 86 62 04 09 · nexali.ai
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.divider}`, padding: "32px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            <div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text, marginBottom: "8px" }}>Nexalie <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.gold }}>CONSULTING</span></p>
              <p style={{ fontSize: "13px", color: t.muted, lineHeight: 1.7, fontFamily: "sans-serif", maxWidth: "260px" }}>L'expertise digitale française au service des entreprises africaines.</p>
              <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                {["LinkedIn","Instagram","TikTok","Facebook"].map(r => (
                  <div key={r} style={{ padding: "4px 10px", background: `${t.accent}12`, border: `1px solid ${t.accent}25`, borderRadius: "6px" }}>
                    <span style={{ fontSize: "10px", color: t.accent, fontFamily: "monospace" }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>
            {[
              ["Services", ["Consulting", "Création Web", "Formation IA", "Audit Digital", "Plateforme SaaS"]],
              ["Entreprise", ["À propos", "Portfolio", "Blog", "Contact", "Tarifs"]],
              ["Légal", ["Mentions légales", "CGV", "Confidentialité", "Cookies"]],
            ].map(([title, links]) => (
              <div key={title}>
                <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: t.muted, marginBottom: "12px" }}>{title.toUpperCase()}</p>
                {links.map(l => <p key={l} style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "6px", cursor: "pointer" }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <p style={{ fontSize: "12px", color: t.muted, fontFamily: "monospace" }}>© 2026 Nexalie Consulting · relia.ebiya@gmail.com · +33 7 86 62 04 09</p>
            <p style={{ fontSize: "12px", color: t.accent, fontFamily: "monospace" }}>nexali.ai</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: OFFERS
// ═══════════════════════════════════════════

function OffersPage({ setPage }) {
  const { mode, t } = useContext(ModeContext);
  const isAf = mode === "af";
  const offers = [
    { emoji: "🌱", name: "Pack Démarrage",
      audit: isAf ? "300 000 FCFA" : "500€",
      monthly: isAf ? "250 000 FCFA/mois" : "400€/mois",
      min: "3 mois", score: "0–19", color: t.accent,
      items: ["Audit initial + rapport", "1 session mensuelle Zoom (1h)", "Roadmap digitale personnalisée", "Suivi KPIs mensuel", "Support WhatsApp"] },
    { emoji: "🌿", name: "Pack Transformation",
      audit: isAf ? "450 000 FCFA" : "700€",
      monthly: isAf ? "400 000 FCFA/mois" : "600€/mois",
      min: "6 mois", score: "20–39", color: t.gold,
      items: ["Tout le Pack Démarrage", "2 sessions mensuelles (1h30 chacune)", "Stratégie digitale complète", "Formation équipe (2h/mois)", "Tableau de bord KPIs dédié"] },
    { emoji: "🌳", name: "Pack Automatisation IA",
      audit: isAf ? "750 000 FCFA" : "1 200€",
      monthly: isAf ? "550 000 FCFA/mois" : "800€/mois",
      min: "6 mois", score: "40–59", color: "#7B5EA7", badge: "POPULAIRE",
      items: ["Tout le Pack Transformation", "Automatisation processus (Make/Zapier)", "Déploiement outils IA équipe", "3 sessions mensuelles", "Accès Plateforme Premium inclus"] },
    { emoji: "🚀", name: "Pack Excellence",
      audit: isAf ? "1 000 000 FCFA" : "1 500€",
      monthly: isAf ? "800 000 FCFA/mois" : "1 200€/mois",
      min: "12 mois", score: "60–79", color: "#C0627A",
      items: ["Tout le Pack Automatisation", "Accompagnement stratégique avancé", "Présentiel possible (France/Congo)", "Sessions illimitées", "Réseau partenaires Nexalie"] },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>ACCOMPAGNEMENT CONSULTING</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Nos offres <em style={{ color: t.accent }}>d'accompagnement</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "40px", fontFamily: "sans-serif", maxWidth: "500px", lineHeight: 1.7 }}>
        Choisissez selon votre score d'audit. Vous ne savez pas encore ? Faites l'audit gratuit en 20 minutes.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {offers.map(o => (
          <div key={o.name} style={{ padding: "24px", background: `${o.color}06`, border: `1px solid ${o.color}25`, borderRadius: "16px", position: "relative" }}>
            {o.badge && <div style={{ position: "absolute", top: "-10px", right: "16px", background: o.color, padding: "3px 12px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: "#fff", fontFamily: "monospace" }}>{o.badge}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <div>
                <span style={{ fontSize: "24px", marginRight: "8px" }}>{o.emoji}</span>
                <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text }}>{o.name}</span>
                <p style={{ fontFamily: "monospace", fontSize: "10px", color: o.color, marginTop: "3px" }}>Score {o.score}/100</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: o.color }}>{o.monthly}</p>
                <p style={{ fontSize: "11px", color: t.muted, fontFamily: "monospace" }}>Audit : {o.audit} · {o.min} min</p>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginBottom: "16px" }}>
              {o.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "8px" }}>
                  <span style={{ color: o.color, fontSize: "12px" }}>✓</span>
                  <span style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setPage("contact")} style={{ width: "100%", padding: "11px", background: `${o.color}15`, border: `1px solid ${o.color}30`, borderRadius: "9px", color: o.color, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
              Démarrer ce pack →
            </button>
          </div>
        ))}
      </div>
      <div style={{ padding: "24px", background: `${t.accent}06`, border: `1px solid ${t.accent}20`, borderRadius: "14px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: t.text, marginBottom: "4px" }}>⭐ Formation IA Équipe</p>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>1 journée complète · 6 à 12 participants · France & Afrique</p>
        </div>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.accent }}>{mode === "af" ? "230 000 FCFA/personne" : "350€/personne"}</p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: SERVICES WEB
// ═══════════════════════════════════════════

function ServicesPage({ setPage }) {
  const { mode, t } = useContext(ModeContext);
  const p = PRICES[mode];

  const services = [
    { emoji: "🌐", name: "Site Web Vitrine", price: p.vitrine, delay: "2-3 semaines", color: t.accent, badge: null, items: ["5 pages personnalisées", "Design sur mesure", "Mobile-friendly", "SEO de base", "Formulaire contact", "Google Analytics"] },
    { emoji: "📄", name: "One-Page", price: p.onepage, delay: "5-7 jours", color: t.gold, badge: "⚡ RAPIDE", items: ["1 page longue complète", "Sections Hero+Services+Contact", "Mobile-friendly", "Livraison express", "Idéal pour tester une offre"] },
    { emoji: "🛒", name: "E-Commerce", price: p.ecommerce, delay: "4-6 semaines", color: "#7B5EA7", badge: null, items: ["Catalogue produits illimité", "Paiement sécurisé Stripe", "Mobile Money (Afrique)", "Tableau de bord vendeur", "Emails automatiques"] },
    { emoji: "🎯", name: "Landing Page", price: mode === "fr" ? "600 — 900€" : "200 000 — 330 000 FCFA", delay: "1 semaine", color: "#CE9178", badge: null, items: ["Design orienté conversion", "Formulaire de capture", "Analytics avancés", "CTA optimisés"] },
    { emoji: "🎨", name: "Identité Visuelle", price: p.identite, delay: "1-2 semaines", color: "#4A7C59", badge: null, items: ["Logo (3 propositions)", "Palette de couleurs", "Charte graphique PDF", "Fichiers sources AI/SVG/PNG"] },
    { emoji: "🔄", name: "Refonte Site", price: mode === "fr" ? "800 — 1 500€" : "260 000 — 520 000 FCFA", delay: "2-3 semaines", color: "#569CD6", badge: null, items: ["Audit site existant", "Nouveau design moderne", "Migration contenus", "SEO optimisé"] },
    { emoji: "🛠️", name: "Maintenance", price: p.maintenance, delay: "3 mois min", color: "#C586C0", badge: "🔁 RÉCURRENT", items: ["Mises à jour WordPress", "Sauvegardes hebdo", "2h modifications/mois", "Support WhatsApp"] },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>CRÉATION WEB & IDENTITÉ</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
            Votre site web {mode === "af" ? <em style={{ color: t.accent }}>pour l'Afrique</em> : <em style={{ color: t.accent }}>professionnel</em>}
          </h1>
          <p style={{ fontSize: "14px", color: t.muted, fontFamily: "sans-serif" }}>Tarifs {mode === "af" ? "adaptés au marché africain" : "marché français"} · Livraison rapide</p>
        </div>
        <button onClick={() => setPage("maquette")} style={{ padding: "12px 22px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
          🤖 Générer ma maquette →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" }}>
        {services.map(s => (
          <div key={s.name} style={{ padding: "22px", background: `${s.color}04`, border: `1px solid ${s.color}20`, borderRadius: "14px", position: "relative" }}>
            {s.badge && <div style={{ position: "absolute", top: "-9px", right: "14px", background: s.color, padding: "2px 10px", borderRadius: "10px", fontSize: "9px", fontWeight: "700", color: "#070e1c", fontFamily: "monospace" }}>{s.badge}</div>}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <span style={{ fontSize: "22px" }}>{s.emoji}</span>
                <div>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: t.text }}>{s.name}</p>
                  <p style={{ fontFamily: "monospace", fontSize: "9px", color: t.muted }}>⏱ {s.delay}</p>
                </div>
              </div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: s.color }}>{s.price}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
              {s.items.map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "5px" }}>
                  <span style={{ color: s.color, fontSize: "11px" }}>✓</span>
                  <span style={{ fontSize: "11px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: PLATFORM (simplified)
// ═══════════════════════════════════════════

function PlatformPage({ setPage }) {
  const { t } = useContext(ModeContext);
  const tools = [
    { emoji: "📊", name: "Audit Digital", desc: "Évaluez votre maturité digitale en 20 minutes", free: true, color: t.accent },
    { emoji: "💰", name: "Calculateur ROI", desc: "Calculez le retour sur investissement de votre digital", free: true, color: t.accent },
    { emoji: "🤖", name: "Générateur Maquette", desc: "Visualisez votre futur site web en 2 minutes", free: true, color: t.accent },
    { emoji: "📋", name: "Business Plan IA", desc: "Générez un business plan complet avec benchmark", free: false, color: t.gold },
    { emoji: "🗺️", name: "Roadmap 12 mois", desc: "Votre plan d'action digital sur 12 mois", free: false, color: t.gold },
    { emoji: "🔍", name: "Veille Concurrentielle", desc: "Analysez votre marché et vos concurrents", free: false, color: t.gold },
    { emoji: "📄", name: "Cahier des Charges", desc: "Document professionnel complet pour vos projets", free: false, color: t.gold },
    { emoji: "💸", name: "Simulateur Budget", desc: "Estimez le budget de votre projet digital", free: false, color: t.gold },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME SaaS</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        8 outils IA pour <em style={{ color: t.accent }}>transformer votre business</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "36px", fontFamily: "sans-serif", maxWidth: "500px", lineHeight: 1.7 }}>
        Commencez avec les outils gratuits. Passez Premium pour accès illimité.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
        {tools.map(tool => (
          <div key={tool.name} style={{ padding: "18px", background: `${tool.color}06`, border: `1px solid ${tool.color}18`, borderRadius: "12px", cursor: "pointer" }}
            onClick={() => setPage(tool.free ? "audit" : "pricing")}>
            <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>{tool.emoji}</span>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.text, marginBottom: "4px", fontFamily: "sans-serif" }}>{tool.name}</p>
            <p style={{ fontSize: "11px", color: t.muted, lineHeight: 1.5, marginBottom: "8px", fontFamily: "sans-serif" }}>{tool.desc}</p>
            <span style={{ padding: "2px 8px", background: tool.free ? "rgba(74,124,89,0.2)" : `${t.gold}20`, color: tool.free ? "#4A7C59" : t.gold, fontSize: "9px", borderRadius: "5px", fontFamily: "monospace", fontWeight: "700" }}>
              {tool.free ? "GRATUIT" : "PREMIUM"}
            </span>
          </div>
        ))}
      </div>

      {/* Pricing CTA */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ padding: "24px", background: `${t.accent}06`, border: `1px solid ${t.accent}20`, borderRadius: "14px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>🌱 Plan Gratuit</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.accent, marginBottom: "8px" }}>0€</p>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "16px" }}>Audit + ROI + Maquette (3/mois)</p>
          <button onClick={() => setPage("audit")} style={{ width: "100%", padding: "11px", background: "transparent", border: `1px solid ${t.accent}`, borderRadius: "8px", color: t.accent, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
            Commencer gratuitement →
          </button>
        </div>
        <div style={{ padding: "24px", background: `${t.gold}08`, border: `1px solid ${t.gold}30`, borderRadius: "14px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>🚀 Plan Premium</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.gold, marginBottom: "8px" }}>29€/mois</p>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "16px" }}>Tous les outils illimités + Export PDF</p>
          <button onClick={() => setPage("pricing")} style={{ width: "100%", padding: "11px", background: t.gold, border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
            Passer Premium →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: ABOUT
// ═══════════════════════════════════════════

function AboutPage({ setPage }) {
  const { t } = useContext(ModeContext);
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px", alignItems: "start" }}>
        <div>
          <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${t.accent}20, ${t.gold}12)`, borderRadius: "20px", border: `1px solid ${t.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "72px", color: `${t.text}25` }}>RE</span>
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>Relia Ebiya</p>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: t.accent, letterSpacing: "1px", marginBottom: "14px" }}>FONDATRICE · NEXALIE CONSULTING</p>
          {["📍 Vitry-sur-Seine, France", "🇨🇬 Congo Brazzaville", "💬 FR · EN · Lingala · Kitouba", "📧 relia.ebiya@gmail.com", "📱 +33 7 86 62 04 09"].map(info => (
            <p key={info} style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "5px" }}>{info}</p>
          ))}
          <button onClick={() => setPage("contact")} style={{ width: "100%", marginTop: "16px", padding: "12px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
            Me contacter →
          </button>
        </div>

        <div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>LA FONDATRICE</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 200, color: t.text, marginBottom: "16px" }}>
            Un pont entre <em style={{ color: t.accent }}>deux mondes</em>
          </h1>
          <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.9, marginBottom: "28px", fontFamily: "sans-serif" }}>
            Cheffe de projet digital avec 10+ ans d'expérience en France, formée aux standards européens, ancrée dans la réalité africaine. Je parle votre langue — au sens propre comme au sens figuré.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
            {[["🎯","Transformation digitale","Roadmaps & stratégie"],["🤖","IA & Automatisation","Make, Zapier, ChatGPT"],["📊","Data & Analytics","Power BI, KPIs"],["🌍","Franco-Africaine","Paris ↔ Brazzaville"]].map(([e,title,sub]) => (
              <div key={title} style={{ padding: "14px", background: `${t.accent}06`, border: `1px solid ${t.accent}15`, borderRadius: "10px" }}>
                <p style={{ fontSize: "18px", marginBottom: "5px" }}>{e}</p>
                <p style={{ fontSize: "12px", fontWeight: "600", color: t.text, marginBottom: "2px", fontFamily: "sans-serif" }}>{title}</p>
                <p style={{ fontSize: "11px", color: t.muted, fontFamily: "sans-serif" }}>{sub}</p>
              </div>
            ))}
          </div>

          <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.muted, marginBottom: "12px" }}>PARCOURS</p>
          {[
            ["2022 → Présent","Chef de Projet Digital · 3SP Technologies",t.accent],
            ["2021 → 2023","CEO & Fondatrice · WEAREEYWA",t.gold],
            ["2020 → 2021","Marketing Executive · RBEAN","#7B5EA7"],
            ["2015 → 2018","Chef d'Équipe · UGC","#C0627A"],
            ["2024","Master Manager de Projet · ECEMA","#4A7C59"],
          ].map(([period, role, color]) => (
            <div key={period} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color, flexShrink: 0, marginTop: "5px" }} />
              <div>
                <p style={{ fontSize: "11px", color, fontFamily: "monospace", marginBottom: "1px" }}>{period}</p>
                <p style={{ fontSize: "13px", color: t.text, fontFamily: "sans-serif" }}>{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: CONTACT
// ═══════════════════════════════════════════

function ContactPage() {
  const { t } = useContext(ModeContext);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>CONTACT</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Parlons de <em style={{ color: t.accent }}>votre projet</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "40px", fontFamily: "sans-serif" }}>Réponse garantie sous 24h.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
        <div>
          {[["📧","Email","relia.ebiya@gmail.com"],["📱","WhatsApp","+33 7 86 62 04 09"],["🌐","Site web","nexali.ai"],["📍","Basée à","Vitry-sur-Seine, France"],["🇨🇬","Marchés","France · Congo · Afrique"]].map(([e,l,v]) => (
            <div key={l} style={{ padding: "14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "10px", marginBottom: "10px" }}>
              <p style={{ fontSize: "10px", color: t.muted, fontFamily: "monospace", marginBottom: "3px" }}>{e} {l.toUpperCase()}</p>
              <p style={{ fontSize: "14px", color: t.accent, fontFamily: "sans-serif" }}>{v}</p>
            </div>
          ))}
        </div>

        {sent ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", background: `${t.accent}06`, border: `1px solid ${t.accent}20`, borderRadius: "16px", textAlign: "center" }}>
            <span style={{ fontSize: "48px", marginBottom: "16px" }}>✅</span>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "8px" }}>Message envoyé !</p>
            <p style={{ fontSize: "14px", color: t.muted, fontFamily: "sans-serif" }}>Je vous réponds sous 24h.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[["Nom complet","name","text","Votre nom"],["Email","email","email","votre@email.com"],["Sujet","subject","text","Objet de votre demande"]].map(([label,key,type,ph]) => (
              <div key={key}>
                <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "5px" }}>{label.toUpperCase()}</label>
                <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph} type={type}
                  style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "8px", color: t.text, fontSize: "13px", fontFamily: "sans-serif", outline: "none" }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "5px" }}>MESSAGE</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={4} placeholder="Décrivez votre projet ou votre question..."
                style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "8px", color: t.text, fontSize: "13px", resize: "vertical", fontFamily: "sans-serif", lineHeight: 1.6, outline: "none" }} />
            </div>
            <button onClick={() => setSent(true)}
              style={{ padding: "13px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
              Envoyer le message →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: PRICING (simplified)
// ═══════════════════════════════════════════

function PricingPage({ setPage }) {
  const { mode, t } = useContext(ModeContext);
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME NEXALIE</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Tarifs <em style={{ color: t.accent }}>simples et transparents</em>
      </h1>

      <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden", margin: "24px 0 40px" }}>
        {[["monthly","Mensuel"],["annual","Annuel — 2 mois offerts"]].map(([id,label]) => (
          <button key={id} onClick={() => setBilling(id)}
            style={{ padding: "10px 24px", background: billing === id ? t.accent : "transparent", border: "none", color: billing === id ? t.btnText : t.muted, fontSize: "13px", fontWeight: billing === id ? "700" : "400", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s" }}>
            {label}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "14px", textAlign: "left" }}>
        {[
          { name: "Gratuit", price: "0€", period: "", color: t.accent, items: ["Audit digital", "Calculateur ROI", "Maquette IA (3/mois)", "Articles blog"], cta: "Commencer", ctaAction: () => setPage("audit") },
          { name: "Premium", price: mode === "af" ? (billing === "annual" ? "15 900 FCFA" : "19 900 FCFA") : (billing === "annual" ? "20€" : "29€"), period: "/mois", badge: "POPULAIRE", color: t.gold, items: ["Tous les outils illimités", "Business Plan IA", "Roadmap + Veille", "CDC + Budget", "Export PDF", "Support WhatsApp"], cta: "Passer Premium", ctaFilled: true, ctaAction: () => setPage("checkout") },
          { name: "Consulting", price: mode === "af" ? "250 000 FCFA" : "400€+", period: "/mois", color: "#7B5EA7", items: ["Tout Premium inclus", "Sessions Zoom mensuelles", "Rapport personnalisé", "Roadmap sur mesure", "WhatsApp direct Relia"], cta: "Prendre RDV", ctaAction: () => setPage("contact") },
        ].map((plan, i) => (
          <div key={plan.name} style={{ padding: "24px", background: `${plan.color}06`, border: `1px solid ${i === 1 ? plan.color + "40" : plan.color + "20"}`, borderRadius: "16px", position: "relative", transform: i === 1 ? "scale(1.02)" : "scale(1)" }}>
            {plan.badge && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: plan.color, padding: "3px 14px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: "#070e1c", fontFamily: "monospace", whiteSpace: "nowrap" }}>{plan.badge}</div>}
            <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text, marginBottom: "8px" }}>{plan.name}</p>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: plan.color }}>{plan.price}</span>
              <span style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>{plan.period}</span>
            </div>
            {plan.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "7px", marginBottom: "6px" }}>
                <span style={{ color: "#4A7C59", fontSize: "12px" }}>✓</span>
                <span style={{ fontSize: "12px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
              </div>
            ))}
            <button onClick={plan.ctaAction} style={{ width: "100%", marginTop: "16px", padding: "11px", background: plan.ctaFilled ? plan.color : "transparent", border: `1px solid ${plan.color}`, borderRadius: "8px", color: plan.ctaFilled ? "#070e1c" : plan.color, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
              {plan.cta} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: AUDIT (placeholder)
// ═══════════════════════════════════════════

function AuditPage() {
  const { t } = useContext(ModeContext);
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>OUTIL GRATUIT</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
        Audit de <em style={{ color: t.accent }}>maturité digitale</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.7, marginBottom: "28px", fontFamily: "sans-serif" }}>
        20 minutes pour obtenir votre score de maturité digitale sur 5 dimensions et un plan d'action personnalisé.
      </p>
      <div style={{ padding: "28px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: "16px" }}>
        <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: t.text, marginBottom: "8px" }}>Gratuit · Sans inscription · Résultats immédiats</p>
        <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "20px" }}>Le composant audit_digital_nexali_v2.jsx est intégré ici par le développeur.</p>
        <button style={{ padding: "14px 32px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
          Démarrer l'audit →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// PAGE: MAQUETTE (placeholder)
// ═══════════════════════════════════════════

function MaquettePage() {
  const { t } = useContext(ModeContext);
  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>OUTIL GRATUIT</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
        Générateur de <em style={{ color: t.accent }}>maquette IA</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.7, marginBottom: "28px", fontFamily: "sans-serif" }}>
        Décrivez votre projet, choisissez vos couleurs — l'IA génère la maquette de votre futur site en 2 minutes.
      </p>
      <div style={{ padding: "28px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: "16px" }}>
        <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "20px" }}>Le composant nexali_mockup_generator.jsx est intégré ici par le développeur.</p>
        <button style={{ padding: "14px 32px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
          Générer ma maquette →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [mode, setMode] = useState("fr");
  const [page, setPage] = useState("home");
  const t = THEMES[mode];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [page]);

  return (
    <ModeContext.Provider value={{ mode, setMode, t }}>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "sans-serif", transition: "background 0.5s ease" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input, textarea, select { outline: none !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
          button { transition: opacity 0.15s; }
          button:hover { opacity: 0.9; }
        `}</style>
        <Nav page={page} setPage={setPage} />
        {page === "home" && <HomePage setPage={setPage} />}
        {page === "offers" && <OffersPage setPage={setPage} />}
        {page === "services" && <ServicesPage setPage={setPage} />}
        {page === "platform" && <PlatformPage setPage={setPage} />}
        {page === "about" && <AboutPage setPage={setPage} />}
        {page === "contact" && <ContactPage />}
        {page === "pricing" && <PricingPage setPage={setPage} />}
        {page === "audit" && <AuditPage />}
        {page === "maquette" && <MaquettePage />}
        {page === "checkout" && <div style={{ padding: "100px 24px", textAlign: "center" }}><p style={{ color: t.accent, fontFamily: "Georgia, serif", fontSize: "24px" }}>Redirection Stripe Checkout...</p></div>}
      </div>
    </ModeContext.Provider>
  );
}
