import NexaliSite from '@/components/NexaliSite';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Nexalie — Transformation Digitale IA · France & Afrique',
  description: 'Faites votre audit de maturité digitale gratuit en 3 minutes. Obtenez votre Roadmap IA personnalisée. Pour PME françaises et entreprises africaines.',
  alternates: { canonical: SITE_URL },
  openGraph: {
    url: SITE_URL,
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nexalie',
  applicationCategory: 'BusinessApplication',
  url: SITE_URL,
  description: 'Plateforme SaaS d\'audit de maturité digitale et de transformation numérique pour PME françaises et entreprises africaines.',
  offers: [
    { '@type': 'Offer', name: 'Gratuit', price: '0', priceCurrency: 'EUR' },
    { '@type': 'Offer', name: 'Pro', price: '129', priceCurrency: 'EUR' },
  ],
  creator: {
    '@type': 'Person',
    name: 'Rélia Ebiya',
    jobTitle: 'Fondatrice',
    url: `${SITE_URL}/about`,
  },
  operatingSystem: 'Web',
  inLanguage: 'fr',
  audience: {
    '@type': 'BusinessAudience',
    name: 'PME France & Afrique francophone',
  },
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <NexaliSite />
    </>
  );
}
