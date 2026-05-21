// @react-pdf/renderer — Rapport Nexalie 6 pages
import React from 'react';
import { Document, Page, Text, View, StyleSheet, Link } from '@react-pdf/renderer';

const NAVY  = '#0A1628';
const TEAL  = '#4EC9B0';
const TERRA = '#E88C32';
const GOLD  = '#C9A84C';
const GRAY  = '#6B7A94';
const LIGHT = '#F8FAFC';
const WHITE = '#FFFFFF';

const s = StyleSheet.create({
  page:        { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 56 },
  coverPage:   { fontFamily: 'Helvetica', backgroundColor: NAVY },
  // Header bande navy
  header:      { backgroundColor: NAVY, padding: '28 40', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo:        { color: WHITE, fontSize: 20, fontFamily: 'Helvetica-Bold' },
  logoSub:     { color: TEAL, fontSize: 7, letterSpacing: 2, marginTop: 2 },
  headerRight: { color: 'rgba(255,255,255,0.45)', fontSize: 9 },
  // Footer fixe
  footer:      { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: NAVY, padding: '10 40', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerL:     { color: 'rgba(255,255,255,0.4)', fontSize: 8 },
  footerR:     { color: TEAL, fontSize: 8 },
  // Section générique
  section:     { padding: '20 40' },
  sectionTitle:{ fontSize: 13, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 14, paddingBottom: 7, borderBottom: '1 solid #E5E7EB' },
  divider:     { height: 1, backgroundColor: '#E5E7EB', margin: '0 40 0 40' },
  // Texte courant
  body:        { fontSize: 10, color: GRAY, lineHeight: 1.7, marginBottom: 8 },
  bold:        { fontFamily: 'Helvetica-Bold', color: NAVY },
  // Grille info
  infoRow:     { flexDirection: 'row', gap: 8, marginBottom: 7, alignItems: 'center' },
  infoLabel:   { fontSize: 9, color: GRAY, width: 100 },
  infoValue:   { fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY, flex: 1 },
  // Score boxes
  scoreRow:    { flexDirection: 'row', gap: 14, marginBottom: 16 },
  scoreBox:    { backgroundColor: WHITE, border: '1.5 solid #E5E7EB', borderRadius: 10, padding: '14 18', flex: 1, alignItems: 'center' },
  scoreNum:    { fontSize: 44, fontFamily: 'Helvetica-Bold', lineHeight: 1 },
  scoreSub:    { fontSize: 9, color: GRAY, marginTop: 4 },
  niveauBox:   { backgroundColor: NAVY, borderRadius: 10, padding: '14 18', flex: 2, alignItems: 'center', justifyContent: 'center' },
  niveauTxt:   { fontSize: 18, fontFamily: 'Helvetica-Bold', color: WHITE, textTransform: 'capitalize' },
  niveauSub:   { fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 3 },
  // Barre progression
  barBg:       { backgroundColor: '#E5E7EB', borderRadius: 4, height: 7, marginTop: 12 },
  barFill:     { borderRadius: 4, height: 7 },
  barLabel:    { fontSize: 8, color: GRAY, marginBottom: 3 },
  // Recommandations
  recoCard:    { backgroundColor: LIGHT, borderRadius: 8, padding: '12 16', marginBottom: 9, flexDirection: 'row', gap: 12 },
  recoNum:     { fontSize: 17, fontFamily: 'Helvetica-Bold', minWidth: 26 },
  recoTitle:   { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 },
  recoDesc:    { fontSize: 9, color: GRAY, lineHeight: 1.6 },
  recoPrio:    { fontSize: 8, color: WHITE, borderRadius: 10, padding: '2 7', marginTop: 5, alignSelf: 'flex-start' },
  // Dimension
  dimRow:      { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  dimLabel:    { fontSize: 10, color: NAVY, width: 130 },
  dimBarBg:    { backgroundColor: '#E5E7EB', borderRadius: 3, height: 9, flex: 1 },
  dimBarFill:  { borderRadius: 3, height: 9 },
  dimScore:    { fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY, width: 32, textAlign: 'right' },
  // Points forts/faibles
  pointRow:    { flexDirection: 'row', gap: 8, marginBottom: 7, alignItems: 'flex-start' },
  pointBullet: { fontSize: 12, marginTop: -1 },
  pointText:   { fontSize: 10, color: NAVY, flex: 1, lineHeight: 1.5 },
  // Roadmap actions
  actionCard:  { backgroundColor: LIGHT, borderRadius: 8, padding: '12 16', marginBottom: 9 },
  actionTop:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  actionTitle: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, flex: 1 },
  actionTag:   { fontSize: 8, borderRadius: 6, padding: '2 8', color: WHITE },
  actionBody:  { fontSize: 9, color: GRAY, lineHeight: 1.6 },
  actionMeta:  { flexDirection: 'row', gap: 16, marginTop: 6 },
  actionMini:  { fontSize: 8, color: GRAY },
  // CTA box
  ctaBox:      { margin: '20 40', borderRadius: 12, padding: '20 24', alignItems: 'center' },
  ctaTitle:    { fontSize: 16, fontFamily: 'Helvetica-Bold', color: WHITE, marginBottom: 6, textAlign: 'center' },
  ctaBody:     { fontSize: 10, color: 'rgba(255,255,255,0.7)', textAlign: 'center', marginBottom: 14 },
  ctaUrl:      { fontSize: 11, fontFamily: 'Helvetica-Bold', color: WHITE, borderRadius: 8, padding: '10 24', border: '1.5 solid rgba(255,255,255,0.6)', textAlign: 'center' },
  // Badge
  badge:       { borderRadius: 4, padding: '3 10', alignSelf: 'flex-start' },
  badgeText:   { fontSize: 8, fontFamily: 'Helvetica-Bold' },
  // Gauge SVG approximation (rectangles empilés)
  gaugeRow:    { flexDirection: 'row', gap: 4, marginTop: 8, marginBottom: 4 },
  gaugeBlock:  { height: 14, borderRadius: 2, flex: 1 },
  // Benchmark phrase
  benchBox:    { backgroundColor: '#EFF6FF', borderLeft: '3 solid #4EC9B0', padding: '12 16', borderRadius: '0 8 8 0', marginTop: 14, marginBottom: 10 },
  benchTxt:    { fontSize: 10, color: NAVY, lineHeight: 1.6 },
});

const NIVEAUX = {
  debutant:      'Débutant Digital',
  intermediaire: 'Intermédiaire',
  avance:        'Avancé',
  expert:        'Expert Digital',
};

function Header({ accent, generatedAt }) {
  return (
    <View style={s.header}>
      <View>
        <Text style={s.logo}>Nexalie</Text>
        <Text style={[s.logoSub, { color: accent }]}>INTELLIGENCE ARTIFICIELLE · PME</Text>
      </View>
      <Text style={s.headerRight}>{generatedAt}</Text>
    </View>
  );
}

function Footer({ page, total, accent }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerL}>Confidentiel · Nexalie · nexali.ai — Page {page}/{total}</Text>
      <Text style={[s.footerR, { color: accent }]}>nexali.ai</Text>
    </View>
  );
}

// ── PAGE 1 : Couverture ────────────────────────────────────────────────
function CoverPage({ audit, profile, userEmail, generatedAt, accent, auditTitle }) {
  const score = audit.score || 0;
  const niveau = NIVEAUX[audit.niveau] || audit.niveau || 'N/A';
  const niveauColor = score >= 75 ? '#10B981' : score >= 50 ? accent : score >= 25 ? '#F59E0B' : '#EF4444';

  return (
    <Page size="A4" style={s.coverPage}>
      {/* Zone navy supérieure */}
      <View style={{ flex: 1, padding: '60 50 40', justifyContent: 'space-between' }}>
        {/* Logo */}
        <View>
          <Text style={{ color: WHITE, fontSize: 28, fontFamily: 'Helvetica-Bold', letterSpacing: -0.5 }}>Nexalie</Text>
          <Text style={{ color: accent, fontSize: 9, letterSpacing: 3, marginTop: 4 }}>INTELLIGENCE ARTIFICIELLE · PME</Text>
        </View>

        {/* Titre rapport */}
        <View style={{ marginTop: 60 }}>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 12 }}>
            Rapport Officiel
          </Text>
          <Text style={{ color: WHITE, fontSize: 30, fontFamily: 'Helvetica-Bold', lineHeight: 1.2, marginBottom: 10 }}>
            {auditTitle}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 13, marginBottom: 40 }}>
            {profile?.organisation || userEmail}
          </Text>

          {/* Score central */}
          <View style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: 16, padding: '28 36', flexDirection: 'row', alignItems: 'center', gap: 28, border: '1 solid rgba(255,255,255,0.12)' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 72, fontFamily: 'Helvetica-Bold', color: accent, lineHeight: 1 }}>{score}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 11, marginTop: 4 }}>Score / 100</Text>
            </View>
            <View style={{ flex: 1, borderLeft: '1 solid rgba(255,255,255,0.1)', paddingLeft: 28 }}>
              <Text style={{ color: WHITE, fontSize: 18, fontFamily: 'Helvetica-Bold', marginBottom: 6 }}>{niveau}</Text>
              <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, lineHeight: 1.6 }}>
                Niveau de maturité digitale évalué sur 6 dimensions clés.
              </Text>
              {/* Mini gauge */}
              <View style={[s.gaugeRow, { marginTop: 14 }]}>
                {[25, 50, 75, 100].map((threshold, i) => (
                  <View key={i} style={[s.gaugeBlock, { backgroundColor: score >= threshold ? accent : 'rgba(255,255,255,0.12)' }]} />
                ))}
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 2 }}>
                {['Débutant', 'Intermédiaire', 'Avancé', 'Expert'].map((l, i) => (
                  <Text key={i} style={{ fontSize: 7, color: 'rgba(255,255,255,0.3)' }}>{l}</Text>
                ))}
              </View>
            </View>
          </View>
        </View>

        {/* Pied de couverture */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 40 }}>
          <View>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>Contact : {userEmail}</Text>
            <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9, marginTop: 3 }}>
              Marché : {audit.mode === 'af' ? 'Afrique francophone' : 'France'}
            </Text>
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.35)', fontSize: 9 }}>Généré le {generatedAt}</Text>
        </View>
      </View>
    </Page>
  );
}

// ── PAGE 2 : Synthèse exécutive ────────────────────────────────────────
function SummaryPage({ audit, profile, accent, benchmark }) {
  const score = audit.score || 0;
  const recs = audit.recommandations || [];
  const isAf = audit.mode === 'af';

  const strengths = recs.filter(r => typeof r === 'object' && (r.type === 'strength' || r.priorite === 'haute')).slice(0, 3);
  const weaknesses = recs.filter(r => typeof r === 'object' && (r.type === 'weakness' || r.priorite === 'critique')).slice(0, 3);

  const benchScore = benchmark?.score_moyen || (isAf ? 28 : 52);
  const delta = score - benchScore;
  const benchPhrase = delta >= 0
    ? `Vous êtes ${delta} points au-dessus de la moyenne sectorielle (${benchScore}/100).`
    : `Vous êtes ${Math.abs(delta)} points en dessous de la moyenne sectorielle (${benchScore}/100). Un plan d'action ciblé peut combler cet écart.`;

  return (
    <Page size="A4" style={s.page}>
      <Header accent={accent} generatedAt="" />

      <View style={[s.section, { paddingTop: 24 }]}>
        <Text style={s.sectionTitle}>Synthèse Exécutive</Text>

        {/* Gauge visuelle simplifiée */}
        <View style={{ marginBottom: 16 }}>
          <Text style={[s.barLabel, { marginBottom: 6 }]}>Score global de maturité digitale</Text>
          <View style={s.barBg}>
            <View style={[s.barFill, { width: `${score}%`, backgroundColor: accent }]} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
            <Text style={{ fontSize: 8, color: GRAY }}>0 — Débutant</Text>
            <Text style={{ fontSize: 8, color: accent, fontFamily: 'Helvetica-Bold' }}>{score}/100</Text>
            <Text style={{ fontSize: 8, color: GRAY }}>100 — Expert</Text>
          </View>
        </View>

        {/* Phrase benchmark */}
        <View style={[s.benchBox, { borderColor: accent }]}>
          <Text style={s.benchTxt}>{benchPhrase}</Text>
          {benchmark?.secteur && (
            <Text style={{ fontSize: 8, color: GRAY, marginTop: 4 }}>
              Secteur : {benchmark.secteur} · Marché : {benchmark.market?.toUpperCase()}
            </Text>
          )}
        </View>

        {/* Points forts */}
        {strengths.length > 0 && (
          <View style={{ marginTop: 12, marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 8 }}>Points forts identifiés</Text>
            {strengths.map((r, i) => {
              const title = typeof r === 'string' ? r : (r.titre || r.title || `Point fort ${i + 1}`);
              return (
                <View key={i} style={s.pointRow}>
                  <Text style={[s.pointBullet, { color: '#10B981' }]}>✓</Text>
                  <Text style={s.pointText}>{title}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Points faibles */}
        {weaknesses.length > 0 && (
          <View style={{ marginTop: 4 }}>
            <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 8 }}>Axes d'amélioration prioritaires</Text>
            {weaknesses.map((r, i) => {
              const title = typeof r === 'string' ? r : (r.titre || r.title || `Axe ${i + 1}`);
              return (
                <View key={i} style={s.pointRow}>
                  <Text style={[s.pointBullet, { color: '#EF4444' }]}>!</Text>
                  <Text style={s.pointText}>{title}</Text>
                </View>
              );
            })}
          </View>
        )}

        {/* Infos audit */}
        <View style={{ marginTop: 16 }}>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Organisation</Text>
            <Text style={s.infoValue}>{profile?.organisation || 'Non renseignée'}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Secteur</Text>
            <Text style={s.infoValue}>{audit.secteur || profile?.secteur || 'Non renseigné'}</Text>
          </View>
          <View style={s.infoRow}>
            <Text style={s.infoLabel}>Date de l'audit</Text>
            <Text style={s.infoValue}>
              {new Date(audit.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </Text>
          </View>
        </View>
      </View>

      <Footer page={2} total={6} accent={accent} />
    </Page>
  );
}

// ── PAGES 3–4 : Analyse par dimension ─────────────────────────────────
const DIMENSIONS_FR = [
  { key: 'strategie',   label: 'Stratégie & Vision',       desc: 'Ambition digitale, gouvernance, feuille de route' },
  { key: 'outils',      label: 'Outils & Systèmes',        desc: 'ERP, CRM, cloud, infrastructure technique' },
  { key: 'equipes',     label: 'Compétences & Équipes',    desc: 'Formation, recrutement, culture digitale' },
  { key: 'data',        label: 'Data & Analytics',         desc: 'Collecte, analyse, pilotage par la donnée' },
  { key: 'client',      label: 'Expérience Client',        desc: 'CX digitale, présence web, e-commerce' },
  { key: 'process',     label: 'Processus & Automatisation', desc: 'Automatisation, intégration, efficacité ops' },
];

const DIMENSIONS_AF = [
  { key: 'strategie',   label: 'Vision & Leadership',      desc: 'Ambition numérique, gouvernance, feuille de route' },
  { key: 'mobile',      label: 'Présence Mobile',          desc: 'Mobile Money, application mobile, accessibilité' },
  { key: 'equipes',     label: 'Capital Humain',           desc: 'Compétences numériques, formation, adoption' },
  { key: 'data',        label: 'Données & Décision',       desc: 'Collecte de données, suivi des indicateurs' },
  { key: 'client',      label: 'Relation Client Digitale', desc: 'WhatsApp, réseaux sociaux, e-commerce' },
  { key: 'process',     label: 'Efficacité Opérationnelle', desc: 'Processus digitaux, automatisation locale' },
];

function getDimScores(reponses, score) {
  if (!reponses || typeof reponses !== 'object') {
    return DIMENSIONS_FR.map((_, i) => Math.max(10, score - 10 + (i % 3) * 8));
  }
  const keys = Object.keys(reponses);
  if (keys.length === 0) return DIMENSIONS_FR.map(() => score);
  const vals = keys.map(k => typeof reponses[k] === 'number' ? reponses[k] : (reponses[k]?.score || 0));
  const maxVal = Math.max(...vals, 1);
  return vals.slice(0, 6).map(v => Math.round((v / maxVal) * 100));
}

function DimensionsPage({ audit, accent, pageNum }) {
  const isAf = audit.mode === 'af';
  const dims = isAf ? DIMENSIONS_AF : DIMENSIONS_FR;
  const score = audit.score || 0;
  const dimScores = getDimScores(audit.reponses, score);

  const half = pageNum === 3 ? dims.slice(0, 3) : dims.slice(3, 6);
  const halfScores = pageNum === 3 ? dimScores.slice(0, 3) : dimScores.slice(3, 6);

  return (
    <Page size="A4" style={s.page}>
      <Header accent={accent} generatedAt="" />

      <View style={s.section}>
        <Text style={s.sectionTitle}>
          Analyse par Dimension {pageNum === 3 ? '(1/2)' : '(2/2)'}
        </Text>
        <Text style={[s.body, { marginBottom: 16 }]}>
          Chaque dimension est évaluée sur 100 points. Ce diagnostic vous permet d'identifier précisément où concentrer vos efforts.
        </Text>

        {half.map((dim, i) => {
          const ds = halfScores[i] ?? score;
          const dimColor = ds >= 70 ? '#10B981' : ds >= 40 ? accent : '#EF4444';
          return (
            <View key={dim.key} style={{ marginBottom: 20, backgroundColor: LIGHT, borderRadius: 10, padding: '16 18' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 2 }}>{dim.label}</Text>
                  <Text style={{ fontSize: 9, color: GRAY }}>{dim.desc}</Text>
                </View>
                <View style={{ backgroundColor: dimColor, borderRadius: 8, padding: '4 12', marginLeft: 12 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Helvetica-Bold', color: WHITE }}>{ds}/100</Text>
                </View>
              </View>
              <View style={s.barBg}>
                <View style={[s.barFill, { width: `${ds}%`, backgroundColor: dimColor }]} />
              </View>
              <Text style={{ fontSize: 8, color: GRAY, marginTop: 5 }}>
                {ds >= 70 ? 'Dimension mature — continuez à optimiser'
                  : ds >= 40 ? 'En développement — des actions ciblées peuvent accélérer votre progression'
                  : 'Point d\'attention majeur — priorité recommandée dans votre plan d\'action'}
              </Text>
            </View>
          );
        })}
      </View>

      <Footer page={pageNum} total={6} accent={accent} />
    </Page>
  );
}

// ── PAGE 5 : Roadmap 90 jours ──────────────────────────────────────────
function RoadmapPage({ audit, accent }) {
  const recs = audit.recommandations || [];
  const isAf = audit.mode === 'af';
  const top5 = recs.slice(0, 5);

  const DELAYS = ['Semaines 1–2', 'Semaines 3–4', 'Mois 2', 'Mois 2–3', 'Mois 3'];
  const BUDGETS_FR = ['< 2 000 €', '2 000–5 000 €', '5 000–15 000 €', '2 000–8 000 €', '1 000–4 000 €'];
  const BUDGETS_AF = ['< 500 000 FCFA', '500k–2M FCFA', '2–8M FCFA', '500k–3M FCFA', '200k–1M FCFA'];
  const budgets = isAf ? BUDGETS_AF : BUDGETS_FR;

  const TAG_COLORS = ['#4EC9B0', '#6366F1', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <Page size="A4" style={s.page}>
      <Header accent={accent} generatedAt="" />

      <View style={s.section}>
        <Text style={s.sectionTitle}>Plan d'Action — 90 Premiers Jours</Text>
        <Text style={[s.body, { marginBottom: 14 }]}>
          Ces 5 actions constituent votre feuille de route prioritaire. Elles sont ordonnées par impact et faisabilité.
        </Text>

        {top5.length === 0 ? (
          <Text style={s.body}>Aucune recommandation générée pour cet audit.</Text>
        ) : (
          top5.map((rec, i) => {
            const title = typeof rec === 'string' ? rec : (rec.titre || rec.title || `Action ${i + 1}`);
            const desc  = typeof rec === 'object' ? (rec.description || rec.desc || '') : '';
            const kpi   = typeof rec === 'object' ? (rec.kpi || '') : '';
            const tagColor = TAG_COLORS[i % TAG_COLORS.length];

            return (
              <View key={i} style={s.actionCard}>
                <View style={s.actionTop}>
                  <Text style={s.actionTitle}>{i + 1}. {title}</Text>
                  <View style={[s.actionTag, { backgroundColor: tagColor }]}>
                    <Text style={{ fontSize: 8, color: WHITE }}>{DELAYS[i]}</Text>
                  </View>
                </View>
                {desc ? <Text style={s.actionBody}>{desc}</Text> : null}
                <View style={s.actionMeta}>
                  <Text style={s.actionMini}>💰 Budget estimé : {budgets[i]}</Text>
                  {kpi ? <Text style={s.actionMini}>📊 KPI : {kpi}</Text> : null}
                </View>
              </View>
            );
          })
        )}
      </View>

      <Footer page={5} total={6} accent={accent} />
    </Page>
  );
}

// ── PAGE 6 : Prochaines étapes CTA ────────────────────────────────────
function NextStepsPage({ audit, profile, accent }) {
  const isAf = audit.mode === 'af';
  const isPro = profile?.plan === 'pro' || profile?.plan === 'institutions';
  const proPrice = isAf ? '85 000 FCFA/mois' : '129€/mois';
  const paymentNote = isAf ? 'Mobile Money · Orange Money · MTN MoMo · Wave' : 'Carte bancaire · Virement SEPA';

  return (
    <Page size="A4" style={s.page}>
      <Header accent={accent} generatedAt="" />

      <View style={s.section}>
        <Text style={s.sectionTitle}>Prochaines Étapes</Text>
        <Text style={[s.body, { marginBottom: 16 }]}>
          Ce rapport est votre point de départ. Voici comment transformer ces recommandations en résultats concrets.
        </Text>

        {/* Étapes */}
        {[
          { num: '01', title: 'Partagez ce rapport avec vos équipes', desc: 'La transformation digitale est un projet collectif. Présentez les résultats en réunion et identifiez les champions internes pour chaque action.' },
          { num: '02', title: isAf ? "Créez votre Plan d'Action Digital" : 'Créez votre Roadmap IA', desc: `Le ${isAf ? "Plan d'Action Digital" : 'Roadmap Builder'} Nexalie génère une feuille de route complète sur 90 jours, 6 mois et 12 mois à partir de votre score.` },
          { num: '03', title: 'Suivez votre progression', desc: 'Refaites un audit dans 3 mois pour mesurer vos progrès. La plateforme conserve l\'historique et génère automatiquement un graphique d\'évolution.' },
        ].map((step) => (
          <View key={step.num} style={{ flexDirection: 'row', gap: 16, marginBottom: 18 }}>
            <Text style={{ fontSize: 28, fontFamily: 'Helvetica-Bold', color: accent, minWidth: 36, lineHeight: 1 }}>{step.num}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Helvetica-Bold', color: NAVY, marginBottom: 4 }}>{step.title}</Text>
              <Text style={s.body}>{step.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={s.divider} />

      {/* CTA Pro */}
      {!isPro && (
        <View style={[s.ctaBox, { backgroundColor: NAVY }]}>
          <Text style={s.ctaTitle}>Passez au plan Pro</Text>
          <Text style={s.ctaBody}>
            Roadmap IA · Suivi de progression · Certification Digital Ready{'\n'}
            Nexalie OS illimité · Toutes les ressources{'\n\n'}
            {proPrice} · {paymentNote}
          </Text>
          <Text style={s.ctaUrl}>nexali.ai/pricing</Text>
        </View>
      )}

      {/* Contact */}
      <View style={{ margin: '16 40 0', flexDirection: 'row', gap: 32 }}>
        <View>
          <Text style={{ fontSize: 9, color: GRAY, marginBottom: 3 }}>Plateforme</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY }}>nexali.ai</Text>
        </View>
        <View>
          <Text style={{ fontSize: 9, color: GRAY, marginBottom: 3 }}>Contact fondatrice</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY }}>relia.ebiya@gmail.com</Text>
        </View>
        <View>
          <Text style={{ fontSize: 9, color: GRAY, marginBottom: 3 }}>Fondée par</Text>
          <Text style={{ fontSize: 10, fontFamily: 'Helvetica-Bold', color: NAVY }}>Rélia Ebiya</Text>
        </View>
      </View>

      <Footer page={6} total={6} accent={accent} />
    </Page>
  );
}

// ── Recommandations Page (fallback si peu de recs) ─────────────────────
function RecommendationsPage({ audit, accent }) {
  const recs = audit.recommandations || [];
  return (
    <Page size="A4" style={s.page}>
      <Header accent={accent} generatedAt="" />
      <View style={s.section}>
        <Text style={s.sectionTitle}>{recs.length} Recommandations Personnalisées</Text>
        {recs.length === 0 ? (
          <Text style={s.body}>Aucune recommandation disponible.</Text>
        ) : (
          recs.map((rec, i) => {
            const title    = typeof rec === 'string' ? rec : (rec.titre || rec.title || `Recommandation ${i + 1}`);
            const desc     = typeof rec === 'object' ? (rec.description || rec.desc || '') : '';
            const priority = typeof rec === 'object' ? (rec.priorite || rec.priority || '') : '';
            return (
              <View key={i} style={s.recoCard}>
                <Text style={[s.recoNum, { color: accent }]}>{String(i + 1).padStart(2, '0')}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.recoTitle}>{title}</Text>
                  {desc ? <Text style={s.recoDesc}>{desc}</Text> : null}
                  {priority ? (
                    <View style={[s.recoPrio, { backgroundColor: accent }]}>
                      <Text style={{ fontSize: 8, color: WHITE }}>{priority}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })
        )}
      </View>
      <Footer page={4} total={6} accent={accent} />
    </Page>
  );
}

// ── Export principal ───────────────────────────────────────────────────
export function AuditPDFDocument({ audit, profile, userEmail, generatedAt, benchmark }) {
  const isAf = audit.mode === 'af';
  const accent = isAf ? TERRA : TEAL;
  const auditTitle = isAf ? 'Bilan Numérique' : 'Audit de Maturité Digitale';
  const recs = audit.recommandations || [];

  return (
    <Document
      title={`Rapport ${auditTitle} — Nexalie`}
      author="Nexalie"
      creator="nexali.ai"
      subject={`Score : ${audit.score}/100 — ${NIVEAUX[audit.niveau] || audit.niveau}`}
    >
      {/* Page 1 : Couverture */}
      <CoverPage audit={audit} profile={profile} userEmail={userEmail} generatedAt={generatedAt} accent={accent} auditTitle={auditTitle} />

      {/* Page 2 : Synthèse exécutive */}
      <SummaryPage audit={audit} profile={profile} accent={accent} benchmark={benchmark} />

      {/* Pages 3–4 : Analyse par dimension */}
      <DimensionsPage audit={audit} accent={accent} pageNum={3} />
      <DimensionsPage audit={audit} accent={accent} pageNum={4} />

      {/* Page 5 : Roadmap 90 jours */}
      <RoadmapPage audit={audit} accent={accent} />

      {/* Page 6 : Prochaines étapes */}
      <NextStepsPage audit={audit} profile={profile} accent={accent} />
    </Document>
  );
}
