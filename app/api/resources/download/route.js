export const runtime = 'nodejs';

// Contenu des 12 ressources (6 FR + 6 AF)
const RESOURCE_CONTENT = {
  // ── France ──────────────────────────────────────────────────────────
  'rgpd-checklist': {
    title: 'Checklist RGPD pour PME — 47 Points de Contrôle',
    market: 'FR',
    sections: [
      { heading: 'Registre des traitements', items: ['Avez-vous listé tous vos traitements de données personnelles ?', 'Chaque traitement a-t-il une base légale documentée ?', 'Les durées de conservation sont-elles définies pour chaque catégorie ?', 'Le responsable de chaque traitement est-il identifié ?', 'Les sous-traitants sont-ils listés avec leurs garanties ?'] },
      { heading: 'Information et consentement', items: ['Vos formulaires contiennent-ils une mention d\'information RGPD ?', 'Votre politique de confidentialité est-elle accessible et à jour ?', 'Le consentement est-il recueilli de façon explicite (case non pré-cochée) ?', 'La preuve du consentement est-elle conservée ?', 'Les cookies sont-ils gérés par un bandeau conforme ?'] },
      { heading: 'Droits des personnes', items: ['Avez-vous une procédure pour répondre aux demandes d\'accès ?', 'Pouvez-vous supprimer les données d\'une personne à sa demande ?', 'Pouvez-vous exporter les données d\'une personne (portabilité) ?', 'Votre délai de réponse est-il inférieur à 30 jours ?', 'Avez-vous un email dédié aux demandes RGPD ?'] },
      { heading: 'Sécurité', items: ['Les accès aux données sont-ils contrôlés par rôle ?', 'Les données sensibles sont-elles chiffrées ?', 'Avez-vous une politique de mots de passe forts ?', 'Les sauvegardes sont-elles testées régulièrement ?', 'Une procédure de gestion des violations de données est-elle en place ?'] },
      { heading: 'Sous-traitants et transferts', items: ['Un DPA est-il signé avec chaque sous-traitant ?', 'Avez-vous audité les pratiques RGPD de vos prestataires ?', 'Les transferts hors UE sont-ils encadrés (CCT ou décision d\'adéquation) ?', 'Google Analytics est-il configuré en mode anonymisation ?', 'Vos outils SaaS américains ont-ils des garanties SCCs ?'] },
      { heading: 'Gouvernance', items: ['Avez-vous nommé un référent RGPD (DPO ou équivalent) ?', 'Les équipes ont-elles été sensibilisées au RGPD ?', 'Des audits RGPD internes sont-ils planifiés annuellement ?', 'Le Comité de direction est-il informé des risques RGPD ?', 'Avez-vous un plan de réponse aux incidents de sécurité ?'] },
    ],
  },

  'cdc-digital': {
    title: 'Cahier des Charges — Projet Digital (Template)',
    market: 'FR',
    sections: [
      { heading: '1. Présentation de l\'entreprise', items: ['Nom et secteur d\'activité', 'Taille (collaborateurs, CA)', 'Contexte et historique digital', 'Interlocuteur principal et décisionnaire'] },
      { heading: '2. Objectifs du projet', items: ['Objectif business principal (ex: +30% leads en ligne)', 'Objectifs secondaires', 'Délai et budget global', 'Critères de succès mesurables (KPI)'] },
      { heading: '3. Périmètre fonctionnel', items: ['Liste des fonctionnalités requises (Must Have)', 'Fonctionnalités souhaitables (Nice to Have)', 'Fonctionnalités hors périmètre', 'Intégrations avec systèmes existants (CRM, ERP...)'] },
      { heading: '4. Contraintes techniques', items: ['Hébergement préféré (cloud, on-premise, France)', 'Technologies acceptées ou imposées', 'Compatibilité navigateurs et mobiles', 'Performance attendue (temps de chargement, disponibilité)'] },
      { heading: '5. Contenu et SEO', items: ['Qui produit le contenu ?', 'Stratégie SEO (mots-clés cibles, volumes)', 'Migration de contenu existant ?', 'Politique éditoriale et fréquence de publication'] },
      { heading: '6. Processus de sélection', items: ['Date limite de réception des offres', 'Critères d\'évaluation (technique 40%, prix 30%, références 30%)', 'Format de réponse attendu', 'Contact pour questions avant soumission'] },
    ],
  },

  'contrat-web': {
    title: 'Contrat de Développement Web — Modèle France',
    market: 'FR',
    sections: [
      { heading: 'Article 1 — Objet du contrat', items: ['Le Prestataire s\'engage à développer et livrer le projet défini en Annexe A.', 'Les spécifications techniques sont détaillées dans le cahier des charges joint.', 'Toute modification de périmètre fera l\'objet d\'un avenant signé.'] },
      { heading: 'Article 2 — Délais et livrables', items: ['Planning prévisionnel détaillé en Annexe B', 'Jalons intermédiaires avec recettage client', 'Pénalités de retard : 1% du montant par semaine de retard au-delà de 15 jours', 'Force majeure : définition et procédure'] },
      { heading: 'Article 3 — Prix et conditions de paiement', items: ['Montant total HT : [MONTANT]', 'Acompte 30% à la signature', '40% à la livraison de la version bêta', '30% à la recette finale', 'Facturation mensuelle possible pour les projets > 6 mois'] },
      { heading: 'Article 4 — Propriété intellectuelle', items: ['Transfert de propriété complet au Client après paiement intégral', 'Le Prestataire conserve le droit de mentionner le projet dans ses références', 'Les bibliothèques open-source utilisées restent sous leurs licences d\'origine', 'Le code source sera livré dans un dépôt Git accessible au Client'] },
      { heading: 'Article 5 — Garanties et maintenance', items: ['Garantie de 3 mois sur les bugs post-livraison (corrections gratuites)', 'Périmètre de la garantie : fonctionnalités du CDC uniquement', 'Offre de maintenance optionnelle : [TARIF]/mois', 'Temps de réponse garanti en maintenance : 48h ouvrées'] },
      { heading: 'Article 6 — Résiliation', items: ['Résiliation possible avec 30 jours de préavis', 'En cas de résiliation, facturation au prorata de l\'avancement', 'Livraison des éléments produits jusqu\'à la date de résiliation', 'Remboursement des acomptes si résiliation à l\'initiative du Prestataire'] },
    ],
  },

  'roi-digital': {
    title: 'Calculateur ROI — Transformation Digitale',
    market: 'FR',
    sections: [
      { heading: 'Coûts d\'investissement', items: ['Développement / achat logiciel : _____ €', 'Formation des équipes : _____ €', 'Infrastructure et licences (an 1) : _____ €', 'Accompagnement consultant : _____ €', 'TOTAL INVESTISSEMENT : _____ €'] },
      { heading: 'Gains quantifiables attendus', items: ['Réduction temps de traitement manuel : _____ h/mois × _____ €/h = _____ €/an', 'Augmentation du CA en ligne : _____ %  × CA actuel = _____ €/an', 'Réduction des erreurs et reprises : _____ €/an', 'Économies sur les impressions/courriers : _____ €/an', 'TOTAL GAINS ANNUELS : _____ €'] },
      { heading: 'Calcul du ROI', items: ['ROI an 1 = (Gains - Investissement) / Investissement × 100 = _____%', 'Délai de retour sur investissement = Investissement / Gains annuels = _____ mois', 'VAN sur 3 ans (taux actualisation 5%) = _____ €', 'Bénéfice net sur 3 ans = _____ €'] },
      { heading: 'Gains non quantifiables (qualitatifs)', items: ['Amélioration de la satisfaction client', 'Réduction du turnover (moins de tâches répétitives)', 'Meilleure prise de décision (data disponible)', 'Image de marque modernisée', 'Conformité réglementaire renforcée'] },
    ],
  },

  'kpi-digital': {
    title: 'Tableau de Bord KPI Digital — 32 Indicateurs',
    market: 'FR',
    sections: [
      { heading: 'Présence en ligne', items: ['Trafic mensuel site web (visiteurs uniques)', 'Taux de rebond (%)', 'Positionnement Google — top 3 mots-clés', 'Score Google My Business (étoiles)', 'Abonnés réseaux sociaux (croissance mensuelle %)'] },
      { heading: 'Acquisition clients', items: ['Coût d\'acquisition client (CAC) en €', 'Taux de conversion visiteur → lead (%)', 'Nombre de leads entrants par canal', 'Délai moyen de conversion lead → client (jours)', 'Part du CA venant du digital (%)'] },
      { heading: 'Efficacité opérationnelle', items: ['Temps moyen de traitement d\'une commande (h)', 'Taux d\'automatisation des tâches répétitives (%)', 'Nombre d\'outils non intégrés (silos)', 'Taux d\'adoption des outils digitaux par les équipes (%)', 'Heures économisées par automatisation (mois)'] },
      { heading: 'Satisfaction client', items: ['NPS (Net Promoter Score)', 'CSAT (Customer Satisfaction Score %)', 'Taux de rétention client (%)', 'Délai moyen de réponse SAV (h)', 'Taux de résolution au premier contact (%)'] },
      { heading: 'Finance digitale', items: ['CA e-commerce / CA total (%)', 'Panier moyen en ligne vs. hors ligne', 'ROI des campagnes digitales (%)', 'Coût par clic (CPC) campagnes paid', 'ROAS (Return on Ad Spend)'] },
    ],
  },

  'benchmark-fr': {
    title: 'Benchmark Sectoriel France 2026 — Maturité Digitale',
    market: 'FR',
    sections: [
      { heading: 'Commerce & Distribution', items: ['Score moyen : 52/100', 'Top 25% : 68/100', 'Top 10% : 82/100', 'Forces : présence e-commerce, CRM', 'Faiblesses : automatisation, data analytics'] },
      { heading: 'Industrie & BTP', items: ['Score moyen : 48/100', 'Top 25% : 65/100', 'Top 10% : 79/100', 'Forces : ERP, gestion de projet', 'Faiblesses : digitalisation terrain, IoT'] },
      { heading: 'Santé & Médico-social', items: ['Score moyen : 55/100', 'Top 25% : 72/100', 'Top 10% : 85/100', 'Forces : dossier patient numérique, téléconsultation', 'Faiblesses : cybersécurité, interopérabilité'] },
      { heading: 'Services aux entreprises', items: ['Score moyen : 60/100', 'Top 25% : 74/100', 'Top 10% : 88/100', 'Forces : outils SaaS, communication digitale', 'Faiblesses : automatisation processus, IA générative'] },
      { heading: 'Tendances 2026', items: ['IA générative : 38% des PME l\'utilisent déjà', 'Cloud : 72% des PME > 10 salariés sur cloud', 'Cybersécurité : 1 PME sur 3 victime d\'une attaque en 2025', 'E-commerce : croissance +14% en 2025 vs 2024', 'Automatisation RPA : adoption × 2 en 18 mois'] },
    ],
  },

  'audit-grille': {
    title: 'Grille d\'Auto-évaluation Digitale — 8 Dimensions',
    market: 'FR',
    sections: [
      { heading: 'Mode d\'emploi', items: ['Pour chaque item, notez de 1 (pas du tout) à 5 (totalement maîtrisé)', 'Additionnez vos points par dimension (max 25 points/dimension)', 'Multipliez par 0,5 pour obtenir votre score sur 100', 'Comparez avec les benchmarks sectoriels Nexalie'] },
      { heading: 'Dim. 1 — Stratégie & Gouvernance (max 25)', items: ['La direction a un plan digital documenté : /5', 'Un responsable digital est identifié : /5', 'Un budget digital annuel est alloué : /5', 'Les projets digitaux sont priorisés formellement : /5', 'Les résultats digitaux sont suivis en comité de direction : /5'] },
      { heading: 'Dim. 2 — Outils & Systèmes (max 25)', items: ['Un CRM est utilisé pour gérer les clients : /5', 'La comptabilité est numérisée (logiciel, pas Excel) : /5', 'Les données clients sont centralisées dans un outil unique : /5', 'Les outils communiquent entre eux (pas de ressaisie manuelle) : /5', 'L\'infrastructure cloud est utilisée pour au moins 1 service critique : /5'] },
      { heading: 'Dim. 3 — Compétences & Culture (max 25)', items: ['Les équipes ont été formées aux outils digitaux dans les 12 derniers mois : /5', 'Un plan de formation digital annuel existe : /5', 'Des profils tech sont présents dans l\'équipe : /5', 'La culture de l\'erreur est tolérante (droit à l\'expérimentation) : /5', 'Les idées digitales terrain remontent jusqu\'à la direction : /5'] },
      { heading: 'Dim. 4 — Expérience Client (max 25)', items: ['Le site web est optimisé pour mobile : /5', 'Un client peut acheter ou commander en ligne : /5', 'La satisfaction client est mesurée digitalement (NPS, avis) : /5', 'Le service client répond via au moins 2 canaux digitaux : /5', 'Le parcours client en ligne est analysé (analytics) : /5'] },
      { heading: 'Récapitulatif', items: ['Dim. 1 — Stratégie : ___/25', 'Dim. 2 — Outils : ___/25', 'Dim. 3 — Compétences : ___/25', 'Dim. 4 — Expérience client : ___/25', 'TOTAL : ___/100 → Comparez sur nexalie.co/audit'] },
    ],
  },

  'cgv-saas': {
    title: 'CGV SaaS B2B — Conditions Générales de Vente',
    market: 'FR',
    sections: [
      { heading: 'Article 1 — Objet et champ d\'application', items: ['Les présentes CGV régissent l\'accès et l\'utilisation du logiciel en tant que service (SaaS) édité par [Société].', 'Elles s\'appliquent à tout Client professionnel (B2B) souscrivant un abonnement.', 'Toute commande implique l\'acceptation intégrale des présentes CGV.'] },
      { heading: 'Article 2 — Accès au service', items: ['L\'accès est fourni via internet, disponible 24h/24 sous réserve de maintenance.', 'Disponibilité garantie : 99,5% sur base mensuelle (hors maintenance planifiée).', 'Chaque utilisateur dispose d\'un identifiant personnel et non-cessible.', 'Le Client est responsable de la sécurité des accès de ses utilisateurs.'] },
      { heading: 'Article 3 — Tarification et facturation', items: ['Abonnement mensuel ou annuel selon le plan souscrit.', 'Facturation par prélèvement automatique ou virement SEPA.', 'Toute période commencée est due intégralement.', 'Augmentation tarifaire : préavis de 60 jours par email.', 'TVA française applicable selon la réglementation en vigueur.'] },
      { heading: 'Article 4 — Données et confidentialité', items: ['Le Client reste propriétaire de ses données.', 'Le Prestataire agit en qualité de Sous-traitant au sens du RGPD.', 'Export des données possible à tout moment au format CSV/JSON.', 'Suppression des données dans les 30 jours suivant la résiliation.', 'Hébergement en France ou UE (conformité RGPD).'] },
      { heading: 'Article 5 — Résiliation', items: ['Résiliation possible à tout moment depuis l\'interface (sans frais).', 'Préavis : fin de la période en cours pour les abonnements mensuels.', 'Préavis de 30 jours pour les abonnements annuels.', 'Aucun remboursement prorata temporis sauf défaillance du Prestataire.'] },
    ],
  },

  'presentation-conseil': {
    title: 'Template Présentation — Stratégie Digitale (Conseil de Direction)',
    market: 'FR',
    sections: [
      { heading: 'Slide 1 — Titre', items: ['[Nom Entreprise] — Stratégie de Transformation Digitale 2026–2028', 'Présenté par : [Nom, Fonction]', 'Date : [Date]', 'Confidentiel'] },
      { heading: 'Slide 2 — Diagnostic de départ', items: ['Score de maturité actuel : [X]/100', 'Positionnement vs secteur : [X] pts en dessous / au-dessus de la moyenne', 'Principaux points forts : [liste 3 forces]', 'Principaux axes d\'amélioration : [liste 3 faiblesses]'] },
      { heading: 'Slide 3 — Enjeux et opportunités', items: ['Chiffre clé 1 : [ex: 68% des achats B2B débutent en ligne]', 'Chiffre clé 2 : [ex: nos concurrents X et Y ont investi en digital]', 'Risque de ne pas agir : [perte de parts de marché estimée]', 'Opportunité identifiée : [ex: premier sur notre secteur à proposer X]'] },
      { heading: 'Slide 4 — Plan à 3 ans', items: ['An 1 (2026) : Fondations — [3 actions prioritaires]', 'An 2 (2027) : Accélération — [3 actions de développement]', 'An 3 (2028) : Excellence — [3 actions d\'optimisation]', 'Budget total estimé : [X]€ sur 3 ans'] },
      { heading: 'Slide 5 — ROI et décision demandée', items: ['Investissement an 1 : [X]€', 'Gains estimés an 1 : [X]€', 'ROI cible à 3 ans : [X]%', 'Décision demandée au Comité : validation budget + nomination sponsor digital'] },
    ],
  },

  // ── Afrique ─────────────────────────────────────────────────────────
  'ohada-digital': {
    title: 'Contrat OHADA Digital — Modèle Afrique francophone',
    market: 'AF',
    sections: [
      { heading: 'Préambule', items: ['Le présent contrat est régi par l\'Acte Uniforme OHADA sur le droit commercial général.', 'Les parties reconnaissent la valeur juridique des échanges électroniques.', 'Le for compétent est la juridiction commerciale du siège du prestataire, sauf accord contraire.'] },
      { heading: 'Article 1 — Prestations', items: ['Description détaillée des services / livrables digitaux', 'Spécifications techniques en annexe', 'Jalons et dates de livraison contractuelles', 'Modalités de recettage et validation'] },
      { heading: 'Article 2 — Rémunération', items: ['Montant total en FCFA (XOF ou XAF selon pays) HT et TTC', 'Acompte 30% à la signature (virement ou Mobile Money)', 'Solde à la livraison finale validée', 'TVA applicable selon le pays (18% Côte d\'Ivoire, 18% Cameroun, 18,9% Congo)'] },
      { heading: 'Article 3 — Propriété intellectuelle', items: ['Droit OHADA : l\'auteur est présumé être le créateur (AUA art. 8)', 'Cession des droits patrimoniaux au Client après paiement intégral', 'Droit moral incessible conservé par le Prestataire', 'Clause de portfolio : mention possible sauf refus écrit du Client'] },
      { heading: 'Article 4 — Confidentialité', items: ['Obligation de confidentialité pour les deux parties', 'Durée : 3 ans après la fin du contrat', 'Exceptions : informations publiques, obligation légale', 'Sanction : dommages et intérêts selon barème OHADA'] },
      { heading: 'Article 5 — Résolution des litiges', items: ['Tentative de règlement amiable obligatoire (30 jours)', 'Médiation via la Chambre de Commerce compétente', 'Arbitrage CCJA si échec de la médiation', 'Droit applicable : droit OHADA + droit national du pays d\'exécution'] },
    ],
  },

  'mobile-money-guide': {
    title: 'Guide Mobile Money Business — Afrique francophone 2026',
    market: 'AF',
    sections: [
      { heading: 'Les opérateurs par pays', items: ['Côte d\'Ivoire : Orange Money (leader), MTN MoMo, Wave, Moov Money', 'Congo-Brazzaville : Orange Money, MTN MoMo, Airtel Money', 'Cameroun : Orange Money, MTN MoMo', 'Sénégal : Orange Money, Wave (très fort), Free Money', 'Mali : Orange Money, Moov Money', 'Burkina Faso : Orange Money, Moov Money, Coris Money'] },
      { heading: 'Intégration technique (API)', items: ['CinetPay : agrégateur multi-opérateurs, 1 seule intégration API', 'Frais de transaction : 2–4% selon volume et opérateur', 'Délai de règlement : 24–72h selon opérateur', 'Documentation API : cinetpay.com/docs', 'SDK disponibles : PHP, Node.js, Python, Java'] },
      { heading: 'QR Code marchand (sans technique)', items: ['Inscription en agence Orange/MTN avec justificatifs entreprise', 'Délai d\'activation : 3 à 10 jours ouvrés', 'Frais : 0 à 1% selon volume mensuel', 'Plafond par transaction : 1M à 5M FCFA selon opérateur', 'Relevés : téléchargeables depuis l\'espace marchand'] },
      { heading: 'Comptabilité et réconciliation', items: ['Exporter les relevés Mobile Money chaque semaine (format CSV)', 'Croiser avec la comptabilité (logiciel ou tableur)', 'Attention aux frais de retrait (2–3%) dans le calcul de marge', 'TVA sur les frais de service Mobile Money : vérifier avec votre comptable', 'Conservation des preuves de paiement : 5 ans minimum (droit OHADA)'] },
      { heading: 'Sécurité et fraudes', items: ['Ne jamais partager votre PIN de compte marchand', 'Vérifier systématiquement la confirmation SMS avant livraison', 'Méfiez-vous des captures d\'écran falsifiées (vérifier via l\'API)', 'Activer les alertes SMS/email pour chaque transaction', 'Signaler immédiatement toute transaction suspecte à l\'opérateur'] },
    ],
  },

  'cdc-web-af': {
    title: 'Cahier des Charges — Site Web Afrique (Mobile First)',
    market: 'AF',
    sections: [
      { heading: '1. Contraintes spécifiques Afrique', items: ['Site optimisé pour connexions 2G/3G (pages < 500Ko)', 'Mobile first obligatoire (80%+ du trafic sur mobile)', 'Compatibilité avec navigateurs bas de gamme (Chrome Mobile, Opera Mini)', 'Mode offline partiel souhaitable (Service Worker)', 'Paiement Mobile Money intégré (Orange Money, MTN MoMo)'] },
      { heading: '2. Objectifs business', items: ['Objectif principal (génération de leads, e-commerce, image de marque)', 'Cible utilisateurs (tranche d\'âge, niveau digital)', 'Zone géographique ciblée (pays, villes)', 'Budget marketing digital prévu (Facebook Ads, WhatsApp Business)'] },
      { heading: '3. Fonctionnalités requises', items: ['Catalogue produits/services responsive', 'Formulaire de contact avec WhatsApp intégré', 'Page paiement Mobile Money', 'Version française et langue locale si applicable', 'Partage facile sur WhatsApp et Facebook'] },
      { heading: '4. Performances attendues', items: ['Temps de chargement < 3s sur 3G', 'Score Google PageSpeed Mobile > 70', 'Disponibilité 99% (hébergement local ou CDN africain)', 'Sauvegarde automatique quotidienne', 'SSL/HTTPS obligatoire'] },
      { heading: '5. Maintenance', items: ['Mise à jour de sécurité mensuelle', 'Formation à l\'utilisation du back-office (1 session incluse)', 'Contrat de maintenance optionnel : 50 000–200 000 FCFA/mois', 'Support WhatsApp Business pour les urgences', 'Rapport mensuel de trafic inclus'] },
    ],
  },

  'guide-donnees-cg': {
    title: 'Guide Protection des Données Personnelles — Congo-Brazzaville',
    market: 'AF',
    sections: [
      { heading: 'Cadre juridique au Congo', items: ['Loi n°13-2021 du 11 mai 2021 relative à la protection des données personnelles', 'Commission nationale de l\'informatique et des libertés (CNIL-Congo)', 'Déclaration préalable obligatoire pour tout traitement automatisé', 'Sanctions : amende jusqu\'à 50M FCFA + emprisonnement possible', 'Délégué à la Protection des Données (DPD) recommandé pour entreprises > 50 salariés'] },
      { heading: 'Obligations pratiques', items: ['Déclarer vos traitements auprès de la CNIL-Congo (formulaire en ligne)', 'Afficher la politique de confidentialité sur votre site web', 'Recueillir le consentement des personnes avant collecte de données', 'Conserver les données au minimum nécessaire à la finalité', 'Sécuriser les données (chiffrement, accès restreints)'] },
      { heading: 'Droits des personnes', items: ['Droit d\'accès : toute personne peut demander ses données', 'Droit de rectification : correction des données inexactes', 'Droit d\'opposition : refus de certains traitements', 'Droit à l\'effacement (limité selon les finalités)', 'Délai de réponse : 30 jours maximum'] },
      { heading: 'Transferts internationaux', items: ['Transfert hors Congo soumis à autorisation de la CNIL-Congo', 'Pays adequats (reconnaissance mutuelle) : à vérifier', 'Clause contractuelle type recommandée avec prestataires étrangers', 'Cloud : hébergement en Afrique ou avec garanties spécifiques', 'Cas pratique : données clients sur serveur français → déclaration requise'] },
      { heading: 'Bonnes pratiques entreprises', items: ['Nommer un référent protection des données interne', 'Former les équipes 1 fois par an minimum', 'Auditer vos prestataires (hébergeur, CRM, email)', 'Procédure de notification violation : alerter la CNIL-Congo sous 72h', 'Registre des traitements tenu à jour'] },
    ],
  },

  'roi-af': {
    title: 'Calculateur ROI — Investissements Digitaux (FCFA)',
    market: 'AF',
    sections: [
      { heading: 'Coûts d\'investissement (en FCFA)', items: ['Site web ou application : _____ FCFA', 'Intégration Mobile Money : _____ FCFA', 'Formation équipes (jours-formateur) : _____ FCFA', 'Équipement (ordinateurs, tablettes) : _____ FCFA', 'Abonnement logiciels SaaS / an : _____ FCFA', 'TOTAL INVESTISSEMENT : _____ FCFA'] },
      { heading: 'Gains attendus (par an, en FCFA)', items: ['Nouvelles ventes via le digital : _____ FCFA', 'Économies sur déplacements (commandes en ligne) : _____ FCFA', 'Réduction coûts de communication (impression, déplacement) : _____ FCFA', 'Gain de temps équipe (heures × coût horaire) : _____ FCFA', 'TOTAL GAINS ANNUELS : _____ FCFA'] },
      { heading: 'Calcul ROI', items: ['ROI = (Gains - Investissement) / Investissement × 100 = _____%', 'Point mort = Investissement / Gains mensuels = _____ mois', 'Bénéfice net an 1 = _____ FCFA', 'Bénéfice cumulé 3 ans = _____ FCFA'] },
      { heading: 'Spécificités Afrique', items: ['Intégrer le coût des coupures d\'internet (perte CA estimée)', 'Prévoir 20% de budget formation supplémentaire (adoption plus longue)', 'Mobile Money : déduire les frais de retrait (2–4%) des gains', 'Taux de change si achat de licences en EUR/USD : risque à couvrir', 'Amortissement matériel sur 3 ans (chaleur et poussière réduisent la durée de vie)'] },
    ],
  },

  'audit-pme-af': {
    title: 'Grille Bilan Numérique — PME Afrique francophone',
    market: 'AF',
    sections: [
      { heading: 'Mode d\'emploi', items: ['Notez chaque item de 1 (pas du tout) à 5 (entièrement réalisé)', 'Adaptez les questions à votre contexte (connectivité, taille, secteur)', 'Score total sur 100 = (total points / 100) × 100', 'Comparez avec le benchmark Nexalie pour votre pays et secteur'] },
      { heading: 'Dim. 1 — Vision & Leadership', items: ['La direction a une vision claire du numérique pour l\'entreprise : /5', 'Un responsable du numérique est identifié : /5', 'Un budget numérique annuel est alloué : /5', 'Les projets numériques sont suivis par la direction : /5', 'L\'entreprise a un plan numérique à 2–3 ans : /5'] },
      { heading: 'Dim. 2 — Présence Digitale & Mobile', items: ['L\'entreprise a un site web accessible depuis un téléphone : /5', 'L\'entreprise est présente sur au moins 1 réseau social : /5', 'Les clients peuvent contacter l\'entreprise via WhatsApp : /5', 'L\'entreprise accepte le Mobile Money (Orange, MTN, Wave...) : /5', 'L\'entreprise a une fiche Google My Business à jour : /5'] },
      { heading: 'Dim. 3 — Outils de Gestion', items: ['La comptabilité est gérée avec un logiciel (pas uniquement papier) : /5', 'La liste des clients est centralisée (pas seulement dans les têtes ou sur papier) : /5', 'Les stocks sont suivis via un outil numérique : /5', 'Les communications internes utilisent au moins 1 outil digital (WhatsApp, email) : /5', 'Les factures sont émises en format numérique : /5'] },
      { heading: 'Dim. 4 — Compétences Équipes', items: ['Les collaborateurs utilisent un smartphone en contexte professionnel : /5', 'Au moins 1 collaborateur maîtrise les outils numériques de base : /5', 'Une formation numérique a eu lieu dans les 2 dernières années : /5', 'Les équipes acceptent les changements liés au numérique : /5', 'L\'entreprise peut recruter des profils numériques : /5'] },
      { heading: 'Récapitulatif', items: ['Dim. 1 — Vision : ___/25', 'Dim. 2 — Mobile : ___/25', 'Dim. 3 — Outils : ___/25', 'Dim. 4 — Compétences : ___/25', 'TOTAL : ___/100 → Bilan complet gratuit sur nexalie.co/audit'] },
    ],
  },

  'contrat-logiciel-ohada': {
    title: 'Contrat de Licence Logicielle — Droit OHADA',
    market: 'AF',
    sections: [
      { heading: 'Article 1 — Objet de la licence', items: ['L\'Éditeur concède à l\'Utilisateur un droit d\'usage non-exclusif et non-cessible du logiciel désigné en Annexe 1.', 'La licence est accordée pour la durée et le périmètre définis en Annexe 2.', 'Tout usage hors périmètre requiert une autorisation écrite préalable de l\'Éditeur.'] },
      { heading: 'Article 2 — Droits et obligations de l\'Utilisateur', items: ['L\'Utilisateur peut utiliser le logiciel pour ses besoins internes uniquement.', 'Il est interdit de copier, distribuer, louer ou vendre le logiciel à des tiers.', 'La rétro-ingénierie (reverse engineering) est expressément interdite.', 'L\'Utilisateur doit signaler tout bug ou anomalie à l\'Éditeur sous 48h.', 'L\'Utilisateur est responsable de la sécurité de ses accès.'] },
      { heading: 'Article 3 — Propriété intellectuelle (droit OHADA)', items: ['Le logiciel est protégé par le droit d\'auteur (AUA OHADA — Acte Uniforme sur les Droits d\'Auteur).', 'Tous les droits de propriété intellectuelle restent la propriété exclusive de l\'Éditeur.', 'La présente licence ne confère aucun droit de propriété à l\'Utilisateur.', 'Les marques, logos et éléments graphiques sont la propriété de l\'Éditeur.'] },
      { heading: 'Article 4 — Garanties et responsabilité', items: ['L\'Éditeur garantit la conformité du logiciel à sa documentation pendant 12 mois.', 'Aucune garantie d\'adéquation à un usage particulier n\'est fournie.', 'La responsabilité de l\'Éditeur est limitée au montant des redevances versées sur les 12 derniers mois.', 'L\'Éditeur n\'est pas responsable des dommages indirects ou pertes d\'exploitation.'] },
      { heading: 'Article 5 — Résolution des litiges', items: ['Droit applicable : Acte Uniforme OHADA + droit national du pays de l\'Utilisateur.', 'Tentative de règlement amiable obligatoire (30 jours).', 'En cas d\'échec : arbitrage auprès de la CCJA (Cour Commune de Justice et d\'Arbitrage OHADA).', 'Siège de l\'arbitrage : Abidjan, Côte d\'Ivoire (siège de la CCJA).'] },
    ],
  },

  'kpi-af': {
    title: 'KPI Transformation Digitale — Adapté Afrique francophone',
    market: 'AF',
    sections: [
      { heading: 'Présence & Visibilité', items: ['Nombre de visites mensuelles site web (objectif : +10%/mois)', 'Abonnés WhatsApp Business actifs', 'Abonnés Facebook/Instagram (taux d\'engagement > 3%)', 'Avis Google My Business (objectif : > 4,2 étoiles)', 'Mentions de la marque sur les réseaux sociaux'] },
      { heading: 'Paiement Mobile Money', items: ['Volume transactions Mobile Money / mois (en FCFA)', 'Part du CA encaissé via Mobile Money (%)', 'Nombre d\'opérateurs acceptés (objectif : ≥ 3)', 'Taux d\'échec des transactions (objectif : < 2%)', 'Délai moyen de réconciliation comptable (objectif : < 48h)'] },
      { heading: 'Efficacité Opérationnelle', items: ['Heures/semaine économisées par digitalisation des processus', 'Nombre de processus encore 100% papier (objectif : 0)', 'Taux d\'adoption des outils numériques par les équipes (%)', 'Délai moyen de traitement commande (objectif : -30%)', 'Nombre d\'outils numériques en production (CRM, compta, stock)'] },
      { heading: 'Satisfaction Client', items: ['Taux de réponse WhatsApp < 1h (%)', 'Note Google My Business', 'Taux de réclamation traités via canal digital (%)', 'NPS (Net Promoter Score) — si mesuré', 'Taux de fidélisation client YoY (%)'] },
      { heading: 'Indicateurs Contexte Africain', items: ['Impact coupures réseau sur CA (estimation mensuelle en FCFA)', 'Part des commandes mobile vs. ordinateur (%)', 'Taux d\'erreurs liées aux ressaisies manuelles', 'Disponibilité backup hors-ligne (oui/non)', 'Formation digital dispensée en heures/employé/an'] },
    ],
  },

  'benchmark-ci': {
    title: 'Benchmark Digital PME — Côte d\'Ivoire 2026',
    market: 'AF',
    sections: [
      { heading: 'Commerce & Distribution', items: ['Score moyen : 35/100', 'Top 25% : 52/100', 'Top 10% : 68/100', 'Forces : Mobile Money, présence WhatsApp Business', 'Faiblesses : site web, CRM, stock digital'] },
      { heading: 'Finance & Assurance', items: ['Score moyen : 48/100', 'Top 25% : 65/100', 'Top 10% : 78/100', 'Forces : Mobile Money intégré, DM client', 'Faiblesses : IA crédit scoring, données agrégées'] },
      { heading: 'Télécommunications', items: ['Score moyen : 48/100', 'Top 25% : 67/100', 'Top 10% : 80/100', 'Forces : canal digital mature, self-care en ligne', 'Faiblesses : personnalisation IA, rétention digitale'] },
      { heading: 'Administration & Services', items: ['Score moyen : 25/100', 'Top 25% : 40/100', 'Top 10% : 58/100', 'Forces : démarches en ligne émergentes', 'Faiblesses : papier dominant, inter-opérabilité nulle'] },
      { heading: 'Tendances Côte d\'Ivoire 2026', items: ['Mobile Money : 16M comptes actifs, 70% population adulte', 'E-commerce : marché estimé 450M USD, +22% vs 2025', 'Startups tech Abidjan : +340 enregistrées en 2025', 'Connectivité : 62% couverture 4G nationale', 'IA : adoption balbutiante (5% des PME ivoiriennes utilisent des outils IA)'] },
    ],
  },
};

function generatePDFContent(resource, resourceId) {
  const now = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const accent = resource.market === 'AF' ? '#E88C32' : '#4EC9B0';

  // On génère un PDF textuel structuré (retourné comme text/plain avec formatage)
  // Le vrai PDF sera généré avec @react-pdf côté serveur au besoin
  let content = `NEXALIE — ${resource.market === 'AF' ? 'AFRIQUE FRANCOPHONE' : 'FRANCE'}\n`;
  content += '═'.repeat(60) + '\n\n';
  content += `${resource.title.toUpperCase()}\n`;
  content += '─'.repeat(60) + '\n';
  content += `Généré le ${now} · nexalie.co\n\n`;

  resource.sections.forEach(section => {
    content += `\n▶ ${section.heading.toUpperCase()}\n`;
    content += '─'.repeat(40) + '\n';
    section.items.forEach((item, i) => {
      content += `  ${i + 1}. ${item}\n`;
    });
  });

  content += '\n\n' + '═'.repeat(60) + '\n';
  content += 'Ce document est fourni par Nexalie — nexalie.co\n';
  content += 'Contact : relia.ebiya@gmail.com\n';
  content += '© Nexalie 2026 — Document confidentiel\n';

  return content;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const format = searchParams.get('format') || 'txt';

  if (!id) {
    return Response.json({ error: 'Paramètre id requis' }, { status: 400 });
  }

  const resource = RESOURCE_CONTENT[id];
  if (!resource) {
    return Response.json({ error: `Ressource "${id}" introuvable` }, { status: 404 });
  }

  const content = generatePDFContent(resource, id);
  const filename = `nexali-${id}.txt`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, max-age=3600',
    },
  });
}
