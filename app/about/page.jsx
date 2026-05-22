import AboutClient from './AboutClient';

export const metadata = {
  title: 'À propos — Nexalie',
  description: 'Rélia Ebiya, fondatrice de Nexalie — transformation digitale pour PME françaises et entreprises africaines.',
  alternates: { canonical: 'https://nexalie-ecqc.vercel.app/about' },
  openGraph: {
    title: 'Rélia Ebiya — Fondatrice Nexalie',
    description: 'Franco-congolaise. 10 ans chez Safran et Alcatel. Elle a construit Nexalie pour démocratiser la transformation digitale.',
    url: 'https://nexalie-ecqc.vercel.app/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
