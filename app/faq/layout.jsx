import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'FAQ — Nexalie',
  description: 'Toutes vos questions sur Nexalie : le diagnostic numérique, la confidentialité, le plan d\'action, le mode bêta et la prise en main.',
  alternates: { canonical: `${SITE_URL}/faq` },
  openGraph: {
    title: 'FAQ — Nexalie',
    description: 'Toutes vos questions sur le diagnostic numérique Nexalie.',
    url: `${SITE_URL}/faq`,
  },
};

export default function FaqLayout({ children }) {
  return children;
}
