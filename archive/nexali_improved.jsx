import { useState, useEffect, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════
const THEMES = {
  fr: {
    bg: "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)",
    nav: "rgba(7,14,28,0.96)", card: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.08)", accent: "#4EC9B0", gold: "#C9A84C",
    text: "#FFFFFF", muted: "rgba(255,255,255,0.45)", btn: "#4EC9B0",
    btnText: "#070e1c", divider: "rgba(78,201,176,0.15)",
    tag: "🇫🇷 France", tagOther: "🌍 Afrique", priceSuffix: "fr",
    hero: "PME françaises & entreprises africaines",
  },
  af: {
    bg: "radial-gradient(ellipse at 20% 15%, #2A1200 0%, #1A0800 60%, #0D0400 100%)",
    nav: "rgba(26,8,0,0.96)", card: "rgba(232,140,50,0.05)",
    border: "rgba(232,140,50,0.15)", accent: "#E88C32", gold: "#F5C842",
    text: "#FFF5E8", muted: "rgba(255,245,232,0.45)", btn: "#E88C32",
    btnText: "#1A0800", divider: "rgba(232,140,50,0.15)",
    tag: "🌍 Afrique", tagOther: "🇫🇷 France", priceSuffix: "af",
    hero: "Congo · Cameroun · Côte d'Ivoire · Afrique",
  }
};

const PRICES = {
  fr: { vitrine: "1 200 — 1 800€", onepage: "400 — 600€", ecommerce: "2 500 — 4 000€", logo: "600 — 1 200€", identite: "1 200 — 2 500€", maintenance: "80 — 150€/mois", landing: "600 — 900€", refonte: "800 — 1 500€" },
  af: { vitrine: "600 — 1 000€", onepage: "200 — 350€", ecommerce: "1 200 — 2 000€", logo: "300 — 600€", identite: "600 — 1 200€", maintenance: "50 — 80€/mois", landing: "300 — 500€", refonte: "400 — 800€" }
};

// ═══════════════════════════════════════════════════════════════
// CONTEXT
// ═══════════════════════════════════════════════════════════════
const Ctx = createContext();

// ═══════════════════════════════════════════════════════════════
// SECURE API CALL — routes through server-side proxy
// In production: replace with /api/claude route in Next.js
// The API key MUST live server-side only (env var)
// ═══════════════════════════════════════════════════════════════
async function callClaude(system, userPrompt, onChunk) {
  // IMPORTANT FOR DEV: This call goes through the Anthropic API directly.
  // In production Next.js, replace this URL with your own /api/claude route
  // that keeps the API key server-side in process.env.ANTHROPIC_API_KEY
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: userPrompt }],
      stream: true,
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop();
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const d = JSON.parse(line.slice(6));
        if (d.type === "content_block_delta" && d.delta?.text) onChunk(d.delta.text);
      } catch {}
    }
  }
}

// ═══════════════════════════════════════════════════════════════
// SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════
const Tag = ({ children, color }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", background: `${color}18`, color, fontSize: "10px", borderRadius: "6px", fontFamily: "monospace", marginRight: "5px", marginBottom: "4px" }}>{children}</span>
);

function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "#4EC9B0", error: "#C0627A", info: "#C9A84C" };
  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999, padding: "14px 20px", background: "#0d1f35", border: `1px solid ${colors[type]}40`, borderLeft: `3px solid ${colors[type]}`, borderRadius: "10px", color: "#fff", fontSize: "13px", fontFamily: "sans-serif", boxShadow: "0 8px 30px rgba(0,0,0,0.4)", maxWidth: "320px", animation: "slideIn 0.3s ease" }}>
      {message}
    </div>
  );
}

function LoadingSpinner({ color, size = 32 }) {
  return <div style={{ width: `${size}px`, height: `${size}px`, border: `2px solid ${color}25`, borderTop: `2px solid ${color}`, borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto" }} />;
}

function EmptyState({ icon, title, desc, action, onAction }) {
  const { t } = useContext(Ctx);
  return (
    <div style={{ textAlign: "center", padding: "60px 24px" }}>
      <span style={{ fontSize: "48px", display: "block", marginBottom: "16px" }}>{icon}</span>
      <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text, marginBottom: "8px" }}>{title}</p>
      <p style={{ fontSize: "14px", color: t.muted, marginBottom: "24px", fontFamily: "sans-serif" }}>{desc}</p>
      {action && <button onClick={onAction} style={{ padding: "12px 24px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>{action}</button>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════════════
function Nav({ page, setPage }) {
  const { mode, setMode, t } = useContext(Ctx);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const navItems = [["home", "Accueil"], ["offers", "Offres"], ["services", "Services Web"], ["platform", "Plateforme"], ["about", "À propos"]];

  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 1000, background: scrolled ? t.nav : "transparent", backdropFilter: scrolled ? "blur(20px)" : "none", borderBottom: scrolled ? `1px solid ${t.divider}` : "none", padding: "0 24px", transition: "all 0.3s" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "62px" }}>
        <button onClick={() => setPage("home")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 300, color: t.text }}>Nexalie</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.gold }}>STUDIO</span>
        </button>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: "2px" }} className="desktop-nav">
          {navItems.map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} style={{ padding: "8px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: page === id ? t.text : t.muted, borderBottom: `2px solid ${page === id ? t.accent : "transparent"}`, transition: "all 0.2s", fontWeight: page === id ? "600" : "400" }}>{label}</button>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {/* Toggle mode */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden" }}>
            {[["fr", "🇫🇷"], ["af", "🌍"]].map(([m, flag]) => (
              <button key={m} onClick={() => setMode(m)} style={{ padding: "7px 12px", background: mode === m ? t.accent : "transparent", border: "none", color: mode === m ? t.btnText : t.muted, fontSize: "13px", fontWeight: mode === m ? "700" : "400", cursor: "pointer", transition: "all 0.3s" }}>{flag}</button>
            ))}
          </div>
          <button onClick={() => setPage("audit")} style={{ padding: "9px 20px", background: t.btn, border: "none", borderRadius: "8px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", transition: "all 0.3s" }}>Audit gratuit →</button>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════════════
function HomePage({ setPage }) {
  const { mode, t } = useContext(Ctx);

  return (
    <div>
      {/* HERO */}
      <div style={{ minHeight: "90vh", display: "flex", alignItems: "center", padding: "60px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px", borderRadius: "50%", background: `radial-gradient(circle, ${t.accent}08, transparent 70%)`, pointerEvents: "none" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center", width: "100%" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${t.accent}12`, border: `1px solid ${t.accent}30`, borderRadius: "20px", padding: "6px 16px", marginBottom: "24px" }}>
              <span style={{ fontSize: "10px", fontFamily: "monospace", letterSpacing: "1.5px", color: t.accent }}>✨ {t.hero}</span>
            </div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(30px,5vw,54px)", fontWeight: 200, color: t.text, lineHeight: 1.2, marginBottom: "20px" }}>
              Votre entreprise mérite<br /><em style={{ color: t.accent }}>l'excellence</em> digitale
            </h1>
            <p style={{ fontSize: "16px", color: t.muted, lineHeight: 1.8, marginBottom: "28px", maxWidth: "460px", fontFamily: "sans-serif" }}>
              Audit gratuit · Accompagnement mensuel · Outils IA propriétaires — tout pour transformer votre business.
            </p>
            {mode === "af" && (
              <div style={{ display: "flex", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
                {["🇫🇷 Français", "🇨🇬 Lingala", "Kitouba", "🇬🇧 English"].map(l => (
                  <span key={l} style={{ padding: "4px 10px", background: `${t.gold}15`, border: `1px solid ${t.gold}25`, borderRadius: "20px", fontSize: "11px", color: t.gold }}>{l}</span>
                ))}
              </div>
            )}
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button onClick={() => setPage("audit")} style={{ padding: "15px 30px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "15px", fontWeight: "700", cursor: "pointer", boxShadow: `0 8px 24px ${t.accent}30` }}>
                Audit gratuit →
              </button>
              <button onClick={() => setPage("offers")} style={{ padding: "15px 28px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "15px", cursor: "pointer", opacity: 0.8 }}>
                Nos offres
              </button>
            </div>
          </div>

          {/* Score card preview */}
          <div style={{ background: t.card, border: `1px solid ${t.accent}25`, borderRadius: "20px", padding: "28px" }}>
            <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: t.muted, marginBottom: "20px" }}>MATURITÉ DIGITALE — EXEMPLE</p>
            {[["◈", "Stratégie & Vision", t.accent, 65], ["◉", "Expérience Client", t.gold, 45], ["◐", "Opérations", "#7B5EA7", 30], ["◎", "Technologies", "#C0627A", 55], ["◑", "Culture & Équipes", t.accent, 40]].map(([icon, label, color, pct]) => (
              <div key={label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <span style={{ fontSize: "12px", color: t.muted }}><span style={{ color, marginRight: "6px" }}>{icon}</span>{label}</span>
                  <span style={{ fontFamily: "monospace", fontSize: "10px", color }}>{pct}/20</span>
                </div>
                <div style={{ height: "5px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ width: `${pct * 5}%`, height: "100%", background: color, borderRadius: "3px", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
            <button onClick={() => setPage("audit")} style={{ width: "100%", marginTop: "8px", padding: "12px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", letterSpacing: "1px" }}>
              DÉMARRER MON AUDIT GRATUIT
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ borderTop: `1px solid ${t.divider}`, borderBottom: `1px solid ${t.divider}`, padding: "28px 24px", background: `${t.accent}04` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "16px" }}>
          {[["5", "Offres d'accompagnement"], ["🌍", "Congo · CI · France"], ["20 min", "Audit gratuit"], ["48h", "Rapport personnalisé"]].map(([v, l]) => (
            <div key={l} style={{ textAlign: "center", padding: "16px" }}>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: t.accent, marginBottom: "4px" }}>{v}</p>
              <p style={{ fontSize: "12px", color: t.muted, fontFamily: "sans-serif" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Platform teaser */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME SaaS</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,32px)", fontWeight: 200, color: t.text, marginBottom: "16px" }}>
              8 outils IA pour <em style={{ color: t.accent }}>transformer votre business</em>
            </h2>
            <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.8, marginBottom: "20px", fontFamily: "sans-serif" }}>
              Business plan, roadmap, veille concurrentielle, cahier des charges… Générez en 2 minutes ce qui prend des jours.
            </p>
            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
              <Tag color={t.accent}>Gratuit</Tag>
              <Tag color={t.gold}>29€/mois Premium</Tag>
            </div>
            <button onClick={() => setPage("platform")} style={{ padding: "12px 24px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              Découvrir la plateforme →
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            {[["📊", "Audit Digital", "Gratuit", t.accent], ["💰", "Calculateur ROI", "Gratuit", t.accent], ["🤖", "Maquette IA", "Gratuit", t.accent], ["📋", "Business Plan IA", "Premium", t.gold], ["🗺️", "Roadmap 12 mois", "Premium", t.gold], ["🔍", "Veille Concurrentielle", "Premium", t.gold], ["📄", "Cahier des Charges", "Premium", t.gold], ["💸", "Simulateur Budget", "Premium", t.gold]].map(([e, n, p, c]) => (
              <div key={n} style={{ padding: "14px", background: `${c}06`, border: `1px solid ${c}18`, borderRadius: "10px" }}>
                <span style={{ fontSize: "18px", display: "block", marginBottom: "5px" }}>{e}</span>
                <p style={{ fontSize: "12px", fontWeight: "600", color: t.text, marginBottom: "2px", fontFamily: "sans-serif" }}>{n}</p>
                <p style={{ fontSize: "10px", color: c, fontFamily: "monospace" }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* About teaser */}
      <div style={{ padding: "60px 24px", background: `${t.accent}03`, borderTop: `1px solid ${t.divider}` }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,34px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
            Un pont entre <em style={{ color: t.accent }}>deux mondes</em>
          </h2>
          <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.8, marginBottom: "20px", fontFamily: "sans-serif" }}>
            Relia Ebiya — Chef de Projet Digital avec 10+ ans d'expérience en France. Double culture, double expertise.
          </p>
          <button onClick={() => setPage("about")} style={{ padding: "12px 24px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.muted, fontSize: "13px", cursor: "pointer" }}>
            Découvrir Relia →
          </button>
        </div>
      </div>

      {/* CTA Final */}
      <div style={{ padding: "72px 24px" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto", textAlign: "center", padding: "48px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: "24px" }}>
          <span style={{ fontSize: "40px", display: "block", marginBottom: "16px" }}>🚀</span>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px,4vw,36px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
            Votre transformation digitale <em style={{ color: t.accent }}>commence aujourd'hui</em>
          </h2>
          <p style={{ fontSize: "15px", color: t.muted, marginBottom: "28px", lineHeight: 1.7, fontFamily: "sans-serif" }}>Audit gratuit en 20 minutes. Plan d'action personnalisé. Accompagnement adapté.</p>
          <button onClick={() => setPage("audit")} style={{ padding: "16px 40px", background: t.btn, border: "none", borderRadius: "12px", color: t.btnText, fontSize: "16px", fontWeight: "700", cursor: "pointer", boxShadow: `0 8px 30px ${t.accent}30` }}>
            Je fais mon audit gratuit →
          </button>
          <p style={{ fontSize: "12px", color: t.muted, marginTop: "12px", fontFamily: "sans-serif" }}>📱 WhatsApp : +33 7 86 62 04 09</p>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: `1px solid ${t.divider}`, padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "32px", marginBottom: "32px" }}>
            <div>
              <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text, marginBottom: "8px" }}>Nexalie <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.gold }}>STUDIO</span></p>
              <p style={{ fontSize: "13px", color: t.muted, lineHeight: 1.7, fontFamily: "sans-serif", maxWidth: "260px" }}>L'expertise digitale française au service des entreprises africaines.</p>
            </div>
            {[["Services", ["Consulting", "Création Web", "Formation IA", "Audit Digital", "Plateforme SaaS"]], ["Entreprise", ["À propos", "Portfolio", "Contact", "Tarifs"]], ["Légal", ["Mentions légales", "CGV", "Confidentialité"]]].map(([title, links]) => (
              <div key={title}>
                <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: t.muted, marginBottom: "12px" }}>{String(title).toUpperCase()}</p>
                {(links as string[]).map(l => <p key={l} style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "6px", cursor: "pointer" }}>{l}</p>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${t.divider}`, paddingTop: "20px", display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontSize: "12px", color: t.muted, fontFamily: "monospace" }}>© 2026 Nexalie Studio · relia.ebiya@gmail.com</p>
            <p style={{ fontSize: "12px", color: t.accent, fontFamily: "monospace" }}>nexali.ai</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// AUDIT PAGE — FULL INTEGRATION
// ═══════════════════════════════════════════════════════════════
const AUDIT_DIMS = [
  { id: "strategie", icon: "◈", label: "Stratégie & Vision", color: "#E8C547", questions: ["La direction a-t-elle défini une vision digitale claire ?", "Existe-t-il un budget dédié à la transformation digitale ?", "Les objectifs digitaux sont-ils mesurés avec des KPIs ?", "La direction participe-t-elle activement aux initiatives digitales ?"] },
  { id: "client", icon: "◉", label: "Expérience Client", color: "#4EC9B0", questions: ["Vos clients peuvent-ils vous contacter ou commander en ligne ?", "Collectez-vous les retours clients digitalement ?", "Proposez-vous des communications personnalisées ?", "Votre présence en ligne reflète-t-elle votre image professionnelle ?"] },
  { id: "operations", icon: "◐", label: "Opérations & Processus", color: "#C586C0", questions: ["Vos processus clés (facturation, devis) sont-ils digitalisés ?", "Utilisez-vous des outils de gestion de projet digital ?", "Certaines tâches répétitives sont-elles automatisées ?", "Vos données sont-elles centralisées et accessibles ?"] },
  { id: "technologie", icon: "◎", label: "Technologies & Outils", color: "#569CD6", questions: ["Utilisez-vous un logiciel de gestion (ERP, CRM) ?", "Vos données sont-elles sauvegardées dans le cloud ?", "Vos équipes ont-elles accès aux outils collaboratifs ?", "Disposez-vous de tableaux de bord analytiques ?"] },
  { id: "culture", icon: "◑", label: "Culture & Compétences", color: "#CE9178", questions: ["Vos équipes sont-elles formées aux outils digitaux ?", "L'innovation digitale est-elle encouragée dans l'entreprise ?", "Disposez-vous d'une feuille de route digitale ?", "Le changement digital est-il bien accepté par les équipes ?"] },
];

const AUDIT_OPTS = [
  { value: 5, label: "Oui, totalement" },
  { value: 3, label: "Partiellement" },
  { value: 1, label: "Pas vraiment" },
  { value: 0, label: "Non, pas du tout" },
];

function AuditPage({ setPage }) {
  const { t } = useContext(Ctx);
  const [step, setStep] = useState(0); // 0 = intro, 1-5 = dimensions, 6 = results
  const [answers, setAnswers] = useState({});
  const [company, setCompany] = useState({ name: "", sector: "", country: "" });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const totalDims = AUDIT_DIMS.length;
  const currentDim = AUDIT_DIMS[step - 1];

  const setAnswer = (dimId, qIdx, value) => {
    setAnswers(prev => ({ ...prev, [`${dimId}_${qIdx}`]: value }));
  };

  const dimScore = (dimId) => {
    const dim = AUDIT_DIMS.find(d => d.id === dimId);
    return dim.questions.reduce((sum, _, i) => sum + (answers[`${dimId}_${i}`] ?? 0), 0);
  };

  const totalScore = () => AUDIT_DIMS.reduce((sum, d) => sum + dimScore(d.id), 0);

  const isStepComplete = () => {
    if (step === 0) return company.name && company.sector;
    const dim = AUDIT_DIMS[step - 1];
    return dim.questions.every((_, i) => answers[`${dim.id}_${i}`] !== undefined);
  };

  const getLevel = (score) => {
    if (score < 20) return { label: "Initiale", color: "#C0627A", pack: "Pack Démarrage" };
    if (score < 40) return { label: "Émergente", color: "#CE9178", pack: "Pack Transformation" };
    if (score < 60) return { label: "Structurée", color: "#C9A84C", pack: "Pack Automatisation IA" };
    if (score < 80) return { label: "Optimisée", color: "#4EC9B0", pack: "Pack Excellence" };
    return { label: "Leader", color: "#7B5EA7", pack: "Accompagnement sur mesure" };
  };

  const generateReport = async () => {
    setLoading(true);
    const score = totalScore();
    const level = getLevel(score);
    const dimScores = AUDIT_DIMS.map(d => ({ label: d.label, score: dimScore(d.id), max: 20 }));

    const SYSTEM = `Tu es l'expert en transformation digitale de Nexalie Studio. Génère un rapport d'audit concis en JSON strict (sans backticks).
Format: {"strengths":["force 1","force 2","force 3"],"weaknesses":["faiblesse 1","faiblesse 2","faiblesse 3"],"priorities":["priorité 1","priorité 2","priorité 3"],"quickWins":["action rapide 1","action rapide 2"],"recommendation":"recommandation personnalisée 2 phrases"}`;

    let text = "";
    try {
      await callClaude(SYSTEM, `Entreprise: ${company.name}, Secteur: ${company.sector}, Score: ${score}/100, Niveau: ${level.label}, Scores par dimension: ${dimScores.map(d => `${d.label}: ${d.score}/20`).join(", ")}`, chunk => { text += chunk; });
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setReport({ ...parsed, score, level, dimScores, company });
      setStep(6);
    } catch (e) {
      // Fallback report without AI
      setReport({ score, level, dimScores, company, strengths: ["Démarche d'audit proactive"], weaknesses: ["Plusieurs axes à améliorer"], priorities: ["Définir une stratégie digitale", "Former les équipes", "Automatiser les processus clés"], quickWins: ["Créer une présence Google My Business", "Mettre en place un outil de gestion"], recommendation: `Votre score de ${score}/100 indique un niveau ${level.label}. ${level.pack} est recommandé pour votre situation.` });
      setStep(6);
    }
    setLoading(false);
  };

  if (step === 6 && report) {
    return (
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "12px" }}>AUDIT TERMINÉ</p>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "100px", height: "100px", borderRadius: "50%", background: `${report.level.color}15`, border: `2px solid ${report.level.color}40`, marginBottom: "16px" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: report.level.color }}>{report.score}</span>
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.text, marginBottom: "4px" }}>{report.company.name}</p>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: report.level.color }}>Niveau {report.level.label} · {report.score}/100</p>
        </div>

        {/* Dimension bars */}
        <div style={{ padding: "24px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "16px", marginBottom: "20px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: t.muted, marginBottom: "16px" }}>SCORES PAR DIMENSION</p>
          {report.dimScores.map((d, i) => (
            <div key={d.label} style={{ marginBottom: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "13px", color: t.text, fontFamily: "sans-serif" }}>{AUDIT_DIMS[i].icon} {d.label}</span>
                <span style={{ fontFamily: "monospace", fontSize: "11px", color: AUDIT_DIMS[i].color }}>{d.score}/{d.max}</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${(d.score / d.max) * 100}%`, height: "100%", background: AUDIT_DIMS[i].color, borderRadius: "3px" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "20px" }}>
          {[["✅ Points forts", report.strengths, "#4EC9B0"], ["⚠️ Axes d'amélioration", report.weaknesses, "#C0627A"]].map(([title, items, color]) => (
            <div key={String(title)} style={{ padding: "20px", background: `${color}06`, border: `1px solid ${color}20`, borderRadius: "14px" }}>
              <p style={{ fontFamily: "monospace", fontSize: "10px", color: color as string, letterSpacing: "1px", marginBottom: "12px" }}>{String(title).toUpperCase()}</p>
              {(items as string[]).map((item, i) => (
                <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: color as string, fontSize: "12px", flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Recommendation */}
        <div style={{ padding: "24px", background: `${t.gold}08`, border: `1px solid ${t.gold}25`, borderRadius: "16px", marginBottom: "24px" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: t.gold, marginBottom: "8px" }}>RECOMMANDATION NEXALIE</p>
          <p style={{ fontSize: "14px", color: t.text, lineHeight: 1.7, fontFamily: "sans-serif", marginBottom: "12px" }}>{report.recommendation}</p>
          <p style={{ fontFamily: "monospace", fontSize: "11px", color: t.gold }}>Pack recommandé : {report.level.pack}</p>
        </div>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => setPage("offers")} style={{ padding: "14px 28px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            Voir les offres d'accompagnement →
          </button>
          <button onClick={() => setPage("contact")} style={{ padding: "14px 28px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "14px", cursor: "pointer" }}>
            Parler à Relia
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Progress */}
      {step > 0 && (
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: t.muted }}>DIMENSION {step}/{totalDims}</span>
            <span style={{ fontFamily: "monospace", fontSize: "10px", color: t.accent }}>{Math.round((step / (totalDims + 1)) * 100)}%</span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px" }}>
            <div style={{ width: `${(step / (totalDims + 1)) * 100}%`, height: "100%", background: t.accent, borderRadius: "2px", transition: "width 0.3s" }} />
          </div>
        </div>
      )}

      {/* Step 0 — Intro */}
      {step === 0 && (
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>OUTIL GRATUIT</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "12px" }}>
            Audit de <em style={{ color: t.accent }}>maturité digitale</em>
          </h1>
          <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.7, marginBottom: "32px", fontFamily: "sans-serif" }}>
            20 questions · 5 dimensions · Score sur 100 · Rapport personnalisé par IA
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
            {[["Nom de votre entreprise", "name", "text", "Ex: Restaurant Mama Africa"], ["Secteur d'activité", "sector", "text", "Ex: Commerce, BTP, Services..."], ["Pays / Ville", "country", "text", "Ex: Abidjan, Paris, Brazzaville..."]].map(([label, key, type, ph]) => (
              <div key={key}>
                <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "6px" }}>{String(label).toUpperCase()}</label>
                <input value={company[key]} onChange={e => setCompany(p => ({ ...p, [key]: e.target.value }))} placeholder={ph as string} type={type as string}
                  style={{ width: "100%", padding: "12px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "14px", fontFamily: "sans-serif", outline: "none" }} />
              </div>
            ))}
          </div>
          <button onClick={() => setStep(1)} disabled={!isStepComplete()}
            style={{ width: "100%", padding: "15px", background: isStepComplete() ? t.btn : "rgba(255,255,255,0.05)", border: "none", borderRadius: "12px", color: isStepComplete() ? t.btnText : t.muted, fontSize: "15px", fontWeight: "700", cursor: isStepComplete() ? "pointer" : "default" }}>
            Démarrer l'audit →
          </button>
        </div>
      )}

      {/* Steps 1-5 — Dimensions */}
      {step >= 1 && step <= 5 && currentDim && (
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
            <span style={{ fontSize: "28px", color: currentDim.color }}>{currentDim.icon}</span>
            <div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", fontWeight: 200, color: t.text }}>{currentDim.label}</h2>
              <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>{step}/{totalDims} — 4 questions</p>
            </div>
          </div>

          {currentDim.questions.map((q, i) => (
            <div key={i} style={{ marginBottom: "24px", padding: "20px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "14px" }}>
              <p style={{ fontSize: "14px", color: t.text, lineHeight: 1.6, marginBottom: "14px", fontFamily: "sans-serif" }}>{i + 1}. {q}</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                {AUDIT_OPTS.map(opt => (
                  <button key={opt.value} onClick={() => setAnswer(currentDim.id, i, opt.value)}
                    style={{ padding: "10px 14px", background: answers[`${currentDim.id}_${i}`] === opt.value ? `${currentDim.color}20` : "transparent", border: `1px solid ${answers[`${currentDim.id}_${i}`] === opt.value ? currentDim.color : t.border}`, borderRadius: "8px", color: answers[`${currentDim.id}_${i}`] === opt.value ? currentDim.color : t.muted, fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif", textAlign: "left", transition: "all 0.15s" }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={() => setStep(step - 1)} style={{ padding: "12px 20px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "10px", color: t.muted, fontSize: "14px", cursor: "pointer" }}>← Retour</button>
            <button onClick={() => step === totalDims ? generateReport() : setStep(step + 1)} disabled={!isStepComplete()}
              style={{ flex: 1, padding: "12px", background: isStepComplete() ? t.btn : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: isStepComplete() ? t.btnText : t.muted, fontSize: "14px", fontWeight: "700", cursor: isStepComplete() ? "pointer" : "default" }}>
              {loading ? "Génération du rapport..." : step === totalDims ? "Obtenir mon rapport →" : "Dimension suivante →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAQUETTE GENERATOR — FULL INTEGRATION
// ═══════════════════════════════════════════════════════════════
const SECTORS_M = ["Commerce & Retail", "Restaurant & Traiteur", "BTP & Immobilier", "Santé & Bien-être", "Services aux entreprises", "Éducation & Formation", "Tourisme & Hôtellerie", "Finance & Assurance", "Mode & Beauté", "Tech & Digital", "Artisanat & Art", "ONG & Association"];
const STYLES_M = [{ id: "moderne", l: "Moderne & Épuré" }, { id: "luxe", l: "Luxe & Premium" }, { id: "chaleureux", l: "Chaleureux & Convivial" }, { id: "africain", l: "Africain & Moderne" }, { id: "tech", l: "Tech & Futuriste" }, { id: "corporate", l: "Corporate & Pro" }];
const PALETTES_M = [
  { id: "ocean", name: "Océan", colors: ["#0A1628", "#4EC9B0", "#C9A84C"] },
  { id: "sunset", name: "Sunset Afrique", colors: ["#1A0800", "#E88C32", "#F5C842"] },
  { id: "forest", name: "Forêt", colors: ["#0A1A0A", "#4A7C59", "#A8D5A2"] },
  { id: "royal", name: "Royal", colors: ["#0D0A1E", "#7B5EA7", "#E8C547"] },
  { id: "rose", name: "Rose & Or", colors: ["#FDF6F0", "#C0627A", "#C9A84C"] },
  { id: "slate", name: "Ardoise", colors: ["#1E2A3A", "#5B8DB8", "#E8E8E8"] },
];

const SYSTEM_MOCKUP = `Tu es l'IA de Nexalie Studio, spécialisée en maquettes de sites web. Génère en JSON strict (sans backticks, sans markdown).
Format EXACT:
{"siteName":"Nom","tagline":"Slogan 1 phrase","heroTitle":"Titre max 8 mots","heroSubtitle":"Sous-titre 1-2 phrases","heroCTA":"Texte bouton","sections":[{"title":"Titre","content":"2-3 phrases","type":"about|services|gallery|testimonials|contact|stats"}],"services":["Service 1","Service 2","Service 3","Service 4"],"stats":[{"value":"10+","label":"Label"},{"value":"150","label":"Label"},{"value":"98%","label":"Label"}],"testimonial":{"text":"Témoignage fictif crédible","name":"Prénom Nom","role":"Titre, Entreprise"},"footerTagline":"Phrase de conclusion"}
Sois créatif et professionnel. JSON uniquement.`;

function MaquettePage() {
  const { t } = useContext(Ctx);
  const [form, setForm] = useState({ companyName: "", sector: "", style: "moderne", palette: "ocean", description: "", pages: ["Accueil", "Services", "Contact"] });
  const [loading, setLoading] = useState(false);
  const [mockup, setMockup] = useState(null);
  const pal = PALETTES_M.find(p => p.id === form.palette) || PALETTES_M[0];

  const generate = async () => {
    setLoading(true); setMockup(null);
    let text = "";
    try {
      await callClaude(SYSTEM_MOCKUP, `Secteur: ${form.sector}, Style: ${form.style}, Palette: ${form.palette}, Entreprise: ${form.companyName || "Mon Entreprise"}, Description: ${form.description}, Pages: ${form.pages.join(", ")}`, chunk => { text += chunk; });
      const clean = text.replace(/```json|```/g, "").trim();
      setMockup(JSON.parse(clean));
    } catch (e) {
      setMockup({ siteName: form.companyName || "Mon Entreprise", tagline: "Excellence & Innovation", heroTitle: "Bienvenue", heroSubtitle: "Description de votre entreprise ici.", heroCTA: "En savoir plus", sections: [{ title: "À propos", content: "Nous sommes une entreprise engagée.", type: "about" }, { title: "Nos Services", content: "Découvrez notre gamme de services.", type: "services" }], services: ["Service 1", "Service 2", "Service 3", "Service 4"], stats: [{ value: "10+", label: "Années" }, { value: "500+", label: "Clients" }, { value: "99%", label: "Satisfaction" }], testimonial: { text: "Excellent service, je recommande vivement.", name: "Jean Dupont", role: "Directeur, Entreprise XYZ" }, footerTagline: "L'excellence à votre service." });
    }
    setLoading(false);
  };

  const togglePage = (page) => setForm(p => ({ ...p, pages: p.pages.includes(page) ? p.pages.filter(x => x !== page) : [...p.pages, page] }));

  if (mockup) {
    const [bg, accent, sec] = pal.colors;
    const isDark = bg.startsWith("#0") || bg.startsWith("#1");
    const textC = isDark ? "#fff" : "#111";
    const mutedC = isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)";

    return (
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "4px" }}>MAQUETTE GÉNÉRÉE PAR IA</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "24px", fontWeight: 200, color: t.text }}>{mockup.siteName}</h2>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={() => setMockup(null)} style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${t.border}`, borderRadius: "8px", color: t.muted, fontSize: "12px", cursor: "pointer" }}>↺ Nouvelle maquette</button>
            <button onClick={generate} style={{ padding: "9px 16px", background: `${t.accent}15`, border: `1px solid ${t.accent}30`, borderRadius: "8px", color: t.accent, fontSize: "12px", cursor: "pointer" }}>↻ Regénérer</button>
          </div>
        </div>

        {/* Mockup preview */}
        <div style={{ border: `1px solid ${t.border}`, borderRadius: "16px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.4)" }}>
          {/* Browser bar */}
          <div style={{ background: "#1a1a2e", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ display: "flex", gap: "5px" }}>
              {["#FF5F57", "#FEBC2E", "#28C840"].map(c => <div key={c} style={{ width: "11px", height: "11px", borderRadius: "50%", background: c }} />)}
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.08)", borderRadius: "6px", padding: "4px 12px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>
              www.{(mockup.siteName || "monsite").toLowerCase().replace(/\s/g, "")}.com
            </div>
          </div>

          {/* Site preview */}
          <div style={{ background: bg }}>
            {/* Nav */}
            <div style={{ padding: "0 32px", borderBottom: `1px solid ${accent}20`, display: "flex", alignItems: "center", justifyContent: "space-between", height: "54px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", fontWeight: 200, color: textC }}>{mockup.siteName}</span>
              <div style={{ display: "flex", gap: "20px" }}>
                {form.pages.slice(0, 4).map(p => <span key={p} style={{ fontSize: "12px", color: mutedC, fontFamily: "sans-serif", cursor: "pointer" }}>{p}</span>)}
              </div>
              <button style={{ padding: "8px 16px", background: accent, border: "none", borderRadius: "6px", color: isDark ? "#000" : "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Contact</button>
            </div>

            {/* Hero */}
            <div style={{ padding: "72px 32px", textAlign: "center", background: `radial-gradient(ellipse at center, ${accent}10, transparent 70%)` }}>
              <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "3px", color: accent, marginBottom: "14px" }}>{mockup.tagline?.toUpperCase()}</p>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4vw, 48px)", fontWeight: 200, color: textC, lineHeight: 1.2, marginBottom: "16px" }}>{mockup.heroTitle}</h1>
              <p style={{ fontSize: "15px", color: mutedC, maxWidth: "500px", margin: "0 auto 28px", lineHeight: 1.7, fontFamily: "sans-serif" }}>{mockup.heroSubtitle}</p>
              <button style={{ padding: "14px 28px", background: accent, border: "none", borderRadius: "10px", color: isDark ? "#000" : "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>{mockup.heroCTA} →</button>
            </div>

            {/* Stats */}
            <div style={{ display: "flex", justifyContent: "center", gap: "48px", padding: "32px", borderTop: `1px solid ${accent}15`, borderBottom: `1px solid ${accent}15` }}>
              {mockup.stats?.map((s, i) => (
                <div key={i} style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: accent, marginBottom: "4px" }}>{s.value}</p>
                  <p style={{ fontSize: "12px", color: mutedC, fontFamily: "sans-serif" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Services */}
            <div style={{ padding: "48px 32px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 200, color: textC, textAlign: "center", marginBottom: "28px" }}>Nos services</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
                {mockup.services?.map((s, i) => (
                  <div key={i} style={{ padding: "20px", background: `${accent}08`, border: `1px solid ${accent}20`, borderRadius: "12px", textAlign: "center" }}>
                    <p style={{ fontSize: "24px", marginBottom: "8px" }}>{"🌐📱🎨💡"[i] || "⭐"}</p>
                    <p style={{ fontSize: "13px", color: textC, fontFamily: "sans-serif", fontWeight: "600" }}>{s}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonial */}
            {mockup.testimonial && (
              <div style={{ padding: "48px 32px", background: `${accent}05` }}>
                <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center" }}>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 200, color: textC, lineHeight: 1.7, marginBottom: "16px", fontStyle: "italic" }}>"{mockup.testimonial.text}"</p>
                  <p style={{ fontSize: "13px", color: accent, fontFamily: "monospace" }}>— {mockup.testimonial.name}, {mockup.testimonial.role}</p>
                </div>
              </div>
            )}

            {/* Footer */}
            <div style={{ padding: "24px 32px", borderTop: `1px solid ${accent}15`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: mutedC }}>{mockup.siteName}</span>
              <span style={{ fontSize: "12px", color: mutedC, fontFamily: "sans-serif" }}>{mockup.footerTagline}</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "24px", textAlign: "center" }}>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "16px" }}>
            Cette maquette vous plaît ? Relia peut créer votre vrai site en 2-3 semaines.
          </p>
          <button onClick={() => window.open("https://wa.me/33786620409?text=Bonjour%20Relia%2C%20j'ai%20généré%20une%20maquette%20sur%20Nexali%20et%20je%20voudrais%20en%20discuter.", "_blank")}
            style={{ padding: "13px 28px", background: "#25D366", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
            💬 Contacter Relia sur WhatsApp →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>OUTIL GRATUIT</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Générateur de <em style={{ color: t.accent }}>maquette IA</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.7, marginBottom: "32px", fontFamily: "sans-serif" }}>
        Décrivez votre projet — l'IA génère la maquette de votre site en 2 minutes.
      </p>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "6px" }}>NOM DE L'ENTREPRISE</label>
            <input value={form.companyName} onChange={e => setForm(p => ({ ...p, companyName: e.target.value }))} placeholder="Ex: Restaurant Mama Africa"
              style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "13px", fontFamily: "sans-serif", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "6px" }}>SECTEUR *</label>
            <select value={form.sector} onChange={e => setForm(p => ({ ...p, sector: e.target.value }))}
              style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${form.sector ? t.accent + "40" : t.border}`, borderRadius: "10px", color: form.sector ? t.text : t.muted, fontSize: "13px", fontFamily: "sans-serif", cursor: "pointer" }}>
              <option value="">Choisir...</option>
              {SECTORS_M.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "8px" }}>STYLE VISUEL</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {STYLES_M.map(s => (
              <button key={s.id} onClick={() => setForm(p => ({ ...p, style: s.id }))}
                style={{ padding: "10px", background: form.style === s.id ? `${t.accent}15` : t.card, border: `1px solid ${form.style === s.id ? t.accent : t.border}`, borderRadius: "8px", color: form.style === s.id ? t.accent : t.muted, fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif" }}>
                {s.l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "8px" }}>PALETTE DE COULEURS</label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "8px" }}>
            {PALETTES_M.map(p => (
              <button key={p.id} onClick={() => setForm(f => ({ ...f, palette: p.id }))}
                style={{ padding: "10px 12px", background: form.palette === p.id ? `${t.accent}10` : t.card, border: `1px solid ${form.palette === p.id ? t.accent : t.border}`, borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ display: "flex", gap: "3px" }}>
                  {p.colors.map(c => <div key={c} style={{ width: "12px", height: "12px", borderRadius: "50%", background: c }} />)}
                </div>
                <span style={{ fontSize: "11px", color: form.palette === p.id ? t.accent : t.muted, fontFamily: "sans-serif" }}>{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "6px" }}>DÉCRIVEZ VOTRE PROJET *</label>
          <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} rows={3} placeholder="Décrivez votre activité, vos clients, ce qui vous différencie..."
            style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "10px", color: t.text, fontSize: "13px", resize: "vertical", fontFamily: "sans-serif", lineHeight: 1.6, outline: "none" }} />
        </div>

        <button onClick={generate} disabled={!form.sector || !form.description || loading}
          style={{ width: "100%", padding: "15px", background: form.sector && form.description && !loading ? t.btn : "rgba(255,255,255,0.05)", border: "none", borderRadius: "12px", color: form.sector && form.description && !loading ? t.btnText : t.muted, fontSize: "15px", fontWeight: "700", cursor: form.sector && form.description && !loading ? "pointer" : "default" }}>
          {loading ? "⏳ Génération en cours..." : "🤖 Générer ma maquette →"}
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// OFFERS PAGE
// ═══════════════════════════════════════════════════════════════
function OffersPage({ setPage }) {
  const { t } = useContext(Ctx);
  const offers = [
    { emoji: "🌱", name: "Pack Démarrage", audit: "500€", monthly: "400€/mois", min: "3 mois", score: "0–19", color: t.accent, items: ["Audit initial + rapport", "1 session mensuelle Zoom (1h)", "Roadmap digitale personnalisée", "Suivi KPIs mensuel", "Support WhatsApp"] },
    { emoji: "🌿", name: "Pack Transformation", audit: "700€", monthly: "600€/mois", min: "6 mois", score: "20–39", color: t.gold, items: ["Tout le Pack Démarrage", "2 sessions mensuelles (1h30)", "Stratégie digitale complète", "Formation équipe (2h/mois)", "Tableau de bord KPIs dédié"] },
    { emoji: "🌳", name: "Pack Automatisation IA", audit: "1 200€", monthly: "800€/mois", min: "6 mois", score: "40–59", color: "#7B5EA7", badge: "POPULAIRE", items: ["Tout le Pack Transformation", "Automatisation processus (Make/Zapier)", "Déploiement outils IA équipe", "3 sessions mensuelles", "Accès Plateforme Premium inclus"] },
    { emoji: "🚀", name: "Pack Excellence", audit: "1 500€", monthly: "1 200€/mois", min: "12 mois", score: "60–79", color: "#C0627A", items: ["Tout le Pack Automatisation", "Accompagnement stratégique avancé", "Présentiel possible (France/Afrique)", "Sessions illimitées", "Réseau partenaires Nexalie"] },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>ACCOMPAGNEMENT CONSULTING</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Nos offres <em style={{ color: t.accent }}>d'accompagnement</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "40px", fontFamily: "sans-serif", maxWidth: "500px", lineHeight: 1.7 }}>
        Choisissez selon votre score d'audit. Vous ne savez pas encore ? <span onClick={() => setPage("audit")} style={{ color: t.accent, cursor: "pointer" }}>Faites l'audit gratuit →</span>
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px", marginBottom: "32px" }}>
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
            {o.items.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
                <span style={{ color: o.color, fontSize: "12px" }}>✓</span>
                <span style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
              </div>
            ))}
            <button onClick={() => setPage("contact")} style={{ width: "100%", marginTop: "16px", padding: "11px", background: `${o.color}15`, border: `1px solid ${o.color}30`, borderRadius: "9px", color: o.color, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              Démarrer ce pack →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════════════════════════════
function ServicesPage({ setPage }) {
  const { mode, t } = useContext(Ctx);
  const p = PRICES[mode];

  const services = [
    { emoji: "🌐", name: "Site Web Vitrine", price: p.vitrine, delay: "2-3 semaines", color: t.accent, items: ["5 pages personnalisées", "Design sur mesure", "Mobile-friendly", "SEO de base", "Formulaire contact", "Google Analytics"] },
    { emoji: "📄", name: "One-Page", price: p.onepage, delay: "5-7 jours", color: t.gold, badge: "⚡ RAPIDE", items: ["1 page longue complète", "Sections Hero+Services+Contact", "Mobile-friendly", "Livraison express"] },
    { emoji: "🛒", name: "E-Commerce", price: p.ecommerce, delay: "4-6 semaines", color: "#C586C0", items: ["Catalogue illimité", "Paiement Stripe", "Mobile Money (Afrique)", "Tableau de bord vendeur", "Emails automatiques"] },
    { emoji: "🎯", name: "Landing Page", price: p.landing, delay: "1 semaine", color: "#CE9178", items: ["Design orienté conversion", "Formulaire de capture", "Analytics avancés", "CTA optimisés"] },
    { emoji: "🎨", name: "Identité Visuelle", price: p.identite, delay: "1-2 semaines", color: "#4A7C59", items: ["Logo (3 propositions)", "Palette de couleurs", "Charte graphique PDF", "Fichiers sources AI/SVG"] },
    { emoji: "🔄", name: "Refonte Site", price: p.refonte, delay: "2-3 semaines", color: "#569CD6", items: ["Audit site existant", "Nouveau design moderne", "Migration contenus", "SEO optimisé"] },
    { emoji: "🛠️", name: "Maintenance", price: p.maintenance, delay: "3 mois min", color: "#C586C0", badge: "🔁 RÉCURRENT", items: ["Mises à jour", "Sauvegardes hebdo", "2h modifications/mois", "Support WhatsApp"] },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "36px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>CRÉATION WEB & IDENTITÉ</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
            Sites web <em style={{ color: t.accent }}>professionnels</em>
          </h1>
          <p style={{ fontSize: "14px", color: t.muted, fontFamily: "sans-serif" }}>Tarifs {mode === "af" ? "adaptés Afrique" : "marché français"} · Livraison rapide</p>
        </div>
        <button onClick={() => setPage("maquette")} style={{ padding: "12px 22px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
          🤖 Générer ma maquette →
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px" }}>
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

// ═══════════════════════════════════════════════════════════════
// PLATFORM PAGE
// ═══════════════════════════════════════════════════════════════
function PlatformPage({ setPage }) {
  const { t } = useContext(Ctx);
  const tools = [
    { emoji: "📊", name: "Audit Digital", desc: "Évaluez votre maturité digitale en 20 min", free: true, color: t.accent, page: "audit" },
    { emoji: "💰", name: "Calculateur ROI", desc: "Calculez le retour sur investissement", free: true, color: t.accent, page: "platform" },
    { emoji: "🤖", name: "Maquette IA", desc: "Visualisez votre site en 2 minutes", free: true, color: t.accent, page: "maquette" },
    { emoji: "📋", name: "Business Plan IA", desc: "Générez un plan complet avec benchmark", free: false, color: t.gold, page: "pricing" },
    { emoji: "🗺️", name: "Roadmap 12 mois", desc: "Votre plan d'action digital complet", free: false, color: t.gold, page: "pricing" },
    { emoji: "🔍", name: "Veille Concurrentielle", desc: "Analysez votre marché et concurrents", free: false, color: t.gold, page: "pricing" },
    { emoji: "📄", name: "Cahier des Charges", desc: "Document professionnel pour vos projets", free: false, color: t.gold, page: "pricing" },
    { emoji: "💸", name: "Simulateur Budget", desc: "Estimez le budget de votre projet", free: false, color: t.gold, page: "pricing" },
  ];

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME SaaS</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        8 outils IA pour <em style={{ color: t.accent }}>transformer votre business</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "36px", fontFamily: "sans-serif", maxWidth: "500px", lineHeight: 1.7 }}>
        3 outils gratuits pour découvrir. Premium pour accès illimité à tous les outils.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "12px", marginBottom: "32px" }}>
        {tools.map(tool => (
          <div key={tool.name} onClick={() => setPage(tool.page)} style={{ padding: "18px", background: `${tool.color}06`, border: `1px solid ${tool.color}18`, borderRadius: "12px", cursor: "pointer", transition: "all 0.15s" }}>
            <span style={{ fontSize: "24px", display: "block", marginBottom: "8px" }}>{tool.emoji}</span>
            <p style={{ fontSize: "13px", fontWeight: "600", color: t.text, marginBottom: "4px", fontFamily: "sans-serif" }}>{tool.name}</p>
            <p style={{ fontSize: "11px", color: t.muted, lineHeight: 1.5, marginBottom: "8px", fontFamily: "sans-serif" }}>{tool.desc}</p>
            <span style={{ padding: "2px 8px", background: tool.free ? "rgba(74,124,89,0.2)" : `${t.gold}20`, color: tool.free ? "#4A7C59" : t.gold, fontSize: "9px", borderRadius: "5px", fontFamily: "monospace", fontWeight: "700" }}>
              {tool.free ? "GRATUIT" : "PREMIUM"}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
        <div style={{ padding: "24px", background: `${t.accent}06`, border: `1px solid ${t.accent}20`, borderRadius: "14px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>🌱 Plan Gratuit</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.accent, marginBottom: "8px" }}>0€</p>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "16px" }}>Audit + Calculateur ROI + Maquette IA (3/mois)</p>
          <button onClick={() => setPage("audit")} style={{ width: "100%", padding: "11px", background: "transparent", border: `1px solid ${t.accent}`, borderRadius: "8px", color: t.accent, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Commencer gratuitement →</button>
        </div>
        <div style={{ padding: "24px", background: `${t.gold}08`, border: `1px solid ${t.gold}30`, borderRadius: "14px" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>🚀 Plan Premium</p>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.gold, marginBottom: "8px" }}>29€/mois</p>
          <p style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "16px" }}>Tous les outils illimités + Export PDF + Support WhatsApp</p>
          <button onClick={() => setPage("pricing")} style={{ width: "100%", padding: "11px", background: t.gold, border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Passer Premium →</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════════════════════════
function PricingPage({ setPage }) {
  const { t } = useContext(Ctx);
  const [billing, setBilling] = useState("monthly");

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px", textAlign: "center" }}>
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>PLATEFORME NEXALIE</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Tarifs <em style={{ color: t.accent }}>simples et transparents</em>
      </h1>
      <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden", margin: "24px 0 40px" }}>
        {[["monthly", "Mensuel"], ["annual", "Annuel — 2 mois offerts"]].map(([id, label]) => (
          <button key={id} onClick={() => setBilling(id)} style={{ padding: "10px 24px", background: billing === id ? t.accent : "transparent", border: "none", color: billing === id ? t.btnText : t.muted, fontSize: "13px", fontWeight: billing === id ? "700" : "400", cursor: "pointer", transition: "all 0.2s" }}>{label}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "14px", textAlign: "left" }}>
        {[
          { name: "Gratuit", price: "0€", period: "", color: t.accent, items: ["Audit digital (illimité)", "Calculateur ROI", "Maquette IA (3/mois)", "Articles blog"], cta: "Commencer", onCta: () => setPage("audit") },
          { name: "Premium", price: billing === "annual" ? "20€" : "29€", period: "/mois", badge: "POPULAIRE", color: t.gold, items: ["Tous les outils illimités", "Business Plan IA", "Roadmap + Veille", "CDC + Budget", "Export PDF", "Support WhatsApp"], cta: "Passer Premium", filled: true, onCta: () => setPage("contact") },
          { name: "Consulting", price: "400€+", period: "/mois", color: "#7B5EA7", items: ["Tout Premium inclus", "Sessions Zoom mensuelles", "Rapport personnalisé", "Roadmap sur mesure", "WhatsApp direct Relia"], cta: "Prendre RDV", onCta: () => setPage("contact") },
        ].map((plan, i) => (
          <div key={plan.name} style={{ padding: "24px", background: `${plan.color}06`, border: `1px solid ${i === 1 ? plan.color + "40" : plan.color + "20"}`, borderRadius: "16px", position: "relative", transform: i === 1 ? "scale(1.02)" : "scale(1)" }}>
            {plan.badge && <div style={{ position: "absolute", top: "-10px", left: "50%", transform: "translateX(-50%)", background: plan.color, padding: "3px 14px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: "#070e1c", fontFamily: "monospace", whiteSpace: "nowrap" }}>{plan.badge}</div>}
            <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: t.text, marginBottom: "8px" }}>{plan.name}</p>
            <div style={{ marginBottom: "16px" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "34px", color: plan.color }}>{plan.price}</span>
              <span style={{ fontSize: "13px", color: t.muted }}>{plan.period}</span>
            </div>
            {plan.items.map((item, j) => (
              <div key={j} style={{ display: "flex", gap: "7px", marginBottom: "6px" }}>
                <span style={{ color: "#4A7C59", fontSize: "12px" }}>✓</span>
                <span style={{ fontSize: "12px", color: t.muted, fontFamily: "sans-serif" }}>{item}</span>
              </div>
            ))}
            <button onClick={plan.onCta} style={{ width: "100%", marginTop: "16px", padding: "11px", background: plan.filled ? plan.color : "transparent", border: `1px solid ${plan.color}`, borderRadius: "8px", color: plan.filled ? "#070e1c" : plan.color, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
              {plan.cta} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════════════
function AboutPage({ setPage }) {
  const { t } = useContext(Ctx);
  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "60px", alignItems: "start" }}>
        <div>
          <div style={{ width: "100%", aspectRatio: "1", background: `linear-gradient(135deg, ${t.accent}20, ${t.gold}12)`, borderRadius: "20px", border: `1px solid ${t.accent}25`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "20px" }}>
            <span style={{ fontFamily: "Georgia, serif", fontSize: "72px", color: `${t.text}25` }}>RE</span>
          </div>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "4px" }}>Relia Ebiya</p>
          <p style={{ fontFamily: "monospace", fontSize: "10px", color: t.accent, letterSpacing: "1px", marginBottom: "14px" }}>FONDATRICE · NEXALIE STUDIO</p>
          {["📍 Vitry-sur-Seine, France", "🇨🇬 Congo Brazzaville", "💬 FR · EN · Lingala · Kitouba", "📧 relia.ebiya@gmail.com", "📱 +33 7 86 62 04 09"].map(info => (
            <p key={info} style={{ fontSize: "13px", color: t.muted, fontFamily: "sans-serif", marginBottom: "5px" }}>{info}</p>
          ))}
          <button onClick={() => setPage("contact")} style={{ width: "100%", marginTop: "16px", padding: "12px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>Me contacter →</button>
        </div>
        <div>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>LA FONDATRICE</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px,3vw,36px)", fontWeight: 200, color: t.text, marginBottom: "16px" }}>
            Un pont entre <em style={{ color: t.accent }}>deux mondes</em>
          </h1>
          <p style={{ fontSize: "15px", color: t.muted, lineHeight: 1.9, marginBottom: "28px", fontFamily: "sans-serif" }}>
            Cheffe de projet digital avec 10+ ans d'expérience en France, formée aux standards européens, ancrée dans la réalité africaine. Je parle votre langue — au sens propre comme au sens figuré.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "28px" }}>
            {[["🎯", "Transformation digitale", "Roadmaps & stratégie"], ["🤖", "IA & Automatisation", "Make, Zapier, Claude"], ["📊", "Data & Analytics", "Power BI, KPIs"], ["🌍", "Franco-Africaine", "Paris ↔ Brazzaville"]].map(([e, title, sub]) => (
              <div key={title} style={{ padding: "14px", background: `${t.accent}06`, border: `1px solid ${t.accent}15`, borderRadius: "10px" }}>
                <p style={{ fontSize: "18px", marginBottom: "5px" }}>{e}</p>
                <p style={{ fontSize: "12px", fontWeight: "600", color: t.text, marginBottom: "2px", fontFamily: "sans-serif" }}>{title}</p>
                <p style={{ fontSize: "11px", color: t.muted, fontFamily: "sans-serif" }}>{sub}</p>
              </div>
            ))}
          </div>
          <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: t.muted, marginBottom: "12px" }}>PARCOURS</p>
          {[["2022 → Présent", "Chef de Projet Digital · 3SP Technologies", t.accent], ["2021 → 2023", "CEO & Fondatrice · WEAREEYWA", t.gold], ["2020 → 2021", "Marketing Executive · RBEAN", "#7B5EA7"], ["2024", "Master Manager de Projet · ECEMA", "#4A7C59"]].map(([period, role, color]) => (
            <div key={period} style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
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

// ═══════════════════════════════════════════════════════════════
// CONTACT PAGE — WITH WORKING WHATSAPP + EMAIL FALLBACK
// ═══════════════════════════════════════════════════════════════
function ContactPage() {
  const { t } = useContext(Ctx);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setToast({ message: "⚠️ Veuillez remplir tous les champs obligatoires.", type: "error" });
      return;
    }
    setLoading(true);
    // WhatsApp fallback — opens WhatsApp with pre-filled message
    const msg = encodeURIComponent(`Bonjour Relia,\n\nNom: ${form.name}\nEmail: ${form.email}\nSujet: ${form.subject}\n\n${form.message}`);
    window.open(`https://wa.me/33786620409?text=${msg}`, "_blank");
    setLoading(false);
    setSent(true);
    // NOTE FOR DEV: Replace with actual API call to send email
    // await fetch('/api/contact', { method: 'POST', body: JSON.stringify(form) })
  };

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "48px 24px" }}>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: t.muted, marginBottom: "10px" }}>CONTACT</p>
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(26px,4vw,40px)", fontWeight: 200, color: t.text, marginBottom: "8px" }}>
        Parlons de <em style={{ color: t.accent }}>votre projet</em>
      </h1>
      <p style={{ fontSize: "15px", color: t.muted, marginBottom: "40px", fontFamily: "sans-serif" }}>Réponse garantie sous 24h · WhatsApp disponible</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr", gap: "40px" }}>
        <div>
          {[["📧", "Email", "relia.ebiya@gmail.com"], ["📱", "WhatsApp", "+33 7 86 62 04 09"], ["🌐", "Site web", "nexali.ai"], ["📍", "Basée à", "Vitry-sur-Seine, France"], ["🇨🇬", "Marchés", "France · Congo · CI · Afrique"]].map(([e, l, v]) => (
            <div key={l} style={{ padding: "14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "10px", marginBottom: "10px" }}>
              <p style={{ fontSize: "10px", color: t.muted, fontFamily: "monospace", marginBottom: "3px" }}>{e} {l.toUpperCase()}</p>
              <p style={{ fontSize: "14px", color: t.accent, fontFamily: "sans-serif" }}>{v}</p>
            </div>
          ))}
          <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer" style={{ display: "block", textDecoration: "none", width: "100%", marginTop: "8px", padding: "13px", background: "#25D366", border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", textAlign: "center", cursor: "pointer" }}>
            💬 WhatsApp direct
          </a>
        </div>

        {sent ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", padding: "40px", background: `${t.accent}06`, border: `1px solid ${t.accent}20`, borderRadius: "16px", textAlign: "center" }}>
            <span style={{ fontSize: "48px", marginBottom: "16px" }}>✅</span>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.text, marginBottom: "8px" }}>Message envoyé sur WhatsApp !</p>
            <p style={{ fontSize: "14px", color: t.muted, fontFamily: "sans-serif" }}>Relia vous répond sous 24h.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {[["Nom complet *", "name", "text", "Votre nom"], ["Email *", "email", "email", "votre@email.com"], ["Sujet", "subject", "text", "Objet de votre demande"]].map(([label, key, type, ph]) => (
              <div key={key}>
                <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "5px" }}>{String(label).toUpperCase()}</label>
                <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph as string} type={type as string}
                  style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "8px", color: t.text, fontSize: "13px", fontFamily: "sans-serif", outline: "none" }} />
              </div>
            ))}
            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: t.muted, marginBottom: "5px" }}>MESSAGE *</label>
              <textarea value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} rows={5} placeholder="Décrivez votre projet ou votre question..."
                style={{ width: "100%", padding: "11px 14px", background: t.card, border: `1px solid ${t.border}`, borderRadius: "8px", color: t.text, fontSize: "13px", resize: "vertical", fontFamily: "sans-serif", lineHeight: 1.6, outline: "none" }} />
            </div>
            <button onClick={handleSubmit} disabled={loading}
              style={{ padding: "13px", background: t.btn, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>
              {loading ? "Envoi..." : "Envoyer via WhatsApp →"}
            </button>
            <p style={{ fontSize: "11px", color: t.muted, fontFamily: "sans-serif", textAlign: "center" }}>
              Votre message s'ouvrira dans WhatsApp. En production, connecter à Resend ou SendGrid pour l'envoi email.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("fr");
  const [page, setPage] = useState("home");
  const t = THEMES[mode];

  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  const navigate = (p) => setPage(p);

  return (
    <Ctx.Provider value={{ mode, setMode, t }}>
      <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "sans-serif", transition: "background 0.5s ease" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          input, textarea, select { outline: none !important; }
          select option { background: #0d1f35; color: white; }
          ::placeholder { color: rgba(255,255,255,0.2) !important; }
          ::-webkit-scrollbar { width: 4px; }
          ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
          button { transition: opacity 0.15s, transform 0.1s; font-family: sans-serif; }
          button:hover:not(:disabled) { opacity: 0.9; }
          button:active:not(:disabled) { transform: scale(0.98); }
          a { transition: opacity 0.15s; }
          @keyframes spin { to { transform: rotate(360deg); } }
          @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
          @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
          .fade-in { animation: fadeIn 0.4s ease forwards; }
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
          }
        `}</style>
        <Nav page={page} setPage={navigate} />
        <div className="fade-in" key={page}>
          {page === "home"     && <HomePage setPage={navigate} />}
          {page === "offers"   && <OffersPage setPage={navigate} />}
          {page === "services" && <ServicesPage setPage={navigate} />}
          {page === "platform" && <PlatformPage setPage={navigate} />}
          {page === "about"    && <AboutPage setPage={navigate} />}
          {page === "contact"  && <ContactPage />}
          {page === "pricing"  && <PricingPage setPage={navigate} />}
          {page === "audit"    && <AuditPage setPage={navigate} />}
          {page === "maquette" && <MaquettePage />}
        </div>
      </div>
    </Ctx.Provider>
  );
}
