import AboutClient from './AboutClient';
import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'À propos — Nexalie',
  description: 'Rélia Ebiya, fondatrice de Nexalie — transformation digitale pour PME françaises et entreprises africaines.',
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: 'Rélia Ebiya — Fondatrice Nexalie',
    description: 'Franco-congolaise. 10 ans chez Safran et Alcatel. Elle a construit Nexalie pour démocratiser la transformation digitale.',
    url: `${SITE_URL}/about`,
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
