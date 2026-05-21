export type Mode = 'fr' | 'af';

export const CONTENT = {
  nav: {
    audit: { fr: 'Audit Gratuit', af: 'Bilan Gratuit' },
    platform: { fr: 'Plateforme', af: 'Mes Outils' },
    pricing: { fr: 'Tarifs', af: 'Tarifs' },
    about: { fr: 'À propos', af: 'Qui sommes-nous' },
    contact: { fr: 'Contact', af: 'Nous contacter' },
    login: { fr: 'Connexion', af: 'Se connecter' },
    cta: { fr: 'Commencer maintenant', af: 'Démarrer maintenant' },
  },
  hero: {
    title: {
      fr: 'Accélérez votre transformation digitale',
      af: 'Faites passer votre business au niveau supérieur'
    },
    subtitle: {
      fr: 'Audit intelligent · Roadmap sur-mesure · IA dédiée PME françaises',
      af: 'Audit adapté à votre réalité · Outils concrets · IA pour entrepreneurs africains'
    },
    cta_primary: { fr: 'Faire mon audit gratuit', af: 'Faire mon Bilan Numérique' },
    cta_secondary: { fr: 'Voir la démo', af: 'Voir comment ça marche' },
  },
  modules: {
    audit: { fr: 'Audit de Maturité Digitale', af: 'Bilan Numérique' },
    roadmap: { fr: 'Roadmap Builder', af: "Plan d'Action Digital" },
    library: { fr: 'Bibliothèque Ressources', af: 'Boîte à Outils' },
    roi: { fr: 'Calculateur ROI', af: 'Calcul Impact' },
    cahier: { fr: 'Cahier des Charges', af: 'Ce que je veux' },
    process: { fr: 'Cartographie Processus', af: 'Comment ça marche chez vous' },
  },
  pricing: {
    title: { fr: 'Choisissez votre plan', af: 'Choisissez votre formule' },
    subtitle: {
      fr: 'Sans engagement · Résiliable à tout moment',
      af: 'Paiement Mobile Money disponible · Résiliable à tout moment'
    },
    plans: {
      starter: {
        name: { fr: 'Starter', af: 'Démarrage' },
        price: { fr: '49€', af: '9 900 FCFA' },
        period: { fr: '/mois', af: '/mois (~15€)' },
        desc: { fr: 'Pour démarrer votre transformation', af: 'Pour poser les bases du numérique' },
        features: {
          fr: ['Audit de maturité digitale', 'Rapport PDF personnalisé', '1 roadmap IA/mois', 'Accès bibliothèque', 'Support email'],
          af: ['Bilan Numérique complet', 'Rapport PDF personnalisé', "1 Plan d'Action Digital/mois", 'Accès Boîte à Outils', 'Support WhatsApp']
        }
      },
      pro: {
        name: { fr: 'Pro', af: 'Business' },
        price: { fr: '149€', af: '19 900 FCFA' },
        period: { fr: '/mois', af: '/mois (~30€)' },
        desc: { fr: 'Pour accélérer votre croissance', af: 'Pour développer votre activité' },
        features: {
          fr: ['Tout Starter +', 'Roadmaps illimitées', 'Cahier des charges IA', 'Cartographie processus', 'Calculateur ROI', 'Nexalie OS accès complet'],
          af: ["Tout Démarrage +", "Plans d'action illimités", 'Ce que je veux (IA)', 'Comment ça marche chez vous', 'Calcul Impact', 'Nexalie OS complet']
        }
      },
      enterprise: {
        name: { fr: 'Institutions', af: 'Enterprise' },
        price: { fr: '299€', af: '39 900 FCFA' },
        period: { fr: '/mois', af: '/mois (~61€)' },
        desc: { fr: 'Pour les collectivités et grandes structures', af: 'Pour les grandes entreprises et institutions' },
        features: {
          fr: ['Tout Pro +', 'Équipes multi-utilisateurs', 'Formation équipes', 'Compte dédié', 'SLA garanti', 'Accompagnement mensuel Rélia'],
          af: ['Tout Business +', 'Multi-utilisateurs', 'Formation équipes terrain', 'Compte dédié', 'Accompagnement mensuel Rélia', 'Paiement Mobile Money']
        }
      }
    }
  },
  about: {
    title: { fr: 'Rélia Ebiya — Experte Transformation Digitale', af: 'Rélia Ebiya — Experte en Numérique' },
    intro: {
      fr: "Après 10 ans dans des environnements exigeants — de la finance internationale au conseil stratégique — j'ai fondé Nexalie pour démocratiser l'accès aux outils de transformation digitale pour les PME françaises.",
      af: "Après des années entre Paris et l'Afrique, j'ai créé Nexalie pour aider les entrepreneurs africains à utiliser le numérique comme levier de croissance réel — pas juste comme vitrine."
    },
    values: {
      fr: ['Résultats mesurables', 'Honnêteté radicale', 'Efficacité sans jargon'],
      af: ['Résultats concrets sur le terrain', 'Adaptation à vos réalités', 'Outils qui marchent vraiment']
    }
  },
  usecases: {
    fr: [
      { sector: 'Retail & Commerce', example: 'Une PME de distribution francilienne digitalise sa chaîne logistique en 3 mois — réduction de 40% des erreurs de stock.' },
      { sector: 'Industrie', example: 'Un fabricant de Normandie automatise ses rapports qualité — 8h économisées par semaine.' },
      { sector: 'Services B2B', example: 'Un cabinet de conseil parisien déploie un CRM IA — taux de conversion leads +35%.' },
    ],
    af: [
      { sector: 'Commerce & Distribution', example: "Un grossiste d'Abidjan suit ses ventes sur mobile malgré les coupures courant — stock toujours à jour." },
      { sector: 'Services & Conseil', example: 'Une agence à Brazzaville passe de WhatsApp à un CRM simple — 50% de clients perdus en moins.' },
      { sector: 'BTP & Construction', example: 'Un entrepreneur camerounais gère ses chantiers à distance depuis son téléphone — coordination multipliée par 3.' },
    ]
  },
  contact: {
    title: { fr: 'Parlons de votre projet', af: 'Parlons de votre projet' },
    subtitle: {
      fr: 'Réponse garantie sous 24h ouvrées.',
      af: 'Réponse garantie sous 48h. Disponible sur WhatsApp.'
    },
    form_name: { fr: 'Votre nom', af: 'Votre nom' },
    form_email: { fr: 'Votre email professionnel', af: 'Votre email' },
    form_message: { fr: 'Décrivez votre projet ou votre question', af: 'Parlez-nous de votre activité et de votre besoin' },
    submit: { fr: 'Envoyer', af: 'Envoyer' },
  },
  faq: {
    title: { fr: 'Questions fréquentes', af: 'Vos questions' },
    questions: {
      fr: [
        { q: "L'audit est-il vraiment gratuit ?", a: "Oui, complètement. 20 questions, résultat immédiat, rapport PDF téléchargeable — sans carte bancaire ni inscription obligatoire." },
        { q: "Combien de temps prend l'audit ?", a: "En moyenne 15 à 20 minutes. Vous recevez votre rapport instantanément." },
        { q: "Mes données sont-elles sécurisées ?", a: "Oui. Données hébergées en Europe (conformité RGPD). Aucune revente à des tiers." },
        { q: "Puis-je annuler à tout moment ?", a: "Oui, résiliation en un clic depuis votre espace client, sans frais ni préavis." },
        { q: "L'IA remplace-t-elle le conseil humain ?", a: "Non. Nexalie OS est un accélérateur. Rélia intervient personnellement sur les plans Enterprise." },
      ],
      af: [
        { q: "Le Bilan Numérique est-il vraiment gratuit ?", a: "Oui, 100% gratuit. 20 questions adaptées à l'Afrique, résultat immédiat, rapport PDF — sans carte ni inscription." },
        { q: "Combien de temps prend le bilan ?", a: "Environ 15 minutes. Votre rapport est disponible immédiatement." },
        { q: "Comment payer ? Avez-vous le Mobile Money ?", a: "Oui — Orange Money, Wave et Mobile Money disponibles. Paiement par carte aussi accepté." },
        { q: "Ça marche si mon équipe n'est pas très digitale ?", a: "C'est exactement pour ça que Nexalie existe. Tout est conçu pour des équipes peu digitalisées." },
        { q: "L'IA comprend-elle les réalités africaines ?", a: "Oui. Nexalie OS est entraîné avec des cas concrets : coupures courant, mobile-first, culture orale, Mobile Money, etc." },
      ]
    }
  }
} as const;

export function t(key: keyof typeof CONTENT, mode: Mode): any {
  const section = CONTENT[key];
  if (!section) return key;
  return section;
}

export function getText(obj: any, mode: Mode): string {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[mode] || obj['fr'] || '';
}
