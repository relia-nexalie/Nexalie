import AboutClient from './AboutClient';

export const metadata = {
  title: 'À propos — Nexalie',
  description: 'Rélia Ebiya, fondatrice de Nexalie — transformation digitale pour PME françaises et entreprises africaines.',
  alternates: { canonical: 'https://nexalie.co/about' },
  openGraph: {
    title: 'Rélia Ebiya — Fondatrice Nexalie',
    description: 'Née à Brazzaville, formée en France. Nexalie, le pont entre deux mondes digitaux.',
    url: 'https://nexalie.co/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
