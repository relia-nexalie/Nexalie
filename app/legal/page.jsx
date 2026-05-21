import Link from 'next/link';

export const metadata = {
  title: 'CGV & Mentions légales — Nexalie',
  description: 'Conditions générales de vente, mentions légales et politique de confidentialité de Nexalie.',
};

const T = {
  pageBg: '#FFFFFF', sectionBg: '#F8FAFC', navyBg: '#0A1628',
  textPrimary: '#0A1628', textSecondary: '#6B7A94', textOnNavy: '#FFFFFF',
  textMuted: 'rgba(255,255,255,0.5)', accent: '#2E9B8B', gold: '#C9A84C',
  border: 'rgba(0,0,0,0.07)',
};

function Section({ id, title, children }) {
  return (
    <div id={id} style={{ marginBottom: '48px' }}>
      <h2 style={{ fontFamily: 'Georgia, serif', fontSize: '22px', fontWeight: 300, color: T.textPrimary, marginBottom: '16px', paddingBottom: '12px', borderBottom: `1px solid ${T.border}` }}>{title}</h2>
      {children}
    </div>
  );
}

function P({ children }) {
  return <p style={{ fontSize: '14px', color: T.textSecondary, lineHeight: 1.9, marginBottom: '12px' }}>{children}</p>;
}

export default function LegalPage() {
  return (
    <div style={{ background: T.pageBg, fontFamily: 'sans-serif', minHeight: '100vh' }}>

      <nav style={{ background: T.navyBg, padding: '0 40px', borderBottom: `1px solid ${T.gold}15` }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontFamily: 'Georgia, serif', fontSize: '20px', fontWeight: 300, color: '#fff' }}>Nexalie</span>
            <span style={{ fontFamily: 'monospace', fontSize: '9px', letterSpacing: '2.5px', color: T.accent }}>AI</span>
          </Link>
          <Link href="/" style={{ fontSize: '13px', color: T.textMuted, textDecoration: 'none' }}>← Retour</Link>
        </div>
      </nav>

      <div style={{ maxWidth: '860px', margin: '0 auto', padding: '60px 40px' }}>
        <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '3px', color: T.textSecondary, marginBottom: '10px' }}>DOCUMENTS LÉGAUX</p>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: '32px', fontWeight: 200, color: T.textPrimary, marginBottom: '8px' }}>CGV & Mentions légales</h1>
        <p style={{ fontSize: '13px', color: T.textSecondary, marginBottom: '48px' }}>Dernière mise à jour : avril 2026</p>

        {/* Sommaire */}
        <div style={{ padding: '24px', background: T.sectionBg, border: `1px solid ${T.border}`, borderRadius: '12px', marginBottom: '48px' }}>
          <p style={{ fontFamily: 'monospace', fontSize: '10px', letterSpacing: '2px', color: T.textSecondary, marginBottom: '12px' }}>SOMMAIRE</p>
          {[['#mentions', 'Mentions légales'], ['#cgv', 'Conditions générales de vente'], ['#privacy', 'Politique de confidentialité'], ['#cookies', 'Cookies']].map(([href, label]) => (
            <a key={href} href={href} style={{ display: 'block', fontSize: '14px', color: T.accent, textDecoration: 'none', marginBottom: '6px' }}>→ {label}</a>
          ))}
        </div>

        <Section id="mentions" title="Mentions légales">
          <P><strong>Éditeur :</strong> Nexalie Consulting — Relia Ebiya</P>
          <P><strong>Contact :</strong> relia.ebiya@nexalie.co — +33 7 86 62 04 09</P>
          <P><strong>Hébergement :</strong> Vercel Inc., 340 Pine Street, Suite 1200, San Francisco, CA 94104, États-Unis</P>
          <P><strong>Directrice de la publication :</strong> Relia Ebiya</P>
        </Section>

        <Section id="cgv" title="Conditions générales de vente">
          <P><strong>Article 1 — Objet.</strong> Les présentes CGV régissent les relations contractuelles entre Nexalie Consulting (ci-après "Nexalie") et tout utilisateur souscrivant à un abonnement payant sur la plateforme nexalie.co.</P>
          <P><strong>Article 2 — Prix.</strong> Les prix sont affichés TTC pour la France et HTVA pour les pays africains. Nexalie se réserve le droit de modifier ses tarifs, avec information préalable de 30 jours. Les abonnements en cours sont maintenus au tarif souscrit jusqu'à leur renouvellement.</P>
          <P><strong>Article 3 — Abonnements.</strong> Les abonnements sont mensuels ou annuels, renouvelés automatiquement. L'abonné peut résilier à tout moment depuis son espace client. La résiliation prend effet à la fin de la période en cours.</P>
          <P><strong>Article 4 — Droit de rétractation.</strong> Conformément à la législation française, l'abonné bénéficie d'un délai de rétractation de 14 jours à compter de la souscription, sauf si l'accès aux services a été ouvert avec son accord exprès.</P>
          <P><strong>Article 5 — Responsabilité.</strong> Les rapports et recommandations générés par les outils IA Nexalie ont une valeur indicative. Ils ne constituent pas un conseil professionnel engageant Nexalie. L'utilisateur reste seul responsable de ses décisions d'investissement et stratégiques.</P>
          <P><strong>Article 6 — Droit applicable.</strong> Les présentes CGV sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents du ressort de Paris.</P>
        </Section>

        <Section id="privacy" title="Politique de confidentialité">
          <P><strong>Données collectées :</strong> nom, email, marché (France/Afrique), historique des rapports générés, données de paiement (gérées par Stripe — Nexalie ne conserve pas les données de carte bancaire).</P>
          <P><strong>Finalité :</strong> exécution des services souscrits, envoi des rapports, support client, amélioration de la plateforme.</P>
          <P><strong>Conservation :</strong> les données sont conservées pendant la durée de l'abonnement + 3 ans.</P>
          <P><strong>Droits RGPD :</strong> conformément au RGPD, vous disposez d'un droit d'accès, de rectification, d'effacement et de portabilité. Pour exercer ces droits : relia.ebiya@nexalie.co</P>
          <P><strong>Sous-traitants :</strong> Supabase (hébergement données), Stripe (paiement), Resend (emails transactionnels), Anthropic (génération IA — les prompts ne sont pas utilisés pour entraîner les modèles).</P>
        </Section>

        <Section id="cookies" title="Cookies">
          <P>Nexalie utilise des cookies strictement nécessaires au fonctionnement de l'authentification (session Supabase) et des cookies analytiques (Google Analytics 4) pour mesurer l'audience de manière anonymisée.</P>
          <P>Aucun cookie publicitaire n'est déposé sans votre consentement explicite.</P>
        </Section>
      </div>
    </div>
  );
}
