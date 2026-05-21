import { useState } from "react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

const SECTORS = ["Commerce & Retail", "Restaurant & Traiteur", "BTP & Immobilier", "Santé & Bien-être", "Services aux entreprises", "Éducation & Formation", "Tourisme & Hôtellerie", "Agriculture & Agroalimentaire", "Finance & Assurance", "Mode & Beauté", "Tech & Digital", "Artisanat & Art", "ONG & Association", "Autre"];

const STYLES = [
  { id: "moderne", label: "Moderne & Épuré", desc: "Lignes nettes, espaces blancs", emoji: "⬜" },
  { id: "chaleureux", label: "Chaleureux & Convivial", desc: "Tons chauds, ambiance accueillante", emoji: "🟧" },
  { id: "luxe", label: "Luxe & Premium", desc: "Élégant, raffiné, haut de gamme", emoji: "⬛" },
  { id: "dynamique", label: "Dynamique & Coloré", desc: "Vibrant, énergique, jeune", emoji: "🟦" },
  { id: "naturel", label: "Naturel & Organique", desc: "Tons verts, doux, proche de la nature", emoji: "🟩" },
  { id: "professionnel", label: "Corporate & Professionnel", desc: "Sérieux, institutionnel, confiant", emoji: "🟫" },
];

const PALETTES = [
  { id: "ocean", label: "Océan", colors: ["#0A1628", "#4EC9B0", "#C9A84C"], bg: "#0A1628", text: "#fff" },
  { id: "sunset", label: "Sunset", colors: ["#1A0A00", "#E88C32", "#F5C842"], bg: "#1A0A00", text: "#fff" },
  { id: "forest", label: "Forêt", colors: ["#0A1A0A", "#4A7C59", "#A8D5A2"], bg: "#0A1A0A", text: "#fff" },
  { id: "rose", label: "Rose & Or", colors: ["#FDF6F0", "#C0627A", "#C9A84C"], bg: "#FDF6F0", text: "#222" },
  { id: "slate", label: "Ardoise", colors: ["#1E2A3A", "#5B8DB8", "#E8E8E8"], bg: "#1E2A3A", text: "#fff" },
  { id: "terracotta", label: "Terracotta", colors: ["#F5EDE3", "#C4614A", "#2E4A3E"], bg: "#F5EDE3", text: "#222" },
  { id: "violet", label: "Violet Royal", colors: ["#0D0A1E", "#7B5EA7", "#E8C547"], bg: "#0D0A1E", text: "#fff" },
  { id: "mint", label: "Menthe Fraîche", colors: ["#F0FAF5", "#2E8B6A", "#1A3A4A"], bg: "#F0FAF5", text: "#222" },
];

const PAGES = ["Accueil", "À propos", "Services", "Portfolio", "Témoignages", "Contact"];

const SYSTEM_MOCKUP = `Tu es l'IA de Nexalie Consulting, spécialisée dans la création de maquettes de sites web.

En fonction des informations client fournies, génère une description détaillée et structurée d'un site web en JSON STRICT (sans backticks, sans markdown, juste le JSON pur).

Format EXACT à retourner :
{
  "siteName": "Nom du site",
  "tagline": "Slogan accrocheur en 1 phrase",
  "heroTitle": "Titre principal de la page d'accueil (max 8 mots, percutant)",
  "heroSubtitle": "Sous-titre descriptif (1-2 phrases)",
  "heroCTA": "Texte du bouton principal",
  "sections": [
    {"title": "Titre de section", "content": "Description du contenu (2-3 phrases)", "type": "about|services|gallery|testimonials|contact|stats"},
  ],
  "services": ["Service 1", "Service 2", "Service 3", "Service 4"],
  "stats": [{"value": "10+", "label": "Années d'expérience"}, {"value": "150", "label": "Clients satisfaits"}, {"value": "98%", "label": "Satisfaction"}],
  "testimonial": {"text": "Témoignage client fictif et crédible", "name": "Prénom Nom", "role": "Titre, Entreprise"},
  "footerTagline": "Phrase de conclusion inspirante"
}

Adapte tout au secteur, au style et à la cible du client. Sois créatif et professionnel. Réponds UNIQUEMENT avec le JSON, rien d'autre.`;

async function generateMockup(clientData, onChunk) {
  const prompt = `Génère la maquette pour ce client :
Nom entreprise: ${clientData.companyName || "Mon Entreprise"}
Secteur: ${clientData.sector}
Style souhaité: ${clientData.style}
Palette: ${clientData.palette}
Description: ${clientData.description}
Pages souhaitées: ${clientData.pages.join(", ")}
Pays/marché: ${clientData.country}`;

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
    const lines = buf.split("\n");
    buf = lines.pop();
    for (const line of lines) {
      if (line.startsWith("data: ")) {
        try {
          const d = JSON.parse(line.slice(6));
          if (d.type === "content_block_delta" && d.delta?.text) onChunk(d.delta.text);
        } catch {}
      }
    }
  }
}

// ═══════════════════════════════════════════
// MOCKUP RENDERER
// ═══════════════════════════════════════════

function MockupPreview({ data, palette }) {
  const pal = PALETTES.find(p => p.id === palette) || PALETTES[0];
  const [c1, c2, c3] = pal.colors;
  const isDark = pal.text === "#fff";

  return (
    <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 24px 60px rgba(0,0,0,0.5)" }}>
      {/* Browser chrome */}
      <div style={{ background: "#1a1a1a", padding: "10px 16px", display: "flex", alignItems: "center", gap: "8px" }}>
        <div style={{ display: "flex", gap: "5px" }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />)}
        </div>
        <div style={{ flex: 1, background: "#2a2a2a", borderRadius: "6px", padding: "4px 12px", display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#4EC9B0" }} />
          <span style={{ fontSize: "11px", color: "#888", fontFamily: "monospace" }}>nexali.ai/{data.siteName?.toLowerCase().replace(/\s+/g, "-") || "client"}</span>
        </div>
      </div>

      {/* Site content */}
      <div style={{ background: pal.bg, maxHeight: "600px", overflowY: "auto" }}>

        {/* Nav */}
        <div style={{ padding: "14px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: `1px solid ${c2}20` }}>
          <span style={{ fontFamily: "serif", fontSize: "16px", fontWeight: "bold", color: c2 }}>{data.siteName || "Votre Entreprise"}</span>
          <div style={{ display: "flex", gap: "16px" }}>
            {["Accueil", "Services", "Contact"].map(n => <span key={n} style={{ fontSize: "11px", color: pal.text, opacity: 0.6, fontFamily: "sans-serif" }}>{n}</span>)}
            <span style={{ fontSize: "11px", color: c1 === pal.bg ? c2 : c1, background: c2, padding: "4px 12px", borderRadius: "20px", fontFamily: "sans-serif", fontWeight: "600" }}>Nous contacter</span>
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding: "48px 24px 40px", textAlign: "center", background: `linear-gradient(135deg, ${pal.bg} 0%, ${c2}15 100%)`, position: "relative" }}>
          <div style={{ display: "inline-block", background: `${c2}20`, border: `1px solid ${c2}40`, borderRadius: "20px", padding: "4px 14px", marginBottom: "16px" }}>
            <span style={{ fontSize: "10px", color: c2, fontFamily: "monospace", letterSpacing: "1px" }}>NEXALIE CONSULTING · VOTRE SITE WEB</span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 30px)", fontWeight: "400", color: pal.text, lineHeight: 1.3, marginBottom: "12px", maxWidth: "500px", margin: "0 auto 12px" }}>
            {data.heroTitle || "Votre titre principal ici"}
          </h1>
          <p style={{ fontSize: "13px", color: pal.text, opacity: 0.6, lineHeight: 1.6, maxWidth: "400px", margin: "0 auto 20px", fontFamily: "sans-serif" }}>
            {data.heroSubtitle || "Description de votre activité"}
          </p>
          <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
            <button style={{ padding: "10px 22px", background: c2, border: "none", borderRadius: "8px", color: isDark ? "#000" : "#fff", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
              {data.heroCTA || "Découvrir"}
            </button>
            <button style={{ padding: "10px 22px", background: "transparent", border: `1px solid ${c2}50`, borderRadius: "8px", color: pal.text, fontSize: "12px", cursor: "pointer", fontFamily: "sans-serif" }}>
              En savoir plus
            </button>
          </div>
        </div>

        {/* Stats */}
        {data.stats && (
          <div style={{ display: "flex", justifyContent: "space-around", padding: "20px 24px", borderTop: `1px solid ${c2}20`, borderBottom: `1px solid ${c2}20` }}>
            {data.stats.map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: c2, fontWeight: "600", marginBottom: "2px" }}>{s.value}</p>
                <p style={{ fontSize: "10px", color: pal.text, opacity: 0.4, fontFamily: "sans-serif" }}>{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Services */}
        {data.services && (
          <div style={{ padding: "28px 24px" }}>
            <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: c2, marginBottom: "8px", opacity: 0.8 }}>NOS SERVICES</p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: pal.text, marginBottom: "16px" }}>Ce que nous proposons</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              {data.services.slice(0, 4).map((s, i) => (
                <div key={i} style={{ padding: "14px", background: `${c2}0d`, border: `1px solid ${c2}25`, borderRadius: "10px" }}>
                  <div style={{ width: "24px", height: "24px", background: c2, borderRadius: "6px", marginBottom: "8px" }} />
                  <p style={{ fontSize: "12px", fontWeight: "600", color: pal.text, fontFamily: "sans-serif" }}>{s}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Testimonial */}
        {data.testimonial && (
          <div style={{ margin: "0 24px 24px", padding: "20px", background: `${c2}12`, border: `1px solid ${c2}25`, borderRadius: "12px" }}>
            <p style={{ fontSize: "12px", color: pal.text, opacity: 0.7, lineHeight: 1.7, marginBottom: "12px", fontFamily: "sans-serif", fontStyle: "italic" }}>"{data.testimonial.text}"</p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: c2 }} />
              <div>
                <p style={{ fontSize: "11px", fontWeight: "600", color: pal.text, fontFamily: "sans-serif" }}>{data.testimonial.name}</p>
                <p style={{ fontSize: "10px", color: c2, fontFamily: "sans-serif" }}>{data.testimonial.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* CTA Banner */}
        <div style={{ margin: "0 24px 24px", padding: "24px", background: c2, borderRadius: "12px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: isDark ? "#fff" : "#000", marginBottom: "12px" }}>Prêt à transformer votre présence digitale ?</p>
          <button style={{ padding: "10px 24px", background: pal.bg, border: "none", borderRadius: "8px", color: c2, fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
            Obtenir un devis gratuit →
          </button>
        </div>

        {/* Footer */}
        <div style={{ padding: "16px 24px", borderTop: `1px solid ${c2}20`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontFamily: "serif", fontSize: "13px", color: c2 }}>{data.siteName || "Votre Entreprise"}</span>
          <span style={{ fontSize: "10px", color: pal.text, opacity: 0.3, fontFamily: "sans-serif" }}>{data.footerTagline || "Votre slogan ici"}</span>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ companyName: "", sector: "", style: "", palette: "", description: "", pages: ["Accueil", "Services", "Contact"], country: "Congo Brazzaville" });
  const [generating, setGenerating] = useState(false);
  const [mockupData, setMockupData] = useState(null);
  const [rawJson, setRawJson] = useState("");
  const [showContact, setShowContact] = useState(false);

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const togglePage = (p) => setForm(prev => ({ ...prev, pages: prev.pages.includes(p) ? prev.pages.filter(x => x !== p) : [...prev.pages, p] }));

  const generate = async () => {
    setGenerating(true);
    setMockupData(null);
    setRawJson("");
    let text = "";
    try {
      await generateMockup(form, chunk => {
        text += chunk;
        setRawJson(text);
      });
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setMockupData(parsed);
      setStep(4);
    } catch (e) {
      console.error(e);
    }
    setGenerating(false);
  };

  const BG = "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, select { outline: none !important; }
        textarea:focus, input:focus { border-color: rgba(78,201,176,0.5) !important; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        select option { background: #0d1f35; color: white; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
        .choice:hover { border-color: rgba(78,201,176,0.4) !important; background: rgba(78,201,176,0.06) !important; transform: translateY(-2px); }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", fontWeight: 300, color: "#fff" }}>Nexalie</span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#C9A84C" }}>GÉNÉRATEUR DE MAQUETTE IA</span>
        </div>
        <div style={{ display: "flex", gap: "6px" }}>
          {[1,2,3,4].map(s => (
            <div key={s} style={{ width: s <= step ? "24px" : "8px", height: "8px", borderRadius: "4px", background: s <= step ? "#4EC9B0" : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "32px 20px" }}>

        {/* STEP 1 — Infos de base */}
        {step === 1 && (
          <div className="fade-in">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(78,201,176,0.7)", marginBottom: "8px" }}>ÉTAPE 1 / 3</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>Parlez-nous de votre <em style={{ color: "#4EC9B0" }}>entreprise</em></h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "32px" }}>En 2 minutes, décrivez votre projet et notre IA génère la maquette de votre futur site.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "28px" }}>
              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>NOM DE VOTRE ENTREPRISE</label>
                <input value={form.companyName} onChange={e => update("companyName", e.target.value)} placeholder="Ex: Restaurant Le Saveur, Clinique Espoir..."
                  style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", color: "#fff", fontSize: "14px", transition: "border-color 0.2s" }} />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>SECTEUR D'ACTIVITÉ *</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {SECTORS.map(s => (
                    <button key={s} className="choice" onClick={() => update("sector", s)}
                      style={{ padding: "8px 14px", borderRadius: "8px", border: `1px solid ${form.sector === s ? "#4EC9B0" : "rgba(255,255,255,0.1)"}`, background: form.sector === s ? "rgba(78,201,176,0.12)" : "transparent", color: form.sector === s ? "#4EC9B0" : "rgba(255,255,255,0.45)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s", fontWeight: form.sector === s ? "600" : "400" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>MARCHÉ CIBLE</label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {["Congo Brazzaville", "France", "Afrique", "International"].map(c => (
                    <button key={c} className="choice" onClick={() => update("country", c)}
                      style={{ padding: "9px 16px", borderRadius: "8px", border: `1px solid ${form.country === c ? "#C9A84C" : "rgba(255,255,255,0.1)"}`, background: form.country === c ? "rgba(201,168,76,0.12)" : "transparent", color: form.country === c ? "#C9A84C" : "rgba(255,255,255,0.45)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s", fontWeight: form.country === c ? "600" : "400" }}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>DÉCRIVEZ VOTRE ACTIVITÉ EN QUELQUES MOTS</label>
                <textarea value={form.description} onChange={e => update("description", e.target.value)} rows={3} placeholder="Ex: Nous sommes un restaurant spécialisé dans la cuisine congolaise traditionnelle, situé à Brazzaville. Nous servons des particuliers et des entreprises pour des repas d'affaires..."
                  style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: "10px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
              </div>
            </div>

            <button onClick={() => form.sector && setStep(2)}
              style={{ padding: "14px 32px", background: form.sector ? "#4EC9B0" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.sector ? "#070e1c" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: form.sector ? "pointer" : "default", transition: "all 0.2s" }}>
              Continuer →
            </button>
          </div>
        )}

        {/* STEP 2 — Style & Couleurs */}
        {step === 2 && (
          <div className="fade-in">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(78,201,176,0.7)", marginBottom: "8px" }}>ÉTAPE 2 / 3</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>Choisissez votre <em style={{ color: "#4EC9B0" }}>style</em></h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "28px" }}>L'ambiance de votre futur site.</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "28px" }}>
              {STYLES.map(s => (
                <button key={s.id} className="choice" onClick={() => update("style", s.label)}
                  style={{ padding: "16px", borderRadius: "12px", border: `1px solid ${form.style === s.label ? "#4EC9B0" : "rgba(255,255,255,0.08)"}`, background: form.style === s.label ? "rgba(78,201,176,0.08)" : "rgba(255,255,255,0.02)", cursor: "pointer", transition: "all 0.2s", textAlign: "left" }}>
                  <p style={{ fontSize: "20px", marginBottom: "6px" }}>{s.emoji}</p>
                  <p style={{ fontSize: "13px", fontWeight: "600", color: form.style === s.label ? "#4EC9B0" : "#fff", marginBottom: "3px", fontFamily: "'DM Sans', sans-serif" }}>{s.label}</p>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>
                </button>
              ))}
            </div>

            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "12px" }}>PALETTE DE COULEURS</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "28px" }}>
              {PALETTES.map(p => (
                <button key={p.id} className="choice" onClick={() => update("palette", p.id)}
                  style={{ padding: "12px", borderRadius: "12px", border: `2px solid ${form.palette === p.id ? p.colors[1] : "rgba(255,255,255,0.08)"}`, background: p.bg, cursor: "pointer", transition: "all 0.2s" }}>
                  <div style={{ display: "flex", gap: "4px", marginBottom: "6px" }}>
                    {p.colors.map((c, i) => <div key={i} style={{ flex: 1, height: "16px", borderRadius: "4px", background: c }} />)}
                  </div>
                  <p style={{ fontSize: "11px", color: p.text, fontFamily: "'DM Sans', sans-serif", opacity: form.palette === p.id ? 1 : 0.6 }}>{p.label}</p>
                </button>
              ))}
            </div>

            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "10px" }}>PAGES À INCLURE</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "28px" }}>
              {PAGES.map(p => (
                <button key={p} onClick={() => togglePage(p)}
                  style={{ padding: "8px 14px", borderRadius: "8px", border: `1px solid ${form.pages.includes(p) ? "#7B5EA7" : "rgba(255,255,255,0.1)"}`, background: form.pages.includes(p) ? "rgba(123,94,167,0.15)" : "transparent", color: form.pages.includes(p) ? "#C586C0" : "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s" }}>
                  {form.pages.includes(p) ? "✓ " : ""}{p}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setStep(1)} style={{ padding: "13px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.4)", fontSize: "14px", cursor: "pointer" }}>← Retour</button>
              <button onClick={() => form.style && form.palette && setStep(3)}
                style={{ padding: "13px 32px", background: form.style && form.palette ? "#4EC9B0" : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.style && form.palette ? "#070e1c" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: form.style && form.palette ? "pointer" : "default" }}>
                Continuer →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Confirmation + Génération */}
        {step === 3 && (
          <div className="fade-in">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(78,201,176,0.7)", marginBottom: "8px" }}>ÉTAPE 3 / 3</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: "#fff", marginBottom: "24px" }}>Tout est <em style={{ color: "#4EC9B0" }}>prêt</em> !</h1>

            <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>RÉCAPITULATIF DE VOTRE PROJET</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                {[
                  ["Entreprise", form.companyName || "Non renseigné"],
                  ["Secteur", form.sector],
                  ["Marché", form.country],
                  ["Style", form.style],
                  ["Palette", PALETTES.find(p => p.id === form.palette)?.label || ""],
                  ["Pages", form.pages.length + " pages"],
                ].map(([k, v]) => (
                  <div key={k} style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                    <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "3px" }}>{k.toUpperCase()}</p>
                    <p style={{ fontSize: "13px", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: "rgba(78,201,176,0.06)", border: "1px solid rgba(78,201,176,0.2)", borderRadius: "12px", padding: "16px", marginBottom: "24px" }}>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>
                🤖 Notre IA va analyser votre projet et générer une <strong style={{ color: "#4EC9B0" }}>maquette personnalisée</strong> de votre site web en quelques secondes. Cette maquette sera la base de votre futur site créé par Nexalie Consulting.
              </p>
            </div>

            {generating && (
              <div style={{ textAlign: "center", padding: "24px", marginBottom: "16px" }}>
                <div style={{ width: "40px", height: "40px", border: "3px solid rgba(78,201,176,0.2)", borderTop: "3px solid #4EC9B0", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
                <p style={{ color: "#4EC9B0", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: "1px" }}>GÉNÉRATION EN COURS...</p>
                <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", marginTop: "6px", fontFamily: "'DM Sans', sans-serif" }}>Notre IA analyse votre projet et construit votre maquette</p>
              </div>
            )}

            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setStep(2)} disabled={generating} style={{ padding: "13px 24px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.4)", fontSize: "14px", cursor: "pointer" }}>← Retour</button>
              <button onClick={generate} disabled={generating}
                style={{ flex: 1, padding: "14px", background: generating ? "rgba(78,201,176,0.3)" : "#4EC9B0", border: "none", borderRadius: "10px", color: "#070e1c", fontSize: "15px", fontWeight: "700", cursor: generating ? "default" : "pointer", transition: "all 0.2s" }}>
                {generating ? "⏳ Génération en cours..." : "🚀 Générer ma maquette"}
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Résultat */}
        {step === 4 && mockupData && (
          <div className="fade-in">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(78,201,176,0.7)", marginBottom: "6px" }}>VOTRE MAQUETTE EST PRÊTE 🎉</p>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 300, color: "#fff" }}>
                  Aperçu de <em style={{ color: "#4EC9B0" }}>{mockupData.siteName}</em>
                </h1>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "4px", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>{mockupData.tagline}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setStep(1); setMockupData(null); setForm({ companyName: "", sector: "", style: "", palette: "", description: "", pages: ["Accueil", "Services", "Contact"], country: "Congo Brazzaville" }); }}
                  style={{ padding: "10px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                  ↺ Recommencer
                </button>
                <button onClick={() => setShowContact(true)}
                  style={{ padding: "10px 20px", background: "#4EC9B0", border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Je veux ce site ! →
                </button>
              </div>
            </div>

            <MockupPreview data={mockupData} palette={form.palette} />

            {/* Contact CTA */}
            {showContact && (
              <div style={{ marginTop: "24px", padding: "28px", background: "rgba(78,201,176,0.06)", border: "1px solid rgba(78,201,176,0.25)", borderRadius: "16px" }}>
                <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>Réalisons votre site ensemble</h2>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", marginBottom: "20px", fontFamily: "'DM Sans', sans-serif" }}>Contactez Relia Ebiya pour transformer cette maquette en vrai site web professionnel.</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "16px" }}>
                  {[["📧 Email", "relia.ebiya@gmail.com"], ["📱 WhatsApp", "+33 7 86 62 04 09"], ["🌐 Site web", "nexali.ai"], ["📍 France & Congo", "100% en ligne"]].map(([l, v]) => (
                    <div key={l} style={{ padding: "12px 16px", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)" }}>
                      <p style={{ fontSize: "12px", color: "#4EC9B0", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "3px" }}>{l}</p>
                      <p style={{ fontSize: "13px", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{v}</p>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "14px 16px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "10px" }}>
                  <p style={{ fontSize: "13px", color: "#C9A84C", fontFamily: "'DM Sans', sans-serif" }}>
                    ✨ <strong>Tarifs :</strong> Site vitrine dès 600€ · One-page dès 400€ · Devis gratuit sous 24h
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
