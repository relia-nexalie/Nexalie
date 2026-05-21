import { useState } from "react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

const TEAL = "#4EC9B0"; const GOLD = "#C9A84C"; const PURPLE = "#7B5EA7";
const CORAL = "#C0627A"; const SAGE = "#4A7C59"; const ORANGE = "#CE9178";
const BLUE = "#569CD6";

const TOOLS = [
  { id: "budget", icon: "💰", label: "Simulateur Budget", sub: "Estimez votre projet", free: true, color: TEAL },
  { id: "cdc", icon: "📋", label: "Cahier des Charges", sub: "Document détaillé", free: false, color: PURPLE },
  { id: "suivi", icon: "📊", label: "Suivi Projet", sub: "Dashboard client", free: false, color: GOLD, internal: true },
  { id: "veille", icon: "🔍", label: "Veille Concurrentielle", sub: "Analyse marché", free: false, color: CORAL },
];

const SYSTEMS = {
  budget: `Tu es l'expert financier de Nexalie Consulting. Génère une estimation budgétaire détaillée en JSON strict (sans backticks).

Format : {"titre":"Estimation Budget [projet]","resume":"résumé 2 phrases","postes":[{"nom":"poste de dépense","categorie":"Conception|Développement|Contenu|Marketing|Infrastructure|Formation|Divers","montantMin":number,"montantMax":number,"justification":"pourquoi ce coût","priorite":"essentiel|recommandé|optionnel"}],"totalMin":number,"totalMax":number,"mensuelMin":number,"mensuelMax":number,"delaiMois":number,"roiEstime":"ROI estimé en %","risquesBudgetaires":["risque 1","risque 2"],"conseils":["conseil 1","conseil 2","conseil 3"],"prochainEtape":"action immédiate"}

Donne des vrais chiffres réalistes selon le marché (France ou Afrique). JSON uniquement.`,

  cdc: `Tu es l'expert technique de Nexalie Consulting. Génère un cahier des charges complet et détaillé en JSON strict (sans backticks).

Format : {"titre":"CDC [projet]","version":"1.0","date":"Mars 2026","contexte":"contexte 3 phrases","enjeux":["enjeu 1","enjeu 2","enjeu 3"],"objectifsStrategiques":["objectif 1","objectif 2"],"objectifsMesurables":[{"objectif":"objectif","indicateur":"KPI mesurable","cible":"valeur cible"}],"perimetre":{"inclus":["élément 1","élément 2","élément 3","élément 4"],"exclus":["exclu 1","exclu 2"]},"utilisateurs":[{"profil":"profil utilisateur","besoins":["besoin 1","besoin 2"],"frequence":"fréquence d'utilisation"}],"fonctionnalites":[{"id":"F01","nom":"fonctionnalité","description":"description détaillée","priorite":"Must Have|Should Have|Nice to Have","complexite":"Simple|Moyenne|Complexe","criteresAcceptation":["critère 1","critère 2"]}],"exigencesTechniques":{"performance":["exigence perf 1","exigence perf 2"],"securite":["exigence sécu 1","exigence sécu 2"],"compatibilite":["compatibilité 1"],"hebergement":"solution hébergement recommandée"},"planning":[{"phase":"Phase","duree":"durée","livrables":["livrable 1","livrable 2"]}],"budget":{"fourchette":"fourchette réaliste","repartition":["poste 1: X%","poste 2: Y%"]},"risques":[{"risque":"risque","probabilite":"Faible|Moyenne|Élevée","impact":"Faible|Moyen|Élevé","mitigation":"comment l'éviter"}],"criteresSucces":["critère de succès 1","critère 2"]}

JSON uniquement.`,

  veille: `Tu es l'analyste stratégique de Nexalie Consulting. Génère une analyse concurrentielle complète en JSON strict (sans backticks).

Format : {"secteur":"secteur","marche":"marché","dateAnalyse":"Mars 2026","synthese":"synthèse executive 3 phrases","tailleMarcheEstimee":"estimation avec chiffre","croissanceAnnuelle":"% de croissance","maturiteMarche":"Émergent|En croissance|Mature|En déclin","acteurs":[{"nom":"acteur/type concurrent","type":"Direct|Indirect|Substitut","taille":"Petit|Moyen|Grand","forces":["force 1","force 2"],"faiblesses":["faiblesse 1","faiblesse 2"],"positionnement":"leur positionnement","prixMoyen":"fourchette prix","partMarcheEstimee":"% estimé"}],"tendances":[{"tendance":"tendance","impact":"Fort|Moyen|Faible","opportunite":"opportunité associée"}],"barrieresEntree":["barrière 1","barrière 2","barrière 3"],"facteursSucces":["facteur clé 1","facteur clé 2","facteur clé 3"],"segmentsNonCouverts":["segment non adressé 1","segment 2"],"recommandations":[{"action":"action recommandée","priorite":"Haute|Moyenne","impact":"impact attendu"}],"avantagesConcurrentielsRecommandes":["avantage à développer 1","avantage 2"]}

JSON uniquement.`
};

async function callClaude(systemKey, prompt, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: SYSTEMS[systemKey],
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
// UI HELPERS
// ═══════════════════════════════════════════

const Card = ({ color, children, style = {} }) => (
  <div style={{ padding: "16px", background: `${color}06`, border: `1px solid ${color}20`, borderRadius: "12px", ...style }}>{children}</div>
);

const Label = ({ color, children }) => (
  <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color, marginBottom: "8px" }}>{children}</p>
);

const Txt = ({ muted, children, style = {} }) => (
  <p style={{ fontSize: "13px", color: muted ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.85)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, ...style }}>{children}</p>
);

const Tag = ({ color, children }) => (
  <span style={{ display: "inline-block", padding: "3px 10px", background: `${color}15`, color, fontSize: "10px", borderRadius: "6px", fontFamily: "'IBM Plex Mono', monospace", marginRight: "5px", marginBottom: "4px" }}>{children}</span>
);

const PriorityBadge = ({ value }) => {
  const colors = { "Must Have": "#FF6B4A", "Should Have": GOLD, "Nice to Have": SAGE, "Haute": "#FF6B4A", "Moyenne": GOLD, "Faible": SAGE, "essentiel": TEAL, "recommandé": GOLD, "optionnel": "rgba(255,255,255,0.3)", "Fort": "#FF6B4A", "Moyen": GOLD };
  const c = colors[value] || TEAL;
  return <span style={{ padding: "2px 8px", background: `${c}20`, color: c, fontSize: "9px", borderRadius: "4px", fontFamily: "'IBM Plex Mono', monospace", fontWeight: "700" }}>{value}</span>;
};

const Field = ({ label, value, onChange, color, multiline }) => {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const save = () => { onChange(draft); setEditing(false); };
  if (editing) return (
    <div>
      {multiline
        ? <textarea value={draft} onChange={e => setDraft(e.target.value)} rows={3} autoFocus style={{ width: "100%", padding: "8px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${color}50`, borderRadius: "8px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
        : <input value={draft} onChange={e => setDraft(e.target.value)} autoFocus style={{ width: "100%", padding: "7px 12px", background: "rgba(255,255,255,0.06)", border: `1px solid ${color}50`, borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />}
      <div style={{ display: "flex", gap: "5px", marginTop: "5px" }}>
        <button onClick={save} style={{ padding: "4px 12px", background: color, border: "none", borderRadius: "5px", color: "#070e1c", fontSize: "10px", fontWeight: "700", cursor: "pointer" }}>✓</button>
        <button onClick={() => setEditing(false)} style={{ padding: "4px 10px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "5px", color: "rgba(255,255,255,0.4)", fontSize: "10px", cursor: "pointer" }}>✕</button>
      </div>
    </div>
  );
  return (
    <div onClick={() => { setEditing(true); setDraft(value); }} style={{ cursor: "text", padding: "6px 8px", borderRadius: "6px", border: "1px solid transparent", transition: "all 0.15s", position: "relative" }}
      onMouseEnter={e => { e.currentTarget.style.border = `1px solid ${color}30`; e.currentTarget.style.background = `${color}05`; }}
      onMouseLeave={e => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "transparent"; }}>
      <Txt muted>{value}</Txt>
      <span style={{ position: "absolute", top: "4px", right: "6px", fontSize: "9px", color, opacity: 0.5 }}>✏️</span>
    </div>
  );
};

const FormField = ({ label, value, onChange, type = "text", placeholder, options, required, color }) => (
  <div>
    <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>{label}{required ? " *" : ""}</label>
    {type === "select" ? (
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${value ? (color || TEAL) + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: value ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none", cursor: "pointer" }}>
        <option value="">Sélectionner...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : type === "textarea" ? (
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, outline: "none" }} />
    ) : (
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} type={type} style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", color: "#fff", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
    )}
  </div>
);

// ═══════════════════════════════════════════
// TOOL 1 — SIMULATEUR BUDGET
// ═══════════════════════════════════════════

function BudgetTool({ isPremium }) {
  const [form, setForm] = useState({ type: "", marche: "", description: "", delai: "", budget: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const color = TEAL;

  const generate = async () => {
    setLoading(true); setResult(null);
    let text = "";
    const prompt = `Projet: ${form.type} | Marché: ${form.marche} | Budget indicatif: ${form.budget || "non précisé"} | Délai: ${form.delai || "flexible"} | Description: ${form.description}`;
    try {
      await callClaude("budget", prompt, chunk => { text += chunk; });
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const catColors = { "Conception": TEAL, "Développement": PURPLE, "Contenu": GOLD, "Marketing": CORAL, "Infrastructure": BLUE, "Formation": SAGE, "Divers": ORANGE };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Label color={color}>✅ OUTIL GRATUIT — SIMULATEUR BUDGET</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>Simulateur de Budget Projet</h2>
        <Txt muted>Obtenez une estimation réaliste et détaillée de votre projet digital en 30 secondes.</Txt>
      </div>

      {!result ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="TYPE DE PROJET" value={form.type} onChange={v => set("type", v)} type="select" required color={color}
              options={["Site web vitrine", "Site e-commerce", "Application mobile", "Refonte site existant", "Identité visuelle complète", "Stratégie digitale 6 mois", "Formation IA équipe", "Automatisation processus", "Audit + accompagnement 3 mois"]} />
            <FormField label="MARCHÉ" value={form.marche} onChange={v => set("marche", v)} type="select" required color={color}
              options={["Congo Brazzaville", "Cameroun", "Côte d'Ivoire", "Afrique francophone", "France", "France + Afrique"]} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="BUDGET INDICATIF" value={form.budget} onChange={v => set("budget", v)} type="select" color={color}
              options={["Moins de 1 000€", "1 000 — 3 000€", "3 000 — 10 000€", "10 000 — 30 000€", "Plus de 30 000€"]} />
            <FormField label="DÉLAI SOUHAITÉ" value={form.delai} onChange={v => set("delai", v)} type="select" color={color}
              options={["Urgent — moins d'1 mois", "1 — 3 mois", "3 — 6 mois", "6 mois — 1 an", "Flexible"]} />
          </div>
          <FormField label="DÉCRIVEZ VOTRE PROJET" value={form.description} onChange={v => set("description", v)} type="textarea" required
            placeholder="Décrivez votre projet en détail — objectifs, fonctionnalités souhaitées, taille de l'équipe, contraintes particulières..." />

          {loading && (
            <div style={{ textAlign: "center", padding: "16px" }}>
              <div style={{ width: "32px", height: "32px", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>ANALYSE EN COURS...</p>
            </div>
          )}

          <button onClick={generate} disabled={!form.type || !form.marche || !form.description || loading}
            style={{ padding: "13px", background: form.type && form.marche && form.description && !loading ? color : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.type && form.marche && form.description && !loading ? "#070e1c" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
            💰 Simuler mon budget →
          </button>
        </div>
      ) : (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#fff" }}>{result.titre}</h3>
              <Txt muted>{result.resume}</Txt>
            </div>
            <button onClick={() => setResult(null)} style={{ padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer" }}>↺ Nouveau</button>
          </div>

          {/* Summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
            {[["Budget Total", `${result.totalMin?.toLocaleString()} — ${result.totalMax?.toLocaleString()}€`, color], ["Mensuel estimé", `${result.mensuelMin?.toLocaleString()} — ${result.mensuelMax?.toLocaleString()}€`, GOLD], ["Délai", `${result.delaiMois} mois`, PURPLE], ["ROI estimé", result.roiEstime, SAGE]].map(([l, v, c]) => (
              <Card color={c} key={l}>
                <Label color={c}>{l.toUpperCase()}</Label>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: c }}>{v}</p>
              </Card>
            ))}
          </div>

          {/* Postes */}
          <Card color={color} style={{ marginBottom: "12px" }}>
            <Label color={color}>DÉTAIL DES POSTES</Label>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  {["Poste", "Catégorie", "Budget", "Priorité", "Justification"].map(h => (
                    <th key={h} style={{ padding: "6px 10px", textAlign: "left", fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.postes?.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                    <td style={{ padding: "8px 10px", fontSize: "12px", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{p.nom}</td>
                    <td style={{ padding: "8px 10px" }}><Tag color={catColors[p.categorie] || TEAL}>{p.categorie}</Tag></td>
                    <td style={{ padding: "8px 10px", fontFamily: "'Fraunces', serif", fontSize: "13px", color }}>{p.montantMin?.toLocaleString()} — {p.montantMax?.toLocaleString()}€</td>
                    <td style={{ padding: "8px 10px" }}><PriorityBadge value={p.priorite} /></td>
                    <td style={{ padding: "8px 10px", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{p.justification}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <Card color={CORAL}>
              <Label color={CORAL}>RISQUES BUDGÉTAIRES</Label>
              {result.risquesBudgetaires?.map((r, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}><span style={{ color: CORAL }}>⚠️</span><Txt muted>{r}</Txt></div>)}
            </Card>
            <Card color={SAGE}>
              <Label color={SAGE}>CONSEILS NEXALIE</Label>
              {result.conseils?.map((c, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "4px" }}><span style={{ color: SAGE }}>→</span><Txt muted>{c}</Txt></div>)}
            </Card>
          </div>

          <div style={{ marginTop: "10px", padding: "14px 16px", background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: "10px" }}>
            <Label color={GOLD}>🎯 PROCHAINE ÉTAPE</Label>
            <Txt>{result.prochainEtape}</Txt>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TOOL 2 — CDC DÉTAILLÉ
// ═══════════════════════════════════════════

function CDCTool({ isPremium }) {
  const [form, setForm] = useState({ projet: "", type: "", marche: "", objectif: "", budget: "", delai: "", contraintes: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const color = PURPLE;

  const generate = async () => {
    setLoading(true); setResult(null);
    let text = "";
    const prompt = `Projet: ${form.projet} | Type: ${form.type} | Marché: ${form.marche} | Objectif: ${form.objectif} | Budget: ${form.budget || "flexible"} | Délai: ${form.delai || "flexible"} | Contraintes: ${form.contraintes || "aucune"}`;
    try {
      await callClaude("cdc", prompt, chunk => { text += chunk; });
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const complexColors = { "Simple": SAGE, "Moyenne": GOLD, "Complexe": CORAL };
  const riskColors = { "Faible": SAGE, "Moyenne": GOLD, "Élevée": CORAL, "Moyen": GOLD, "Élevé": CORAL };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Label color={color}>⭐ OUTIL PREMIUM — CAHIER DES CHARGES</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>Cahier des Charges Détaillé</h2>
        <Txt muted>Document professionnel complet avec fonctionnalités, exigences techniques, planning et gestion des risques.</Txt>
      </div>

      {!isPremium ? (
        <div style={{ padding: "32px", background: `${color}08`, border: `1px solid ${color}25`, borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#fff", marginBottom: "8px" }}>Outil Premium</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>29€/mois — Accès illimité à tous les outils</p>
          <button style={{ padding: "12px 28px", background: color, border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Passer Premium →</button>
        </div>
      ) : !result ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="NOM DU PROJET" value={form.projet} onChange={v => set("projet", v)} placeholder="Ex: Site e-commerce Mode Élégance" required />
            <FormField label="TYPE DE PROJET" value={form.type} onChange={v => set("type", v)} type="select" required color={color}
              options={["Site web vitrine", "Site e-commerce", "Application mobile", "Refonte site existant", "Plateforme SaaS", "Automatisation processus", "Mise en place CRM/ERP", "Formation digitale", "Audit & stratégie digitale"]} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="MARCHÉ" value={form.marche} onChange={v => set("marche", v)} type="select" required color={color}
              options={["Congo Brazzaville", "Cameroun", "Côte d'Ivoire", "Afrique francophone", "France", "France + Afrique"]} />
            <FormField label="BUDGET" value={form.budget} onChange={v => set("budget", v)} type="select" color={color}
              options={["Moins de 1 000€", "1 000 — 5 000€", "5 000 — 20 000€", "Plus de 20 000€"]} />
          </div>
          <FormField label="OBJECTIF PRINCIPAL" value={form.objectif} onChange={v => set("objectif", v)} type="textarea" required
            placeholder="Quel est le but principal de ce projet ? Qu'est-ce que vous voulez accomplir ?" />
          <FormField label="CONTRAINTES PARTICULIÈRES" value={form.contraintes} onChange={v => set("contraintes", v)} type="textarea"
            placeholder="Contraintes techniques, légales, organisationnelles, deadline imposée..." />

          {loading && <div style={{ textAlign: "center", padding: "16px" }}><div style={{ width: "32px", height: "32px", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} /><p style={{ color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>RÉDACTION DU CDC...</p></div>}

          <button onClick={generate} disabled={!form.projet || !form.type || !form.marche || !form.objectif || loading}
            style={{ padding: "13px", background: form.projet && form.type && form.marche && form.objectif && !loading ? color : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.projet && form.type && form.marche && form.objectif && !loading ? "#fff" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            📋 Générer le Cahier des Charges →
          </button>
        </div>
      ) : (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#fff" }}>{result.titre}</h3>
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>v{result.version} · {result.date}</p>
            </div>
            <button onClick={() => setResult(null)} style={{ padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer" }}>↺ Nouveau</button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={color}>
                <Label color={color}>CONTEXTE & ENJEUX</Label>
                <Txt muted style={{ marginBottom: "8px" }}>{result.contexte}</Txt>
                {result.enjeux?.map((e, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "3px" }}><span style={{ color }}>→</span><Txt muted>{e}</Txt></div>)}
              </Card>

              <Card color={color}>
                <Label color={color}>PÉRIMÈTRE</Label>
                <p style={{ fontSize: "10px", color: SAGE, fontFamily: "monospace", marginBottom: "4px" }}>✅ INCLUS</p>
                {result.perimetre?.inclus?.map((p, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "2px" }}><span style={{ color: SAGE, fontSize: "11px" }}>✓</span><Txt muted>{p}</Txt></div>)}
                <p style={{ fontSize: "10px", color: CORAL, fontFamily: "monospace", marginTop: "8px", marginBottom: "4px" }}>❌ EXCLUS</p>
                {result.perimetre?.exclus?.map((p, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "2px" }}><span style={{ color: CORAL, fontSize: "11px" }}>✕</span><Txt muted>{p}</Txt></div>)}
              </Card>

              <Card color={GOLD}>
                <Label color={GOLD}>OBJECTIFS MESURABLES</Label>
                {result.objectifsMesurables?.map((o, i) => (
                  <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "6px" }}>
                    <Txt style={{ marginBottom: "3px" }}>{o.objectif}</Txt>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <Tag color={GOLD}>{o.indicateur}</Tag>
                      <Tag color={SAGE}>Cible : {o.cible}</Tag>
                    </div>
                  </div>
                ))}
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={PURPLE}>
                <Label color={PURPLE}>FONCTIONNALITÉS</Label>
                {result.fonctionnalites?.map((f, i) => (
                  <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{f.id}</span>
                        <Txt style={{ fontSize: "12px", fontWeight: "600" }}>{f.nom}</Txt>
                      </div>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <PriorityBadge value={f.priorite} />
                        <span style={{ padding: "2px 6px", background: `${complexColors[f.complexite] || TEAL}15`, color: complexColors[f.complexite] || TEAL, fontSize: "9px", borderRadius: "4px", fontFamily: "monospace" }}>{f.complexite}</span>
                      </div>
                    </div>
                    <Txt muted style={{ fontSize: "12px", marginBottom: "5px" }}>{f.description}</Txt>
                    {f.criteresAcceptation?.map((c, j) => <div key={j} style={{ display: "flex", gap: "5px" }}><span style={{ color: SAGE, fontSize: "10px" }}>✓</span><span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{c}</span></div>)}
                  </div>
                ))}
              </Card>

              <Card color={CORAL}>
                <Label color={CORAL}>RISQUES</Label>
                {result.risques?.map((r, i) => (
                  <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <Txt style={{ fontSize: "12px", fontWeight: "600" }}>{r.risque}</Txt>
                      <div style={{ display: "flex", gap: "4px" }}>
                        <span style={{ padding: "2px 6px", background: `${riskColors[r.probabilite] || GOLD}15`, color: riskColors[r.probabilite] || GOLD, fontSize: "9px", borderRadius: "4px", fontFamily: "monospace" }}>P:{r.probabilite}</span>
                        <span style={{ padding: "2px 6px", background: `${riskColors[r.impact] || GOLD}15`, color: riskColors[r.impact] || GOLD, fontSize: "9px", borderRadius: "4px", fontFamily: "monospace" }}>I:{r.impact}</span>
                      </div>
                    </div>
                    <Txt muted style={{ fontSize: "11px" }}>🛡️ {r.mitigation}</Txt>
                  </div>
                ))}
              </Card>

              <Card color={SAGE}>
                <Label color={SAGE}>BUDGET & PLANNING</Label>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: SAGE, marginBottom: "8px" }}>{result.budget?.fourchette}</p>
                {result.budget?.repartition?.map((r, i) => <Tag key={i} color={SAGE}>{r}</Tag>)}
                <div style={{ marginTop: "10px" }}>
                  {result.planning?.map((p, i) => (
                    <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px", alignItems: "center" }}>
                      <span style={{ padding: "2px 8px", background: `${GOLD}20`, color: GOLD, fontSize: "10px", borderRadius: "4px", fontFamily: "monospace", flexShrink: 0 }}>{p.phase}</span>
                      <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{p.duree}</span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TOOL 3 — SUIVI PROJET (INTERNE)
// ═══════════════════════════════════════════

const SAMPLE_PROJECTS = [
  {
    id: 1, client: "Groupe Mbemba", pays: "🇨🇬", pack: "Pack Démarrage", startDate: "Jan 2026",
    status: "En cours", progress: 65, color: TEAL,
    phases: [
      { nom: "Audit initial", status: "done", date: "15 Jan" },
      { nom: "Rapport + recommandations", status: "done", date: "20 Jan" },
      { nom: "Mise en place outils", status: "current", date: "En cours" },
      { nom: "Formation équipe", status: "todo", date: "Mars 2026" },
      { nom: "Bilan 3 mois", status: "todo", date: "Avril 2026" },
    ],
    kpis: [{ label: "Site web", valeur: "✅ Livré" }, { label: "Google My Business", valeur: "✅ Actif" }, { label: "Newsletter", valeur: "⏳ En cours" }, { label: "Leads générés", valeur: "12 ce mois" }],
    prochaine: "18 mars — Session mensuelle de suivi (Zoom 14h)",
    notes: "Client très motivé. Besoin d'aide sur Instagram. Potentiel upsell Pack Transformation.",
    facturation: { mensuel: "400€", statut: "✅ Payé Feb" },
  },
  {
    id: 2, client: "Cabinet RH Diallo", pays: "🇫🇷", pack: "Pack Transformation", startDate: "Fev 2026",
    status: "En cours", progress: 30, color: GOLD,
    phases: [
      { nom: "Audit initial", status: "done", date: "5 Fev" },
      { nom: "Roadmap digitale", status: "done", date: "12 Fev" },
      { nom: "Refonte site web", status: "current", date: "En cours" },
      { nom: "Stratégie LinkedIn", status: "todo", date: "Avril 2026" },
      { nom: "Automatisation CRM", status: "todo", date: "Mai 2026" },
    ],
    kpis: [{ label: "Trafic site", valeur: "+0% (site en refonte)" }, { label: "LinkedIn followers", valeur: "245 → 312" }, { label: "Leads entrants", valeur: "3 ce mois" }, { label: "ROI estimé", valeur: "En cours" }],
    prochaine: "22 mars — Validation maquettes site (Zoom 10h)",
    notes: "Attend la refonte site. Très actif sur LinkedIn. Prêt pour l'automatisation.",
    facturation: { mensuel: "600€", statut: "⏳ À facturer" },
  },
];

function SuiviTool() {
  const [projects, setProjects] = useState(SAMPLE_PROJECTS);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newNote, setNewNote] = useState("");
  const color = GOLD;

  const proj = selected ? projects.find(p => p.id === selected) : null;

  const statusColor = { "done": SAGE, "current": GOLD, "todo": "rgba(255,255,255,0.2)" };
  const statusLabel = { "done": "✅", "current": "⏳", "todo": "○" };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
        <div>
          <Label color={color}>🔒 OUTIL INTERNE — SUIVI PROJETS</Label>
          <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>Suivi de Projets Clients</h2>
          <Txt muted>Tableau de bord de toutes vos missions en cours.</Txt>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} style={{ padding: "9px 16px", background: `${color}15`, border: `1px solid ${color}30`, borderRadius: "8px", color, fontSize: "12px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>+ Nouveau projet</button>
      </div>

      {/* KPIs globaux */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
        {[["Projets actifs", projects.length, TEAL], ["CA mensuel", projects.reduce((a, p) => a + parseInt(p.facturation.mensuel), 0) + "€", GOLD], ["Taux avancement moyen", Math.round(projects.reduce((a, p) => a + p.progress, 0) / projects.length) + "%", PURPLE], ["Actions en attente", projects.filter(p => p.phases.some(ph => ph.status === "current")).length, CORAL]].map(([l, v, c]) => (
          <Card color={c} key={l}>
            <Label color={c}>{l.toUpperCase()}</Label>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: c }}>{v}</p>
          </Card>
        ))}
      </div>

      {/* Project list */}
      {!proj ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {projects.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)} style={{ padding: "16px", background: `${p.color}06`, border: `1px solid ${p.color}20`, borderRadius: "12px", cursor: "pointer", transition: "all 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = `${p.color}40`; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = `${p.color}20`; }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
                <div>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span style={{ fontSize: "14px" }}>{p.pays}</span>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: "#fff" }}>{p.client}</span>
                    <Tag color={p.color}>{p.pack}</Tag>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginTop: "2px" }}>Démarré {p.startDate} · Prochaine action : {p.prochaine.split("—")[0]}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: p.color }}>{p.progress}%</p>
                  <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{p.facturation.statut}</p>
                </div>
              </div>
              <div style={{ height: "5px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${p.progress}%`, height: "100%", background: `linear-gradient(90deg, ${p.color}80, ${p.color})`, borderRadius: "3px", transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ animation: "fadeIn 0.4s ease" }}>
          <button onClick={() => setSelected(null)} style={{ padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer", marginBottom: "16px" }}>← Tous les projets</button>

          <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "16px" }}>
            <span style={{ fontSize: "16px" }}>{proj.pays}</span>
            <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: "#fff" }}>{proj.client}</h3>
            <Tag color={proj.color}>{proj.pack}</Tag>
            <Tag color={proj.color}>{proj.facturation.mensuel}/mois</Tag>
            <Tag color={proj.facturation.statut.includes("✅") ? SAGE : GOLD}>{proj.facturation.statut}</Tag>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={proj.color}>
                <Label color={proj.color}>PROGRESSION — {proj.progress}%</Label>
                <div style={{ height: "8px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden", marginBottom: "14px" }}>
                  <div style={{ width: `${proj.progress}%`, height: "100%", background: `linear-gradient(90deg, ${proj.color}80, ${proj.color})`, borderRadius: "4px" }} />
                </div>
                {proj.phases.map((ph, i) => (
                  <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "center" }}>
                    <span style={{ color: statusColor[ph.status], fontSize: "14px", flexShrink: 0 }}>{statusLabel[ph.status]}</span>
                    <span style={{ fontSize: "12px", color: ph.status === "done" ? "rgba(255,255,255,0.4)" : ph.status === "current" ? "#fff" : "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif", textDecoration: ph.status === "done" ? "line-through" : "none" }}>{ph.nom}</span>
                    <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", flexShrink: 0 }}>{ph.date}</span>
                  </div>
                ))}
              </Card>

              <Card color={PURPLE}>
                <Label color={PURPLE}>🗓️ PROCHAINE ACTION</Label>
                <Txt style={{ color: GOLD }}>{proj.prochaine}</Txt>
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={SAGE}>
                <Label color={SAGE}>KPIs CLIENT</Label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                  {proj.kpis.map((k, i) => (
                    <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px" }}>
                      <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "2px" }}>{k.label.toUpperCase()}</p>
                      <p style={{ fontSize: "12px", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{k.valeur}</p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card color={ORANGE}>
                <Label color={ORANGE}>📝 NOTES INTERNES</Label>
                <Txt muted style={{ marginBottom: "10px" }}>{proj.notes}</Txt>
                <div style={{ display: "flex", gap: "6px" }}>
                  <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Ajouter une note..."
                    style={{ flex: 1, padding: "7px 10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", color: "#fff", fontSize: "12px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                  <button onClick={() => { if (newNote.trim()) { setProjects(ps => ps.map(p => p.id === proj.id ? { ...p, notes: p.notes + "\n→ " + newNote } : p)); setNewNote(""); } }}
                    style={{ padding: "7px 12px", background: ORANGE, border: "none", borderRadius: "6px", color: "#070e1c", fontSize: "11px", fontWeight: "700", cursor: "pointer" }}>+</button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// TOOL 4 — VEILLE CONCURRENTIELLE
// ═══════════════════════════════════════════

function VeilleTool({ isPremium }) {
  const [form, setForm] = useState({ secteur: "", marche: "", positionnement: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const color = CORAL;

  const generate = async () => {
    setLoading(true); setResult(null);
    let text = "";
    const prompt = `Secteur: ${form.secteur} | Marché: ${form.marche} | Mon positionnement: ${form.positionnement}`;
    try {
      await callClaude("veille", prompt, chunk => { text += chunk; });
      setResult(JSON.parse(text.replace(/```json|```/g, "").trim()));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const maturiteColor = { "Émergent": TEAL, "En croissance": SAGE, "Mature": GOLD, "En déclin": CORAL };
  const typeColor = { "Direct": CORAL, "Indirect": GOLD, "Substitut": PURPLE };

  return (
    <div>
      <div style={{ marginBottom: "24px" }}>
        <Label color={color}>⭐ OUTIL PREMIUM — VEILLE CONCURRENTIELLE</Label>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>Analyse Concurrentielle</h2>
        <Txt muted>Cartographiez votre marché, identifiez les concurrents et les opportunités non adressées.</Txt>
      </div>

      {!isPremium ? (
        <div style={{ padding: "32px", background: `${color}08`, border: `1px solid ${color}25`, borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#fff", marginBottom: "8px" }}>Outil Premium</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px" }}>29€/mois — Accès illimité</p>
          <button style={{ padding: "12px 28px", background: color, border: "none", borderRadius: "10px", color: "#fff", fontSize: "14px", fontWeight: "700", cursor: "pointer" }}>Passer Premium →</button>
        </div>
      ) : !result ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <FormField label="VOTRE SECTEUR" value={form.secteur} onChange={v => set("secteur", v)} type="select" required color={color}
              options={["Commerce & Retail", "Restaurant & Traiteur", "BTP & Immobilier", "Santé & Bien-être", "Services aux entreprises", "Éducation & Formation", "Tourisme", "Agriculture", "Finance & Assurance", "Mode & Beauté", "Tech & Digital", "Consulting Digital"]} />
            <FormField label="MARCHÉ CIBLE" value={form.marche} onChange={v => set("marche", v)} type="select" required color={color}
              options={["Congo Brazzaville", "Cameroun", "Côte d'Ivoire", "Afrique francophone", "France", "France + Afrique"]} />
          </div>
          <FormField label="VOTRE POSITIONNEMENT" value={form.positionnement} onChange={v => set("positionnement", v)} type="textarea" required
            placeholder="Décrivez votre offre et ce qui vous différencie de la concurrence..." />

          {loading && <div style={{ textAlign: "center", padding: "16px" }}><div style={{ width: "32px", height: "32px", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} /><p style={{ color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>ANALYSE DU MARCHÉ...</p></div>}

          <button onClick={generate} disabled={!form.secteur || !form.marche || !form.positionnement || loading}
            style={{ padding: "13px", background: form.secteur && form.marche && form.positionnement && !loading ? color : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: form.secteur && form.marche && form.positionnement && !loading ? "#fff" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            🔍 Analyser la concurrence →
          </button>
        </div>
      ) : (
        <div style={{ animation: "fadeIn 0.5s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#fff" }}>{result.secteur} · {result.marche}</h3>
              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <Tag color={GOLD}>Marché : {result.tailleMarcheEstimee}</Tag>
                <Tag color={SAGE}>Croissance : {result.croissanceAnnuelle}</Tag>
                <Tag color={maturiteColor[result.maturiteMarche] || TEAL}>{result.maturiteMarche}</Tag>
              </div>
            </div>
            <button onClick={() => setResult(null)} style={{ padding: "7px 14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", fontSize: "11px", cursor: "pointer" }}>↺ Nouveau</button>
          </div>

          <Card color={color} style={{ marginBottom: "12px" }}>
            <Label color={color}>SYNTHÈSE EXECUTIVE</Label>
            <Txt>{result.synthese}</Txt>
          </Card>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={color}>
                <Label color={color}>CARTOGRAPHIE CONCURRENTS</Label>
                {result.acteurs?.map((a, i) => (
                  <div key={i} style={{ padding: "10px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", marginBottom: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        <span style={{ fontFamily: "'Fraunces', serif", fontSize: "14px", color: "#fff" }}>{a.nom}</span>
                        <Tag color={typeColor[a.type] || TEAL}>{a.type}</Tag>
                        <Tag color="rgba(255,255,255,0.2)">{a.taille}</Tag>
                      </div>
                      <span style={{ fontSize: "11px", color: GOLD, fontFamily: "monospace" }}>{a.partMarcheEstimee}</span>
                    </div>
                    <Txt muted style={{ fontSize: "11px", marginBottom: "6px" }}>{a.positionnement}</Txt>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
                      <div>
                        <p style={{ fontSize: "9px", color: SAGE, fontFamily: "monospace", marginBottom: "2px" }}>FORCES</p>
                        {a.forces?.map((f, j) => <p key={j} style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>+ {f}</p>)}
                      </div>
                      <div>
                        <p style={{ fontSize: "9px", color: CORAL, fontFamily: "monospace", marginBottom: "2px" }}>FAIBLESSES</p>
                        {a.faiblesses?.map((f, j) => <p key={j} style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>- {f}</p>)}
                      </div>
                    </div>
                    <p style={{ fontSize: "11px", color: GOLD, fontFamily: "monospace", marginTop: "4px" }}>Prix : {a.prixMoyen}</p>
                  </div>
                ))}
              </Card>

              <Card color={PURPLE}>
                <Label color={PURPLE}>SEGMENTS NON COUVERTS 🎯</Label>
                {result.segmentsNonCouverts?.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", padding: "8px", background: `${PURPLE}08`, borderRadius: "6px" }}>
                    <span style={{ color: PURPLE }}>💡</span><Txt>{s}</Txt>
                  </div>
                ))}
              </Card>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <Card color={GOLD}>
                <Label color={GOLD}>TENDANCES DU MARCHÉ</Label>
                {result.tendances?.map((t, i) => (
                  <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "6px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "3px" }}>
                      <Txt style={{ fontWeight: "600", fontSize: "12px" }}>{t.tendance}</Txt>
                      <Tag color={t.impact === "Fort" ? CORAL : t.impact === "Moyen" ? GOLD : SAGE}>{t.impact}</Tag>
                    </div>
                    <Txt muted style={{ fontSize: "11px" }}>→ {t.opportunite}</Txt>
                  </div>
                ))}
              </Card>

              <Card color={SAGE}>
                <Label color={SAGE}>RECOMMANDATIONS STRATÉGIQUES</Label>
                {result.recommandations?.map((r, i) => (
                  <div key={i} style={{ padding: "8px", background: "rgba(255,255,255,0.03)", borderRadius: "6px", marginBottom: "6px" }}>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                      <PriorityBadge value={r.priorite} />
                      <div>
                        <Txt style={{ fontSize: "12px", fontWeight: "600" }}>{r.action}</Txt>
                        <Txt muted style={{ fontSize: "11px" }}>{r.impact}</Txt>
                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              <Card color={TEAL}>
                <Label color={TEAL}>VOS AVANTAGES À DÉVELOPPER</Label>
                {result.avantagesConcurrentielsRecommandes?.map((a, i) => (
                  <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "5px" }}>
                    <span style={{ color: TEAL }}>★</span><Txt>{a}</Txt>
                  </div>
                ))}
              </Card>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [active, setActive] = useState("budget");
  const [isPremium, setIsPremium] = useState(false);
  const tool = TOOLS.find(t => t.id === active);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 10% 10%, #0d1f35 0%, #070e1c 100%)", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, select { outline: none !important; }
        ::placeholder { color: rgba(255,255,255,0.18) !important; }
        select option { background: #0d1f35; color: white; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .nav-btn:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: "210px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", display: "flex", flexDirection: "column" }}>
        <div style={{ marginBottom: "20px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "17px", fontWeight: 200, color: "#fff" }}>Nexalie</p>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "8px", letterSpacing: "2px", color: GOLD }}>OUTILS AVANCÉS · v3.0</p>
        </div>

        {TOOLS.map(t => (
          <button key={t.id} className="nav-btn" onClick={() => setActive(t.id)}
            style={{ width: "100%", padding: "10px 10px", borderRadius: "8px", border: `1px solid ${active === t.id ? t.color + "40" : "transparent"}`, background: active === t.id ? `${t.color}08` : "transparent", cursor: "pointer", textAlign: "left", display: "flex", gap: "8px", alignItems: "center", marginBottom: "3px", transition: "all 0.15s" }}>
            <span style={{ fontSize: "16px" }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", color: active === t.id ? "#fff" : "rgba(255,255,255,0.45)", fontFamily: "'DM Sans', sans-serif" }}>{t.label}</p>
              <p style={{ fontSize: "9px", color: active === t.id ? t.color : "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace" }}>{t.sub}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "7px", padding: "1px 5px", borderRadius: "3px", background: t.free ? "rgba(74,124,89,0.2)" : "rgba(201,168,76,0.15)", color: t.free ? SAGE : GOLD, fontFamily: "monospace" }}>{t.free ? "FREE" : "PRO"}</span>
              {t.internal && <span style={{ fontSize: "7px", padding: "1px 5px", borderRadius: "3px", background: "rgba(255,100,74,0.15)", color: "#FF6B4A", fontFamily: "monospace" }}>INT.</span>}
            </div>
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {!isPremium ? (
            <button onClick={() => setIsPremium(true)} style={{ width: "100%", padding: "10px", background: GOLD, border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
              PREMIUM — 29€/mois
            </button>
          ) : (
            <div style={{ padding: "8px 10px", background: "rgba(74,124,89,0.1)", border: "1px solid rgba(74,124,89,0.25)", borderRadius: "8px" }}>
              <p style={{ fontSize: "10px", color: SAGE, fontFamily: "'IBM Plex Mono', monospace" }}>✓ PREMIUM ACTIF</p>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'DM Sans', sans-serif" }}>Tous les outils débloqués</p>
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px 28px" }}>
        {active === "budget" && <BudgetTool isPremium={isPremium} />}
        {active === "cdc" && <CDCTool isPremium={isPremium} />}
        {active === "suivi" && <SuiviTool />}
        {active === "veille" && <VeilleTool isPremium={isPremium} />}
      </div>
    </div>
  );
}
