import AuditModule from '@/components/AuditModule';

export const metadata = {
  title: 'Audit de Maturité Digitale Gratuit — Nexalie',
  description: 'Évaluez votre niveau digital en 3 minutes. Score sur 100, niveau de maturité, 5 recommandations IA personnalisées. Gratuit, sans engagement.',
  alternates: { canonical: 'https://nexalie.co/audit' },
};

export default function AuditPage() {
  return <AuditModule isPlatform={false} />;
}
