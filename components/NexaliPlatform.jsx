'use client';

import { useState } from "react";
import { useMode } from "@/lib/mode-context";

// ─── Nettoyage markdown brut dans les réponses IA ───────────
function stripMarkdown(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/gs, '$1')
    .replace(/\*(.*?)\*/gs, '$1')
    .replace(/`{1,3}(.*?)`{1,3}/gs, '$1')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '')
    .replace(/^>\s+/gm, '')
    .replace(/---+/g, '')
    .replace(/___+/g, '')
    .trim();
}

// ═══════════════════════════════════════════
// CONFIG & DATA
// ═══════════════════════════════════════════

const TABS = [
  { id: "dashboard", icon: "◈", label: "Dashboard", sub: "Vue d'ensemble" },
  { id: "audit", icon: "◉", label: "Audit Digital", sub: "Maturité digitale", free: true },
  { id: "bizplan", icon: "◐", label: "Business Plan", sub: "Générateur IA", free: false },
  { id: "roadmap", icon: "◎", label: "Roadmap", sub: "Plan 12 mois", free: false },
  { id: "process", icon: "◑", label: "Cartographie", sub: "Processus", free: false },
  { id: "roi", icon: "⬡", label: "ROI Digital", sub: "Calculateur", free: true },
  { id: "cdc", icon: "✦", label: "Cahier des Charges", sub: "Générateur", free: false },
  { id: "veille", icon: "◬", label: "Veille Concurrentielle", sub: "Analyse marché", free: false },
];

const METRICS = [
  { label: "Visiteurs ce mois", value: "1 247", delta: "+18%", color: "#4EC9B0", icon: "◈" },
  { label: "Audits lancés", value: "89", delta: "+34%", color: "#C9A84C", icon: "◉" },
  { label: "Taux conversion", value: "12.4%", delta: "+2.1pts", color: "#C586C0", icon: "◐" },
  { label: "Abonnés premium", value: "11", delta: "+3 ce mois", color: "#7B5EA7", icon: "◎" },
  { label: "Revenus passifs", value: "319€", delta: "ce mois", color: "#4A7C59", icon: "◑" },
  { label: "Outils utilisés", value: "234", delta: "sessions", color: "#CE9178", icon: "⬡" },
];

const FUNNEL = [
  { label: "Visiteurs", value: 1247, pct: 100, color: "#4EC9B0" },
  { label: "Outil gratuit", value: 312, pct: 25, color: "#C9A84C" },
  { label: "Résultat vu", value: 201, pct: 16, color: "#C586C0" },
  { label: "Inscription", value: 67, pct: 5.4, color: "#7B5EA7" },
  { label: "Premium", value: 11, pct: 0.9, color: "#CE9178" },
];

const SYSTEM = {
  bizplan: `Génère un business plan concret pour cette entreprise. Utilise le nom de l'entreprise fourni dans chaque section — ne dis jamais "l'entreprise" ou "votre entreprise" à la place. Cite des outils réels avec leurs vrais tarifs (€ pour la France, FCFA pour l'Afrique). Sois direct et chiffré : pas de généralités, pas de remplissage, pas de "il est important de noter", "il convient de", "n'hésitez pas à". Chaque objectif doit avoir un nombre et une date. Chaque recommandation doit citer un outil précis.

Format JSON strict (sans backticks) : {"executiveSummary":"résumé 3 phrases avec chiffres","vision":"vision concrète en 1 phrase","mission":"mission en 1 phrase","produits":["produit/service 1 avec prix","produit/service 2","produit/service 3"],"marche":{"taille":"chiffre marché adressable","cible":"profil client précis","concurrence":"2 concurrents nommés avec leur faiblesse"},"modeleEconomique":{"revenus":["source 1 avec montant estimé","source 2","source 3"],"couts":["coût 1 avec montant","coût 2"]},"objectifs":[{"periode":"6 mois","objectif":"objectif avec KPI chiffré"},{"periode":"1 an","objectif":"objectif avec KPI chiffré"},{"periode":"3 ans","objectif":"objectif ambitieux chiffré"}],"facteursCles":["facteur différenciateur 1","facteur 2","facteur 3"]}

JSON uniquement.`,

  roadmap: `Génère une roadmap digitale 12 mois réaliste pour cette entreprise. Chaque action doit être faisable par une PME — cite des outils réels avec leur coût (€ ou FCFA). Évite le jargon sans explication. Priorise les actions à impact rapide dans les 3 premiers mois. Pas de "il convient de", "dans le cadre de", "il est important de noter".

Format JSON strict (sans backticks) : {"titre":"Roadmap [Nom entreprise] 2026","phases":[{"numero":1,"periode":"Mois 1-3","theme":"Fondations rapides","priorite":"haute","actions":["action concrète avec outil et coût","action 2","action 3"],"kpis":["KPI chiffré 1","KPI chiffré 2"],"budget":"X — Y €/FCFA"},{"numero":2,"periode":"Mois 4-6","theme":"Lancement","priorite":"haute","actions":["action 1","action 2","action 3"],"kpis":["KPI 1","KPI 2"],"budget":"fourchette"},{"numero":3,"periode":"Mois 7-9","theme":"Croissance","priorite":"moyenne","actions":["action 1","action 2","action 3"],"kpis":["KPI 1","KPI 2"],"budget":"fourchette"},{"numero":4,"periode":"Mois 10-12","theme":"Optimisation","priorite":"moyenne","actions":["action 1","action 2","action 3"],"kpis":["KPI 1","KPI 2"],"budget":"fourchette"}],"investissementTotal":"X — Y €/FCFA sur 12 mois","roiEstime":"ROI estimé à 12 mois avec base de calcul"}

JSON uniquement.`,

  process: `Cartographie les processus clés de cette entreprise tels qu'ils fonctionnent vraiment — pas une version idéalisée. Pour chaque processus, identifie le vrai problème (pas un problème générique) et propose une solution avec un outil réel et son coût. Pas de "il convient de", "dans le cadre de", "il est important de noter", "certes".

Format JSON strict (sans backticks) : {"processus":[{"nom":"Nom du processus","categorie":"Commercial|Opérations|RH|Finance|Communication","description":"ce qui se passe vraiment en 1 phrase","etapes":["étape 1 concrète","étape 2","étape 3"],"outils":["outil utilisé actuellement"],"problemes":["problème réel observé"],"solution":"outil précis avec coût — ex: HubSpot CRM gratuit jusqu'à 1000 contacts","prioriteDigitalisation":"haute|moyenne|faible"}],"synthese":"2 phrases directes sur les 2 chantiers prioritaires","gainsPotentiels":["gain chiffré 1","gain chiffré 2","gain chiffré 3"]}

4-5 processus clés. JSON uniquement.`,

  roi: `Calcule le ROI digital de cette entreprise avec des chiffres réels, pas des estimations optimistes déconnectées. Base-toi sur les données fournies. Si une donnée manque, utilise une hypothèse prudente et note-la. Exprime les gains en € ou en FCFA selon le marché. Pas de "il est important de noter", "bien entendu", "force est de constater".

Format JSON strict (sans backticks) : {"scoreActuel":{"valeur":number,"interpretation":"ce que ce score signifie concrètement"},"potentielGains":{"tempsGagneHeures":number,"coutHeureEstime":number,"gainProductivite":number,"newRevenusEstimes":number,"totalGainAnnuel":number},"investissementNecessaire":{"outils":number,"formation":number,"accompagnement":number,"total":number},"roi":{"valeur":number,"delaiRetour":"X mois","interpretation":"phrase directe avec les hypothèses clés"},"priorites":["action 1 avec outil et coût","action 2","action 3"],"conclusion":"2 phrases directes — qu'est-ce qui rapporte le plus vite ?"}

JSON uniquement.`,

  cdc: `Rédige un cahier des charges opérationnel pour ce projet digital — pas un document théorique. Chaque fonctionnalité doit être formulée du point de vue utilisateur ("l'utilisateur peut..."). Le budget doit être réaliste, pas une fourchette absurdement large. Cite des technologies ou outils concrets pour les contraintes techniques. Pas de "il convient de", "dans le cadre de", "n'hésitez pas à".

Format JSON strict (sans backticks) : {"titre":"CDC — [Nom projet]","contexte":"situation actuelle en 2 phrases directes","objectifs":["objectif mesurable 1","objectif mesurable 2","objectif mesurable 3"],"perimetre":{"inclus":["fonctionnalité incluse 1","fonctionnalité incluse 2","fonctionnalité incluse 3"],"exclus":["hors périmètre 1 avec raison courte","hors périmètre 2"]},"fonctionnalites":[{"nom":"Fonctionnalité","priorite":"Must Have|Should Have|Nice to Have","description":"l'utilisateur peut... en 1 phrase"}],"contraintes":{"techniques":["contrainte concrète 1","contrainte 2"],"budget":"X — Y € ou FCFA réalistes","delai":"durée avec jalons clés"},"livrables":["livrable 1 avec format","livrable 2","livrable 3"],"criteresAcceptation":["critère testable 1","critère testable 2","critère testable 3"]}

JSON uniquement.`,

  veille: `Analyse le marché de cette entreprise avec des données réelles ou des estimations raisonnées (précise dans ce cas). Nomme de vrais concurrents avec leurs vrais prix et positionnements. Pas de "il est important de noter", "certes", "en termes de", "force est de constater", "il va sans dire".

Format JSON strict (sans backticks) : {"synthese":"état du marché en 2 phrases directes avec chiffres","tendances":["tendance concrète 1 avec impact","tendance 2","tendance 3"],"concurrents":[{"nom":"Concurrent réel","positionnement":"leur promesse en 1 phrase","forces":["force vérifiable 1","force 2"],"faiblesses":["faiblesse exploitable 1","faiblesse 2"],"part_de_marche":"estimation avec base"}],"opportunites":["opportunité concrète 1","opportunité 2","opportunité 3"],"menaces":["menace réelle 1","menace 2"],"recommandations":["action différenciante 1 avec outil","action 2","action 3"],"scoreIntensiteConcurrentielle":{"valeur":number,"interpretation":"ce que ce score implique pour la stratégie"}}

3 concurrents réels. JSON uniquement.`
};

async function callClaude(system, prompt, onChunk) {
  const res = await fetch("/api/claude", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: prompt }],
      stream: true,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text().catch(() => '');
    console.error('[callClaude]', res.status, errBody);
    throw new Error('SERVICE_UNAVAILABLE');
  }

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

// Extrait un objet JSON depuis un texte potentiellement entouré de prose ou de code markdown
function extractJson(text) {
  // Enlever les balises markdown ```json ... ```
  const stripped = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  // Trouver le premier { et le dernier } pour isoler le JSON
  const start = stripped.indexOf("{");
  const end = stripped.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    return JSON.parse(stripped.slice(start, end + 1));
  } catch {
    return null;
  }
}

// ═══════════════════════════════════════════
// TOOL WRAPPER
// ═══════════════════════════════════════════

function ToolWrapper({ title, sub, color, isPremium, isUnlocked, fields, systemKey, renderResult, promptBuilder }) {
  const [values, setValues] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [rawText, setRawText] = useState('');
  const [error, setError] = useState('');

  const set = (k, v) => setValues(p => ({ ...p, [k]: v }));

  const generate = async () => {
    if (isPremium && !isUnlocked) return;
    setLoading(true);
    setResult(null);
    setRawText('');
    setError('');
    let text = "";
    try {
      await callClaude(SYSTEM[systemKey], promptBuilder(values), chunk => { text += chunk; });
      console.log('Réponse IA:', text); // debug temporaire
      const parsed = extractJson(text);
      if (parsed) {
        setResult(parsed);
      } else {
        // Fallback : afficher le texte brut si pas de JSON valide
        setRawText(text || "Réponse vide reçue.");
      }
    } catch (e) {
      console.error('Erreur génération outil:', e);
      setError("⚠️ Service temporairement indisponible. Réessayez dans quelques minutes.");
    }
    setLoading(false);
  };

  const canGenerate = fields.every(f => !f.required || values[f.key]);

  return (
    <div style={{ maxWidth: "760px" }}>
      <div style={{ marginBottom: "28px" }}>
        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color, marginBottom: "6px" }}>
          {isPremium ? "⭐ OUTIL PREMIUM" : "✅ OUTIL GRATUIT"}
        </p>
        <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 300, color: "#fff", marginBottom: "4px" }}>{title}</h2>
        <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>
      </div>

      {isPremium && !isUnlocked ? (
        <div style={{ padding: "32px", background: `${color}08`, border: `1px solid ${color}25`, borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontSize: "32px", marginBottom: "12px" }}>🔒</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#fff", marginBottom: "8px" }}>Outil Premium</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", marginBottom: "20px", fontFamily: "'DM Sans', sans-serif" }}>
            Accédez à tous les outils illimités pour 129€/mois
          </p>
          <button style={{ padding: "12px 28px", background: color, border: "none", borderRadius: "10px", color: "#070e1c", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
            Passer Premium →
          </button>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)", marginTop: "12px", fontFamily: "'DM Sans', sans-serif" }}>
            ou contacter Relia — relia.ebiya@gmail.com
          </p>
        </div>
      ) : (
        <div>
          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
            {fields.map(f => (
              <div key={f.key}>
                <label style={{ display: "block", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.4)", marginBottom: "6px" }}>
                  {f.label}{f.required ? " *" : ""}
                </label>
                {f.type === "select" ? (
                  <select value={values[f.key] || ""} onChange={e => set(f.key, e.target.value)}
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${values[f.key] ? color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: values[f.key] ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", cursor: "pointer" }}>
                    <option value="">Sélectionner...</option>
                    {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                ) : f.type === "textarea" ? (
                  <textarea value={values[f.key] || ""} onChange={e => set(f.key, e.target.value)} rows={3} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${values[f.key] ? color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: "#fff", fontSize: "13px", resize: "vertical", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, outline: "none" }} />
                ) : (
                  <input value={values[f.key] || ""} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder}
                    style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: `1px solid ${values[f.key] ? color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "10px", color: "#fff", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", outline: "none" }} />
                )}
              </div>
            ))}
          </div>

          <button onClick={generate} disabled={!canGenerate || loading}
            style={{ padding: "12px 28px", background: canGenerate && !loading ? color : "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", color: canGenerate && !loading ? "#070e1c" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "700", cursor: canGenerate && !loading ? "pointer" : "default", fontFamily: "'DM Sans', sans-serif", marginBottom: "20px", transition: "all 0.2s" }}>
            {loading ? "⏳ Génération en cours..." : "✨ Générer →"}
          </button>

          {loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              <div style={{ width: "32px", height: "32px", border: `3px solid ${color}25`, borderTop: `3px solid ${color}`, borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
              <p style={{ color, fontFamily: "'IBM Plex Mono', monospace", fontSize: "11px" }}>L'IA analyse votre projet...</p>
            </div>
          )}

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(255,107,74,0.1)", border: "1px solid rgba(255,107,74,0.3)", borderRadius: "10px", marginBottom: "12px" }}>
              <p style={{ color: "#FF6B4A", fontSize: "13px", fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{error}</p>
            </div>
          )}

          {rawText && !result && (
            <div style={{ padding: "20px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", marginBottom: "12px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "10px", letterSpacing: "1px" }}>RÉPONSE GÉNÉRÉE</p>
              <pre style={{ whiteSpace: "pre-wrap", overflowY: "auto", maxHeight: "400px", color: "rgba(255,255,255,0.75)", fontSize: "13px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", margin: 0 }}>{stripMarkdown(rawText)}</pre>
            </div>
          )}

          {result && renderResult(result, color)}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════
// RESULT RENDERERS
// ═══════════════════════════════════════════

function Section({ title, color, children }) {
  return (
    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color, marginBottom: "8px" }}>{title.toUpperCase()}</p>
      {children}
    </div>
  );
}

function Card({ children, color }) {
  return (
    <div style={{ padding: "16px", background: `${color}08`, border: `1px solid ${color}20`, borderRadius: "12px", marginBottom: "10px" }}>
      {children}
    </div>
  );
}

function Tag({ text, color }) {
  return <span style={{ display: "inline-block", padding: "3px 10px", background: `${color}15`, color, fontSize: "11px", borderRadius: "6px", fontFamily: "'IBM Plex Mono', monospace", marginRight: "6px", marginBottom: "4px" }}>{text}</span>;
}

function Txt({ children, muted }) {
  const clean = stripMarkdown(children);
  return <p style={{ fontSize: "13px", color: muted ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.8)", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.6, marginBottom: "4px" }}>{clean}</p>;
}

const renderBizplan = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <Card color={color}>
      <Section title="Résumé Exécutif" color={color}>
        <Txt>{r.executiveSummary}</Txt>
      </Section>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginTop: "8px" }}>
        <div><p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "3px" }}>VISION</p><Txt>{r.vision}</Txt></div>
        <div><p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "3px" }}>MISSION</p><Txt>{r.mission}</Txt></div>
      </div>
    </Card>
    <Card color={color}>
      <Section title="Produits & Services" color={color}>
        {r.produits?.map((p, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}><span style={{ color }}>→</span><Txt>{p}</Txt></div>)}
      </Section>
    </Card>
    <Card color={color}>
      <Section title="Marché & Cible" color={color}>
        <Txt>{r.marche?.cible}</Txt>
        <Txt muted>{r.marche?.taille}</Txt>
        <Txt muted>{r.marche?.concurrence}</Txt>
      </Section>
    </Card>
    <Card color={color}>
      <Section title="Objectifs" color={color}>
        {r.objectifs?.map((o, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
            <span style={{ background: color, color: "#070e1c", padding: "2px 8px", borderRadius: "4px", fontSize: "10px", fontWeight: "700", flexShrink: 0, fontFamily: "monospace" }}>{o.periode}</span>
            <Txt>{o.objectif}</Txt>
          </div>
        ))}
      </Section>
    </Card>
    <div style={{ padding: "14px 16px", background: `${color}10`, border: `1px solid ${color}25`, borderRadius: "10px" }}>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", fontFamily: "'DM Sans', sans-serif" }}>
        💡 Ce business plan est généré par l'IA Nexalie. Pour un accompagnement complet, contactez <span style={{ color }}>relia.ebiya@gmail.com</span>
      </p>
    </div>
  </div>
);

const renderRoadmap = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", marginBottom: "12px" }}>
      {r.phases?.map((p, i) => (
        <Card key={i} color={color}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
            <div>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: "#fff" }}>{p.theme}</p>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color }}>{p.periode}</p>
            </div>
            <span style={{ background: p.priorite === "haute" ? "#FF6B4A" : "#C9A84C", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontFamily: "monospace", height: "fit-content" }}>{p.priorite}</span>
          </div>
          {p.actions?.map((a, j) => <div key={j} style={{ display: "flex", gap: "6px", marginBottom: "3px" }}><span style={{ color, fontSize: "11px" }}>•</span><Txt muted>{a}</Txt></div>)}
          <div style={{ marginTop: "8px", paddingTop: "8px", borderTop: `1px solid ${color}20` }}>
            <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>KPIs</p>
            {p.kpis?.map((k, j) => <Tag key={j} text={k} color={color} />)}
          </div>
          <p style={{ fontSize: "11px", color, fontFamily: "monospace", marginTop: "6px" }}>Budget : {p.budget}</p>
        </Card>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      <Card color={color}><p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>INVESTISSEMENT TOTAL</p><p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color }}>{r.investissementTotal}</p></Card>
      <Card color={color}><p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>ROI ESTIMÉ</p><p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: "#4A7C59" }}>{r.roiEstime}</p></Card>
    </div>
  </div>
);

const renderProcess = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <Card color={color}><Txt>{r.synthese}</Txt><div style={{ marginTop: "8px" }}>{r.gainsPotentiels?.map((g, i) => <Tag key={i} text={g} color="#4A7C59" />)}</div></Card>
    {r.processus?.map((p, i) => (
      <Card key={i} color={color}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <div><p style={{ fontFamily: "'Fraunces', serif", fontSize: "16px", color: "#fff" }}>{p.nom}</p><Tag text={p.categorie} color={color} /></div>
          <span style={{ background: p.prioriteDigitalisation === "haute" ? "#FF6B4A" : p.prioriteDigitalisation === "moyenne" ? "#C9A84C" : "#4A7C59", color: "#fff", padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontFamily: "monospace", height: "fit-content" }}>Priorité {p.prioriteDigitalisation}</span>
        </div>
        <Txt muted>{p.description}</Txt>
        <div style={{ marginTop: "8px", padding: "10px", background: "rgba(255,100,74,0.08)", borderRadius: "8px", border: "1px solid rgba(255,100,74,0.15)" }}>
          <p style={{ fontSize: "10px", color: "#FF6B4A", fontFamily: "monospace", marginBottom: "4px" }}>PROBLÈMES IDENTIFIÉS</p>
          {p.problemes?.map((pr, j) => <Txt key={j} muted>{pr}</Txt>)}
        </div>
        <div style={{ marginTop: "8px", padding: "10px", background: `${color}08`, borderRadius: "8px", border: `1px solid ${color}20` }}>
          <p style={{ fontSize: "10px", color, fontFamily: "monospace", marginBottom: "4px" }}>SOLUTION RECOMMANDÉE</p>
          <Txt>{p.solution}</Txt>
        </div>
      </Card>
    ))}
  </div>
);

const renderRoi = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px", marginBottom: "12px" }}>
      {[
        ["Score actuel", `${r.scoreActuel?.valeur}/100`, r.scoreActuel?.interpretation, "#CE9178"],
        ["Gain annuel estimé", `${r.potentielGains?.totalGainAnnuel?.toLocaleString()}€`, "productivité + nouveaux revenus", "#4A7C59"],
        ["ROI", `${r.roi?.valeur}%`, `Retour en ${r.roi?.delaiRetour}`, color],
      ].map(([l, v, s, c]) => (
        <Card key={l} color={c}>
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace", marginBottom: "4px" }}>{l.toUpperCase()}</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "24px", color: c, marginBottom: "2px" }}>{v}</p>
          <Txt muted>{s}</Txt>
        </Card>
      ))}
    </div>
    <Card color={color}>
      <Section title="Investissement nécessaire" color={color}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
          {[["Outils", r.investissementNecessaire?.outils], ["Formation", r.investissementNecessaire?.formation], ["Accompagnement", r.investissementNecessaire?.accompagnement]].map(([l, v]) => (
            <div key={l} style={{ textAlign: "center" }}>
              <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{l}</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color }}>{v}€</p>
            </div>
          ))}
        </div>
        <div style={{ textAlign: "center", marginTop: "8px", padding: "8px", background: `${color}10`, borderRadius: "8px" }}>
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>TOTAL</p>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color }}>{r.investissementNecessaire?.total}€</p>
        </div>
      </Section>
    </Card>
    <Card color={color}>
      <Section title="Priorités d'action" color={color}>
        {r.priorites?.map((p, i) => <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}><span style={{ color, fontWeight: "700", fontSize: "13px" }}>{i + 1}.</span><Txt>{p}</Txt></div>)}
      </Section>
      <Txt muted>{r.roi?.interpretation}</Txt>
    </Card>
  </div>
);

const renderCdc = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <Card color={color}>
      <Section title="Contexte & Objectifs" color={color}>
        <Txt>{r.contexte}</Txt>
        <div style={{ marginTop: "8px" }}>{r.objectifs?.map((o, i) => <div key={i} style={{ display: "flex", gap: "6px", marginBottom: "3px" }}><span style={{ color }}>✓</span><Txt>{o}</Txt></div>)}</div>
      </Section>
    </Card>
    <Card color={color}>
      <Section title="Fonctionnalités" color={color}>
        {r.fonctionnalites?.map((f, i) => (
          <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "8px", alignItems: "flex-start" }}>
            <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontFamily: "monospace", flexShrink: 0, background: f.priorite === "Must Have" ? "#FF6B4A" : f.priorite === "Should Have" ? "#C9A84C" : "#4A7C59", color: "#fff" }}>{f.priorite}</span>
            <Txt>{f.nom} — {f.description}</Txt>
          </div>
        ))}
      </Section>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
      <Card color={color}>
        <Section title="Périmètre inclus" color={color}>
          {r.perimetre?.inclus?.map((p, i) => <div key={i} style={{ display: "flex", gap: "6px" }}><span style={{ color: "#4A7C59" }}>✓</span><Txt muted>{p}</Txt></div>)}
        </Section>
      </Card>
      <Card color={color}>
        <Section title="Contraintes" color={color}>
          <Txt>Budget : {r.contraintes?.budget}</Txt>
          <Txt>Délai : {r.contraintes?.delai}</Txt>
          {r.contraintes?.techniques?.map((t, i) => <Txt key={i} muted>{t}</Txt>)}
        </Section>
      </Card>
    </div>
  </div>
);

// ═══════════════════════════════════════════
// RENDERERS VEILLE
// ═══════════════════════════════════════════

const renderVeille = (r, color) => (
  <div style={{ animation: "fadeIn 0.5s ease" }}>
    <Card color={color}>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace", marginBottom: "6px" }}>SYNTHÈSE MARCHÉ</p>
      <Txt>{r.synthese}</Txt>
      <div style={{ marginTop: "10px" }}>
        {r.tendances?.map((t, i) => <Tag key={i} text={t} color={color} />)}
      </div>
    </Card>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "10px" }}>
      {r.concurrents?.map((c, i) => (
        <Card key={i} color={color}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "14px", color: "#fff", marginBottom: "6px" }}>{c.nom}</p>
          <Txt muted>{c.positionnement}</Txt>
          <div style={{ marginTop: "8px" }}>
            <p style={{ fontSize: "10px", color: "#4A7C59", fontFamily: "monospace", marginBottom: "3px" }}>Forces</p>
            {c.forces?.map((f, j) => <Txt key={j} muted>✓ {f}</Txt>)}
          </div>
          <div style={{ marginTop: "6px" }}>
            <p style={{ fontSize: "10px", color: "#FF6B4A", fontFamily: "monospace", marginBottom: "3px" }}>Faiblesses</p>
            {c.faiblesses?.map((f, j) => <Txt key={j} muted>✗ {f}</Txt>)}
          </div>
        </Card>
      ))}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "10px" }}>
      <Card color={color}>
        <Section title="Opportunités" color="#4A7C59">
          {r.opportunites?.map((o, i) => <div key={i} style={{ display: "flex", gap: "6px" }}><span style={{ color: "#4A7C59" }}>→</span><Txt muted>{o}</Txt></div>)}
        </Section>
      </Card>
      <Card color={color}>
        <Section title="Menaces" color="#FF6B4A">
          {r.menaces?.map((m, i) => <div key={i} style={{ display: "flex", gap: "6px" }}><span style={{ color: "#FF6B4A" }}>!</span><Txt muted>{m}</Txt></div>)}
        </Section>
      </Card>
    </div>
    <Card color={color}>
      <Section title="Recommandations" color={color}>
        {r.recommandations?.map((rec, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            <span style={{ color, fontFamily: "monospace", fontSize: "11px" }}>{String(i + 1).padStart(2, '0')}</span>
            <Txt muted>{rec}</Txt>
          </div>
        ))}
      </Section>
    </Card>
    {r.scoreIntensiteConcurrentielle && (
      <Card color={color}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>INTENSITÉ CONCURRENTIELLE</p>
        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", color }}>{r.scoreIntensiteConcurrentielle.valeur}/10</p>
        <Txt muted>{r.scoreIntensiteConcurrentielle.interpretation}</Txt>
      </Card>
    )}
  </div>
);

// ═══════════════════════════════════════════
// TOOLS CONFIG
// ═══════════════════════════════════════════

const TOOLS = {
  bizplan: {
    title: "Générateur de Business Plan",
    sub: "Créez un business plan structuré en 2 minutes avec l'IA",
    color: "#C586C0",
    isPremium: true,
    systemKey: "bizplan",
    fields: [
      { key: "nom", label: "Nom de l'entreprise", type: "text", placeholder: "Ex: Mama Africa Restaurant", required: true },
      { key: "secteur", label: "Secteur d'activité", type: "select", required: true, options: ["Commerce", "Restauration", "BTP", "Santé", "Services", "Tech", "Formation", "Agriculture", "Finance", "Mode", "Artisanat", "ONG"] },
      { key: "marche", label: "Marché cible", type: "select", required: true, options: ["Congo Brazzaville", "Cameroun", "Côte d'Ivoire", "Sénégal", "Afrique francophone", "France", "France + Afrique"] },
      { key: "description", label: "Décrivez votre projet", type: "textarea", placeholder: "Votre activité, votre vision, vos clients...", required: true },
      { key: "budget", label: "Budget de démarrage estimé", type: "select", required: false, options: ["Moins de 5 000€", "5 000 — 20 000€", "20 000 — 50 000€", "Plus de 50 000€"] },
    ],
    promptBuilder: (v) => `Entreprise: ${v.nom} | Secteur: ${v.secteur} | Marché: ${v.marche} | Description: ${v.description} | Budget: ${v.budget || "non précisé"}`,
    renderResult: renderBizplan,
  },
  roadmap: {
    title: "Générateur de Roadmap Digitale",
    sub: "Votre plan d'action digital sur 12 mois",
    color: "#4EC9B0",
    isPremium: true,
    systemKey: "roadmap",
    fields: [
      { key: "nom", label: "Nom de l'entreprise", type: "text", placeholder: "Ex: Cabinet Espoir", required: true },
      { key: "secteur", label: "Secteur", type: "select", required: true, options: ["Commerce", "Restauration", "BTP", "Santé", "Services", "Tech", "Formation", "Agriculture", "Finance", "Mode"] },
      { key: "niveau", label: "Niveau digital actuel", type: "select", required: true, options: ["Débutant — peu ou pas de digital", "Intermédiaire — quelques outils", "Avancé — bien équipé", "Expert — tout est digitalisé"] },
      { key: "objectif", label: "Objectif principal", type: "select", required: true, options: ["Attirer plus de clients", "Gagner du temps", "Vendre en ligne", "Former mon équipe", "Automatiser mes processus"] },
      { key: "budget", label: "Budget mensuel disponible", type: "select", required: false, options: ["Moins de 200€/mois", "200 — 500€/mois", "500 — 1000€/mois", "Plus de 1000€/mois"] },
    ],
    promptBuilder: (v) => `Entreprise: ${v.nom} | Secteur: ${v.secteur} | Niveau actuel: ${v.niveau} | Objectif: ${v.objectif} | Budget: ${v.budget || "non précisé"}`,
    renderResult: renderRoadmap,
  },
  process: {
    title: "Cartographie des Processus",
    sub: "Identifiez vos processus et les opportunités de digitalisation",
    color: "#CE9178",
    isPremium: true,
    systemKey: "process",
    fields: [
      { key: "nom", label: "Nom de l'entreprise", type: "text", placeholder: "Ex: BTP Congo SARL", required: true },
      { key: "secteur", label: "Secteur", type: "select", required: true, options: ["Commerce", "Restauration", "BTP", "Santé", "Services", "Tech", "Formation", "Agriculture", "Finance"] },
      { key: "effectif", label: "Nombre d'employés", type: "select", required: true, options: ["1-5", "6-20", "21-50", "50+"] },
      { key: "probleme", label: "Principal problème opérationnel", type: "textarea", placeholder: "Ex: On perd beaucoup de temps sur les devis et relances clients, la communication interne est désorganisée...", required: true },
    ],
    promptBuilder: (v) => `Entreprise: ${v.nom} | Secteur: ${v.secteur} | Effectif: ${v.effectif} | Problème: ${v.probleme}`,
    renderResult: renderProcess,
  },
  roi: {
    title: "Calculateur ROI Digital",
    sub: "Calculez le retour sur investissement de votre transformation digitale",
    color: "#4A7C59",
    isPremium: false,
    systemKey: "roi",
    fields: [
      { key: "secteur", label: "Secteur", type: "select", required: true, options: ["Commerce", "Restauration", "BTP", "Santé", "Services", "Tech", "Formation", "Agriculture", "Finance"] },
      { key: "ca", label: "Chiffre d'affaires annuel", type: "select", required: true, options: ["Moins de 50 000€", "50 000 — 200 000€", "200 000 — 500 000€", "Plus de 500 000€"] },
      { key: "effectif", label: "Nombre d'employés", type: "select", required: true, options: ["1-5", "6-20", "21-50", "50+"] },
      { key: "niveau", label: "Niveau digital actuel", type: "select", required: true, options: ["Très faible (0-20/100)", "Faible (20-40/100)", "Moyen (40-60/100)", "Bon (60-80/100)"] },
      { key: "priorite", label: "Priorité d'investissement", type: "select", required: true, options: ["Site web & présence", "Automatisation", "Formation équipe", "IA & données", "Tout à la fois"] },
    ],
    promptBuilder: (v) => `Secteur: ${v.secteur} | CA: ${v.ca} | Effectif: ${v.effectif} | Niveau digital: ${v.niveau} | Priorité: ${v.priorite}`,
    renderResult: renderRoi,
  },
  cdc: {
    title: "Générateur de Cahier des Charges",
    sub: "Créez un cahier des charges professionnel pour votre projet digital",
    color: "#569CD6",
    isPremium: true,
    systemKey: "cdc",
    fields: [
      { key: "projet", label: "Nom du projet", type: "text", placeholder: "Ex: Site e-commerce Mode Élégance", required: true },
      { key: "type", label: "Type de projet", type: "select", required: true, options: ["Site web vitrine", "Site e-commerce", "Application mobile", "Refonte site existant", "Automatisation processus", "Mise en place CRM", "Formation digitale"] },
      { key: "objectif", label: "Objectif principal", type: "textarea", placeholder: "Ex: Créer une boutique en ligne pour vendre nos produits de mode au Congo et en France...", required: true },
      { key: "budget", label: "Budget estimé", type: "select", required: false, options: ["Moins de 1 000€", "1 000 — 3 000€", "3 000 — 10 000€", "Plus de 10 000€"] },
      { key: "delai", label: "Délai souhaité", type: "select", required: false, options: ["Urgent — moins d'1 mois", "1-3 mois", "3-6 mois", "Flexible"] },
    ],
    promptBuilder: (v) => `Projet: ${v.projet} | Type: ${v.type} | Objectif: ${v.objectif} | Budget: ${v.budget || "non précisé"} | Délai: ${v.delai || "flexible"}`,
    renderResult: renderCdc,
  },
  veille: {
    title: "Veille Concurrentielle",
    sub: "Analysez votre marché et vos concurrents en 2 minutes",
    color: "#FF6B4A",
    isPremium: true,
    systemKey: "veille",
    fields: [
      { key: "secteur", label: "Secteur d'activité", type: "select", required: true, options: ["Commerce / Retail", "Restauration", "BTP / Construction", "Santé", "Services aux entreprises", "Tech / SaaS", "Formation", "Agriculture", "Finance / Fintech", "Mode / Beauté", "Logistique", "Énergie"] },
      { key: "marche", label: "Marché géographique", type: "select", required: true, options: ["France", "Côte d'Ivoire", "Congo Brazzaville", "Cameroun", "Sénégal", "Afrique francophone", "France + Afrique"] },
      { key: "produit", label: "Votre produit / service principal", type: "text", placeholder: "Ex: Application de livraison de repas, CRM pour PME...", required: true },
      { key: "positionnement", label: "Votre positionnement actuel", type: "textarea", placeholder: "Comment vous vous différenciez aujourd'hui...", required: true },
    ],
    promptBuilder: (v) => `Secteur: ${v.secteur} | Marché: ${v.marche} | Produit/Service: ${v.produit} | Positionnement: ${v.positionnement}`,
    renderResult: renderVeille,
  },
};

// ═══════════════════════════════════════════
// DASHBOARD
// ═══════════════════════════════════════════

function DashboardView({ accent = '#4EC9B0' }) {
  const cardStyle = { background: "#fff", borderRadius: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.06)", padding: "24px" };
  const labelStyle = { fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#9CA3AF", marginBottom: "16px", textTransform: "uppercase" };
  return (
    <div style={{ background: "#F8F9FA", minHeight: "100%", padding: "32px", margin: "-28px" }}>
      <div style={{ marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "#9CA3AF", marginBottom: "4px" }}>NEXALIE PLATFORM — VUE D&apos;ENSEMBLE</p>
          <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 300, color: "#0A1628" }}>Bonjour, Relia</h1>
        </div>
        <button
          onClick={() => window.print()}
          style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 20px", background: accent, border: "none", borderRadius: "10px", color: "#fff", fontSize: "13px", fontWeight: 700, cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px", flexShrink: 0 }}
        >
          ↓ Exporter le rapport PDF
        </button>
      </div>

      {/* KPIs */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "24px" }}>
        {METRICS.map(m => (
          <div key={m.label} style={{ ...cardStyle, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "#9CA3AF", letterSpacing: "1px", textTransform: "uppercase", lineHeight: 1.4 }}>{m.label}</span>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: m.color }}>{m.icon}</span>
            </div>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", color: "#0A1628", marginBottom: "4px" }}>{m.value}</p>
            <p style={{ fontSize: "11px", color: m.color, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>{m.delta}</p>
          </div>
        ))}
      </div>

      {/* Funnel + Outils */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "24px" }}>
        <div style={cardStyle}>
          <p style={labelStyle}>Tunnel de conversion</p>
          {FUNNEL.map((f) => (
            <div key={f.label} style={{ marginBottom: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                <span style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>{f.label}</span>
                <div style={{ display: "flex", gap: "10px" }}>
                  <span style={{ fontFamily: "'Fraunces', serif", fontSize: "14px", color: "#0A1628" }}>{f.value}</span>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#9CA3AF" }}>{f.pct}%</span>
                </div>
              </div>
              <div style={{ height: "5px", background: "#F3F4F6", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{ width: `${f.pct}%`, height: "100%", background: f.color, borderRadius: "3px", transition: "width 1s ease" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={cardStyle}>
          <p style={labelStyle}>Outils plateforme</p>
          {TABS.filter(t => t.id !== "dashboard").map(t => (
            <div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: t.free ? "#059669" : "#D97706" }}>{t.icon}</span>
                <span style={{ fontSize: "12px", color: "#374151", fontFamily: "'DM Sans', sans-serif" }}>{t.label}</span>
              </div>
              <span style={{ padding: "2px 8px", borderRadius: "4px", fontSize: "9px", fontFamily: "monospace", background: t.free ? "#D1FAE5" : "#FEF3C7", color: t.free ? "#059669" : "#D97706" }}>
                {t.free ? "GRATUIT" : "PREMIUM"}
              </span>
            </div>
          ))}
          <div style={{ marginTop: "14px", padding: "10px 14px", background: "#FFFBEB", borderRadius: "8px", border: "1px solid #FDE68A" }}>
            <p style={{ fontSize: "12px", color: "#92400E", fontFamily: "'DM Sans', sans-serif" }}>
              💰 <strong>129€ × 11 abonnés = 1 419€/mois</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Revenue projection */}
      <div style={{ ...cardStyle, marginBottom: "24px", borderLeft: `4px solid ${accent}` }}>
        <p style={labelStyle}>Projection revenus passifs</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
          {[["Aujourd'hui", "11 abonnés", "319€/mois"], ["Dans 3 mois", "50 abonnés", "1 450€/mois"], ["Dans 6 mois", "100 abonnés", "2 900€/mois"], ["Dans 1 an", "200 abonnés", "5 800€/mois"]].map(([p, a, r]) => (
            <div key={p} style={{ textAlign: "center", padding: "14px", background: "#F9FAFB", borderRadius: "10px", border: "1px solid #F3F4F6" }}>
              <p style={{ fontSize: "9px", color: "#9CA3AF", fontFamily: "monospace", marginBottom: "4px", textTransform: "uppercase" }}>{p}</p>
              <p style={{ fontSize: "11px", color: "#6B7280", fontFamily: "'DM Sans', sans-serif", marginBottom: "6px" }}>{a}</p>
              <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: accent }}>{r}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations */}
      <div style={cardStyle}>
        <p style={labelStyle}>Intégrations disponibles</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
          {[
            { plan: "GRATUIT", color: "#059669", bg: "#F0FDF4", border: "#BBF7D0", items: ["Export PDF du rapport", "Partage par email", "Lien de résultat partageable"] },
            { plan: "PRO", color: "#D97706", bg: "#FFFBEB", border: "#FDE68A", items: ["Export Google Sheets", "Partage WhatsApp direct", "Webhook Zapier basique", "Notifications Slack"] },
            { plan: "INSTITUTIONS", color: "#7B5EA7", bg: "#FAF5FF", border: "#DDD6FE", items: ["API complète documentée", "Make / Zapier avancé", "Export CSV / Excel", "Intégration CRM (HubSpot, Salesforce)", "Webhook personnalisé"] },
          ].map(({ plan, color, bg, border, items }) => (
            <div key={plan} style={{ padding: "18px", background: bg, border: `1px solid ${border}`, borderRadius: "10px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color, letterSpacing: "1px", marginBottom: "14px" }}>{plan}</p>
              {items.map(item => (
                <div key={item} style={{ display: "flex", gap: "6px", alignItems: "flex-start", marginBottom: "7px" }}>
                  <span style={{ color, fontSize: "10px", flexShrink: 0, marginTop: "2px", fontWeight: 700 }}>✓</span>
                  <span style={{ fontSize: "11px", color: "#374151", fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const { mode, setMode, isAfrica } = useMode();
  const accent  = isAfrica ? '#C45E0A' : '#4EC9B0';
  const navyBg  = isAfrica ? '#1A0800' : '#070e1c';

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isUnlocked, setIsUnlocked] = useState(true); // TEST: outils premium accessibles
  const tab = TABS.find(t => t.id === activeTab);
  const tool = TOOLS[activeTab];

  return (
    <div style={{ minHeight: "100vh", background: isAfrica ? "radial-gradient(ellipse at 10% 10%, #2a0e00 0%, #1a0800 100%)" : "radial-gradient(ellipse at 10% 10%, #0d1f35 0%, #070e1c 100%)", fontFamily: "'DM Sans', sans-serif", display: "flex" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea, input, select { outline: none !important; }
        ::placeholder { color: rgba(255,255,255,0.18) !important; }
        select option { background: #0d1f35; color: white; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .nav-btn:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      {/* Sidebar */}
      <div style={{ width: "220px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "3px" }}>
        <div style={{ marginBottom: "16px", paddingBottom: "14px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 200, color: "#fff", marginBottom: "10px" }}>Nexalie</p>
          {/* Toggle FR / AF */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "7px", overflow: "hidden" }}>
            {[['fr', '🇫🇷 France'], ['af', '🌍 Afrique']].map(([m, label]) => (
              <button key={m} onClick={() => setMode(m)}
                style={{ flex: 1, padding: "5px 6px", border: "none", cursor: "pointer", fontSize: "10px", fontWeight: mode === m ? 700 : 400, background: mode === m ? accent : "transparent", color: "#fff", transition: "all 0.2s", fontFamily: "'IBM Plex Mono', monospace" }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "rgba(255,255,255,0.2)", marginBottom: "4px", paddingLeft: "4px" }}>TABLEAU DE BORD</p>
        <button className="nav-btn" onClick={() => setActiveTab("dashboard")}
          style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${activeTab === "dashboard" ? accent + "4D" : "transparent"}`, background: activeTab === "dashboard" ? accent + "14" : "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s" }}>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: activeTab === "dashboard" ? accent : "rgba(255,255,255,0.25)" }}>◈</span>
          <span style={{ fontSize: "13px", color: activeTab === "dashboard" ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>Dashboard</span>
        </button>

        <div style={{ marginTop: "12px", marginBottom: "4px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "1px", color: "rgba(255,255,255,0.2)", paddingLeft: "4px" }}>OUTILS IA</p>
        </div>

        {TABS.filter(t => t.id !== "dashboard").map(t => (
          <button key={t.id} className="nav-btn" onClick={() => setActiveTab(t.id)}
            style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", border: `1px solid ${activeTab === t.id ? (t.free ? "rgba(74,124,89,0.4)" : "rgba(201,168,76,0.3)") : "transparent"}`, background: activeTab === t.id ? (t.free ? "rgba(74,124,89,0.08)" : "rgba(201,168,76,0.06)") : "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: "8px", transition: "all 0.15s" }}>
            <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: activeTab === t.id ? (t.free ? "#4A7C59" : "#C9A84C") : "rgba(255,255,255,0.2)" }}>{t.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "12px", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{t.label}</p>
            </div>
            <span style={{ fontSize: "8px", padding: "1px 5px", borderRadius: "3px", background: t.free ? "rgba(74,124,89,0.2)" : "rgba(201,168,76,0.15)", color: t.free ? "#4A7C59" : "#C9A84C", fontFamily: "monospace" }}>
              {t.free ? "FREE" : "PRO"}
            </span>
          </button>
        ))}

        <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ padding: "10px 12px", background: isUnlocked ? "rgba(74,124,89,0.1)" : "rgba(201,168,76,0.08)", border: `1px solid ${isUnlocked ? "rgba(74,124,89,0.3)" : "rgba(201,168,76,0.2)"}`, borderRadius: "8px", marginBottom: "8px" }}>
            <p style={{ fontSize: "10px", color: isUnlocked ? "#4A7C59" : "#C9A84C", fontFamily: "'IBM Plex Mono', monospace", marginBottom: "2px" }}>{isUnlocked ? "✓ PREMIUM ACTIF" : "PLAN GRATUIT"}</p>
            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'DM Sans', sans-serif" }}>{isUnlocked ? "Tous les outils débloqués" : "2/7 outils disponibles"}</p>
          </div>
          {!isUnlocked && (
            <button onClick={() => setIsUnlocked(true)}
              style={{ width: "100%", padding: "9px", background: "#C9A84C", border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "11px", fontWeight: "700", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.5px" }}>
              PRO — 129€/mois
            </button>
          )}
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: "auto", padding: "28px" }}>
        {activeTab === "dashboard" ? (
          <DashboardView accent={accent} />
        ) : tool ? (
          <ToolWrapper
            key={activeTab}
            {...tool}
            isUnlocked={isUnlocked || tool.isPremium === false}
          />
        ) : null}
      </div>
    </div>
  );
}
