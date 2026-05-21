import { useState, useRef } from "react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

const SECTORS = ["Commerce & Retail", "Restaurant & Traiteur", "BTP & Immobilier", "Santé & Bien-être", "Services aux entreprises", "Éducation & Formation", "Tourisme & Hôtellerie", "Agriculture", "Finance & Assurance", "Mode & Beauté", "Tech & Digital", "Artisanat & Art", "ONG & Association"];

const MARKETS = ["Congo Brazzaville", "Cameroun", "Côte d'Ivoire", "Sénégal", "Afrique francophone", "France", "France + Afrique", "International"];

const SYSTEM = `Tu es l'expert business plan de Nexalie Consulting. Tu génères des business plans structurés ET tu fais un benchmark réel du marché.

Réponds en JSON strict (sans backticks) avec ce format exact :
{
  "nom": "nom entreprise",
  "secteur": "secteur",
  "marche": "marché cible",
  "resume": "résumé exécutif 3-4 phrases percutantes",
  "vision": "vision en 1 phrase inspirante",
  "mission": "mission en 1 phrase concrète",
  "probleme": "problème que résout l'entreprise en 2 phrases",
  "solution": "solution proposée en 2 phrases",
  "cible": "description précise du client idéal",
  "concurrents": [
    {"nom": "concurrent 1", "forces": "leurs forces", "faiblesses": "leurs faiblesses"},
    {"nom": "concurrent 2", "forces": "leurs forces", "faiblesses": "leurs faiblesses"},
    {"nom": "concurrent 3", "forces": "leurs forces", "faiblesses": "leurs faiblesses"}
  ],
  "benchmark": {
    "tailleMarcheGlobal": "estimation taille marché mondial ou régional avec chiffre",
    "croissanceSecteur": "taux de croissance annuel du secteur avec %",
    "tendances": ["tendance clé 1", "tendance clé 2", "tendance clé 3"],
    "opportunites": ["opportunité 1 spécifique au marché cible", "opportunité 2", "opportunité 3"],
    "risques": ["risque 1", "risque 2"]
  },
  "services": [
    {"nom": "service/produit 1", "description": "description courte", "prix": "fourchette prix réaliste"},
    {"nom": "service/produit 2", "description": "description courte", "prix": "fourchette prix réaliste"},
    {"nom": "service/produit 3", "description": "description courte", "prix": "fourchette prix réaliste"}
  ],
  "modeleEconomique": "description du modèle économique en 2 phrases",
  "canaux": ["canal d'acquisition 1", "canal 2", "canal 3"],
  "objectifs": [
    {"periode": "6 mois", "ca": "CA visé réaliste", "clients": "nb clients", "action": "action prioritaire"},
    {"periode": "1 an", "ca": "CA visé", "clients": "nb clients", "action": "action prioritaire"},
    {"periode": "3 ans", "ca": "CA visé ambitieux", "clients": "nb clients", "action": "action prioritaire"}
  ],
  "budget": {
    "lancement": "budget lancement estimé",
    "mensuel": "charges mensuelles estimées",
    "seuilRentabilite": "seuil de rentabilité estimé"
  },
  "avantagesConcurrentiels": ["avantage 1 unique", "avantage 2", "avantage 3"],
  "prochainEtape": "la toute prochaine action concrète à faire cette semaine"
}

Sois précis avec les chiffres — donne des vraies estimations basées sur la réalité du marché africain ou français selon le contexte. JSON uniquement.`;

async function callClaude(prompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEM,
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
        try {
          const d = JSON.parse(line.slice(6));
          if (d.type === "content_block_delta" && d.delta?.text) onChunk(d.delta.text);
        } catch {}
      }
    }
  }
}

// ═══════════════════════════════════════════
// EDITABLE FIELD
// ═══════════════════════════════════════════

function EditableField({ value, onChange, multiline = false, color = "#4EC9B0", label }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const ref = useRef(null);

  const save = () => { onChange(draft); setEditing(false); };
  const cancel = () => { setDraft(value); setEditing(false); };

  if (editing) {
    return (
      <div>
        {multiline ? (
          <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={4} autoFocus
            style={{ width: "100%", padding: "10px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${color}50`, borderRadius: "8px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, outline: "none" }} />
        ) : (
          <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
            style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${color}50`, borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        )}
        <div style={{ display: "flex", gap: "6px", marginTop: "6px" }}>
          <button onClick={save} style={{ padding: "5px 14px", background: color, border: "none", borderRadius: "6px", color: "#070e1c", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>✓ Sauver</button>
          <button onClick={cancel} style={{ padding: "5px 12px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer" }}>Annuler</button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={() => { setEditing(true); setDraft(value); }} style={{ cursor: "text", padding: "8px 10px", borderRadius: "8px", border: "1px solid transparent", transition: "all 0.15s", position: "relative", group: true }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color}30`; e.currentTarget.style.background = `${color}05`; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "transparent"; }}>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.8)", lineHeight: 1.6, fontFamily: "'DM Sans', sans-serif" }}>{value}</p>
      <span style={{ position: "absolute", top: "6px", right: "8px", fontSize: "9px", color: color, fontFamily: "'IBM Plex Mono', monospace", opacity: 0.6 }}>✏️ éditer</span>
    </div>
  );
}

function EditableList({ items, onChange, color }) {
  const [editIdx, setEditIdx] = useState(null);
  const [draft, setDraft] = useState("");

  const save = () => {
    const updated = [...items];
    updated[editIdx] = draft;
    onChange(updated);
    setEditIdx(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
      {items.map((item, i) => (
        <div key={i}>
          {editIdx === i ? (
            <div style={{ display: "flex", gap: "6px" }}>
              <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus
                style={{ flex: 1, padding: "6px 10px", background: "rgba(255,255,255,0.06)", border: `1px solid ${color}50`, borderRadius: "6px", color: "#fff", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
              <button onClick={save} style={{ padding: "5px 10px", background: color, border: "none", borderRadius: "6px", color: "#070e1c", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>✓</button>
              <button onClick={() => setEditIdx(null)} style={{ padding: "5px 8px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", fontSize: "10px", cursor: "pointer" }}>✕</button>
            </div>
          ) : (
            <div onClick={() => { setEditIdx(i); setDraft(item); }} style={{ display: "flex", gap: "8px", padding: "5px 8px", borderRadius: "6px", cursor: "text", border: "1px solid transparent", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color}25`; e.currentTarget.style.background = `${color}05`; }}
              onMouseLeave={e => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "transparent"; }}>
              <span style={{ color, fontSize: "12px", flexShrink: 0 }}>→</span>
              <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.65)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{item}</span>
              <span style={{ marginLeft: "auto", fontSize: "9px", color, opacity: 0.5, flexShrink: 0 }}>✏️</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════

function Section({ title, color, icon, children }) {
  return (
    <div style={{ marginBottom: "16px", padding: "20px", background: `${color}06`, border: `1px solid ${color}20`, borderRadius: "14px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color, marginBottom: "12px" }}>
        {icon} {title.toUpperCase()}
      </p>
      {children}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [form, setForm] = useState({ nom: "", secteur: "", marche: "", description: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [bp, setBp] = useState(null);
  const [edited, setEdited] = useState(false);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const update = (k, v) => { setBp(p => ({ ...p, [k]: v })); setEdited(true); };

  const generate = async () => {
    setLoading(true); setBp(null); setEdited(false);
    let text = "";
    const prompt = `Génère le business plan pour :
Entreprise: ${form.nom || "Mon Entreprise"}
Secteur: ${form.secteur}
Marché: ${form.marche}
Description: ${form.description}
Budget lancement: ${form.budget || "non précisé"}

Inclus un benchmark réel du secteur avec des chiffres concrets pour le marché ${form.marche}.`;
    try {
      await callClaude(prompt, chunk => { text += chunk; });
      const clean = text.replace(/```json|```/g, "").trim();
      setBp(JSON.parse(clean));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const TEAL = "#4EC9B0";
  const GOLD = "#C9A84C";
  const PURPLE = "#7B5EA7";
  const CORAL = "#C0627A";
  const SAGE = "#4A7C59";
  const ORANGE = "#CE9178";

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 10% 10%, #0d1f35 0%, #070e1c 100%)", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, select { outline: none !important; }
        select option { background: #0d1f35; color: white; }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .fade-in { animation: fadeIn 0.5s ease forwards; }
      `}</style>

      {/* Header */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "14px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <span style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 300, color: "#fff" }}>Nexalie </span>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: GOLD }}>GÉNÉRATEUR BUSINESS PLAN IA</span>
        </div>
        {bp && edited && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(201,168,76,0.1)", border: "1px solid rgba(201,168,76,0.25)", borderRadius: "8px" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: GOLD }} />
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: GOLD }}>MODIFICATIONS EN COURS</span>
          </div>
        )}
      </div>

      <div style={{ maxWidth: bp ? "1200px" : "680px", margin: "0 auto", padding: "28px 20px", transition: "max-width 0.5s ease" }}>

        {/* FORM */}
        {!bp && (
          <div className="fade-in">
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(201,168,76,0.7)", marginBottom: "8px" }}>BUSINESS PLAN + BENCHMARK IA</p>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(24px, 4vw, 34px)", fontWeight: 300, color: "#fff", marginBottom: "6px" }}>
              Générez votre <em style={{ color: TEAL }}>business plan</em>
            </h1>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "28px", fontFamily: "'DM Sans', sans-serif" }}>
              L'IA génère le plan complet + un benchmark réel de votre marché avec des chiffres concrets. Vous pouvez ensuite modifier chaque section directement.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "24px" }}>
              {[
                { key: "nom", label: "NOM DE L'ENTREPRISE", ph: "Ex: Restaurant Mama Africa, Cabinet Koné..." },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{f.label}</label>
                  <input value={form[f.key]} onChange={e => set(f.key, e.target.value)} placeholder={f.ph}
                    style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "14px", fontFamily: "'DM Sans', sans-serif", transition: "border-color 0.2s" }} />
                </div>
              ))}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>SECTEUR *</label>
                  <select value={form.secteur} onChange={e => set("secteur", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${form.secteur ? TEAL + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: form.secteur ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                    <option value="">Sélectionner...</option>
                    {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>MARCHÉ CIBLE *</label>
                  <select value={form.marche} onChange={e => set("marche", e.target.value)}
                    style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${form.marche ? GOLD + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: form.marche ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                    <option value="">Sélectionner...</option>
                    {MARKETS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>DÉCRIVEZ VOTRE PROJET *</label>
                <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={4} placeholder="Décrivez votre projet, votre vision, ce qui vous différencie, vos clients cibles, vos produits/services..."
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }} />
              </div>

              <div>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>BUDGET DE LANCEMENT</label>
                <select value={form.budget} onChange={e => set("budget", e.target.value)}
                  style={{ width: "100%", padding: "12px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: form.budget ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                  <option value="">Non précisé</option>
                  <option>Moins de 5 000€</option>
                  <option>5 000 — 20 000€</option>
                  <option>20 000 — 50 000€</option>
                  <option>Plus de 50 000€</option>
                </select>
              </div>
            </div>

            {/* Info box */}
            <div style={{ padding: "14px 16px", background: "rgba(78,201,176,0.06)", border: "1px solid rgba(78,201,176,0.15)", borderRadius: "10px", marginBottom: "20px" }}>
              <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6 }}>
                🔍 <strong style={{ color: TEAL }}>Benchmark inclus</strong> — L'IA analyse votre secteur et génère des données de marché réelles : taille du marché, croissance, tendances, concurrents. Vous pouvez ensuite <strong style={{ color: GOLD }}>modifier chaque section directement</strong> dans le résultat.
              </p>
            </div>

            <button onClick={generate} disabled={!form.secteur || !form.marche || !form.description || loading}
              style={{ width: "100%", padding: "15px", background: form.secteur && form.marche && form.description && !loading ? TEAL : "rgba(255,255,255,0.05)", border: "none", borderRadius: "12px", color: form.secteur && form.marche && form.description && !loading ? "#070e1c" : "rgba(255,255,255,0.2)", fontSize: "15px", fontWeight: "700", cursor: form.secteur && form.marche && form.description && !loading ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
              {loading ? "⏳ Génération + Benchmark en cours..." : "✨ Générer mon Business Plan →"}
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div style={{ textAlign: "center", padding: "48px" }}>
            <div style={{ width: "40px", height: "40px", border: `3px solid ${TEAL}25`, borderTop: `3px solid ${TEAL}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 16px" }} />
            <p style={{ color: TEAL, fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", letterSpacing: "1px", marginBottom: "6px" }}>L'IA GÉNÈRE VOTRE BUSINESS PLAN...</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "12px", fontFamily: "'DM Sans', sans-serif" }}>Analyse du marché · Benchmark sectoriel · Structure complète</p>
          </div>
        )}

        {/* RESULT */}
        {bp && !loading && (
          <div className="fade-in">
            {/* Top bar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)", marginBottom: "4px" }}>BUSINESS PLAN GÉNÉRÉ — CLIQUEZ POUR MODIFIER</p>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: "#fff" }}>{bp.nom || form.nom}</h1>
                <p style={{ fontSize: "12px", color: TEAL, fontFamily: "'IBM Plex Mono', monospace" }}>{bp.secteur} · {bp.marche}</p>
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => { setBp(null); setForm({ nom: "", secteur: "", marche: "", description: "", budget: "" }); }}
                  style={{ padding: "9px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                  ↺ Nouveau
                </button>
                <button onClick={generate}
                  style={{ padding: "9px 16px", background: "rgba(78,201,176,0.1)", border: "1px solid rgba(78,201,176,0.25)", borderRadius: "8px", color: TEAL, fontSize: "12px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                  ↻ Regénérer
                </button>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>

              {/* LEFT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                <Section title="Résumé Exécutif" color={TEAL} icon="◈">
                  <EditableField value={bp.resume} onChange={v => update("resume", v)} multiline color={TEAL} />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginTop: "10px" }}>
                    <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>VISION</p>
                      <EditableField value={bp.vision} onChange={v => update("vision", v)} color={TEAL} />
                    </div>
                    <div style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>MISSION</p>
                      <EditableField value={bp.mission} onChange={v => update("mission", v)} color={TEAL} />
                    </div>
                  </div>
                </Section>

                <Section title="Problème & Solution" color={CORAL} icon="◉">
                  <div style={{ marginBottom: "8px" }}>
                    <p style={{ fontSize: "9px", color: CORAL, fontFamily: "monospace", marginBottom: "4px" }}>PROBLÈME IDENTIFIÉ</p>
                    <EditableField value={bp.probleme} onChange={v => update("probleme", v)} multiline color={CORAL} />
                  </div>
                  <div>
                    <p style={{ fontSize: "9px", color: SAGE, fontFamily: "monospace", marginBottom: "4px" }}>VOTRE SOLUTION</p>
                    <EditableField value={bp.solution} onChange={v => update("solution", v)} multiline color={SAGE} />
                  </div>
                </Section>

                <Section title="Services & Offres" color={GOLD} icon="◐">
                  {bp.services?.map((s, i) => (
                    <div key={i} style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "8px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                        <EditableField value={s.nom} onChange={v => { const updated = [...bp.services]; updated[i] = { ...s, nom: v }; update("services", updated); }} color={GOLD} />
                        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "14px", color: GOLD, flexShrink: 0, marginLeft: "8px" }}>{s.prix}</span>
                      </div>
                      <EditableField value={s.description} onChange={v => { const updated = [...bp.services]; updated[i] = { ...s, description: v }; update("services", updated); }} color={GOLD} />
                    </div>
                  ))}
                </Section>

                <Section title="Avantages Concurrentiels" color={SAGE} icon="◑">
                  <EditableList items={bp.avantagesConcurrentiels || []} onChange={v => update("avantagesConcurrentiels", v)} color={SAGE} />
                </Section>

              </div>

              {/* RIGHT COLUMN */}
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

                {/* BENCHMARK */}
                <Section title="📊 Benchmark Marché" color={PURPLE} icon="◈">
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "12px" }}>
                    <div style={{ padding: "10px", background: `${PURPLE}10`, borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>TAILLE DU MARCHÉ</p>
                      <p style={{ fontSize: "13px", color: PURPLE, fontFamily: "'Fraunces', serif" }}>{bp.benchmark?.tailleMarcheGlobal}</p>
                    </div>
                    <div style={{ padding: "10px", background: `${SAGE}10`, borderRadius: "8px", textAlign: "center" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>CROISSANCE SECTEUR</p>
                      <p style={{ fontSize: "13px", color: SAGE, fontFamily: "'Fraunces', serif" }}>{bp.benchmark?.croissanceSecteur}</p>
                    </div>
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <p style={{ fontSize: "9px", color: PURPLE, fontFamily: "monospace", marginBottom: "6px" }}>TENDANCES CLÉS</p>
                    <EditableList items={bp.benchmark?.tendances || []} onChange={v => update("benchmark", { ...bp.benchmark, tendances: v })} color={PURPLE} />
                  </div>
                  <div style={{ marginBottom: "10px" }}>
                    <p style={{ fontSize: "9px", color: SAGE, fontFamily: "monospace", marginBottom: "6px" }}>OPPORTUNITÉS</p>
                    <EditableList items={bp.benchmark?.opportunites || []} onChange={v => update("benchmark", { ...bp.benchmark, opportunites: v })} color={SAGE} />
                  </div>
                  <div>
                    <p style={{ fontSize: "9px", color: CORAL, fontFamily: "monospace", marginBottom: "6px" }}>RISQUES À SURVEILLER</p>
                    <EditableList items={bp.benchmark?.risques || []} onChange={v => update("benchmark", { ...bp.benchmark, risques: v })} color={CORAL} />
                  </div>
                </Section>

                <Section title="Concurrents" color={ORANGE} icon="◎">
                  {bp.concurrents?.map((c, i) => (
                    <div key={i} style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "8px" }}>
                      <p style={{ fontSize: "12px", fontWeight: "600", color: "#fff", marginBottom: "6px", fontFamily: "'DM Sans', sans-serif" }}>{c.nom}</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                        <div>
                          <p style={{ fontSize: "9px", color: SAGE, fontFamily: "monospace", marginBottom: "2px" }}>✅ FORCES</p>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{c.forces}</p>
                        </div>
                        <div>
                          <p style={{ fontSize: "9px", color: CORAL, fontFamily: "monospace", marginBottom: "2px" }}>⚠️ FAIBLESSES</p>
                          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4 }}>{c.faiblesses}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </Section>

                <Section title="Objectifs & Finances" color={TEAL} icon="◑">
                  {bp.objectifs?.map((o, i) => (
                    <div key={i} style={{ display: "flex", gap: "10px", padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "8px", alignItems: "flex-start" }}>
                      <span style={{ padding: "3px 10px", background: `${[TEAL, GOLD, PURPLE][i]}20`, color: [TEAL, GOLD, PURPLE][i], borderRadius: "4px", fontSize: "10px", fontFamily: "monospace", flexShrink: 0, fontWeight: "700" }}>{o.periode}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: "12px", marginBottom: "4px" }}>
                          <span style={{ fontSize: "12px", color: [TEAL, GOLD, PURPLE][i], fontFamily: "'Fraunces', serif" }}>{o.ca}</span>
                          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{o.clients} clients</span>
                        </div>
                        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>{o.action}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px", marginTop: "8px" }}>
                    {[["Lancement", bp.budget?.lancement, TEAL], ["Mensuel", bp.budget?.mensuel, GOLD], ["Seuil rentabilité", bp.budget?.seuilRentabilite, SAGE]].map(([l, v, c]) => (
                      <div key={l} style={{ padding: "10px", background: `${c}08`, borderRadius: "8px", textAlign: "center" }}>
                        <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>{l.toUpperCase()}</p>
                        <p style={{ fontSize: "12px", color: c, fontFamily: "'Fraunces', serif" }}>{v}</p>
                      </div>
                    ))}
                  </div>
                </Section>

              </div>
            </div>

            {/* Prochaine étape */}
            <div style={{ marginTop: "14px", padding: "20px", background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: "14px", display: "flex", gap: "16px", alignItems: "center" }}>
              <span style={{ fontSize: "28px" }}>🎯</span>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: GOLD, marginBottom: "4px" }}>VOTRE PROCHAINE ACTION — CETTE SEMAINE</p>
                <EditableField value={bp.prochainEtape} onChange={v => update("prochainEtape", v)} color={GOLD} />
              </div>
            </div>

            {/* Edit hint */}
            <div style={{ marginTop: "12px", textAlign: "center" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>
                ✏️ CLIQUEZ SUR N'IMPORTE QUELLE SECTION POUR LA MODIFIER · NEXALIE CONSULTING
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
