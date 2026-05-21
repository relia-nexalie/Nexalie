import { useState, useEffect, useRef, createContext, useContext } from "react";

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS — blanc dominant, navy pour contraste
// Jaune/or = décoratif uniquement, JAMAIS en texte
// ═══════════════════════════════════════════════════════
const THEMES = {
  fr: {
    // Fonds
    pageBg: "#FFFFFF",
    sectionBg: "#F8FAFC",
    navyBg: "#0A1628",
    // Textes
    textPrimary: "#0A1628",
    textSecondary: "#6B7A94",
    textOnNavy: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.5)",
    // Accents
    accent: "#2E9B8B",
    accentDark: "#1D6B60",
    gold: "#C9A84C",        // décoratif uniquement
    // Bordures
    border: "rgba(0,0,0,0.07)",
    borderNavy: "rgba(255,255,255,0.1)",
    // Boutons
    btnPrimary: "#0A1628",
    btnPrimaryText: "#FFFFFF",
    btnAccent: "#2E9B8B",
    btnAccentText: "#FFFFFF",
    // Toggle
    tag: "🇫🇷 France",
    tagOther: "🌍 Afrique",
    hero: "PME françaises & entreprises africaines",
    priceSuffix: "fr",
  },
  af: {
    pageBg: "#FFFFFF",
    sectionBg: "#FFF8F4",
    navyBg: "#1A0800",
    textPrimary: "#1A0800",
    textSecondary: "#7A6B62",
    textOnNavy: "#FFFFFF",
    textMuted: "rgba(255,255,255,0.5)",
    accent: "#E07B39",
    accentDark: "#A85520",
    gold: "#C9A84C",
    border: "rgba(0,0,0,0.07)",
    borderNavy: "rgba(255,255,255,0.1)",
    btnPrimary: "#1A0800",
    btnPrimaryText: "#FFFFFF",
    btnAccent: "#E07B39",
    btnAccentText: "#FFFFFF",
    tag: "🌍 Afrique",
    tagOther: "🇫🇷 France",
    hero: "Congo · Cameroun · Côte d'Ivoire · Afrique",
    priceSuffix: "af",
  }
};

const PRICES = {
  fr: { vitrine:"1 200–1 800€", onepage:"400–600€", ecommerce:"2 500–4 000€",
        identite:"1 200–2 500€", landing:"600–900€", maintenance:"80–150€/mois" },
  af: { vitrine:"390 000–650 000 FCFA", onepage:"130 000–230 000 FCFA", ecommerce:"790 000–1 310 000 FCFA",
        identite:"390 000–790 000 FCFA", landing:"200 000–330 000 FCFA", maintenance:"33 000–52 000 FCFA/mois" }
};

const Ctx = createContext();

// ═══════════════════════════════════════════════════════
// API CALL — proxy via /api/claude en production
// ═══════════════════════════════════════════════════════
async function callClaude(system, prompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      system,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });
  if (!res.ok) throw new Error(`API ${res.status}`);
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

// ═══════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════
function Toast({ message, type = "success", onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  const colors = { success: "#2E9B8B", error: "#C0627A", info: "#0A1628" };
  return (
    <div style={{ position:"fixed", bottom:"24px", right:"24px", zIndex:9999,
      padding:"14px 20px", background:"#fff", border:`1px solid ${colors[type]}30`,
      borderLeft:`3px solid ${colors[type]}`, borderRadius:"10px", color:"#0A1628",
      fontSize:"13px", boxShadow:"0 4px 20px rgba(0,0,0,0.1)", maxWidth:"320px",
      animation:"slideIn 0.3s ease" }}>
      {message}
    </div>
  );
}

function Spinner({ color = "#2E9B8B", size = 28 }) {
  return <div style={{ width:`${size}px`, height:`${size}px`,
    border:`2px solid ${color}20`, borderTop:`2px solid ${color}`,
    borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto" }} />;
}

// ═══════════════════════════════════════════════════════
// NAVIGATION
// ═══════════════════════════════════════════════════════
function Nav({ page, setPage }) {
  const { mode, setMode, t } = useContext(Ctx);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const links = [["home","Accueil"],["offers","Offres"],["services","Services"],
                 ["platform","Plateforme"],["about","À propos"]];

  return (
    <nav style={{ position:"sticky", top:0, zIndex:1000,
      background: scrolled ? "rgba(255,255,255,0.97)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid ${t.border}` : "none",
      padding:"0 40px", transition:"all 0.3s" }}>
      <div style={{ maxWidth:"1100px", margin:"0 auto", display:"flex",
        alignItems:"center", justifyContent:"space-between", height:"64px" }}>
        {/* Logo */}
        <button onClick={() => setPage("home")} style={{ background:"none", border:"none",
          cursor:"pointer", display:"flex", alignItems:"baseline", gap:"8px" }}>
          <span style={{ fontFamily:"Georgia, serif", fontSize:"22px",
            fontWeight:300, color:t.textPrimary }}>Nexalie</span>
          <span style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2.5px",
            color:t.accent, fontWeight:600 }}>AI</span>
        </button>

        {/* Desktop links */}
        <div style={{ display:"flex", gap:"2px" }}>
          {links.map(([id,label]) => (
            <button key={id} onClick={() => setPage(id)}
              style={{ padding:"8px 14px", background:"none", border:"none",
                cursor:"pointer", fontSize:"13px", color:page===id ? t.textPrimary : t.textSecondary,
                fontWeight:page===id ? 600 : 400,
                borderBottom:`2px solid ${page===id ? t.accent : "transparent"}`,
                transition:"all 0.2s" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Right actions */}
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <div style={{ display:"flex", background:t.sectionBg,
            border:`1px solid ${t.border}`, borderRadius:"8px", overflow:"hidden" }}>
            {[["fr","🇫🇷"],["af","🌍"]].map(([m,flag]) => (
              <button key={m} onClick={() => setMode(m)}
                style={{ padding:"7px 12px",
                  background:mode===m ? t.accent : "transparent",
                  border:"none", color:mode===m ? "#fff" : t.textSecondary,
                  fontSize:"13px", fontWeight:mode===m ? 700 : 400,
                  cursor:"pointer", transition:"all 0.2s" }}>{flag}</button>
            ))}
          </div>
          <button onClick={() => setPage("audit")}
            style={{ padding:"9px 20px", background:t.btnPrimary, border:"none",
              borderRadius:"8px", color:t.btnPrimaryText, fontSize:"13px",
              fontWeight:700, cursor:"pointer" }}>
            Audit gratuit →
          </button>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════════════════
// HOME PAGE
// ═══════════════════════════════════════════════════════
function HomePage({ setPage }) {
  const { mode, t } = useContext(Ctx);

  return (
    <div style={{ background:t.pageBg }}>

      {/* HERO — fond blanc */}
      <div style={{ minHeight:"88vh", display:"flex", alignItems:"center",
        padding:"60px 40px", background:t.pageBg, position:"relative", overflow:"hidden" }}>
        {/* Cercle décoratif subtil */}
        <div style={{ position:"absolute", top:"-60px", right:"-80px", width:"400px",
          height:"400px", borderRadius:"50%",
          background:`radial-gradient(circle, ${t.accent}06, transparent 65%)`,
          pointerEvents:"none" }} />
        <div style={{ maxWidth:"1100px", margin:"0 auto",
          display:"grid", gridTemplateColumns:"1fr 420px",
          gap:"60px", alignItems:"center", width:"100%" }}>
          <div>
            {/* Pill */}
            <div style={{ display:"inline-flex", alignItems:"center", gap:"8px",
              background:t.navyBg, borderRadius:"20px", padding:"6px 16px",
              marginBottom:"24px" }}>
              <span style={{ fontSize:"10px", fontFamily:"monospace",
                letterSpacing:"1.5px", color:"#fff", fontWeight:600 }}>
                ✦ {t.hero}
              </span>
            </div>
            <h1 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(32px,5vw,54px)",
              fontWeight:200, color:t.textPrimary, lineHeight:1.2, marginBottom:"20px" }}>
              Votre entreprise mérite<br />
              <em style={{ color:t.accent, fontStyle:"normal" }}>l'excellence</em> digitale
            </h1>
            <p style={{ fontSize:"16px", color:t.textSecondary, lineHeight:1.8,
              marginBottom:"32px", maxWidth:"480px" }}>
              Audit gratuit en 20 minutes · Outils IA propriétaires ·
              Accompagnement mensuel adapté à votre niveau.
            </p>
            {mode === "af" && (
              <div style={{ display:"flex", gap:"6px", marginBottom:"20px", flexWrap:"wrap" }}>
                {["🇫🇷 Français","🇨🇬 Lingala","Kitouba","🇬🇧 English"].map(l => (
                  <span key={l} style={{ padding:"4px 10px",
                    background:`${t.accent}10`, border:`1px solid ${t.accent}20`,
                    borderRadius:"20px", fontSize:"11px", color:t.accent }}>{l}</span>
                ))}
              </div>
            )}
            <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
              <button onClick={() => setPage("audit")}
                style={{ padding:"14px 28px", background:t.btnAccent, border:"none",
                  borderRadius:"10px", color:t.btnAccentText, fontSize:"15px",
                  fontWeight:700, cursor:"pointer",
                  boxShadow:`0 6px 20px ${t.accent}25` }}>
                Audit gratuit →
              </button>
              <button onClick={() => setPage("offers")}
                style={{ padding:"14px 26px", background:"transparent",
                  border:`1px solid ${t.border}`, borderRadius:"10px",
                  color:t.textSecondary, fontSize:"15px", cursor:"pointer" }}>
                Nos offres
              </button>
            </div>
          </div>

          {/* Score card */}
          <div style={{ background:"#fff", border:`1px solid ${t.border}`,
            borderRadius:"20px", padding:"28px",
            boxShadow:"0 4px 24px rgba(0,0,0,0.06)" }}>
            <p style={{ fontFamily:"monospace", fontSize:"9px", letterSpacing:"2px",
              color:t.textSecondary, marginBottom:"20px", fontWeight:600 }}>
              MATURITÉ DIGITALE — EXEMPLE
            </p>
            {[["Stratégie & Vision",t.accent,65],["Expérience Client","#C9A84C",45],
              ["Opérations","#7B5EA7",30],["Technologies","#569CD6",55],
              ["Culture & Équipes",t.accent,40]].map(([label,color,pct]) => (
              <div key={label} style={{ marginBottom:"14px" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
                  <span style={{ fontSize:"12px", color:t.textSecondary }}>{label}</span>
                  <span style={{ fontFamily:"monospace", fontSize:"10px", color }}>{Math.round(pct*0.2)}/20</span>
                </div>
                <div style={{ height:"5px", background:t.sectionBg, borderRadius:"3px", overflow:"hidden" }}>
                  <div style={{ width:`${pct}%`, height:"100%", background:color, borderRadius:"3px" }} />
                </div>
              </div>
            ))}
            <button onClick={() => setPage("audit")}
              style={{ width:"100%", marginTop:"10px", padding:"12px",
                background:t.btnPrimary, border:"none", borderRadius:"10px",
                color:t.btnPrimaryText, fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
              Démarrer mon audit →
            </button>
          </div>
        </div>
      </div>

      {/* STATS — fond navy */}
      <div style={{ background:t.navyBg, padding:"28px 40px" }}>
        {/* Ligne or décorative en haut */}
        <div style={{ maxWidth:"1100px", margin:"0 auto",
          display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px" }}>
          {[["8","Outils IA",t.accent],["20 min","Audit complet",t.accent],
            ["0€","Pour démarrer","#fff"],["48h","Rapport livré",t.accent]].map(([v,l,c]) => (
            <div key={l} style={{ textAlign:"center", padding:"16px" }}>
              <p style={{ fontFamily:"Georgia, serif", fontSize:"24px",
                fontWeight:300, color:c, marginBottom:"4px" }}>{v}</p>
              <p style={{ fontSize:"12px", color:t.textMuted }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* MULTI-AGENTS TEASER — fond blanc */}
      <div style={{ padding:"72px 40px", background:t.pageBg }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
            color:t.textSecondary, marginBottom:"10px", fontWeight:600 }}>NEXALIE V2 — NOUVEAU</p>
          <h2 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(22px,3vw,34px)",
            fontWeight:200, color:t.textPrimary, marginBottom:"12px" }}>
            De l'outil au système <em style={{ color:t.accent }}>autonome</em>
          </h2>
          <p style={{ fontSize:"15px", color:t.textSecondary, lineHeight:1.8,
            marginBottom:"32px", maxWidth:"560px" }}>
            5 agents IA qui analysent, planifient, exécutent et surveillent votre
            transformation digitale. Automatiquement. Pendant que vous travaillez.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:"10px" }}>
            {[["A1","Analyste","Scrape votre site et vos concurrents","#2E9B8B"],
              ["A2","Stratège","Génère roadmap et business plan","#1A5FA8"],
              ["A3","Exécuteur","Publie, crée, configure","#6B3FA0"],
              ["A4","Contrôleur","Surveille vos KPIs chaque semaine","#E07B39"],
              ["A5","Rapporteur","Rapport PDF mensuel automatique","#C0627A"]].map(([num,name,desc,color]) => (
              <div key={num} style={{ padding:"16px",
                background:"#fff", border:`1px solid ${t.border}`,
                borderRadius:"12px", borderTop:`3px solid ${color}` }}>
                <div style={{ display:"inline-flex", width:"28px", height:"28px",
                  borderRadius:"50%", background:`${color}15`,
                  alignItems:"center", justifyContent:"center",
                  marginBottom:"8px" }}>
                  <span style={{ fontSize:"11px", fontWeight:700, color }}>{num}</span>
                </div>
                <p style={{ fontSize:"12px", fontWeight:700, color:t.textPrimary, marginBottom:"4px" }}>{name}</p>
                <p style={{ fontSize:"10px", color:t.textSecondary, lineHeight:1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop:"16px" }}>
            {/* Ligne décorative or */}
            <div style={{ height:"1px", background:`linear-gradient(90deg,transparent,${t.gold}40,transparent)`, marginBottom:"16px" }} />
            <span style={{ fontSize:"12px", color:t.textSecondary }}>
              Disponible en bêta — rejoindre la liste d'attente →
            </span>
          </div>
        </div>
      </div>

      {/* OUTILS — fond gris très clair */}
      <div style={{ padding:"72px 40px", background:t.sectionBg,
        borderTop:`1px solid ${t.border}`, borderBottom:`1px solid ${t.border}` }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto" }}>
          <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
            color:t.textSecondary, marginBottom:"10px", fontWeight:600 }}>PLATEFORME SAAS</p>
          <h2 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(22px,3vw,34px)",
            fontWeight:200, color:t.textPrimary, marginBottom:"8px" }}>
            8 outils IA pour <em style={{ color:t.accent }}>transformer votre business</em>
          </h2>
          <p style={{ fontSize:"14px", color:t.textSecondary, marginBottom:"32px" }}>
            3 gratuits pour démarrer · Premium pour tout débloquer
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px" }}>
            {[["📊","Audit Digital","Score /100 sur 5 dimensions",true],
              ["💰","Calculateur ROI","ROI transformation digitale",true],
              ["🤖","Maquette IA","Votre site en 2 minutes",true],
              ["📋","Business Plan IA","Plan + benchmark marché",false],
              ["🗺️","Roadmap 12 mois","Plan d'action sur un an",false],
              ["🔍","Veille Concurrentielle","Cartographie marché",false],
              ["📄","Cahier des Charges","Document professionnel",false],
              ["💸","Simulateur Budget","Estimez votre projet",false]].map(([e,n,d,free]) => (
              <div key={n} style={{ padding:"18px", background:"#fff",
                border:`1px solid ${t.border}`, borderRadius:"12px",
                borderLeft:`3px solid ${free ? t.accent : "#9B8E6B"}` }}>
                <span style={{ fontSize:"20px", display:"block", marginBottom:"8px" }}>{e}</span>
                <p style={{ fontSize:"12px", fontWeight:600, color:t.textPrimary, marginBottom:"4px" }}>{n}</p>
                <p style={{ fontSize:"10px", color:t.textSecondary, marginBottom:"8px", lineHeight:1.5 }}>{d}</p>
                <span style={{ padding:"2px 8px", borderRadius:"5px",
                  fontSize:"9px", fontWeight:700,
                  background:free ? "rgba(46,125,82,0.08)" : "rgba(155,142,107,0.1)",
                  color:free ? "#2E7D52" : "#7A6E42" }}>
                  {free ? "GRATUIT" : "PREMIUM"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA FINAL — fond navy */}
      <div style={{ padding:"80px 40px", background:t.navyBg }}>
        {/* Ligne or décorative */}
        <div style={{ maxWidth:"100%", height:"1px", marginBottom:"60px",
          background:`linear-gradient(90deg,transparent,${t.gold}30,transparent)` }} />
        <div style={{ maxWidth:"680px", margin:"0 auto", textAlign:"center" }}>
          <h2 style={{ fontFamily:"Georgia, serif", fontSize:"clamp(24px,4vw,38px)",
            fontWeight:200, color:t.textOnNavy, marginBottom:"12px", lineHeight:1.3 }}>
            Votre transformation digitale<br />
            <em style={{ color:t.accent, fontStyle:"normal" }}>commence aujourd'hui</em>
          </h2>
          <p style={{ fontSize:"15px", color:t.textMuted, marginBottom:"28px", lineHeight:1.7 }}>
            Audit gratuit en 20 minutes. Plan d'action personnalisé.
          </p>
          <button onClick={() => setPage("audit")}
            style={{ padding:"16px 40px", background:t.btnAccent, border:"none",
              borderRadius:"12px", color:t.btnAccentText, fontSize:"16px",
              fontWeight:700, cursor:"pointer", boxShadow:`0 6px 24px ${t.accent}30` }}>
            Je fais mon audit gratuit →
          </button>
          <p style={{ fontSize:"12px", color:t.textMuted, marginTop:"14px" }}>
            nexali.ai · +33 7 86 62 04 09
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background:"#060E1C", padding:"32px 40px",
        borderTop:`1px solid ${t.gold}15` }}>
        <div style={{ maxWidth:"1100px", margin:"0 auto",
          display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <span style={{ fontFamily:"Georgia, serif", fontSize:"18px",
            fontWeight:300, color:"rgba(255,255,255,0.5)" }}>Nexalie</span>
          <span style={{ fontSize:"11px", color:"rgba(255,255,255,0.2)",
            fontFamily:"monospace" }}>© 2026 Nexalie · nexali.ai</span>
          <span style={{ fontSize:"11px", color:t.accent,
            fontFamily:"monospace" }}>nexali.ai</span>
        </div>
      </footer>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// AUDIT PAGE — COMPLET
// ═══════════════════════════════════════════════════════
const AUDIT_DIMS = [
  { id:"strategie", label:"Stratégie & Vision", color:"#2E9B8B",
    questions:["La direction a-t-elle défini une vision digitale claire ?",
      "Existe-t-il un budget dédié à la transformation digitale ?",
      "Les objectifs digitaux sont-ils mesurés avec des KPIs ?",
      "La direction participe-t-elle activement aux initiatives digitales ?"] },
  { id:"client", label:"Expérience Client", color:"#1A5FA8",
    questions:["Vos clients peuvent-ils vous contacter ou commander en ligne ?",
      "Collectez-vous les retours clients digitalement ?",
      "Proposez-vous des communications personnalisées ?",
      "Votre présence en ligne reflète-t-elle votre image professionnelle ?"] },
  { id:"operations", label:"Opérations & Processus", color:"#6B3FA0",
    questions:["Vos processus clés sont-ils digitalisés ?",
      "Utilisez-vous des outils de gestion de projet digital ?",
      "Certaines tâches répétitives sont-elles automatisées ?",
      "Vos données sont-elles centralisées et accessibles ?"] },
  { id:"technologie", label:"Technologies & Outils", color:"#E07B39",
    questions:["Utilisez-vous un logiciel de gestion (ERP, CRM) ?",
      "Vos données sont-elles sauvegardées dans le cloud ?",
      "Vos équipes ont-elles accès aux outils collaboratifs ?",
      "Disposez-vous de tableaux de bord analytiques ?"] },
  { id:"culture", label:"Culture & Compétences", color:"#C0627A",
    questions:["Vos équipes sont-elles formées aux outils digitaux ?",
      "L'innovation digitale est-elle encouragée ?",
      "Disposez-vous d'une feuille de route digitale ?",
      "Le changement digital est-il bien accepté ?"] },
];

const OPTS = [{v:5,l:"Oui, totalement"},{v:3,l:"Partiellement"},
              {v:1,l:"Pas vraiment"},{v:0,l:"Non, pas du tout"}];

function AuditPage({ setPage }) {
  const { t } = useContext(Ctx);
  const [step, setStep] = useState(0);
  const [company, setCompany] = useState({ name:"", sector:"", country:"" });
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);

  const dim = AUDIT_DIMS[step - 1];
  const totalScore = () => AUDIT_DIMS.reduce((sum,d) =>
    sum + d.questions.reduce((s,_,i) => s + (answers[`${d.id}_${i}`] ?? 0), 0), 0);
  const dimScore = (id) => AUDIT_DIMS.find(d=>d.id===id).questions
    .reduce((s,_,i) => s + (answers[`${id}_${i}`] ?? 0), 0);
  const isComplete = () => {
    if (step === 0) return company.name && company.sector;
    return dim.questions.every((_,i) => answers[`${dim.id}_${i}`] !== undefined);
  };
  const getLevel = (s) => {
    if (s < 20) return { label:"Initiale", color:"#C0627A", pack:"Pack Démarrage" };
    if (s < 40) return { label:"Émergente", color:"#E07B39", pack:"Pack Transformation" };
    if (s < 60) return { label:"Structurée", color:"#C9A84C", pack:"Pack Automatisation IA" };
    if (s < 80) return { label:"Optimisée", color:"#2E9B8B", pack:"Pack Excellence" };
    return { label:"Leader", color:"#6B3FA0", pack:"Accompagnement sur mesure" };
  };

  const generate = async () => {
    setLoading(true);
    const score = totalScore();
    const level = getLevel(score);
    const SYSTEM = `Expert transformation digitale Nexalie. JSON strict sans backticks.
Format: {"strengths":["f1","f2","f3"],"weaknesses":["f1","f2","f3"],"priorities":["p1","p2","p3"],"recommendation":"2 phrases"}`;
    let text = "";
    try {
      await callClaude(SYSTEM,
        `Entreprise: ${company.name}, Secteur: ${company.sector}, Score: ${score}/100, Niveau: ${level.label}`,
        chunk => { text += chunk; });
      const parsed = JSON.parse(text.replace(/```json|```/g,"").trim());
      setReport({ ...parsed, score, level, company,
        dimScores: AUDIT_DIMS.map(d => ({ label:d.label, score:dimScore(d.id), color:d.color })) });
      setStep(6);
    } catch {
      setReport({ score, level, company,
        dimScores: AUDIT_DIMS.map(d => ({ label:d.label, score:dimScore(d.id), color:d.color })),
        strengths:["Démarche proactive"], weaknesses:["Axes à améliorer"],
        priorities:["Définir une stratégie digitale","Former les équipes","Automatiser les processus"],
        recommendation:`Score ${score}/100 — niveau ${level.label}. ${level.pack} recommandé.` });
      setStep(6);
    }
    setLoading(false);
  };

  if (step === 6 && report) return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      <div style={{ textAlign:"center", marginBottom:"40px" }}>
        <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:"90px", height:"90px", borderRadius:"50%",
          background:`${report.level.color}10`, border:`2px solid ${report.level.color}30`,
          marginBottom:"16px" }}>
          <span style={{ fontFamily:"Georgia, serif", fontSize:"32px",
            color:report.level.color }}>{report.score}</span>
        </div>
        <h2 style={{ fontFamily:"Georgia, serif", fontSize:"26px",
          fontWeight:200, color:t.textPrimary }}>{report.company.name}</h2>
        <p style={{ fontFamily:"monospace", fontSize:"11px",
          color:report.level.color }}>Niveau {report.level.label} · {report.score}/100</p>
      </div>
      {/* Barres dimensions */}
      <div style={{ padding:"24px", background:"#fff", border:`1px solid ${t.border}`,
        borderRadius:"16px", marginBottom:"20px" }}>
        {report.dimScores.map(d => (
          <div key={d.label} style={{ marginBottom:"14px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"5px" }}>
              <span style={{ fontSize:"13px", color:t.textPrimary }}>{d.label}</span>
              <span style={{ fontFamily:"monospace", fontSize:"11px", color:d.color }}>{d.score}/20</span>
            </div>
            <div style={{ height:"6px", background:t.sectionBg, borderRadius:"3px" }}>
              <div style={{ width:`${(d.score/20)*100}%`, height:"100%",
                background:d.color, borderRadius:"3px" }} />
            </div>
          </div>
        ))}
      </div>
      {/* Recommandation */}
      <div style={{ padding:"20px", background:t.navyBg, borderRadius:"14px",
        marginBottom:"20px" }}>
        <p style={{ fontFamily:"monospace", fontSize:"9px", color:t.textMuted,
          marginBottom:"8px" }}>RECOMMANDATION NEXALIE</p>
        <p style={{ fontSize:"14px", color:t.textOnNavy, lineHeight:1.7 }}>{report.recommendation}</p>
        <p style={{ fontFamily:"monospace", fontSize:"11px", color:t.accent,
          marginTop:"8px" }}>→ {report.level.pack}</p>
      </div>
      <div style={{ display:"flex", gap:"12px", justifyContent:"center" }}>
        <button onClick={() => setPage("offers")}
          style={{ padding:"13px 26px", background:t.btnAccent, border:"none",
            borderRadius:"10px", color:t.btnAccentText, fontSize:"14px",
            fontWeight:700, cursor:"pointer" }}>
          Voir les offres →
        </button>
        <button onClick={() => setPage("contact")}
          style={{ padding:"13px 24px", background:"transparent",
            border:`1px solid ${t.border}`, borderRadius:"10px",
            color:t.textSecondary, fontSize:"14px", cursor:"pointer" }}>
          Parler à Nexalie
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth:"720px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      {step > 0 && (
        <div style={{ marginBottom:"32px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"8px" }}>
            <span style={{ fontFamily:"monospace", fontSize:"10px",
              color:t.textSecondary }}>DIMENSION {step}/5</span>
            <span style={{ fontFamily:"monospace", fontSize:"10px",
              color:t.accent }}>{Math.round((step/6)*100)}%</span>
          </div>
          <div style={{ height:"4px", background:t.sectionBg, borderRadius:"2px" }}>
            <div style={{ width:`${(step/6)*100}%`, height:"100%",
              background:t.accent, borderRadius:"2px", transition:"width 0.3s" }} />
          </div>
        </div>
      )}
      {step === 0 && (
        <div>
          <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
            color:t.textSecondary, marginBottom:"10px" }}>OUTIL GRATUIT</p>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"32px",
            fontWeight:200, color:t.textPrimary, marginBottom:"12px" }}>
            Audit de <em style={{ color:t.accent, fontStyle:"normal" }}>maturité digitale</em>
          </h1>
          <p style={{ fontSize:"14px", color:t.textSecondary, marginBottom:"32px", lineHeight:1.7 }}>
            20 questions · 5 dimensions · Score /100 · Rapport IA personnalisé
          </p>
          {[["Nom de votre entreprise","name","Ex: Restaurant Mama Africa"],
            ["Secteur d'activité","sector","Ex: Commerce, BTP, Services..."],
            ["Pays / Ville","country","Ex: Abidjan, Paris..."]].map(([label,key,ph]) => (
            <div key={key} style={{ marginBottom:"16px" }}>
              <label style={{ display:"block", fontFamily:"monospace", fontSize:"10px",
                color:t.textSecondary, marginBottom:"6px" }}>{label.toUpperCase()}</label>
              <input value={company[key]}
                onChange={e => setCompany(p => ({...p,[key]:e.target.value}))}
                placeholder={ph}
                style={{ width:"100%", padding:"12px 14px",
                  background:"#fff", border:`1px solid ${t.border}`,
                  borderRadius:"10px", color:t.textPrimary, fontSize:"14px", outline:"none" }} />
            </div>
          ))}
          <button onClick={() => setStep(1)} disabled={!isComplete()}
            style={{ width:"100%", padding:"14px",
              background:isComplete() ? t.btnPrimary : t.sectionBg,
              border:"none", borderRadius:"12px",
              color:isComplete() ? t.btnPrimaryText : t.textSecondary,
              fontSize:"15px", fontWeight:700,
              cursor:isComplete() ? "pointer" : "default" }}>
            Démarrer l'audit →
          </button>
        </div>
      )}
      {step >= 1 && step <= 5 && dim && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"28px" }}>
            <div style={{ width:"40px", height:"40px", borderRadius:"50%",
              background:`${dim.color}10`, display:"flex", alignItems:"center",
              justifyContent:"center", border:`1px solid ${dim.color}20` }}>
              <span style={{ fontSize:"14px", fontWeight:700, color:dim.color }}>{step}</span>
            </div>
            <div>
              <h2 style={{ fontFamily:"Georgia, serif", fontSize:"20px",
                fontWeight:200, color:t.textPrimary }}>{dim.label}</h2>
              <p style={{ fontSize:"12px", color:t.textSecondary }}>{step}/5 · 4 questions</p>
            </div>
          </div>
          {dim.questions.map((q,i) => (
            <div key={i} style={{ marginBottom:"20px", padding:"18px",
              background:"#fff", border:`1px solid ${t.border}`, borderRadius:"12px" }}>
              <p style={{ fontSize:"14px", color:t.textPrimary, lineHeight:1.6,
                marginBottom:"14px" }}>{i+1}. {q}</p>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px" }}>
                {OPTS.map(opt => (
                  <button key={opt.v} onClick={() => setAnswers(a => ({...a,[`${dim.id}_${i}`]:opt.v}))}
                    style={{ padding:"10px 12px",
                      background:answers[`${dim.id}_${i}`]===opt.v ? `${dim.color}10` : "transparent",
                      border:`1px solid ${answers[`${dim.id}_${i}`]===opt.v ? dim.color : t.border}`,
                      borderRadius:"8px",
                      color:answers[`${dim.id}_${i}`]===opt.v ? dim.color : t.textSecondary,
                      fontSize:"13px", cursor:"pointer", textAlign:"left",
                      transition:"all 0.15s" }}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div style={{ display:"flex", gap:"10px" }}>
            <button onClick={() => setStep(step-1)}
              style={{ padding:"12px 20px", background:"transparent",
                border:`1px solid ${t.border}`, borderRadius:"10px",
                color:t.textSecondary, fontSize:"14px", cursor:"pointer" }}>← Retour</button>
            <button onClick={() => step === 5 ? generate() : setStep(step+1)}
              disabled={!isComplete() || loading}
              style={{ flex:1, padding:"12px",
                background:isComplete() && !loading ? t.btnPrimary : t.sectionBg,
                border:"none", borderRadius:"10px",
                color:isComplete() && !loading ? t.btnPrimaryText : t.textSecondary,
                fontSize:"14px", fontWeight:700,
                cursor:isComplete() && !loading ? "pointer" : "default" }}>
              {loading ? "Génération du rapport..." :
                step === 5 ? "Obtenir mon rapport →" : "Suivant →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// OFFERS PAGE
// ═══════════════════════════════════════════════════════
function OffersPage({ setPage }) {
  const { mode, t } = useContext(Ctx);
  const isAf = mode === "af";
  const offers = [
    { e:"🌱", name:"Pack Démarrage", score:"0–19",
      monthly: isAf ? "250 000 FCFA/mois" : "400€/mois",
      audit: isAf ? "Audit : 300 000 FCFA · 3 mois min" : "Audit : 500€ · 3 mois min",
      color:"#2E9B8B", items:["Audit initial + rapport","1 session Zoom mensuelle","Roadmap personnalisée","Suivi KPIs","Support WhatsApp"] },
    { e:"🌿", name:"Pack Transformation", score:"20–39",
      monthly: isAf ? "400 000 FCFA/mois" : "600€/mois",
      audit: isAf ? "Audit : 450 000 FCFA · 6 mois min" : "Audit : 700€ · 6 mois min",
      color:"#1A5FA8", items:["Tout Pack Démarrage","2 sessions mensuelles","Stratégie digitale","Formation équipe 2h/mois","Dashboard KPIs"] },
    { e:"🌳", name:"Pack Automatisation IA", score:"40–59",
      monthly: isAf ? "550 000 FCFA/mois" : "800€/mois",
      audit: isAf ? "Audit : 750 000 FCFA · 6 mois min" : "Audit : 1 200€ · 6 mois min",
      color:"#6B3FA0", badge:"POPULAIRE", items:["Tout Pack Transformation","Automatisation Make/Zapier","Déploiement outils IA","3 sessions mensuelles","Plateforme Premium inclus"] },
    { e:"🚀", name:"Pack Excellence", score:"60–79",
      monthly: isAf ? "800 000 FCFA/mois" : "1 200€/mois",
      audit: isAf ? "Audit : 1 000 000 FCFA · 12 mois min" : "Audit : 1 500€ · 12 mois min",
      color:"#C0627A", items:["Tout Pack Automatisation","Accompagnement avancé","Présentiel France/Afrique","Sessions illimitées","Réseau partenaires"] },
  ];
  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
        color:t.textSecondary, marginBottom:"10px" }}>ACCOMPAGNEMENT CONSULTING</p>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:"36px",
        fontWeight:200, color:t.textPrimary, marginBottom:"8px" }}>
        Nos offres <em style={{ color:t.accent, fontStyle:"normal" }}>d'accompagnement</em>
      </h1>
      <p style={{ fontSize:"15px", color:t.textSecondary, marginBottom:"40px", lineHeight:1.7 }}>
        Faites d'abord l'audit gratuit —{" "}
        <span onClick={() => setPage("audit")} style={{ color:t.accent, cursor:"pointer" }}>
          votre score détermine l'offre adaptée →
        </span>
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"16px" }}>
        {offers.map(o => (
          <div key={o.name} style={{ padding:"24px", background:"#fff",
            border:`1px solid ${t.border}`, borderRadius:"16px",
            borderTop:`3px solid ${o.color}`, position:"relative" }}>
            {o.badge && (
              <div style={{ position:"absolute", top:"-11px", right:"16px",
                background:o.color, padding:"3px 12px", borderRadius:"15px",
                fontSize:"9px", fontWeight:700, color:"#fff" }}>{o.badge}</div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", marginBottom:"16px" }}>
              <div>
                <span style={{ fontSize:"24px", marginRight:"8px" }}>{o.e}</span>
                <span style={{ fontFamily:"Georgia, serif", fontSize:"20px",
                  color:t.textPrimary }}>{o.name}</span>
                <p style={{ fontFamily:"monospace", fontSize:"10px",
                  color:o.color, marginTop:"3px" }}>Score {o.score}/100</p>
              </div>
              <div style={{ textAlign:"right" }}>
                <p style={{ fontFamily:"Georgia, serif", fontSize:"22px", color:o.color }}>{o.monthly}</p>
                {o.audit && <p style={{ fontFamily:"monospace", fontSize:"9px", color:t.textSecondary, marginTop:"2px" }}>{o.audit}</p>}
              </div>
            </div>
            {o.items.map((item,i) => (
              <div key={i} style={{ display:"flex", gap:"8px", marginBottom:"5px" }}>
                <span style={{ color:o.color, fontSize:"12px" }}>✓</span>
                <span style={{ fontSize:"13px", color:t.textSecondary }}>{item}</span>
              </div>
            ))}
            <button onClick={() => setPage("contact")}
              style={{ width:"100%", marginTop:"16px", padding:"11px",
                background:"transparent", border:`1px solid ${o.color}`,
                borderRadius:"9px", color:o.color, fontSize:"13px",
                fontWeight:700, cursor:"pointer" }}>
              Démarrer ce pack →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// SERVICES PAGE
// ═══════════════════════════════════════════════════════
function ServicesPage({ setPage }) {
  const { mode, t } = useContext(Ctx);
  const pr = PRICES[mode];
  const services = [
    { e:"🌐", n:"Site Web Vitrine", price:pr.vitrine, delay:"2-3 semaines",
      color:"#2E9B8B", items:["5 pages personnalisées","Design sur mesure","Mobile-friendly","SEO de base","Google Analytics"] },
    { e:"📄", n:"One-Page", price:pr.onepage, delay:"5-7 jours",
      color:"#1A5FA8", badge:"⚡ RAPIDE", items:["1 page complète","Hero+Services+Contact","Mobile-friendly","Livraison express"] },
    { e:"🛒", n:"E-Commerce", price:pr.ecommerce, delay:"4-6 semaines",
      color:"#6B3FA0", items:["Catalogue illimité","Paiement Stripe","Mobile Money (Afrique)","Dashboard vendeur"] },
    { e:"🎯", n:"Landing Page", price:pr.landing, delay:"1 semaine",
      color:"#E07B39", items:["Design orienté conversion","Formulaire capture","Analytics avancés","CTA optimisés"] },
    { e:"🎨", n:"Identité Visuelle", price:pr.identite, delay:"1-2 semaines",
      color:"#C0627A", items:["Logo (3 propositions)","Palette couleurs","Charte graphique PDF","Fichiers sources AI/SVG"] },
    { e:"🛠️", n:"Maintenance", price:pr.maintenance, delay:"3 mois min",
      color:"#2E9B8B", badge:"🔁 RÉCURRENT", items:["Mises à jour","Sauvegardes hebdo","2h modifications/mois","Support WhatsApp"] },
  ];
  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      <div style={{ display:"flex", justifyContent:"space-between",
        alignItems:"flex-end", marginBottom:"36px", flexWrap:"wrap", gap:"16px" }}>
        <div>
          <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
            color:t.textSecondary, marginBottom:"10px" }}>CRÉATION WEB & IDENTITÉ</p>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"36px",
            fontWeight:200, color:t.textPrimary }}>
            Sites web <em style={{ color:t.accent, fontStyle:"normal" }}>professionnels</em>
          </h1>
          <p style={{ fontSize:"14px", color:t.textSecondary, marginTop:"4px" }}>
            Tarifs {mode==="af" ? "adaptés Afrique" : "marché français"} · Livraison rapide
          </p>
        </div>
        <button onClick={() => setPage("maquette")}
          style={{ padding:"12px 22px", background:t.btnAccent, border:"none",
            borderRadius:"10px", color:t.btnAccentText, fontSize:"13px",
            fontWeight:700, cursor:"pointer" }}>
          🤖 Générer ma maquette →
        </button>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(2,1fr)", gap:"14px" }}>
        {services.map(sv => (
          <div key={sv.n} style={{ padding:"22px", background:"#fff",
            border:`1px solid ${t.border}`, borderRadius:"14px",
            borderLeft:`3px solid ${sv.color}`, position:"relative" }}>
            {sv.badge && (
              <div style={{ position:"absolute", top:"-9px", right:"14px",
                background:sv.color, padding:"2px 10px", borderRadius:"10px",
                fontSize:"9px", fontWeight:700, color:"#fff" }}>{sv.badge}</div>
            )}
            <div style={{ display:"flex", justifyContent:"space-between",
              alignItems:"flex-start", marginBottom:"12px" }}>
              <div style={{ display:"flex", gap:"10px", alignItems:"center" }}>
                <span style={{ fontSize:"22px" }}>{sv.e}</span>
                <div>
                  <p style={{ fontFamily:"Georgia, serif", fontSize:"17px",
                    color:t.textPrimary }}>{sv.n}</p>
                  <p style={{ fontFamily:"monospace", fontSize:"9px",
                    color:t.textSecondary }}>⏱ {sv.delay}</p>
                </div>
              </div>
              <p style={{ fontFamily:"Georgia, serif", fontSize:"16px", color:sv.color }}>{sv.price}</p>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"4px" }}>
              {sv.items.map((item,i) => (
                <div key={i} style={{ display:"flex", gap:"5px" }}>
                  <span style={{ color:sv.color, fontSize:"11px" }}>✓</span>
                  <span style={{ fontSize:"11px", color:t.textSecondary }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PLATFORM PAGE
// ═══════════════════════════════════════════════════════
function PlatformPage({ setPage }) {
  const { t } = useContext(Ctx);
  const tools = [
    { e:"📊", n:"Audit Digital", d:"Score maturité /100 sur 5 dimensions", free:true, page:"audit" },
    { e:"💰", n:"Calculateur ROI", d:"Retour sur investissement estimé", free:true, page:"platform" },
    { e:"🤖", n:"Maquette IA", d:"Visualisez votre site en 2 minutes", free:true, page:"maquette" },
    { e:"📋", n:"Business Plan IA", d:"Plan complet + benchmark marché", free:false, page:"pricing" },
    { e:"🗺️", n:"Roadmap 12 mois", d:"Plan d'action digital complet", free:false, page:"pricing" },
    { e:"🔍", n:"Veille Concurrentielle", d:"Analysez marché et concurrents", free:false, page:"pricing" },
    { e:"📄", n:"Cahier des Charges", d:"Document professionnel complet", free:false, page:"pricing" },
    { e:"💸", n:"Simulateur Budget", d:"Estimez votre projet digital", free:false, page:"pricing" },
  ];
  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
        color:t.textSecondary, marginBottom:"10px" }}>PLATEFORME SAAS</p>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:"36px",
        fontWeight:200, color:t.textPrimary, marginBottom:"8px" }}>
        8 outils IA pour <em style={{ color:t.accent, fontStyle:"normal" }}>transformer votre business</em>
      </h1>
      <p style={{ fontSize:"15px", color:t.textSecondary, marginBottom:"36px", lineHeight:1.7 }}>
        3 outils gratuits pour découvrir · Premium pour accès illimité
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"12px", marginBottom:"32px" }}>
        {tools.map(tool => (
          <div key={tool.n} onClick={() => setPage(tool.page)}
            style={{ padding:"18px", background:"#fff", border:`1px solid ${t.border}`,
              borderRadius:"12px", cursor:"pointer",
              borderLeft:`3px solid ${tool.free ? t.accent : "#9B8E6B"}`,
              transition:"transform 0.15s" }}>
            <span style={{ fontSize:"22px", display:"block", marginBottom:"8px" }}>{tool.e}</span>
            <p style={{ fontSize:"12px", fontWeight:600, color:t.textPrimary, marginBottom:"4px" }}>{tool.n}</p>
            <p style={{ fontSize:"10px", color:t.textSecondary, lineHeight:1.5, marginBottom:"8px" }}>{tool.d}</p>
            <span style={{ padding:"2px 8px", borderRadius:"5px", fontSize:"9px", fontWeight:700,
              background:tool.free ? "rgba(46,125,82,0.08)" : "rgba(155,142,107,0.1)",
              color:tool.free ? "#2E7D52" : "#7A6E42" }}>
              {tool.free ? "GRATUIT" : "PREMIUM"}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px" }}>
        <div style={{ padding:"24px", background:"#fff", border:`1px solid ${t.border}`,
          borderRadius:"14px", borderTop:`3px solid ${t.accent}` }}>
          <p style={{ fontFamily:"Georgia, serif", fontSize:"22px", color:t.textPrimary, marginBottom:"4px" }}>🌱 Plan Gratuit</p>
          <p style={{ fontFamily:"Georgia, serif", fontSize:"28px", color:t.accent, marginBottom:"8px" }}>0€</p>
          <p style={{ fontSize:"13px", color:t.textSecondary, marginBottom:"16px" }}>
            Audit · ROI · Maquette (3/mois)
          </p>
          <button onClick={() => setPage("audit")}
            style={{ width:"100%", padding:"11px", background:"transparent",
              border:`1px solid ${t.accent}`, borderRadius:"8px",
              color:t.accent, fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
            Commencer gratuitement →
          </button>
        </div>
        <div style={{ padding:"24px", background:t.navyBg,
          borderRadius:"14px" }}>
          <p style={{ fontFamily:"Georgia, serif", fontSize:"22px",
            color:t.textOnNavy, marginBottom:"4px" }}>🚀 Plan Premium</p>
          <p style={{ fontFamily:"Georgia, serif", fontSize:"28px",
            color:t.accent, marginBottom:"8px" }}>29€<span style={{ fontSize:"13px",
            color:t.textMuted }}>/mois</span></p>
          <p style={{ fontSize:"13px", color:t.textMuted, marginBottom:"16px" }}>
            Tous les outils illimités + Export PDF + Support
          </p>
          <button onClick={() => setPage("pricing")}
            style={{ width:"100%", padding:"11px", background:t.accent,
              border:"none", borderRadius:"8px", color:"#fff",
              fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
            Passer Premium →
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// PRICING PAGE
// ═══════════════════════════════════════════════════════
function PricingPage({ setPage }) {
  const { t } = useContext(Ctx);
  const [billing, setBilling] = useState("monthly");
  const plans = [
    { name:"Gratuit", price:"0€", period:"", color:t.accent,
      items:["Audit digital (illimité)","Calculateur ROI","Maquette IA (3/mois)","Articles & ressources"],
      cta:"Commencer", onCta:() => setPage("audit") },
    { name:"Premium", price:billing==="annual"?"20€":"29€", period:"/mois",
      badge:"POPULAIRE", color:"#9B8E6B",
      items:["Tous les outils illimités","Business Plan IA","Roadmap + Veille","CDC + Budget","Export PDF","Support WhatsApp"],
      cta:"Passer Premium", filled:true, onCta:() => setPage("contact") },
    { name:"Consulting", price:"400€+", period:"/mois", color:"#6B3FA0",
      items:["Tout Premium inclus","Sessions Zoom mensuelles","Rapport personnalisé","WhatsApp direct"],
      cta:"Prendre RDV", onCta:() => setPage("contact") },
  ];
  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh", textAlign:"center" }}>
      <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
        color:t.textSecondary, marginBottom:"10px" }}>PLATEFORME NEXALIE</p>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:"36px",
        fontWeight:200, color:t.textPrimary, marginBottom:"8px" }}>
        Tarifs <em style={{ color:t.accent, fontStyle:"normal" }}>simples et transparents</em>
      </h1>
      <div style={{ display:"inline-flex", background:t.sectionBg,
        border:`1px solid ${t.border}`, borderRadius:"10px", overflow:"hidden",
        margin:"24px 0 40px" }}>
        {[["monthly","Mensuel"],["annual","Annuel — 2 mois offerts"]].map(([id,label]) => (
          <button key={id} onClick={() => setBilling(id)}
            style={{ padding:"10px 24px",
              background:billing===id ? t.accent : "transparent",
              border:"none", color:billing===id ? "#fff" : t.textSecondary,
              fontSize:"13px", fontWeight:billing===id ? 700 : 400,
              cursor:"pointer", transition:"all 0.2s" }}>{label}</button>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.15fr 1fr",
        gap:"14px", textAlign:"left" }}>
        {plans.map((plan,i) => (
          <div key={plan.name} style={{ padding:"24px", background:"#fff",
            border:`${i===1 ? "2px" : "1px"} solid ${i===1 ? t.accent : t.border}`,
            borderRadius:"16px", position:"relative",
            transform:i===1 ? "scale(1.02)" : "scale(1)" }}>
            {plan.badge && (
              <div style={{ position:"absolute", top:"-11px", left:"50%",
                transform:"translateX(-50%)", background:t.navyBg,
                padding:"3px 14px", borderRadius:"15px", fontSize:"9px",
                fontWeight:700, color:"#fff", whiteSpace:"nowrap" }}>{plan.badge}</div>
            )}
            <p style={{ fontFamily:"Georgia, serif", fontSize:"20px",
              color:t.textPrimary, marginBottom:"8px" }}>{plan.name}</p>
            <div style={{ marginBottom:"16px" }}>
              <span style={{ fontFamily:"Georgia, serif", fontSize:"32px",
                color:plan.color }}>{plan.price}</span>
              <span style={{ fontSize:"13px", color:t.textSecondary }}>{plan.period}</span>
            </div>
            {plan.items.map((item,j) => (
              <div key={j} style={{ display:"flex", gap:"7px", marginBottom:"6px" }}>
                <span style={{ color:"#2E7D52", fontSize:"12px" }}>✓</span>
                <span style={{ fontSize:"12px", color:t.textSecondary }}>{item}</span>
              </div>
            ))}
            <button onClick={plan.onCta}
              style={{ width:"100%", marginTop:"16px", padding:"11px",
                background:plan.filled ? t.navyBg : "transparent",
                border:`1px solid ${plan.filled ? t.navyBg : t.border}`,
                borderRadius:"8px",
                color:plan.filled ? "#fff" : t.textSecondary,
                fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
              {plan.cta} →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ABOUT PAGE
// ═══════════════════════════════════════════════════════
function AboutPage({ setPage }) {
  const { t } = useContext(Ctx);
  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      <div style={{ display:"grid", gridTemplateColumns:"280px 1fr",
        gap:"60px", alignItems:"start" }}>
        <div>
          <div style={{ width:"100%", aspectRatio:"1", background:t.sectionBg,
            borderRadius:"20px", border:`1px solid ${t.border}`,
            display:"flex", alignItems:"center", justifyContent:"center",
            marginBottom:"20px" }}>
            <span style={{ fontFamily:"Georgia, serif", fontSize:"64px",
              color:t.textSecondary, fontWeight:300, opacity:0.3 }}>N</span>
          </div>
          <p style={{ fontFamily:"Georgia, serif", fontSize:"22px",
            color:t.textPrimary, marginBottom:"4px" }}>Nexalie</p>
          <p style={{ fontFamily:"monospace", fontSize:"10px", color:t.accent,
            letterSpacing:"1px", marginBottom:"16px" }}>
            TRANSFORMATION DIGITALE · IA
          </p>
          {["📍 France & Afrique","💬 FR · EN · Lingala","✉️ nexali.ai"].map(info => (
            <p key={info} style={{ fontSize:"13px", color:t.textSecondary,
              marginBottom:"5px" }}>{info}</p>
          ))}
          <button onClick={() => setPage("contact")}
            style={{ width:"100%", marginTop:"16px", padding:"12px",
              background:t.btnPrimary, border:"none", borderRadius:"10px",
              color:t.btnPrimaryText, fontSize:"13px", fontWeight:700, cursor:"pointer" }}>
            Nous contacter →
          </button>
        </div>
        <div>
          <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
            color:t.textSecondary, marginBottom:"10px" }}>LA PLATEFORME</p>
          <h1 style={{ fontFamily:"Georgia, serif", fontSize:"34px",
            fontWeight:200, color:t.textPrimary, marginBottom:"16px" }}>
            Un pont entre <em style={{ color:t.accent, fontStyle:"normal" }}>deux mondes</em>
          </h1>
          <p style={{ fontSize:"15px", color:t.textSecondary, lineHeight:1.9, marginBottom:"28px" }}>
            Nexalie est née d'un constat simple : les PME africaines ont un potentiel digital
            énorme, mais manquent d'outils adaptés à leur réalité. Les outils européens sont
            trop chers ou mal calibrés. Nexalie comble ce fossé avec une IA qui comprend les
            deux marchés.
          </p>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px" }}>
            {[["🎯","Transformation digitale","Roadmaps & stratégie"],
              ["🤖","IA & Automatisation","Claude, Make, Zapier"],
              ["📊","Data & Analytics","Power BI, KPIs"],
              ["🌍","Double culture","Paris ↔ Abidjan ↔ Brazzaville"]].map(([e,title,sub]) => (
              <div key={title} style={{ padding:"14px", background:t.sectionBg,
                borderRadius:"10px", border:`1px solid ${t.border}` }}>
                <p style={{ fontSize:"18px", marginBottom:"5px" }}>{e}</p>
                <p style={{ fontSize:"12px", fontWeight:600, color:t.textPrimary, marginBottom:"2px" }}>{title}</p>
                <p style={{ fontSize:"11px", color:t.textSecondary }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// CONTACT PAGE
// ═══════════════════════════════════════════════════════
function ContactPage() {
  const { t } = useContext(Ctx);
  const [form, setForm] = useState({ name:"", email:"", subject:"", message:"" });
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) {
      setToast({ message:"⚠️ Remplissez tous les champs obligatoires.", type:"error" });
      return;
    }
    const msg = encodeURIComponent(
      `Bonjour,\n\nNom: ${form.name}\nEmail: ${form.email}\nSujet: ${form.subject}\n\n${form.message}`);
    window.open(`https://wa.me/33786620409?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div style={{ maxWidth:"900px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh" }}>
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
      <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
        color:t.textSecondary, marginBottom:"10px" }}>CONTACT</p>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:"36px",
        fontWeight:200, color:t.textPrimary, marginBottom:"8px" }}>
        Parlons de <em style={{ color:t.accent, fontStyle:"normal" }}>votre projet</em>
      </h1>
      <p style={{ fontSize:"15px", color:t.textSecondary, marginBottom:"40px" }}>
        Réponse garantie sous 24h · WhatsApp disponible
      </p>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1.5fr", gap:"40px" }}>
        <div>
          {[["✉️","Email","nexali.ai"],["📱","WhatsApp","+33 7 86 62 04 09"],
            ["🌐","Site","nexali.ai"]].map(([e,l,v]) => (
            <div key={l} style={{ padding:"14px", background:"#fff",
              border:`1px solid ${t.border}`, borderRadius:"10px", marginBottom:"10px" }}>
              <p style={{ fontSize:"10px", color:t.textSecondary,
                fontFamily:"monospace", marginBottom:"3px" }}>{e} {l.toUpperCase()}</p>
              <p style={{ fontSize:"14px", color:t.accent }}>{v}</p>
            </div>
          ))}
          <a href="https://wa.me/33786620409" target="_blank" rel="noreferrer"
            style={{ display:"block", textDecoration:"none", width:"100%",
              marginTop:"8px", padding:"13px", background:"#25D366",
              borderRadius:"10px", color:"#fff", fontSize:"14px",
              fontWeight:700, textAlign:"center" }}>
            💬 WhatsApp direct
          </a>
        </div>
        {sent ? (
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center",
            flexDirection:"column", padding:"40px", background:"#fff",
            border:`1px solid ${t.border}`, borderRadius:"16px", textAlign:"center" }}>
            <span style={{ fontSize:"48px", marginBottom:"16px" }}>✅</span>
            <p style={{ fontFamily:"Georgia, serif", fontSize:"22px",
              color:t.textPrimary, marginBottom:"8px" }}>Message envoyé !</p>
            <p style={{ fontSize:"14px", color:t.textSecondary }}>Réponse sous 24h.</p>
          </div>
        ) : (
          <div style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            {[["Nom complet *","name","text","Votre nom"],
              ["Email *","email","email","votre@email.com"],
              ["Sujet","subject","text","Objet de votre demande"]].map(([label,key,type,ph]) => (
              <div key={key}>
                <label style={{ display:"block", fontFamily:"monospace", fontSize:"10px",
                  color:t.textSecondary, marginBottom:"5px" }}>{label.toUpperCase()}</label>
                <input value={form[key]}
                  onChange={e => setForm(p => ({...p,[key]:e.target.value}))}
                  placeholder={ph} type={type}
                  style={{ width:"100%", padding:"11px 14px", background:"#fff",
                    border:`1px solid ${t.border}`, borderRadius:"8px",
                    color:t.textPrimary, fontSize:"13px", outline:"none" }} />
              </div>
            ))}
            <div>
              <label style={{ display:"block", fontFamily:"monospace", fontSize:"10px",
                color:t.textSecondary, marginBottom:"5px" }}>MESSAGE *</label>
              <textarea value={form.message}
                onChange={e => setForm(p => ({...p,message:e.target.value}))}
                rows={5} placeholder="Décrivez votre projet..."
                style={{ width:"100%", padding:"11px 14px", background:"#fff",
                  border:`1px solid ${t.border}`, borderRadius:"8px",
                  color:t.textPrimary, fontSize:"13px", resize:"vertical", outline:"none" }} />
            </div>
            <button onClick={handleSubmit}
              style={{ padding:"13px", background:t.btnPrimary, border:"none",
                borderRadius:"10px", color:t.btnPrimaryText,
                fontSize:"14px", fontWeight:700, cursor:"pointer" }}>
              Envoyer →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAQUETTE PAGE — placeholder pour dev
// ═══════════════════════════════════════════════════════
function MaquettePage() {
  const { t } = useContext(Ctx);
  return (
    <div style={{ maxWidth:"720px", margin:"0 auto", padding:"48px 40px",
      background:t.pageBg, minHeight:"100vh", textAlign:"center" }}>
      <p style={{ fontFamily:"monospace", fontSize:"10px", letterSpacing:"3px",
        color:t.textSecondary, marginBottom:"10px" }}>OUTIL GRATUIT</p>
      <h1 style={{ fontFamily:"Georgia, serif", fontSize:"32px",
        fontWeight:200, color:t.textPrimary, marginBottom:"12px" }}>
        Générateur de <em style={{ color:t.accent, fontStyle:"normal" }}>maquette IA</em>
      </h1>
      <p style={{ fontSize:"15px", color:t.textSecondary, marginBottom:"28px", lineHeight:1.7 }}>
        Décrivez votre projet — l'IA génère la maquette de votre site en 2 minutes.
      </p>
      <div style={{ padding:"28px", background:"#fff",
        border:`1px solid ${t.border}`, borderRadius:"16px" }}>
        <p style={{ fontSize:"13px", color:t.textSecondary, marginBottom:"16px" }}>
          Composant <code>nexali_mockup_generator.jsx</code> intégré ici par le développeur.
        </p>
        <button style={{ padding:"14px 32px", background:t.btnAccent, border:"none",
          borderRadius:"10px", color:t.btnAccentText, fontSize:"15px",
          fontWeight:700, cursor:"pointer" }}>
          Générer ma maquette →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════════════
export default function App() {
  const [mode, setMode] = useState("fr");
  const [page, setPage] = useState("home");
  const [toast, setToast] = useState(null);
  const t = THEMES[mode];

  useEffect(() => { window.scrollTo(0,0); }, [page]);

  return (
    <Ctx.Provider value={{ mode, setMode, t }}>
      <div style={{ minHeight:"100vh", background:t.pageBg, fontFamily:"sans-serif" }}>
        <style>{`
          * { box-sizing:border-box; margin:0; padding:0; }
          input, textarea, select { outline:none !important; }
          ::placeholder { color:rgba(0,0,0,0.25) !important; }
          ::-webkit-scrollbar { width:4px; }
          ::-webkit-scrollbar-thumb { background:rgba(0,0,0,0.1); border-radius:2px; }
          button { transition:opacity 0.15s, transform 0.1s; font-family:sans-serif; }
          button:hover:not(:disabled) { opacity:0.88; }
          button:active:not(:disabled) { transform:scale(0.98); }
          @keyframes spin { to { transform:rotate(360deg); } }
          @keyframes slideIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
          @keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
          @media (max-width:768px) {
            nav > div > div:nth-child(2) { display:none !important; }
          }
        `}</style>
        {toast && <Toast {...toast} onClose={() => setToast(null)} />}
        <Nav page={page} setPage={setPage} />
        <div key={page} style={{ animation:"fadeIn 0.35s ease" }}>
          {page==="home"     && <HomePage setPage={setPage} />}
          {page==="offers"   && <OffersPage setPage={setPage} />}
          {page==="services" && <ServicesPage setPage={setPage} />}
          {page==="platform" && <PlatformPage setPage={setPage} />}
          {page==="about"    && <AboutPage setPage={setPage} />}
          {page==="contact"  && <ContactPage />}
          {page==="pricing"  && <PricingPage setPage={setPage} />}
          {page==="audit"    && <AuditPage setPage={setPage} />}
          {page==="maquette" && <MaquettePage />}
        </div>
      </div>
    </Ctx.Provider>
  );
}
