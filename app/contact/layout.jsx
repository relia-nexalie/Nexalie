import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Contact — Nexalie',
  description: 'Contactez Rélia Ebiya, fondatrice de Nexalie. Par email ou WhatsApp, réponse sous 24h.',
  alternates: { canonical: `${SITE_URL}/contact` },
  openGraph: {
    title: 'Contact — Nexalie',
    description: 'Contactez Rélia Ebiya, fondatrice de Nexalie. Réponse sous 24h.',
    url: `${SITE_URL}/contact`,
  },
};

export default function ContactLayout({ children }) {
  return children;
}
