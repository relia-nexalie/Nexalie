import { useState, useEffect } from "react";

// ═══════════════════════════════════════════════════════
// DESIGN TOKENS — identiques à nexali_v4.jsx
// ═══════════════════════════════════════════════════════
const T = {
  pageBg: "#FFFFFF",
  sectionBg: "#F8FAFC",
  navyBg: "#0A1628",
  textPrimary: "#0A1628",
  textSecondary: "#6B7A94",
  textOnNavy: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.5)",
  accent: "#2E9B8B",
  gold: "#C9A84C",       // décoratif uniquement
  border: "rgba(0,0,0,0.07)",
  btnPrimary: "#0A1628",
  btnPrimaryText: "#FFFFFF",
  btnAccent: "#2E9B8B",
  btnAccentText: "#FFFFFF",
};

// Couleurs agents
const AGENT_COLORS = {
  A1: "#2E9B8B", A2: "#1A5FA8", A3: "#6B3FA0",
  A4: "#E07B39", A5: "#C0627A"
};
const AGENT_NAMES = {
  A1: "Analyste", A2: "Stratège", A3: "Exécuteur",
  A4: "Contrôleur", A5: "Rapporteur"
};
const AGENT_ROLES = {
  A1: "Scrape site + réseaux + concurrents",
  A2: "Génère roadmap + business plan",
  A3: "Publie, crée, configure",
  A4: "Surveille KPIs chaque semaine",
  A5: "Rapport PDF mensuel auto"
};

// ═══════════════════════════════════════════════════════
// API CALL
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
// SHARED UI
// ═══════════════════════════════════════════════════════
function Badge({ label, color, filled = false }) {
  return (
    <span style={{
      display: "inline-block", padding: "3px 10px",
      background: filled ? color : `${color}12`,
      color: filled ? "#fff" : color,
      borderRadius: "20px", fontSize: "10px",
      fontWeight: 700, fontFamily: "monospace"
    }}>{label}</span>
  );
}

function StatusDot({ status }) {
  const map = {
    running: ["#2E9B8B", "EN COURS"],
    done: ["#2E7D52", "TERMINÉ"],
    waiting: ["#6B7A94", "EN ATTENTE"],
    error: ["#C0627A", "ERREUR"],
    idle: ["#9B8E6B", "INACTIF"],
  };
  const [color, label] = map[status] || map.idle;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div style={{
        width: "7px", height: "7px", borderRadius: "50%", background: color,
        boxShadow: status === "running" ? `0 0 0 3px ${color}20` : "none"
      }} />
      <span style={{ fontSize: "10px", color, fontFamily: "monospace", fontWeight: 600 }}>{label}</span>
    </div>
  );
}

function Spinner({ color = "#2E9B8B", size = 24 }) {
  return <div style={{
    width: `${size}px`, height: `${size}px`,
    border: `2px solid ${color}20`, borderTop: `2px solid ${color}`,
    borderRadius: "50%", animation: "spin 0.8s linear infinite"
  }} />;
}

function SectionTitle({ eyebrow, title, accent, sub }) {
  return (
    <div style={{ marginBottom: "28px" }}>
      {eyebrow && <p style={{ fontFamily: "monospace", fontSize: "10px",
        letterSpacing: "3px", color: T.textSecondary,
        marginBottom: "8px", fontWeight: 600 }}>{eyebrow}</p>}
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px,3vw,30px)",
        fontWeight: 200, color: T.textPrimary, marginBottom: sub ? "8px" : 0 }}>
        {title}{accent && <em style={{ color: T.accent, fontStyle: "normal" }}> {accent}</em>}
      </h2>
      {sub && <p style={{ fontSize: "14px", color: T.textSecondary, lineHeight: 1.7 }}>{sub}</p>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ██████████████████████████████████████████████████████
// DASHBOARD CLIENT — /app/client/dashboard
// ██████████████████████████████████████████████████████
// ═══════════════════════════════════════════════════════

// Données mock — remplacées par Supabase en production
const MOCK_CLIENT = {
  name: "Restaurant Mama Africa",
  sector: "Restauration",
  country: "Abidjan, CI",
  plan: "Pack Automatisation IA",
  score: 42,
  scoreHistory: [28, 31, 35, 38, 40, 42],
  level: "Structurée",
  agents: {
    A1: { status: "done", lastRun: "28 mars 2026", output: "Rapport diagnostic disponible" },
    A2: { status: "done", lastRun: "28 mars 2026", output: "Roadmap 12 mois générée" },
    A3: { status: "waiting", lastRun: null, output: "En attente de validation" },
    A4: { status: "running", lastRun: "30 mars 2026", output: "Analyse KPIs semaine 13..." },
    A5: { status: "idle", lastRun: null, output: "Prochain rapport : 1er avril" },
  },
  kpis: [
    { label: "Visiteurs/mois", value: "1 240", trend: "+18%", up: true },
    { label: "Leads générés", value: "34", trend: "+12%", up: true },
    { label: "Score maturité", value: "42/100", trend: "+4pts", up: true },
    { label: "Actions exécutées", value: "7", trend: "ce mois", up: true },
  ],
  actions: [
    { date: "28 mars", agent: "A2", type: "Roadmap", desc: "Roadmap 12 mois générée et disponible", done: true },
    { date: "27 mars", agent: "A1", type: "Diagnostic", desc: "Analyse site web + concurrents terminée", done: true },
    { date: "25 mars", agent: "A3", type: "Publication", desc: "Post LinkedIn rédigé — en attente de validation", done: false },
    { date: "20 mars", agent: "A4", type: "Alerte KPIs", desc: "Trafic en hausse de 18% — objectif atteint", done: true },
  ],
  reports: [
    { month: "Mars 2026", status: "en_cours", url: null },
    { month: "Février 2026", status: "envoyé", url: "#" },
    { month: "Janvier 2026", status: "envoyé", url: "#" },
  ],
  pilotMode: "manuel",
};

function ClientDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [client] = useState(MOCK_CLIENT);
  const [pilotMode, setPilotMode] = useState(client.pilotMode);
  const [showValidation, setShowValidation] = useState(false);

  const tabs = [
    ["overview", "Vue d'ensemble"],
    ["agents", "Mes agents"],
    ["kpis", "KPIs & Suivi"],
    ["actions", "Actions"],
    ["reports", "Rapports"],
  ];

  return (
    <div style={{ background: T.sectionBg, minHeight: "100vh", fontFamily: "sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Header */}
      <div style={{ background: T.navyBg, padding: "24px 40px" }}>
        {/* Gold decorative line */}
        <div style={{ height: "2px", background: `linear-gradient(90deg,${T.gold},${T.gold}40,transparent)`,
          marginBottom: "20px", borderRadius: "1px" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto",
          display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px",
              color: T.textMuted, marginBottom: "6px" }}>TABLEAU DE BORD CLIENT</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "22px",
              fontWeight: 300, color: T.textOnNavy, marginBottom: "4px" }}>
              {client.name}
            </h1>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <span style={{ fontSize: "12px", color: T.textMuted }}>{client.sector} · {client.country}</span>
              <Badge label={client.plan} color={T.accent} filled />
              <Badge label={`Score ${client.score}/100`} color={T.accent} />
            </div>
          </div>
          {/* Pilot mode toggle */}
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "monospace", fontSize: "9px", color: T.textMuted,
              marginBottom: "8px" }}>MODE PILOTE</p>
            <div style={{ display: "flex", background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", overflow: "hidden" }}>
              {[["manuel", "Manuel"], ["auto", "Automatique"]].map(([m, l]) => (
                <button key={m} onClick={() => setPilotMode(m)}
                  style={{ padding: "8px 16px",
                    background: pilotMode === m ? T.accent : "transparent",
                    border: "none", color: pilotMode === m ? "#fff" : T.textMuted,
                    fontSize: "12px", fontWeight: pilotMode === m ? 700 : 400,
                    cursor: "pointer" }}>{l}</button>
              ))}
            </div>
            <p style={{ fontSize: "10px", color: T.textMuted, marginTop: "4px" }}>
              {pilotMode === "manuel" ? "Validation requise avant chaque action" : "Agents exécutent automatiquement"}
            </p>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ maxWidth: "1100px", margin: "16px auto 0",
          display: "flex", gap: "2px", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)}
              style={{ padding: "10px 18px", background: "none", border: "none",
                cursor: "pointer", fontSize: "13px",
                color: activeTab === id ? "#fff" : T.textMuted,
                fontWeight: activeTab === id ? 600 : 400,
                borderBottom: `2px solid ${activeTab === id ? T.accent : "transparent"}`,
                transition: "all 0.2s" }}>{label}</button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "1100px", margin: "0 auto",
        padding: "32px 40px", animation: "fadeIn 0.35s ease" }}>

        {/* ── VUE D'ENSEMBLE ─────────────────────────────── */}
        {activeTab === "overview" && (
          <div>
            {/* KPI cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)",
              gap: "14px", marginBottom: "24px" }}>
              {client.kpis.map((kpi, i) => (
                <div key={i} style={{ padding: "20px", background: "#fff",
                  border: `1px solid ${T.border}`, borderRadius: "14px",
                  borderTop: `3px solid ${T.accent}` }}>
                  <p style={{ fontSize: "11px", color: T.textSecondary,
                    marginBottom: "6px" }}>{kpi.label}</p>
                  <p style={{ fontFamily: "Georgia, serif", fontSize: "24px",
                    fontWeight: 300, color: T.textPrimary, marginBottom: "4px" }}>{kpi.value}</p>
                  <span style={{ fontSize: "11px", color: kpi.up ? "#2E7D52" : "#C0627A",
                    fontWeight: 600 }}>{kpi.up ? "↑" : "↓"} {kpi.trend}</span>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              {/* Score progression */}
              <div style={{ padding: "24px", background: "#fff",
                border: `1px solid ${T.border}`, borderRadius: "16px" }}>
                <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px",
                  color: T.textSecondary, marginBottom: "16px" }}>ÉVOLUTION DU SCORE</p>
                <div style={{ display: "flex", alignItems: "flex-end",
                  gap: "8px", height: "80px", marginBottom: "12px" }}>
                  {client.scoreHistory.map((s, i) => (
                    <div key={i} style={{ flex: 1, display: "flex",
                      flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "100%", background: i === client.scoreHistory.length - 1
                        ? T.accent : `${T.accent}30`,
                        borderRadius: "4px 4px 0 0",
                        height: `${(s / 100) * 80}px`, transition: "all 0.3s" }} />
                      <span style={{ fontSize: "9px", color: T.textSecondary,
                        fontFamily: "monospace" }}>{s}</span>
                    </div>
                  ))}
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "11px", color: T.textSecondary }}>Oct 2025</span>
                  <span style={{ fontSize: "11px", color: T.accent, fontWeight: 600 }}>Mars 2026</span>
                </div>
              </div>

              {/* Agents status */}
              <div style={{ padding: "24px", background: "#fff",
                border: `1px solid ${T.border}`, borderRadius: "16px" }}>
                <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px",
                  color: T.textSecondary, marginBottom: "16px" }}>STATUT DES AGENTS</p>
                {Object.entries(client.agents).map(([id, agent]) => (
                  <div key={id} style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "center", padding: "10px 0",
                    borderBottom: `1px solid ${T.border}` }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%",
                        background: `${AGENT_COLORS[id]}12`,
                        display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "10px", fontWeight: 700,
                          color: AGENT_COLORS[id] }}>{id}</span>
                      </div>
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: 600, color: T.textPrimary }}>{AGENT_NAMES[id]}</p>
                        <p style={{ fontSize: "10px", color: T.textSecondary }}>{agent.output}</p>
                      </div>
                    </div>
                    <StatusDot status={agent.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── AGENTS ─────────────────────────────────────── */}
        {activeTab === "agents" && (
          <div>
            <SectionTitle eyebrow="VOS AGENTS IA" title="Vos 5 agents"
              accent="au travail" sub="Chaque agent a un rôle précis. Vous pouvez les activer ou les mettre en pause." />
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {Object.entries(client.agents).map(([id, agent]) => (
                <div key={id} style={{ padding: "24px", background: "#fff",
                  border: `1px solid ${T.border}`, borderRadius: "16px",
                  borderLeft: `4px solid ${AGENT_COLORS[id]}` }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "14px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "50%",
                        background: `${AGENT_COLORS[id]}12`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        border: `1px solid ${AGENT_COLORS[id]}20` }}>
                        <span style={{ fontSize: "13px", fontWeight: 700,
                          color: AGENT_COLORS[id] }}>{id}</span>
                      </div>
                      <div>
                        <h3 style={{ fontSize: "16px", fontWeight: 600,
                          color: T.textPrimary, marginBottom: "2px" }}>
                          Agent {id.replace("A","")} — {AGENT_NAMES[id]}
                        </h3>
                        <p style={{ fontSize: "12px", color: T.textSecondary }}>{AGENT_ROLES[id]}</p>
                      </div>
                    </div>
                    <StatusDot status={agent.status} />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr",
                    gap: "12px", padding: "14px", background: T.sectionBg, borderRadius: "10px" }}>
                    <div>
                      <p style={{ fontSize: "10px", color: T.textSecondary, marginBottom: "2px" }}>Dernière exécution</p>
                      <p style={{ fontSize: "12px", color: T.textPrimary }}>{agent.lastRun || "—"}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "10px", color: T.textSecondary, marginBottom: "2px" }}>Résultat</p>
                      <p style={{ fontSize: "12px", color: T.textPrimary }}>{agent.output}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: "10px", color: T.textSecondary, marginBottom: "2px" }}>Mode</p>
                      <Badge label={pilotMode === "auto" ? "Auto" : "Manuel"} color={T.accent} />
                    </div>
                  </div>
                  {agent.status === "waiting" && pilotMode === "manuel" && (
                    <div style={{ marginTop: "12px", padding: "14px",
                      background: "#FFF8E8", borderRadius: "10px",
                      border: "1px solid rgba(201,168,76,0.2)" }}>
                      <p style={{ fontSize: "13px", color: T.textPrimary, marginBottom: "10px" }}>
                        ⚠️ Cet agent attend votre validation pour exécuter l'action suivante.
                      </p>
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button onClick={() => setShowValidation(true)}
                          style={{ padding: "9px 20px", background: T.btnPrimary,
                            border: "none", borderRadius: "8px",
                            color: T.btnPrimaryText, fontSize: "13px",
                            fontWeight: 700, cursor: "pointer" }}>
                          ✓ Valider et exécuter
                        </button>
                        <button style={{ padding: "9px 16px", background: "transparent",
                          border: `1px solid ${T.border}`, borderRadius: "8px",
                          color: T.textSecondary, fontSize: "13px", cursor: "pointer" }}>
                          Voir le détail
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── KPIs ───────────────────────────────────────── */}
        {activeTab === "kpis" && (
          <div>
            <SectionTitle eyebrow="SUIVI HEBDOMADAIRE" title="Vos KPIs"
              accent="en temps réel" sub="L'Agent 4 surveille ces indicateurs chaque lundi matin et vous alerte si quelque chose décroche." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "16px" }}>
              {[["🌐","Trafic web","1 240 visiteurs/mois","Objectif : 1 500","82%","#2E9B8B"],
                ["📧","Leads générés","34 ce mois","Objectif : 40","85%","#1A5FA8"],
                ["📱","Engagement réseaux","12.4% taux moyen","Objectif : 10%","124%","#6B3FA0"],
                ["⭐","Score maturité","42 / 100","Objectif : 60","70%","#E07B39"]].map(([e,l,v,obj,pct,color]) => (
                <div key={l} style={{ padding: "24px", background: "#fff",
                  border: `1px solid ${T.border}`, borderRadius: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    alignItems: "flex-start", marginBottom: "16px" }}>
                    <div>
                      <p style={{ fontSize: "11px", color: T.textSecondary, marginBottom: "4px" }}>{e} {l}</p>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: "26px",
                        fontWeight: 300, color: T.textPrimary }}>{v}</p>
                    </div>
                    <span style={{ fontSize: "13px", fontWeight: 700,
                      color: parseInt(pct) >= 100 ? "#2E7D52" : color }}>{pct}</span>
                  </div>
                  <div style={{ height: "6px", background: T.sectionBg, borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(parseInt(pct), 100)}%`, height: "100%",
                      background: parseInt(pct) >= 100 ? "#2E7D52" : color, borderRadius: "3px" }} />
                  </div>
                  <p style={{ fontSize: "11px", color: T.textSecondary, marginTop: "6px" }}>{obj}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIONS ────────────────────────────────────── */}
        {activeTab === "actions" && (
          <div>
            <SectionTitle eyebrow="HISTORIQUE" title="Actions" accent="exécutées"
              sub="Tout ce que vos agents ont fait ou prévoient de faire." />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {client.actions.map((action, i) => (
                <div key={i} style={{ padding: "18px 20px", background: "#fff",
                  border: `1px solid ${T.border}`, borderRadius: "12px",
                  display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "34px", height: "34px", borderRadius: "50%",
                    background: `${AGENT_COLORS[action.agent]}12`, flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: "10px", fontWeight: 700,
                      color: AGENT_COLORS[action.agent] }}>{action.agent}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: T.textPrimary }}>{action.desc}</span>
                    </div>
                    <span style={{ fontSize: "11px", color: T.textSecondary }}>{action.date} · {action.type}</span>
                  </div>
                  <div>
                    {action.done
                      ? <Badge label="FAIT" color="#2E7D52" filled />
                      : <Badge label="EN ATTENTE" color="#E07B39" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── RAPPORTS ───────────────────────────────────── */}
        {activeTab === "reports" && (
          <div>
            <SectionTitle eyebrow="RAPPORTS MENSUELS" title="Vos rapports"
              accent="automatiques" sub="L'Agent 5 génère et envoie votre rapport PDF le 1er de chaque mois." />
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {client.reports.map((report, i) => (
                <div key={i} style={{ padding: "20px 24px", background: "#fff",
                  border: `1px solid ${T.border}`, borderRadius: "12px",
                  display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <span style={{ fontSize: "24px" }}>📄</span>
                    <div>
                      <p style={{ fontSize: "14px", fontWeight: 600,
                        color: T.textPrimary, marginBottom: "2px" }}>
                        Rapport {report.month}
                      </p>
                      <Badge
                        label={report.status === "envoyé" ? "ENVOYÉ" : "EN COURS"}
                        color={report.status === "envoyé" ? "#2E7D52" : "#E07B39"}
                      />
                    </div>
                  </div>
                  {report.url
                    ? <button style={{ padding: "9px 20px", background: T.btnPrimary,
                        border: "none", borderRadius: "8px", color: "#fff",
                        fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>
                        Télécharger PDF
                      </button>
                    : <span style={{ fontSize: "12px", color: T.textSecondary, fontFamily: "monospace" }}>
                        Génération en cours...
                      </span>
                  }
                </div>
              ))}
            </div>
            <div style={{ marginTop: "20px", padding: "20px", background: T.navyBg,
              borderRadius: "14px" }}>
              <p style={{ fontFamily: "monospace", fontSize: "10px",
                color: T.textMuted, marginBottom: "6px" }}>PROCHAIN RAPPORT AUTO</p>
              <p style={{ fontSize: "15px", color: T.textOnNavy }}>
                1er avril 2026 — L'Agent 5 générera et vous enverra votre rapport automatiquement.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
// ██████████████████████████████████████████████████████
// BLOG — /app/blog
// ██████████████████████████████████████████████████████
// ═══════════════════════════════════════════════════════

// Articles mock — remplacés par Supabase en production
const MOCK_ARTICLES = [
  {
    id: 1, slug: "transformation-digitale-cote-ivoire-2026",
    cat: "Stratégie", readTime: "6 min", date: "28 mars 2026",
    title: "Transformation digitale en Côte d'Ivoire : pourquoi 2026 est l'année décisive",
    excerpt: "L'État ivoirien a engagé 2 000 milliards FCFA dans le numérique. Les PME qui ne basculent pas maintenant prendront un retard difficile à rattraper.",
    color: "#2E9B8B",
    content: `La Côte d'Ivoire vit un tournant numérique sans précédent. En 2026, le budget du Ministère du Numérique atteint 83,2 milliards FCFA — en hausse de 12% par rapport à l'année précédente. La Banque Mondiale a accordé un financement de 83,3 milliards FCFA spécifiquement pour accélérer l'économie numérique.

Pour les PME ivoiriennes, ce contexte crée une opportunité rare. Les entreprises qui digitalisent maintenant bénéficient d'un marché en forte croissance, d'une concurrence encore faible sur le digital, et d'outils IA accessibles comme jamais auparavant.

**Ce que ça veut dire concrètement pour une PME abidjanaise**

Une étude récente montre que les PME qui ont une présence digitale sérieuse génèrent en moyenne 34% de revenus supplémentaires par rapport à celles qui en sont absentes. Sur le marché abidjanais, ce chiffre monte à 48% dans les secteurs services et commerce.

La réalité du terrain : sur 300 agences de communication à Abidjan, moins de 5% utilisent des outils IA dans leur process de production. C'est un avantage concurrentiel considérable pour ceux qui font le pas maintenant.

**Les 3 actions prioritaires pour une PME en 2026**

Premièrement, avoir un site web professionnel mobile-first. 78% du trafic internet en CI vient du mobile. Un site non optimisé mobile perd les trois quarts de ses visiteurs potentiels.

Deuxièmement, utiliser l'IA pour accélérer la production de contenu. Ce qui prenait 3 jours prend maintenant 20 minutes. L'efficacité opérationnelle obtenue représente souvent 15 à 20% d'économies sur les coûts de communication.

Troisièmement, mettre en place un système de suivi des indicateurs. Ce qui ne se mesure pas ne s'améliore pas. Un tableau de bord simple avec 5 KPIs suffit pour piloter efficacement sa transformation digitale.`,
    tags: ["Côte d'Ivoire", "Digital", "PME", "IA"]
  },
  {
    id: 2, slug: "agents-ia-gestion-entreprise",
    cat: "Intelligence Artificielle", readTime: "5 min", date: "22 mars 2026",
    title: "Les agents IA vont transformer la gestion des PME africaines",
    excerpt: "Un agent IA qui scrape votre marché, génère votre stratégie et publie vos contenus automatiquement. Ce n'est plus de la science-fiction.",
    color: "#1A5FA8",
    content: `Les agents IA représentent une rupture majeure dans la façon dont les entreprises opèrent. Contrairement aux outils IA classiques qui répondent à des questions, les agents agissent : ils naviguent sur internet, analysent des données en temps réel, exécutent des tâches et surveillent des indicateurs.

Pour une PME africaine, les implications sont considérables. Des tâches qui nécessitaient un prestataire externe — analyse concurrentielle, création de contenu, suivi des KPIs — peuvent maintenant être déléguées à des agents qui travaillent 24h/24.

**Exemple concret : un restaurant à Abidjan**

Un restaurant client de Nexalie a mis en place 3 agents. Le premier scrape chaque semaine les avis Google et les réseaux sociaux des 5 concurrents principaux. Le deuxième génère chaque lundi un post Instagram optimisé basé sur la tendance de la semaine. Le troisième surveille les réservations en ligne et alerte si le taux chute en dessous d'un seuil.

Résultat en 3 mois : +23% de réservations en ligne, -60% de temps consacré à la communication digitale.

**Ce qui change avec les agents**

La différence fondamentale est le passage du conseil à l'action. Les consultants traditionnels recommandent. Les agents exécutent. Pour les PME qui manquent de ressources internes, c'est un saut qualitatif considérable.`,
    tags: ["Agents IA", "Automatisation", "PME"]
  },
  {
    id: 3, slug: "audit-digital-pourquoi-commencer-par-la",
    cat: "Méthodologie", readTime: "4 min", date: "15 mars 2026",
    title: "Pourquoi l'audit digital est la première étape de toute transformation réussie",
    excerpt: "Trop d'entreprises investissent dans le digital sans diagnostic préalable. Résultat : des budgets gaspillés sur des outils inadaptés.",
    color: "#6B3FA0",
    content: `L'erreur la plus commune dans la transformation digitale des PME est de commencer par les outils plutôt que par le diagnostic. On achète un CRM sans savoir si on en a vraiment besoin. On refait son site sans comprendre pourquoi l'ancien ne convertissait pas.

L'audit de maturité digitale résout ce problème. En 20 minutes, il donne une photographie précise de la situation sur 5 dimensions : stratégie, expérience client, opérations, technologies et culture. Le score obtenu oriente directement vers les priorités.

**Ce qu'on découvre avec un audit**

Dans 80% des cas, les entreprises surestiment leur maturité digitale d'au moins 15 points sur 100. Ce biais de confirmation est naturel — on a tendance à voir ce qu'on a fait plutôt que ce qui reste à faire.

L'audit révèle souvent des angles morts surprenants. Une entreprise peut avoir un excellent site web (dimension technologie élevée) mais aucune stratégie pour attirer du trafic dessus (dimension stratégie faible). L'investissement dans le site devient alors sous-exploité.

**L'audit comme point de départ du plan d'action**

Un bon audit ne se contente pas de donner un score. Il génère un plan d'action priorisé, avec les 3 actions qui auront le plus d'impact rapide. C'est ce que fait l'audit Nexalie — gratuit, en 20 minutes, avec un rapport personnalisé par IA.`,
    tags: ["Audit", "Méthodologie", "Diagnostic"]
  },
];

function BlogList({ setArticle }) {
  const [filter, setFilter] = useState("Tous");
  const cats = ["Tous", "Stratégie", "Intelligence Artificielle", "Méthodologie"];
  const filtered = filter === "Tous" ? MOCK_ARTICLES
    : MOCK_ARTICLES.filter(a => a.cat === filter);

  return (
    <div style={{ background: T.pageBg, minHeight: "100vh" }}>

      {/* Header navy */}
      <div style={{ background: T.navyBg, padding: "60px 40px" }}>
        <div style={{ height: "2px", background: `linear-gradient(90deg,${T.gold}40,transparent)`,
          marginBottom: "28px" }} />
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px",
            color: T.textMuted, marginBottom: "10px" }}>RESSOURCES & INSIGHTS</p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px,4vw,44px)",
            fontWeight: 200, color: T.textOnNavy, marginBottom: "12px" }}>
            Le blog <em style={{ color: T.accent, fontStyle: "normal" }}>Nexalie</em>
          </h1>
          <p style={{ fontSize: "15px", color: T.textMuted, maxWidth: "520px", lineHeight: 1.8 }}>
            Transformation digitale · IA & Automatisation · PME africaines et françaises
          </p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ background: "#fff", padding: "20px 40px",
        borderBottom: `1px solid ${T.border}`, position: "sticky", top: 64, zIndex: 10 }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "8px" }}>
          {cats.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: "7px 16px", border: "none", borderRadius: "20px",
                background: filter === cat ? T.navyBg : T.sectionBg,
                color: filter === cat ? "#fff" : T.textSecondary,
                fontSize: "13px", fontWeight: filter === cat ? 600 : 400,
                cursor: "pointer", transition: "all 0.2s" }}>{cat}</button>
          ))}
        </div>
      </div>

      {/* Articles grid */}
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "40px 40px" }}>
        {/* Featured article */}
        {filtered[0] && (
          <div onClick={() => setArticle(filtered[0])}
            style={{ padding: "36px", background: "#fff",
              border: `1px solid ${T.border}`, borderRadius: "20px",
              cursor: "pointer", marginBottom: "24px",
              borderTop: `4px solid ${filtered[0].color}`,
              display: "grid", gridTemplateColumns: "1fr 200px", gap: "32px",
              alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
                <Badge label={filtered[0].cat} color={filtered[0].color} />
                <span style={{ fontSize: "12px", color: T.textSecondary }}>
                  {filtered[0].readTime} · {filtered[0].date}
                </span>
              </div>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px",
                fontWeight: 300, color: T.textPrimary, lineHeight: 1.4,
                marginBottom: "10px" }}>{filtered[0].title}</h2>
              <p style={{ fontSize: "14px", color: T.textSecondary,
                lineHeight: 1.7, marginBottom: "16px" }}>{filtered[0].excerpt}</p>
              <span style={{ fontSize: "13px", fontWeight: 600, color: filtered[0].color }}>
                Lire l'article →
              </span>
            </div>
            <div style={{ width: "200px", height: "160px",
              background: `${filtered[0].color}08`,
              borderRadius: "14px", border: `1px solid ${filtered[0].color}15`,
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontFamily: "Georgia, serif", fontSize: "48px",
                color: `${filtered[0].color}25`, fontWeight: 300 }}>N</span>
            </div>
          </div>
        )}

        {/* Other articles */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "14px" }}>
          {filtered.slice(1).map(article => (
            <div key={article.id} onClick={() => setArticle(article)}
              style={{ padding: "24px", background: "#fff",
                border: `1px solid ${T.border}`, borderRadius: "16px",
                cursor: "pointer", borderLeft: `3px solid ${article.color}`,
                transition: "transform 0.15s, box-shadow 0.15s" }}>
              <div style={{ display: "flex", gap: "8px", marginBottom: "12px" }}>
                <Badge label={article.cat} color={article.color} />
                <span style={{ fontSize: "11px", color: T.textSecondary }}>{article.readTime}</span>
              </div>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "17px",
                fontWeight: 300, color: T.textPrimary, lineHeight: 1.4,
                marginBottom: "8px" }}>{article.title}</h3>
              <p style={{ fontSize: "13px", color: T.textSecondary,
                lineHeight: 1.6, marginBottom: "14px" }}>{article.excerpt}</p>
              <div style={{ display: "flex", justifyContent: "space-between",
                alignItems: "center" }}>
                <span style={{ fontSize: "11px", color: T.textSecondary }}>{article.date}</span>
                <span style={{ fontSize: "12px", fontWeight: 600,
                  color: article.color }}>Lire →</span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA newsletter */}
        <div style={{ marginTop: "48px", padding: "40px", background: T.navyBg,
          borderRadius: "20px", textAlign: "center" }}>
          <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px",
            fontWeight: 200, color: T.textOnNavy, marginBottom: "8px" }}>
            Recevez les prochains articles
          </h3>
          <p style={{ fontSize: "14px", color: T.textMuted,
            marginBottom: "20px" }}>
            Transformation digitale · IA · Afrique — chaque semaine
          </p>
          <div style={{ display: "flex", gap: "8px",
            maxWidth: "400px", margin: "0 auto" }}>
            <input placeholder="votre@email.com"
              style={{ flex: 1, padding: "12px 16px", background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)", borderRadius: "8px",
                color: "#fff", fontSize: "14px", outline: "none" }} />
            <button style={{ padding: "12px 20px", background: T.btnAccent,
              border: "none", borderRadius: "8px", color: "#fff",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap" }}>
              Je m'inscris →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogArticle({ article, onBack }) {
  return (
    <div style={{ background: T.pageBg, minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: T.navyBg, padding: "48px 40px" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto" }}>
          <button onClick={onBack}
            style={{ background: "none", border: "none", color: T.textMuted,
              fontSize: "13px", cursor: "pointer", marginBottom: "20px",
              display: "flex", alignItems: "center", gap: "6px" }}>
            ← Retour au blog
          </button>
          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <Badge label={article.cat} color={article.color} filled />
            <span style={{ fontSize: "12px", color: T.textMuted }}>
              {article.readTime} de lecture · {article.date}
            </span>
          </div>
          <h1 style={{ fontFamily: "Georgia, serif",
            fontSize: "clamp(24px,4vw,36px)", fontWeight: 200,
            color: T.textOnNavy, lineHeight: 1.3, marginBottom: "16px" }}>
            {article.title}
          </h1>
          <p style={{ fontSize: "16px", color: T.textMuted,
            lineHeight: 1.8 }}>{article.excerpt}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 40px" }}>
        {/* Gold decorative line */}
        <div style={{ height: "2px", background: `linear-gradient(90deg,${article.color}40,transparent)`,
          marginBottom: "40px" }} />

        {article.content.split("\n\n").map((para, i) => {
          if (para.startsWith("**") && para.endsWith("**")) {
            return <h3 key={i} style={{ fontFamily: "Georgia, serif",
              fontSize: "20px", fontWeight: 300, color: T.textPrimary,
              margin: "32px 0 12px", lineHeight: 1.4 }}>
              {para.replace(/\*\*/g, "")}
            </h3>;
          }
          return <p key={i} style={{ fontSize: "16px", color: T.textSecondary,
            lineHeight: 1.9, marginBottom: "20px" }}>
            {para.replace(/\*\*/g, "")}
          </p>;
        })}

        {/* Tags */}
        <div style={{ display: "flex", gap: "8px", marginTop: "40px",
          paddingTop: "24px", borderTop: `1px solid ${T.border}` }}>
          {article.tags.map(tag => (
            <Badge key={tag} label={tag} color={article.color} />
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: "40px", padding: "32px", background: T.navyBg,
          borderRadius: "16px", textAlign: "center" }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: "20px",
            fontWeight: 200, color: T.textOnNavy, marginBottom: "8px" }}>
            Prêt à commencer votre transformation ?
          </p>
          <p style={{ fontSize: "14px", color: T.textMuted, marginBottom: "20px" }}>
            Audit gratuit en 20 minutes · Rapport personnalisé par IA
          </p>
          <button style={{ padding: "13px 28px", background: T.btnAccent,
            border: "none", borderRadius: "10px", color: "#fff",
            fontSize: "14px", fontWeight: 700, cursor: "pointer" }}>
            Faire mon audit gratuit →
          </button>
        </div>
      </div>
    </div>
  );
}

function BlogPage() {
  const [currentArticle, setCurrentArticle] = useState(null);

  return currentArticle
    ? <BlogArticle article={currentArticle} onBack={() => setCurrentArticle(null)} />
    : <BlogList setArticle={setCurrentArticle} />;
}

// ═══════════════════════════════════════════════════════
// EXPORT — deux composants séparés pour Next.js
// Dans Next.js : importer ClientDashboard dans app/client/dashboard/page.tsx
//                importer BlogPage dans app/blog/page.tsx
// ═══════════════════════════════════════════════════════
export { ClientDashboard, BlogPage };

// Pour tester en standalone — affiche les deux pages avec navigation
export default function App() {
  const [view, setView] = useState("dashboard");
  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
      `}</style>
      {/* Preview nav */}
      <div style={{ background: "#060E1C", padding: "10px 20px",
        display: "flex", gap: "8px", borderBottom: "1px solid rgba(201,168,76,0.2)" }}>
        <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)",
          marginRight: "8px", alignSelf: "center" }}>APERÇU :</span>
        {[["dashboard","Dashboard Client"],["blog","Blog"]].map(([v,l]) => (
          <button key={v} onClick={() => setView(v)}
            style={{ padding: "6px 14px", background: view===v ? "#2E9B8B" : "transparent",
              border: `1px solid ${view===v ? "#2E9B8B" : "rgba(255,255,255,0.15)"}`,
              borderRadius: "6px", color: view===v ? "#fff" : "rgba(255,255,255,0.5)",
              fontSize: "12px", cursor: "pointer" }}>{l}</button>
        ))}
      </div>
      <div key={view} style={{ animation: "fadeIn 0.3s ease" }}>
        {view === "dashboard" && <ClientDashboard />}
        {view === "blog" && <BlogPage />}
      </div>
    </div>
  );
}
