import AuditModule from '@/components/AuditModule';

export const metadata = {
  title: 'Audit de Maturité Digitale — Nexalie',
  description: 'Évaluez votre niveau de digitalisation et sauvegardez vos résultats dans votre espace Nexalie.',
};

export default function PlatformAuditPage() {
  return <AuditModule isPlatform={true} />;
}
