import { useState } from "react";

// ═══ THEMES ═══
const THEME = {
  fr: {
    bg: "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)",
    card: "rgba(255,255,255,0.03)",
    border: "rgba(255,255,255,0.08)",
    accent: "#4EC9B0",
    gold: "#C9A84C",
    text: "#ffffff",
    muted: "rgba(255,255,255,0.4)",
    tag: "rgba(78,201,176,0.1)",
    tagText: "#4EC9B0",
    btnBg: "#4EC9B0",
    btnText: "#070e1c",
    label: "🇫🇷 France",
    navBg: "rgba(7,14,28,0.95)",
    inputBg: "rgba(255,255,255,0.04)",
    inputBorder: "rgba(255,255,255,0.09)",
  },
  af: {
    bg: "radial-gradient(ellipse at 20% 15%, #2A1200 0%, #1A0800 60%, #0D0400 100%)",
    card: "rgba(232,140,50,0.05)",
    border: "rgba(232,140,50,0.15)",
    accent: "#E88C32",
    gold: "#F5C842",
    text: "#FFF5E8",
    muted: "rgba(255,245,232,0.45)",
    tag: "rgba(232,140,50,0.1)",
    tagText: "#E88C32",
    btnBg: "#E88C32",
    btnText: "#1A0800",
    label: "🌍 Afrique",
    navBg: "rgba(26,8,0,0.95)",
    inputBg: "rgba(232,140,50,0.06)",
    inputBorder: "rgba(232,140,50,0.2)",
  }
};

const SERVICES = [
  { emoji: "🌐", title: "Site Web Vitrine", fr: "1 200 — 1 800€", af: "600 — 1 000€", delay: "2-3 semaines", color: "#4EC9B0", colorAf: "#E88C32" },
  { emoji: "📄", title: "One-Page", fr: "400 — 600€", af: "200 — 350€", delay: "5-7 jours", color: "#C9A84C", colorAf: "#F5C842", badge: "⚡ RAPIDE" },
  { emoji: "🛒", title: "E-Commerce", fr: "2 500 — 4 000€", af: "1 200 — 2 000€", delay: "4-6 semaines", color: "#C586C0", colorAf: "#D4845A" },
  { emoji: "🎯", title: "Landing Page", fr: "600 — 900€", af: "300 — 500€", delay: "1 semaine", color: "#CE9178", colorAf: "#E88C32" },
  { emoji: "🔄", title: "Refonte", fr: "800 — 1 500€", af: "400 — 800€", delay: "2-3 semaines", color: "#569CD6", colorAf: "#C4614A" },
  { emoji: "🎨", title: "Identité Visuelle", fr: "500 — 900€", af: "300 — 500€", delay: "1-2 semaines", color: "#4A7C59", colorAf: "#8B6914" },
  { emoji: "🛠️", title: "Maintenance", fr: "80 — 150€/mois", af: "50 — 80€/mois", delay: "3 mois min", color: "#7B5EA7", colorAf: "#B8560A" },
];

const SECTORS = ["Commerce & Retail", "Restaurant & Traiteur", "BTP & Immobilier", "Santé & Bien-être", "Services aux entreprises", "Éducation & Formation", "Tourisme & Hôtellerie", "Agriculture", "Finance & Assurance", "Mode & Beauté", "Tech & Digital", "Artisanat & Art", "ONG & Association"];

const STYLES = [
  { id: "moderne", label: "Moderne & Épuré", emoji: "⬜" },
  { id: "chaleureux", label: "Chaleureux & Convivial", emoji: "🟧" },
  { id: "luxe", label: "Luxe & Premium", emoji: "⬛" },
  { id: "dynamique", label: "Dynamique & Coloré", emoji: "🟦" },
  { id: "naturel", label: "Naturel & Organique", emoji: "🟩" },
  { id: "africain", label: "Africain & Moderne", emoji: "🟫" },
];

const PALETTES = [
  { id: "ocean", label: "Océan", colors: ["#0A1628", "#4EC9B0", "#C9A84C"], bg: "#0A1628", text: "#fff" },
  { id: "sunset", label: "Sunset", colors: ["#1A0A00", "#E88C32", "#F5C842"], bg: "#1A0A00", text: "#fff" },
  { id: "forest", label: "Forêt", colors: ["#0A1A0A", "#4A7C59", "#A8D5A2"], bg: "#0A1A0A", text: "#fff" },
  { id: "rose", label: "Rose & Or", colors: ["#FDF6F0", "#C0627A", "#C9A84C"], bg: "#FDF6F0", text: "#222" },
  { id: "terracotta", label: "Terracotta", colors: ["#F5EDE3", "#C4614A", "#2E4A3E"], bg: "#F5EDE3", text: "#222" },
  { id: "kente", label: "Kente", colors: ["#1A0800", "#E88C32", "#F5C842"], bg: "#1A0800", text: "#fff" },
  { id: "savane", label: "Savane", colors: ["#F5EDE3", "#8B6914", "#2E4A3E"], bg: "#F5EDE3", text: "#222" },
  { id: "violet", label: "Violet Royal", colors: ["#0D0A1E", "#7B5EA7", "#E8C547"], bg: "#0D0A1E", text: "#fff" },
];

const SYSTEM_MOCKUP = `Tu es l'IA de Nexalie Consulting. Génère une maquette de site web en JSON STRICT sans backticks.

Format exact :
{"siteName":"Nom","tagline":"Slogan","heroTitle":"Titre principal (max 8 mots)","heroSubtitle":"Sous-titre 1-2 phrases","heroCTA":"Texte bouton","services":["Service 1","Service 2","Service 3","Service 4"],"stats":[{"value":"10+","label":"Années"},{"value":"200","label":"Clients"},{"value":"98%","label":"Satisfaction"}],"testimonial":{"text":"Témoignage client crédible","name":"Prénom Nom","role":"Titre, Ville"},"footerTagline":"Slogan de conclusion"}

Adapte au secteur, style et marché. JSON uniquement, rien d'autre.`;

async function callClaude(prompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM_MOCKUP,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });
    const lines = buf.split("\n"); buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try { const d = JSON.parse(line.slice(6)); if (d.type === "content_block_delta" && d.delta?.text) onChunk(d.delta.text); } catch {}
      }
    }
  }
}

function MockupPreview({ data, paletteId, mode }) {
  const pal = PALETTES.find(p => p.id === paletteId) || PALETTES[0];
  const [c1, c2, c3] = pal.colors;
  const t = mode === "af" ? THEME.af : THEME.fr;

  return (
    <div style={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${t.accent}30`, boxShadow: `0 20px 60px rgba(0,0,0,0.6)` }}>
      {/* Browser bar */}
      <div style={{ background: "#111", padding: "8px 14px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", gap: "4px" }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: "9px", height: "9px", borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, background: "#222", borderRadius: "5px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: t.accent }} />
          <span style={{ fontSize: "10px", color: "#666", fontFamily: "monospace" }}>nexali.ai/{(data.siteName || "client").toLowerCase().replace(/\s+/g, "-")}</span>
        </div>
      </div>

      <div style={{ background: pal.bg, maxHeight: "560px", overflowY: "auto" }}>
        {/* Nav */}
        <div style={{ padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${c2}20` }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "15px", fontWeight: "bold", color: c2 }}>{data.siteName || "Votre Site"}</span>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            {["Accueil","Services","Contact"].map(n => <span key={n} style={{ fontSize: "10px", color: pal.text, opacity: 0.5 }}>{n}</span>)}
            <span style={{ fontSize: "10px", background: c2, color: pal.bg === "#FDF6F0" || pal.bg === "#F5EDE3" || pal.bg === "#F5EDE3" ? "#000" : "#000", padding: "4px 10px", borderRadius: "15px", fontWeight: "700" }}>Contact</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: "40px 20px 32px", textAlign: "center", background: `linear-gradient(135deg, ${pal.bg} 0%, ${c2}18 100%)` }}>
          <div style={{ display: "inline-block", background: `${c2}18`, border: `1px solid ${c2}35`, borderRadius: "15px", padding: "3px 12px", marginBottom: "14px" }}>
            <span style={{ fontSize: "9px", color: c2, fontFamily: "monospace", letterSpacing: "1.5px" }}>NEXALIE CONSULTING</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 400, color: pal.text, lineHeight: 1.3, marginBottom: "10px", maxWidth: "420px", margin: "0 auto 10px" }}>
            {data.heroTitle || "Votre titre ici"}
          </h1>
          <p style={{ fontSize: "12px", color: pal.text, opacity: 0.55, lineHeight: 1.6, maxWidth: "360px", margin: "0 auto 18px", fontFamily: "sans-serif" }}>
            {data.heroSubtitle || "Description de votre activité"}
          </p>
          <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
            <button style={{ padding: "9px 20px", background: c2, border: "none", borderRadius: "7px", color: pal.bg === "#FDF6F0" || pal.bg === "#F5EDE3" ? "#1a0800" : "#fff", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>
              {data.heroCTA || "Découvrir"}
            </button>
            <button style={{ padding: "9px 16px", background: "transparent", border: `1px solid ${c2}45`, borderRadius: "7px", color: pal.text, fontSize: "11px", cursor: "pointer" }}>
              En savoir plus
            </button>
          </div>
        </div>

        {/* Stats */}
        {data.stats && (
          <div style={{ display: "flex", justifyContent: "space-around", padding: "16px 20px", borderTop: `1px solid ${c2}18`, borderBottom: `1px solid ${c2}18` }}>
            {data.stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: c2, fontWeight: "600", marginBottom: "2px" }}>{s.value}</p>
                <p style={{ fontSize: "9px", color: pal.text, opacity: 0.35, fontFamily: "sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Services */}
        {data.services && (
          <div style={{ padding: "22px 20px" }}>
            <p style={{ fontSize: "9px", color: c2, fontFamily: "monospace", letterSpacing: "2px", marginBottom: "14px", opacity: 0.8 }}>NOS SERVICES</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {data.services.slice(0, 4).map((s, i) => (
                <div key={i} style={{ padding: "12px", background: `${c2}10`, border: `1px solid ${c2}20`, borderRadius: "8px" }}>
                  <div style={{ width: "20px", height: "20px", background: c2, borderRadius: "5px", marginBottom: "6px", opacity: 0.8 }} />
                  <p style={{ fontSize: "11px", fontWeight: "600", color: pal.text, fontFamily: "sans-serif" }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {data.testimonial && (
          <div style={{ margin: "0 20px 18px", padding: "16px", background: `${c2}10`, border: `1px solid ${c2}22`, borderRadius: "10px" }}>
            <p style={{ fontSize: "11px", color: pal.text, opacity: 0.6, lineHeight: 1.7, marginBottom: "10px", fontStyle: "italic", fontFamily: "sans-serif" }}>"{data.testimonial.text}"</p>
            <div style={{ display: "flex", gap: "7px", alignItems: "center" }}>
              <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: c2, opacity: 0.8 }} />
              <div>
                <p style={{ fontSize: "10px", fontWeight: "600", color: pal.text, fontFamily: "sans-serif" }}>{data.testimonial.name}</p>
                <p style={{ fontSize: "9px", color: c2, fontFamily: "monospace" }}>{data.testimonial.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ padding: "14px 20px", borderTop: `1px solid ${c2}18`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "12px", color: c2 }}>{data.siteName}</span>
          <span style={{ fontSize: "9px", color: pal.text, opacity: 0.25, fontFamily: "sans-serif" }}>{data.footerTagline}</span>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState("fr");
  const [view, setView] = useState("services"); // services | generator
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ name: "", sector: "", style: "", palette: "ocean", desc: "", market: "fr" });
  const [generating, setGenerating] = useState(false);
  const [mockup, setMockup] = useState(null);
  const [showCTA, setShowCTA] = useState(false);

  const t = THEME[mode];
  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const generate = async () => {
    setGenerating(true); setMockup(null);
    let text = "";
    const prompt = `Entreprise: ${form.name || "Mon Entreprise"} | Secteur: ${form.sector} | Style: ${form.style} | Marché: ${mode === "af" ? "Afrique" : "France"} | Description: ${form.desc}`;
    try {
      await callClaude(prompt, chunk => { text += chunk; });
      const clean = text.replace(/```json|```/g, "").trim();
      setMockup(JSON.parse(clean));
      setStep(4);
    } catch (e) { console.error(e); }
    setGenerating(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: t.bg, fontFamily: "'DM Sans', sans-serif", transition: "background 0.5s ease" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input { outline: none !important; }
        ::placeholder { color: rgba(255,255,255,0.18) !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.4s ease forwards; }
        .choice-btn { transition: all 0.15s !important; }
        .choice-btn:hover { transform: translateY(-2px); }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
      `}</style>

      {/* HEADER */}
      <div style={{ background: t.navBg, backdropFilter: "blur(20px)", borderBottom: `1px solid ${t.accent}20`, padding: "0 24px", position: "sticky", top: 0, zIndex: 100, transition: "background 0.5s" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "58px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 300, color: t.text }}>Nexalie</span>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: t.gold }}>CONSULTING</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {/* View toggle */}
            <div style={{ display: "flex", background: `${t.accent}10`, border: `1px solid ${t.accent}25`, borderRadius: "8px", overflow: "hidden" }}>
              {[["services", "Services & Prix"], ["generator", "🤖 Maquette IA"]].map(([id, label]) => (
                <button key={id} onClick={() => setView(id)}
                  style={{ padding: "8px 14px", background: view === id ? t.accent : "transparent", border: "none", color: view === id ? t.btnText : t.muted, fontSize: "12px", fontWeight: view === id ? "700" : "400", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                  {label}
                </button>
              ))}
            </div>

            {/* France / Afrique toggle */}
            <div style={{ display: "flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", overflow: "hidden" }}>
              {[["fr", "🇫🇷 France"], ["af", "🌍 Afrique"]].map(([id, label]) => (
                <button key={id} onClick={() => setMode(id)}
                  style={{ padding: "8px 14px", background: mode === id ? (id === "af" ? "#E88C32" : "#4EC9B0") : "transparent", border: "none", color: mode === id ? (id === "af" ? "#1A0800" : "#070e1c") : "rgba(255,255,255,0.4)", fontSize: "12px", fontWeight: mode === id ? "700" : "400", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.3s" }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 24px" }}>

        {/* ═══ SERVICES VIEW ═══ */}
        {view === "services" && (
          <div className="fade-in">
            {/* Header */}
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: `${t.accent}12`, border: `1px solid ${t.accent}25`, borderRadius: "20px", padding: "4px 14px", marginBottom: "16px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: t.accent, animation: "none" }} />
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: t.accent }}>{mode === "af" ? "TARIFS AFRIQUE" : "TARIFS FRANCE"}</span>
              </div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: t.text, marginBottom: "8px", transition: "color 0.3s" }}>
                Création web {mode === "af" ? <em style={{ color: t.accent }}>pour l'Afrique</em> : <em style={{ color: t.accent }}>pour la France</em>}
              </h1>
              <p style={{ fontSize: "15px", color: t.muted, maxWidth: "480px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                {mode === "af" ? "Sites professionnels adaptés aux réalités et budgets africains — Cameroun, Congo, Côte d'Ivoire, Sénégal et tout le continent." : "Sites WordPress professionnels livrés en quelques semaines pour les PME françaises."}
              </p>
            </div>

            {/* Services grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px", marginBottom: "32px" }}>
              {SERVICES.map(s => {
                const color = mode === "af" ? s.colorAf : s.color;
                return (
                  <div key={s.title} className="choice-btn"
                    style={{ padding: "22px", background: t.card, border: `1px solid ${color}25`, borderRadius: "14px", cursor: "pointer", transition: "all 0.25s", position: "relative" }}>
                    {s.badge && <div style={{ position: "absolute", top: "-9px", right: "14px", background: color, padding: "2px 10px", borderRadius: "15px", fontSize: "9px", fontWeight: "700", color: mode === "af" ? "#1A0800" : "#070e1c", fontFamily: "'IBM Plex Mono', monospace" }}>{s.badge}</div>}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <span style={{ fontSize: "22px" }}>{s.emoji}</span>
                        <div>
                          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "17px", color: t.text, fontWeight: 400 }}>{s.title}</p>
                          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: t.muted }}>⏱ {s.delay}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "19px", color, transition: "color 0.3s" }}>{mode === "af" ? s.af : s.fr}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div style={{ padding: "32px", background: `${t.accent}08`, border: `1px solid ${t.accent}20`, borderRadius: "16px", textAlign: "center" }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: t.text, marginBottom: "8px" }}>
                {mode === "af" ? "Vous êtes en Afrique ?" : "Vous êtes en France ?"}
              </h2>
              <p style={{ fontSize: "14px", color: t.muted, marginBottom: "20px", fontFamily: "'DM Sans', sans-serif" }}>
                {mode === "af" ? "Obtenez un devis gratuit en 24h. On travaille 100% à distance — WhatsApp, Zoom, et si besoin on se déplace." : "Devis gratuit sous 24h. Première consultation offerte — 30 min pour explorer votre projet."}
              </p>
              <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                <button onClick={() => setView("generator")}
                  style={{ padding: "12px 24px", background: t.btnBg, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  🤖 Voir ma maquette gratuite →
                </button>
                <button style={{ padding: "12px 24px", background: "transparent", border: `1px solid ${t.accent}30`, borderRadius: "10px", color: t.text, fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>
                  {mode === "af" ? "WhatsApp : +33 7 86 62 04 09" : "Demander un devis"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ GENERATOR VIEW ═══ */}
        {view === "generator" && (
          <div className="fade-in">
            {/* Progress */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: t.accent }}>GÉNÉRATEUR DE MAQUETTE IA</span>
              <div style={{ flex: 1, height: "2px", background: `${t.accent}20`, borderRadius: "1px", overflow: "hidden" }}>
                <div style={{ width: `${(step / 4) * 100}%`, height: "100%", background: t.accent, transition: "width 0.4s ease" }} />
              </div>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: t.muted }}>{step}/4</span>
            </div>

            {/* STEP 1 */}
            {step === 1 && (
              <div className="fade-in">
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: t.text, marginBottom: "6px" }}>
                  Votre <em style={{ color: t.accent }}>entreprise</em>
                </h1>
                <p style={{ fontSize: "14px", color: t.muted, marginBottom: "28px" }}>2 minutes pour visualiser votre futur site.</p>

                <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "24px" }}>
                  <div>
                    <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: t.muted, marginBottom: "6px" }}>NOM DE L'ENTREPRISE</label>
                    <input value={form.name} onChange={e => update("name", e.target.value)} placeholder="Ex: Restaurant Mama Africa, Cabinet Dr. Koné..."
                      style={{ width: "100%", padding: "12px 16px", background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: "10px", color: t.text, fontSize: "14px", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: t.muted, marginBottom: "8px" }}>SECTEUR D'ACTIVITÉ *</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "7px" }}>
                      {SECTORS.map(s => (
                        <button key={s} className="choice-btn" onClick={() => update("sector", s)}
                          style={{ padding: "7px 13px", borderRadius: "7px", border: `1px solid ${form.sector === s ? t.accent : `${t.accent}20`}`, background: form.sector === s ? `${t.accent}15` : "transparent", color: form.sector === s ? t.accent : t.muted, fontSize: "12px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", fontWeight: form.sector === s ? "600" : "400" }}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: t.muted, marginBottom: "6px" }}>DÉCRIVEZ VOTRE ACTIVITÉ</label>
                    <textarea value={form.desc} onChange={e => update("desc", e.target.value)} rows={3} placeholder={mode === "af" ? "Ex: Nous sommes un restaurant de cuisine africaine à Douala, spécialisé dans les plats traditionnels..." : "Ex: Cabinet de conseil RH basé à Paris, nous accompagnons les PME dans leur gestion des talents..."}
                      style={{ width: "100%", padding: "12px 16px", background: t.inputBg, border: `1px solid ${t.inputBorder}`, borderRadius: "10px", color: t.text, fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
                  </div>
                </div>

                <button onClick={() => form.sector && setStep(2)}
                  style={{ padding: "13px 32px", background: form.sector ? t.btnBg : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.sector ? t.btnText : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: form.sector ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                  Continuer →
                </button>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="fade-in">
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: t.text, marginBottom: "6px" }}>
                  Votre <em style={{ color: t.accent }}>style</em>
                </h1>
                <p style={{ fontSize: "14px", color: t.muted, marginBottom: "24px" }}>L'ambiance de votre futur site.</p>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "24px" }}>
                  {STYLES.map(s => (
                    <button key={s.id} className="choice-btn" onClick={() => update("style", s.label)}
                      style={{ padding: "14px", borderRadius: "10px", border: `1px solid ${form.style === s.label ? t.accent : `${t.accent}15`}`, background: form.style === s.label ? `${t.accent}10` : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.2s" }}>
                      <p style={{ fontSize: "18px", marginBottom: "5px" }}>{s.emoji}</p>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: form.style === s.label ? t.accent : t.text, fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                    </button>
                  ))}
                </div>

                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: t.muted, marginBottom: "10px" }}>PALETTE DE COULEURS</p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px", marginBottom: "24px" }}>
                  {PALETTES.map(p => (
                    <button key={p.id} className="choice-btn" onClick={() => update("palette", p.id)}
                      style={{ padding: "10px", borderRadius: "10px", border: `2px solid ${form.palette === p.id ? p.colors[1] : "rgba(255,255,255,0.06)"}`, background: p.bg, cursor: "pointer", transition: "all 0.2s" }}>
                      <div style={{ display: "flex", gap: "3px", marginBottom: "5px" }}>
                        {p.colors.map((c, i) => <div key={i} style={{ flex: 1, height: "12px", borderRadius: "3px", background: c }} />)}
                      </div>
                      <p style={{ fontSize: "10px", color: p.text, fontFamily: "'DM Sans', sans-serif", opacity: 0.7 }}>{p.label}</p>
                    </button>
                  ))}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setStep(1)} style={{ padding: "12px 20px", background: "transparent", border: `1px solid ${t.accent}20`, borderRadius: "10px", color: t.muted, fontSize: "13px", cursor: "pointer" }}>← Retour</button>
                  <button onClick={() => form.style && setStep(3)}
                    style={{ padding: "12px 28px", background: form.style ? t.btnBg : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.style ? t.btnText : "rgba(255,255,255,0.2)", fontSize: "13px", fontWeight: "700", cursor: form.style ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif" }}>
                    Continuer →
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="fade-in">
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3vw, 32px)", fontWeight: 300, color: t.text, marginBottom: "20px" }}>
                  Tout est <em style={{ color: t.accent }}>prêt</em> !
                </h1>

                <div style={{ padding: "20px", background: t.card, border: `1px solid ${t.accent}15`, borderRadius: "14px", marginBottom: "20px" }}>
                  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: t.muted, marginBottom: "12px" }}>RÉCAPITULATIF</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    {[["Entreprise", form.name || "—"], ["Secteur", form.sector], ["Marché", mode === "af" ? "Afrique" : "France"], ["Style", form.style], ["Palette", PALETTES.find(p => p.id === form.palette)?.label || ""]].map(([k, v]) => (
                      <div key={k} style={{ padding: "9px 12px", background: `${t.accent}08`, borderRadius: "8px" }}>
                        <p style={{ fontSize: "9px", color: t.muted, fontFamily: "'IBM Plex Mono', monospace", marginBottom: "2px" }}>{k.toUpperCase()}</p>
                        <p style={{ fontSize: "12px", color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {generating && (
                  <div style={{ textAlign: "center", padding: "20px" }}>
                    <div style={{ width: "36px", height: "36px", border: `3px solid ${t.accent}25`, borderTop: `3px solid ${t.accent}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 12px" }} />
                    <p style={{ color: t.accent, fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px", letterSpacing: "1px" }}>GÉNÉRATION EN COURS...</p>
                  </div>
                )}

                <div style={{ display: "flex", gap: "8px" }}>
                  <button onClick={() => setStep(2)} disabled={generating} style={{ padding: "12px 20px", background: "transparent", border: `1px solid ${t.accent}20`, borderRadius: "10px", color: t.muted, fontSize: "13px", cursor: "pointer" }}>← Retour</button>
                  <button onClick={generate} disabled={generating}
                    style={{ flex: 1, padding: "13px", background: generating ? `${t.accent}50` : t.btnBg, border: "none", borderRadius: "10px", color: t.btnText, fontSize: "14px", fontWeight: "700", cursor: generating ? "default" : "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                    {generating ? "⏳ Génération..." : "🚀 Générer ma maquette"}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — RESULT */}
            {step === 4 && mockup && (
              <div className="fade-in">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
                  <div>
                    <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: t.accent, marginBottom: "4px" }}>VOTRE MAQUETTE EST PRÊTE 🎉</p>
                    <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 300, color: t.text }}>{mockup.siteName}</h1>
                    <p style={{ fontSize: "13px", color: t.muted, fontStyle: "italic", fontFamily: "'DM Sans', sans-serif" }}>{mockup.tagline}</p>
                  </div>
                  <div style={{ display: "flex", gap: "7px" }}>
                    <button onClick={() => { setStep(1); setMockup(null); setForm({ name: "", sector: "", style: "", palette: "ocean", desc: "" }); }}
                      style={{ padding: "9px 14px", background: "transparent", border: `1px solid ${t.accent}20`, borderRadius: "8px", color: t.muted, fontSize: "11px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                      ↺ Recommencer
                    </button>
                    <button onClick={() => setShowCTA(true)}
                      style={{ padding: "9px 18px", background: t.btnBg, border: "none", borderRadius: "8px", color: t.btnText, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                      Je veux ce site ! →
                    </button>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                  <MockupPreview data={mockup} paletteId={form.palette} mode={mode} />

                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    <div style={{ padding: "16px", background: t.card, border: `1px solid ${t.accent}15`, borderRadius: "12px" }}>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: t.accent, marginBottom: "8px", letterSpacing: "1px" }}>VOTRE SITE EN RÉSUMÉ</p>
                      {[["Nom", mockup.siteName], ["Slogan", mockup.tagline], ["CTA Principal", mockup.heroCTA]].map(([k, v]) => (
                        <div key={k} style={{ marginBottom: "8px" }}>
                          <p style={{ fontSize: "10px", color: t.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{k}</p>
                          <p style={{ fontSize: "13px", color: t.text, fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                        </div>
                      ))}
                    </div>

                    <div style={{ padding: "16px", background: t.card, border: `1px solid ${t.accent}15`, borderRadius: "12px" }}>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: t.accent, marginBottom: "10px", letterSpacing: "1px" }}>SERVICES IDENTIFIÉS</p>
                      {mockup.services?.map((s, i) => (
                        <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "6px" }}>
                          <span style={{ color: t.accent, fontSize: "11px" }}>→</span>
                          <span style={{ fontSize: "12px", color: t.muted, fontFamily: "'DM Sans', sans-serif" }}>{s}</span>
                        </div>
                      ))}
                    </div>

                    {showCTA && (
                      <div style={{ padding: "16px", background: `${t.accent}10`, border: `1px solid ${t.accent}30`, borderRadius: "12px" }}>
                        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: t.text, marginBottom: "8px" }}>Contactez Relia pour concrétiser</p>
                        <p style={{ fontSize: "12px", color: t.muted, marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>Devis gratuit sous 24h · Paiement en plusieurs fois possible</p>
                        {[["📧", "relia.ebiya@gmail.com"], ["📱", "+33 7 86 62 04 09"], ["🌐", "nexali.ai"]].map(([e, v]) => (
                          <p key={v} style={{ fontSize: "12px", color: t.accent, fontFamily: "'IBM Plex Mono', monospace", marginBottom: "4px" }}>{e} {v}</p>
                        ))}
                        <div style={{ marginTop: "10px", padding: "8px 12px", background: `${t.gold}15`, borderRadius: "8px" }}>
                          <p style={{ fontSize: "11px", color: t.gold, fontFamily: "'DM Sans', sans-serif" }}>
                            💰 {mode === "af" ? "Tarifs Afrique : One-page dès 200€ · Vitrine dès 600€" : "Tarifs France : One-page dès 400€ · Vitrine dès 1 200€"}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
