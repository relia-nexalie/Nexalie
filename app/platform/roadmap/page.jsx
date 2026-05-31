import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import RoadmapBuilder from '@/components/RoadmapBuilder';

export const metadata = { title: 'Roadmap Builder — Nexalie' };

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
