import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const BG     = '#0f2e24';
const ACCENT = '#c9a24b';
const CREAM  = '#f5f0e8';
const GRAY   = '#4b5563';
const WHITE  = '#ffffff';

const s = StyleSheet.create({
  page: { fontFamily: 'Helvetica', backgroundColor: WHITE, paddingBottom: 56 },

  header: { backgroundColor: BG, padding: '20 40', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  logo:    { color: WHITE, fontSize: 18, fontFamily: 'Helvetica-Bold', letterSpacing: -0.3 },
  logoSub: { color: ACCENT, fontSize: 7, letterSpacing: 2.5, marginTop: 2 },
  headerDate: { color: 'rgba(245,240,232,0.40)', fontSize: 8 },

  footer:     { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: BG, padding: '9 40', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  footerText: { color: 'rgba(245,240,232,0.45)', fontSize: 7.5 },
  footerBeta: { color: ACCENT, fontSize: 7.5, fontFamily: 'Helvetica-Bold' },

  scoreRow:  { margin: '20 40 0', flexDirection: 'row', gap: 14 },
  scoreBox:  { backgroundColor: BG, borderRadius: 10, padding: '18 22', alignItems: 'center', justifyContent: 'center', flex: 1 },
  scoreNum:  { fontSize: 52, fontFamily: 'Helvetica-Bold', color: ACCENT, lineHeight: 1 },
  scoreSub:  { fontSize: 8, color: 'rgba(245,240,232,0.55)', marginTop: 4 },
  levelBox:  { flex: 2.4, backgroundColor: CREAM, borderRadius: 10, padding: '16 20', justifyContent: 'center' },
  levelName: { fontSize: 11, fontFamily: 'Helvetica-Bold', color: BG, marginBottom: 5 },
  levelDesc: { fontSize: 9, color: GRAY, lineHeight: 1.6 },
  barBg:     { backgroundColor: '#e0d8cc', borderRadius: 3, height: 5, marginTop: 10 },
  barFill:   { borderRadius: 3, height: 5, backgroundColor: ACCENT },

  section:      { padding: '0 40', marginTop: 18 },
  sectionLabel: { fontSize: 7.5, letterSpacing: 2.5, color: ACCENT, fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 8 },

  mondayCard:   { backgroundColor: BG, borderRadius: 10, padding: '16 20' },
  mondayTitle:  { fontSize: 13, fontFamily: 'Helvetica-Bold', color: WHITE, lineHeight: 1.3, marginBottom: 6 },
  mondayTool:   { fontSize: 9, color: 'rgba(245,240,232,0.55)', marginBottom: 10 },
  mondayBadges: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  badge:        { backgroundColor: 'rgba(201,162,75,0.20)', borderRadius: 4, padding: '3 8' },
  badgeText:    { fontSize: 8, color: ACCENT },

  prioCard:  { backgroundColor: CREAM, borderRadius: 9, padding: '11 15', marginBottom: 7, flexDirection: 'row', gap: 11, alignItems: 'flex-start' },
  prioNum:   { fontSize: 15, fontFamily: 'Helvetica-Bold', minWidth: 22 },
  prioTitle: { fontSize: 10, fontFamily: 'Helvetica-Bold', color: BG, lineHeight: 1.3, marginBottom: 2 },
  prioMeta:  { fontSize: 8, color: GRAY },

  secCard:   { backgroundColor: '#fafafa', borderRadius: 7, padding: '9 13', marginBottom: 5, flexDirection: 'row', gap: 9, alignItems: 'flex-start', border: '1 solid #e5e7eb' },
  secTitle:  { fontSize: 9, fontFamily: 'Helvetica-Bold', color: BG, marginBottom: 1 },
  secMeta:   { fontSize: 8, color: GRAY },
});

const NIVEAUX = {
  debutant:    'Débutant digital',
  progression: 'En progression',
  avance:      'Avancé',
};

const NIVEAU_DESC = {
  debutant:    'Vous démarrez votre parcours numérique. Quelques actions concrètes peuvent changer la donne rapidement.',
  progression: 'Vous avez de bonnes bases. Ce plan va accélérer votre progression.',
  avance:      'Vous êtes en avance sur la majorité des PME de votre secteur. Continuez à optimiser.',
};

export function BetaPDFDocument({ score, recoCards, mode }) {
  const date = new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  const niveauKey = score < 30 ? 'debutant' : score < 60 ? 'progression' : 'avance';
  const cards = Array.isArray(recoCards) ? recoCards : [];
  const top3 = cards.slice(0, 3);
  const secondaires = cards.slice(3);

  return (
    <Document
      title="Rapport Nexalie · Boussole numerique"
      author="Nexalie"
      subject={`Score : ${score}/100`}
    >
      <Page size="A4" style={s.page}>

        {/* Header */}
        <View style={s.header}>
          <View>
            <Text style={s.logo}>Nexalie</Text>
            <Text style={s.logoSub}>BOUSSOLE NUMERIQUE</Text>
          </View>
          <Text style={s.headerDate}>{date}</Text>
        </View>

        {/* Score + niveau */}
        <View style={s.scoreRow}>
          <View style={s.scoreBox}>
            <Text style={s.scoreNum}>{score}</Text>
            <Text style={s.scoreSub}>Score / 100</Text>
          </View>
          <View style={s.levelBox}>
            <Text style={s.levelName}>{NIVEAUX[niveauKey]}</Text>
            <Text style={s.levelDesc}>{NIVEAU_DESC[niveauKey]}</Text>
            <View style={s.barBg}>
              <View style={[s.barFill, { width: `${score}%` }]} />
            </View>
          </View>
        </View>

        {/* Action de lundi */}
        {cards[0] && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Votre action de lundi</Text>
            <View style={s.mondayCard}>
              <Text style={s.mondayTitle}>{cards[0].titre || cards[0].action || ''}</Text>
              {cards[0].outil ? (
                <Text style={s.mondayTool}>Outil : {cards[0].outil}</Text>
              ) : null}
              <View style={s.mondayBadges}>
                {cards[0].tempsEstimé ? <View style={s.badge}><Text style={s.badgeText}>{cards[0].tempsEstimé}</Text></View> : null}
                {cards[0].difficulté  ? <View style={s.badge}><Text style={s.badgeText}>{cards[0].difficulté}</Text></View>  : null}
                {cards[0].horizon     ? <View style={s.badge}><Text style={s.badgeText}>{cards[0].horizon}</Text></View>     : null}
              </View>
            </View>
          </View>
        )}

        {/* 3 priorités */}
        {top3.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Vos 3 priorites</Text>
            {top3.map((card, i) => (
              <View key={i} style={s.prioCard}>
                <Text style={[s.prioNum, { color: i === 0 ? BG : ACCENT }]}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.prioTitle}>{card.titre || card.action || ''}</Text>
                  <Text style={s.prioMeta}>
                    {[card.outil, card.tempsEstimé, card.difficulté].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Pour aller plus loin */}
        {secondaires.length > 0 && (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Pour aller plus loin</Text>
            {secondaires.map((card, i) => (
              <View key={i} style={s.secCard}>
                <View style={{ flex: 1 }}>
                  <Text style={s.secTitle}>{card.titre || card.action || ''}</Text>
                  <Text style={s.secMeta}>
                    {[card.outil, card.tempsEstimé, card.horizon].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Footer */}
        <View style={s.footer} fixed>
          <Text style={s.footerText}>relia@rebiyadigital.com · wa.me/33632407737</Text>
          <Text style={s.footerBeta}>Rapport offert pendant la beta</Text>
        </View>

      </Page>
    </Document>
  );
}
