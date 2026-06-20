import dynamic from 'next/dynamic';

const AuditModule = dynamic(
  () => import('@/components/AuditModule'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F6F1' }}>
        <p style={{ textAlign: 'center', padding: '40px', color: '#4B5563', fontFamily: 'monospace', fontSize: '13px', letterSpacing: '1px' }}>
          Chargement de l&apos;audit...
        </p>
      </div>
    ),
  }
);

export const metadata = {
  title: 'Audit de Maturité Digitale — Nexalie',
  description: 'Évaluez votre niveau de digitalisation et sauvegardez vos résultats dans votre espace Nexalie.',
};

export default function PlatformAuditPage() {
  return <AuditModule isPlatform={true} />;
}
