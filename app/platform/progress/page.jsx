import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProgressClient from './ProgressClient';

export const metadata = { title: 'Progression — Nexalie' };

const PLANS_ALLOWED = ['pro', 'institutions'];

export default async function ProgressPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/platform/progress');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, mode, secteur, market')
    .eq('id', user.id)
    .single();

  const plan = profile?.plan || 'free';
  const isAdmin = user.email === 'relia.ebiya@gmail.com';

  if (!isAdmin && !PLANS_ALLOWED.includes(plan)) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '40px 24px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        background: '#F8FAFC', textAlign: 'center',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>📈</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 300, color: '#0A1628', marginBottom: '12px' }}>
          Suivi de progression
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7A94', maxWidth: '480px', lineHeight: 1.7, marginBottom: '32px' }}>
          Visualisez l'évolution de votre score d'audit dans le temps et comparez-vous aux leaders de votre secteur.
          Disponible à partir du plan <strong>Pro</strong>.
        </p>
        <a href="/pricing" style={{ display: 'inline-block', padding: '14px 40px', background: '#4EC9B0', color: '#fff', borderRadius: '10px', textDecoration: 'none', fontWeight: 700, fontSize: '15px', marginBottom: '16px' }}>
          Passer au plan Pro →
        </a>
        <a href="/platform" style={{ fontSize: '13px', color: '#6B7A94', textDecoration: 'none' }}>
          ← Retour à la plateforme
        </a>
      </div>
    );
  }

  // Récupérer les audits pour le graphique
  const { data: audits } = await supabase
    .from('audits')
    .select('score, niveau, secteur, created_at, mode')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })
    .limit(24);

  // Récupérer les benchmarks du secteur
  const secteur = profile?.secteur || audits?.[0]?.secteur;
  const market = profile?.market || 'fr';
  let benchmarks = null;
  if (secteur) {
    const { data: bm } = await supabase
      .from('benchmarks')
      .select('*')
      .eq('secteur', secteur.toLowerCase().replace(/[^a-z]/g, ''))
      .eq('market', market)
      .single();
    benchmarks = bm;
  }

  return (
    <ProgressClient
      audits={audits || []}
      benchmarks={benchmarks}
      userMode={profile?.mode || 'fr'}
      userSecteur={secteur}
    />
  );
}
