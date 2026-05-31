// Lingala — traductions approximatives
// ⚠️ À faire valider et corriger par un locuteur natif avant mise en production.
// Repli automatique sur le français si une clé est absente ou incertaine.
// Isolé ici pour correction facile sans toucher au code React.

import { fr } from './fr';

export const ln: Partial<typeof fr> = {
  // ── Navigation ────────────────────────────────────────────────
  nav_home:         'Ndako',           // "maison" → accueil
  nav_audit:        'Bokisi',          // "évaluation"
  nav_institutions: 'Bingumba',        // "institutions/organismes"
  nav_about:        'Ntina na biso',   // "à propos de nous"
  nav_platform:     'Esika na ngai',   // "mon espace"
  nav_login:        'Kɔtá',            // "entrer/se connecter"
  nav_signup:       'Mibongisi',       // "s'enregistrer"

  // ── CTA généraux ─────────────────────────────────────────────
  cta_audit:        'Sala bokisi na ngai',   // "faire mon évaluation"
  cta_start:        'Banda',                 // "commencer"
  cta_continue:     'Kokoba',                // "continuer"
  cta_back:         'Zongela',               // "revenir"
  cta_next:         'Elɔkɔ oyo ekoya',       // "ce qui suit" → approximatif, fr fallback recommandé
  cta_finish:       'Tala mikosi na ngai',   // "voir mes résultats"
  cta_loading:      'Kozela…',               // "attendre/chargement"
  cta_sending:      'Kotinda…',              // "envoi en cours"

  // ── Module Audit ─────────────────────────────────────────────
  audit_title:          'Bokisi ya litomba ya dijitale',  // "évaluation maturité digitale"
  audit_subtitle:       'Sóka litomba na yo ya dijitale na miniti 5.',
  audit_score_title:    'Maponto na yo ya litomba',
  audit_email_title:    'Zwá rapport na yo mobimba',
  audit_email_subtitle: 'Tiya email na yo mpo ozwa rapport na yo oyo ekokabola.',
  audit_email_placeholder: 'email@na.yo',
  audit_email_cta:      'Zwa rapport na ngai →',
  audit_email_skip:     'Kokoba kozanga kosimba',
  audit_email_privacy:  'Tosa ata moko te. Makambo na yo ekozala ya kobombama.',

  // ── Homepage ──────────────────────────────────────────────────
  home_hero_surtitle: 'Platform ya dijitale · PME ya Afrique',
  home_hero_title:    'Boussole ya dijitale ya PME ya Afrique',
  home_hero_body:     'PME 90 000 ya Congo ezali koluka komikonza na dijitale. Nexalie eza kolonga bango nzela na nzela.',

  // ── Footer ───────────────────────────────────────────────────
  footer_tagline:  'Nexalie – boussole ya dijitale ya PME ya Afrique',
  footer_bug:      'Loba likambo',
  footer_audit_link: 'Sala bokisi ya bonsomi →',

  // ── Commun ───────────────────────────────────────────────────
  error_generic:   'Likambo moko ekómaki. Sɛnzola lisusu.',
  success_generic: 'Elongaki malamu.',
};
