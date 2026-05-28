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
    title: 'Digital en Côte d\'Ivoire : ce que j\'ai vu sur le terrain en 2026',
    excerpt: 'L\'État ivoirien investit 83 milliards FCFA dans le numérique. Mais dans les PME d\'Abidjan, la réalité est plus nuancée — et les opportunités sont réelles.',
    tags: ['Côte d\'Ivoire', 'Terrain', 'PME', 'Mobile Money'],
    content: `J'accompagne des PME ivoiriennes depuis 3 ans. En 2026, quelque chose a changé : les propriétaires de commerce ne me demandent plus si le digital est utile. Ils me demandent par où commencer.\n\nC'est un signal fort. La question n'est plus "faut-il y aller ?" mais "comment ne pas se planter en y allant ?"\n\n**Ce que j'ai vraiment vu à Abidjan**\n\nUn grossiste de Yopougon m'a appelé en janvier. Il perdait des clients face à un concurrent qui prenait les commandes sur WhatsApp Business et encaissait en Wave. Lui, il continuait avec les appels téléphoniques et les espèces. En 90 jours, on a mis en place WhatsApp Business + catalogue produits + Wave. Résultat : +31% de commandes sans un seul centime de publicité.\n\nCe n'est pas exceptionnel. C'est ce qui se passe quand on part du problème réel — et non d'une liste d'outils à installer.\n\n**Les 3 erreurs que je vois encore trop souvent**\n\nPremière erreur : acheter un logiciel avant de comprendre le processus. J'ai vu une PME dépenser 800 000 FCFA pour un ERP qu'elle n'a jamais su utiliser. Deuxième erreur : confier le digital à un stagiaire sans formation ni accompagnement. Le stagiaire part, les outils tombent. Troisième erreur : vouloir tout faire en même temps. WhatsApp + site web + publicité Facebook + CRM + newsletter — en 3 semaines. Ça ne tient pas.\n\n**Ce qui marche vraiment**\n\nUne action à la fois. Commencer par ce qui génère de l'argent dans les 30 premiers jours. Pour la plupart des PME abidjanaises, c'est : fiche Google My Business (gratuit, 30 min), WhatsApp Business avec catalogue (gratuit, 2h), acceptation Wave/Orange Money (0% de frais pour Wave). C'est tout. Le reste vient après.` },
  { id: 2, cat: 'Intelligence Artificielle', readTime: '5 min', date: '22 mars 2026', color: '#4EC9B0', emoji: '🤖',
    title: 'J\'ai utilisé l\'IA pendant 6 mois dans des PME françaises. Voici ce qui marche vraiment.',
    excerpt: 'Pas les cas d\'usage théoriques. Ce que des équipes de 5 à 50 personnes ont réellement adopté — et ce qui a été abandonné après 2 semaines.',
    tags: ['IA', 'PME France', 'Outils concrets', 'Retour terrain'],
    content: `Depuis septembre 2025, j'accompagne 12 PME françaises dans l'adoption de l'IA. Secteurs variés : une boulangerie artisanale de Lyon, un cabinet RH à Bordeaux, un e-commerce de prêt-à-porter à Paris, un bureau d'études BTP en région parisienne. Voici ce que j'ai observé — sans filtre.\n\n**Ce qui a été adopté et utilisé 6 mois plus tard**\n\nRédaction d'emails et de devis avec Claude ou ChatGPT : 9 PME sur 12 l'utilisent encore. Le gain est réel — entre 45 minutes et 2 heures par jour selon les équipes. Transcription et résumé de réunions avec Otter.ai ou Whisper : 7 sur 12. Les comptes-rendus de réunion, une corvée parmi les plus universellement détestées, disparaissent presque entièrement. Analyse de données clients avec des prompts bien conçus : 5 sur 12, mais ce sont les 5 qui ont eu le plus d'impact mesurable.\n\n**Ce qui a été abandonné**\n\nLes chatbots sur les sites web : 4 PME ont essayé, 4 ont abandonné en moins d'un mois. Les clients posaient des questions auxquelles le bot ne savait pas répondre, et ça créait plus de frustration que d'aide. La génération automatique de posts réseaux sociaux : le contenu était trop générique. Les équipes l'ont utilisé 2-3 semaines, puis ont repris la main.\n\n**La vraie question à se poser**\n\nQuelle tâche répétitive te coûte le plus de temps chaque semaine ? C'est par là qu'il faut commencer. Pas par "comment intégrer l'IA dans notre stratégie globale". Une tâche. Un outil. Deux semaines de test. Si ça marche, on garde. Sinon, on passe à la suivante.` },
  { id: 3, cat: 'Méthodologie', readTime: '4 min', date: '15 mars 2026', color: '#C9A84C', emoji: '📋',
    title: 'L\'audit digital que j\'aurais voulu faire avant de dépenser 15 000€ inutilement',
    excerpt: 'J\'ai accompagné une PME qui avait investi 15 000€ dans un CRM jamais utilisé. Voici ce qu\'un bon diagnostic aurait évité.',
    tags: ['Audit', 'Diagnostic', 'CRM', 'ROI'],
    content: `Janvier 2025. Une PME de services à la personne en Île-de-France. 23 employés, 8 ans d'activité, CA stable à 1,4 M€. La direction avait investi 15 000€ dans Salesforce 18 mois plus tôt. Au moment où je suis arrivé, 2 personnes l'utilisaient — partiellement.\n\nLe reste de l'équipe continuait sur des fichiers Excel partagés en interne. Les commerciaux avaient trouvé Salesforce "trop compliqué". La formation initiale avait duré 1 journée. Résultat : 15 000€ dormaient sur une licence inutilisée.\n\n**Ce qu'un diagnostic de 2 heures aurait révélé**\n\nEn faisant l'audit après coup, on a identifié 4 choses que personne n'avait vérifiées avant l'achat. Un : les commerciaux n'avaient aucune habitude de saisir des données — même dans Excel. Deux : le vrai problème n'était pas le CRM, c'était que personne ne savait qui avait appelé quel client la semaine dernière. Trois : HubSpot CRM gratuit aurait résolu 80% du problème. Quatre : la formation d'1 journée était 4 fois trop courte pour une équipe sans culture digitale.\n\n**Comment un audit évite ça**\n\nUn audit de maturité digitale bien fait n'est pas un questionnaire à cocher. C'est une radiographie de comment une organisation fonctionne vraiment — pas comment elle devrait fonctionner. On y trouve systématiquement 3 types de problèmes : les outils achetés mais pas utilisés, les processus qui se font "dans les têtes" sans documentation, et les données dispersées dans 4 endroits différents.\n\nCe diagnostic prend 20 minutes. Il vaut plusieurs milliers d'euros d'investissement évité.` },
  { id: 4, cat: 'Outils', readTime: '5 min', date: '8 mars 2026', color: '#7B5EA7', emoji: '🛠️',
    title: 'La stack digitale d\'une PME française à 129€/mois — et ce qu\'elle remplace',
    excerpt: 'Notion, HubSpot, Make, Brevo. 4 outils. 129€/mois. Ce que ça remplace concrètement — et combien ça faisait avant.',
    tags: ['Outils SaaS', 'No-code', 'France', 'Budget PME'],
    content: `Je travaille avec des PME de 5 à 50 personnes. La question que j'entends le plus souvent : "on a un petit budget — quels outils on prend en premier ?"\n\nVoici la stack que j'ai installée chez 8 PME françaises différentes depuis 2024. Elle coûte 129€/mois en moyenne et remplace des processus qui consommaient entre 8 et 15 heures de travail par semaine.\n\n**Les 4 outils de la stack**\n\nNotion (8€/mois/utilisateur, 3 utilisateurs = 24€) : remplace les fichiers Word éparpillés, les emails "pour info", et les réunions "pour qu'on soit tous alignés". Tout ce qui concerne les processus, les procédures, les projets, les comptes-rendus vit dans Notion. HubSpot CRM (gratuit jusqu'à 1 000 contacts) : remplace le fichier Excel clients. Suivi des relances, historique des échanges, pipeline commercial visible. Pas besoin des fonctions payantes pour commencer. Brevo (gratuit jusqu'à 300 emails/jour) : remplace les emails manuels de relance, de bienvenue, de suivi. On automatise la séquence post-devis dès le premier mois — ça seul fait gagner 3h/semaine. Make (9$/mois) : relie les 3 autres. Quand un nouveau contact entre dans HubSpot, il reçoit automatiquement un email Brevo. Quand une tâche est créée dans Notion, une notification part sur Slack ou WhatsApp.\n\n**Ce que ça remplace**\n\nAvant cette stack, une PME typique payait : un secrétariat externalisé à 600€/mois pour des tâches administratives, un prestataire emailing à 200€/mois, et des réunions de coordination à 4 personnes 2 fois par semaine (soit environ 6h de travail à 50€/h = 1 200€/mois). Total avant : 2 000€+/mois. Total après : 129€/mois + 8h récupérées.` },
  { id: 5, cat: 'Mobile Money', readTime: '4 min', date: '1 mars 2026', color: '#27AE60', emoji: '📱',
    title: 'Wave vs Orange Money vs MTN MoMo : lequel choisir pour votre PME africaine ?',
    excerpt: 'Frais, intégration, couverture réseau, limites de transaction. Le comparatif terrain que personne ne fait vraiment.',
    tags: ['Mobile Money', 'Wave', 'Orange Money', 'MTN', 'Paiements'],
    content: `En 2026, accepter le Mobile Money n'est plus optionnel pour une PME en Afrique de l'Ouest. C'est souvent le premier outil digital concret que j'installe avec mes clients. Mais lequel choisir — et comment ?\n\nJ'ai accompagné des PME au Sénégal, en Côte d'Ivoire, au Cameroun et au Congo. Voici ce que j'ai observé dans la pratique.\n\n**Wave : le choix pour les petites transactions fréquentes**\n\nWave applique 0% de frais pour les paiements marchands depuis 2023. C'est son argument massue. Pour un restaurant ou un commerce de détail qui encaisse 50 à 200 transactions par jour à moins de 10 000 FCFA chacune, Wave est imbattable. Limite : 500 000 FCFA par transaction, et Wave n'est disponible qu'au Sénégal, en Côte d'Ivoire, en Guinée, au Mali et au Burkina. Pas au Cameroun, pas au Congo.\n\n**Orange Money : le réseau le plus large**\n\nOrange Money couvre 17 pays africains. Si vos clients sont dans des zones où Wave n'est pas disponible, Orange Money est souvent la seule option sérieuse. Les frais varient : entre 1% et 2% selon les pays et les montants. Pour un prestataire de services qui facture des montants élevés (500 000 à 5 M FCFA), les frais s'accumulent vite.\n\n**MTN MoMo : incontournable au Cameroun et en Afrique centrale**\n\nAu Cameroun, MTN MoMo détient environ 60% du marché Mobile Money. Vous n'avez pas le choix. L'intégration API de MTN est plus technique que celle de Wave, mais des partenaires comme Notchpay ou CinetPay simplifient l'intégration pour les PME.\n\n**La recommandation terrain**\n\nPour une PME en CI ou au Sénégal : commencez par Wave pour les frais à 0%, ajoutez Orange Money pour couvrir les clients qui n'ont pas Wave. Pour le Cameroun : MTN MoMo obligatoire, Orange Money en complément. Pour plusieurs pays : utilisez un agrégateur comme CinetPay (1,5% en moyenne) qui gère tous les opérateurs en un seul contrat.` },
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
  const cats = ['Tous', 'Stratégie', 'Intelligence Artificielle', 'Méthodologie', 'Outils', 'Mobile Money'];
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
