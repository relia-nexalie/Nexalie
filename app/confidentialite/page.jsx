export const metadata = {
  title: 'Politique de confidentialité — Nexalie',
  description: 'Politique de confidentialité de Nexalie, conforme à la loi congolaise n° 29-2019 portant protection des données à caractère personnel.',
};

export default function ConfidentialitePage() {
  const navy = '#0F2A4A';
  const gold = '#C9A84C';

  const sections = [
    {
      title: '1. Responsable du traitement',
      body: `Nexalie, plateforme éditée par Rélia Ebiya, est responsable du traitement des données à caractère personnel collectées via le site nexalie.com et ses sous-domaines.\n\nContact : contact@nexalie.com`,
    },
    {
      title: '2. Données collectées',
      body: `Nexalie collecte les données suivantes :\n\n— Adresse email (lors de l'inscription à la liste d'attente ou au module d'audit)\n— Score de maturité digitale (résultat du questionnaire d'audit)\n— Source d'inscription (audit, nexalie-watch, etc.)\n— Données de navigation agrégées (via Google Analytics 4, anonymisées)\n\nAucune donnée sensible (données biométriques, opinions politiques, données de santé) n'est collectée.`,
    },
    {
      title: '3. Finalités du traitement',
      body: `Les données collectées sont utilisées pour :\n\n— Vous envoyer votre rapport personnalisé d'audit de maturité digitale\n— Vous notifier lors de l'ouverture de l'accès à Nexalie Watch ou à la plateforme\n— Améliorer les fonctionnalités et le contenu de la plateforme (données agrégées)\n— Produire des statistiques anonymisées à destination de partenaires institutionnels`,
    },
    {
      title: '4. Base légale',
      body: `Le traitement de vos données est fondé sur :\n\n— Votre consentement explicite (case à cocher ou soumission du formulaire)\n— L'intérêt légitime de Nexalie pour l'amélioration de ses services\n\nConformément à la loi congolaise n° 29-2019 portant protection des données à caractère personnel, vous pouvez retirer votre consentement à tout moment.`,
    },
    {
      title: '5. Durée de conservation',
      body: `Vos données sont conservées :\n\n— 3 ans à compter de la dernière interaction pour les leads et inscrits à la liste d'attente\n— 13 mois pour les données de navigation (Google Analytics)\n\nPassé ce délai, vos données sont supprimées ou anonymisées.`,
    },
    {
      title: '6. Destinataires des données',
      body: `Vos données sont accessibles uniquement à Nexalie et à ses sous-traitants techniques :\n\n— Supabase (hébergement base de données — serveurs UE)\n— Vercel (hébergement du site — serveurs UE)\n— Google Analytics (mesure d'audience — données anonymisées)\n\nVos données ne sont pas vendues ni cédées à des tiers.`,
    },
    {
      title: '7. Vos droits',
      body: `Conformément à la loi n° 29-2019, vous disposez des droits suivants :\n\n— Droit d'accès à vos données\n— Droit de rectification\n— Droit à l'effacement ("droit à l'oubli")\n— Droit à la limitation du traitement\n— Droit d'opposition\n\nPour exercer vos droits, écrivez à : contact@nexalie.com\nNous nous engageons à répondre dans un délai de 30 jours.`,
    },
    {
      title: '8. Sécurité',
      body: `Nexalie met en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, altération, divulgation ou destruction :\n\n— Connexion HTTPS (TLS 1.3)\n— Accès base de données restreint par Row Level Security (Supabase)\n— Aucun mot de passe stocké en clair\n— Journalisation des accès administrateurs`,
    },
    {
      title: '9. Cookies',
      body: `Nexalie utilise des cookies strictement nécessaires au fonctionnement du site (session, préférences de langue) et des cookies analytiques anonymisés (Google Analytics 4).\n\nVous pouvez refuser les cookies analytiques sans impact sur votre utilisation du site.`,
    },
    {
      title: '10. Modifications',
      body: `Nexalie se réserve le droit de modifier cette politique à tout moment. En cas de modification substantielle, vous serez informé(e) par email ou via une bannière sur le site.\n\nDernière mise à jour : mai 2026`,
    },
  ];

  return (
    <main style={{ background: '#fff', fontFamily: 'var(--font-jakarta, sans-serif)' }}>
      <section style={{ padding: '72px 24px 80px' }}>
        <div style={{ maxWidth: '720px', margin: '0 auto' }}>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <div style={{ width: '3px', height: '20px', background: gold, borderRadius: '2px' }} />
            <p style={{ fontFamily: 'var(--font-mono, monospace)', fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: gold, margin: 0 }}>
              Loi n° 29-2019 · République du Congo
            </p>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 300, color: navy, marginBottom: '16px', letterSpacing: '-0.02em' }}>
            Politique de confidentialité
          </h1>
          <p style={{ fontSize: '14px', color: '#64748B', lineHeight: 1.7, marginBottom: '56px' }}>
            La protection de vos données personnelles est une priorité pour Nexalie. Cette politique décrit comment nous collectons, utilisons et protégeons vos informations, conformément à la loi congolaise n° 29-2019 portant protection des données à caractère personnel.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {sections.map((s) => (
              <div key={s.title}>
                <h2 style={{ fontFamily: 'var(--font-display, system-ui, sans-serif)', fontSize: '18px', fontWeight: 400, color: navy, marginBottom: '14px' }}>{s.title}</h2>
                <div style={{ fontSize: '14px', color: '#475569', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{s.body}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '64px', padding: '24px', background: '#F5F3EE', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <p style={{ fontSize: '13px', color: '#64748B', lineHeight: 1.7 }}>
              Pour toute question relative à la protection de vos données ou pour exercer vos droits, contactez-nous à{' '}
              <a href="mailto:contact@nexalie.com" style={{ color: navy, fontWeight: 600 }}>contact@nexalie.com</a>.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
