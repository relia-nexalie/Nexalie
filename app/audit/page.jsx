import dynamic from 'next/dynamic';

const AuditModule = dynamic(
  () => import('@/components/AuditModule'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <p style={{ textAlign: 'center', padding: '40px', color: '#4B5563', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
          Chargement de l&apos;audit...
        </p>
      </div>
    ),
  }
);

import { SITE_URL } from '@/lib/site';

export const metadata = {
  title: 'Audit de Maturité Digitale Gratuit — Nexalie',
  description: 'Évaluez votre niveau digital en 3 minutes. Score sur 100, niveau de maturité, 5 recommandations IA personnalisées. Gratuit, sans engagement.',
  alternates: { canonical: `${SITE_URL}/audit` },
  openGraph: {
    title: 'Audit de Maturité Digitale Gratuit — Nexalie',
    description: 'Évaluez votre niveau digital en 3 minutes. Score sur 100, niveau de maturité, 5 recommandations IA personnalisées. Gratuit, sans engagement.',
    url: `${SITE_URL}/audit`,
  },
};

export default function AuditPage() {
  return <AuditModule isPlatform={false} />;
}
