// Kituba (Kikongo ya Leta) — traductions approximatives
// ⚠️ À faire valider et corriger par un locuteur natif avant mise en production.
// Repli automatique sur le français si une clé est absente ou incertaine.
// Isolé ici pour correction facile sans toucher au code React.

import { fr } from './fr';

export const ktu: Partial<typeof fr> = {
  // ── Navigation ────────────────────────────────────────────────
  nav_home:         'Yaya',             // "maison/accueil"
  nav_audit:        'Luka-zayilu',      // "recherche de connaissance" → évaluation
  nav_institutions: 'Bitandu',          // "institutions"
  nav_about:        'Biso kiese',       // "nous / à propos"
  nav_platform:     'Esika yami',       // "mon espace"
  nav_login:        'Kota',             // "entrer"
  nav_signup:       'Tomba zina',       // "inscrire son nom"

  // ── CTA généraux ─────────────────────────────────────────────
  cta_audit:        'Sala luka yami',   // "faire mon évaluation"
  cta_start:        'Tambula',          // "commencer/marcher"
  cta_continue:     'Nzila',            // "continuer sur la route"
  cta_back:         'Zonga',            // "revenir"
  cta_next:         'Landila',          // "suivre"
  cta_finish:       'Mono tala mikosi', // "voir mes résultats"
  cta_loading:      'Zengi…',           // "attente"
  cta_sending:      'Tinda…',           // "envoi"

  // ── Module Audit ─────────────────────────────────────────────
  audit_title:          'Luka-zayilu ya miangu ya dijitale',
  audit_subtitle:       'Luka miangu yaku ya dijitale na miniti 5.',
  audit_score_title:    'Pontu yaku ya miangu',
  audit_email_title:    'Baka rapport yaku mobimba',
  audit_email_subtitle: 'Sika email yaku mpo obaka rapport yaku ya bwala.',
  audit_email_placeholder: 'email@yaku',
  audit_email_cta:      'Baka rapport yami →',
  audit_email_skip:     'Landila kozanga kobomba',
  audit_email_privacy:  'Tosa te. Makambu yaku ezali ya kobombama.',

  // ── Homepage ──────────────────────────────────────────────────
  home_hero_surtitle: 'Platform ya dijitale · PME ya Afrika',
  home_hero_title:    'Boussole ya dijitale ya PME ya Afrika',
  home_hero_body:     'PME 90 000 ya Kongo ezali koluka komikonza na dijitale. Nexalie elongi bango nzela.',

  // ── Footer ───────────────────────────────────────────────────
  footer_tagline:   'Nexalie, boussole ya dijitale ya PME ya Afrika',
  footer_bug:       'Loba likambu',
  footer_audit_link: 'Sala luka ya bonsomi →',

  // ── Commun ───────────────────────────────────────────────────
  error_generic:    'Likambu moko ekómi. Mono sɛnzola lisusu.',
  success_generic:  'Elongi malamu.',
};
