import { useState } from "react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

const STYLES = [
  { id: "moderne", label: "Moderne & Minimaliste", desc: "Épuré, lignes nettes" },
  { id: "premium", label: "Premium & Luxe", desc: "Élégant, raffiné" },
  { id: "tech", label: "Tech & Digital", desc: "Moderne, futuriste" },
  { id: "naturel", label: "Naturel & Organique", desc: "Doux, accessible" },
  { id: "africain", label: "Africain & Moderne", desc: "Chaleureux, identitaire" },
  { id: "corporate", label: "Corporate & Pro", desc: "Institutionnel, sérieux" },
];

const SECTORS = ["Commerce", "Restaurant", "Santé", "BTP", "Finance", "Tech", "Mode", "Éducation", "ONG", "Services", "Agriculture", "Artisanat"];

const PALETTES = [
  { id: "ocean", name: "Océan", colors: ["#0A1628", "#4EC9B0", "#C9A84C"] },
  { id: "sunset", name: "Sunset Afrique", colors: ["#1A0800", "#E88C32", "#F5C842"] },
  { id: "forest", name: "Forêt", colors: ["#0A1A0A", "#4A7C59", "#A8D5A2"] },
  { id: "royal", name: "Royal", colors: ["#0D0A1E", "#7B5EA7", "#E8C547"] },
  { id: "rouge", name: "Rouge & Or", colors: ["#1A0000", "#C0627A", "#C9A84C"] },
  { id: "slate", name: "Ardoise", colors: ["#1E2A3A", "#5B8DB8", "#E8E8E8"] },
  { id: "terre", name: "Terracotta", colors: ["#2A0A00", "#C4614A", "#F5C842"] },
  { id: "mint", name: "Menthe", colors: ["#F0FAF5", "#2E8B6A", "#1A3A4A"] },
];

const FONTS = [
  { id: "georgia", label: "Georgia", family: "Georgia, serif", style: "Classique & Élégant" },
  { id: "arial", label: "Arial Bold", family: "Arial, sans-serif", style: "Moderne & Net" },
  { id: "times", label: "Times New Roman", family: "Times New Roman, serif", style: "Traditionnel & Prestige" },
  { id: "courier", label: "Courier", family: "Courier New, monospace", style: "Tech & Original" },
];

const SYMBOLS = [
  { id: "none", label: "Aucun", render: () => null },
  { id: "diamond", label: "Diamant" },
  { id: "circle", label: "Cercle" },
  { id: "bridge", label: "Pont/Lien" },
  { id: "star", label: "Étoile" },
  { id: "arrow", label: "Flèche" },
  { id: "wave", label: "Vague" },
];

// ═══════════════════════════════════════════
// LOGO RENDERER
// ═══════════════════════════════════════════

function LogoSVG({ config, size = 400, variant = "dark" }) {
  const pal = PALETTES.find(p => p.id === config.palette) || PALETTES[0];
  const font = FONTS.find(f => f.id === config.font) || FONTS[0];
  const [bg, accent, gold] = pal.colors;

  const isDark = variant === "dark";
  const bgColor = isDark ? bg : "#FFFFFF";
  const textColor = isDark ? "#FFFFFF" : bg;
  const subColor = isDark ? accent : accent;

  const name = config.name || "NEXALIE";
  const tagline = config.tagline || "";
  const symbol = config.symbol || "none";

  // Determine layout based on symbol
  const hasSymbol = symbol !== "none";
  const nameY = hasSymbol ? 230 : 220;
  const tagY = nameY + 28;

  function renderSymbol() {
    const cx = 200, cy = hasSymbol ? 160 : 150;
    const s = 35;
    switch(symbol) {
      case "diamond":
        return <polygon points={`${cx},${cy-s} ${cx+s},${cy} ${cx},${cy+s} ${cx-s},${cy}`} fill="none" stroke={accent} strokeWidth="2.5"/>;
      case "circle":
        return <>
          <circle cx={cx} cy={cy} r={s} fill="none" stroke={accent} strokeWidth="2"/>
          <circle cx={cx} cy={cy} r={s * 0.4} fill={accent} fillOpacity="0.6"/>
        </>;
      case "bridge":
        return <>
          <circle cx={cx - 20} cy={cy} r={18} fill="none" stroke={accent} strokeWidth="2"/>
          <circle cx={cx + 20} cy={cy} r={18} fill="none" stroke={gold} strokeWidth="2"/>
          <line x1={cx - 2} y1={cy} x2={cx + 2} y2={cy} stroke={textColor} strokeWidth="3"/>
          <circle cx={cx} cy={cy} r={4} fill={textColor}/>
        </>;
      case "star":
        const pts = [];
        for(let i = 0; i < 5; i++) {
          const outerA = (i * 72 - 90) * Math.PI / 180;
          const innerA = ((i * 72 + 36) - 90) * Math.PI / 180;
          pts.push(`${cx + Math.cos(outerA) * s},${cy + Math.sin(outerA) * s}`);
          pts.push(`${cx + Math.cos(innerA) * s * 0.4},${cy + Math.sin(innerA) * s * 0.4}`);
        }
        return <polygon points={pts.join(" ")} fill="none" stroke={accent} strokeWidth="2"/>;
      case "arrow":
        return <>
          <line x1={cx - s} y1={cy} x2={cx + s} y2={cy} stroke={accent} strokeWidth="2.5"/>
          <polygon points={`${cx + s},${cy - 8} ${cx + s + 12},${cy} ${cx + s},${cy + 8}`} fill={accent}/>
          <circle cx={cx - s} cy={cy} r="4" fill={gold}/>
        </>;
      case "wave":
        return <path d={`M ${cx - s} ${cy} Q ${cx - s/2} ${cy - 20} ${cx} ${cy} Q ${cx + s/2} ${cy + 20} ${cx + s} ${cy}`} fill="none" stroke={accent} strokeWidth="2.5"/>;
      default:
        return null;
    }
  }

  return (
    <svg width={size} height={size * 0.6} viewBox="0 0 400 240" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="400" height="240" fill={bgColor}/>

      {/* Subtle background detail */}
      {isDark && <circle cx="200" cy="120" r="120" fill={accent} fillOpacity="0.03"/>}

      {/* Symbol */}
      {hasSymbol && renderSymbol()}

      {/* Decorative line */}
      {!hasSymbol && <line x1="140" y1="190" x2="260" y2="190" stroke={accent} strokeWidth="0.5" strokeOpacity="0.5"/>}

      {/* Company name */}
      <text
        x="200" y={nameY}
        fontFamily={font.family}
        fontSize={name.length > 10 ? "26" : "32"}
        fontWeight={config.font === "arial" ? "700" : "400"}
        fill={textColor}
        textAnchor="middle"
        letterSpacing={config.spacing || "2"}
      >
        {name.toUpperCase()}
      </text>

      {/* Tagline / sector */}
      {tagline && (
        <text
          x="200" y={tagY}
          fontFamily="Arial, sans-serif"
          fontSize="9"
          fill={subColor}
          textAnchor="middle"
          letterSpacing="3"
          opacity="0.9"
        >
          {tagline.toUpperCase()}
        </text>
      )}

      {/* Accent dot or line under name */}
      {!hasSymbol && (
        <line x1="160" y1={nameY + 8} x2="240" y2={nameY + 8} stroke={gold} strokeWidth="1" strokeOpacity="0.6"/>
      )}
    </svg>
  );
}

// ═══════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════

export default function App() {
  const [config, setConfig] = useState({
    name: "",
    tagline: "",
    sector: "",
    style: "moderne",
    palette: "ocean",
    font: "georgia",
    symbol: "none",
    spacing: "2",
  });
  const [activeVariant, setActiveVariant] = useState("dark");
  const [step, setStep] = useState(1);

  const set = (k, v) => setConfig(p => ({ ...p, [k]: v }));

  const pal = PALETTES.find(p => p.id === config.palette) || PALETTES[0];

  const downloadSVG = (variant) => {
    const svgEl = document.getElementById(`logo-preview-${variant}`);
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.name || "logo"}-nexali-${variant}.svg`;
    a.click();
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select { outline: none !important; }
        input:focus, select:focus { border-color: rgba(201,168,76,0.5) !important; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        select option { background: #0d1f35; color: white; }
        .choice:hover { border-color: rgba(201,168,76,0.4) !important; transform: translateY(-1px); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 300, color: "#fff" }}>Nexalie </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#C9A84C" }}>GÉNÉRATEUR LOGO INTERNE</span>
        </div>
        <div style={{ padding: "5px 12px", background: "rgba(255,100,74,0.1)", border: "1px solid rgba(255,100,74,0.2)", borderRadius: "6px" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#FF6B4A", letterSpacing: "1px" }}>🔒 USAGE INTERNE NEXALIE</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", padding: "24px", maxWidth: "1100px", margin: "0 auto" }}>

        {/* LEFT — Form */}
        <div>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>Configurer le logo</h2>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", fontFamily: "'DM Sans', sans-serif" }}>Génère un concept en direct pendant le rendez-vous client</p>

          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

            {/* Name */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>NOM DE L'ENTREPRISE *</label>
              <input value={config.name} onChange={e => set("name", e.target.value)} placeholder="Ex: RESTAURANT MAMA, CABINET KONÉ..."
                style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(201,168,76,0.2)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", letterSpacing: "1px", transition: "border-color 0.2s" }} />
            </div>

            {/* Tagline */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>SOUS-TITRE / SECTEUR</label>
              <input value={config.tagline} onChange={e => set("tagline", e.target.value)} placeholder="Ex: Consulting · Brazzaville · Since 2024"
                style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }} />
            </div>

            {/* Palette */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>PALETTE DE COULEURS</label>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "7px" }}>
                {PALETTES.map(p => (
                  <button key={p.id} className="choice" onClick={() => set("palette", p.id)}
                    style={{ padding: "8px", borderRadius: "8px", border: `2px solid ${config.palette === p.id ? p.colors[1] : "rgba(255,255,255,0.07)"}`, background: p.colors[0], cursor: "pointer", transition: "all 0.15s" }}>
                    <div style={{ display: "flex", gap: "2px", marginBottom: "4px" }}>
                      {p.colors.map((c, i) => <div key={i} style={{ flex: 1, height: "10px", borderRadius: "2px", background: c }} />)}
                    </div>
                    <p style={{ fontSize: "9px", color: p.colors[2], fontFamily: "'IBM Plex Mono', monospace", textAlign: "center" }}>{p.name}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>TYPOGRAPHIE</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "7px" }}>
                {FONTS.map(f => (
                  <button key={f.id} className="choice" onClick={() => set("font", f.id)}
                    style={{ padding: "10px 12px", borderRadius: "8px", border: `1px solid ${config.font === f.id ? "#C9A84C" : "rgba(255,255,255,0.07)"}`, background: config.font === f.id ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
                    <p style={{ fontSize: "14px", fontFamily: f.family, color: config.font === f.id ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: "2px" }}>{f.label}</p>
                    <p style={{ fontSize: "9px", color: config.font === f.id ? "#C9A84C" : "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{f.style}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Symbol */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "8px" }}>SYMBOLE</label>
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                {SYMBOLS.map(s => (
                  <button key={s.id} className="choice" onClick={() => set("symbol", s.id)}
                    style={{ padding: "7px 12px", borderRadius: "7px", border: `1px solid ${config.symbol === s.id ? "#4EC9B0" : "rgba(255,255,255,0.07)"}`, background: config.symbol === s.id ? "rgba(78,201,176,0.1)" : "transparent", color: config.symbol === s.id ? "#4EC9B0" : "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif" }}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spacing */}
            <div>
              <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                ESPACEMENT DES LETTRES — {config.spacing}px
              </label>
              <input type="range" min="0" max="8" value={config.spacing} onChange={e => set("spacing", e.target.value)}
                style={{ width: "100%", accentColor: "#C9A84C" }} />
            </div>

          </div>
        </div>

        {/* RIGHT — Preview */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
            <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 300, color: "#fff" }}>Aperçu en direct</h2>
            <div style={{ display: "flex", gap: "6px" }}>
              {[["dark","🌙 Dark"], ["light","☀️ Light"]].map(([v, l]) => (
                <button key={v} onClick={() => setActiveVariant(v)}
                  style={{ padding: "7px 14px", borderRadius: "8px", border: `1px solid ${activeVariant === v ? "#C9A84C" : "rgba(255,255,255,0.08)"}`, background: activeVariant === v ? "rgba(201,168,76,0.1)" : "transparent", color: activeVariant === v ? "#C9A84C" : "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          {/* Main preview */}
          <div style={{ borderRadius: "16px", overflow: "hidden", border: `1px solid ${pal.colors[1]}30`, marginBottom: "12px", boxShadow: `0 16px 50px rgba(0,0,0,0.5)` }}>
            <div id={`logo-preview-${activeVariant}`}>
              <LogoSVG config={config} size={500} variant={activeVariant} />
            </div>
          </div>

          {/* Both variants side by side */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "16px" }}>
            {["dark", "light"].map(v => (
              <div key={v} style={{ borderRadius: "10px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)" }}>
                <LogoSVG config={config} size={300} variant={v} />
                <div style={{ padding: "6px 10px", background: "rgba(255,255,255,0.02)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>{v.toUpperCase()}</span>
                  <button onClick={() => downloadSVG(v)}
                    style={{ padding: "4px 10px", background: "rgba(201,168,76,0.15)", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "5px", color: "#C9A84C", fontSize: "10px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                    ↓ SVG
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info banner */}
          <div style={{ padding: "14px 16px", background: "rgba(255,100,74,0.06)", border: "1px solid rgba(255,100,74,0.15)", borderRadius: "10px" }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#FF6B4A", marginBottom: "4px" }}>🔒 USAGE INTERNE NEXALIE SEULEMENT</p>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              Outil de démonstration client. Pour un logo professionnel final, proposer le service identité visuelle avec graphiste. Tarif : 600 — 1 200€ 🇫🇷 · 300 — 600€ 🌍
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
