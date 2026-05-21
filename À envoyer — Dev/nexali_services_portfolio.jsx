import { useState } from "react";

const SERVICES_WEB = [
  {
    id: "vitrine",
    emoji: "🌐",
    title: "Site Web Vitrine",
    desc: "Votre présence professionnelle en ligne. Un site élégant, rapide et mobile-friendly qui inspire confiance dès le premier regard.",
    details: ["5 pages personnalisées", "Design sur mesure", "Mobile-friendly", "Google Analytics", "Formulaire de contact", "SEO de base inclus"],
    fr: "1 200 — 1 800€",
    cg: "600 — 1 000€",
    delay: "2-3 semaines",
    color: "#4EC9B0",
  },
  {
    id: "onepage",
    emoji: "📄",
    title: "One-Page",
    desc: "Tout l'essentiel sur une seule page. Idéal pour lancer rapidement, tester une idée ou présenter une offre spécifique.",
    details: ["1 page longue complète", "Sections Hero, Services, Contact", "Mobile-friendly", "Google Analytics", "Livraison rapide", "Idéal pour les startups"],
    fr: "400 — 600€",
    cg: "200 — 350€",
    delay: "5-7 jours",
    color: "#C9A84C",
    badge: "⚡ RAPIDE",
  },
  {
    id: "ecommerce",
    emoji: "🛒",
    title: "Site E-Commerce",
    desc: "Vendez en ligne 24h/24. Une boutique professionnelle avec paiement sécurisé, gestion des produits et suivi des commandes.",
    details: ["Catalogue produits illimité", "Paiement sécurisé (Stripe)", "Mobile Money (Congo)", "Tableau de bord vendeur", "Emails automatiques", "Formation incluse"],
    fr: "2 500 — 4 000€",
    cg: "1 200 — 2 000€",
    delay: "4-6 semaines",
    color: "#C586C0",
  },
  {
    id: "landing",
    emoji: "🎯",
    title: "Landing Page",
    desc: "Une page optimisée pour convertir. Pour lancer un produit, capturer des leads ou promouvoir un événement.",
    details: ["Design orienté conversion", "Formulaire de capture", "A/B testing possible", "Intégration newsletter", "Analytics avancés", "CTA optimisés"],
    fr: "600 — 900€",
    cg: "300 — 500€",
    delay: "1 semaine",
    color: "#CE9178",
  },
  {
    id: "refonte",
    emoji: "🔄",
    title: "Refonte de Site",
    desc: "Votre site existe mais il vieillit mal ? On lui donne une seconde vie — nouveau design, nouvelle performance, nouveau SEO.",
    details: ["Audit complet du site actuel", "Nouveau design moderne", "Migration des contenus", "Optimisation vitesse", "SEO revu et corrigé", "Formation mise à jour"],
    fr: "800 — 1 500€",
    cg: "400 — 800€",
    delay: "2-3 semaines",
    color: "#569CD6",
  },
  {
    id: "identite",
    emoji: "🎨",
    title: "Identité Visuelle",
    desc: "Logo, couleurs, typographie, charte graphique. Tout ce qu'il faut pour que votre marque soit reconnaissable et mémorable.",
    details: ["Logo (3 propositions)", "Palette de couleurs", "Typographie choisie", "Charte graphique PDF", "Fichiers sources (AI, PNG, SVG)", "Guide d'utilisation"],
    fr: "500 — 900€",
    cg: "300 — 500€",
    delay: "1-2 semaines",
    color: "#4A7C59",
  },
  {
    id: "maintenance",
    emoji: "🛠️",
    title: "Maintenance Mensuelle",
    desc: "Votre site est vivant — il a besoin d'attention. Mises à jour, sauvegardes, modifications de contenu, support réactif.",
    details: ["Mises à jour WordPress", "Sauvegardes hebdomadaires", "2h de modifications/mois", "Support WhatsApp", "Rapport mensuel", "Surveillance sécurité"],
    fr: "80 — 150€/mois",
    cg: "50 — 80€/mois",
    delay: "Engagement 3 mois min",
    color: "#7B5EA7",
    badge: "🔁 RÉCURRENT",
  },
];

const PORTFOLIO = [
  {
    id: 1,
    title: "WEAREEYWA — Agence Digitale",
    type: "Site vitrine",
    sector: "Agence",
    country: "🇫🇷",
    desc: "Site vitrine de l'agence fondée par Relia — présentation des services, portfolio clients, formulaire de contact.",
    tags: ["WordPress", "Design", "SEO"],
    color: "#4EC9B0",
    year: "2022",
  },
  {
    id: 2,
    title: "Restaurant Le Saveur",
    type: "One-Page",
    sector: "Restauration",
    country: "🇨🇬",
    desc: "Page unique élégante pour un restaurant traditionnel congolais — menu, réservation en ligne, galerie photo.",
    tags: ["WordPress", "One-Page", "Réservation"],
    color: "#C9A84C",
    year: "2023",
  },
  {
    id: 3,
    title: "Cabinet Médical Espoir",
    type: "Site vitrine",
    sector: "Santé",
    country: "🇨🇬",
    desc: "Site professionnel pour un cabinet médical — présentation de l'équipe, prise de rendez-vous, informations patients.",
    tags: ["WordPress", "Santé", "RDV en ligne"],
    color: "#C586C0",
    year: "2023",
  },
  {
    id: 4,
    title: "BTP Congo SARL",
    type: "Site vitrine",
    sector: "BTP",
    country: "🇨🇬",
    desc: "Site institutionnel pour une entreprise de construction — références projets, appels d'offres, contact.",
    tags: ["WordPress", "BTP", "Galerie projets"],
    color: "#569CD6",
    year: "2024",
  },
  {
    id: 5,
    title: "Boutique Mode Élégance",
    type: "E-commerce",
    sector: "Mode",
    country: "🇫🇷",
    desc: "Boutique en ligne pour une créatrice de mode — catalogue, paiement sécurisé, suivi commandes.",
    tags: ["WooCommerce", "Stripe", "Mode"],
    color: "#CE9178",
    year: "2024",
  },
  {
    id: 6,
    title: "Formation Pro Digital",
    type: "Landing Page",
    sector: "Formation",
    country: "🇫🇷",
    desc: "Landing page haute conversion pour une formation en ligne — témoignages, programme, inscription.",
    tags: ["Landing Page", "Conversion", "Formation"],
    color: "#4A7C59",
    year: "2025",
  },
];

const PROCESS = [
  { step: "01", title: "Découverte", desc: "On échange sur votre projet, vos objectifs et votre cible. Je vous pose les bonnes questions.", icon: "💬", color: "#4EC9B0" },
  { step: "02", title: "Devis & Validation", desc: "Je vous envoie un devis détaillé sous 24h. On valide ensemble avant de commencer.", icon: "📋", color: "#C9A84C" },
  { step: "03", title: "Design & Développement", desc: "Je crée votre site selon vos préférences. Vous validez à chaque étape clé.", icon: "🎨", color: "#C586C0" },
  { step: "04", title: "Livraison & Formation", desc: "Je vous livre le site et vous forme à la mise à jour en toute autonomie.", icon: "🚀", color: "#7B5EA7" },
];

export default function App() {
  const [activePage, setActivePage] = useState("services");
  const [selectedService, setSelectedService] = useState(null);
  const [priceMode, setPriceMode] = useState("fr");
  const [activeFilter, setActiveFilter] = useState("Tous");

  const filters = ["Tous", "France", "Congo", "Site vitrine", "E-commerce", "One-Page", "Landing Page"];

  const filteredPortfolio = PORTFOLIO.filter(p => {
    if (activeFilter === "Tous") return true;
    if (activeFilter === "France") return p.country === "🇫🇷";
    if (activeFilter === "Congo") return p.country === "🇨🇬";
    return p.type === activeFilter;
  });

  const BG = "#070e1c";

  return (
    <div style={{ minHeight: "100vh", background: BG, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,300;1,9..144,300&family=IBM+Plex+Mono:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .fade-up { animation: fadeUp 0.5s ease forwards; }
        .service-card:hover { border-color: rgba(255,255,255,0.15) !important; transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.4) !important; }
        .portfolio-card:hover { transform: translateY(-3px); box-shadow: 0 12px 30px rgba(0,0,0,0.4) !important; }
        .filter-btn:hover { background: rgba(255,255,255,0.06) !important; }
      `}</style>

      {/* Sub-nav */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px", background: "rgba(7,14,28,0.95)", backdropFilter: "blur(10px)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", gap: "0" }}>
          {[["services", "Services Web"], ["portfolio", "Portfolio"], ["process", "Notre Processus"]].map(([id, label]) => (
            <button key={id} onClick={() => setActivePage(id)}
              style={{ padding: "16px 20px", background: "none", border: "none", borderBottom: `2px solid ${activePage === id ? "#4EC9B0" : "transparent"}`, color: activePage === id ? "#fff" : "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s", fontWeight: activePage === id ? "600" : "400" }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "48px 24px" }}>

        {/* ═══ SERVICES WEB ═══ */}
        {activePage === "services" && (
          <div className="fade-up">
            {/* Header */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "40px", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(201,168,76,0.8)", marginBottom: "8px" }}>CRÉATION WEB & IDENTITÉ DIGITALE</p>
                <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>
                  Votre site web,<br /><em style={{ color: "#4EC9B0" }}>livré en quelques jours</em>
                </h1>
                <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "480px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                  Sites WordPress professionnels adaptés à votre budget et votre marché — France ou Congo.
                </p>
              </div>
              {/* Prix toggle */}
              <div style={{ display: "flex", gap: "0", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", overflow: "hidden" }}>
                {[["fr", "🇫🇷 France"], ["cg", "🇨🇬 Congo"]].map(([id, label]) => (
                  <button key={id} onClick={() => setPriceMode(id)}
                    style={{ padding: "10px 20px", background: priceMode === id ? "#4EC9B0" : "transparent", border: "none", color: priceMode === id ? "#070e1c" : "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: priceMode === id ? "700" : "400", cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all 0.2s" }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Services grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "48px" }}>
              {SERVICES_WEB.map(s => (
                <div key={s.id} className="service-card"
                  onClick={() => setSelectedService(selectedService?.id === s.id ? null : s)}
                  style={{ padding: "24px", background: "rgba(255,255,255,0.02)", border: `1px solid ${selectedService?.id === s.id ? s.color + "50" : s.color + "20"}`, borderRadius: "16px", cursor: "pointer", transition: "all 0.3s", position: "relative", background: selectedService?.id === s.id ? `${s.color}06` : "rgba(255,255,255,0.02)" }}>
                  {s.badge && <div style={{ position: "absolute", top: "-10px", right: "16px", background: s.color, padding: "3px 10px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", color: "#070e1c", fontFamily: "'IBM Plex Mono', monospace" }}>{s.badge}</div>}

                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ fontSize: "24px" }}>{s.emoji}</span>
                      <div>
                        <p style={{ fontFamily: "'Fraunces', serif", fontSize: "18px", color: "#fff", fontWeight: 400 }}>{s.title}</p>
                        <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "rgba(255,255,255,0.3)" }}>⏱ {s.delay}</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontFamily: "'Fraunces', serif", fontSize: "20px", color: s.color }}>{priceMode === "fr" ? s.fr : s.cg}</p>
                      <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.3)", fontFamily: "'IBM Plex Mono', monospace" }}>{priceMode === "fr" ? "France" : "Congo"}</p>
                    </div>
                  </div>

                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>{s.desc}</p>

                  {selectedService?.id === s.id && (
                    <div style={{ borderTop: `1px solid ${s.color}25`, paddingTop: "14px" }}>
                      <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: s.color, letterSpacing: "1px", marginBottom: "8px" }}>INCLUS DANS CE PACK</p>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5px" }}>
                        {s.details.map((d, i) => (
                          <div key={i} style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                            <span style={{ color: s.color, fontSize: "11px" }}>✓</span>
                            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", fontFamily: "'DM Sans', sans-serif" }}>{d}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
                        <button style={{ flex: 1, padding: "10px", background: s.color, border: "none", borderRadius: "8px", color: "#070e1c", fontSize: "12px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                          Demander un devis →
                        </button>
                        <button style={{ padding: "10px 16px", background: "transparent", border: `1px solid ${s.color}40`, borderRadius: "8px", color: s.color, fontSize: "12px", cursor: "pointer", fontFamily: "'IBM Plex Mono', monospace" }}>
                          Maquette IA
                        </button>
                      </div>
                    </div>
                  )}

                  {selectedService?.id !== s.id && (
                    <div style={{ display: "flex", justifyContent: "flex-end" }}>
                      <span style={{ fontSize: "12px", color: s.color, fontFamily: "'IBM Plex Mono', monospace" }}>Voir le détail →</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Comparaison France / Congo */}
            <div style={{ padding: "28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", marginBottom: "32px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "16px" }}>COMPARATIF TARIFAIRE FRANCE / CONGO</p>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr>
                      {["Service", "🇫🇷 France", "🇨🇬 Congo", "Délai"].map((h, i) => (
                        <th key={h} style={{ padding: "10px 14px", textAlign: i === 0 ? "left" : "center", fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "1px", color: "rgba(255,255,255,0.3)", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {SERVICES_WEB.map((s, i) => (
                      <tr key={s.id} style={{ background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.02)" }}>
                        <td style={{ padding: "10px 14px", fontSize: "13px", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{s.emoji} {s.title}</td>
                        <td style={{ padding: "10px 14px", textAlign: "center", fontSize: "13px", color: "#4EC9B0", fontFamily: "'Fraunces', serif" }}>{s.fr}</td>
                        <td style={{ padding: "10px 14px", textAlign: "center", fontSize: "13px", color: "#C9A84C", fontFamily: "'Fraunces', serif" }}>{s.cg}</td>
                        <td style={{ padding: "10px 14px", textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.4)", fontFamily: "'IBM Plex Mono', monospace" }}>{s.delay}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CTA */}
            <div style={{ textAlign: "center", padding: "40px 24px", background: "radial-gradient(ellipse at center, rgba(78,201,176,0.08) 0%, transparent 70%)", borderRadius: "20px", border: "1px solid rgba(78,201,176,0.15)" }}>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: "28px", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>Pas sûr de ce qu'il vous faut ?</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", marginBottom: "24px", fontFamily: "'DM Sans', sans-serif" }}>Essayez notre générateur de maquette IA — il visualise votre futur site en 2 minutes.</p>
              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <button style={{ padding: "13px 28px", background: "#4EC9B0", border: "none", borderRadius: "10px", color: "#070e1c", fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  🤖 Générer ma maquette
                </button>
                <button style={{ padding: "13px 28px", background: "transparent", border: "1px solid rgba(255,255,255,0.15)", borderRadius: "10px", color: "rgba(255,255,255,0.6)", fontSize: "14px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif" }}>
                  Demander un devis gratuit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ PORTFOLIO ═══ */}
        {activePage === "portfolio" && (
          <div className="fade-up">
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(201,168,76,0.8)", marginBottom: "8px" }}>NOS RÉALISATIONS</p>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>
                Sites livrés,<br /><em style={{ color: "#4EC9B0" }}>clients satisfaits</em>
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "480px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                De Brazzaville à Paris — des sites qui représentent vraiment nos clients.
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
              {filters.map(f => (
                <button key={f} className="filter-btn" onClick={() => setActiveFilter(f)}
                  style={{ padding: "8px 16px", borderRadius: "8px", border: `1px solid ${activeFilter === f ? "#4EC9B0" : "rgba(255,255,255,0.08)"}`, background: activeFilter === f ? "rgba(78,201,176,0.12)" : "rgba(255,255,255,0.02)", color: activeFilter === f ? "#4EC9B0" : "rgba(255,255,255,0.4)", fontSize: "12px", cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif", fontWeight: activeFilter === f ? "600" : "400" }}>
                  {f}
                </button>
              ))}
            </div>

            {/* Portfolio grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "48px" }}>
              {filteredPortfolio.map(p => (
                <div key={p.id} className="portfolio-card"
                  style={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${p.color}25`, transition: "all 0.3s", cursor: "pointer" }}>
                  {/* Mockup visuel */}
                  <div style={{ height: "160px", background: `linear-gradient(135deg, #0A1628 0%, ${p.color}20 100%)`, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", borderBottom: `1px solid ${p.color}20` }}>
                    {/* Browser mini */}
                    <div style={{ width: "85%", background: "rgba(0,0,0,0.4)", borderRadius: "8px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.1)" }}>
                      <div style={{ background: "#111", padding: "6px 10px", display: "flex", gap: "4px", alignItems: "center" }}>
                        {["#FF5F57","#FFBD2E","#28CA41"].map(c => <div key={c} style={{ width: "6px", height: "6px", borderRadius: "50%", background: c }} />)}
                        <div style={{ flex: 1, background: "#222", borderRadius: "3px", height: "10px", marginLeft: "6px" }} />
                      </div>
                      <div style={{ padding: "10px", background: "#0d1f35" }}>
                        <div style={{ height: "6px", background: p.color, borderRadius: "3px", width: "60%", marginBottom: "6px", opacity: 0.8 }} />
                        <div style={{ height: "4px", background: "rgba(255,255,255,0.1)", borderRadius: "2px", width: "90%", marginBottom: "4px" }} />
                        <div style={{ height: "4px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", width: "70%", marginBottom: "8px" }} />
                        <div style={{ display: "flex", gap: "6px" }}>
                          {[40, 35, 45].map((w, i) => <div key={i} style={{ height: "28px", background: `${p.color}${i === 0 ? "30" : "15"}`, borderRadius: "4px", flex: w }} />)}
                        </div>
                      </div>
                    </div>
                    <div style={{ position: "absolute", top: "10px", right: "10px", background: `${p.color}20`, border: `1px solid ${p.color}40`, padding: "3px 8px", borderRadius: "6px" }}>
                      <span style={{ fontSize: "10px", color: p.color, fontFamily: "'IBM Plex Mono', monospace" }}>{p.type}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div style={{ padding: "16px", background: "rgba(255,255,255,0.02)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <p style={{ fontFamily: "'Fraunces', serif", fontSize: "15px", color: "#fff", fontWeight: 400, lineHeight: 1.3 }}>{p.title}</p>
                      <span style={{ fontSize: "16px", flexShrink: 0, marginLeft: "8px" }}>{p.country}</span>
                    </div>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", lineHeight: 1.5, marginBottom: "12px", fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</p>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
                      {p.tags.map(tag => (
                        <span key={tag} style={{ padding: "3px 8px", background: `${p.color}15`, color: p.color, fontSize: "10px", borderRadius: "6px", fontFamily: "'IBM Plex Mono', monospace" }}>{tag}</span>
                      ))}
                      <span style={{ marginLeft: "auto", fontSize: "10px", color: "rgba(255,255,255,0.2)", fontFamily: "'IBM Plex Mono', monospace" }}>{p.year}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Témoignages */}
            <div style={{ marginBottom: "40px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "20px" }}>CE QUE DISENT NOS CLIENTS</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                {[
                  { text: "Relia a transformé notre image en ligne. Notre restaurant est maintenant trouvé sur Google et nos réservations ont doublé.", name: "Jean-Marc K.", role: "Restaurant Le Saveur, Brazzaville", color: "#4EC9B0" },
                  { text: "Site livré en une semaine, exactement comme je le voulais. Elle a tout compris dès le premier échange.", name: "Sophie M.", role: "Consultante RH, Paris", color: "#C9A84C" },
                  { text: "Enfin un site qui nous ressemble vraiment. Professionnel, rapide, et Relia nous a formés à le gérer seuls.", name: "Dr. Espoir N.", role: "Cabinet Médical, Brazzaville", color: "#C586C0" },
                ].map((t, i) => (
                  <div key={i} style={{ padding: "20px", background: `${t.color}08`, border: `1px solid ${t.color}20`, borderRadius: "14px" }}>
                    <p style={{ fontSize: "20px", color: t.color, marginBottom: "10px" }}>❝</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "14px", fontFamily: "'DM Sans', sans-serif", fontStyle: "italic" }}>{t.text}</p>
                    <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                      <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: t.color, opacity: 0.8 }} />
                      <div>
                        <p style={{ fontSize: "12px", fontWeight: "600", color: "#fff", fontFamily: "'DM Sans', sans-serif" }}>{t.name}</p>
                        <p style={{ fontSize: "10px", color: t.color, fontFamily: "'IBM Plex Mono', monospace" }}>{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ═══ PROCESS ═══ */}
        {activePage === "process" && (
          <div className="fade-up">
            <div style={{ marginBottom: "48px" }}>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(201,168,76,0.8)", marginBottom: "8px" }}>COMMENT ÇA SE PASSE</p>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: "clamp(28px, 4vw, 44px)", fontWeight: 300, color: "#fff", marginBottom: "8px" }}>
                Simple, transparent,<br /><em style={{ color: "#4EC9B0" }}>sans surprise</em>
              </h1>
              <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.4)", maxWidth: "480px", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>
                Du premier échange à la livraison finale — voilà comment on travaille ensemble.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginBottom: "48px" }}>
              {PROCESS.map((p, i) => (
                <div key={p.step} style={{ display: "flex", gap: "24px", alignItems: "flex-start", position: "relative" }}>
                  {i < PROCESS.length - 1 && (
                    <div style={{ position: "absolute", left: "27px", top: "60px", width: "2px", height: "calc(100% - 20px)", background: `linear-gradient(${p.color}, ${PROCESS[i+1].color}40)`, zIndex: 0 }} />
                  )}
                  <div style={{ flexShrink: 0, width: "56px", height: "56px", borderRadius: "50%", background: `${p.color}15`, border: `2px solid ${p.color}`, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, position: "relative" }}>
                    <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "13px", fontWeight: "500", color: p.color }}>{p.step}</span>
                  </div>
                  <div style={{ paddingBottom: "40px", flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                      <span style={{ fontSize: "20px" }}>{p.icon}</span>
                      <h3 style={{ fontFamily: "'Fraunces', serif", fontSize: "22px", color: "#fff", fontWeight: 400 }}>{p.title}</h3>
                    </div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "500px", fontFamily: "'DM Sans', sans-serif" }}>{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ */}
            <div>
              <p style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.25)", marginBottom: "20px" }}>QUESTIONS FRÉQUENTES</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  ["Avez-vous besoin que je sois disponible tout le temps ?", "Non. On échange 2 à 3 fois pendant le projet — pour le brief, pour valider le design, et pour la livraison. Le reste je gère en autonomie."],
                  ["Puis-je modifier mon site après livraison ?", "Oui ! Je vous forme à WordPress lors de la livraison. Pour les modifications complexes, je propose un forfait maintenance mensuel."],
                  ["Est-ce que vous travaillez avec des clients à distance au Congo ?", "Absolument — 100% de mes clients Congo sont suivis à distance via Zoom et WhatsApp. Aucun déplacement nécessaire pour démarrer."],
                  ["Combien de temps avant d'avoir mon site en ligne ?", "Une one-page en 5-7 jours. Un site vitrine en 2-3 semaines. Un e-commerce en 4-6 semaines. Ce sont des délais réalistes, pas des promesses marketing."],
                  ["Et si le résultat ne me convient pas ?", "On travaille avec des validations à chaque étape. Vous approuvez avant qu'on passe à la suivante. Pas de mauvaise surprise à la livraison."],
                ].map(([q, a], i) => (
                  <div key={i} style={{ padding: "18px 20px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                    <p style={{ fontSize: "14px", fontWeight: "600", color: "#fff", marginBottom: "8px", fontFamily: "'DM Sans', sans-serif" }}>❓ {q}</p>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
