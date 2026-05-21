import { useState, useEffect, useRef } from "react";

const DIMS = [
  {
    id: "strategie",
    icon: "◈",
    label: "Stratégie & Vision",
    color: "#E8C547",
    desc: "Alignement digital avec les objectifs business",
    questions: [
      "La direction a-t-elle défini une vision digitale claire pour l'entreprise ?",
      "Existe-t-il un budget dédié à la transformation digitale ?",
      "Les objectifs digitaux sont-ils mesurés avec des KPIs réguliers ?",
      "La direction participe-t-elle activement aux initiatives digitales ?",
    ]
  },
  {
    id: "client",
    icon: "◉",
    label: "Expérience Client",
    color: "#4EC9B0",
    desc: "Qualité des interactions digitales avec vos clients",
    questions: [
      "Vos clients peuvent-ils vous contacter ou commander en ligne ?",
      "Collectez-vous et analysez-vous les retours clients digitalement ?",
      "Proposez-vous des communications personnalisées à vos clients ?",
      "Votre présence en ligne reflète-t-elle votre image professionnelle ?",
    ]
  },
  {
    id: "operations",
    icon: "◐",
    label: "Opérations & Processus",
    color: "#C586C0",
    desc: "Efficience et automatisation des processus internes",
    questions: [
      "Vos processus clés (facturation, devis, suivi) sont-ils digitalisés ?",
      "Utilisez-vous des outils de gestion de projet digital ?",
      "Certaines tâches répétitives sont-elles automatisées ?",
      "Vos données sont-elles centralisées et accessibles à votre équipe ?",
    ]
  },
  {
    id: "technologie",
    icon: "◎",
    label: "Technologies & Outils",
    color: "#569CD6",
    desc: "Maturité de votre infrastructure technologique",
    questions: [
      "Utilisez-vous un logiciel de gestion (ERP, CRM) adapté à votre taille ?",
      "Vos données sont-elles sauvegardées et sécurisées dans le cloud ?",
      "Vos équipes ont-elles accès aux outils collaboratifs nécessaires ?",
      "Disposez-vous d'outils d'analyse de données ou de tableaux de bord ?",
    ]
  },
  {
    id: "culture",
    icon: "◑",
    label: "Culture & Compétences",
    color: "#CE9178",
    desc: "Capacité humaine à soutenir la transformation",
    questions: [
      "Vos équipes sont-elles formées aux outils digitaux utilisés ?",
      "Y a-t-il un référent ou responsable digital dans votre structure ?",
      "L'innovation et l'expérimentation sont-elles encouragées ?",
      "L'intelligence artificielle est-elle intégrée dans certains processus ?",
    ]
  },
];

const LEVELS = [
  { min: 0, max: 19, id: "initiale", label: "Initiale", sub: "Phase de sensibilisation", color: "#CE9178", radar: 15 },
  { min: 20, max: 39, id: "emergente", label: "Émergente", sub: "Premières initiatives", color: "#E8C547", radar: 35 },
  { min: 40, max: 59, id: "structuree", label: "Structurée", sub: "Pratiques établies", color: "#4EC9B0", radar: 60 },
  { min: 60, max: 79, id: "optimisee", label: "Optimisée", sub: "Intégration avancée", color: "#569CD6", radar: 80 },
  { min: 80, max: 100, id: "leader", label: "Leader", sub: "Excellence digitale", color: "#C586C0", radar: 95 },
];

const PRIORITIES = {
  strategie: {
    initiale: ["Organiser un atelier de vision digitale avec la direction (2h)", "Définir 3 objectifs digitaux prioritaires pour l'année", "Allouer un budget minimal dédié au digital (5% du CA)"],
    emergente: ["Créer un tableau de bord de suivi des KPIs digitaux", "Nommer un référent digital au sein de l'équipe dirigeante", "Établir une roadmap digitale sur 12 mois"],
    structuree: ["Intégrer la stratégie digitale dans le plan business annuel", "Mettre en place des revues trimestrielles de performance digitale"],
    optimisee: ["Explorer les opportunités de nouveaux modèles business digitaux", "Développer des partenariats technologiques stratégiques"],
    leader: ["Devenir un cas d'usage de référence dans votre secteur", "Partager votre expertise et inspirer l'écosystème local"],
  },
  client: {
    initiale: ["Créer une page Google My Business (gratuit, 30 min)", "Ouvrir un compte WhatsApp Business professionnel", "Lancer une page Facebook ou Instagram professionnelle"],
    emergente: ["Créer un site web vitrine simple et mobile-friendly", "Mettre en place un système de collecte d'avis clients", "Lancer une newsletter mensuelle (Mailchimp gratuit)"],
    structuree: ["Développer une stratégie de contenu digital cohérente", "Personnaliser les communications selon les segments clients"],
    optimisee: ["Implémenter un CRM pour suivre le parcours client", "Lancer des campagnes marketing digital ciblées"],
    leader: ["Déployer un chatbot IA de service client", "Créer une communauté digitale autour de votre marque"],
  },
  operations: {
    initiale: ["Digitaliser la facturation (Wave ou Zoho Invoice — gratuit)", "Adopter Google Drive pour le partage de documents", "Utiliser Trello ou Notion pour le suivi des tâches (gratuit)"],
    emergente: ["Standardiser et documenter les processus clés", "Mettre en place un outil de gestion de projet pour l'équipe", "Automatiser les relances clients et fournisseurs"],
    structuree: ["Intégrer les outils entre eux pour éviter les doubles saisies", "Créer des rapports d'activité semi-automatiques"],
    optimisee: ["Déployer Make ou Zapier pour automatiser les workflows", "Mettre en place un ERP adapté à votre secteur"],
    leader: ["Expérimenter l'IA pour optimiser les processus opérationnels", "Mesurer le ROI de chaque automatisation en place"],
  },
  technologie: {
    initiale: ["Adopter Google Workspace ou Microsoft 365 (suite collaborative)", "Mettre en place une sauvegarde cloud systématique", "Établir une politique de cybersécurité de base"],
    emergente: ["Déployer un CRM simple (HubSpot Free)", "Former l'équipe aux outils collaboratifs déployés", "Évaluer les solutions ERP adaptées à votre taille"],
    structuree: ["Intégrer vos outils dans un écosystème cohérent", "Mettre en place un tableau de bord KPIs (Power BI)"],
    optimisee: ["Explorer les APIs et intégrations avancées", "Déployer des outils d'analyse de données en temps réel"],
    leader: ["Expérimenter l'IA générative dans les processus métiers", "Développer des solutions sur mesure si nécessaire"],
  },
  culture: {
    initiale: ["Organiser une session de sensibilisation au digital (2h)", "Identifier les collaborateurs les plus à l'aise avec le digital", "Commencer par 1 seul outil et le maîtriser avant d'en ajouter"],
    emergente: ["Nommer un référent digital et définir sa mission", "Lancer un programme de formation digitale interne", "Célébrer les succès digitaux même petits"],
    structuree: ["Intégrer les compétences digitales dans les fiches de poste", "Former l'équipe aux outils IA les plus utiles à leur métier"],
    optimisee: ["Créer une culture d'expérimentation et de test & learn", "Développer un programme de montée en compétences continu"],
    leader: ["Devenir un employeur attractif pour les talents digitaux", "Contribuer à la formation de l'écosystème digital local"],
  },
};

function RadarChart({ scores, size = 220 }) {
  const cx = size / 2, cy = size / 2;
  const r = size * 0.38;
  const n = DIMS.length;
  const angle = (i) => (Math.PI * 2 * i) / n - Math.PI / 2;

  const rings = [0.2, 0.4, 0.6, 0.8, 1.0];
  const pts = (scale) => DIMS.map((_, i) => {
    const a = angle(i);
    return [cx + Math.cos(a) * r * scale, cy + Math.sin(a) * r * scale];
  });

  const dataPoints = DIMS.map((d, i) => {
    const a = angle(i);
    const v = (scores[d.id] || 0) / (d.questions.length * 2);
    return [cx + Math.cos(a) * r * v, cy + Math.sin(a) * r * v];
  });

  const toPath = (pts) => pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ") + " Z";

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((s, ri) => (
        <polygon key={ri} points={pts(s).map(p => p.join(",")).join(" ")}
          fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {DIMS.map((_, i) => {
        const [x, y] = pts(1)[i];
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="1" />;
      })}
      <polygon points={dataPoints.map(p => p.join(",")).join(" ")}
        fill="rgba(78,201,176,0.15)" stroke="#4EC9B0" strokeWidth="1.5" />
      {dataPoints.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="3" fill={DIMS[i].color} />
      ))}
      {DIMS.map((d, i) => {
        const a = angle(i);
        const lx = cx + Math.cos(a) * (r + 22);
        const ly = cy + Math.sin(a) * (r + 22);
        return (
          <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
            fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="'IBM Plex Mono', monospace">
            {d.icon}
          </text>
        );
      })}
    </svg>
  );
}

function ScoreBar({ value, max, color }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div style={{ position: "relative", height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
      <div style={{ position: "absolute", left: 0, top: 0, height: "100%", width: `${pct}%`, background: color, borderRadius: "2px", transition: "width 1s ease" }} />
    </div>
  );
}

export default function App() {
  const [phase, setPhase] = useState("intro");
  const [company, setCompany] = useState("");
  const [sector, setSector] = useState("");
  const [dimIdx, setDimIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [animIn, setAnimIn] = useState(true);
  const containerRef = useRef();

  const dim = DIMS[dimIdx];
  const totalQ = DIMS.reduce((s, d) => s + d.questions.length, 0);
  const answeredQ = Object.keys(answers).length;

  const getDimScore = (d) => d.questions.reduce((s, q) => s + (answers[`${d.id}_${d.questions.indexOf(q)}`] ?? 0), 0);
  const totalScore = DIMS.reduce((s, d) => s + getDimScore(d), 0);
  const maxTotal = totalQ * 2;
  const pctTotal = Math.round((totalScore / maxTotal) * 100);
  const level = LEVELS.find(l => pctTotal >= l.min && pctTotal <= l.max) || LEVELS[0];

  const setAnswer = (qIdx, val) => setAnswers(p => ({ ...p, [`${dim.id}_${qIdx}`]: val }));
  const getAnswer = (qIdx) => answers[`${dim.id}_${qIdx}`];

  const dimAnswered = (d) => d.questions.every((_, i) => answers[`${d.id}_${i}`] !== undefined);
  const canNext = dimAnswered(dim);

  const go = (next) => {
    setAnimIn(false);
    setTimeout(() => { setDimIdx(next); setAnimIn(true); }, 200);
  };

  const scores = {};
  DIMS.forEach(d => { scores[d.id] = getDimScore(d); });

  useEffect(() => { setAnimIn(true); }, []);

  const BG = "radial-gradient(ellipse at 20% 20%, #0a1628 0%, #080f1e 60%, #050a14 100%)";

  if (phase === "intro") return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        input:focus { outline: none; border-color: rgba(78,201,176,0.5) !important; }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(78,201,176,0.3); }
        .dim-card:hover { border-color: rgba(255,255,255,0.12) !important; background: rgba(255,255,255,0.04) !important; }
      `}</style>
      <div style={{ maxWidth: "520px", width: "100%", animation: "fadeIn 0.8s ease", opacity: animIn ? 1 : 0, transition: "opacity 0.3s" }}>
        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "3px", color: "rgba(78,201,176,0.7)", marginBottom: "16px", textTransform: "uppercase" }}>Nexalie Consulting — Assessment Framework</p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(32px, 6vw, 48px)", fontWeight: 300, color: "#fff", lineHeight: 1.15, marginBottom: "16px" }}>
            Maturité<br /><em style={{ color: "#4EC9B0" }}>Digitale</em>
          </h1>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.35)", lineHeight: 1.7, maxWidth: "380px" }}>
            Un diagnostic structuré en 5 dimensions pour identifier vos leviers de transformation prioritaires.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "32px" }}>
          {DIMS.map(d => (
            <div key={d.id} className="dim-card" style={{ padding: "14px 16px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", background: "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "16px", color: d.color, marginRight: "8px" }}>{d.icon}</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{d.label}</span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "24px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <input value={company} onChange={e => setCompany(e.target.value)} placeholder="Nom de votre entreprise"
            style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", transition: "border-color 0.2s" }} />
          <input value={sector} onChange={e => setSector(e.target.value)} placeholder="Secteur d'activité"
            style={{ padding: "14px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", transition: "border-color 0.2s" }} />
        </div>

        <button className="btn-primary" onClick={() => setPhase("audit")}
          style={{ width: "100%", padding: "16px", background: "#4EC9B0", color: "#080f1e", borderRadius: "10px", border: "none", fontSize: "14px", fontWeight: "600", cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.2s" }}>
          Démarrer l'évaluation →
        </button>

        <div style={{ display: "flex", gap: "24px", justifyContent: "center", marginTop: "24px" }}>
          {["20 questions", "5 dimensions", "Plan d'action"].map(t => (
            <span key={t} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );

  if (phase === "audit") return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'IBM Plex Sans', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .ans-btn { transition: all 0.15s ease !important; }
        .ans-btn:hover { transform: translateX(3px); }
        .nav-btn:hover { opacity: 0.8; }
      `}</style>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "40px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.2)", letterSpacing: "2px" }}>NEXALIE</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>{answeredQ}/{totalQ}</span>
        </div>

        {/* Dimension tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "32px", flexWrap: "wrap" }}>
          {DIMS.map((d, i) => (
            <button key={d.id} onClick={() => go(i)}
              style={{ padding: "6px 12px", borderRadius: "6px", border: `1px solid ${i === dimIdx ? d.color : "rgba(255,255,255,0.06)"}`, background: i === dimIdx ? `${d.color}18` : "transparent", color: i === dimIdx ? d.color : "rgba(255,255,255,0.25)", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", letterSpacing: "0.5px", transition: "all 0.2s" }}>
              {d.icon} {dimAnswered(d) ? "✓" : i + 1}
            </button>
          ))}
        </div>

        {/* Question card */}
        <div style={{ opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(10px)", transition: "all 0.25s ease" }}>
          <div style={{ marginBottom: "8px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: dim.color, textTransform: "uppercase" }}>Dimension {dimIdx + 1} / {DIMS.length}</span>
          </div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>{dim.label}</h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "32px" }}>{dim.desc}</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {dim.questions.map((q, qi) => (
              <div key={qi} style={{ padding: "20px", border: `1px solid ${getAnswer(qi) !== undefined ? dim.color + "40" : "rgba(255,255,255,0.06)"}`, borderRadius: "12px", background: getAnswer(qi) !== undefined ? `${dim.color}08` : "rgba(255,255,255,0.02)", transition: "all 0.2s" }}>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", lineHeight: 1.6, marginBottom: "16px" }}>{q}</p>
                <div style={{ display: "flex", gap: "8px" }}>
                  {[[2, "Oui", dim.color], [1, "Partiel", "rgba(232,197,71,0.8)"], [0, "Non", "rgba(255,255,255,0.2)"]].map(([val, label, col]) => (
                    <button key={val} className="ans-btn" onClick={() => setAnswer(qi, val)}
                      style={{ flex: 1, padding: "9px 8px", borderRadius: "8px", border: `1px solid ${getAnswer(qi) === val ? col : "rgba(255,255,255,0.06)"}`, background: getAnswer(qi) === val ? `${col}20` : "transparent", color: getAnswer(qi) === val ? col : "rgba(255,255,255,0.25)", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", fontWeight: getAnswer(qi) === val ? "500" : "400", letterSpacing: "0.3px" }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "32px", gap: "12px" }}>
            {dimIdx > 0 ? (
              <button className="nav-btn" onClick={() => go(dimIdx - 1)}
                style={{ padding: "12px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", transition: "opacity 0.2s" }}>
                ← Précédent
              </button>
            ) : <div />}

            {dimIdx < DIMS.length - 1 ? (
              <button className="nav-btn" onClick={() => canNext && go(dimIdx + 1)}
                style={{ padding: "12px 28px", background: canNext ? dim.color : "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px", color: canNext ? "#080f1e" : "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: "600", cursor: canNext ? "pointer" : "default", transition: "all 0.2s" }}>
                Suivant →
              </button>
            ) : (
              <button className="nav-btn" onClick={() => answeredQ === totalQ && setPhase("results")}
                style={{ padding: "12px 28px", background: answeredQ === totalQ ? "#4EC9B0" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "8px", color: answeredQ === totalQ ? "#080f1e" : "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: "600", cursor: answeredQ === totalQ ? "pointer" : "default", transition: "all 0.2s" }}>
                Voir les résultats →
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // RESULTS
  const weakDims = [...DIMS].sort((a, b) => (getDimScore(a) / (a.questions.length * 2)) - (getDimScore(b) / (b.questions.length * 2))).slice(0, 3);

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'IBM Plex Sans', sans-serif", padding: "24px 16px" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
      `}</style>

      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div className="fade-up" style={{ textAlign: "center", marginBottom: "48px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(78,201,176,0.6)", marginBottom: "24px" }}>RAPPORT D'ÉVALUATION — NEXALIE CONSULTING</p>
          {company && <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>{company} {sector && `· ${sector}`}</p>}

          {/* Score central */}
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", padding: "32px 48px", border: `1px solid ${level.color}40`, borderRadius: "20px", background: `${level.color}08`, marginBottom: "16px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "64px", fontWeight: "500", color: level.color, lineHeight: 1 }}>{pctTotal}</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "12px" }}>/ 100</span>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 300, color: "#fff" }}>{level.label}</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{level.sub}</span>
          </div>

          {/* Level bar */}
          <div style={{ display: "flex", gap: "4px", maxWidth: "400px", margin: "0 auto" }}>
            {LEVELS.map(l => (
              <div key={l.id} style={{ flex: 1, height: "4px", borderRadius: "2px", background: pctTotal >= l.min ? l.color : "rgba(255,255,255,0.08)", transition: "background 0.5s" }} />
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", maxWidth: "400px", margin: "6px auto 0" }}>
            {LEVELS.map(l => <span key={l.id} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", color: "rgba(255,255,255,0.2)" }}>{l.label}</span>)}
          </div>
        </div>

        {/* Radar + scores */}
        <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          {/* Radar */}
          <div style={{ padding: "24px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>PROFIL RADAR</p>
            <RadarChart scores={scores} size={180} />
          </div>

          {/* Dim scores */}
          <div style={{ padding: "24px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", background: "rgba(255,255,255,0.02)", display: "flex", flexDirection: "column", gap: "14px", justifyContent: "center" }}>
            {DIMS.map(d => {
              const sc = getDimScore(d);
              const mx = d.questions.length * 2;
              return (
                <div key={d.id}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                    <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}><span style={{ fontFamily: "'IBM Plex Mono', monospace", color: d.color, marginRight: "6px" }}>{d.icon}</span>{d.label}</span>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: d.color }}>{Math.round((sc / mx) * 100)}%</span>
                  </div>
                  <ScoreBar value={sc} max={mx} color={d.color} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority actions */}
        <div className="fade-up" style={{ marginBottom: "16px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "16px" }}>ACTIONS PRIORITAIRES</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {weakDims.map((d, rank) => {
              const actions = PRIORITIES[d.id]?.[level.id] || [];
              return (
                <div key={d.id} style={{ padding: "20px", border: `1px solid ${d.color}25`, borderRadius: "14px", background: `${d.color}06` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "18px", color: d.color }}>{d.icon}</span>
                    <div>
                      <span style={{ fontSize: "13px", fontWeight: "600", color: "#fff" }}>{d.label}</span>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: d.color, marginLeft: "10px" }}>
                        {rank === 0 ? "Priorité #1" : rank === 1 ? "Priorité #2" : "Priorité #3"}
                      </span>
                    </div>
                  </div>
                  {actions.map((a, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", padding: "8px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                      <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: d.color, marginTop: "2px", flexShrink: 0 }}>→</span>
                      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{a}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA */}
        <div className="fade-up" style={{ padding: "28px", border: "1px solid rgba(78,201,176,0.2)", borderRadius: "16px", background: "rgba(78,201,176,0.04)", textAlign: "center", marginBottom: "24px" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>Prêt à passer à l'action ?</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginBottom: "20px", lineHeight: 1.7 }}>Nexalie Consulting vous accompagne de l'audit à la mise en œuvre — avec une approche adaptée à la réalité des entreprises africaines.</p>
          <div style={{ display: "inline-flex", flexDirection: "column", gap: "4px" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: "#4EC9B0" }}>relia.ebiya@gmail.com</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>nexali.ai</span>
          </div>
        </div>

        <button onClick={() => { setPhase("intro"); setAnswers({}); setDimIdx(0); }}
          style={{ width: "100%", padding: "13px", background: "transparent", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "rgba(255,255,255,0.2)", fontSize: "12px", fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", letterSpacing: "1px" }}>
          RECOMMENCER
        </button>
      </div>
    </div>
  );
}
