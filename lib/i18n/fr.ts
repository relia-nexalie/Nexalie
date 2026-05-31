// Fichier de référence — Français (langue source)
// Ne pas supprimer de clés ici : toutes les autres langues s'en inspirent.

export const fr = {
  // ── Navigation ────────────────────────────────────────────────
  nav_home:          'Accueil',
  nav_audit:         'Audit',
  nav_institutions:  'Institutions',
  nav_about:         'À propos',
  nav_platform:      'Ma plateforme',
  nav_account:       'Mon compte',
  nav_login:         'Se connecter',
  nav_signup:        'Créer un compte',

  // ── CTA généraux ─────────────────────────────────────────────
  cta_audit:         'Faire mon audit gratuit',
  cta_start:         'Commencer',
  cta_continue:      'Continuer',
  cta_back:          'Retour',
  cta_submit:        'Envoyer',
  cta_next:          'Suivant',
  cta_finish:        'Voir mes résultats',
  cta_loading:       'Chargement…',
  cta_sending:       'Envoi…',

  // ── Module Audit ─────────────────────────────────────────────
  audit_title:       'Audit de Maturité Digitale',
  audit_subtitle:    'Évaluez votre niveau de digitalisation en 5 minutes.',
  audit_question_of: 'Question {n} sur {total}',
  audit_score_title: 'Votre score de maturité digitale',
  audit_score_unit:  '/ 100',
  audit_email_title: 'Recevez votre rapport complet',
  audit_email_subtitle: 'Entrez votre email pour débloquer votre rapport personnalisé et vos recommandations.',
  audit_email_placeholder: 'votre@email.com',
  audit_email_cta:   'Recevoir mon rapport →',
  audit_email_skip:  'Continuer sans enregistrer',
  audit_email_privacy: 'Aucun spam. Vos données restent confidentielles.',

  // ── RapportRestitution ────────────────────────────────────────
  rapport_title:     'Votre rapport de maturité digitale',
  rapport_reco:      'Vos recommandations prioritaires',
  rapport_next:      'Prochaines étapes recommandées',
  rapport_cta:       'Discuter de mon plan d\'action →',

  // ── Homepage ──────────────────────────────────────────────────
  home_hero_surtitle: 'Plateforme numérique · PME africaines',
  home_hero_title:   'La boussole numérique des PME africaines',
  home_hero_body:    '90 000 PME congolaises cherchent à se digitaliser. Nexalie les accompagne pas à pas : diagnostic, feuille de route, outils concrets.',
  home_how_title:    'Comment ça fonctionne',
  home_about_title:  'Notre raison d\'être',

  // ── Page Institutions ─────────────────────────────────────────
  inst_hero_label:   'Pour les institutions & partenaires',
  inst_hero_title:   'Accélérer la transformation numérique des PME africaines',
  inst_cta_contact:  'Nous contacter →',
  inst_cta_demo:     'Demander une démonstration',

  // ── Footer ───────────────────────────────────────────────────
  footer_tagline:    'Nexalie – la boussole numérique des PME africaines',
  footer_product:    'Produit',
  footer_resources:  'Ressources',
  footer_legal:      'Légal',
  footer_bug:        'Signaler un problème',
  footer_made_by:    'Fait avec ♥ par Rélia Ebiya · Brazzaville & Paris',
  footer_audit_link: 'Faire mon audit gratuit →',

  // ── Liens footer ─────────────────────────────────────────────
  footer_audit:        'Audit gratuit',
  footer_institutions: 'Institutions',
  footer_whitemark:    'Marque Blanche',
  footer_blog:         'Blog',
  footer_about:        'À propos',
  footer_contact:      'Contact',
  footer_faq:          'FAQ',
  footer_legal_mentions: 'Mentions légales',
  footer_cgv:          'CGV',
  footer_privacy:      'Politique de confidentialité',

  // ── Commun ───────────────────────────────────────────────────
  error_generic:     'Une erreur est survenue. Veuillez réessayer.',
  success_generic:   'Opération réussie.',
} as const;

export type I18nKey = keyof typeof fr;
