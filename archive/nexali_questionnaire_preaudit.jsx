import { useState } from "react";

const SECTIONS = [
  {
    id: "entreprise",
    emoji: "🏢",
    title: "Votre Entreprise",
    subtitle: "Informations générales",
    color: "#4EC9B0",
    questions: [
      { id: "nom", type: "text", label: "Nom de l'entreprise", placeholder: "Ex: Société ABC" },
      { id: "secteur", type: "text", label: "Secteur d'activité", placeholder: "Ex: Commerce, BTP, Services, Santé..." },
      { id: "pays", type: "select", label: "Pays / Ville", options: ["Brazzaville — Congo", "Pointe-Noire — Congo", "Paris — France", "Île-de-France", "Autre France", "Autre Afrique"] },
      { id: "effectif", type: "select", label: "Nombre d'employés", options: ["1 — 5 personnes", "6 — 20 personnes", "21 — 50 personnes", "51 — 100 personnes", "Plus de 100 personnes"] },
      { id: "ca", type: "select", label: "Chiffre d'affaires annuel (ordre de grandeur)", options: ["Moins de 50 000€ / 30M FCFA", "50 000 — 200 000€", "200 000 — 500 000€", "500 000 — 1M€", "Plus de 1M€", "Je préfère ne pas répondre"] },
      { id: "anciennete", type: "select", label: "Ancienneté de l'entreprise", options: ["Moins de 2 ans", "2 — 5 ans", "5 — 10 ans", "Plus de 10 ans"] },
    ]
  },
  {
    id: "dirigeant",
    emoji: "👤",
    title: "Le Dirigeant",
    subtitle: "Votre profil et vision",
    color: "#C9A84C",
    questions: [
      { id: "prenom_nom", type: "text", label: "Prénom et Nom", placeholder: "Ex: Jean Mouamba" },
      { id: "poste", type: "text", label: "Votre poste", placeholder: "Ex: Directeur Général, Gérant..." },
      { id: "email", type: "text", label: "Email professionnel", placeholder: "votre@email.com" },
      { id: "telephone", type: "text", label: "Téléphone / WhatsApp", placeholder: "+242 06 XXX XXXX" },
      { id: "niveau_digital_perso", type: "select", label: "Comment évaluez-vous votre propre aisance avec le digital ?", options: ["Débutant — j'utilise peu d'outils", "Intermédiaire — j'utilise les outils courants", "Avancé — je suis à l'aise avec la technologie", "Expert — je maîtrise les outils digitaux"] },
      { id: "objectif_principal", type: "textarea", label: "Quel est votre objectif principal en vous lançant dans cette démarche digitale ?", placeholder: "Ex: Attirer plus de clients, gagner du temps, moderniser mon image..." },
    ]
  },
  {
    id: "presence",
    emoji: "🌐",
    title: "Présence en Ligne",
    subtitle: "Votre visibilité digitale actuelle",
    color: "#7B5EA7",
    questions: [
      { id: "site_web", type: "select", label: "Avez-vous un site web ?", options: ["Oui, actif et à jour", "Oui, mais pas maintenu", "En cours de création", "Non"] },
      { id: "url_site", type: "text", label: "Si oui, URL du site web", placeholder: "www.votresite.com" },
      { id: "reseaux", type: "multicheck", label: "Sur quels réseaux sociaux êtes-vous présent ?", options: ["Facebook", "Instagram", "LinkedIn", "WhatsApp Business", "YouTube", "TikTok", "Aucun"] },
      { id: "frequence_publication", type: "select", label: "À quelle fréquence publiez-vous sur les réseaux ?", options: ["Tous les jours", "Plusieurs fois par semaine", "1 fois par semaine", "Rarement", "Jamais"] },
      { id: "google_my_business", type: "select", label: "Avez-vous une fiche Google My Business ?", options: ["Oui et elle est complète", "Oui mais pas optimisée", "Non"] },
    ]
  },
  {
    id: "outils",
    emoji: "🛠️",
    title: "Outils & Technologies",
    subtitle: "Ce que vous utilisez aujourd'hui",
    color: "#C0627A",
    questions: [
      { id: "email_pro", type: "select", label: "Utilisez-vous un email professionnel ?", options: ["Oui — Google Workspace", "Oui — Microsoft 365", "Oui — autre", "Non — Gmail/Yahoo personnel"] },
      { id: "stockage", type: "select", label: "Comment stockez-vous vos documents ?", options: ["Cloud — Google Drive / OneDrive", "Serveur interne", "Disque dur local", "Papier principalement"] },
      { id: "gestion_client", type: "select", label: "Comment gérez-vous vos clients et contacts ?", options: ["CRM (HubSpot, Salesforce...)", "Excel / Google Sheets", "Cahier ou papier", "Mémoire / téléphone"] },
      { id: "facturation", type: "select", label: "Comment gérez-vous la facturation ?", options: ["Logiciel dédié (Wave, Zoho...)", "Excel / Google Sheets", "Word / traitement de texte", "Papier"] },
      { id: "outils_collab", type: "multicheck", label: "Quels outils collaboratifs utilisez-vous ?", options: ["WhatsApp groupes", "Slack", "Teams", "Zoom / Meet", "Trello / Notion", "Aucun"] },
      { id: "ia_usage", type: "select", label: "Utilisez-vous l'intelligence artificielle dans votre travail ?", options: ["Oui régulièrement (ChatGPT, Claude...)", "Oui occasionnellement", "J'ai essayé une ou deux fois", "Non jamais"] },
    ]
  },
  {
    id: "processus",
    emoji: "⚙️",
    title: "Processus Internes",
    subtitle: "Comment fonctionne votre entreprise",
    color: "#4A7C59",
    questions: [
      { id: "taches_repetitives", type: "textarea", label: "Quelles sont les 3 tâches les plus répétitives dans votre entreprise ?", placeholder: "Ex: Relancer les clients impayés, préparer les devis, répondre aux mêmes questions clients..." },
      { id: "temps_admin", type: "select", label: "Combien de temps passez-vous sur des tâches administratives par semaine ?", options: ["Moins de 2h", "2 — 5h", "5 — 10h", "Plus de 10h"] },
      { id: "communication_interne", type: "select", label: "Comment communique votre équipe en interne ?", options: ["Outils pro (Slack, Teams)", "WhatsApp groupes", "Email", "À l'oral principalement"] },
      { id: "suivi_projets", type: "select", label: "Comment suivez-vous l'avancement de vos projets ?", options: ["Outil dédié (Trello, Asana...)", "Excel / Google Sheets", "Réunions orales", "Pas de suivi formalisé"] },
      { id: "satisfaction_client", type: "select", label: "Comment mesurez-vous la satisfaction de vos clients ?", options: ["Enquêtes en ligne", "Appels téléphoniques", "Avis Google / réseaux", "Pas de mesure formelle"] },
    ]
  },
  {
    id: "ambitions",
    emoji: "🚀",
    title: "Ambitions & Défis",
    subtitle: "Vos priorités pour la transformation",
    color: "#569CD6",
    questions: [
      { id: "defi_principal", type: "select", label: "Quel est votre principal défi digital aujourd'hui ?", options: ["Manque de visibilité en ligne", "Pas assez de clients via le digital", "Trop de temps perdu sur les tâches manuelles", "Équipe pas formée aux outils", "Pas de stratégie digitale claire", "Budget limité"] },
      { id: "priorite_6mois", type: "multicheck", label: "Quelles sont vos priorités pour les 6 prochains mois ?", options: ["Créer ou refaire le site web", "Développer les réseaux sociaux", "Automatiser des processus", "Former l'équipe au digital", "Mettre en place un CRM", "Intégrer l'IA", "Lancer des campagnes pub"] },
      { id: "budget_digital", type: "select", label: "Quel budget mensuel pouvez-vous allouer à la transformation digitale ?", options: ["Moins de 200€/mois", "200 — 500€/mois", "500 — 1 000€/mois", "1 000 — 2 000€/mois", "Plus de 2 000€/mois"] },
      { id: "delai_resultats", type: "select", label: "Dans quel délai souhaitez-vous voir des résultats concrets ?", options: ["1 — 3 mois", "3 — 6 mois", "6 mois — 1 an", "Je prends le temps qu'il faut"] },
      { id: "experience_conseil", type: "select", label: "Avez-vous déjà travaillé avec un consultant digital ?", options: ["Oui, bonne expérience", "Oui, expérience mitigée", "Non, c'est une première"] },
      { id: "message_libre", type: "textarea", label: "Y a-t-il quelque chose d'important que vous souhaitez partager avant notre rencontre ?", placeholder: "Contexte particulier, contraintes, attentes spécifiques, questions..." },
    ]
  }
];

export default function App() {
  const [sectionIdx, setSectionIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [checked, setChecked] = useState({});

  const section = SECTIONS[sectionIdx];
  const totalSections = SECTIONS.length;
  const progress = Math.round(((sectionIdx) / totalSections) * 100);

  const setAnswer = (id, val) => setAnswers(p => ({ ...p, [id]: val }));
  const toggleCheck = (qId, opt) => {
    const key = `${qId}_${opt}`;
    setChecked(p => ({ ...p, [key]: !p[key] }));
  };
  const isChecked = (qId, opt) => !!checked[`${qId}_${opt}`];

  const sectionComplete = () => section.questions.every(q => {
    if (q.type === "multicheck") return q.options.some(o => isChecked(q.id, o));
    if (q.id === "url_site" || q.id === "message_libre") return true;
    return answers[q.id] !== undefined && answers[q.id] !== "";
  });

  const BG = "radial-gradient(135deg, #0A1628 0%, #0d1f35 100%)";

  if (submitted) return (
    <div style={{ minHeight: "100vh", background: BG, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; }`}</style>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "24px" }}>🎉</div>
        <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "32px", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>Questionnaire envoyé !</h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.7, marginBottom: "32px" }}>
          Merci {answers["prenom_nom"] || ""} ! J'ai bien reçu vos réponses.<br />Je les analyse et vous contacte dans les <strong style={{ color: "#4EC9B0" }}>48 heures</strong> pour confirmer le programme de notre journée d'audit.
        </p>
        <div style={{ background: "rgba(78,201,176,0.08)", border: "1px solid rgba(78,201,176,0.2)", borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ color: "#4EC9B0", fontWeight: "600", marginBottom: "8px" }}>📅 Prochaine étape</p>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>Vous recevrez un email de confirmation avec le programme détaillé de votre journée d'audit.</p>
        </div>
        <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "13px" }}>relia.ebiya@gmail.com · nexali.ai</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', sans-serif", padding: "0" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,600;1,9..144,300&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, textarea, select { outline: none !important; }
        input:focus, textarea:focus, select:focus { border-color: rgba(78,201,176,0.6) !important; }
        .opt-btn:hover { border-color: rgba(255,255,255,0.2) !important; }
        .nav-btn:hover { opacity: 0.85; transform: translateY(-1px); }
        ::placeholder { color: rgba(255,255,255,0.2) !important; }
        select option { background: #0d1f35; color: white; }
      `}</style>

      {/* Top progress bar */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "rgba(10,22,40,0.95)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "12px 24px" }}>
        <div style={{ maxWidth: "620px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <span style={{ fontFamily: "'DM Sans', monospace", fontSize: "11px", letterSpacing: "2px", color: "rgba(201,168,76,0.8)", fontWeight: "600" }}>NEXALIE CONSULTING</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)" }}>Section {sectionIdx + 1} / {totalSections}</span>
          </div>
          <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${((sectionIdx + 1) / totalSections) * 100}%`, background: "linear-gradient(90deg, #4EC9B0, #C9A84C)", transition: "width 0.4s ease", borderRadius: "2px" }} />
          </div>
        </div>
      </div>

      <div style={{ maxWidth: "620px", margin: "0 auto", padding: "32px 20px 80px" }}>

        {/* Section header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <span style={{ fontSize: "28px" }}>{section.emoji}</span>
            <div>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "26px", fontWeight: 300, color: "#fff" }}>{section.title}</h2>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)", marginTop: "2px" }}>{section.subtitle}</p>
            </div>
          </div>
          <div style={{ height: "2px", background: `${section.color}40`, borderRadius: "1px" }} />
        </div>

        {/* Questions */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {section.questions.map((q) => (
            <div key={q.id}>
              <label style={{ display: "block", fontSize: "14px", color: "rgba(255,255,255,0.7)", marginBottom: "8px", fontWeight: "500", lineHeight: 1.5 }}>{q.label}</label>

              {q.type === "text" && (
                <input value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder={q.placeholder}
                  style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", transition: "border-color 0.2s" }} />
              )}

              {q.type === "textarea" && (
                <textarea value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)} placeholder={q.placeholder} rows={3}
                  style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "#fff", fontSize: "14px", resize: "vertical", transition: "border-color 0.2s", fontFamily: "'DM Sans', sans-serif" }} />
              )}

              {q.type === "select" && (
                <select value={answers[q.id] || ""} onChange={e => setAnswer(q.id, e.target.value)}
                  style={{ width: "100%", padding: "13px 16px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: answers[q.id] ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "14px", cursor: "pointer", transition: "border-color 0.2s", appearance: "none" }}>
                  <option value="" disabled>Sélectionner...</option>
                  {q.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              )}

              {q.type === "multicheck" && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {q.options.map(opt => (
                    <button key={opt} className="opt-btn" onClick={() => toggleCheck(q.id, opt)}
                      style={{ padding: "8px 14px", borderRadius: "8px", border: `1px solid ${isChecked(q.id, opt) ? section.color : "rgba(255,255,255,0.1)"}`, background: isChecked(q.id, opt) ? `${section.color}20` : "transparent", color: isChecked(q.id, opt) ? section.color : "rgba(255,255,255,0.45)", fontSize: "13px", cursor: "pointer", transition: "all 0.15s", fontWeight: isChecked(q.id, opt) ? "600" : "400" }}>
                      {isChecked(q.id, opt) ? "✓ " : ""}{opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Section dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "40px", marginBottom: "24px" }}>
          {SECTIONS.map((s, i) => (
            <div key={i} style={{ width: i === sectionIdx ? "24px" : "8px", height: "8px", borderRadius: "4px", background: i < sectionIdx ? "#4EC9B0" : i === sectionIdx ? section.color : "rgba(255,255,255,0.1)", transition: "all 0.3s" }} />
          ))}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "12px" }}>
          {sectionIdx > 0 && (
            <button className="nav-btn" onClick={() => setSectionIdx(s => s - 1)}
              style={{ flex: 1, padding: "14px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", color: "rgba(255,255,255,0.4)", fontSize: "14px", cursor: "pointer", transition: "all 0.2s" }}>
              ← Précédent
            </button>
          )}
          {sectionIdx < totalSections - 1 ? (
            <button className="nav-btn" onClick={() => sectionComplete() && setSectionIdx(s => s + 1)}
              style={{ flex: 2, padding: "14px", background: sectionComplete() ? section.color : "rgba(255,255,255,0.05)", border: "none", borderRadius: "10px", color: sectionComplete() ? "#0A1628" : "rgba(255,255,255,0.2)", fontSize: "14px", fontWeight: "600", cursor: sectionComplete() ? "pointer" : "default", transition: "all 0.2s" }}>
              Section suivante →
            </button>
          ) : (
            <button className="nav-btn" onClick={() => setSubmitted(true)}
              style={{ flex: 2, padding: "14px", background: "#4EC9B0", border: "none", borderRadius: "10px", color: "#0A1628", fontSize: "14px", fontWeight: "700", cursor: "pointer", transition: "all 0.2s" }}>
              Envoyer le questionnaire ✓
            </button>
          )}
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.15)", marginTop: "16px" }}>
          Vos réponses sont confidentielles · nexali.ai
        </p>
      </div>
    </div>
  );
}
