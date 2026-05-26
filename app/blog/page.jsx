'use client';

import { useState } from 'react';
import { useMode } from '@/lib/mode-context';

const PALETTE = {
  fr: {
    pageBg: '#FFFFFF', sectionBg: '#F8FAFC', navyBg: '#0A1628',
    textPrimary: '#0A1628', textSecondary: '#6B7A94', textOnNavy: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.5)', accent: '#2E9B8B', gold: '#C9A84C',
    border: 'rgba(0,0,0,0.07)', btnPrimary: '#0A1628', btnAccent: '#2E9B8B',
  },
  af: {
    pageBg: '#FFFFFF', sectionBg: '#FFF8F4', navyBg: '#1A0800',
    textPrimary: '#1A0800', textSecondary: '#7A6B62', textOnNavy: '#FFFFFF',
    textMuted: 'rgba(255,255,255,0.5)', accent: '#C45E0A', gold: '#F5C842',
    border: 'rgba(0,0,0,0.07)', btnPrimary: '#1A0800', btnAccent: '#C45E0A',
  },
};

function Badge({ label, color, filled = false }) {
  return <span style={{ display: 'inline-block', padding: '3px 10px', background: filled ? color : `${color}12`, color: filled ? '#fff' : color, borderRadius: '20px', fontSize: '10px', fontWeight: 700, fontFamily: 'monospace' }}>{label}</span>;
}

const ARTICLES = [
  { id: 1, cat: 'Stratégie', readTime: '6 min', date: '28 mars 2026', color: '#C45E0A', emoji: '🎯',
    title: 'Transformation digitale en Côte d\'Ivoire : pourquoi 2026 est l\'année décisive',
    excerpt: 'L\'État ivoirien a engagé 2 000 milliards FCFA dans le numérique. Les PME qui ne basculent pas maintenant prendront un retard difficile à rattraper.',
    tags: ['Côte d\'Ivoire', 'Digital', 'PME', 'IA'],
    content: `La Côte d'Ivoire vit un tournant numérique sans précédent. En 2026, le budget du Ministère du Numérique atteint 83,2 milliards FCFA — en hausse de 12% par rapport à l'année précédente. La Banque Mondiale a accordé un financement de 83,3 milliards FCFA spécifiquement pour accélérer l'économie numérique.\n\nPour les PME ivoiriennes, ce contexte crée une opportunité rare. Les entreprises qui digitalisent maintenant bénéficient d'un marché en forte croissance, d'une concurrence encore faible sur le digital, et d'outils IA accessibles comme jamais auparavant.\n\n**Ce que ça veut dire concrètement pour une PME abidjanaise**\n\nUne étude récente montre que les PME qui ont une présence digitale sérieuse génèrent en moyenne 34% de revenus supplémentaires par rapport à celles qui en sont absentes. Sur le marché abidjanais, ce chiffre monte à 48% dans les secteurs services et commerce.\n\n**Les 3 actions prioritaires pour une PME en 2026**\n\nPremièrement, avoir un site web professionnel mobile-first. 78% du trafic internet en CI vient du mobile. Deuxièmement, utiliser l'IA pour accélérer la production de contenu. Troisièmement, mettre en place un système de suivi des indicateurs clés.` },
  { id: 2, cat: 'Intelligence Artificielle', readTime: '5 min', date: '22 mars 2026', color: '#4EC9B0', emoji: '🤖',
    title: 'Les agents IA vont transformer la gestion des PME africaines',
    excerpt: 'Un agent IA qui scrape votre marché, génère votre stratégie et publie vos contenus automatiquement. Ce n\'est plus de la science-fiction.',
    tags: ['Agents IA', 'Automatisation', 'PME'],
    content: `Les agents IA représentent une rupture majeure dans la façon dont les entreprises opèrent. Contrairement aux outils IA classiques qui répondent à des questions, les agents agissent : ils naviguent sur internet, analysent des données en temps réel, exécutent des tâches et surveillent des indicateurs.\n\nPour une PME africaine, les implications sont considérables. Des tâches qui nécessitaient un prestataire externe — analyse concurrentielle, création de contenu, suivi des KPIs — peuvent maintenant être déléguées à des agents qui travaillent 24h/24.\n\n**Exemple concret : un restaurant à Abidjan**\n\nUn restaurant client de Nexalie a mis en place 3 agents. Résultat en 3 mois : +23% de réservations en ligne, -60% de temps consacré à la communication digitale.\n\n**Ce qui change avec les agents**\n\nLa différence fondamentale est le passage du conseil à l'action. Les consultants traditionnels recommandent. Les agents exécutent.` },
  { id: 3, cat: 'Méthodologie', readTime: '4 min', date: '15 mars 2026', color: '#C9A84C', emoji: '📋',
    title: 'Pourquoi l\'audit digital est la première étape de toute transformation réussie',
    excerpt: 'Trop d\'entreprises investissent dans le digital sans diagnostic préalable. Résultat : des budgets gaspillés sur des outils inadaptés.',
    tags: ['Audit', 'Méthodologie', 'Diagnostic'],
    content: `L'erreur la plus commune dans la transformation digitale des PME est de commencer par les outils plutôt que par le diagnostic. On achète un CRM sans savoir si on en a vraiment besoin. On refait son site sans comprendre pourquoi l'ancien ne convertissait pas.\n\nL'audit de maturité digitale résout ce problème. En 20 minutes, il donne une photographie précise de la situation sur 5 dimensions.\n\n**Ce qu'on découvre avec un audit**\n\nDans 80% des cas, les entreprises surestiment leur maturité digitale d'au moins 15 points sur 100. L'audit révèle souvent des angles morts surprenants.\n\n**L'audit comme point de départ du plan d'action**\n\nUn bon audit ne se contente pas de donner un score. Il génère un plan d'action priorisé, avec les 3 actions qui auront le plus d'impact rapide.` },
];

function ArticleView({ article, onBack, T }) {
  return (
    <div style={{ background: T.pageBg, minHeight: '100vh' }}>
      <div style={{ background: T.navyBg, padding: '48px 40px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: T.textMuted, fontSize: '13px', cursor: 'pointer', marginBottom: '20px' }}>← Retour au blog</button>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
            <Badge label={article.cat} color={article.color} filled />
            <span style={{ fontSize: '12px', color: T.textMuted }}>{article.readTime} · {article.date}</span>
          </div>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(22px,3.5vw,34px)', fontWeight: 200, color: '#fff', lineHeight: 1.3, marginBottom: '14px' }}>{article.title}</h1>
          <p style={{ fontSize: '15px', color: T.textMuted, lineHeight: 1.8 }}>{article.excerpt}</p>
        </div>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '48px 40px' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg,${article.color}40,transparent)`, marginBottom: '36px' }} />
        {article.content.split('\n\n').map((para, i) => {
          if (para.startsWith('**') && para.endsWith('**'))
            return <h3 key={i} style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: T.textPrimary, margin: '28px 0 10px' }}>{para.replace(/\*\*/g, '')}</h3>;
          return <p key={i} style={{ fontSize: '15px', color: T.textSecondary, lineHeight: 1.9, marginBottom: '18px' }}>{para.replace(/\*\*/g, '')}</p>;
        })}
        <div style={{ display: 'flex', gap: '8px', marginTop: '36px', paddingTop: '20px', borderTop: `1px solid ${T.border}` }}>
          {article.tags.map(t => <Badge key={t} label={t} color={article.color} />)}
        </div>
        <div style={{ marginTop: '36px', padding: '28px', background: T.navyBg, borderRadius: '14px', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Georgia, serif', fontSize: '18px', fontWeight: 200, color: '#fff', marginBottom: '8px' }}>Prêt à commencer votre transformation ?</p>
          <p style={{ fontSize: '13px', color: T.textMuted, marginBottom: '16px' }}>Audit gratuit en 20 minutes · Rapport IA personnalisé</p>
          <a href="/" style={{ display: 'inline-block', padding: '12px 24px', background: T.btnAccent, borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}>Faire mon audit gratuit →</a>
        </div>
      </div>
    </div>
  );
}

export default function BlogPage() {
  const { mode, setMode, isAfrica } = useMode();
  const T = isAfrica ? PALETTE.af : PALETTE.fr;

  const [article, setArticle] = useState(null);
  const [filter, setFilter] = useState('Tous');
  const cats = ['Tous', 'Stratégie', 'Intelligence Artificielle', 'Méthodologie'];
  const filtered = filter === 'Tous' ? ARTICLES : ARTICLES.filter(a => a.cat === filter);

  if (article) return <ArticleView article={article} onBack={() => setArticle(null)} T={T} />;

  return (
    <div style={{ background: T.pageBg, minHeight: '100vh', fontFamily: 'sans-serif' }}>

      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15`, position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <a href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent }}>AI</span>
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Toggle FR / AF */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', overflow: 'hidden' }}>
              {[['fr', '🇫🇷'], ['af', '🌍']].map(([m, flag]) => (
                <button key={m} onClick={() => setMode(m)}
                  style={{ padding: '5px 10px', border: 'none', cursor: 'pointer', fontSize: '13px', background: mode === m ? T.accent : 'transparent', color: '#fff', transition: 'all 0.2s', fontWeight: mode === m ? 700 : 400 }}>
                  {flag}
                </button>
              ))}
            </div>
            <a href="/" style={{ fontSize: '13px', color: T.textMuted, textDecoration: 'none' }}>← Retour</a>
          </div>
        </div>
      </nav>

      <div style={{ background: T.navyBg, padding: '60px 40px' }}>
        <div style={{ height: '2px', background: `linear-gradient(90deg,${T.gold}40,transparent)`, marginBottom: '28px' }} />
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textMuted, marginBottom: '10px' }}>RESSOURCES & INSIGHTS</p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(26px,4vw,40px)', fontWeight: 200, color: '#fff', marginBottom: '10px' }}>
            Le blog <em style={{ color: T.accent, fontStyle: 'normal' }}>Nexalie</em>
          </h1>
          <p style={{ fontSize: '15px', color: T.textMuted }}>Transformation digitale · IA & Automatisation · PME africaines et françaises</p>
        </div>
      </div>

      <div style={{ background: '#fff', padding: '16px 40px', borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 60, zIndex: 10 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', gap: '8px' }}>
          {cats.map(c => (
            <button key={c} onClick={() => setFilter(c)}
              style={{ padding: '7px 16px', border: 'none', borderRadius: '20px', background: filter === c ? T.navyBg : T.sectionBg, color: filter === c ? '#fff' : T.textSecondary, fontSize: '13px', fontWeight: filter === c ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px' }}>
        {filtered[0] && (
          <div onClick={() => setArticle(filtered[0])}
            style={{ padding: '36px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '20px', cursor: 'pointer', marginBottom: '24px', borderTop: `4px solid ${filtered[0].color}`, display: 'grid', gridTemplateColumns: '1fr 200px', gap: '32px', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <Badge label={filtered[0].cat} color={filtered[0].color} />
                <span style={{ fontSize: '12px', color: T.textSecondary }}>{filtered[0].readTime} · {filtered[0].date}</span>
              </div>
              <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 300, color: T.textPrimary, lineHeight: 1.4, marginBottom: '10px' }}>{filtered[0].title}</h2>
              <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.7, marginBottom: '14px' }}>{filtered[0].excerpt}</p>
              <span style={{ fontSize: '13px', fontWeight: 600, color: filtered[0].color }}>Lire l'article →</span>
            </div>
            <div style={{ width: '200px', height: '160px', background: filtered[0].color, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: '56px' }}>{filtered[0].emoji}</span>
            </div>
          </div>
        )}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '14px' }}>
          {filtered.slice(1).map(a => (
            <div key={a.id} onClick={() => setArticle(a)}
              style={{ padding: '24px', background: '#fff', border: `1px solid ${T.border}`, borderRadius: '16px', cursor: 'pointer', borderLeft: `3px solid ${a.color}` }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                <Badge label={a.cat} color={a.color} />
                <span style={{ fontSize: '11px', color: T.textSecondary }}>{a.readTime}</span>
              </div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '17px', fontWeight: 300, color: T.textPrimary, lineHeight: 1.4, marginBottom: '8px' }}>{a.title}</h3>
              <p style={{ fontSize: '13px', color: T.textSecondary, lineHeight: 1.6, marginBottom: '12px' }}>{a.excerpt}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: T.textSecondary }}>{a.date}</span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: a.color }}>Lire →</span>
              </div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: '48px', padding: '40px', background: T.navyBg, borderRadius: '20px', textAlign: 'center' }}>
          <h3 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 200, color: '#fff', marginBottom: '8px' }}>Recevez les prochains articles</h3>
          <p style={{ fontSize: '14px', color: T.textMuted, marginBottom: '20px' }}>Transformation digitale · IA · Afrique — chaque semaine</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '400px', margin: '0 auto' }}>
            <input placeholder="votre@email.com" style={{ flex: 1, padding: '12px 16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#fff', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '12px 20px', background: T.btnAccent, border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>Je m'inscris →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
