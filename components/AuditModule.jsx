'use client';

import { useState, useEffect, useRef } from 'react';
import { useMode } from '@/lib/mode-context';
import DiagnosticLoading from './DiagnosticLoading';
import RapportRestitution from './RapportRestitution';

// ─────────────────────────────────────────────────────────────
// Tooltips pour termes techniques
// ─────────────────────────────────────────────────────────────
const TOOLTIPS = {
  'CRM':               "Logiciel de gestion clients (ex: HubSpot, Salesforce)",
  'KPI':               "Indicateur chiffré de performance (ex: taux de conversion, CA mensuel)",
  'KPIs':              "Indicateurs chiffrés de performance (ex: taux de conversion, CA mensuel)",
  'BIM':               "Maquette numérique 3D d'un bâtiment (Building Information Modeling)",
  'ERP':               "Logiciel qui centralise toute la gestion de l'entreprise : stocks, ventes, comptabilité",
  'agile':             "Méthode de travail par petites étapes rapides et itératives (Scrum, Kanban...)",
  'agiles':            "Méthodes de travail par petites étapes rapides et itératives (Scrum, Kanban...)",
  'cloud':             "Stockage et traitement de données sur des serveurs distants accessibles via Internet",
  'Cloud':             "Stockage et traitement de données sur des serveurs distants accessibles via Internet",
  'ROI':               "Retour sur Investissement — mesure combien rapporte chaque euro investi",
  'SaaS':              "Logiciel accessible en ligne par abonnement, sans installation (ex: Notion, HubSpot)",
  'MVP':               "Version minimale d'un produit pour tester une idée rapidement avec peu de ressources",
  'Tunnel de vente':   "Parcours guidé du prospect jusqu'à l'achat (publicité → landing page → offre → paiement)",
  'Cahier des charges': "Document qui décrit précisément les besoins, fonctionnalités et contraintes d'un projet",
};

function TooltipBadge({ term, definition }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseLeave={() => setOpen(false)}
    >
      <span style={{ borderBottom: '1px dotted #4EC9B0', cursor: 'help' }}>{term}</span>
      <span
        onClick={e => { e.stopPropagation(); setOpen(o => !o); }}
        style={{ fontSize: '0.7em', cursor: 'pointer', marginLeft: '2px', verticalAlign: 'middle', userSelect: 'none' }}
        title={definition}
        aria-label={`Définition de ${term}`}
      >ℹ️</span>
      {open && (
        <span style={{
          position: 'absolute',
          bottom: '130%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#0A1628',
          color: '#fff',
          padding: '7px 12px',
          borderRadius: '8px',
          fontSize: '0.78rem',
          zIndex: 200,
          lineHeight: 1.5,
          boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
          width: '220px',
          textAlign: 'center',
          pointerEvents: 'none',
          fontWeight: 400,
        }}>
          <strong style={{ display: 'block', marginBottom: '2px' }}>{term}</strong>
          {definition}
        </span>
      )}
    </span>
  );
}

function QuestionText({ text }) {
  const terms = Object.keys(TOOLTIPS);
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  // Boundary-aware split: match whole words only
  const regex = new RegExp(`\\b(${escaped.join('|')})\\b`, 'g');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        TOOLTIPS[part]
          ? <TooltipBadge key={i} term={part} definition={TOOLTIPS[part]} />
          : <span key={i}>{part}</span>
      )}
    </>
  );
}

// ─────────────────────────────────────────────────────────────
// 20 Questions × 2 modes
// ─────────────────────────────────────────────────────────────
const QUESTIONS = {
  fr: [
    { id: 1, q: "Votre équipe utilise-t-elle des outils collaboratifs en ligne ?", answers: [
      { label: "Non, on communique par téléphone/email uniquement", score: 0 },
      { label: "On utilise parfois des outils (WhatsApp, Drive)", score: 1 },
      { label: "Oui, régulièrement (Teams, Notion, Slack...)", score: 2 },
      { label: "Oui, c'est au cœur de notre organisation", score: 3 },
    ]},
    { id: 2, q: "Vos processus métier sont-ils documentés numériquement ?", answers: [
      { label: "Informations transmises oralement", score: 0 },
      { label: "Quelques documents Word/PDF épars", score: 1 },
      { label: "Documentation partielle mais accessible", score: 2 },
      { label: "Documentation complète et mise à jour", score: 3 },
    ]},
    { id: 3, q: "Disposez-vous d'un site web actif mis à jour régulièrement ?", answers: [
      { label: "Aucun site web", score: 0 },
      { label: "Site vitrine non mis à jour", score: 1 },
      { label: "Site actif avec contenu récent", score: 2 },
      { label: "Site avec blog, SEO et analytics", score: 3 },
    ]},
    { id: 4, q: "Utilisez-vous un CRM pour suivre vos clients ?", answers: [
      { label: "Non, fichier Excel ou rien", score: 0 },
      { label: "Tableur partagé", score: 1 },
      { label: "CRM simple (HubSpot Free, Notion...)", score: 2 },
      { label: "CRM avancé intégré à nos outils", score: 3 },
    ]},
    { id: 5, q: "Vos données sont-elles sauvegardées automatiquement dans le cloud ?", answers: [
      { label: "Non, sauvegardes manuelles ou inexistantes", score: 0 },
      { label: "Sauvegarde manuelle occasionnelle", score: 1 },
      { label: "Sauvegarde cloud partielle", score: 2 },
      { label: "Sauvegarde automatique complète + redondance", score: 3 },
    ]},
    { id: 6, q: "Vos équipes ont-elles été formées à des outils digitaux cette année ?", answers: [
      { label: "Aucune formation", score: 0 },
      { label: "Formation ponctuelle informelle", score: 1 },
      { label: "1-2 formations organisées", score: 2 },
      { label: "Programme de formation continue", score: 3 },
    ]},
    { id: 7, q: "Mesurez-vous votre performance digitale avec des indicateurs définis ?", answers: [
      { label: "Aucun indicateur", score: 0 },
      { label: "Quelques stats Google Analytics", score: 1 },
      { label: "KPIs définis et suivis mensuellement", score: 2 },
      { label: "Tableau de bord complet et revues régulières", score: 3 },
    ]},
    { id: 8, q: "Vos clients peuvent-ils interagir avec vous en ligne ?", answers: [
      { label: "Non, uniquement par téléphone", score: 0 },
      { label: "Email seulement", score: 1 },
      { label: "Formulaire web ou chat", score: 2 },
      { label: "Portail client, chatbot, self-service", score: 3 },
    ]},
    { id: 9, q: "Utilisez-vous des outils d'automatisation dans vos processus ?", answers: [
      { label: "Aucune automatisation", score: 0 },
      { label: "Quelques macros Excel", score: 1 },
      { label: "Automatisations simples (Zapier, Make...)", score: 2 },
      { label: "Workflows automatisés bout en bout", score: 3 },
    ]},
    { id: 10, q: "Avez-vous une stratégie de cybersécurité ?", answers: [
      { label: "Aucune politique de sécurité", score: 0 },
      { label: "Antivirus basique", score: 1 },
      { label: "MFA, politique de mots de passe", score: 2 },
      { label: "Politique complète + formation équipe + audit", score: 3 },
    ]},
    { id: 11, q: "Votre direction a-t-elle une vision digitale clairement définie ?", answers: [
      { label: "Non, le digital n'est pas une priorité", score: 0 },
      { label: "Vague intention mais rien de concret", score: 1 },
      { label: "Vision définie mais peu partagée", score: 2 },
      { label: "Vision claire, partagée et avec budget alloué", score: 3 },
    ]},
    { id: 12, q: "Avez-vous un budget digital annuel défini ?", answers: [
      { label: "Aucun budget dédié", score: 0 },
      { label: "Budget ad hoc selon les besoins", score: 1 },
      { label: "Budget estimatif annuel", score: 2 },
      { label: "Budget précis avec ROI mesuré", score: 3 },
    ]},
    { id: 13, q: "Vos données clients sont-elles centralisées en un seul endroit ?", answers: [
      { label: "Non, dispersées partout", score: 0 },
      { label: "Partiellement dans des fichiers", score: 1 },
      { label: "Centralisées dans un outil", score: 2 },
      { label: "Base de données unifiée et propre", score: 3 },
    ]},
    { id: 14, q: "Proposez-vous des services ou produits en ligne ?", answers: [
      { label: "Aucune offre en ligne", score: 0 },
      { label: "Catalogue en ligne sans vente", score: 1 },
      { label: "Vente en ligne basique", score: 2 },
      { label: "E-commerce/SaaS optimisé", score: 3 },
    ]},
    { id: 15, q: "Utilisez-vous les réseaux sociaux de façon stratégique ?", answers: [
      { label: "Aucune présence sociale", score: 0 },
      { label: "Présence sans stratégie", score: 1 },
      { label: "Publications régulières avec objectifs", score: 2 },
      { label: "Stratégie social media avec publicité et analytics", score: 3 },
    ]},
    { id: 16, q: "Vos équipes collaborent-elles à distance efficacement ?", answers: [
      { label: "Le télétravail n'est pas possible", score: 0 },
      { label: "Possible mais difficile", score: 1 },
      { label: "Outils en place, quelques frictions", score: 2 },
      { label: "Travail hybride fluide et productif", score: 3 },
    ]},
    { id: 17, q: "Avez-vous un plan de continuité numérique en cas de panne ?", answers: [
      { label: "Non", score: 0 },
      { label: "Plan informel, transmis oralement", score: 1 },
      { label: "Plan documenté mais non testé", score: 2 },
      { label: "Plan testé régulièrement", score: 3 },
    ]},
    { id: 18, q: "Mesurez-vous la satisfaction client avec des outils digitaux ?", answers: [
      { label: "Non", score: 0 },
      { label: "Retours informels", score: 1 },
      { label: "Enquêtes ponctuelles", score: 2 },
      { label: "NPS automatisé + analyse continue", score: 3 },
    ]},
    { id: 19, q: "Vos fournisseurs sont-ils connectés à vos systèmes numériques ?", answers: [
      { label: "Non", score: 0 },
      { label: "Échanges par email", score: 1 },
      { label: "Portail fournisseur partiel", score: 2 },
      { label: "Intégration EDI ou API complète", score: 3 },
    ]},
    { id: 20, q: "Investissez-vous dans la veille technologique de votre secteur ?", answers: [
      { label: "Non", score: 0 },
      { label: "Lecture occasionnelle", score: 1 },
      { label: "Veille organisée et partagée", score: 2 },
      { label: "Veille systématique + expérimentations régulières", score: 3 },
    ]},
  ],
  af: [
    { id: 1, q: "Vos équipes partagent-ils les informations sur téléphone ou ordinateur ?", answers: [
      { label: "Non, tout se dit en face à face ou par appel", score: 0 },
      { label: "On utilise WhatsApp pour partager des infos", score: 1 },
      { label: "On utilise des outils partagés (Google Drive, WhatsApp groupes...)", score: 2 },
      { label: "Oui, on a des outils numériques organisés pour ça", score: 3 },
    ]},
    { id: 2, q: "Vos façons de travailler sont-elles écrites ou seulement dans les têtes ?", answers: [
      { label: "Informations transmises oralement", score: 0 },
      { label: "Quelques notes écrites, pas organisées", score: 1 },
      { label: "Des documents existent mais ne sont pas toujours suivis", score: 2 },
      { label: "Tout est documenté et tout le monde suit les mêmes règles", score: 3 },
    ]},
    { id: 3, q: "Vos clients peuvent-ils vous trouver facilement sur Internet ?", answers: [
      { label: "Non, aucune présence en ligne", score: 0 },
      { label: "Une page Facebook ou Instagram seulement", score: 1 },
      { label: "Un site web ou plusieurs réseaux actifs", score: 2 },
      { label: "Site web + réseaux + référencement Google actif", score: 3 },
    ]},
    { id: 4, q: "Avez-vous un système pour suivre vos clients et vos ventes ?", answers: [
      { label: "Non, tout est mémorisé ou sur papier", score: 0 },
      { label: "Un fichier Excel ou cahier", score: 1 },
      { label: "Un outil simple pour gérer les clients", score: 2 },
      { label: "Un vrai système CRM intégré", score: 3 },
    ]},
    { id: 5, q: "Vos données importantes sont-elles protégées en cas de panne ?", answers: [
      { label: "Non, si le téléphone/ordinateur tombe en panne, tout est perdu", score: 0 },
      { label: "Parfois on fait des copies manuellement", score: 1 },
      { label: "Sauvegarde dans le cloud partielle", score: 2 },
      { label: "Sauvegarde automatique complète dans le cloud", score: 3 },
    ]},
    { id: 6, q: "Votre équipe a-t-elle appris à utiliser des outils numériques récemment ?", answers: [
      { label: "Non, aucune formation", score: 0 },
      { label: "Des membres ont appris seuls", score: 1 },
      { label: "On a organisé quelques formations", score: 2 },
      { label: "On forme l'équipe régulièrement", score: 3 },
    ]},
    { id: 7, q: "Savez-vous combien de clients viennent grâce à votre présence en ligne ?", answers: [
      { label: "Non, aucun suivi", score: 0 },
      { label: "On le devine mais sans données précises", score: 1 },
      { label: "On suit quelques chiffres basiques", score: 2 },
      { label: "On mesure précisément nos résultats en ligne", score: 3 },
    ]},
    { id: 8, q: "Vos clients peuvent-ils commander ou vous contacter en ligne ?", answers: [
      { label: "Non, seulement en venant au bureau ou par appel", score: 0 },
      { label: "Par WhatsApp uniquement", score: 1 },
      { label: "Par formulaire web ou email", score: 2 },
      { label: "Commande en ligne, paiement Mobile Money, chat", score: 3 },
    ]},
    { id: 9, q: "Certaines tâches répétitives sont-elles faites automatiquement ?", answers: [
      { label: "Non, tout est manuel", score: 0 },
      { label: "Quelques raccourcis Excel", score: 1 },
      { label: "Quelques automatisations simples", score: 2 },
      { label: "Beaucoup de tâches sont automatisées", score: 3 },
    ]},
    { id: 10, q: "Avez-vous des règles pour protéger vos données numériques ?", answers: [
      { label: "Non", score: 0 },
      { label: "On fait attention mais sans règles formelles", score: 1 },
      { label: "Quelques règles de base (mots de passe, accès limités)", score: 2 },
      { label: "Politique de sécurité complète et respectée", score: 3 },
    ]},
    { id: 11, q: "Votre direction croit-elle vraiment au numérique pour l'entreprise ?", answers: [
      { label: "Non, le digital n'est pas une priorité", score: 0 },
      { label: "Oui mais sans passer à l'action", score: 1 },
      { label: "Oui, quelques projets sont lancés", score: 2 },
      { label: "Oui, c'est une priorité stratégique avec des moyens", score: 3 },
    ]},
    { id: 12, q: "Avez-vous prévu un budget pour le numérique cette année ?", answers: [
      { label: "Non, aucun budget", score: 0 },
      { label: "On dépense au cas par cas", score: 1 },
      { label: "On a une idée du budget mais c'est flou", score: 2 },
      { label: "Budget précis défini et alloué", score: 3 },
    ]},
    { id: 13, q: "Toutes vos informations clients sont-elles au même endroit ?", answers: [
      { label: "Non, c'est dispersé partout", score: 0 },
      { label: "Partiellement dans des fichiers", score: 1 },
      { label: "La plupart dans un outil", score: 2 },
      { label: "Toutes centralisées dans une base organisée", score: 3 },
    ]},
    { id: 14, q: "Vendez-vous ou proposez-vous des services en ligne ?", answers: [
      { label: "Non, uniquement en présentiel", score: 0 },
      { label: "On présente nos offres en ligne mais on vend en face à face", score: 1 },
      { label: "On peut commander en ligne", score: 2 },
      { label: "Vente en ligne complète avec paiement Mobile Money", score: 3 },
    ]},
    { id: 15, q: "Utilisez-vous les réseaux sociaux pour développer votre activité ?", answers: [
      { label: "Non", score: 0 },
      { label: "On a des pages mais sans stratégie", score: 1 },
      { label: "On publie régulièrement avec des objectifs", score: 2 },
      { label: "Stratégie réseaux actifs + publicité ciblée", score: 3 },
    ]},
    { id: 16, q: "Vos équipes peuvent-ils travailler ensemble même à distance ?", answers: [
      { label: "Non, tout le monde doit être présent", score: 0 },
      { label: "C'est possible mais compliqué", score: 1 },
      { label: "On se débrouille avec WhatsApp et appels", score: 2 },
      { label: "Outils de collaboration en place et ça marche bien", score: 3 },
    ]},
    { id: 17, q: "Avez-vous un plan si votre système informatique tombe en panne ?", answers: [
      { label: "Non", score: 0 },
      { label: "On improvise", score: 1 },
      { label: "On sait quoi faire mais ce n'est pas écrit", score: 2 },
      { label: "Plan documenté et testé", score: 3 },
    ]},
    { id: 18, q: "Demandez-vous l'avis de vos clients via des outils numériques ?", answers: [
      { label: "Non", score: 0 },
      { label: "Parfois informellement", score: 1 },
      { label: "Sondages WhatsApp ou Google Forms", score: 2 },
      { label: "Système automatique de collecte d'avis", score: 3 },
    ]},
    { id: 19, q: "Vos fournisseurs sont-ils connectés à votre système de gestion ?", answers: [
      { label: "Non", score: 0 },
      { label: "On communique par WhatsApp ou appel", score: 1 },
      { label: "Quelques échanges digitaux", score: 2 },
      { label: "Intégration numérique avec les fournisseurs clés", score: 3 },
    ]},
    { id: 20, q: "Vous informez-vous sur les nouvelles technologies de votre secteur ?", answers: [
      { label: "Non", score: 0 },
      { label: "Occasionnellement", score: 1 },
      { label: "Veille régulière", score: 2 },
      { label: "Veille active + expérimentations régulières", score: 3 },
    ]},
  ],
};

// ─────────────────────────────────────────────────────────────
// Secteurs
// ─────────────────────────────────────────────────────────────
const SECTORS = {
  fr: [
    { id: 'commerce',       label: 'Commerce / Retail',            icon: '🛒' },
    { id: 'sante',          label: 'Santé',                        icon: '🏥' },
    { id: 'administration', label: 'Administration / Institution',  icon: '🏛️' },
    { id: 'btp',            label: 'BTP / Construction',           icon: '🏗️' },
    { id: 'agriculture',    label: 'Agriculture',                  icon: '🌾' },
    { id: 'education',      label: 'Éducation',                    icon: '🎓' },
    { id: 'telecom',        label: 'Télécom / Tech',               icon: '💻' },
    { id: 'finance',        label: 'Services financiers',          icon: '💳' },
    { id: 'autre',          label: 'Autre secteur',                icon: '🏢' },
  ],
  af: [
    { id: 'commerce',       label: 'Commerce / Distribution',      icon: '🛒' },
    { id: 'sante',          label: 'Santé / Pharmacie',            icon: '🏥' },
    { id: 'administration', label: 'Administration / Institution',  icon: '🏛️' },
    { id: 'btp',            label: 'BTP / Construction',           icon: '🏗️' },
    { id: 'agriculture',    label: 'Agriculture / Agro',           icon: '🌾' },
    { id: 'education',      label: 'Éducation / Formation',        icon: '🎓' },
    { id: 'telecom',        label: 'Télécom / Digital',            icon: '💻' },
    { id: 'finance',        label: 'Finance / Mobile Money',       icon: '💳' },
    { id: 'transport',      label: 'Transport / Logistique',       icon: '🚚' },
    { id: 'restauration',   label: 'Restauration / Alimentation',  icon: '🍽️' },
    { id: 'autre',          label: 'Autre secteur',                icon: '🏢' },
  ],
};

// 15 questions sectorielles (Q6→Q20) — FR
const SECTOR_QUESTIONS_FR = {
  commerce: [
    { id: 6,  q: "Avez-vous une boutique en ligne ou un e-commerce ?", answers: [{ label: "Non, uniquement en physique", score: 0 }, { label: "Site vitrine sans vente en ligne", score: 1 }, { label: "Vente en ligne basique (quelques produits)", score: 2 }, { label: "E-commerce complet avec paiement et suivi commandes", score: 3 }] },
    { id: 7,  q: "Utilisez-vous un logiciel de caisse ou point de vente numérique ?", answers: [{ label: "Non, caisse manuelle ou papier", score: 0 }, { label: "Logiciel de caisse basique", score: 1 }, { label: "Logiciel caisse avec gestion des stocks", score: 2 }, { label: "POS connecté au CRM et aux analytics", score: 3 }] },
    { id: 8,  q: "Votre gestion des stocks est-elle numérisée ?", answers: [{ label: "Non, papier ou mémoire", score: 0 }, { label: "Fichier Excel manuel", score: 1 }, { label: "Logiciel de stocks basique", score: 2 }, { label: "Gestion stocks en temps réel avec alertes", score: 3 }] },
    { id: 9,  q: "Envoyez-vous des promotions par email ou SMS à vos clients ?", answers: [{ label: "Non, aucune communication promotionnelle digitale", score: 0 }, { label: "Occasionnellement sur les réseaux", score: 1 }, { label: "Email/SMS ponctuels à notre base clients", score: 2 }, { label: "Campagnes automatisées avec segmentation clients", score: 3 }] },
    { id: 10, q: "Analysez-vous vos ventes par produit ou catégorie ?", answers: [{ label: "Non, aucune analyse", score: 0 }, { label: "On regarde les chiffres sans outil dédié", score: 1 }, { label: "Analyse mensuelle sur tableur", score: 2 }, { label: "Tableaux de bord ventes en temps réel", score: 3 }] },
    { id: 11, q: "Proposez-vous le paiement en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "Virement bancaire sur demande uniquement", score: 1 }, { label: "Paiement en ligne (CB, PayPal...)", score: 2 }, { label: "Multi-paiement avec options échelonnées", score: 3 }] },
    { id: 12, q: "Avez-vous un programme de fidélité numérique ?", answers: [{ label: "Non", score: 0 }, { label: "Carte papier seulement", score: 1 }, { label: "Programme digital simple (points, coupons email)", score: 2 }, { label: "Programme fidélité avec CRM et personnalisation", score: 3 }] },
    { id: 13, q: "Gérez-vous vos commandes fournisseurs numériquement ?", answers: [{ label: "Non, téléphone et papier", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Bons de commande numériques + suivi tableur", score: 2 }, { label: "Plateforme fournisseurs intégrée au système", score: 3 }] },
    { id: 14, q: "Utilisez-vous les réseaux sociaux pour vendre ?", answers: [{ label: "Aucune présence commerciale en ligne", score: 0 }, { label: "Présence non commerciale", score: 1 }, { label: "Publications produits et promotions régulières", score: 2 }, { label: "Social commerce + publicités ciblées + conversions mesurées", score: 3 }] },
    { id: 15, q: "Tracez-vous vos livraisons numériquement ?", answers: [{ label: "Non, aucun suivi", score: 0 }, { label: "Numéro de suivi partagé par email", score: 1 }, { label: "Suivi livraisons basique", score: 2 }, { label: "Traçabilité complète + notifications clients automatiques", score: 3 }] },
    { id: 16, q: "Gérez-vous les avis clients en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "On les lit sans répondre", score: 1 }, { label: "Réponses aux avis (Google, Trustpilot...)", score: 2 }, { label: "Stratégie proactive de collecte et gestion des avis", score: 3 }] },
    { id: 17, q: "Votre service après-vente / retours est-il géré numériquement ?", answers: [{ label: "Non, uniquement de vive voix", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Formulaire de retour ou ticketing basique", score: 2 }, { label: "Système SAV intégré avec suivi et KPIs", score: 3 }] },
    { id: 18, q: "Analysez-vous le comportement de vos acheteurs en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "On regarde les vues produits", score: 1 }, { label: "Analytics e-commerce basiques (abandon panier, pages vues)", score: 2 }, { label: "Analyse complète du parcours client", score: 3 }] },
    { id: 19, q: "La mise à jour de vos prix est-elle numérisée ?", answers: [{ label: "Non, liste papier", score: 0 }, { label: "Mise à jour manuelle du site quand on y pense", score: 1 }, { label: "Gestion des prix centralisée", score: 2 }, { label: "Pricing dynamique ou automatisé selon stocks/saisons", score: 3 }] },
    { id: 20, q: "Avez-vous une stratégie de vente multicanal (online + offline) ?", answers: [{ label: "Non, un seul canal", score: 0 }, { label: "Online et offline mais sans cohérence", score: 1 }, { label: "Stratégie omnicanal en cours de déploiement", score: 2 }, { label: "Omnicanal mature avec expérience client unifiée", score: 3 }] },
  ],
  sante: [
    { id: 6,  q: "Gérez-vous les dossiers patients / résidents numériquement ?", answers: [{ label: "Non, tout est sur papier", score: 0 }, { label: "Quelques fichiers Word ou Excel", score: 1 }, { label: "Logiciel de dossiers patients basique", score: 2 }, { label: "DMP complet et sécurisé", score: 3 }] },
    { id: 7,  q: "Proposez-vous la prise de rendez-vous en ligne ?", answers: [{ label: "Non, uniquement par téléphone", score: 0 }, { label: "Email pour les demandes de RDV", score: 1 }, { label: "Formulaire web ou plateforme RDV (Doctolib...)", score: 2 }, { label: "RDV en ligne automatisé + rappels SMS/email", score: 3 }] },
    { id: 8,  q: "Proposez-vous la téléconsultation ?", answers: [{ label: "Non", score: 0 }, { label: "Réfléchissons à le faire", score: 1 }, { label: "Téléconsultation disponible pour certains cas", score: 2 }, { label: "Téléconsultation intégrée au parcours patient", score: 3 }] },
    { id: 9,  q: "Utilisez-vous un logiciel de gestion de cabinet ou clinique ?", answers: [{ label: "Non", score: 0 }, { label: "Logiciel basique (facturation seulement)", score: 1 }, { label: "Logiciel de gestion complet", score: 2 }, { label: "Suite intégrée (agenda, dossier, facturation, stats)", score: 3 }] },
    { id: 10, q: "Communiquez-vous avec vos patients par voie numérique ?", answers: [{ label: "Non, uniquement en face à face ou téléphone", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Email + SMS pour rappels et résultats", score: 2 }, { label: "Portail patient sécurisé avec messagerie", score: 3 }] },
    { id: 11, q: "Utilisez-vous l'ordonnance électronique ?", answers: [{ label: "Non", score: 0 }, { label: "Parfois pour certains praticiens", score: 1 }, { label: "Oui, pour la plupart des prescriptions", score: 2 }, { label: "Oui, intégrée au DMP et transmise directement", score: 3 }] },
    { id: 12, q: "Gérez-vous vos stocks de médicaments/fournitures numériquement ?", answers: [{ label: "Non, papier ou mémoire", score: 0 }, { label: "Fichier Excel", score: 1 }, { label: "Logiciel de stocks médicaux", score: 2 }, { label: "Gestion stocks automatique avec alertes et commandes", score: 3 }] },
    { id: 13, q: "La facturation et les remboursements sont-ils numérisés ?", answers: [{ label: "Non, facturation manuelle", score: 0 }, { label: "Facturation numérique basique", score: 1 }, { label: "Télétransmission Sécu partielle", score: 2 }, { label: "Facturation automatisée + télétransmission complète", score: 3 }] },
    { id: 14, q: "Êtes-vous conforme RGPD pour les données de santé ?", answers: [{ label: "Non, pas de politique de confidentialité", score: 0 }, { label: "Partiellement (formulaires de consentement)", score: 1 }, { label: "Conformité en cours de mise en œuvre", score: 2 }, { label: "Conformité complète + DPO désigné", score: 3 }] },
    { id: 15, q: "Proposez-vous le suivi des patients à distance (objets connectés, applis) ?", answers: [{ label: "Non", score: 0 }, { label: "Par email ou SMS de façon informelle", score: 1 }, { label: "Application de suivi pour certains patients", score: 2 }, { label: "Programme télésurveillance intégré", score: 3 }] },
    { id: 16, q: "Êtes-vous connecté numériquement aux laboratoires et prestataires ?", answers: [{ label: "Non, courrier et fax", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Connexion partielle (résultats labos en ligne)", score: 2 }, { label: "Intégration complète avec les partenaires", score: 3 }] },
    { id: 17, q: "Mesurez-vous vos indicateurs qualité des soins numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques statistiques manuelles", score: 1 }, { label: "Tableau de bord qualité basique", score: 2 }, { label: "Indicateurs qualité suivis et comparés aux standards", score: 3 }] },
    { id: 18, q: "Les données médicales sont-elles hébergées de façon sécurisée (HDS) ?", answers: [{ label: "Non, sur ordinateur local non sécurisé", score: 0 }, { label: "Sécurité basique (antivirus)", score: 1 }, { label: "Hébergeur sécurisé mais pas certifié HDS", score: 2 }, { label: "Hébergement certifié HDS + chiffrement complet", score: 3 }] },
    { id: 19, q: "Votre équipe est-elle formée aux outils numériques de santé ?", answers: [{ label: "Non", score: 0 }, { label: "Formation informelle entre collègues", score: 1 }, { label: "Quelques formations organisées", score: 2 }, { label: "Programme de formation continue au numérique médical", score: 3 }] },
    { id: 20, q: "Utilisez-vous l'IA ou des outils d'aide à la décision médicale ?", answers: [{ label: "Non", score: 0 }, { label: "On en entend parler mais sans expérimenter", score: 1 }, { label: "Utilisation ponctuelle (aide diagnostic, protocoles)", score: 2 }, { label: "IA intégrée au workflow clinique avec évaluation", score: 3 }] },
  ],
  administration: [
    { id: 6,  q: "Les dossiers citoyens / usagers sont-ils numérisés ?", answers: [{ label: "Non, tout est sur papier", score: 0 }, { label: "Partiellement scannés", score: 1 }, { label: "Numérisés mais pas toujours accessibles en ligne", score: 2 }, { label: "Dossiers numériques accessibles de façon sécurisée", score: 3 }] },
    { id: 7,  q: "Proposez-vous des démarches en ligne à vos usagers ?", answers: [{ label: "Non, tout se fait au guichet", score: 0 }, { label: "Formulaires téléchargeables uniquement", score: 1 }, { label: "Quelques démarches en ligne disponibles", score: 2 }, { label: "Guichet numérique complet (dépôt, suivi, signature)", score: 3 }] },
    { id: 8,  q: "Utilisez-vous la signature électronique en interne ?", answers: [{ label: "Non, signature manuscrite uniquement", score: 0 }, { label: "Parfois pour certains documents", score: 1 }, { label: "Signature électronique pour la plupart des actes", score: 2 }, { label: "Signature électronique qualifiée généralisée", score: 3 }] },
    { id: 9,  q: "La gestion des workflows et approbations est-elle numérisée ?", answers: [{ label: "Non, circuits papier", score: 0 }, { label: "Email pour les validations", score: 1 }, { label: "Outil de workflow basique", score: 2 }, { label: "Plateforme de workflow intégrée avec suivi et délais", score: 3 }] },
    { id: 10, q: "Avez-vous un portail usager ou citoyen en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "Site institutionnel basique", score: 1 }, { label: "Portail avec espace personnel", score: 2 }, { label: "Portail complet avec suivi dossiers et notifications", score: 3 }] },
    { id: 11, q: "Vos archives sont-elles numérisées et organisées ?", answers: [{ label: "Non, archives papier uniquement", score: 0 }, { label: "Quelques documents scannés sans organisation", score: 1 }, { label: "Archives numériques partiellement indexées", score: 2 }, { label: "GED complète avec recherche et accès sécurisé", score: 3 }] },
    { id: 12, q: "Les agents sont-ils formés aux outils numériques administratifs ?", answers: [{ label: "Non", score: 0 }, { label: "Formation minimale au poste", score: 1 }, { label: "Formations ponctuelles organisées", score: 2 }, { label: "Plan de formation continue au numérique", score: 3 }] },
    { id: 13, q: "Vos systèmes communiquent-ils avec d'autres administrations ?", answers: [{ label: "Non, aucune interopérabilité", score: 0 }, { label: "Échanges manuels (courrier, email)", score: 1 }, { label: "Quelques connexions partielles", score: 2 }, { label: "Interopérabilité complète via API standardisées", score: 3 }] },
    { id: 14, q: "Communiquez-vous avec les usagers sur plusieurs canaux digitaux ?", answers: [{ label: "Non, uniquement au guichet ou téléphone", score: 0 }, { label: "Site internet + email", score: 1 }, { label: "Site + réseaux sociaux + email", score: 2 }, { label: "Stratégie multicanal cohérente (site, réseaux, app, SMS)", score: 3 }] },
    { id: 15, q: "Publiez-vous des données ouvertes (open data) ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques données sur demande", score: 1 }, { label: "Publication partielle sur data.gouv ou équivalent", score: 2 }, { label: "Open data structuré et mis à jour régulièrement", score: 3 }] },
    { id: 16, q: "Avez-vous une politique de cybersécurité formalisée ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques règles informelles", score: 1 }, { label: "Politique documentée mais peu appliquée", score: 2 }, { label: "PSSI + formation + audit régulier", score: 3 }] },
    { id: 17, q: "Le budget numérique est-il formalisé et suivi ?", answers: [{ label: "Non, dépenses ad hoc", score: 0 }, { label: "Budget estimatif sans suivi", score: 1 }, { label: "Budget annuel défini", score: 2 }, { label: "Budget pluriannuel avec ROI et reporting", score: 3 }] },
    { id: 18, q: "Mesurez-vous la performance numérique de votre organisation ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques indicateurs informels", score: 1 }, { label: "KPIs définis et suivis annuellement", score: 2 }, { label: "Tableau de bord numérique avec revues régulières", score: 3 }] },
    { id: 19, q: "Vos marchés publics sont-ils gérés numériquement ?", answers: [{ label: "Non, procédures papier", score: 0 }, { label: "Publication en ligne uniquement", score: 1 }, { label: "Dépôt et instruction en ligne (PLACE, AWS...)", score: 2 }, { label: "Dématérialisation complète de la commande publique", score: 3 }] },
    { id: 20, q: "Avez-vous un plan de transformation numérique formalisé ?", answers: [{ label: "Non", score: 0 }, { label: "Réflexions en cours sans plan écrit", score: 1 }, { label: "Feuille de route numérique définie", score: 2 }, { label: "Plan approuvé, financé et en cours d'exécution", score: 3 }] },
  ],
  btp: [
    { id: 6,  q: "Vos plans et documents de chantier sont-ils numérisés ?", answers: [{ label: "Non, tout est sur papier", score: 0 }, { label: "Scannés et stockés sans organisation", score: 1 }, { label: "Numérisés et partagés par email/cloud", score: 2 }, { label: "BIM ou plateforme collaborative temps réel", score: 3 }] },
    { id: 7,  q: "Utilisez-vous une application mobile pour gérer vos chantiers ?", answers: [{ label: "Non", score: 0 }, { label: "Photos et notes WhatsApp", score: 1 }, { label: "Application basique (rapports, pointage)", score: 2 }, { label: "Plateforme chantier intégrée (planning, qualité, sécurité)", score: 3 }] },
    { id: 8,  q: "Suivez-vous l'avancement des travaux numériquement ?", answers: [{ label: "Non, réunions de chantier uniquement", score: 0 }, { label: "Email et téléphone", score: 1 }, { label: "Planning Gantt numérique mis à jour", score: 2 }, { label: "Suivi temps réel avec alertes et tableaux de bord", score: 3 }] },
    { id: 9,  q: "Répondez-vous aux appels d'offres par voie numérique ?", answers: [{ label: "Non, courrier papier", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Dépôt en ligne (PLACE, plateformes AO)", score: 2 }, { label: "Veille AO automatisée + dépôt dématérialisé", score: 3 }] },
    { id: 10, q: "La gestion des équipes et du pointage est-elle numérisée ?", answers: [{ label: "Non, feuilles papier", score: 0 }, { label: "Tableur de pointage", score: 1 }, { label: "Application de pointage mobile", score: 2 }, { label: "Gestion RH chantier intégrée (présences, compétences, coûts)", score: 3 }] },
    { id: 11, q: "Les commandes fournisseurs / matériaux sont-elles numérisées ?", answers: [{ label: "Non, appels et papier", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Bons de commande numériques + suivi", score: 2 }, { label: "Gestion achats intégrée avec comparatifs et suivi livraisons", score: 3 }] },
    { id: 12, q: "Produisez-vous des rapports de chantier via application mobile ?", answers: [{ label: "Non, rapports papier", score: 0 }, { label: "Photos WhatsApp + email", score: 1 }, { label: "Rapports photo numériques structurés", score: 2 }, { label: "Rapports automatisés avec géolocalisation et horodatage", score: 3 }] },
    { id: 13, q: "La facturation et les devis sont-ils entièrement numérisés ?", answers: [{ label: "Non, manuscrits ou Word basique", score: 0 }, { label: "Logiciel de devis basique", score: 1 }, { label: "Logiciel de facturation professionnel", score: 2 }, { label: "Facturation intégrée au suivi chantier + relances automatiques", score: 3 }] },
    { id: 14, q: "Le suivi qualité et sécurité chantier est-il numérisé ?", answers: [{ label: "Non", score: 0 }, { label: "Checklist papier", score: 1 }, { label: "Formulaires numériques de contrôle", score: 2 }, { label: "Plateforme QHSE intégrée avec traçabilité", score: 3 }] },
    { id: 15, q: "Les plans sont-ils partagés en temps réel via le cloud avec tous les intervenants ?", answers: [{ label: "Non, envoi par email ou clé USB", score: 0 }, { label: "Dossier partagé Drive/Dropbox", score: 1 }, { label: "Plateforme de partage documentaire structurée", score: 2 }, { label: "BIM cloud avec gestion des révisions et accès par rôle", score: 3 }] },
    { id: 16, q: "La gestion de la logistique et des déchets de chantier est-elle numérisée ?", answers: [{ label: "Non", score: 0 }, { label: "Suivi manuel", score: 1 }, { label: "Tableur de suivi", score: 2 }, { label: "Logiciel logistique avec traçabilité et conformité", score: 3 }] },
    { id: 17, q: "Les formations sécurité sont-elles dispensées ou suivies numériquement ?", answers: [{ label: "Non, présentiel uniquement sans suivi", score: 0 }, { label: "Attestations papier", score: 1 }, { label: "Habilitations suivies sur tableur", score: 2 }, { label: "LMS ou plateforme de formation sécurité intégrée", score: 3 }] },
    { id: 18, q: "La communication avec vos clients (maîtres d'ouvrage) est-elle numérisée ?", answers: [{ label: "Non, réunions et courrier uniquement", score: 0 }, { label: "Email et téléphone", score: 1 }, { label: "Extranet client ou espace partagé", score: 2 }, { label: "Portail client avec reporting avancement en temps réel", score: 3 }] },
    { id: 19, q: "Suivez-vous le budget de vos chantiers numériquement ?", answers: [{ label: "Non, suivi approximatif", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Logiciel de suivi budgétaire", score: 2 }, { label: "Contrôle de gestion chantier intégré avec alertes dépassement", score: 3 }] },
    { id: 20, q: "Utilisez-vous des technologies avancées sur chantier (drones, IoT, capteurs) ?", answers: [{ label: "Non", score: 0 }, { label: "On y réfléchit", score: 1 }, { label: "Quelques expérimentations", score: 2 }, { label: "Drones, capteurs IoT ou IA intégrés au process chantier", score: 3 }] },
  ],
  agriculture: [
    { id: 6,  q: "Utilisez-vous des données météo ou d'analyse de sol numériquement ?", answers: [{ label: "Non, observation empirique uniquement", score: 0 }, { label: "Applications météo grand public", score: 1 }, { label: "Outils agri spécialisés (météo, irrigation)", score: 2 }, { label: "Plateforme data agriculture (sol, climat, satellites)", score: 3 }] },
    { id: 7,  q: "Gérez-vous vos cultures via une application agricole ?", answers: [{ label: "Non", score: 0 }, { label: "Notes sur téléphone", score: 1 }, { label: "Application de suivi cultures basique", score: 2 }, { label: "ERP agricole ou plateforme de gestion complète", score: 3 }] },
    { id: 8,  q: "Vendez-vous vos produits en ligne ou via une plateforme digitale ?", answers: [{ label: "Non, vente directe ou marché uniquement", score: 0 }, { label: "WhatsApp avec acheteurs", score: 1 }, { label: "Vente via plateforme ou e-commerce", score: 2 }, { label: "Multi-canaux (e-commerce, AMAP, plateforme + marché)", score: 3 }] },
    { id: 9,  q: "Assurez-vous la traçabilité numérique de vos produits ?", answers: [{ label: "Non", score: 0 }, { label: "Enregistrements papier", score: 1 }, { label: "Traçabilité partielle sur tableur", score: 2 }, { label: "Traçabilité complète numérique (du champ au consommateur)", score: 3 }] },
    { id: 10, q: "Commandez-vous vos intrants / semences en ligne ?", answers: [{ label: "Non, toujours en présentiel", score: 0 }, { label: "Parfois par email ou téléphone", score: 1 }, { label: "Commandes en ligne régulières", score: 2 }, { label: "Plateforme fournisseurs intégrée à la gestion exploitation", score: 3 }] },
    { id: 11, q: "Utilisez-vous des capteurs IoT ou stations connectées sur votre exploitation ?", answers: [{ label: "Non", score: 0 }, { label: "On a entendu parler mais rien de déployé", score: 1 }, { label: "Quelques capteurs (humidité, température...)", score: 2 }, { label: "Réseau de capteurs intégré à la gestion de l'exploitation", score: 3 }] },
    { id: 12, q: "Pratiquez-vous l'agriculture de précision (modulation, GPS, cartographie) ?", answers: [{ label: "Non", score: 0 }, { label: "GPS basique sur machines", score: 1 }, { label: "Cartographie des parcelles + modulation partielle", score: 2 }, { label: "Agriculture de précision complète (NDVI, prescription variable)", score: 3 }] },
    { id: 13, q: "Avez-vous été formé aux outils numériques agricoles ?", answers: [{ label: "Non", score: 0 }, { label: "Autodidacte sur quelques outils", score: 1 }, { label: "Formations ponctuelles (chambre d'agriculture, FNSEA...)", score: 2 }, { label: "Formation continue + accompagnement tech agri", score: 3 }] },
    { id: 14, q: "Votre gestion financière de l'exploitation est-elle numérisée ?", answers: [{ label: "Non, comptabilité papier", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Logiciel comptable agricole", score: 2 }, { label: "Comptabilité intégrée à la gestion exploitation (coûts/ha, marges)", score: 3 }] },
    { id: 15, q: "Communiquez-vous numériquement avec vos acheteurs et distributeurs ?", answers: [{ label: "Non, téléphone uniquement", score: 0 }, { label: "Email ou WhatsApp", score: 1 }, { label: "Portail ou plateforme d'échange", score: 2 }, { label: "EDI ou plateforme intégrée avec les acheteurs", score: 3 }] },
    { id: 16, q: "Gérez-vous vos certifications / labels numériquement ?", answers: [{ label: "Non, tout est papier", score: 0 }, { label: "Copies numériques stockées", score: 1 }, { label: "Gestion des certifications via organisme en ligne", score: 2 }, { label: "Traçabilité certifications intégrée à la gestion exploitation", score: 3 }] },
    { id: 17, q: "Suivez-vous les cours et prix des marchés via des outils numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Sites web et applications grand public", score: 1 }, { label: "Abonnement à des services de veille marché", score: 2 }, { label: "Données de marché intégrées à vos décisions de vente", score: 3 }] },
    { id: 18, q: "Votre irrigation est-elle automatisée ou connectée ?", answers: [{ label: "Non, manuelle à 100%", score: 0 }, { label: "Timers basiques", score: 1 }, { label: "Irrigation pilotée par capteurs basiques", score: 2 }, { label: "Irrigation de précision pilotée par IA ou données sol/météo", score: 3 }] },
    { id: 19, q: "Utilisez-vous des drones ou des images satellites pour surveiller vos parcelles ?", answers: [{ label: "Non", score: 0 }, { label: "Expérimentation ponctuelle", score: 1 }, { label: "Surveillance périodique par drone ou satellite", score: 2 }, { label: "Monitoring continu intégré à la gestion de l'exploitation", score: 3 }] },
    { id: 20, q: "Appartenez-vous à un réseau agricole qui partage des ressources numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Réseau informel d'agriculteurs", score: 1 }, { label: "Membre d'un réseau avec ressources numériques partagées", score: 2 }, { label: "Réseau actif avec partage de données, bonnes pratiques et innovation", score: 3 }] },
  ],
  education: [
    { id: 6,  q: "Utilisez-vous une plateforme d'enseignement en ligne (LMS) ?", answers: [{ label: "Non", score: 0 }, { label: "YouTube ou supports partagés informellement", score: 1 }, { label: "Plateforme LMS basique (Moodle, Google Classroom...)", score: 2 }, { label: "LMS avancé avec suivi, évaluation et communication intégrés", score: 3 }] },
    { id: 7,  q: "Les inscriptions et admissions sont-elles gérées en ligne ?", answers: [{ label: "Non, uniquement en présentiel", score: 0 }, { label: "Formulaires PDF ou email", score: 1 }, { label: "Formulaire d'inscription en ligne", score: 2 }, { label: "Portail d'admissions complet avec suivi et paiement en ligne", score: 3 }] },
    { id: 8,  q: "Les notes et bulletins sont-ils numérisés ?", answers: [{ label: "Non, carnets papier", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Logiciel de gestion des notes", score: 2 }, { label: "Bulletins numériques publiés automatiquement sur portail", score: 3 }] },
    { id: 9,  q: "La communication avec les parents / apprenants est-elle numérique ?", answers: [{ label: "Non, courriers uniquement", score: 0 }, { label: "Email ou SMS ponctuels", score: 1 }, { label: "Application ou portail de communication", score: 2 }, { label: "Plateforme intégrée (messagerie, annonces, agenda, incidents)", score: 3 }] },
    { id: 10, q: "Vos ressources pédagogiques sont-elles accessibles numériquement ?", answers: [{ label: "Non, manuels papier uniquement", score: 0 }, { label: "PDF partagés par email", score: 1 }, { label: "Ressources en ligne accessibles aux apprenants", score: 2 }, { label: "Bibliothèque numérique interactive avec médias riches", score: 3 }] },
    { id: 11, q: "Proposez-vous des cours hybrides ou entièrement à distance ?", answers: [{ label: "Non, présentiel uniquement", score: 0 }, { label: "Cours enregistrés disponibles après les séances", score: 1 }, { label: "Hybride partiel (certains cours en ligne)", score: 2 }, { label: "Dispositif hybride / distanciel complet et structuré", score: 3 }] },
    { id: 12, q: "Les présences sont-elles suivies numériquement ?", answers: [{ label: "Non, appel à la main", score: 0 }, { label: "Tableur rempli manuellement", score: 1 }, { label: "Application de suivi des présences", score: 2 }, { label: "Système de présence automatisé (badges, QR codes) + alertes", score: 3 }] },
    { id: 13, q: "Les enseignants / formateurs sont-ils formés aux outils numériques pédagogiques ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques-uns se sont formés seuls", score: 1 }, { label: "Formations ponctuelles organisées", score: 2 }, { label: "Plan de formation continue au numérique éducatif", score: 3 }] },
    { id: 14, q: "La gestion administrative de l'établissement est-elle numérisée ?", answers: [{ label: "Non, paperasse uniquement", score: 0 }, { label: "Tableurs et email", score: 1 }, { label: "Logiciel de gestion scolaire/formation", score: 2 }, { label: "ERP éducatif complet (emplois du temps, RH, comptabilité, scolarité)", score: 3 }] },
    { id: 15, q: "Les certifications ou diplômes sont-ils accessibles en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "PDF envoyés par email", score: 1 }, { label: "Espace en ligne pour consulter ses diplômes", score: 2 }, { label: "Certification numérique sécurisée (blockchain ou équivalent)", score: 3 }] },
    { id: 16, q: "Utilisez-vous un logiciel de gestion de la formation professionnelle ?", answers: [{ label: "Non", score: 0 }, { label: "Excel et email", score: 1 }, { label: "Logiciel de gestion formation (SIRH, EDOF, Qualiopi...)", score: 2 }, { label: "Plateforme complète (CRM apprenants, financement, conformité)", score: 3 }] },
    { id: 17, q: "Le paiement des frais de scolarité / formation est-il possible en ligne ?", answers: [{ label: "Non, chèque ou virement uniquement en présentiel", score: 0 }, { label: "Virement sur facture envoyée par email", score: 1 }, { label: "Paiement en ligne disponible", score: 2 }, { label: "Paiement en ligne + échelonnement + liens de paiement automatiques", score: 3 }] },
    { id: 18, q: "Avez-vous une bibliothèque ou médiathèque numérique ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques ressources PDF partagées", score: 1 }, { label: "Bibliothèque numérique basique", score: 2 }, { label: "Médiathèque numérique riche avec accès permanent aux apprenants", score: 3 }] },
    { id: 19, q: "Suivez-vous la progression des apprenants avec des outils analytics ?", answers: [{ label: "Non", score: 0 }, { label: "Observations informelles", score: 1 }, { label: "Tableaux de bord simples", score: 2 }, { label: "Analytics avancés (engagement, progression, prédiction décrochage)", score: 3 }] },
    { id: 20, q: "Avez-vous des partenariats avec des plateformes EdTech ?", answers: [{ label: "Non", score: 0 }, { label: "On utilise quelques outils gratuits", score: 1 }, { label: "Partenariats formels avec 1-2 EdTech", score: 2 }, { label: "Écosystème EdTech intégré à votre offre pédagogique", score: 3 }] },
  ],
  telecom: [
    { id: 6,  q: "Votre infrastructure est-elle hébergée dans le cloud ?", answers: [{ label: "Non, serveurs physiques uniquement", score: 0 }, { label: "Hébergement cloud partiel", score: 1 }, { label: "Cloud hybride (cloud + on-premise)", score: 2 }, { label: "Cloud-native avec architecture scalable", score: 3 }] },
    { id: 7,  q: "Exposez-vous des API pour permettre des intégrations tierces ?", answers: [{ label: "Non, système fermé", score: 0 }, { label: "API interne non documentée", score: 1 }, { label: "API disponibles avec documentation basique", score: 2 }, { label: "API bien documentées (OpenAPI), versionnées et monitorées", score: 3 }] },
    { id: 8,  q: "Vos équipes techniques pratiquent-elles les méthodes agile / DevOps ?", answers: [{ label: "Non, processus cascades ou ad hoc", score: 0 }, { label: "Scrum ou Kanban partiellement", score: 1 }, { label: "Agile adopté, DevOps en cours", score: 2 }, { label: "DevOps mature avec CI/CD, revues sprint et rétros", score: 3 }] },
    { id: 9,  q: "Avez-vous un système de monitoring et d'alertes en production ?", answers: [{ label: "Non, on découvre les incidents en production", score: 0 }, { label: "Logs consultés manuellement", score: 1 }, { label: "Monitoring basique avec alertes email", score: 2 }, { label: "Observabilité complète (logs, métriques, traces, alertes PagerDuty/OpsGenie)", score: 3 }] },
    { id: 10, q: "Avez-vous une politique de sécurité applicative (OWASP, pentest) ?", answers: [{ label: "Non", score: 0 }, { label: "Sensibilisation informelle", score: 1 }, { label: "Revues de code sécurité + quelques tests", score: 2 }, { label: "Pentest régulier + SAST/DAST + plan de remédiation", score: 3 }] },
    { id: 11, q: "Votre documentation technique est-elle à jour et accessible ?", answers: [{ label: "Informations transmises oralement", score: 0 }, { label: "Quelques documents, peu centralisés", score: 1 }, { label: "Documentation centralisée mais incomplète", score: 2 }, { label: "Documentation complète, maintenue et intégrée au process", score: 3 }] },
    { id: 12, q: "Avez-vous un pipeline CI/CD en production ?", answers: [{ label: "Non, déploiements manuels", score: 0 }, { label: "Scripts de déploiement basiques", score: 1 }, { label: "CI automatisé, CD partiel", score: 2 }, { label: "CI/CD complet avec tests, staging et déploiement automatisé", score: 3 }] },
    { id: 13, q: "La gestion des incidents est-elle formalisée ?", answers: [{ label: "Non, chaos management", score: 0 }, { label: "Communication informelle en équipe", score: 1 }, { label: "Process basique (ticket, résolution, communication)", score: 2 }, { label: "ITSM complet (SLA, post-mortem, runbooks, on-call)", score: 3 }] },
    { id: 14, q: "Mesurez-vous la performance de vos systèmes (latence, uptime, erreurs) ?", answers: [{ label: "Non", score: 0 }, { label: "Vérifications manuelles ponctuelles", score: 1 }, { label: "KPIs définis et suivis", score: 2 }, { label: "SLO/SLA définis avec tableau de bord et budget d'erreur", score: 3 }] },
    { id: 15, q: "Exploitez-vous les données collectées avec des outils analytics ?", answers: [{ label: "Non", score: 0 }, { label: "Quelques rapports basiques", score: 1 }, { label: "Analytics produit ou business actifs", score: 2 }, { label: "Data stack complète (entrepôt, BI, expérimentation A/B)", score: 3 }] },
    { id: 16, q: "L'IA est-elle intégrée dans vos produits ou services ?", answers: [{ label: "Non", score: 0 }, { label: "Expérimentations en cours", score: 1 }, { label: "Une ou deux fonctionnalités IA en production", score: 2 }, { label: "IA intégrée à plusieurs features avec évaluation continue", score: 3 }] },
    { id: 17, q: "Êtes-vous conforme RGPD dans votre gestion des données clients ?", answers: [{ label: "Non", score: 0 }, { label: "Conformité partielle sans DPO", score: 1 }, { label: "Conformité documentée + DPO désigné", score: 2 }, { label: "Privacy by design + DPO + audits réguliers", score: 3 }] },
    { id: 18, q: "Avez-vous des tests automatisés (unitaires, intégration, E2E) ?", answers: [{ label: "Non, tests manuels uniquement", score: 0 }, { label: "Quelques tests unitaires", score: 1 }, { label: "Couverture de tests significative", score: 2 }, { label: "Suite de tests complète avec CI/CD et revue de couverture", score: 3 }] },
    { id: 19, q: "Votre infrastructure est-elle scalable sans intervention manuelle ?", answers: [{ label: "Non, scaling manuel uniquement", score: 0 }, { label: "Scaling prévu manuellement à l'avance", score: 1 }, { label: "Auto-scaling partiel", score: 2 }, { label: "Infrastructure as Code + auto-scaling + chaos engineering", score: 3 }] },
    { id: 20, q: "La veille technologique est-elle organisée et partagée dans vos équipes ?", answers: [{ label: "Non, individuelle et informelle", score: 0 }, { label: "Newsletter ou Slack partagé", score: 1 }, { label: "Sessions de partage tech régulières", score: 2 }, { label: "Veille structurée + expérimentations régulières + partage systématique", score: 3 }] },
  ],
  finance: [
    { id: 6,  q: "Les transactions clients sont-elles entièrement numériques ?", answers: [{ label: "Non, traitement manuel majoritaire", score: 0 }, { label: "Partiellement numérisées", score: 1 }, { label: "La plupart des transactions sont numériques", score: 2 }, { label: "100% numérique avec traitement automatisé bout en bout", score: 3 }] },
    { id: 7,  q: "Votre conformité réglementaire (KYC, AML, reporting) est-elle numérisée ?", answers: [{ label: "Non, processus manuels", score: 0 }, { label: "Outils basiques sans automatisation", score: 1 }, { label: "KYC numérique partiel + reporting semi-automatisé", score: 2 }, { label: "Conformité entièrement automatisée avec alertes temps réel", score: 3 }] },
    { id: 8,  q: "Utilisez-vous le scoring automatisé ou l'analyse de risque par IA ?", answers: [{ label: "Non, évaluation manuelle uniquement", score: 0 }, { label: "Règles métier simples", score: 1 }, { label: "Modèles de scoring statistiques", score: 2 }, { label: "IA/ML pour scoring, risque et détection d'anomalies", score: 3 }] },
    { id: 9,  q: "Proposez-vous une application mobile à vos clients ?", answers: [{ label: "Non", score: 0 }, { label: "Site web responsive uniquement", score: 1 }, { label: "Application mobile basique", score: 2 }, { label: "App mobile riche avec toutes les fonctionnalités core", score: 3 }] },
    { id: 10, q: "Les données financières clients sont-elles chiffrées et sécurisées ?", answers: [{ label: "Non, sécurité minimale", score: 0 }, { label: "Chiffrement basique", score: 1 }, { label: "Chiffrement + contrôle d'accès", score: 2 }, { label: "Sécurité by design + audit régulier + certifications (ISO 27001...)", score: 3 }] },
    { id: 11, q: "La gestion des réclamations clients est-elle numérisée ?", answers: [{ label: "Non, courrier et téléphone uniquement", score: 0 }, { label: "Email uniquement", score: 1 }, { label: "Système de ticketing", score: 2 }, { label: "CRM + workflow réclamations avec SLA et escalade automatique", score: 3 }] },
    { id: 12, q: "Le reporting réglementaire est-il automatisé ?", answers: [{ label: "Non, manuel", score: 0 }, { label: "Semi-automatisé avec intervention humaine importante", score: 1 }, { label: "Automatisation partielle", score: 2 }, { label: "Reporting réglementaire entièrement automatisé et soumis en ligne", score: 3 }] },
    { id: 13, q: "Utilisez-vous l'IA pour la détection de fraude ?", answers: [{ label: "Non", score: 0 }, { label: "Règles métier fixes", score: 1 }, { label: "Modèles de détection d'anomalies", score: 2 }, { label: "IA temps réel pour fraude avec ajustement continu", score: 3 }] },
    { id: 14, q: "Mesurez-vous l'expérience client digitale (NPS, satisfaction app) ?", answers: [{ label: "Non", score: 0 }, { label: "Enquêtes annuelles non digitales", score: 1 }, { label: "NPS digital ou évaluation app", score: 2 }, { label: "Mesure continue expérience digitale avec boucle de rétroaction", score: 3 }] },
    { id: 15, q: "Êtes-vous intégré avec des partenaires fintech ou des API bancaires tierces ?", answers: [{ label: "Non, système fermé", score: 0 }, { label: "Quelques connexions manuelles", score: 1 }, { label: "Intégrations partielles via API", score: 2 }, { label: "Écosystème open banking / fintech intégré", score: 3 }] },
    { id: 16, q: "Vos équipes sont-elles formées à la réglementation numérique financière ?", answers: [{ label: "Non", score: 0 }, { label: "Formation ad hoc lors de changements réglementaires", score: 1 }, { label: "Formations régulières sur les évolutions", score: 2 }, { label: "Programme de formation continue réglementaire + veille", score: 3 }] },
    { id: 17, q: "Exploitez-vous les données comportementales financières clients pour personnaliser l'offre ?", answers: [{ label: "Non", score: 0 }, { label: "Segmentation basique", score: 1 }, { label: "Analyse des comportements pour ciblage commercial", score: 2 }, { label: "Hyperpersonnalisation pilotée par la data et l'IA", score: 3 }] },
    { id: 18, q: "Le back-office est-il automatisé (traitements, réconciliations, virements) ?", answers: [{ label: "Non, traitement manuel", score: 0 }, { label: "Partiellement automatisé", score: 1 }, { label: "Majorité des processus automatisés", score: 2 }, { label: "Back-office full STP (Straight Through Processing)", score: 3 }] },
    { id: 19, q: "Communiquez-vous avec vos clients sur plusieurs canaux digitaux ?", answers: [{ label: "Non, courrier et téléphone uniquement", score: 0 }, { label: "Email", score: 1 }, { label: "App + email + SMS", score: 2 }, { label: "Stratégie omnicanal (app, email, SMS, push, chat, réseaux)", score: 3 }] },
    { id: 20, q: "Avez-vous un plan de continuité d'activité numérique testé ?", answers: [{ label: "Non", score: 0 }, { label: "Plan théorique non testé", score: 1 }, { label: "Plan documenté et partiellement testé", score: 2 }, { label: "PCA entièrement testé + exercices réguliers + RTO/RPO définis", score: 3 }] },
  ],
};

// AF sector questions — adapted for African context
const SECTOR_QUESTIONS_AF = {
  commerce: [
    { id: 6,  q: "Vendez-vous en ligne ou via WhatsApp Business ?", answers: [{ label: "Non, vente physique uniquement", score: 0 }, { label: "WhatsApp personnel pour les commandes", score: 1 }, { label: "WhatsApp Business ou page Facebook shop", score: 2 }, { label: "Site e-commerce ou plateforme avec paiement Mobile Money", score: 3 }] },
    { id: 7,  q: "Utilisez-vous un logiciel de caisse ou de gestion des ventes ?", answers: [{ label: "Non, cahier et mémoire", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Application de caisse ou gestion simple", score: 2 }, { label: "Logiciel POS complet avec stocks et rapports", score: 3 }] },
    { id: 8,  q: "Gérez-vous vos stocks avec un outil numérique ?", answers: [{ label: "Non, à vue ou sur papier", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Application de gestion des stocks", score: 2 }, { label: "Gestion stocks en temps réel avec alertes rupture", score: 3 }] },
    { id: 9,  q: "Informez-vous vos clients de vos promotions par SMS, WhatsApp ou email ?", answers: [{ label: "Non", score: 0 }, { label: "Bouche à oreille uniquement", score: 1 }, { label: "Messages WhatsApp ou SMS ponctuels", score: 2 }, { label: "Campagnes régulières avec liste de contacts organisée", score: 3 }] },
    { id: 10, q: "Analysez-vous quels produits se vendent le mieux ?", answers: [{ label: "Non, intuitif uniquement", score: 0 }, { label: "Observation sans données précises", score: 1 }, { label: "Suivi sur tableur mensuel", score: 2 }, { label: "Tableau de bord ventes par produit et catégorie", score: 3 }] },
    { id: 11, q: "Acceptez-vous le paiement Mobile Money (Orange Money, MTN, Wave...) ?", answers: [{ label: "Non, espèces uniquement", score: 0 }, { label: "Un opérateur Mobile Money", score: 1 }, { label: "Plusieurs opérateurs Mobile Money", score: 2 }, { label: "Multi-paiement (Mobile Money + virement + espèces) + reçus numériques", score: 3 }] },
    { id: 12, q: "Avez-vous un système de fidélité pour vos clients réguliers ?", answers: [{ label: "Non", score: 0 }, { label: "Remises informelles pour les habitués", score: 1 }, { label: "Carte de fidélité ou suivi numérique simple", score: 2 }, { label: "Programme fidélité avec historique et récompenses automatiques", score: 3 }] },
    { id: 13, q: "Gérez-vous vos commandes fournisseurs par voie numérique ?", answers: [{ label: "Non, appels et papier", score: 0 }, { label: "WhatsApp ou SMS avec les fournisseurs", score: 1 }, { label: "Email + suivi tableur", score: 2 }, { label: "Commandes en ligne avec suivi et historique", score: 3 }] },
    { id: 14, q: "Utilisez-vous Facebook, Instagram ou TikTok pour vendre vos produits ?", answers: [{ label: "Non", score: 0 }, { label: "Pages existantes sans publications commerciales", score: 1 }, { label: "Publications produits régulières", score: 2 }, { label: "Publicités ciblées + boutique sociale + ventes mesurées", score: 3 }] },
    { id: 15, q: "Informez-vous vos clients du statut de leurs livraisons ?", answers: [{ label: "Non", score: 0 }, { label: "Appel téléphonique quand la livraison part", score: 1 }, { label: "Message WhatsApp avec numéro de suivi", score: 2 }, { label: "Notification automatique à chaque étape", score: 3 }] },
    { id: 16, q: "Gérez-vous les avis et retours de vos clients ?", answers: [{ label: "Non", score: 0 }, { label: "Retours verbaux pris en compte informellement", score: 1 }, { label: "Avis collectés sur WhatsApp ou réseaux", score: 2 }, { label: "Stratégie d'avis clients avec réponses et amélioration continue", score: 3 }] },
    { id: 17, q: "Le service après-vente ou les retours sont-ils gérés numériquement ?", answers: [{ label: "Non, uniquement de vive voix", score: 0 }, { label: "WhatsApp ou téléphone", score: 1 }, { label: "Suivi SAV sur tableur ou messagerie", score: 2 }, { label: "Système SAV structuré avec suivi et délais", score: 3 }] },
    { id: 18, q: "Savez-vous quels produits sont les plus consultés sur votre page/boutique ?", answers: [{ label: "Non", score: 0 }, { label: "On observe les réactions/commentaires", score: 1 }, { label: "Statistiques basiques des réseaux", score: 2 }, { label: "Analytics e-commerce complets (vues, taux d'achat, abandon)", score: 3 }] },
    { id: 19, q: "Mettez-vous à jour vos prix en ligne facilement ?", answers: [{ label: "Non, prix verbaux uniquement", score: 0 }, { label: "Mise à jour manuelle lente", score: 1 }, { label: "Prix centralisés mis à jour régulièrement", score: 2 }, { label: "Prix synchronisés automatiquement sur tous les canaux", score: 3 }] },
    { id: 20, q: "Vendez-vous à la fois en boutique physique et en ligne de façon coordonnée ?", answers: [{ label: "Non, un seul canal", score: 0 }, { label: "Les deux existent mais séparément", score: 1 }, { label: "On commence à coordonner les deux", score: 2 }, { label: "Vente unifiée online + offline avec stock et prix synchronisés", score: 3 }] },
  ],
  sante: [
    { id: 6,  q: "Les dossiers de vos patients sont-ils gérés numériquement ?", answers: [{ label: "Non, tout est sur papier", score: 0 }, { label: "Quelques fichiers Excel ou Word", score: 1 }, { label: "Logiciel de dossiers patients", score: 2 }, { label: "Système numérique complet et sécurisé", score: 3 }] },
    { id: 7,  q: "Peut-on prendre rendez-vous chez vous par WhatsApp ou en ligne ?", answers: [{ label: "Non, uniquement en venant au cabinet", score: 0 }, { label: "Appel téléphonique uniquement", score: 1 }, { label: "WhatsApp ou formulaire en ligne", score: 2 }, { label: "Plateforme de RDV en ligne avec rappels automatiques", score: 3 }] },
    { id: 8,  q: "Proposez-vous des consultations à distance (téléphone, vidéo) ?", answers: [{ label: "Non", score: 0 }, { label: "Parfois par appel téléphonique", score: 1 }, { label: "Consultations vidéo disponibles (WhatsApp Video, Zoom)", score: 2 }, { label: "Téléconsultation intégrée avec dossier patient", score: 3 }] },
    { id: 9,  q: "Utilisez-vous un logiciel de gestion de votre cabinet ou clinique ?", answers: [{ label: "Non", score: 0 }, { label: "Tableur pour la facturation", score: 1 }, { label: "Logiciel de gestion basique", score: 2 }, { label: "Logiciel complet (agenda, dossier, facturation, stats)", score: 3 }] },
    { id: 10, q: "Communiquez-vous numériquement avec vos patients (résultats, rappels) ?", answers: [{ label: "Non, uniquement en présentiel", score: 0 }, { label: "Appel téléphonique", score: 1 }, { label: "SMS ou WhatsApp pour les résultats et rappels", score: 2 }, { label: "Portail patient sécurisé ou application dédiée", score: 3 }] },
    { id: 11, q: "Vos ordonnances sont-elles numérisées ou imprimées via logiciel ?", answers: [{ label: "Non, manuscrites uniquement", score: 0 }, { label: "Modèles Word imprimés", score: 1 }, { label: "Ordonnances imprimées via logiciel", score: 2 }, { label: "Ordonnances électroniques transmises directement", score: 3 }] },
    { id: 12, q: "Gérez-vous vos stocks de médicaments ou de fournitures numériquement ?", answers: [{ label: "Non, à vue", score: 0 }, { label: "Cahier ou tableur", score: 1 }, { label: "Application de gestion des stocks médicaux", score: 2 }, { label: "Gestion automatique avec alertes rupture et commandes", score: 3 }] },
    { id: 13, q: "La facturation de vos prestations est-elle numérisée ?", answers: [{ label: "Non, reçus manuscrits", score: 0 }, { label: "Reçus Word ou Excel", score: 1 }, { label: "Logiciel de facturation médicale", score: 2 }, { label: "Facturation automatisée avec remboursements et assurances", score: 3 }] },
    { id: 14, q: "Protégez-vous numériquement les données confidentielles de vos patients ?", answers: [{ label: "Non", score: 0 }, { label: "Accès limité mais sans mesures formelles", score: 1 }, { label: "Mots de passe et accès contrôlés", score: 2 }, { label: "Politique de confidentialité + chiffrement + sauvegardes", score: 3 }] },
    { id: 15, q: "Suivez-vous certains patients à distance via des outils numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Par appel téléphonique occasionnel", score: 1 }, { label: "WhatsApp ou SMS de suivi", score: 2 }, { label: "Application ou plateforme de suivi patient à distance", score: 3 }] },
    { id: 16, q: "Êtes-vous connecté aux laboratoires et pharmacies pour les résultats et ordonnances ?", answers: [{ label: "Non, tout est papier", score: 0 }, { label: "Email ou WhatsApp", score: 1 }, { label: "Connexion partielle avec certains partenaires", score: 2 }, { label: "Échange numérique automatisé avec les partenaires", score: 3 }] },
    { id: 17, q: "Mesurez-vous la qualité de vos soins avec des indicateurs ?", answers: [{ label: "Non", score: 0 }, { label: "Observation informelle", score: 1 }, { label: "Quelques indicateurs suivis manuellement", score: 2 }, { label: "Tableau de bord qualité suivi régulièrement", score: 3 }] },
    { id: 18, q: "Vos données médicales sont-elles sauvegardées de façon sécurisée ?", answers: [{ label: "Non, sur un seul appareil", score: 0 }, { label: "Copie manuelle occasionnelle", score: 1 }, { label: "Sauvegarde cloud régulière", score: 2 }, { label: "Sauvegarde automatique + chiffrement + accès sécurisé", score: 3 }] },
    { id: 19, q: "Votre équipe est-elle formée aux outils numériques de santé ?", answers: [{ label: "Non", score: 0 }, { label: "Apprentissage sur le tas", score: 1 }, { label: "Quelques formations organisées", score: 2 }, { label: "Formation continue au numérique médical", score: 3 }] },
    { id: 20, q: "Utilisez-vous des outils d'aide à la décision ou des applications médicales spécialisées ?", answers: [{ label: "Non", score: 0 }, { label: "Applications grand public uniquement", score: 1 }, { label: "Applications médicales spécialisées pour certains cas", score: 2 }, { label: "Outils d'aide décision intégrés au parcours de soins", score: 3 }] },
  ],
  administration: SECTOR_QUESTIONS_FR.administration,
  btp: [
    { id: 6,  q: "Vos plans de chantier sont-ils partagés numériquement ?", answers: [{ label: "Non, copies papier uniquement", score: 0 }, { label: "Photos WhatsApp des plans", score: 1 }, { label: "Plans PDF partagés par WhatsApp/email", score: 2 }, { label: "Plans numériques sur plateforme partagée en temps réel", score: 3 }] },
    { id: 7,  q: "Gérez-vous l'avancement de vos chantiers via une application ?", answers: [{ label: "Non, réunions sur place uniquement", score: 0 }, { label: "Messages WhatsApp avec photos", score: 1 }, { label: "Application de reporting chantier basique", score: 2 }, { label: "Plateforme de gestion chantier complète", score: 3 }] },
    { id: 8,  q: "Suivez-vous numériquement l'avancement des travaux ?", answers: [{ label: "Non", score: 0 }, { label: "Tableau papier ou Excel", score: 1 }, { label: "Planning numérique mis à jour", score: 2 }, { label: "Suivi temps réel avec alertes et rapports automatiques", score: 3 }] },
    { id: 9,  q: "Répondez-vous aux appels d'offres en ligne ?", answers: [{ label: "Non, courrier uniquement", score: 0 }, { label: "Email pour transmettre les dossiers", score: 1 }, { label: "Dépôt en ligne quand disponible", score: 2 }, { label: "Veille AO + dépôt dématérialisé systématique", score: 3 }] },
    { id: 10, q: "Gérez-vous la présence et le pointage de vos équipes numériquement ?", answers: [{ label: "Non, feuilles papier", score: 0 }, { label: "Tableur rempli manuellement", score: 1 }, { label: "Application mobile de pointage", score: 2 }, { label: "Gestion RH chantier intégrée", score: 3 }] },
    { id: 11, q: "Commandez-vous vos matériaux par voie numérique ?", answers: [{ label: "Non, déplacement physique ou appel", score: 0 }, { label: "WhatsApp avec les fournisseurs", score: 1 }, { label: "Email + suivi tableur", score: 2 }, { label: "Plateforme d'achat intégrée avec historique", score: 3 }] },
    { id: 12, q: "Rédigez-vous des rapports de chantier via votre téléphone ou tablette ?", answers: [{ label: "Non, rapports papier", score: 0 }, { label: "Photos WhatsApp envoyées au chef de projet", score: 1 }, { label: "Rapports numériques structurés", score: 2 }, { label: "Rapports automatisés avec GPS et horodatage", score: 3 }] },
    { id: 13, q: "La facturation et les devis sont-ils faits numériquement ?", answers: [{ label: "Non, manuscrits", score: 0 }, { label: "Word ou Excel basique", score: 1 }, { label: "Logiciel de devis/facturation", score: 2 }, { label: "Facturation intégrée au suivi chantier", score: 3 }] },
    { id: 14, q: "Suivez-vous la sécurité et la qualité de vos chantiers numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Checklist papier", score: 1 }, { label: "Formulaires numériques de contrôle", score: 2 }, { label: "Plateforme QHSE avec traçabilité complète", score: 3 }] },
    { id: 15, q: "Partagez-vous les documents chantier avec tous les intervenants via le cloud ?", answers: [{ label: "Non, copies physiques", score: 0 }, { label: "WhatsApp pour les documents urgents", score: 1 }, { label: "Google Drive ou Dropbox partagé", score: 2 }, { label: "Plateforme documentaire structurée avec gestion des versions", score: 3 }] },
    { id: 16, q: "Gérez-vous la logistique et l'approvisionnement chantier numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Suivi manuel", score: 1 }, { label: "Tableur de suivi", score: 2 }, { label: "Logiciel logistique avec traçabilité", score: 3 }] },
    { id: 17, q: "Les formations sécurité sont-elles suivies et documentées numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Registre papier", score: 1 }, { label: "Tableur de suivi des habilitations", score: 2 }, { label: "Application de suivi formation sécurité", score: 3 }] },
    { id: 18, q: "Communiquez-vous numériquement avec vos clients sur l'avancement des travaux ?", answers: [{ label: "Non, réunions uniquement", score: 0 }, { label: "Appels téléphoniques", score: 1 }, { label: "Rapports WhatsApp ou email réguliers", score: 2 }, { label: "Portail client avec suivi avancement en temps réel", score: 3 }] },
    { id: 19, q: "Suivez-vous le budget de vos chantiers numériquement ?", answers: [{ label: "Non, approximatif", score: 0 }, { label: "Tableur Excel", score: 1 }, { label: "Logiciel de suivi budgétaire", score: 2 }, { label: "Contrôle budgétaire intégré avec alertes dépassement", score: 3 }] },
    { id: 20, q: "Utilisez-vous des technologies avancées sur chantier (drones, capteurs) ?", answers: [{ label: "Non", score: 0 }, { label: "On y réfléchit", score: 1 }, { label: "Quelques expérimentations", score: 2 }, { label: "Drones ou capteurs intégrés au suivi chantier", score: 3 }] },
  ],
  agriculture: [
    { id: 6,  q: "Utilisez-vous des applications pour suivre votre exploitation ?", answers: [{ label: "Non, observation empirique", score: 0 }, { label: "Applications météo grand public", score: 1 }, { label: "Application agricole spécialisée", score: 2 }, { label: "Plateforme de gestion exploitation complète", score: 3 }] },
    { id: 7,  q: "Gérez-vous vos cultures via une application ou un carnet numérique ?", answers: [{ label: "Non", score: 0 }, { label: "Notes sur téléphone", score: 1 }, { label: "Application de suivi cultures", score: 2 }, { label: "ERP agricole ou plateforme de gestion complète", score: 3 }] },
    { id: 8,  q: "Vendez-vous vos productions en ligne ou via WhatsApp ?", answers: [{ label: "Non, marché ou intermédiaire uniquement", score: 0 }, { label: "WhatsApp avec acheteurs connus", score: 1 }, { label: "Groupe WhatsApp acheteurs + réseau", score: 2 }, { label: "Plateforme agricole en ligne (e-commerce ou agrégateur)", score: 3 }] },
    { id: 9,  q: "Tracez-vous numériquement la provenance de vos produits ?", answers: [{ label: "Non", score: 0 }, { label: "Étiquettes manuscrites", score: 1 }, { label: "Enregistrements numériques partiels", score: 2 }, { label: "Traçabilité numérique complète du champ à l'acheteur", score: 3 }] },
    { id: 10, q: "Commandez-vous vos intrants (semences, engrais) en ligne ou par WhatsApp ?", answers: [{ label: "Non, toujours en présentiel", score: 0 }, { label: "Appel téléphonique", score: 1 }, { label: "WhatsApp avec les fournisseurs", score: 2 }, { label: "Commandes en ligne avec suivi et historique", score: 3 }] },
    { id: 11, q: "Utilisez-vous des capteurs ou appareils connectés sur votre exploitation ?", answers: [{ label: "Non", score: 0 }, { label: "On connait mais rien de déployé", score: 1 }, { label: "Quelques capteurs basiques (humidité, météo)", score: 2 }, { label: "Réseau de capteurs intégré à la gestion", score: 3 }] },
    { id: 12, q: "Utilisez-vous des données précises (GPS, cartographie) pour gérer vos parcelles ?", answers: [{ label: "Non", score: 0 }, { label: "Délimitation approximative", score: 1 }, { label: "Cartographie GPS basique", score: 2 }, { label: "Agriculture de précision avec données sol et modulation", score: 3 }] },
    { id: 13, q: "Avez-vous reçu une formation aux technologies agricoles numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Autodidacte", score: 1 }, { label: "Formation ponctuelle (ONG, État, chambre agri)", score: 2 }, { label: "Formation continue + accompagnement agri-tech", score: 3 }] },
    { id: 14, q: "Gérez-vous vos revenus et dépenses agricoles numériquement ?", answers: [{ label: "Non, cahier", score: 0 }, { label: "Tableur ou application de notes", score: 1 }, { label: "Application de comptabilité agricole", score: 2 }, { label: "Gestion financière intégrée exploitation (coûts, marges, investissements)", score: 3 }] },
    { id: 15, q: "Communiquez-vous numériquement avec vos acheteurs et exportateurs ?", answers: [{ label: "Non, présence physique uniquement", score: 0 }, { label: "Appel téléphonique", score: 1 }, { label: "WhatsApp ou email", score: 2 }, { label: "Plateforme ou groupe professionnel organisé", score: 3 }] },
    { id: 16, q: "Gérez-vous vos certifications (bio, qualité) numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Documents papier conservés", score: 1 }, { label: "Copies numériques organisées", score: 2 }, { label: "Gestion certifications intégrée avec organismes", score: 3 }] },
    { id: 17, q: "Suivez-vous les prix des marchés agricoles via votre téléphone ?", answers: [{ label: "Non", score: 0 }, { label: "Informations des voisins et commerçants", score: 1 }, { label: "Applications ou SMS de cours des marchés", score: 2 }, { label: "Données marché intégrées aux décisions de vente", score: 3 }] },
    { id: 18, q: "Votre irrigation est-elle automatisée ou assistée numériquement ?", answers: [{ label: "Non, manuelle à 100%", score: 0 }, { label: "Timers simples", score: 1 }, { label: "Irrigation semi-automatique", score: 2 }, { label: "Irrigation de précision pilotée par données", score: 3 }] },
    { id: 19, q: "Utilisez-vous des drones ou des images satellites pour surveiller vos cultures ?", answers: [{ label: "Non", score: 0 }, { label: "Expérimentation ponctuelle", score: 1 }, { label: "Survol périodique", score: 2 }, { label: "Monitoring intégré à la gestion des parcelles", score: 3 }] },
    { id: 20, q: "Êtes-vous membre d'un réseau ou coopérative qui partage des ressources numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Réseau informel d'agriculteurs", score: 1 }, { label: "Coopérative ou association avec ressources partagées", score: 2 }, { label: "Réseau actif avec partage d'outils, données et innovations", score: 3 }] },
  ],
  education: SECTOR_QUESTIONS_FR.education,
  telecom: SECTOR_QUESTIONS_FR.telecom,
  finance: [
    { id: 6,  q: "Les transactions de vos clients sont-elles entièrement numériques ?", answers: [{ label: "Non, espèces et papier majoritaires", score: 0 }, { label: "Partiellement numériques", score: 1 }, { label: "La majorité des transactions est numérique", score: 2 }, { label: "100% numérique avec Mobile Money et virements intégrés", score: 3 }] },
    { id: 7,  q: "Vérifiez-vous l'identité de vos clients (KYC) numériquement ?", answers: [{ label: "Non, vérification manuelle", score: 0 }, { label: "Copies papier des documents", score: 1 }, { label: "KYC numérique partiel", score: 2 }, { label: "KYC entièrement numérique et automatisé", score: 3 }] },
    { id: 8,  q: "Utilisez-vous un scoring ou une analyse de risque automatisée ?", answers: [{ label: "Non, décision intuitive", score: 0 }, { label: "Règles simples appliquées manuellement", score: 1 }, { label: "Modèles de scoring basiques", score: 2 }, { label: "Scoring automatisé ou IA", score: 3 }] },
    { id: 9,  q: "Vos clients peuvent-ils accéder à leurs comptes via mobile ou internet ?", answers: [{ label: "Non, guichet uniquement", score: 0 }, { label: "SMS de solde", score: 1 }, { label: "Application mobile ou site basique", score: 2 }, { label: "Application complète avec toutes les fonctionnalités", score: 3 }] },
    { id: 10, q: "Les données financières de vos clients sont-elles sécurisées numériquement ?", answers: [{ label: "Non, sécurité minimale", score: 0 }, { label: "Mots de passe simples", score: 1 }, { label: "Chiffrement + contrôle d'accès", score: 2 }, { label: "Sécurité complète + audit régulier", score: 3 }] },
    { id: 11, q: "Les réclamations clients sont-elles gérées numériquement ?", answers: [{ label: "Non, verbalement", score: 0 }, { label: "Registre papier des réclamations", score: 1 }, { label: "Email ou formulaire numérique", score: 2 }, { label: "CRM + workflow réclamations avec suivi et délais", score: 3 }] },
    { id: 12, q: "Les rapports réglementaires sont-ils produits automatiquement ?", answers: [{ label: "Non, manuels", score: 0 }, { label: "Semi-automatisés avec beaucoup de saisie", score: 1 }, { label: "Partiellement automatisés", score: 2 }, { label: "Entièrement automatisés et soumis en ligne", score: 3 }] },
    { id: 13, q: "Utilisez-vous des outils numériques pour détecter les fraudes ?", answers: [{ label: "Non", score: 0 }, { label: "Vérification manuelle des anomalies", score: 1 }, { label: "Règles automatiques basiques", score: 2 }, { label: "Détection fraude par IA en temps réel", score: 3 }] },
    { id: 14, q: "Mesurez-vous la satisfaction de vos clients numériquement ?", answers: [{ label: "Non", score: 0 }, { label: "Retours informels", score: 1 }, { label: "Sondage périodique", score: 2 }, { label: "NPS automatisé + analyse continue", score: 3 }] },
    { id: 15, q: "Êtes-vous intégré à des partenaires fintech ou Mobile Money ?", answers: [{ label: "Non, système fermé", score: 0 }, { label: "Connexions manuelles ponctuelles", score: 1 }, { label: "Quelques intégrations partielles", score: 2 }, { label: "Écosystème fintech/Mobile Money pleinement intégré", score: 3 }] },
    { id: 16, q: "Vos équipes sont-elles formées aux réglementations numériques financières ?", answers: [{ label: "Non", score: 0 }, { label: "Formation ad hoc uniquement", score: 1 }, { label: "Formations régulières sur les évolutions", score: 2 }, { label: "Programme de formation continue réglementaire", score: 3 }] },
    { id: 17, q: "Utilisez-vous les données clients pour personnaliser vos offres ?", answers: [{ label: "Non", score: 0 }, { label: "Segmentation basique", score: 1 }, { label: "Ciblage commercial sur critères simples", score: 2 }, { label: "Personnalisation pilotée par la data", score: 3 }] },
    { id: 18, q: "Vos processus de back-office sont-ils automatisés ?", answers: [{ label: "Non, traitement entièrement manuel", score: 0 }, { label: "Partiellement automatisés", score: 1 }, { label: "La majorité est automatisée", score: 2 }, { label: "Back-office STP avec très peu d'interventions manuelles", score: 3 }] },
    { id: 19, q: "Communiquez-vous avec vos clients sur plusieurs canaux numériques ?", answers: [{ label: "Non, uniquement guichet et téléphone", score: 0 }, { label: "SMS uniquement", score: 1 }, { label: "App + SMS + email", score: 2 }, { label: "Stratégie omnicanal (app, WhatsApp, email, SMS, agences)", score: 3 }] },
    { id: 20, q: "Avez-vous un plan de continuité numérique testé en cas de panne ?", answers: [{ label: "Non", score: 0 }, { label: "Plan informel non testé", score: 1 }, { label: "Plan documenté partiellement testé", score: 2 }, { label: "PCA complet testé régulièrement", score: 3 }] },
  ],
  transport: [
    { id: 6,  q: "Gérez-vous vos réservations et courses via une application ou WhatsApp ?", answers: [{ label: "Non, uniquement par appel ou en présentiel", score: 0 }, { label: "WhatsApp pour les demandes", score: 1 }, { label: "Application ou formulaire en ligne", score: 2 }, { label: "Plateforme de réservation intégrée avec suivi", score: 3 }] },
    { id: 7,  q: "Acceptez-vous le paiement Mobile Money (Wave, Orange Money, MTN...) ?", answers: [{ label: "Non, espèces uniquement", score: 0 }, { label: "Un opérateur Mobile Money", score: 1 }, { label: "Plusieurs opérateurs Mobile Money", score: 2 }, { label: "Multi-paiement + reçus automatiques + historique", score: 3 }] },
    { id: 8,  q: "Suivez-vous la position de vos véhicules numériquement ?", answers: [{ label: "Non, contact téléphonique uniquement", score: 0 }, { label: "Partage de position WhatsApp ponctuel", score: 1 }, { label: "Application de géolocalisation basique", score: 2 }, { label: "Suivi GPS temps réel intégré à la gestion flotte", score: 3 }] },
    { id: 9,  q: "Gérez-vous les plannings et affectations de vos chauffeurs numériquement ?", answers: [{ label: "Non, à l'oral ou sur papier", score: 0 }, { label: "Groupe WhatsApp pour les courses", score: 1 }, { label: "Tableur de planning", score: 2 }, { label: "Application de dispatch avec affectation automatique", score: 3 }] },
    { id: 10, q: "Émettez-vous des factures ou reçus numériques à vos clients ?", answers: [{ label: "Non, reçus manuscrits ou aucun reçu", score: 0 }, { label: "Reçus WhatsApp ou SMS", score: 1 }, { label: "Factures Word ou Excel envoyées par email", score: 2 }, { label: "Facturation automatisée avec historique client", score: 3 }] },
    { id: 11, q: "Gérez-vous l'entretien et la conformité de votre flotte numériquement ?", answers: [{ label: "Non, à la mémoire", score: 0 }, { label: "Cahier de bord papier", score: 1 }, { label: "Tableur de suivi entretien", score: 2 }, { label: "Application de gestion flotte (entretien, assurances, contrôles)", score: 3 }] },
    { id: 12, q: "Calculez-vous vos coûts par trajet (carburant, entretien, amortissement) ?", answers: [{ label: "Non, approximatif", score: 0 }, { label: "Calcul manuel mensuel", score: 1 }, { label: "Suivi tableur par véhicule", score: 2 }, { label: "Analyse automatisée coûts/revenus par trajet", score: 3 }] },
    { id: 13, q: "Avez-vous une présence en ligne pour attirer de nouveaux clients ?", answers: [{ label: "Non, uniquement bouche-à-oreille", score: 0 }, { label: "Page Facebook ou Instagram uniquement", score: 1 }, { label: "Page active + numéro WhatsApp Business visible", score: 2 }, { label: "Site web + réseaux + Google Maps + avis clients", score: 3 }] },
    { id: 14, q: "Communiquez-vous régulièrement avec vos clients par voie numérique ?", answers: [{ label: "Non", score: 0 }, { label: "Appels téléphoniques uniquement", score: 1 }, { label: "SMS ou WhatsApp pour les confirmations", score: 2 }, { label: "Notifications automatiques + newsletter clients réguliers", score: 3 }] },
    { id: 15, q: "Gérez-vous vos stocks de pièces détachées ou consommables numériquement ?", answers: [{ label: "Non, à vue", score: 0 }, { label: "Cahier ou mémoire", score: 1 }, { label: "Tableur de stock", score: 2 }, { label: "Application de gestion stocks avec alertes rupture", score: 3 }] },
    { id: 16, q: "Analysez-vous vos itinéraires pour optimiser les coûts et délais ?", answers: [{ label: "Non, routes habituelles", score: 0 }, { label: "Google Maps pour les trajets inconnus", score: 1 }, { label: "Optimisation systématique via GPS/maps", score: 2 }, { label: "Outil d'optimisation de tournées avec historique", score: 3 }] },
    { id: 17, q: "Gérez-vous la conformité réglementaire (permis, assurances, visites techniques) numériquement ?", answers: [{ label: "Non, papiers sans suivi", score: 0 }, { label: "Copies numérisées stockées", score: 1 }, { label: "Tableur de suivi des échéances", score: 2 }, { label: "Application avec rappels automatiques d'échéances", score: 3 }] },
    { id: 18, q: "Collectez-vous les avis et retours de vos clients ?", answers: [{ label: "Non", score: 0 }, { label: "Retours verbaux informels", score: 1 }, { label: "Avis Google ou Facebook", score: 2 }, { label: "Système de notation automatique après chaque course", score: 3 }] },
    { id: 19, q: "Formez-vous vos chauffeurs ou équipes aux outils numériques ?", answers: [{ label: "Non", score: 0 }, { label: "Apprentissage sur le tas", score: 1 }, { label: "Formation informelle entre collègues", score: 2 }, { label: "Formation organisée aux outils utilisés", score: 3 }] },
    { id: 20, q: "Utilisez-vous des données pour améliorer votre service (délais, taux de service, satisfaction) ?", answers: [{ label: "Non", score: 0 }, { label: "Observation informelle", score: 1 }, { label: "Quelques indicateurs suivis", score: 2 }, { label: "Tableau de bord performance avec revues régulières", score: 3 }] },
  ],
  restauration: [
    { id: 6,  q: "Prenez-vous des commandes en ligne, via WhatsApp ou une application ?", answers: [{ label: "Non, uniquement au comptoir ou par appel", score: 0 }, { label: "Commandes WhatsApp ponctuelles", score: 1 }, { label: "WhatsApp Business ou page de commande en ligne", score: 2 }, { label: "Plateforme de commande intégrée (Jumia Food, propre site) + paiement Mobile Money", score: 3 }] },
    { id: 7,  q: "Gérez-vous votre stock de matières premières numériquement ?", answers: [{ label: "Non, à vue ou en mémoire", score: 0 }, { label: "Cahier de stock", score: 1 }, { label: "Tableur de suivi hebdomadaire", score: 2 }, { label: "Application de gestion stocks avec alertes de rupture", score: 3 }] },
    { id: 8,  q: "Acceptez-vous le paiement Mobile Money (Wave, Orange Money, MTN...) ?", answers: [{ label: "Non, espèces uniquement", score: 0 }, { label: "Un opérateur Mobile Money", score: 1 }, { label: "Plusieurs opérateurs + espèces", score: 2 }, { label: "Multi-paiement avec reçus numériques", score: 3 }] },
    { id: 9,  q: "Publiez-vous votre menu ou vos offres du jour sur les réseaux sociaux ?", answers: [{ label: "Non", score: 0 }, { label: "Occasion­nellement sans stratégie", score: 1 }, { label: "Publications régulières (Facebook, Instagram, WhatsApp Status)", score: 2 }, { label: "Stratégie sociale avec photos professionnelles, horaires, promotions", score: 3 }] },
    { id: 10, q: "Calculez-vous vos coûts de revient par plat ou menu ?", answers: [{ label: "Non, prix fixés à l'intuition", score: 0 }, { label: "Estimation approximative", score: 1 }, { label: "Calcul manuel des coûts principaux", score: 2 }, { label: "Fiche technique par plat avec coût, marge et prix de vente", score: 3 }] },
    { id: 11, q: "Gérez-vous vos approvisionnements et fournisseurs numériquement ?", answers: [{ label: "Non, marché au jour le jour", score: 0 }, { label: "Appels et WhatsApp avec les fournisseurs", score: 1 }, { label: "Listes de commandes sur tableur ou WhatsApp organisé", score: 2 }, { label: "Gestion fournisseurs intégrée avec historique et comparatifs", score: 3 }] },
    { id: 12, q: "Émettez-vous des factures ou reçus numériques à vos clients ?", answers: [{ label: "Non", score: 0 }, { label: "Reçus manuscrits", score: 1 }, { label: "Reçus imprimés ou Word", score: 2 }, { label: "Facturation numérique automatique", score: 3 }] },
    { id: 13, q: "Utilisez-vous un logiciel de gestion de restaurant ou de caisse ?", answers: [{ label: "Non, tout est manuel", score: 0 }, { label: "Tableur pour les ventes", score: 1 }, { label: "Application de caisse ou gestion basique", score: 2 }, { label: "Logiciel de restaurant complet (commandes, stock, caisse, analytics)", score: 3 }] },
    { id: 14, q: "Proposez-vous la livraison à domicile ou le click & collect ?", answers: [{ label: "Non, sur place uniquement", score: 0 }, { label: "Livraison informelle via WhatsApp", score: 1 }, { label: "Livraison organisée avec livreurs ou plateforme", score: 2 }, { label: "Livraison + click & collect + paiement en ligne intégrés", score: 3 }] },
    { id: 15, q: "Gérez-vous les plannings et horaires de votre équipe numériquement ?", answers: [{ label: "Non, à l'oral", score: 0 }, { label: "Tableau papier ou WhatsApp", score: 1 }, { label: "Tableur de planning", score: 2 }, { label: "Application de gestion RH avec pointage", score: 3 }] },
    { id: 16, q: "Analysez-vous quels plats se vendent le mieux ?", answers: [{ label: "Non, à l'intuition", score: 0 }, { label: "Observation sans données", score: 1 }, { label: "Suivi manuel hebdomadaire", score: 2 }, { label: "Analyse automatique ventes par plat et par service", score: 3 }] },
    { id: 17, q: "Collectez-vous les avis de vos clients en ligne ?", answers: [{ label: "Non", score: 0 }, { label: "Retours verbaux informels", score: 1 }, { label: "Avis Google My Business ou Facebook", score: 2 }, { label: "Stratégie d'avis avec réponses et amélioration continue", score: 3 }] },
    { id: 18, q: "Gérez-vous la conformité sanitaire et les certifications numériquement ?", answers: [{ label: "Non, documents papier", score: 0 }, { label: "Copies numérisées stockées", score: 1 }, { label: "Tableur de suivi des échéances", score: 2 }, { label: "Application de suivi conformité avec rappels automatiques", score: 3 }] },
    { id: 19, q: "Communiquez-vous vos promotions et événements spéciaux par voie numérique ?", answers: [{ label: "Non", score: 0 }, { label: "WhatsApp personnel ponctuel", score: 1 }, { label: "WhatsApp Business + réseaux réguliers", score: 2 }, { label: "Campagnes multicanal (réseaux + SMS + WhatsApp) planifiées", score: 3 }] },
    { id: 20, q: "Avez-vous une fiche Google My Business avec vos horaires et photos ?", answers: [{ label: "Non", score: 0 }, { label: "Fiche créée mais non optimisée", score: 1 }, { label: "Fiche complète avec horaires et photos", score: 2 }, { label: "Fiche optimisée + réponses aux avis + publications régulières", score: 3 }] },
  ],
};

const SECTOR_QUESTIONS = {
  fr: SECTOR_QUESTIONS_FR,
  af: SECTOR_QUESTIONS_AF,
};

// ─────────────────────────────────────────────────────────────
// Niveaux
// ─────────────────────────────────────────────────────────────
const LEVELS = {
  debutant:    { min: 0,  max: 24, fr: 'Débutant',       af: 'On démarre ensemble', color: '#E74C3C', emoji: '🌱' },
  progression: { min: 25, max: 49, fr: 'En progression', af: 'Tu avances bien',     color: '#F39C12', emoji: '📈' },
  avance:      { min: 50, max: 74, fr: 'Avancé',         af: 'Bonne dynamique',     color: '#3498DB', emoji: '🚀' },
  leader:      { min: 75, max: 100, fr: 'Leader',        af: 'Tu montres la voie',  color: '#27AE60', emoji: '🏆' },
};

function getLevel(score) {
  for (const [key, l] of Object.entries(LEVELS)) {
    if (score >= l.min && score <= l.max) return { key, ...l };
  }
  return { key: 'debutant', ...LEVELS.debutant };
}

// ─────────────────────────────────────────────────────────────
// Appel Claude — parse SSE stream
// ─────────────────────────────────────────────────────────────
async function callClaudeSimple(system, prompt) {
  const res = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 800,
      system,
      messages: [{ role: 'user', content: prompt }],
      stream: true,
    }),
  });

  if (!res.ok) {
    throw new Error(`Erreur API Claude: ${res.status}`);
  }

  // Lecture SSE stream
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue;
      const raw = line.slice(6).trim();
      if (raw === '[DONE]') continue;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
          fullText += parsed.delta.text || '';
        }
      } catch {
        // ignorer les lignes non-JSON
      }
    }
  }

  return fullText.trim();
}

// ─────────────────────────────────────────────────────────────
// Base de recommandations concrètes : niveau × mode × secteur
// ─────────────────────────────────────────────────────────────
const RECOS = {
  fr: {
    debutant: {
      default: [
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Ouvrez un compte Google Workspace pour vos emails pro", tool: "Google Workspace", url: "https://workspace.google.com", cost: "6 €/mois", time: "1h" },
        { action: "Installez Notion pour organiser votre équipe", tool: "Notion", url: "https://notion.so", cost: "Gratuit jusqu'à 10 users", time: "2h" },
        { action: "Activez Google Drive pour vos sauvegardes automatiques", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre site vitrine sur Canva ou WordPress", tool: "Canva Sites", url: "https://canva.com", cost: "Gratuit", time: "3h" },
      ],
      commerce: [
        { action: "Ouvrez une boutique en ligne sur Shopify", tool: "Shopify", url: "https://shopify.com/fr", cost: "3 mois à 1 € puis 29 €/mois", time: "1 jour" },
        { action: "Installez un terminal de paiement sur mobile", tool: "SumUp", url: "https://sumup.fr", cost: "Terminal à 29 €", time: "1h" },
        { action: "Gérez votre stock avec Odoo Inventory", tool: "Odoo Community", url: "https://odoo.com/fr", cost: "Gratuit", time: "1 jour" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Activez Google Drive pour vos sauvegardes", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
      ],
      sante: [
        { action: "Adoptez un logiciel de gestion de cabinet", tool: "Doctolib Pro", url: "https://pro.doctolib.fr", cost: "À partir de 129 €/mois", time: "1 jour" },
        { action: "Mettez en place la prise de RDV en ligne", tool: "Doctolib", url: "https://pro.doctolib.fr", cost: "Inclus abonnement", time: "2h" },
        { action: "Sécurisez vos données patients (RGPD)", tool: "Oodrive Health", url: "https://oodrive.com", cost: "Sur devis", time: "1 semaine" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Activez Google Drive pour vos sauvegardes", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
      ],
      administration: [
        { action: "Lancez votre portail documentaire en ligne", tool: "Notion", url: "https://notion.so", cost: "Gratuit jusqu'à 10 users", time: "1 jour" },
        { action: "Adoptez la signature électronique", tool: "YouSign", url: "https://yousign.com/fr-fr", cost: "À partir de 25 €/mois", time: "2h" },
        { action: "Dématérialisez vos formulaires internes", tool: "Google Forms", url: "https://forms.google.com", cost: "Gratuit", time: "3h" },
        { action: "Activez Google Drive pour vos documents", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Installez Notion pour organiser vos équipes", tool: "Notion", url: "https://notion.so", cost: "Gratuit jusqu'à 10 users", time: "2h" },
      ],
      btp: [
        { action: "Adoptez un logiciel de devis et facturation BTP", tool: "Obat", url: "https://obat.fr", cost: "À partir de 29 €/mois", time: "1 jour" },
        { action: "Gérez vos chantiers sur mobile", tool: "Fieldwire", url: "https://fieldwire.com/fr", cost: "Gratuit jusqu'à 3 projets", time: "2h" },
        { action: "Rédigez vos plans avec un outil en ligne", tool: "SketchUp Free", url: "https://sketchup.com", cost: "Gratuit", time: "1 jour" },
        { action: "Activez Google Drive pour vos documents chantier", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
      ],
      agriculture: [
        { action: "Suivez la météo agricole précise", tool: "Weenat", url: "https://weenat.com", cost: "À partir de 9 €/mois", time: "30 min" },
        { action: "Gérez votre traçabilité et cahiers de culture", tool: "Smag Farmer", url: "https://smag.tech", cost: "Sur devis", time: "1 jour" },
        { action: "Vendez en direct avec une boutique en ligne", tool: "La Ruche qui dit Oui", url: "https://laruchequiditoui.fr", cost: "Commission à la vente", time: "2h" },
        { action: "Activez Google Drive pour vos sauvegardes", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
      ],
      education: [
        { action: "Créez vos cours en ligne gratuitement", tool: "Google Classroom", url: "https://classroom.google.com", cost: "Gratuit", time: "2h" },
        { action: "Adoptez une plateforme LMS open source", tool: "Moodle", url: "https://moodle.org", cost: "Gratuit (open source)", time: "1 jour" },
        { action: "Organisez la communication école-familles", tool: "Pronote", url: "https://index-education.com", cost: "Sur devis", time: "1 semaine" },
        { action: "Activez Google Drive pour vos ressources pédagogiques", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
      ],
      telecom: [
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Adoptez un CRM simple pour vos clients", tool: "HubSpot CRM", url: "https://hubspot.com/fr", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Installez Notion pour votre équipe", tool: "Notion", url: "https://notion.so", cost: "Gratuit jusqu'à 10 users", time: "2h" },
        { action: "Activez Google Drive pour vos sauvegardes", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Ouvrez un compte Google Workspace pour vos emails pro", tool: "Google Workspace", url: "https://workspace.google.com", cost: "6 €/mois", time: "1h" },
      ],
      finance: [
        { action: "Adoptez un logiciel de comptabilité en ligne", tool: "Pennylane", url: "https://pennylane.com", cost: "À partir de 49 €/mois", time: "1 jour" },
        { action: "Sécurisez vos échanges clients", tool: "Oodrive", url: "https://oodrive.com", cost: "Sur devis", time: "1 semaine" },
        { action: "Automatisez vos relances clients", tool: "Axonaut", url: "https://axonaut.com", cost: "À partir de 29 €/mois", time: "2h" },
        { action: "Activez Google Drive pour vos sauvegardes", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre fiche Google My Business", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
      ],
    },
    progression: {
      default: [
        { action: "Adoptez un CRM pour suivre vos prospects et clients", tool: "HubSpot CRM", url: "https://hubspot.com/fr", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Lancez votre newsletter mensuelle", tool: "Brevo", url: "https://brevo.com", cost: "Gratuit jusqu'à 300 emails/jour", time: "2h" },
        { action: "Automatisez vos flux de travail répétitifs", tool: "Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
        { action: "Structurez votre présence sur LinkedIn", tool: "LinkedIn Business", url: "https://linkedin.com/company", cost: "Gratuit", time: "3h" },
        { action: "Analysez votre trafic web", tool: "Google Analytics 4", url: "https://analytics.google.com", cost: "Gratuit", time: "2h" },
      ],
      commerce: [
        { action: "Adoptez un CRM commercial et automatisez vos relances", tool: "HubSpot CRM", url: "https://hubspot.com/fr", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Améliorez votre boutique en ligne", tool: "Shopify", url: "https://shopify.com/fr", cost: "À partir de 29 €/mois", time: "2 jours" },
        { action: "Automatisez vos emails marketing", tool: "Klaviyo", url: "https://klaviyo.com", cost: "Gratuit jusqu'à 500 contacts", time: "2h" },
        { action: "Référencez vos produits sur Google Shopping", tool: "Google Merchant Center", url: "https://merchants.google.com", cost: "Gratuit", time: "1 jour" },
        { action: "Analysez vos ventes avec un tableau de bord", tool: "Google Looker Studio", url: "https://lookerstudio.google.com", cost: "Gratuit", time: "3h" },
      ],
      sante: [
        { action: "Activez la téléconsultation pour vos patients", tool: "Doctolib", url: "https://pro.doctolib.fr", cost: "Inclus abonnement", time: "2h" },
        { action: "Adoptez un DMP numérique", tool: "Mon Espace Santé", url: "https://monespacesante.fr", cost: "Gratuit", time: "1 jour" },
        { action: "Automatisez vos rappels de RDV par SMS", tool: "Smsmode", url: "https://www.smsmode.com", cost: "À partir de 0,05 €/SMS", time: "2h" },
        { action: "Renforcez votre présence et avis patients", tool: "Google My Business + Doctolib", url: "https://business.google.com", cost: "Gratuit", time: "1h" },
        { action: "Analysez vos indicateurs de patientèle", tool: "Google Looker Studio", url: "https://lookerstudio.google.com", cost: "Gratuit", time: "2h" },
      ],
      administration: [
        { action: "Déployez un portail collaborateur", tool: "Confluence ou Notion", url: "https://notion.so", cost: "Gratuit / 8 €/user/mois", time: "1 semaine" },
        { action: "Automatisez le traitement des formulaires", tool: "Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
        { action: "Adoptez la GED (Gestion Électronique Docs)", tool: "Alfresco Community", url: "https://alfresco.com", cost: "Gratuit (open source)", time: "1 semaine" },
        { action: "Mettez en place la signature électronique", tool: "YouSign", url: "https://yousign.com/fr-fr", cost: "À partir de 25 €/mois", time: "2h" },
        { action: "Cartographiez vos processus métier", tool: "draw.io", url: "https://app.diagrams.net", cost: "Gratuit", time: "3h" },
      ],
      btp: [
        { action: "Adoptez un logiciel complet de gestion de chantier", tool: "PlanRadar", url: "https://planradar.com/fr", cost: "À partir de 39 €/mois", time: "2 jours" },
        { action: "Adoptez un CRM pour vos devis et prospects", tool: "HubSpot CRM", url: "https://hubspot.com/fr", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Dématérialisez vos bons de commande et factures", tool: "Pennylane", url: "https://pennylane.com", cost: "À partir de 49 €/mois", time: "1 jour" },
        { action: "Gérez votre planning et vos équipes terrain", tool: "monday.com", url: "https://monday.com", cost: "À partir de 9 €/user/mois", time: "1 jour" },
        { action: "Analysez votre rentabilité par chantier", tool: "Obat", url: "https://obat.fr", cost: "À partir de 29 €/mois", time: "2h" },
      ],
      agriculture: [
        { action: "Adoptez une solution de gestion agricole", tool: "Smag Farmer", url: "https://smag.tech", cost: "Sur devis", time: "1 semaine" },
        { action: "Vendez en circuit court avec une boutique en ligne", tool: "Shopify", url: "https://shopify.com/fr", cost: "À partir de 29 €/mois", time: "2 jours" },
        { action: "Automatisez votre gestion administrative", tool: "Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
        { action: "Lancez une newsletter pour vos clients", tool: "Brevo", url: "https://brevo.com", cost: "Gratuit jusqu'à 300 emails/jour", time: "2h" },
        { action: "Gérez vos stocks et approvisionnements", tool: "Odoo Inventory", url: "https://odoo.com/fr", cost: "Gratuit (Community)", time: "1 jour" },
      ],
      education: [
        { action: "Déployez un LMS complet pour vos cours", tool: "Moodle", url: "https://moodle.org", cost: "Gratuit (open source)", time: "2 jours" },
        { action: "Lancez des cours vidéo en ligne", tool: "Teachable", url: "https://teachable.com", cost: "Gratuit jusqu'à 10 étudiants", time: "1 jour" },
        { action: "Automatisez les inscriptions et paiements", tool: "Stripe + Zapier", url: "https://stripe.com/fr", cost: "1,5 % + 0,25 € / transaction", time: "1 jour" },
        { action: "Créez du contenu pédagogique enrichi", tool: "Canva for Education", url: "https://canva.com/education", cost: "Gratuit", time: "3h" },
        { action: "Analysez l'engagement de vos apprenants", tool: "Google Analytics 4", url: "https://analytics.google.com", cost: "Gratuit", time: "2h" },
      ],
      telecom: [
        { action: "Adoptez un CRM adapté", tool: "Salesforce Essentials", url: "https://salesforce.com/fr", cost: "À partir de 25 €/mois", time: "2 jours" },
        { action: "Automatisez votre support client", tool: "Freshdesk", url: "https://freshdesk.com", cost: "Gratuit jusqu'à 10 agents", time: "1 jour" },
        { action: "Lancez une newsletter de suivi client", tool: "Brevo", url: "https://brevo.com", cost: "Gratuit jusqu'à 300 emails/jour", time: "2h" },
        { action: "Analysez votre trafic et conversions", tool: "Google Analytics 4", url: "https://analytics.google.com", cost: "Gratuit", time: "2h" },
        { action: "Automatisez vos flux de gestion", tool: "Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
      ],
      finance: [
        { action: "Adoptez un logiciel de gestion financière avancé", tool: "Pennylane", url: "https://pennylane.com", cost: "À partir de 49 €/mois", time: "2 jours" },
        { action: "Automatisez vos reportings financiers", tool: "Google Looker Studio", url: "https://lookerstudio.google.com", cost: "Gratuit", time: "1 jour" },
        { action: "Déployez un CRM pour vos clients", tool: "HubSpot CRM", url: "https://hubspot.com/fr", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Sécurisez vos échanges et données sensibles", tool: "ProtonMail Business", url: "https://proton.me/business", cost: "À partir de 6,99 €/mois", time: "2h" },
        { action: "Automatisez vos flux de travail", tool: "Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
      ],
    },
    avance: {
      default: [
        { action: "Déployez un ERP pour piloter toute l'entreprise", tool: "Odoo", url: "https://odoo.com/fr", cost: "À partir de 0 € (Community)", time: "1 semaine" },
        { action: "Lancez votre stratégie data avec une BI", tool: "Google Looker Studio", url: "https://lookerstudio.google.com", cost: "Gratuit", time: "2 jours" },
        { action: "Déployez l'IA dans vos processus métier", tool: "Claude API", url: "https://claude.ai", cost: "À partir de 20 $/mois", time: "1 semaine" },
        { action: "Adoptez une stratégie ABM avancée", tool: "HubSpot Marketing Hub Pro", url: "https://hubspot.com/fr", cost: "À partir de 792 €/mois", time: "2 semaines" },
        { action: "Mettez en place une cybersécurité avancée", tool: "Microsoft Sentinel", url: "https://azure.microsoft.com", cost: "Sur devis", time: "1 mois" },
      ],
      commerce: [
        { action: "Déployez un ERP e-commerce complet", tool: "Odoo Commerce", url: "https://odoo.com/fr/page/ecommerce", cost: "À partir de 0 € (Community)", time: "1 semaine" },
        { action: "Adoptez une stratégie omnicanale", tool: "Shopify Plus + HubSpot", url: "https://shopify.com/plus", cost: "Sur devis", time: "1 mois" },
        { action: "Personnalisez l'expérience client avec l'IA", tool: "Nosto", url: "https://nosto.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Lancez votre programme de fidélité digital", tool: "Smile.io", url: "https://smile.io", cost: "À partir de 49 $/mois", time: "1 semaine" },
        { action: "Analysez vos données ventes avec une BI avancée", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "2 jours" },
      ],
      sante: [
        { action: "Déployez un DPI (Dossier Patient Informatisé) complet", tool: "Mediboard", url: "https://mediboard.org", cost: "Sur devis", time: "1 mois" },
        { action: "Intégrez l'IA pour l'aide au diagnostic", tool: "Google Health AI", url: "https://health.google", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez une plateforme de télémédecine avancée", tool: "Hopi Health", url: "https://hopi.health", cost: "Sur devis", time: "2 semaines" },
        { action: "Déployez une stratégie data santé", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
        { action: "Mettez en place un SMSI (sécurité données santé)", tool: "Oodrive Health", url: "https://oodrive.com", cost: "Sur devis", time: "1 mois" },
      ],
      administration: [
        { action: "Déployez un ERP public complet", tool: "Maarch", url: "https://maarch.org", cost: "Gratuit (open source)", time: "1 mois" },
        { action: "Adoptez une plateforme open data", tool: "data.gouv.fr / CKAN", url: "https://data.gouv.fr", cost: "Gratuit", time: "2 semaines" },
        { action: "Déployez l'IA pour l'analyse des données publiques", tool: "Azure AI Services", url: "https://azure.microsoft.com/fr-fr/products/ai-services", cost: "Sur devis", time: "1 mois" },
        { action: "Lancez une stratégie cybersécurité complète", tool: "ANSSI + Microsoft Defender", url: "https://cyber.gouv.fr", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez un tableau de bord KPIs public", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
      ],
      btp: [
        { action: "Déployez le BIM (Building Information Modeling)", tool: "Autodesk BIM 360", url: "https://construction.autodesk.com", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez un ERP BTP complet", tool: "Sage BTP", url: "https://sage.com/fr-fr", cost: "Sur devis", time: "2 semaines" },
        { action: "Intégrez les drones sur vos chantiers", tool: "DJI Enterprise", url: "https://dji.com/enterprise", cost: "Sur devis", time: "1 mois" },
        { action: "Pilotez la rentabilité avec une BI", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
        { action: "Automatisez entièrement votre chaîne devis-facturation", tool: "Pennylane", url: "https://pennylane.com", cost: "À partir de 49 €/mois", time: "2 jours" },
      ],
      agriculture: [
        { action: "Déployez un système d'agriculture de précision", tool: "Trimble Ag", url: "https://agriculture.trimble.com", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez un ERP agricole complet", tool: "Isagri ERP", url: "https://isagri.fr", cost: "Sur devis", time: "2 semaines" },
        { action: "Intégrez des capteurs IoT dans vos cultures", tool: "Sencrop", url: "https://sencrop.com", cost: "À partir de 120 €/an", time: "1 semaine" },
        { action: "Lancez une stratégie e-commerce agricole avancée", tool: "Shopify + Klaviyo", url: "https://shopify.com/fr", cost: "À partir de 29 €/mois", time: "2 jours" },
        { action: "Analysez vos données de production avec une BI", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
      ],
      education: [
        { action: "Déployez une plateforme e-learning avancée", tool: "Canvas LMS", url: "https://canvaslms.com", cost: "Sur devis", time: "1 mois" },
        { action: "Intégrez l'IA dans vos parcours pédagogiques", tool: "Claude API", url: "https://claude.ai", cost: "À partir de 20 $/mois", time: "1 mois" },
        { action: "Adoptez un ERP éducatif", tool: "Schoology", url: "https://schoology.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Analysez la progression de vos apprenants", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
        { action: "Lancez des certifications en ligne reconnues", tool: "Credly", url: "https://credly.com", cost: "Sur devis", time: "2 semaines" },
      ],
      telecom: [
        { action: "Déployez un CRM enterprise", tool: "Salesforce ou Microsoft Dynamics", url: "https://salesforce.com/fr", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez une plateforme omnicanale de support", tool: "Zendesk Suite", url: "https://zendesk.com/fr", cost: "Sur devis", time: "2 semaines" },
        { action: "Déployez l'IA pour la prédiction du churn", tool: "Mixpanel", url: "https://mixpanel.com", cost: "Gratuit jusqu'à 20M events", time: "1 semaine" },
        { action: "Lancez une stratégie data avancée", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
        { action: "Automatisez entièrement l'onboarding client", tool: "HubSpot Enterprise", url: "https://hubspot.com/fr", cost: "Sur devis", time: "1 mois" },
      ],
      finance: [
        { action: "Déployez un ERP financier complet", tool: "Sage X3", url: "https://sage.com/fr-fr", cost: "Sur devis", time: "1 mois" },
        { action: "Adoptez une BI financière avancée", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9,99 $/mois", time: "1 semaine" },
        { action: "Intégrez l'IA pour la détection de fraude", tool: "Stripe Radar", url: "https://stripe.com/fr/radar", cost: "Inclus dans Stripe", time: "2 semaines" },
        { action: "Déployez une stratégie open banking", tool: "Bridge API", url: "https://bridgeapi.eu", cost: "Sur devis", time: "1 mois" },
        { action: "Automatisez votre conformité réglementaire", tool: "Workiva", url: "https://workiva.com", cost: "Sur devis", time: "1 mois" },
      ],
    },
  },
  af: {
    debutant: {
      default: [
        { action: "Créez votre page WhatsApp Business dès aujourd'hui", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Ouvrez un compte Wave pour vos paiements", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Créez votre présence Facebook Business", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
        { action: "Sauvegardez vos données dans le cloud", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre site vitrine gratuitement", tool: "Canva Sites", url: "https://canva.com", cost: "Gratuit", time: "3h" },
      ],
      commerce: [
        { action: "Créez votre page WhatsApp Business avec catalogue produits", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Ouvrez une boutique sur Jumia", tool: "Jumia Vendor", url: "https://seller.jumia.com", cost: "Commission à la vente", time: "1 jour" },
        { action: "Acceptez les paiements Mobile Money", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Gérez votre stock sur Google Sheets", tool: "Google Sheets", url: "https://sheets.google.com", cost: "Gratuit", time: "2h" },
        { action: "Créez votre page Facebook Business", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      sante: [
        { action: "Créez votre page WhatsApp Business pour les RDV", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Gérez vos rendez-vous avec Google Calendar", tool: "Google Calendar", url: "https://calendar.google.com", cost: "Gratuit", time: "1h" },
        { action: "Créez une fiche Google My Business pour votre cabinet", tool: "Google My Business", url: "https://business.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Sauvegardez vos fiches patients dans le cloud", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre page Facebook pour votre cabinet", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      administration: [
        { action: "Créez un formulaire de demande en ligne", tool: "Google Forms", url: "https://forms.google.com", cost: "Gratuit", time: "2h" },
        { action: "Organisez vos documents officiels dans le cloud", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Adoptez la signature électronique simple", tool: "DocuSign (3 enveloppes/mois)", url: "https://docusign.com", cost: "Gratuit", time: "1h" },
        { action: "Communiquez officiellement via WhatsApp Business", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Créez votre page Facebook officielle", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      btp: [
        { action: "Gérez vos devis sur tablette", tool: "Google Sheets", url: "https://sheets.google.com", cost: "Gratuit", time: "2h" },
        { action: "Communiquez sur les chantiers via WhatsApp Business", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Photographiez et organisez vos chantiers", tool: "Google Photos + Drive", url: "https://photos.google.com", cost: "Gratuit", time: "30 min" },
        { action: "Acceptez les paiements Mobile Money", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Créez votre page Facebook pour vos réalisations", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      agriculture: [
        { action: "Suivez les prix du marché en temps réel", tool: "ESOKO", url: "https://esoko.com", cost: "Gratuit pour agriculteurs", time: "30 min" },
        { action: "Créez votre groupe WhatsApp Business acheteurs", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Acceptez les paiements Mobile Money", tool: "Wave ou MTN MoMo", url: "https://www.wave.com/fr", cost: "0 % de frais (Wave)", time: "30 min" },
        { action: "Sauvegardez vos données de production", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre page Facebook pour vendre en direct", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      education: [
        { action: "Créez vos cours sur YouTube (mode privé)", tool: "YouTube", url: "https://youtube.com", cost: "Gratuit", time: "2h" },
        { action: "Partagez vos cours via WhatsApp Business", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Acceptez les paiements de scolarité en Mobile Money", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Organisez vos ressources pédagogiques", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre page Facebook pour recruter des apprenants", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
      telecom: [
        { action: "Créez votre page WhatsApp Business pour le support", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Créez votre page Facebook Business", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
        { action: "Sauvegardez vos données clients dans le cloud", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Adoptez Wave pour vos encaissements", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Créez votre site vitrine gratuitement", tool: "Canva Sites", url: "https://canva.com", cost: "Gratuit", time: "3h" },
      ],
      finance: [
        { action: "Adoptez Wave comme solution de paiement principal", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Gérez votre comptabilité gratuitement", tool: "Manager.io", url: "https://manager.io", cost: "Gratuit", time: "2h" },
        { action: "Communiquez avec vos clients via WhatsApp Business", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "20 min" },
        { action: "Sauvegardez vos données financières dans le cloud", tool: "Google Drive", url: "https://drive.google.com", cost: "15 Go gratuits", time: "20 min" },
        { action: "Créez votre page Facebook Business", tool: "Facebook Business", url: "https://facebook.com/business", cost: "Gratuit", time: "1h" },
      ],
    },
    progression: {
      default: [
        { action: "Adoptez Odoo Community pour gérer vos ventes et stock", tool: "Odoo", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 jour" },
        { action: "Lancez votre boutique en ligne sur Jumia", tool: "Jumia Vendor", url: "https://seller.jumia.com", cost: "Commission à la vente", time: "2 jours" },
        { action: "Automatisez votre service client WhatsApp", tool: "Bird (ex-MessageBird)", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "1 jour" },
        { action: "Lancez vos publicités ciblées sur Facebook", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
        { action: "Adoptez un CRM simple pour vos clients", tool: "HubSpot CRM", url: "https://hubspot.com", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
      ],
      commerce: [
        { action: "Adoptez Odoo pour gérer ventes, stock et facturation", tool: "Odoo Community", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 jour" },
        { action: "Intégrez tous vos paiements Mobile Money", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
        { action: "Automatisez vos relances WhatsApp", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "1 jour" },
        { action: "Lancez des publicités Facebook ciblées", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
        { action: "Lancez votre boutique sur Jumia", tool: "Jumia Vendor", url: "https://seller.jumia.com", cost: "Commission à la vente", time: "2 jours" },
      ],
      sante: [
        { action: "Déployez un logiciel de gestion de cabinet open source", tool: "Bahmni", url: "https://bahmni.org", cost: "Gratuit (open source)", time: "1 semaine" },
        { action: "Activez la téléconsultation par WhatsApp Video", tool: "WhatsApp Video + Google Calendar", url: "https://calendar.google.com", cost: "Gratuit", time: "1h" },
        { action: "Automatisez vos rappels RDV par SMS", tool: "Twilio", url: "https://twilio.com", cost: "~500 FCFA pour 100 SMS", time: "2h" },
        { action: "Lancez des publicités Facebook pour votre cabinet", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
        { action: "Adoptez un CRM simple pour vos patients", tool: "HubSpot CRM", url: "https://hubspot.com", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
      ],
      administration: [
        { action: "Déployez un portail de services en ligne", tool: "WordPress", url: "https://wordpress.com", cost: "Gratuit (hébergement ~5 000 FCFA/mois)", time: "1 semaine" },
        { action: "Automatisez le traitement des demandes", tool: "Google Forms + Make", url: "https://make.com", cost: "Gratuit 1000 ops/mois", time: "1 jour" },
        { action: "Communicez officiellement via WhatsApp Business API", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "1 jour" },
        { action: "Adoptez Odoo pour la gestion administrative", tool: "Odoo Community", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 semaine" },
        { action: "Adoptez la signature électronique", tool: "DocuSign ou YouSign", url: "https://yousign.com", cost: "À partir de 25 €/mois", time: "2h" },
      ],
      btp: [
        { action: "Adoptez un logiciel de devis-facturation", tool: "Odoo Sales", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 jour" },
        { action: "Gérez vos chantiers avec un outil simple", tool: "Fieldwire Free", url: "https://fieldwire.com", cost: "Gratuit jusqu'à 3 projets", time: "2h" },
        { action: "Acceptez les paiements Mobile Money", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
        { action: "Lancez des publicités Facebook pour vos réalisations", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
        { action: "Automatisez vos relances clients WhatsApp", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "1 jour" },
      ],
      agriculture: [
        { action: "Vendez via WhatsApp Business Catalogue", tool: "WhatsApp Business", url: "https://business.whatsapp.com", cost: "Gratuit", time: "1h" },
        { action: "Rejoignez TradeDepot pour distribuer en gros", tool: "TradeDepot", url: "https://tradedepot.co", cost: "Commission à la vente", time: "1 jour" },
        { action: "Acceptez les paiements Mobile Money directement", tool: "Wave", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "30 min" },
        { action: "Adoptez Odoo pour la gestion complète", tool: "Odoo Community", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 semaine" },
        { action: "Lancez des publicités Facebook ciblées", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
      ],
      education: [
        { action: "Lancez une plateforme d'apprentissage en ligne", tool: "Moodle (hébergé localement)", url: "https://moodle.org", cost: "Gratuit (open source)", time: "1 semaine" },
        { action: "Vendez vos cours en ligne", tool: "Teachable", url: "https://teachable.com", cost: "Gratuit jusqu'à 10 étudiants", time: "1 jour" },
        { action: "Acceptez les paiements en Mobile Money", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
        { action: "Automatisez vos rappels de cours", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "2h" },
        { action: "Lancez des pubs Facebook pour recruter des apprenants", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
      ],
      telecom: [
        { action: "Adoptez un CRM pour vos clients", tool: "HubSpot CRM", url: "https://hubspot.com", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Automatisez votre support WhatsApp", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "1 jour" },
        { action: "Intégrez les paiements Mobile Money", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
        { action: "Lancez des publicités Facebook ciblées", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
        { action: "Adoptez Odoo pour la gestion clients", tool: "Odoo Community", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 semaine" },
      ],
      finance: [
        { action: "Adoptez CinetPay comme solution de paiement", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
        { action: "Gérez vos comptes avec Odoo Accounting", tool: "Odoo Community", url: "https://odoo.com", cost: "Gratuit (Community)", time: "1 jour" },
        { action: "Automatisez vos relances clients WhatsApp", tool: "Bird", url: "https://bird.com", cost: "~15 000 FCFA/mois", time: "2h" },
        { action: "Adoptez un CRM pour vos prospects", tool: "HubSpot CRM", url: "https://hubspot.com", cost: "Gratuit jusqu'à 1000 contacts", time: "1 jour" },
        { action: "Lancez des publicités Facebook ciblées", tool: "Facebook Ads", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "2h" },
      ],
    },
    avance: {
      default: [
        { action: "Intégrez une solution BI pour piloter votre activité", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Déployez un ERP adapté Afrique (module OHADA)", tool: "Odoo OHADA", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Déployez l'IA dans votre service client WhatsApp", tool: "Bird + Claude API", url: "https://bird.com", cost: "~50 000 FCFA/mois", time: "2 semaines" },
        { action: "Lancez une stratégie marketing data-driven", tool: "Facebook Pixel + Analytics", url: "https://facebook.com/business/ads", cost: "À définir selon budget", time: "1 semaine" },
        { action: "Sécurisez entièrement votre infrastructure", tool: "Cloudflare", url: "https://cloudflare.com", cost: "Gratuit (plan de base)", time: "1 semaine" },
      ],
      commerce: [
        { action: "Déployez un ERP e-commerce adapté Afrique (OHADA)", tool: "Odoo OHADA", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Adoptez une stratégie omnicanale", tool: "Odoo + Jumia + WhatsApp API", url: "https://cinetpay.com", cost: "Sur devis", time: "1 mois" },
        { action: "Analysez vos ventes avec une BI avancée", tool: "Power BI ou Looker Studio", url: "https://lookerstudio.google.com", cost: "Gratuit / 9 $/mois", time: "1 semaine" },
        { action: "Lancez un programme de fidélité digital", tool: "Loopy Loyalty", url: "https://loopyloyalty.com", cost: "À partir de 40 $/mois", time: "1 semaine" },
        { action: "Déployez l'IA pour personnaliser l'expérience client", tool: "Claude API", url: "https://claude.ai", cost: "~50 000 FCFA/mois", time: "2 semaines" },
      ],
      sante: [
        { action: "Déployez Bahmni (HIS complet adapté Afrique)", tool: "Bahmni", url: "https://bahmni.org", cost: "Gratuit (open source)", time: "1 mois" },
        { action: "Intégrez la télémédecine avancée", tool: "Helium Health", url: "https://heliumhealth.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Adoptez une BI santé pour vos KPIs", tool: "DHIS2", url: "https://dhis2.org", cost: "Gratuit", time: "1 semaine" },
        { action: "Automatisez les rappels et suivis patients", tool: "Bird + WhatsApp API", url: "https://bird.com", cost: "~50 000 FCFA/mois", time: "2 semaines" },
        { action: "Sécurisez vos données patients", tool: "Cloudflare + chiffrement", url: "https://cloudflare.com", cost: "Gratuit (plan de base)", time: "1 semaine" },
      ],
      administration: [
        { action: "Déployez un ERP public adapté Afrique", tool: "Odoo Gov", url: "https://odoo.com", cost: "Sur devis", time: "1 mois" },
        { action: "Lancez une plateforme de services en ligne", tool: "WordPress Gov", url: "https://wordpress.com", cost: "Sur devis", time: "1 mois" },
        { action: "Pilotez les KPIs avec une BI avancée", tool: "Power BI ou DHIS2", url: "https://powerbi.microsoft.com", cost: "9 $/mois / Gratuit (DHIS2)", time: "1 semaine" },
        { action: "Déployez l'IA pour l'analyse des données publiques", tool: "Azure AI Services", url: "https://azure.microsoft.com", cost: "Sur devis", time: "1 mois" },
        { action: "Sécurisez l'infrastructure numérique", tool: "Cloudflare ou Palo Alto", url: "https://cloudflare.com", cost: "Sur devis", time: "1 mois" },
      ],
      btp: [
        { action: "Déployez un ERP BTP adapté Afrique (OHADA)", tool: "Odoo OHADA", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Intégrez le BIM dans vos projets", tool: "Procore", url: "https://procore.com", cost: "Sur devis", time: "1 mois" },
        { action: "Pilotez la rentabilité chantier avec une BI", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Automatisez devis et commandes fournisseurs", tool: "Odoo Purchase", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Intégrez les paiements Mobile Money pour vos clients", tool: "CinetPay", url: "https://cinetpay.com", cost: "Commission / transaction", time: "1 jour" },
      ],
      agriculture: [
        { action: "Adoptez un ERP agricole adapté Afrique", tool: "FarmForce", url: "https://farmforce.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Intégrez l'IoT pour surveiller vos cultures", tool: "Weenat", url: "https://weenat.com", cost: "À partir de 120 €/an", time: "1 semaine" },
        { action: "Lancez une stratégie d'export numérique", tool: "TradeDepot ou Alibaba", url: "https://tradedepot.co", cost: "Commission à la vente", time: "1 mois" },
        { action: "Analysez vos données de production", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Automatisez vos paiements producteurs", tool: "Wave Business API", url: "https://www.wave.com/fr", cost: "0 % de frais", time: "2 semaines" },
      ],
      education: [
        { action: "Déployez une plateforme LMS nationale", tool: "Moodle Enterprise", url: "https://moodle.org", cost: "Sur devis", time: "1 mois" },
        { action: "Intégrez l'IA dans vos parcours pédagogiques", tool: "Claude API", url: "https://claude.ai", cost: "~50 000 FCFA/mois", time: "1 mois" },
        { action: "Analysez la progression des apprenants", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Automatisez les certifications", tool: "Credly", url: "https://credly.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Lancez une stratégie marketing digital", tool: "Facebook Ads + WhatsApp API", url: "https://facebook.com/business/ads", cost: "À partir de 1 000 FCFA/jour", time: "1 semaine" },
      ],
      telecom: [
        { action: "Déployez un ERP Télécom complet", tool: "Odoo ou WHMCS", url: "https://odoo.com", cost: "Sur devis", time: "1 mois" },
        { action: "Analysez votre base clients avec une BI", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Déployez l'IA pour prédire le churn", tool: "Claude API + Mixpanel", url: "https://mixpanel.com", cost: "Gratuit jusqu'à 20M events", time: "2 semaines" },
        { action: "Automatisez entièrement votre support client", tool: "Bird + Chatbot", url: "https://bird.com", cost: "~50 000 FCFA/mois", time: "2 semaines" },
        { action: "Sécurisez votre infrastructure réseau", tool: "Cloudflare", url: "https://cloudflare.com", cost: "Sur devis", time: "1 mois" },
      ],
      finance: [
        { action: "Déployez un ERP financier adapté OHADA", tool: "Odoo Accounting OHADA", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Adoptez une BI financière avancée", tool: "Power BI", url: "https://powerbi.microsoft.com", cost: "9 $/mois", time: "1 semaine" },
        { action: "Intégrez l'open banking via Mobile Money API", tool: "MTN MoMo API", url: "https://momodeveloper.mtn.com", cost: "Sur devis", time: "1 mois" },
        { action: "Automatisez vos reportings réglementaires", tool: "Odoo + Power BI", url: "https://odoo.com", cost: "Sur devis", time: "2 semaines" },
        { action: "Sécurisez vos données financières", tool: "Cloudflare + chiffrement AES", url: "https://cloudflare.com", cost: "Sur devis", time: "1 mois" },
      ],
    },
  },
};

function getRecos(score, mode, sector) {
  const m = RECOS[mode] || RECOS.fr;
  const levelKey = score < 30 ? 'debutant' : score < 60 ? 'progression' : 'avance';
  const level = m[levelKey];
  return (sector && level[sector]) ? level[sector] : level.default;
}

// ─────────────────────────────────────────────────────────────
// Composant principal
// ─────────────────────────────────────────────────────────────
const LS_KEY = 'nexalie_audit_draft';

export default function AuditModule({ isPlatform = false }) {
  const { mode } = useMode();
  const [sector, setSector] = useState(null);
  // Profil pré-audit
  const [profil, setProfil] = useState({ equipe: null, pays: null });

  // 5 questions communes + 15 sectorielles si secteur choisi
  const baseQuestions = QUESTIONS[mode] || QUESTIONS.fr;
  const sectorQs = sector
    ? (SECTOR_QUESTIONS[mode]?.[sector] || SECTOR_QUESTIONS.fr?.[sector] || [])
    : [];
  const questions = sector
    ? [...baseQuestions.slice(0, 5), ...sectorQs]
    : baseQuestions;

  // Sondage pré-audit
  const [survey, setSurvey] = useState({ nom: '', ca: null, outils: [], defi: null });

  const [step, setStep] = useState('intro'); // 'intro' | 'survey' | 'profil' | 'sector' | 'questions' | 'result'
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState(() => {
    // Restaurer depuis localStorage si disponible
    if (typeof window !== 'undefined') {
      try {
        const saved = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
        if (saved?.answers) return saved.answers;
      } catch {}
    }
    return Array(20).fill(null);
  });
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(null);
  const [recommendations, setRecommendations] = useState('');
  const [recoCards, setRecoCards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [aiReport, setAiReport] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [savedId, setSavedId] = useState(null);
  const [displayScore, setDisplayScore] = useState(0);
  const animFrameRef = useRef(null);

  // Textes selon mode
  const T = {
    intro_title: mode === 'fr' ? 'Audit de Maturité Digitale' : 'Bilan Numérique',
    intro_sub: mode === 'fr'
      ? '20 questions · 15-20 min · Résultats immédiats'
      : '20 questions · 15 min · Résultats instantanés',
    intro_desc: mode === 'fr'
      ? 'Évaluez votre niveau de digitalisation et obtenez des recommandations concrètes et personnalisées générées par IA.'
      : 'Mesurez votre niveau de numérique et recevez des conseils concrets adaptés à vos réalités terrain.',
    intro_cta: mode === 'fr' ? 'Commencer l\'audit' : 'Démarrer le Bilan',
    free_badge: mode === 'fr' ? '100% Gratuit' : '100% Gratuit',
    question_label: mode === 'fr' ? 'Question' : 'Question',
    prev: mode === 'fr' ? 'Précédent' : 'Précédent',
    next: mode === 'fr' ? 'Suivant' : 'Suivant',
    finish: mode === 'fr' ? 'Terminer l\'audit' : 'Terminer le Bilan',
    result_title: mode === 'fr' ? 'Votre Score de Maturité Digitale' : 'Votre Score Numérique',
    your_level: mode === 'fr' ? 'Votre niveau :' : 'Votre niveau :',
    reco_title: mode === 'fr' ? 'Recommandations Prioritaires' : 'Mes Conseils Prioritaires',
    loading_reco: mode === 'fr' ? 'Analyse IA en cours...' : 'Analyse en cours...',
    download: mode === 'fr' ? 'Télécharger le rapport PDF' : 'Télécharger mon rapport',
    restart: mode === 'fr' ? 'Refaire l\'audit' : 'Refaire le Bilan',
    save_cta: mode === 'fr' ? 'Créer mon compte pour sauvegarder' : 'Créer mon compte pour sauvegarder',
    saving: mode === 'fr' ? 'Sauvegarde...' : 'Sauvegarde...',
    saved: mode === 'fr' ? 'Audit sauvegardé' : 'Bilan sauvegardé',
    error_save: mode === 'fr' ? 'Erreur lors de la sauvegarde' : 'Erreur de sauvegarde',
    out_of: mode === 'fr' ? 'sur 100' : 'sur 100',
    points: mode === 'fr' ? 'points' : 'points',
  };

  // Animation du compteur de score
  useEffect(() => {
    if (step !== 'result' || score === 0) return;
    let start = 0;
    const duration = 1500;
    const startTime = performance.now();

    function animate(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.round(eased * score);
      setDisplayScore(start);
      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    }
    animFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [step, score]);

  // Sauvegarde automatique toutes les 30 secondes pendant les questions
  useEffect(() => {
    if (step !== 'questions') return;
    const interval = setInterval(() => {
      if (typeof window !== 'undefined') {
        try { localStorage.setItem(LS_KEY, JSON.stringify({ answers, sector, step: 'questions' })); } catch {}
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [step, answers, sector]);

  function handleAnswer(questionIndex, answerScore) {
    const updated = [...answers];
    updated[questionIndex] = answerScore;
    setAnswers(updated);
    // Sauvegarde automatique en localStorage
    if (typeof window !== 'undefined') {
      try { localStorage.setItem(LS_KEY, JSON.stringify({ answers: updated, sector, step: 'questions' })); } catch {}
    }
  }

  async function handleFinish() {
    const sum = answers.reduce((acc, v) => acc + (v ?? 0), 0);
    const calculatedScore = Math.round((sum * 100) / 60);
    const lvl = getLevel(calculatedScore);
    const levelLabel = mode === 'fr' ? lvl.fr : lvl.af;

    const cards = getRecos(calculatedScore, mode, sector);
    const recoText = cards.map((c, i) =>
      `${i + 1}. ${c.action} — ${c.tool} · ${c.cost} · ${c.time}`
    ).join('\n');

    setScore(calculatedScore);
    setLevel(lvl);
    setRecoCards(cards);
    setRecommendations(recoText);
    setStep('result');
    setIsLoading(true);

    // ─── Génération du rapport IA structuré ───────────────────
    try {
      const sectorList = SECTORS[mode] || SECTORS.fr;
      const sectorLabel = sectorList.find(s => s.id === sector)?.label || sector || 'non précisé';
      const companyName = survey.nom || 'votre structure';
      const caLabel = survey.ca || 'non précisé';
      const defiLabel = survey.defi || 'non précisé';
      const outilsLabel = (survey.outils || []).join(', ') || 'aucun outil actuel';
      const countryLabel = profil?.pays || (mode === 'af' ? 'Afrique francophone' : 'France');

      const auditPrompt = `Génère le rapport complet de diagnostic Nexalie pour cette structure.

DONNÉES DU DIAGNOSTIC :
- Structure : ${companyName}
- Secteur : ${sectorLabel}
- Pays / Marché : ${countryLabel}
- CA estimé : ${caLabel}
- Outils actuellement utilisés : ${outilsLabel}
- Défi principal exprimé : ${defiLabel}
- Score calculé : ${calculatedScore}/100
- Niveau de maturité : ${levelLabel}

CONTEXTE DES RÉPONSES :
${cards.slice(0, 3).map((c, i) => `${i + 1}. ${c.action} (outil recommandé : ${c.tool})`).join('\n')}

Génère maintenant le rapport complet en respectant strictement la structure de rapport Nexalie (🏛️ Maturité / 🗺️ Roadmap 90j / 🛡️ Souveraineté). Sois direct, chiffré, et utilise "Votre structure" ou "${companyName}" — jamais "votre entreprise" de façon générique.`;

      const report = await callClaudeSimple(null, auditPrompt);
      if (report) {
        setAiReport(report);
        setRecommendations(report);
      }
    } catch (err) {
      console.error('[Nexalie] AI report error:', err.message);
      // Fallback : les recoCards sont déjà en place
    } finally {
      setIsLoading(false);
    }

    // Effacer le brouillon localStorage
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(LS_KEY); } catch {}
    }

    // Sauvegarde automatique si isPlatform
    if (isPlatform) {
      saveAudit(calculatedScore, lvl, levelLabel, answers, recoText);
    }
  }

  async function saveAudit(s, lvl, levelLabel, ans, reco) {
    setIsSaving(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score: s,
          niveau: lvl.key,
          niveau_label: levelLabel,
          reponses: ans,
          recommandations: reco,
          mode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSavedId(data.id);
      }
    } catch (err) {
      console.error('Erreur sauvegarde audit:', err);
    } finally {
      setIsSaving(false);
    }
  }

  function handleManualSave() {
    if (!savedId && recommendations) {
      const lvl = level || getLevel(score);
      const labelText = mode === 'fr' ? lvl.fr : lvl.af;
      saveAudit(score, lvl, labelText, answers, recommendations);
    }
  }

  function handleRestart() {
    setStep('intro');
    setSector(null);
    setProfil({ equipe: null, pays: null });
    setSurvey({ nom: '', ca: null, outils: [], defi: null });
    setCurrentQ(0);
    setAnswers(Array(20).fill(null));
    setScore(0);
    setLevel(null);
    setRecommendations('');
    setRecoCards([]);
    setAiReport('');
    setSavedId(null);
    setDisplayScore(0);
    if (typeof window !== 'undefined') {
      try { localStorage.removeItem(LS_KEY); } catch {}
    }
  }

  async function handlePrint() {
    if (isPlatform && savedId) {
      try {
        setPdfLoading(true);
        const res = await fetch('/api/pdf', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ auditId: savedId }),
        });
        if (!res.ok) throw new Error();
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `rapport-nexalie-${score}.pdf`;
        a.click();
        URL.revokeObjectURL(url);
      } catch {
        window.print();
      } finally {
        setPdfLoading(false);
      }
    } else {
      window.print();
    }
  }

  const progress = ((currentQ + 1) / 20) * 100;
  const currentQuestion = questions[currentQ];
  const currentAnswer = answers[currentQ];
  const canGoNext = currentAnswer !== null;

  // ─── INTRO ───────────────────────────────────────────────
  if (step === 'intro') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream px-6 py-20 md:py-24">
        <div className="w-full max-w-3xl text-center">
          <div className="mb-8 inline-flex items-center gap-2">
            <div className="h-px w-8 bg-terra" />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-terra">
              {T.free_badge}
            </span>
            <div className="h-px w-8 bg-terra" />
          </div>

          <h1 className="mb-4 font-serif text-4xl font-light leading-tight tracking-tight text-[#0F172A] sm:text-5xl">
            {T.intro_title}
          </h1>

          <p className="mb-3 font-sans text-base font-medium text-terra">
            {T.intro_sub}
          </p>

          <p className="mx-auto mb-10 max-w-lg font-sans text-base leading-relaxed text-slate-600">
            {T.intro_desc}
          </p>

          <div className="mb-10 flex flex-wrap justify-center gap-3">
            {[
              mode === 'fr' ? '20 questions ciblées' : '20 questions adaptées',
              mode === 'fr' ? 'Score sur 100' : 'Score sur 100',
              mode === 'fr' ? 'Recommandations IA' : 'Conseils IA',
              mode === 'fr' ? 'Rapport PDF' : 'Rapport PDF',
            ].map((item, i) => (
              <div key={i} className="rounded-md border border-slate-200 bg-white px-4 py-2 font-sans text-sm text-slate-600 shadow-sm">
                {item}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep('survey')}
            className="rounded-md bg-[#0F172A] px-8 py-4 font-sans text-base font-medium text-white transition-colors hover:bg-slate-800"
          >
            {T.intro_cta}
          </button>

          <p className="mt-5 font-sans text-xs leading-relaxed text-slate-400">
            🔒 Vos données sont confidentielles. Nexalie ne partage aucune information avec des tiers.
          </p>
        </div>
      </div>
    );
  }

  // ─── SONDAGE PRÉ-AUDIT ───────────────────────────────────
  if (step === 'survey') {
    const caOptions = mode === 'fr'
      ? [
          { val: '<5k', label: '< 5 000 € / mois' },
          { val: '5-50k', label: '5 000 — 50 000 € / mois' },
          { val: '50-500k', label: '50 000 — 500 000 € / mois' },
          { val: '>500k', label: '> 500 000 € / mois' },
        ]
      : [
          { val: '<500k', label: '< 500 000 FCFA / mois' },
          { val: '500k-5m', label: '500 000 — 5 M FCFA / mois' },
          { val: '5m-50m', label: '5 M — 50 M FCFA / mois' },
          { val: '>50m', label: '> 50 M FCFA / mois' },
        ];
    const outilsOptions = mode === 'fr'
      ? ['Excel / Google Sheets', 'WhatsApp', 'Réseaux sociaux', 'Site web', 'CRM (HubSpot, Salesforce...)', 'ERP (Odoo, SAP...)', 'Aucun outil numérique']
      : ['Excel / Google Sheets', 'WhatsApp Business', 'Facebook / Instagram', 'Site web', 'CRM', 'Mobile Money', 'Aucun outil numérique'];
    const defiOptions = mode === 'fr'
      ? ['Gagner plus de clients', 'Réduire mes coûts opérationnels', 'Mieux organiser mon équipe', 'Automatiser des tâches répétitives', 'Me lancer ou vendre en ligne']
      : ['Trouver plus de clients', 'Réduire mes coûts', 'Organiser mon équipe', 'Automatiser des tâches', 'Vendre en ligne / Mobile Money'];
    const canContinue = survey.ca && survey.defi;
    const toggleOutil = (o) => setSurvey(s => ({
      ...s,
      outils: s.outils.includes(o) ? s.outils.filter(x => x !== o) : [...s.outils, o],
    }));
    return (
      <div className="flex min-h-screen items-start justify-center bg-cream px-6 py-16 md:py-20">
        <div className="w-full max-w-3xl">
          <button onClick={() => setStep('intro')} className="mb-8 flex items-center gap-1.5 font-sans text-sm text-slate-500 transition-colors hover:text-[#0F172A]">
            ← {mode === 'fr' ? 'Retour' : 'Retour'}
          </button>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-terra">
            {mode === 'fr' ? 'Étape 1 / 4 — Votre contexte' : 'Étape 1 / 4 — Votre contexte'}
          </p>
          <h2 className="mb-2 font-serif text-3xl font-light leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
            {mode === 'fr' ? 'Quelques mots sur votre entreprise' : 'Parlez-nous de votre activité'}
          </h2>
          <p className="mb-8 font-sans text-base leading-relaxed text-slate-600">
            {mode === 'fr' ? 'Ces informations permettent d\'adapter vos recommandations à votre réalité.' : 'Ces réponses permettent d\'adapter les conseils à votre situation réelle.'}
          </p>

          {/* Nom entreprise */}
          <p className="mb-2 font-sans text-sm font-semibold text-[#0F172A]">
            {mode === 'fr' ? 'Nom de votre entreprise (optionnel)' : 'Nom de votre entreprise (facultatif)'}
          </p>
          <input
            type="text"
            value={survey.nom}
            onChange={e => setSurvey(s => ({ ...s, nom: e.target.value }))}
            placeholder={mode === 'fr' ? 'Ex : Boulangerie Martin, Cabinet XYZ...' : 'Ex : Restaurant Maman, Transport Express...'}
            className="mb-7 w-full rounded-md border border-slate-200 bg-white px-4 py-3 font-sans text-sm text-[#0F172A] shadow-sm placeholder:text-slate-400 focus:border-slate-400 focus:ring-0 focus:outline-none transition-colors"
          />

          {/* CA mensuel */}
          <p className="mb-3 font-sans text-sm font-semibold text-[#0F172A]">
            {mode === 'fr' ? 'Votre chiffre d\'affaires mensuel estimé *' : 'Votre chiffre d\'affaires mensuel estimé *'}
          </p>
          <div className="mb-7 grid grid-cols-2 gap-2.5">
            {caOptions.map(opt => (
              <button
                key={opt.val}
                onClick={() => setSurvey(s => ({ ...s, ca: opt.val }))}
                className={`rounded-md border px-4 py-3 text-center font-sans text-sm font-medium transition-all ${
                  survey.ca === opt.val
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Outils utilisés */}
          <p className="mb-3 font-sans text-sm font-semibold text-[#0F172A]">
            {mode === 'fr' ? 'Outils numériques déjà utilisés (plusieurs choix possibles)' : 'Outils numériques déjà utilisés (plusieurs choix possibles)'}
          </p>
          <div className="mb-7 flex flex-wrap gap-2">
            {outilsOptions.map(o => (
              <button
                key={o}
                onClick={() => toggleOutil(o)}
                className={`rounded-md border px-4 py-2 font-sans text-sm font-medium transition-all ${
                  survey.outils.includes(o)
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {o}
              </button>
            ))}
          </div>

          {/* Principal défi */}
          <p className="mb-3 font-sans text-sm font-semibold text-[#0F172A]">
            {mode === 'fr' ? 'Votre principal défi en ce moment *' : 'Votre principal défi en ce moment *'}
          </p>
          <div className="mb-8 flex flex-col gap-2">
            {defiOptions.map(d => (
              <button
                key={d}
                onClick={() => setSurvey(s => ({ ...s, defi: d }))}
                className={`rounded-md border px-4 py-3 text-left font-sans text-sm font-medium transition-all ${
                  survey.defi === d
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          <button
            disabled={!canContinue}
            onClick={() => setStep('profil')}
            className={`w-full rounded-md px-8 py-4 font-sans text-base font-medium transition-colors ${
              canContinue
                ? 'bg-[#0F172A] text-white hover:bg-slate-800'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            {canContinue ? (mode === 'fr' ? 'Continuer →' : 'Continuer →') : (mode === 'fr' ? '* Répondez aux questions obligatoires' : '* Répondez aux questions obligatoires')}
          </button>
        </div>
      </div>
    );
  }

  // ─── SECTEUR ─────────────────────────────────────────────
  // ─── PROFIL ──────────────────────────────────────────────
  if (step === 'profil') {
    const equipeOptions = [
      { val: 'solo', label: mode === 'fr' ? 'Je suis seul(e)' : 'Je travaille seul(e)' },
      { val: '2-5', label: '2 — 5 personnes' },
      { val: '6-20', label: '6 — 20 personnes' },
      { val: '20+', label: mode === 'fr' ? 'Plus de 20' : 'Plus de 20' },
    ];
    const paysOptions = [
      { val: 'fr', label: '🇫🇷 France' },
      { val: 'ci', label: '🇨🇮 Côte d\'Ivoire' },
      { val: 'cg', label: '🇨🇬 Congo' },
      { val: 'cm', label: '🇨🇲 Cameroun' },
      { val: 'sn', label: '🇸🇳 Sénégal' },
      { val: 'other', label: '🌍 Autre' },
    ];
    const canContinue = profil.equipe && profil.pays;
    return (
      <div className="flex min-h-screen items-start justify-center bg-cream px-6 py-16 md:py-20">
        <div className="w-full max-w-3xl">
          <button onClick={() => setStep('survey')} className="mb-8 flex items-center gap-1.5 font-sans text-sm text-slate-500 transition-colors hover:text-[#0F172A]">
            ← {mode === 'fr' ? 'Retour' : 'Retour'}
          </button>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-terra">
            {mode === 'fr' ? 'Étape 2 / 4 — Votre profil' : 'Étape 2 / 4 — Votre profil'}
          </p>
          <h2 className="mb-2 font-serif text-3xl font-light leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
            {mode === 'fr' ? 'Parlez-nous de votre équipe' : 'Parlez-nous de votre équipe'}
          </h2>
          <p className="mb-8 font-sans text-base leading-relaxed text-slate-600">
            {mode === 'fr' ? '2 questions rapides pour adapter vos résultats.' : '2 questions rapides pour adapter vos résultats.'}
          </p>

          {/* Taille équipe */}
          <p className="mb-3 font-sans text-sm font-semibold text-[#0F172A]">
            Combien de personnes dans votre équipe ?
          </p>
          <div className="mb-7 grid grid-cols-2 gap-2.5">
            {equipeOptions.map(opt => (
              <button
                key={opt.val}
                onClick={() => setProfil(p => ({ ...p, equipe: opt.val }))}
                className={`rounded-md border px-4 py-3 text-center font-sans text-sm font-medium transition-all ${
                  profil.equipe === opt.val
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Pays */}
          <p className="mb-3 font-sans text-sm font-semibold text-[#0F172A]">
            {mode === 'fr' ? 'Votre pays ?' : 'Votre pays ?'}
          </p>
          <div className="mb-8 grid grid-cols-3 gap-2.5">
            {paysOptions.map(opt => (
              <button
                key={opt.val}
                onClick={() => setProfil(p => ({ ...p, pays: opt.val }))}
                className={`rounded-md border px-3 py-3 text-center font-sans text-sm font-medium transition-all ${
                  profil.pays === opt.val
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <button
            disabled={!canContinue}
            onClick={() => setStep('sector')}
            className={`w-full rounded-md px-8 py-4 font-sans text-base font-medium transition-colors ${
              canContinue
                ? 'bg-[#0F172A] text-white hover:bg-slate-800'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            {canContinue ? (mode === 'fr' ? 'Continuer →' : 'Continuer →') : (mode === 'fr' ? 'Répondez aux 2 questions' : 'Répondez aux 2 questions')}
          </button>
        </div>
      </div>
    );
  }

  if (step === 'sector') {
    const sectorList = SECTORS[mode] || SECTORS.fr;
    return (
      <div className="flex min-h-screen items-start justify-center bg-cream px-6 py-16 md:py-20">
        <div className="w-full max-w-3xl">
          <button onClick={() => setStep('profil')} className="mb-8 flex items-center gap-1.5 font-sans text-sm text-slate-500 transition-colors hover:text-[#0F172A]">
            ← {mode === 'fr' ? 'Retour' : 'Retour'}
          </button>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-terra">
            {mode === 'fr' ? 'Étape 3 / 4' : 'Étape 3 / 4'}
          </p>
          <h2 className="mb-2 font-serif text-3xl font-light leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
            {mode === 'fr' ? 'Votre secteur d\'activité' : 'Votre secteur d\'activité'}
          </h2>
          <p className="mb-8 font-sans text-base leading-relaxed text-slate-600">
            {mode === 'fr'
              ? 'Sélectionnez votre secteur pour des questions adaptées à vos réalités métier.'
              : 'Choisissez votre secteur pour des questions adaptées à votre activité.'}
          </p>
          <div className="mb-8 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {sectorList.map(s => (
              <button
                key={s.id}
                onClick={() => setSector(s.id)}
                className={`flex flex-col items-center gap-2 rounded-md border px-3 py-4 text-center transition-all ${
                  sector === s.id
                    ? 'border-[#0F172A] bg-[#0F172A]/5 text-[#0F172A]'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                }`}
              >
                <span className="text-2xl">{s.icon}</span>
                <span className="font-sans text-xs font-semibold leading-snug">{s.label}</span>
              </button>
            ))}
          </div>
          <button
            disabled={!sector}
            onClick={() => setStep('questions')}
            className={`mb-3 w-full rounded-md px-8 py-4 font-sans text-base font-medium transition-colors ${
              sector
                ? 'bg-[#0F172A] text-white hover:bg-slate-800'
                : 'cursor-not-allowed bg-slate-100 text-slate-400'
            }`}
          >
            {sector
              ? (mode === 'fr' ? 'Démarrer l\'audit →' : 'Démarrer le bilan →')
              : (mode === 'fr' ? 'Sélectionnez un secteur' : 'Choisissez un secteur')}
          </button>
          <button
            onClick={() => setStep('questions')}
            className="w-full font-sans text-sm text-slate-400 underline transition-colors hover:text-slate-600"
          >
            {mode === 'fr' ? 'Passer cette étape →' : 'Continuer sans secteur →'}
          </button>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ───────────────────────────────────────────
  if (step === 'questions') {
    return (
      <div className="min-h-screen bg-cream px-6 py-16">
        {/* CSS Print */}
        <style suppressHydrationWarning>{`@media print { .no-print { display: none !important; } }`}</style>

        <div className="mx-auto max-w-3xl">
          {/* Header progression */}
          <div className="no-print mb-8">
            <div className="mb-3 flex items-center justify-between">
              <span className="font-sans text-sm text-slate-500">
                {T.question_label} {currentQ + 1} / 20
              </span>
              <span className="font-mono text-sm font-semibold text-[#0F172A]">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-[#0F172A] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="mb-5 rounded-md border border-slate-200 bg-white p-8 shadow-sm">
            <p className="mb-6 font-sans text-lg font-semibold leading-snug text-[#0F172A]">
              <QuestionText text={currentQuestion.q} />
            </p>

            <div className="flex flex-col gap-3">
              {currentQuestion.answers.map((ans, i) => {
                const selected = currentAnswer === ans.score;
                return (
                  <button
                    key={i}
                    onClick={() => handleAnswer(currentQ, ans.score)}
                    className={`flex items-center gap-4 rounded-md border px-4 py-3 text-left font-sans text-sm transition-all ${
                      selected
                        ? 'border-[#0F172A] bg-[#0F172A]/5 font-medium text-[#0F172A] shadow-sm'
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-400'
                    }`}
                  >
                    <span className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      selected ? 'bg-[#0F172A] text-white' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    {ans.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation */}
          <div className="no-print flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQ(q => Math.max(0, q - 1))}
              disabled={currentQ === 0}
              className={`rounded-md border border-slate-200 bg-white px-6 py-3 font-sans text-sm font-medium transition-all ${
                currentQ === 0 ? 'cursor-not-allowed opacity-40 text-slate-400' : 'text-[#0F172A] hover:bg-slate-50'
              }`}
            >
              {T.prev}
            </button>

            {currentQ < questions.length - 1 ? (
              <button
                onClick={() => { if (canGoNext) setCurrentQ(q => q + 1); }}
                disabled={!canGoNext}
                className={`rounded-md px-8 py-3 font-sans text-sm font-medium transition-colors ${
                  canGoNext
                    ? 'bg-[#0F172A] text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                {T.next}
              </button>
            ) : (
              <button
                onClick={() => { if (canGoNext) handleFinish(); }}
                disabled={!canGoNext}
                className={`rounded-md px-8 py-3 font-sans text-sm font-medium transition-colors ${
                  canGoNext
                    ? 'bg-[#0F172A] text-white hover:bg-slate-800'
                    : 'cursor-not-allowed bg-slate-100 text-slate-400'
                }`}
              >
                {T.finish}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── RÉSULTATS ───────────────────────────────────────────
  if (step === 'result') {
    // Écran de transition pendant la génération IA
    if (isLoading) {
      return <DiagnosticLoading structureName={survey.nom || ''} />;
    }

    // Si rapport IA disponible → restitution premium
    if (aiReport) {
      return (
        <RapportRestitution
          score={score}
          structureName={survey.nom || ''}
          rawMarkdown={aiReport}
          mode={mode}
          onRestart={handleRestart}
          onDownload={handlePrint}
        />
      );
    }

    const lvl = level || getLevel(score);
    const levelLabel = mode === 'fr' ? lvl.fr : lvl.af;

    // Formater les recommandations en liste
    const recoLines = recommendations
      ? recommendations.split('\n').filter(l => l.trim())
      : [];

    return (
      <div className="min-h-screen bg-cream px-6 py-16 md:py-20">
        {/* CSS Print */}
        <style suppressHydrationWarning>{`
          @media print {
            .no-print { display: none !important; }
            body { background: #fff !important; }
            * { -webkit-print-color-adjust: exact; color-adjust: exact; }
          }
        `}</style>

        <div className="mx-auto max-w-3xl">
          {/* Titre */}
          <div className="mb-10 text-center">
            <h1 className="mb-2 font-serif text-3xl font-light leading-tight tracking-tight text-[#0F172A] sm:text-4xl">
              {T.result_title}
            </h1>
            <p className="font-sans text-sm text-slate-500">
              {mode === 'fr' ? 'Nexalie OS · Analyse complète' : 'Nexalie OS · Analyse complète'}
            </p>
          </div>

          {/* Score card */}
          <div style={{
            background: 'var(--nx-navy)',
            borderRadius: 20,
            padding: '2.5rem',
            textAlign: 'center',
            marginBottom: '1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', top: -40, right: -40,
              width: 200, height: 200,
              background: lvl.color,
              borderRadius: '50%',
              opacity: 0.08,
            }} />

            {/* Compteur animé */}
            <div style={{
              fontSize: 'clamp(4rem, 12vw, 7rem)',
              fontWeight: 800,
              color: lvl.color,
              lineHeight: 1,
              fontFamily: 'IBM Plex Mono, monospace',
              marginBottom: '0.25rem',
            }}>
              {displayScore}
            </div>
            <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem' }}>
              {T.out_of}
            </div>

            {/* Jauge */}
            <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 999, height: 10, margin: '0 auto 1.5rem', maxWidth: 400 }}>
              <div style={{
                height: '100%',
                width: `${score}%`,
                background: lvl.color,
                borderRadius: 999,
                transition: 'width 1.5s ease',
              }} />
            </div>

            {/* Niveau */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: `${lvl.color}22`,
              border: `1px solid ${lvl.color}55`,
              borderRadius: 999,
              padding: '0.5rem 1.5rem',
            }}>
              <span style={{ fontSize: '1.2rem' }}>{lvl.emoji}</span>
              <span style={{ color: lvl.color, fontWeight: 700, fontSize: '1rem' }}>
                {T.your_level} {levelLabel}
              </span>
            </div>
          </div>

          {/* Recommandations */}
          <div style={{
            background: 'var(--nx-section-bg)',
            border: '1px solid rgba(0,0,0,0.07)',
            borderRadius: 16,
            padding: '2rem',
            marginBottom: '1.5rem',
          }}>
            <h2 style={{
              fontSize: '1.2rem',
              fontWeight: 700,
              color: 'var(--nx-navy)',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}>
              <span style={{
                display: 'inline-flex',
                width: 32,
                height: 32,
                background: 'var(--nx-accent)',
                borderRadius: 8,
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.85rem',
              }}>
                ✦
              </span>
              {T.reco_title}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recoCards.map((card, i) => {
                const isFree = card.cost.toLowerCase().startsWith('gratuit') || card.cost === '0 % de frais' || card.cost === '0% de frais';
                return (
                  <div key={i} style={{ background: '#fff', borderRadius: 12, border: '1px solid rgba(0,0,0,0.06)', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem' }}>
                    {/* Numéro */}
                    <div style={{ flexShrink: 0, width: 28, height: 28, borderRadius: 8, background: 'var(--nx-accent)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, marginTop: 2 }}>
                      {i + 1}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {/* Action */}
                      <p style={{ margin: '0 0 8px', fontWeight: 700, color: 'var(--nx-navy)', fontSize: '0.95rem', lineHeight: 1.4 }}>
                        {card.action}
                      </p>
                      {/* Outil + badges */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
                        <a
                          href={card.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--nx-section-bg)', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, padding: '3px 10px', fontSize: '0.78rem', fontWeight: 600, color: 'var(--nx-accent)', textDecoration: 'none', whiteSpace: 'nowrap' }}
                        >
                          🔗 {card.tool}
                        </a>
                        <span style={{ display: 'inline-flex', alignItems: 'center', background: isFree ? '#ECFDF5' : '#FEF3C7', color: isFree ? '#065F46' : '#92400E', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 700, whiteSpace: 'nowrap' }}>
                          {isFree ? '✓' : '€'} {card.cost}
                        </span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#EFF6FF', color: '#1D4ED8', borderRadius: 6, padding: '3px 10px', fontSize: '0.75rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          ⏱ {card.time}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Benchmark sectoriel */}
          <div style={{ background: 'var(--nx-section-bg)', border: '1px solid rgba(0,0,0,0.07)', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem' }} className="no-print">
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--nx-navy)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📊 {mode === 'fr' ? 'Benchmark PME françaises' : 'Benchmark entreprises africaines'}
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {[
                { label: mode === 'fr' ? 'Médiane secteur' : 'Médiane secteur', val: '48/100', sub: mode === 'fr' ? 'PME similaires' : 'Entreprises similaires' },
                { label: mode === 'fr' ? 'Votre score' : 'Votre score', val: `${score}/100`, sub: score >= 48 ? '✅ Au-dessus' : '⬇️ En dessous', highlight: true },
                { label: 'Top 10%', val: '85/100', sub: mode === 'fr' ? 'Leaders digitaux' : 'Leaders numériques' },
              ].map(({ label, val, sub, highlight }) => (
                <div key={label} style={{ background: highlight ? 'var(--nx-accent)' : '#fff', borderRadius: 10, padding: '14px', textAlign: 'center', border: highlight ? 'none' : '1px solid rgba(0,0,0,0.06)' }}>
                  <p style={{ fontSize: '11px', color: highlight ? 'rgba(255,255,255,0.8)' : 'var(--nx-text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>{label}</p>
                  <p style={{ fontSize: '22px', fontWeight: 800, color: highlight ? '#fff' : 'var(--nx-navy)', marginBottom: '2px' }}>{val}</p>
                  <p style={{ fontSize: '11px', color: highlight ? 'rgba(255,255,255,0.7)' : 'var(--nx-text-secondary)' }}>{sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upgrade CTA pour utilisateurs non-connectés */}
          {!isPlatform && (
            <div style={{ background: 'var(--nx-navy)', borderRadius: 16, padding: '1.75rem', marginBottom: '1.5rem', textAlign: 'center' }} className="no-print">
              <p style={{ fontSize: '11px', letterSpacing: '3px', color: 'var(--nx-accent)', textTransform: 'uppercase', marginBottom: '8px' }}>Allez plus loin</p>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '8px', lineHeight: 1.4 }}>
                {mode === 'fr' ? 'Sauvegardez votre rapport & suivez vos progrès' : 'Sauvegardez votre bilan & suivez vos progrès'}
              </h3>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)', marginBottom: '16px', lineHeight: 1.6 }}>
                {mode === 'fr'
                  ? 'Roadmap IA personnalisée · Rapport PDF complet · Certification Digital Ready'
                  : 'Plan d\'action IA · Rapport PDF complet · Badge Numérique'}
              </p>
              <a href="/signup" style={{ display: 'inline-block', background: 'var(--nx-accent)', color: '#fff', padding: '11px 28px', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '14px' }}>
                {mode === 'fr' ? 'Créer mon compte gratuit →' : 'Créer mon compte gratuit →'}
              </a>
            </div>
          )}

          {/* Actions */}
          <div className="no-print flex flex-col gap-3 border-t border-slate-200 pt-8">
            {/* Téléchargement PDF */}
            <button
              onClick={handlePrint}
              disabled={pdfLoading}
              className={`inline-flex items-center justify-center gap-2 rounded-md px-8 py-4 font-sans text-sm font-medium text-white transition-colors ${
                pdfLoading ? 'cursor-default bg-slate-700 opacity-70' : 'bg-[#0F172A] hover:bg-slate-800'
              }`}
            >
              <span>{pdfLoading ? '⏳' : '↓'}</span>
              {pdfLoading ? 'Génération...' : T.download}
            </button>

            {/* Sauvegarde / CTA inscription */}
            {isPlatform ? (
              savedId ? (
                <div className="rounded-md border border-emerald-200 bg-emerald-50 px-8 py-4 text-center font-sans text-sm font-medium text-emerald-700">
                  {T.saved} ✓
                </div>
              ) : isSaving ? (
                <div className="rounded-md border border-slate-200 bg-slate-50 px-8 py-4 text-center font-sans text-sm text-slate-500">
                  {T.saving}
                </div>
              ) : recommendations && !savedId ? (
                <button
                  onClick={handleManualSave}
                  className="rounded-md bg-[#0F172A] px-8 py-4 font-sans text-sm font-medium text-white transition-colors hover:bg-slate-800"
                >
                  {mode === 'fr' ? 'Sauvegarder dans mon espace' : 'Sauvegarder dans mon espace'}
                </button>
              ) : null
            ) : (
              <a
                href="/signup"
                className="block rounded-md bg-[#0F172A] px-8 py-4 text-center font-sans text-sm font-medium text-white no-underline transition-colors hover:bg-slate-800"
              >
                {T.save_cta}
              </a>
            )}

            {/* Recommencer */}
            <button
              onClick={handleRestart}
              className="rounded-md border border-slate-200 bg-white px-8 py-4 font-sans text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50"
            >
              {T.restart}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
