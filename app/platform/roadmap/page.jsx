import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RoadmapBuilder from '@/components/RoadmapBuilder';

export const metadata = { title: 'Roadmap Builder — Nexalie' };

const PLANS_ALLOWED = ['pro', 'institutions'];

export default async function RoadmapPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login?redirect=/platform/roadmap');

  const { data: profile } = await supabase
    .from('profiles')
    .select('plan, mode, secteur, organisation')
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
        <div style={{ fontSize: '48px', marginBottom: '20px' }}>🗺️</div>
        <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(24px,4vw,40px)', fontWeight: 300, color: '#0A1628', marginBottom: '12px' }}>
          Roadmap Builder
        </h1>
        <p style={{ fontSize: '16px', color: '#6B7A94', maxWidth: '480px', lineHeight: 1.7, marginBottom: '32px' }}>
          L'IA génère ta feuille de route sur-mesure en quelques secondes.
          Disponible à partir du plan <strong>Pro</strong>.
        </p>
        <div style={{ background: '#fff', border: '2px solid rgba(0,0,0,0.08)', borderRadius: '14px', padding: '24px', maxWidth: '360px', marginBottom: '28px' }}>
          <p style={{ fontSize: '13px', color: '#6B7A94', marginBottom: '12px' }}>Ton plan actuel</p>
          <p style={{ fontWeight: 800, fontSize: '20px', color: '#0A1628', textTransform: 'capitalize' }}>{plan}</p>
        </div>
        <a
          href="/pricing"
          style={{
            display: 'inline-block', padding: '14px 40px', background: '#4EC9B0',
            color: '#fff', borderRadius: '10px', textDecoration: 'none',
            fontWeight: 700, fontSize: '15px',
          }}
        >
          Passer au plan Pro →
        </a>
        <a href="/platform" style={{ display: 'block', marginTop: '16px', fontSize: '13px', color: '#6B7A94', textDecoration: 'none' }}>
          ← Retour à la plateforme
        </a>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <RoadmapBuilder
        userId={user.id}
        userPlan={plan}
        userMode={profile?.mode || 'fr'}
        userSecteur={profile?.secteur}
        userOrganisation={profile?.organisation}
      />
    </div>
  );
}
