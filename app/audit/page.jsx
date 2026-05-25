import dynamic from 'next/dynamic';

const AuditModule = dynamic(
  () => import('@/components/AuditModule'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <p style={{ textAlign: 'center', padding: '40px', color: '#6B7A94', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
          Chargement de l&apos;audit...
        </p>
      </div>
    ),
  }
);

export const metadata = {
  title: 'Audit de Maturité Digitale Gratuit — Nexalie',
  description: 'Évaluez votre niveau digital en 3 minutes. Score sur 100, niveau de maturité, 5 recommandations IA personnalisées. Gratuit, sans engagement.',
  alternates: { canonical: 'https://nexalie-ecqc.vercel.app/audit' },
};

export default function AuditPage() {
  return <AuditModule isPlatform={false} />;
}
