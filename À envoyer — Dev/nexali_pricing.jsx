import { useState } from "react";

// ═══════════════════════════════════════════
// CONFIG
// ═══════════════════════════════════════════

const TEAL = "#4EC9B0"; const GOLD = "#C9A84C"; const PURPLE = "#7B5EA7";
const CORAL = "#C0627A"; const SAGE = "#4A7C59"; const NAVY = "#0A1628";

const PLANS = [
  {
    id: "free",
    name: "Gratuit",
    emoji: "🌱",
    price: { monthly: 0, annual: 0 },
    color: TEAL,
    desc: "Pour découvrir Nexalie et évaluer votre maturité digitale.",
    cta: "Commencer gratuitement",
    ctaStyle: "outline",
    features: [
      { text: "Audit de maturité digitale", included: true },
      { text: "Calculateur ROI digital", included: true },
      { text: "Générateur de maquette IA (3/mois)", included: true },
      { text: "Questionnaire pré-audit", included: true },
      { text: "Accès aux articles du blog", included: true },
      { text: "Générateur de business plan", included: false },
      { text: "Roadmap digitale 12 mois", included: false },
      { text: "Cartographie des processus", included: false },
      { text: "Cahier des charges détaillé", included: false },
      { text: "Simulateur de budget projet", included: false },
      { text: "Veille concurrentielle", included: false },
      { text: "Export PDF des résultats", included: false },
      { text: "Support prioritaire", included: false },
    ]
  },
  {
    id: "premium",
    name: "Premium",
    emoji: "🚀",
    price: { monthly: 29, annual: 249 },
    color: GOLD,
    badge: "POPULAIRE",
    desc: "Accès complet à tous les outils IA pour transformer votre entreprise.",
    cta: "Passer Premium",
    ctaStyle: "filled",
    features: [
      { text: "Audit de maturité digitale", included: true },
      { text: "Calculateur ROI digital", included: true },
      { text: "Générateur de maquette IA (illimité)", included: true },
      { text: "Questionnaire pré-audit", included: true },
      { text: "Accès aux articles du blog", included: true },
      { text: "Générateur de business plan IA", included: true },
      { text: "Roadmap digitale 12 mois", included: true },
      { text: "Cartographie des processus", included: true },
      { text: "Cahier des charges détaillé", included: true },
      { text: "Simulateur de budget projet", included: true },
      { text: "Veille concurrentielle IA", included: true },
      { text: "Export PDF des résultats", included: true },
      { text: "Support prioritaire WhatsApp", included: true },
    ]
  },
  {
    id: "consulting",
    name: "Accompagnement",
    emoji: "🌟",
    price: { monthly: 400, annual: null },
    color: PURPLE,
    desc: "Un accompagnement personnalisé avec Relia, en plus de la plateforme.",
    cta: "Prendre rendez-vous",
    ctaStyle: "outline",
    features: [
      { text: "Tout le plan Premium inclus", included: true },
      { text: "Audit initial personnalisé", included: true },
      { text: "Sessions mensuelles (Zoom)", included: true },
      { text: "Rapport mensuel personnalisé", included: true },
      { text: "Roadmap sur mesure", included: true },
      { text: "Accès WhatsApp direct Relia", included: true },
      { text: "Déplacements Congo/France possibles", included: true },
      { text: "Réseau partenaires Nexalie", included: true },
      { text: "À partir du Pack Démarrage (400€/mois)", included: true, note: true },
    ]
  }
];

const FAQ = [
  { q: "Puis-je annuler mon abonnement à tout moment ?", a: "Oui, vous pouvez annuler quand vous voulez depuis votre espace client. L'accès premium reste actif jusqu'à la fin de la période payée." },
  { q: "Y a-t-il une période d'essai ?", a: "Le plan gratuit vous donne accès à plusieurs outils essentiels sans limite de temps. C'est votre période d'essai permanente." },
  { q: "Comment fonctionne le paiement ?", a: "Le paiement est sécurisé via Stripe — la référence mondiale. Carte bancaire, Apple Pay ou Google Pay acceptés." },
  { q: "Les tarifs sont-ils différents pour l'Afrique ?", a: "Oui ! Pour les clients basés en Afrique, des tarifs adaptés sont disponibles. Contactez-nous directement sur WhatsApp." },
  { q: "Puis-je passer du plan gratuit au premium ?", a: "Oui, à tout moment. Vos données et résultats sont conservés lors du passage au premium." },
  { q: "L'accompagnement consulting est-il disponible à distance ?", a: "Oui, 100% à distance via Zoom et WhatsApp. Des déplacements au Congo ou en France sont possibles sur demande." },
];

// ═══════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════

function Nav({ page, setPage }) {
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(7,14,28,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "58px" }}>
        <button onClick={() => setPage("pricing")} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#fff" }}>Nexalie</span>
          <span style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: GOLD }}>CONSULTING</span>
        </button>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          {[["pricing","Tarifs"],["platform","Plateforme"],["contact","Contact"]].map(([id, label]) => (
            <button key={id} onClick={() => setPage(id)} style={{ padding: "7px 14px", background: "none", border: "none", cursor: "pointer", fontSize: "13px", color: page === id ? "#fff" : "rgba(255,255,255,0.4)", fontFamily: "sans-serif", borderBottom: `2px solid ${page === id ? TEAL : "transparent"}`, transition: "all 0.2s" }}>{label}</button>
          ))}
          <button onClick={() => setPage("signup")} style={{ padding: "8px 18px", background: TEAL, border: "none", borderRadius: "8px", color: NAVY, fontSize: "13px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", marginLeft: "8px" }}>Démarrer →</button>
        </div>
      </div>
    </nav>
  );
}

// ═══════════════════════════════════════════
// PAGES
// ═══════════════════════════════════════════

function PricingPage({ onSelect }) {
  const [billing, setBilling] = useState("monthly");
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div style={{ minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ padding: "64px 24px 48px", textAlign: "center" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: `${GOLD}12`, border: `1px solid ${GOLD}30`, borderRadius: "20px", padding: "5px 16px", marginBottom: "20px" }}>
          <span style={{ fontSize: "12px" }}>✨</span>
          <span style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: GOLD }}>PLATEFORME SaaS NEXALIE</span>
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>
          Des outils IA pour<br /><em style={{ color: TEAL }}>transformer votre business</em>
        </h1>
        <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.45)", maxWidth: "500px", margin: "0 auto 28px", fontFamily: "sans-serif", lineHeight: 1.7 }}>
          Commencez gratuitement. Passez premium quand vous êtes prêt.
        </p>

        {/* Billing toggle */}
        <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", overflow: "hidden", marginBottom: "48px" }}>
          {[["monthly","Mensuel"], ["annual","Annuel"]].map(([id, label]) => (
            <button key={id} onClick={() => setBilling(id)}
              style={{ padding: "10px 24px", background: billing === id ? TEAL : "transparent", border: "none", color: billing === id ? NAVY : "rgba(255,255,255,0.4)", fontSize: "13px", fontWeight: billing === id ? "700" : "400", cursor: "pointer", fontFamily: "sans-serif", transition: "all 0.2s", display: "flex", alignItems: "center", gap: "6px" }}>
              {label}
              {id === "annual" && <span style={{ padding: "2px 8px", background: billing === "annual" ? NAVY : `${GOLD}20`, color: billing === "annual" ? GOLD : GOLD, borderRadius: "10px", fontSize: "10px", fontWeight: "700", fontFamily: "monospace" }}>-28%</span>}
            </button>
          ))}
        </div>

        {/* Plans */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", maxWidth: "1000px", margin: "0 auto 64px", alignItems: "start" }}>
          {PLANS.map((plan, idx) => (
            <div key={plan.id} style={{ padding: "28px 24px", background: idx === 1 ? `${plan.color}08` : "rgba(255,255,255,0.02)", border: `1px solid ${idx === 1 ? plan.color + "40" : "rgba(255,255,255,0.08)"}`, borderRadius: "20px", position: "relative", transition: "all 0.3s", transform: idx === 1 ? "scale(1.02)" : "scale(1)" }}>
              {plan.badge && (
                <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: plan.color, padding: "4px 16px", borderRadius: "20px", fontSize: "10px", fontWeight: "700", color: NAVY, fontFamily: "monospace", whiteSpace: "nowrap" }}>
                  {plan.badge}
                </div>
              )}

              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <p style={{ fontSize: "28px", marginBottom: "6px" }}>{plan.emoji}</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#fff", marginBottom: "6px" }}>{plan.name}</p>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", lineHeight: 1.5 }}>{plan.desc}</p>
              </div>

              {/* Price */}
              <div style={{ textAlign: "center", marginBottom: "24px", padding: "16px", background: `${plan.color}08`, borderRadius: "12px" }}>
                {plan.id === "consulting" ? (
                  <div>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: plan.color }}>Sur devis</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>Dès 400€/mois</p>
                  </div>
                ) : plan.price.monthly === 0 ? (
                  <div>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: plan.color }}>Gratuit</p>
                    <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>Pour toujours</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: "4px" }}>
                      <p style={{ fontFamily: "Georgia, serif", fontSize: "42px", color: plan.color }}>
                        {billing === "annual" ? Math.round(plan.price.annual / 12) : plan.price.monthly}€
                      </p>
                      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>/mois</p>
                    </div>
                    {billing === "annual" && (
                      <p style={{ fontSize: "12px", color: plan.color, fontFamily: "monospace" }}>
                        Facturé {plan.price.annual}€/an · 2 mois offerts
                      </p>
                    )}
                    {billing === "monthly" && (
                      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>
                        ou {plan.price.annual}€/an (-28%)
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* CTA */}
              <button onClick={() => onSelect(plan.id, billing)}
                style={{ width: "100%", padding: "13px", background: plan.ctaStyle === "filled" ? plan.color : "transparent", border: `1px solid ${plan.color}`, borderRadius: "10px", color: plan.ctaStyle === "filled" ? NAVY : plan.color, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", marginBottom: "20px", transition: "all 0.2s" }}>
                {plan.cta} →
              </button>

              {/* Features */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {plan.features.map((f, i) => (
                  <div key={i} style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
                    <span style={{ fontSize: "12px", color: f.included ? SAGE : "rgba(255,255,255,0.15)", flexShrink: 0, marginTop: "2px" }}>{f.included ? "✓" : "✕"}</span>
                    <span style={{ fontSize: "12px", color: f.included ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.2)", fontFamily: "sans-serif", lineHeight: 1.4, textDecoration: !f.included ? "line-through" : "none" }}>
                      {f.text}
                      {f.note && <span style={{ color: plan.color, fontSize: "10px", fontFamily: "monospace" }}> *</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Africa banner */}
        <div style={{ maxWidth: "700px", margin: "0 auto 64px", padding: "20px 24px", background: "rgba(232,140,50,0.06)", border: "1px solid rgba(232,140,50,0.2)", borderRadius: "14px", display: "flex", gap: "16px", alignItems: "center" }}>
          <span style={{ fontSize: "28px" }}>🌍</span>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "14px", fontWeight: "600", color: "#FFF5E8", fontFamily: "sans-serif", marginBottom: "3px" }}>Vous êtes basé en Afrique ?</p>
            <p style={{ fontSize: "13px", color: "rgba(255,245,232,0.55)", fontFamily: "sans-serif", lineHeight: 1.6 }}>
              Tarifs FCFA disponibles — SaaS Premium dès <strong style={{ color: "#F5C842" }}>19 900 FCFA/mois</strong> · Consulting dès <strong style={{ color: "#F5C842" }}>250 000 FCFA/mois</strong> · Sites web dès <strong style={{ color: "#F5C842" }}>390 000 FCFA</strong>. CI · CG · CM · SN & toute l'Afrique francophone.
            </p>
          </div>
          <button style={{ padding: "10px 18px", background: "#E88C32", border: "none", borderRadius: "8px", color: "#1A0800", fontSize: "12px", fontWeight: "700", cursor: "pointer", flexShrink: 0, fontFamily: "sans-serif" }}>
            WhatsApp →
          </button>
        </div>

        {/* FAQ */}
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.25)", marginBottom: "24px" }}>QUESTIONS FRÉQUENTES</p>
          {FAQ.map((item, i) => (
            <div key={i} style={{ marginBottom: "8px", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", overflow: "hidden" }}>
              <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ width: "100%", padding: "16px 20px", background: openFaq === i ? "rgba(78,201,176,0.06)" : "rgba(255,255,255,0.02)", border: "none", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "all 0.2s" }}>
                <span style={{ fontSize: "14px", color: "#fff", fontFamily: "sans-serif", textAlign: "left" }}>{item.q}</span>
                <span style={{ fontSize: "16px", color: TEAL, flexShrink: 0, marginLeft: "12px", transition: "transform 0.2s", transform: openFaq === i ? "rotate(45deg)" : "rotate(0)" }}>+</span>
              </button>
              {openFaq === i && (
                <div style={{ padding: "0 20px 16px", background: "rgba(78,201,176,0.03)" }}>
                  <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", lineHeight: 1.7 }}>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CheckoutPage({ plan, billing, onBack, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", name: "" });
  const selectedPlan = PLANS.find(p => p.id === plan);
  const price = billing === "annual" ? selectedPlan?.price.annual : selectedPlan?.price.monthly;

  const handlePay = async () => {
    if (!form.email || !form.name) return;
    setLoading(true);
    // Simulate Stripe redirect
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    onSuccess();
  };

  if (!selectedPlan || selectedPlan.id === "free") return null;

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ maxWidth: "480px", width: "100%" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.4)", fontSize: "13px", cursor: "pointer", fontFamily: "sans-serif", marginBottom: "24px", display: "flex", alignItems: "center", gap: "6px" }}>
          ← Retour aux tarifs
        </button>

        <div style={{ padding: "28px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "20px" }}>
          {/* Plan summary */}
          <div style={{ padding: "16px", background: `${selectedPlan.color}08`, border: `1px solid ${selectedPlan.color}25`, borderRadius: "12px", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontFamily: "monospace", fontSize: "9px", color: selectedPlan.color, letterSpacing: "1px", marginBottom: "3px" }}>VOTRE PLAN</p>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#fff" }}>{selectedPlan.emoji} Nexalie {selectedPlan.name}</p>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "monospace" }}>{billing === "annual" ? "Facturation annuelle" : "Facturation mensuelle"}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: selectedPlan.color }}>{price}€</p>
                <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", fontFamily: "monospace" }}>{billing === "annual" ? "/an" : "/mois"}</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "5px" }}>NOM COMPLET</label>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Votre nom"
                style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "sans-serif", outline: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontFamily: "monospace", fontSize: "10px", color: "rgba(255,255,255,0.4)", marginBottom: "5px" }}>EMAIL</label>
              <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="votre@email.com" type="email"
                style={{ width: "100%", padding: "11px 14px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", color: "#fff", fontSize: "13px", fontFamily: "sans-serif", outline: "none" }} />
            </div>
          </div>

          {/* Stripe info */}
          <div style={{ padding: "10px 14px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", marginBottom: "16px", display: "flex", gap: "8px", alignItems: "center" }}>
            <span style={{ fontSize: "14px" }}>🔒</span>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
              Paiement sécurisé via <strong style={{ color: "rgba(255,255,255,0.6)" }}>Stripe</strong> — Carte bancaire, Apple Pay, Google Pay
            </p>
          </div>

          <button onClick={handlePay} disabled={!form.email || !form.name || loading}
            style={{ width: "100%", padding: "14px", background: form.email && form.name && !loading ? selectedPlan.color : "rgba(255,255,255,0.06)", border: "none", borderRadius: "10px", color: form.email && form.name && !loading ? NAVY : "rgba(255,255,255,0.2)", fontSize: "15px", fontWeight: "700", cursor: form.email && form.name && !loading ? "pointer" : "default", fontFamily: "sans-serif", transition: "all 0.2s" }}>
            {loading ? "⏳ Redirection vers Stripe..." : `Payer ${price}€ →`}
          </button>

          <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.2)", fontFamily: "monospace", marginTop: "10px" }}>
            Annulable à tout moment · Accès immédiat
          </p>
        </div>
      </div>
    </div>
  );
}

function SuccessPage({ onContinue }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ maxWidth: "520px", textAlign: "center" }}>
        {/* Animated checkmark */}
        <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: `${SAGE}20`, border: `2px solid ${SAGE}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <span style={{ fontSize: "36px" }}>✓</span>
        </div>

        <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "3px", color: SAGE, marginBottom: "12px" }}>PAIEMENT RÉUSSI 🎉</p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 300, color: "#fff", marginBottom: "12px" }}>
          Bienvenue dans<br /><em style={{ color: TEAL }}>Nexalie Premium</em> !
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.45)", fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: "28px" }}>
          Votre accès est activé immédiatement. Tous les outils IA sont désormais disponibles sans limite.
        </p>

        {/* What's unlocked */}
        <div style={{ padding: "20px 24px", background: `${TEAL}06`, border: `1px solid ${TEAL}20`, borderRadius: "16px", marginBottom: "24px", textAlign: "left" }}>
          <p style={{ fontFamily: "monospace", fontSize: "9px", letterSpacing: "2px", color: TEAL, marginBottom: "12px" }}>CE QUI EST DÉBLOQUÉ</p>
          {["Générateur de Business Plan IA", "Roadmap digitale 12 mois", "Cartographie des processus", "Cahier des charges détaillé", "Simulateur de budget projet", "Veille concurrentielle IA", "Export PDF illimité", "Support prioritaire WhatsApp"].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
              <span style={{ color: SAGE, fontSize: "12px" }}>✓</span>
              <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)", fontFamily: "sans-serif" }}>{item}</span>
            </div>
          ))}
        </div>

        {/* Email confirm */}
        <div style={{ padding: "14px 16px", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", marginBottom: "24px" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif" }}>
            📧 Un email de confirmation vous a été envoyé avec vos accès et votre facture.
          </p>
        </div>

        <button onClick={onContinue}
          style={{ width: "100%", padding: "15px", background: TEAL, border: "none", borderRadius: "12px", color: NAVY, fontSize: "15px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif", boxShadow: `0 8px 24px ${TEAL}30` }}>
          Accéder à la plateforme →
        </button>
      </div>
    </div>
  );
}

function CancelPage({ onBack }) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
      <div style={{ maxWidth: "480px", textAlign: "center" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(192,98,122,0.15)", border: `2px solid ${CORAL}40`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <span style={{ fontSize: "28px" }}>↩</span>
        </div>

        <p style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.3)", marginBottom: "10px" }}>PAIEMENT ANNULÉ</p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "28px", fontWeight: 300, color: "#fff", marginBottom: "10px" }}>
          Pas de problème !
        </h1>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", lineHeight: 1.7, marginBottom: "24px" }}>
          Votre paiement a été annulé. Vous pouvez continuer à utiliser le plan gratuit ou réessayer quand vous voulez.
        </p>

        <div style={{ padding: "16px", background: `${GOLD}08`, border: `1px solid ${GOLD}20`, borderRadius: "12px", marginBottom: "20px" }}>
          <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", fontFamily: "sans-serif", marginBottom: "8px" }}>Vous avez des questions sur le Premium ?</p>
          <p style={{ fontSize: "13px", color: GOLD, fontFamily: "monospace" }}>📱 WhatsApp : +33 7 86 62 04 09</p>
          <p style={{ fontSize: "13px", color: GOLD, fontFamily: "monospace" }}>📧 relia.ebiya@gmail.com</p>
        </div>

        <button onClick={onBack}
          style={{ width: "100%", padding: "13px", background: "transparent", border: `1px solid ${TEAL}40`, borderRadius: "10px", color: TEAL, fontSize: "14px", fontWeight: "700", cursor: "pointer", fontFamily: "sans-serif" }}>
          ← Retour aux tarifs
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════════

export default function App() {
  const [page, setPage] = useState("pricing");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [billing, setBilling] = useState("monthly");

  const handleSelect = (planId, billingType) => {
    if (planId === "free") { setPage("platform"); return; }
    if (planId === "consulting") { setPage("contact"); return; }
    setSelectedPlan(planId);
    setBilling(billingType);
    setPage("checkout");
  };

  return (
    <div style={{ minHeight: "100vh", background: "radial-gradient(ellipse at 15% 10%, #0d1f35 0%, #070e1c 100%)", fontFamily: "sans-serif" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input { outline: none !important; }
        button:hover { opacity: 0.92; }
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
      `}</style>

      <Nav page={page} setPage={setPage} />

      {page === "pricing" && <PricingPage onSelect={handleSelect} />}
      {page === "checkout" && <CheckoutPage plan={selectedPlan} billing={billing} onBack={() => setPage("pricing")} onSuccess={() => setPage("success")} />}
      {page === "success" && <SuccessPage onContinue={() => setPage("platform")} />}
      {page === "cancel" && <CancelPage onBack={() => setPage("pricing")} />}
      {["platform","contact","signup"].includes(page) && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ fontFamily: "monospace", fontSize: "12px", color: "rgba(255,255,255,0.3)", marginBottom: "8px" }}>PAGE : {page.toUpperCase()}</p>
            <button onClick={() => setPage("pricing")} style={{ padding: "10px 20px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontFamily: "sans-serif" }}>← Retour</button>
          </div>
        </div>
      )}
    </div>
  );
}
