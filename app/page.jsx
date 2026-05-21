import NexaliSite from '@/components/NexaliSite';

export const metadata = {
  title: 'Nexalie — Transformation Digitale IA · France & Afrique',
  description: 'Faites votre audit de maturité digitale gratuit en 3 minutes. Obtenez votre Roadmap IA personnalisée. Pour PME françaises et entreprises africaines.',
  alternates: { canonical: 'https://nexalie.co' },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Nexalie',
  applicationCategory: 'BusinessApplication',
  url: 'https://nexalie.co',
  description: 'Plateforme SaaS d\'audit de maturité digitale et de transformation numérique pour PME françaises et entreprises africaines.',
  offers: [
    { '@type': 'Offer', name: 'Gratuit', price: '0', priceCurrency: 'EUR' },
    { '@type': 'Offer', name: 'Pro', price: '129', priceCurrency: 'EUR' },
  ],
  creator: {
    '@type': 'Person',
    name: 'Rélia Ebiya',
    jobTitle: 'Fondatrice',
    url: 'https://nexalie.co/about',
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
