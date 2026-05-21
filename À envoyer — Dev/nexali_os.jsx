import { useState, useRef, useEffect } from "react";

// ═══════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════

const TABS = [
  { id: "analyse",    icon: "◈", label: "Analyser",     sub: "Questionnaire client",      color: "#4EC9B0" },
  { id: "rapport",    icon: "◉", label: "Rapport",      sub: "Générer le rapport audit",  color: "#C9A84C" },
  { id: "pitch",      icon: "◐", label: "Pitch",        sub: "Préparer un RDV client",    color: "#C586C0" },
  { id: "objection",  icon: "◎", label: "Objections",   sub: "Répondre sans stress",      color: "#CE9178" },
  { id: "email",      icon: "◑", label: "Emails",       sub: "Rédiger en 30 secondes",    color: "#569CD6" },
  { id: "formation",  icon: "⬡", label: "Formation",    sub: "Préparer tes ateliers",     color: "#4A7C59" },
  { id: "coach",      icon: "✦", label: "Coach",        sub: "Ton binôme de confiance",   color: "#E06C75" },
  { id: "todo",       icon: "◻", label: "To-Do",        sub: "Gérer tes priorités",       color: "#D19A66" },
];

const NEXALI_CONTEXT = `
Tu travailles pour Nexalie Consulting, cabinet fondé par Relia Ebiya.

PROFIL RELIA :
- Cheffe de projet digital chez 3SP Technologies (MES, ERP, transformation digitale industrielle)
- 38 ans, ENFP, basée à Vitry-sur-Seine
- Expert : gestion de projet, cahiers des charges, roadmap, conduite du changement, MES, ERP
- Maîtrise : ChatGPT, Claude, Canva IA, WordPress
- En cours d'apprentissage : Make/Zapier, Power BI, chatbots, Python bases
- Objectif long terme : Ministre du Numérique au Congo Brazzaville

NEXALIE CONSULTING :
- Cabinet de conseil en transformation digitale
- Cibles : PME françaises et PME congolaises
- Positionnement : "L'expertise digitale française au service des entreprises africaines"
- Site : nexali.ai (à venir)

OFFRES NEXALIE :
1. Pack Démarrage — 500€ audit + 400€/mois (3 mois min) — Score 0-19/100
2. Pack Transformation — 700€ audit + 600€/mois (6 mois min) — Score 20-39/100
3. Pack Automatisation IA — 1200€ audit + 800€/mois (6 mois min) — Score 40-59/100
4. Pack Excellence — 1500€ audit + 1200€/mois (12 mois min) — Score 60-79/100
5. Formation IA Équipe — 350€/personne (6-12 pers, 1 journée)

TUNNEL DE VENTE :
Audit gratuit en ligne → questionnaire pré-audit (J-3) → journée audit (500-1500€) → rapport PDF (J+2) → proposition commerciale → pack mensuel

5 DIMENSIONS AUDIT :
◈ Stratégie & Vision | ◉ Expérience Client | ◐ Opérations & Processus | ◎ Technologies & Outils | ◑ Culture & Compétences
`;

const SYSTEMS = {
  analyse: `${NEXALI_CONTEXT}

Tu analyses les réponses d'un questionnaire pré-audit client. Produis exactement ce format :

---
🏢 PROFIL CLIENT
Entreprise : [nom] | Secteur : [secteur] | Pays : [pays]
Dirigeant : [nom] — [poste] | Effectif : [nb] | CA : [ca]

📊 SCORE ESTIMÉ : [X] / 100 — Niveau [Initiale/Émergente/Structurée/Optimisée/Leader]

📐 PAR DIMENSION
◈ Stratégie & Vision ......... [X]/20
◉ Expérience Client .......... [X]/20
◐ Opérations & Processus ..... [X]/20
◎ Technologies & Outils ...... [X]/20
◑ Culture & Compétences ...... [X]/20

🎯 TOP 3 PRIORITÉS
1. [priorité — 1 ligne]
2. [priorité — 1 ligne]
3. [priorité — 1 ligne]

💡 À CREUSER PENDANT L'AUDIT
• [question/point]
• [question/point]
• [question/point]

⚠️ SIGNAUX D'ALERTE
• [risque ou point de vigilance]
• [risque ou point de vigilance]

💼 PACK RECOMMANDÉ
[Nom du pack] — [tarif audit] + [tarif mensuel]/mois
Argument : [pourquoi ce pack en 1 phrase percutante]

📝 BRIEFING RELIA (5 lignes)
[Résumé humain et stratégique — ce que Relia doit savoir avant d'entrer dans la pièce]
---`,

  rapport: `${NEXALI_CONTEXT}

Tu génères un rapport d'audit professionnel. Produis un rapport complet et structuré :

RAPPORT D'AUDIT DIGITAL NEXALIE
═══════════════════════════════

Client : [nom] — [entreprise] | Date : [date]
Score global : [X]/100 — Niveau [X]

1. SYNTHÈSE EXÉCUTIVE
[3-4 phrases percutantes résumant la situation]

2. ANALYSE PAR DIMENSION
[Pour chaque dimension : score, analyse 2-3 phrases, recommandation concrète]

3. TOP 5 ACTIONS PRIORITAIRES
[Actions avec outil, délai et impact estimé]

4. ROADMAP 3 MOIS
Mois 1 | Mois 2 | Mois 3

5. ACCOMPAGNEMENT RECOMMANDÉ
[Pack, tarif, bénéfice clé]

Ton : professionnel, chaleureux, expert. Concret et actionnable.`,

  pitch: `${NEXALI_CONTEXT}

Tu aides Relia à préparer un pitch ou un RDV client. Quand elle te décrit le prospect (secteur, taille, pays, problème principal), tu génères :

🎯 STRATÉGIE D'APPROCHE
[Comment aborder ce prospect spécifiquement]

📣 ACCROCHE D'OUVERTURE
[La première phrase pour capter l'attention — adaptée à son contexte]

🔑 3 ARGUMENTS CLÉS
[Arguments taillés pour CE client — pas génériques]

❓ 5 QUESTIONS À POSER
[Questions ouvertes pour faire parler le client et révéler ses besoins]

💼 PACK À PROPOSER
[Lequel et pourquoi — avec tarif]

🚨 PIÈGES À ÉVITER
[Ce qu'il ne faut pas dire/faire avec ce type de client]

✅ CLOSING SUGGÉRÉ
[Comment proposer la suite naturellement]`,

  objection: `${NEXALI_CONTEXT}

Tu aides Relia à répondre aux objections commerciales. Quand elle te donne une objection, tu génères :

💬 OBJECTION REÇUE : [l'objection]

🧠 CE QUE ÇA VEUT DIRE VRAIMENT
[L'objection cachée derrière les mots]

✅ RÉPONSE RECOMMANDÉE
[Réponse naturelle, confiante, non défensive — en 2-3 phrases]

🔄 REFORMULATION
[Comment retourner l'objection en argument]

➡️ QUESTION DE RELANCE
[La question à poser après pour relancer le dialogue]

Les objections courantes Nexalie :
- "C'est trop cher"
- "J'ai pas le temps"
- "On verra plus tard"
- "Je connais déjà le digital"
- "J'ai déjà un prestataire"
- "Je suis pas sûr que ça marche au Congo"
- "Je préfère recruter quelqu'un en interne"`,

  email: `${NEXALI_CONTEXT}

Tu rédiges des emails professionnels pour Relia. Quand elle décrit le contexte, tu génères 2 versions :

VERSION 1 — [Ton chaleureux]
Objet : [objet percutant]
[Corps de l'email — naturel, professionnel, efficace]

VERSION 2 — [Ton direct/urgent si pertinent]
Objet : [objet alternatif]
[Corps alternatif]

Signature automatique :
Relia Ebiya
Fondatrice — Nexalie Consulting
relia.ebiya@gmail.com | nexali.ai
+33 7 86 62 04 09

Types d'emails Nexalie :
- Relance après audit gratuit
- Envoi questionnaire pré-audit
- Confirmation journée audit
- Envoi rapport + proposition
- Relance prospect silencieux
- Remerciement après session
- Onboarding nouveau client
- Partage ressource utile`,

  formation: `${NEXALI_CONTEXT}

Tu aides Relia à préparer ses formations IA et digital. Quand elle décrit son public et le thème, tu génères :

📋 PROGRAMME DE FORMATION
Titre : [titre accrocheur]
Public : [qui] | Durée : [durée] | Format : [présentiel/distanciel]
Objectif : [ce que les participants sauront faire à la fin]

⏰ DÉROULÉ HEURE PAR HEURE
[Découpage détaillé avec activités, exercices, timing]

📊 SLIDES SUGGÉRÉS
[Structure des slides avec contenu clé pour chaque partie]

🎯 EXERCICES PRATIQUES
[2-3 exercices concrets avec instructions]

❓ QUIZ D'ÉVALUATION
[5 questions pour mesurer les acquis]

📦 CE QUE LES PARTICIPANTS REPARTENT AVEC
[Liste des livrables et ressources]

💡 CONSEILS ANIMATION ENFP
[Comment Relia peut rendre cette formation dynamique et engageante]`,

  coach: `${NEXALI_CONTEXT}

Tu es le coach personnel de Relia — son binôme de confiance. Tu la tutoies. Tu es direct, chaleureux, encourageant et honnête.

Tu peux :
- Répondre à ses questions sur Nexalie, ses offres, ses clients
- L'aider à surmonter le syndrome de l'imposteur
- Lui donner de la confiance avant un RDV important
- L'aider à prendre des décisions stratégiques
- La conseiller sur sa communication et son personal branding
- Répondre à des questions sur les outils IA
- Débloquer une situation commerciale difficile
- La remotiver quand elle doute

Tu connais tout de son contexte — sa candidature Safran qui n'a pas abouti ce jour, son projet Congo, sa feuille de route 15 ans, son papa ministre, sa formation en cours.

Sois son miroir bienveillant et son accélérateur de confiance.`,

  todo: `${NEXALI_CONTEXT}

Tu es le gestionnaire de priorités de Relia. Tu l'aides à organiser ses tâches Nexalie de façon ENFP-friendly — simple, visuel, sans culpabilité.

Quand elle te donne ses tâches en vrac, tu les organises ainsi :

⚡ AUJOURD'HUI (max 3)
1. [tâche la plus importante]
2. [tâche 2]
3. [tâche 3]

📅 CETTE SEMAINE (max 5)
• [tâche]
• [tâche]
• [tâche]

🗓️ CE MOIS (max 5)
• [tâche]
• [tâche]

💡 UN JOUR / EN VEILLE
• [idée ou tâche non urgente]

⏱️ ESTIMATION TEMPS
[Temps total estimé pour Aujourd'hui]

🎯 LA VRAIE PRIORITÉ #1
[Une seule chose — la plus importante de tout]

💬 MESSAGE ENFP
[1 phrase encourageante adaptée à son énergie du moment]`,
};

// ═══════════════════════════════════════════════
// API CALL
// ═══════════════════════════════════════════════

async function callClaude(system, messages, onChunk) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system,
      messages,
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

// ═══════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════

function Message({ role, content, color }) {
  return (
    <div style={{ display: "flex", gap: "8px", marginBottom: "14px", flexDirection: role === "user" ? "row-reverse" : "row", alignItems: "flex-start" }}>
      <div style={{ width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: role === "user" ? "rgba(255,255,255,0.06)" : `${color}20`, border: `1px solid ${role === "user" ? "rgba(255,255,255,0.08)" : color + "50"}`, fontSize: "9px", fontFamily: "monospace", color: role === "user" ? "rgba(255,255,255,0.4)" : color }}>
        {role === "user" ? "R" : "N"}
      </div>
      <div style={{ maxWidth: "85%", padding: "10px 14px", borderRadius: role === "user" ? "12px 3px 12px 12px" : "3px 12px 12px 12px", background: role === "user" ? "rgba(255,255,255,0.05)" : `${color}0c`, border: `1px solid ${role === "user" ? "rgba(255,255,255,0.07)" : color + "22"}`, fontSize: "13px", color: "rgba(255,255,255,0.82)", lineHeight: 1.7, whiteSpace: "pre-wrap", fontFamily: "'IBM Plex Sans', sans-serif" }}>
        {content || <span style={{ opacity: 0.3 }}>...</span>}
      </div>
    </div>
  );
}

function ChatPanel({ tab }) {
  const [msgs, setMsgs] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setInput("");
    const newMsgs = [...msgs, { role: "user", content: text }];
    setMsgs(newMsgs);
    setLoading(true);
    const aiIdx = newMsgs.length;
    setMsgs(m => [...m, { role: "assistant", content: "" }]);
    let out = "";
    try {
      await callClaude(
        SYSTEMS[tab.id],
        newMsgs.map(m => ({ role: m.role, content: m.content })),
        chunk => {
          out += chunk;
          setMsgs(m => { const u = [...m]; u[aiIdx] = { role: "assistant", content: out }; return u; });
        }
      );
    } catch {
      setMsgs(m => { const u = [...m]; u[aiIdx] = { role: "assistant", content: "Erreur — réessaie." }; return u; });
    }
    setLoading(false);
  };

  const PLACEHOLDERS = {
    analyse: "Colle les réponses du questionnaire client ici...",
    rapport: "Entre tes notes d'audit (scores, observations, points clés)...",
    pitch: "Décris-moi le prospect : secteur, pays, taille, problème principal...",
    objection: "Quelle objection tu as reçue ? Ex: 'C'est trop cher'",
    email: "Quel email tu dois envoyer ? Ex: relance après audit, envoi rapport...",
    formation: "Décris ton public et le thème de la formation...",
    coach: "Pose-moi ta question — je suis là pour toi...",
    todo: "Liste-moi tout ce que tu as à faire pour Nexalie en vrac...",
  };

  const INTROS = {
    analyse: "Colle les réponses du questionnaire pré-audit — je génère score, priorités, signaux d'alerte et briefing complet.",
    rapport: "Donne-moi tes notes de la journée — je rédige le rapport client complet en 2 minutes.",
    pitch: "Décris-moi le prospect et je te prépare un pitch sur mesure avec arguments, questions et closing.",
    objection: "Donne-moi l'objection reçue — je t'aide à la retourner en argument sans stress.",
    email: "Dis-moi quel email tu dois écrire — je te fais 2 versions prêtes à envoyer.",
    formation: "Décris ton public et ton thème — je construis le programme complet avec exercices et slides.",
    coach: "Je connais tout de Nexalie, tes offres, tes clients et toi. Pose-moi n'importe quelle question.",
    todo: "Vide ton cerveau — liste tout ce que tu as à faire et je te fais un plan ENFP-friendly.",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {msgs.length === 0 && (
        <div style={{ padding: "16px", border: `1px solid ${tab.color}20`, borderRadius: "10px", background: `${tab.color}06`, marginBottom: "14px" }}>
          <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: tab.color, marginBottom: "6px" }}>{tab.icon} {tab.id.toUpperCase()}</p>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{INTROS[tab.id]}</p>
        </div>
      )}

      <div style={{ flex: 1, overflowY: "auto", minHeight: "180px", maxHeight: "380px", marginBottom: "10px", paddingRight: "4px" }}>
        {msgs.map((m, i) => <Message key={i} role={m.role} content={m.content} color={tab.color} />)}
        {loading && msgs[msgs.length - 1]?.content === "" && (
          <div style={{ display: "flex", gap: "4px", paddingLeft: "34px", marginBottom: "8px" }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: tab.color, animation: `dot ${0.8 + i * 0.15}s infinite alternate` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div style={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
        <textarea value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder={PLACEHOLDERS[tab.id]} rows={3}
          style={{ flex: 1, padding: "10px 12px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontSize: "13px", resize: "none", fontFamily: "'IBM Plex Sans', sans-serif", lineHeight: 1.5, outline: "none", transition: "border-color 0.2s" }}
        />
        <button onClick={send} disabled={!input.trim() || loading}
          style={{ padding: "10px 14px", background: input.trim() && !loading ? tab.color : "rgba(255,255,255,0.04)", border: "none", borderRadius: "8px", color: input.trim() && !loading ? "#080f1e" : "rgba(255,255,255,0.15)", fontSize: "16px", cursor: input.trim() && !loading ? "pointer" : "default", transition: "all 0.2s", flexShrink: 0, fontWeight: "700" }}>
          →
        </button>
      </div>

      {msgs.length > 0 && (
        <button onClick={() => setMsgs([])} style={{ marginTop: "6px", background: "transparent", border: "none", color: "rgba(255,255,255,0.15)", fontSize: "11px", fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", letterSpacing: "1px" }}>
          NOUVELLE CONVERSATION
        </button>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════════

export default function App() {
  const [activeTab, setActiveTab] = useState("coach");
  const tab = TABS.find(t => t.id === activeTab);

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 10% 10%, #0d1f38 0%, #070e1c 100%)", fontFamily: "'IBM Plex Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@300;400;500;600&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        textarea { outline: none !important; }
        textarea:focus { border-color: rgba(78,201,176,0.35) !important; }
        ::placeholder { color: rgba(255,255,255,0.15) !important; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 2px; }
        @keyframes dot { from { opacity: 0.3; transform: scale(1); } to { opacity: 1; transform: scale(1.3); } }
        .tab-btn:hover { background: rgba(255,255,255,0.04) !important; }
      `}</style>

      <div style={{ display: "flex", height: "100vh" }}>

        {/* SIDEBAR */}
        <div style={{ width: "200px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)", padding: "20px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ marginBottom: "20px", paddingBottom: "16px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 300, color: "#fff", marginBottom: "2px" }}>Nexalie</p>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", letterSpacing: "2px", color: "#C9A84C" }}>OS · v1.0</p>
          </div>

          {TABS.map(t => (
            <button key={t.id} className="tab-btn" onClick={() => setActiveTab(t.id)}
              style={{ width: "100%", padding: "10px 12px", borderRadius: "8px", border: `1px solid ${activeTab === t.id ? t.color + "40" : "transparent"}`, background: activeTab === t.id ? `${t.color}10` : "transparent", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", color: activeTab === t.id ? t.color : "rgba(255,255,255,0.25)" }}>{t.icon}</span>
                <div>
                  <p style={{ fontSize: "12px", fontWeight: "500", color: activeTab === t.id ? "#fff" : "rgba(255,255,255,0.45)", marginBottom: "1px" }}>{t.label}</p>
                  <p style={{ fontSize: "10px", color: activeTab === t.id ? t.color : "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace" }}>{t.sub}</p>
                </div>
              </div>
            </button>
          ))}

          <div style={{ marginTop: "auto", paddingTop: "16px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
            <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.15)", lineHeight: 1.6 }}>
              relia.ebiya@gmail.com<br />nexali.ai
            </p>
          </div>
        </div>

        {/* MAIN */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* Top bar */}
          <div style={{ padding: "16px 24px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "18px", color: tab.color }}>{tab.icon}</span>
              <div>
                <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", fontWeight: 300, color: "#fff" }}>{tab.label}</p>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.25)" }}>{tab.sub}</p>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4EC9B0", animation: "dot 1.5s infinite alternate" }} />
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "9px", color: "rgba(255,255,255,0.2)", letterSpacing: "1px" }}>IA ACTIVE</span>
            </div>
          </div>

          {/* Chat area */}
          <div style={{ flex: 1, padding: "20px 24px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <ChatPanel key={activeTab} tab={tab} />
          </div>
        </div>
      </div>
    </div>
  );
}
